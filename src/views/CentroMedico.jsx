import { useState, useMemo } from "react";
import {
  obtenerRegistrosMedicos,
  guardarRegistroMedicoStorage,
  darAltaMedicaStorage,
  eliminarRegistroMedicoStorage,
  restablecerRegistrosMedicosStorage,
} from "../data/medicoData";
import { obtenerPlantel } from "../data/plantelData";
import RegistroMedicoForm from "../components/RegistroMedicoForm";

const TIPOS_FILTRO = [
  "Todos",
  "Muscular",
  "Articular",
  "Ósea",
  "Sobrecarga",
  "Ligamentosa",
];

const ESTADOS_FILTRO = ["Todos", "Baja Activa", "En Reintegro", "Alta Médica"];

// Insignias visuales de gravedad
const estiloGravedad = (gravedad) => {
  switch (gravedad) {
    case "Leve":
      return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
    case "Moderada":
      return "border-amber-500/40 text-amber-400 bg-amber-500/10";
    case "Grave":
      return "border-red-500/40 text-red-400 bg-red-500/10";
    default:
      return "border-neutral-500/40 text-neutral-400 bg-neutral-500/10";
  }
};

// Insignias visuales de estado clinico
const estiloEstado = (estado) => {
  switch (estado) {
    case "Baja Activa":
      return "text-red-400 border-red-500/40 bg-red-500/10";
    case "En Reintegro":
      return "text-amber-400 border-amber-500/40 bg-amber-500/10";
    case "Alta Médica":
      return "text-emerald-400 border-emerald-500/40 bg-emerald-500/10";
    default:
      return "text-neutral-400 border-neutral-500/40 bg-neutral-500/10";
  }
};

const CentroMedico = () => {
  // Lista de registros medicos y del plantel
  const [registros, setRegistros] = useState(obtenerRegistrosMedicos);
  const plantel = useMemo(() => obtenerPlantel(), []);

  // Estados de busqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [tipoFiltro, setTipoFiltro] = useState("Todos");
  const [estadoFiltro, setEstadoFiltro] = useState("Todos");

  // Estado del modal de formulario
  const [modalAbierto, setModalAbierto] = useState(false);
  const [registroEnEdicion, setRegistroEnEdicion] = useState(null);

  // Estado para confirmacion inline de eliminacion
  const [confirmandoId, setConfirmandoId] = useState(null);

  // Mensaje inline de feedback
  const [mensajeExito, setMensajeExito] = useState("");

  const mostrarMensaje = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => {
      setMensajeExito("");
    }, 3500);
  };

  // Abrir modal para crear
  const handleAbrirCrear = () => {
    setRegistroEnEdicion(null);
    setModalAbierto(true);
  };

  // Abrir modal para editar
  const handleAbrirEditar = (reg) => {
    setRegistroEnEdicion(reg);
    setModalAbierto(true);
  };

  // Guardar (crear o actualizar)
  const handleGuardarRegistro = (regData) => {
    const actualizado = guardarRegistroMedicoStorage(regData);
    setRegistros(actualizado);
    setModalAbierto(false);
    setRegistroEnEdicion(null);
    mostrarMensaje(
      regData.id
        ? `Ficha médica de ${regData.jugadorNombre} actualizada correctamente.`
        : `Nuevo registro clínico ingresado para ${regData.jugadorNombre}.`
    );
  };

  // Dar alta medica con feedback inline
  const handleDarAlta = (id) => {
    const reg = registros.find((r) => r.id === id);
    const actualizado = darAltaMedicaStorage(id);
    setRegistros(actualizado);
    mostrarMensaje(
      `Alta médica otorgada a ${
        reg ? reg.jugadorNombre : "futbolista"
      }. Habilitado para reintegro competitivo.`
    );
  };

  // Eliminar registro confirmado inline
  const handleEliminar = (id) => {
    const reg = registros.find((r) => r.id === id);
    const actualizado = eliminarRegistroMedicoStorage(id);
    setRegistros(actualizado);
    setConfirmandoId(null);
    mostrarMensaje(
      `Ficha clínica de ${
        reg ? reg.jugadorNombre : "futbolista"
      } archivada correctamente.`
    );
  };

  // Restablecer demo
  const handleRestablecer = () => {
    const inicial = restablecerRegistrosMedicosStorage();
    setRegistros(inicial);
    mostrarMensaje("Registros clínicos restablecidos a los valores de prueba.");
  };

  // Filtrado dinamico
  const registrosFiltrados = useMemo(() => {
    return registros.filter((r) => {
      const coincideTipo =
        tipoFiltro === "Todos" || r.tipoLesion === tipoFiltro;
      const coincideEstado =
        estadoFiltro === "Todos" || r.estado === estadoFiltro;

      const texto = busqueda.trim().toLowerCase();
      const coincideTexto =
        !texto ||
        r.jugadorNombre.toLowerCase().includes(texto) ||
        r.diagnostico.toLowerCase().includes(texto) ||
        r.tipoLesion.toLowerCase().includes(texto) ||
        r.medicoTratante.toLowerCase().includes(texto);

      return coincideTipo && coincideEstado && coincideTexto;
    });
  }, [registros, busqueda, tipoFiltro, estadoFiltro]);

  // Metricas globales del area medica
  const totalBajasActivas = registros.filter(
    (r) => r.estado === "Baja Activa"
  ).length;
  const enReintegro = registros.filter(
    (r) => r.estado === "En Reintegro"
  ).length;
  const altasMedicas = registros.filter(
    (r) => r.estado === "Alta Médica"
  ).length;

  return (
    <div className="space-y-8 relative">
      {/* Cabecera principal minimalista */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-block w-1.5 h-1.5 bg-white"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
              CC Analytics // Área Médica y Kinesiología
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-neutral-300 border border-white/15 px-2 py-0.5 bg-white/[0.03]">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-none">
            Centro Médico
          </h1>
          <p className="text-neutral-400 text-xs font-medium mt-2">
            Control de lesiones, tratamientos kinésicos y altas médicas
          </p>
        </div>

        {/* Acciones superiores */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestablecer}
            className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2.5 bg-white/2 transition-colors cursor-pointer"
            title="Restablecer registros médicos de prueba"
          >
            Restablecer Demo
          </button>
          <button
            type="button"
            onClick={handleAbrirCrear}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs uppercase font-black tracking-widest px-4 py-2.5 transition-colors cursor-pointer"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Nuevo Registro Médico</span>
          </button>
        </div>
      </header>

      {/* Banner de feedback inline */}
      {mensajeExito && (
        <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 flex items-center justify-between text-xs text-emerald-400 font-semibold animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 bg-emerald-500 rounded-full inline-block shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span>{mensajeExito}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeExito("")}
            className="text-emerald-500 hover:text-emerald-300 text-[10px] uppercase font-bold tracking-widest cursor-pointer"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* Tarjetas de estado cuantitativo del departamento medico */}
      <section
        aria-labelledby="metricas-medicas"
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        <h2 id="metricas-medicas" className="sr-only">
          Métricas cuantitativas del centro médico
        </h2>
        <div className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Bajas Activas
          </span>
          <p className="text-3xl font-black text-red-400 font-mono leading-none">
            {totalBajasActivas}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-1 block">
            En tratamiento o reposo
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            En Reintegro Deportivo
          </span>
          <p className="text-3xl font-black text-amber-400 font-mono leading-none">
            {enReintegro}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-1 block">
            Trabajos físicos con balón
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Altas Médicas Concedidas
          </span>
          <p className="text-3xl font-black text-emerald-400 font-mono leading-none">
            {altasMedicas}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-1 block">
            Habilitados para competir
          </span>
        </div>
      </section>

      {/* Barra de control: Buscador y Filtros */}
      <div className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 space-y-4">
        {/* Buscador de texto */}
        <div className="relative">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por futbolista, diagnóstico clínico o médico tratante..."
            className="w-full bg-white/2 border border-white/10 px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/30 transition-colors"
          />
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white text-xs font-bold cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtros por Categoria y Estado */}
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 pt-2 border-t border-white/5">
          {/* Tipo de lesion */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mr-1">
              Tipo:
            </span>
            {TIPOS_FILTRO.map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTipoFiltro(t)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  tipoFiltro === t
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white bg-white/5 border border-white/10"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Estado clinico */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mr-1">
              Estado:
            </span>
            {ESTADOS_FILTRO.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEstadoFiltro(e)}
                className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  estadoFiltro === e
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white bg-white/5 border border-white/10"
                }`}
              >
                {e}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Lista de Fichas Clinicas */}
      {registrosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {registrosFiltrados.map((item) => (
            <article
              key={item.id}
              className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-6 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group space-y-4"
            >
              <div>
                {/* Cabecera con datos del futbolista y badges */}
                <div className="flex items-start justify-between gap-3 border-b border-white/5 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-black text-xl text-white border border-white/10 bg-white/5 w-10 h-10 flex items-center justify-center shrink-0">
                      #{item.dorsal}
                    </span>
                    <div>
                      <h3 className="text-base font-black uppercase tracking-wider text-white leading-tight">
                        {item.jugadorNombre}
                      </h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                        {item.posicion}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloGravedad(
                        item.gravedad
                      )}`}
                    >
                      {item.gravedad}
                    </span>
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloEstado(
                        item.estado
                      )}`}
                    >
                      {item.estado}
                    </span>
                  </div>
                </div>

                {/* Detalle diagnostico */}
                <div className="pt-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 border border-white/10 px-1.5 py-0.5 bg-white/2">
                      {item.tipoLesion}
                    </span>
                    <span className="text-xs text-neutral-500 font-mono">
                      Ingreso: {item.fechaIngreso}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white uppercase tracking-wide leading-snug">
                    {item.diagnostico}
                  </h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                    {item.observaciones}
                  </p>
                </div>

                {/* Barra de progreso / Dias de recuperacion */}
                <div className="pt-3 border-t border-white/5 mt-3 space-y-1.5">
                  <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest">
                    <span className="text-neutral-500">
                      Fase:{" "}
                      <strong className="text-neutral-300">{item.fase}</strong>
                    </span>
                    <span className="font-mono text-white">
                      {item.estado === "Alta Médica"
                        ? "0 días restantes"
                        : `${item.diasRestantes} días restantes (${item.diasRecuperacion} est.)`}
                    </span>
                  </div>

                  <div className="w-full bg-white/5 h-1.5 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-500 ${
                        item.estado === "Alta Médica"
                          ? "bg-emerald-500 w-full"
                          : item.estado === "En Reintegro"
                          ? "bg-amber-400 w-3/4"
                          : "bg-red-500 w-1/3"
                      }`}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Zona de acciones y confirmacion inline */}
              <div className="pt-3 border-t border-white/5">
                {confirmandoId === item.id ? (
                  <div className="bg-red-500/10 border border-red-500/30 p-2.5 space-y-2 animate-fade-in">
                    <p className="text-[10px] uppercase font-bold tracking-wider text-red-400">
                      ¿Confirmar archivo de ficha médica de {item.jugadorNombre}?
                    </p>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleEliminar(item.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 transition-colors cursor-pointer"
                      >
                        Sí, Archivar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoId(null)}
                        className="flex-1 bg-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-wider py-1.5 border border-white/10 transition-colors cursor-pointer"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2">
                    <span className="text-[10px] text-neutral-600 uppercase font-mono truncate">
                      {item.medicoTratante}
                    </span>

                    <div className="flex items-center gap-2 self-end sm:self-auto">
                      {item.estado !== "Alta Médica" && (
                        <button
                          type="button"
                          onClick={() => handleDarAlta(item.id)}
                          className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 hover:text-black hover:bg-emerald-400 px-2.5 py-1 border border-emerald-500/40 transition-colors cursor-pointer"
                        >
                          Dar Alta Médica
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleAbrirEditar(item)}
                        className="text-[10px] uppercase font-bold tracking-wider text-neutral-300 hover:text-white px-2.5 py-1 border border-white/10 hover:border-white/30 bg-white/2 transition-colors cursor-pointer"
                      >
                        Editar
                      </button>
                      <button
                        type="button"
                        onClick={() => setConfirmandoId(item.id)}
                        className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-red-400 px-2.5 py-1 border border-white/10 hover:border-red-500/40 bg-white/2 transition-colors cursor-pointer"
                      >
                        Archivar
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#0a0a0a]/50 p-12 text-center space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            No se encontraron registros médicos para los filtros seleccionados
          </p>
          <p className="text-xs text-neutral-600">
            Prueba ajustando el texto de búsqueda o restableciendo los filtros
            de categoría y estado.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setTipoFiltro("Todos");
              setEstadoFiltro("Todos");
            }}
            className="text-[10px] uppercase font-bold tracking-widest text-white border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer mt-2"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* Modal con el formulario controlado */}
      {modalAbierto && (
        <RegistroMedicoForm
          registro={registroEnEdicion}
          plantel={plantel}
          onGuardar={handleGuardarRegistro}
          onCancelar={() => {
            setModalAbierto(false);
            setRegistroEnEdicion(null);
          }}
        />
      )}

      {/* Pie de pagina */}
      <footer className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 gap-2">
        <p>
          CC Analytics — Plataforma Oficial // Departamento Médico
        </p>
        <p>Fichas clínicas y seguimiento médico del plantel profesional</p>
      </footer>
    </div>
  );
};

export default CentroMedico;

