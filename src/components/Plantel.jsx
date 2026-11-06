import { useState, useMemo } from "react";
import {
  obtenerPlantel,
  guardarJugadorStorage,
  eliminarJugadorStorage,
  restablecerPlantelStorage,
} from "../data/plantelData";
import JugadorCard from "./JugadorCard";
import JugadorForm from "./JugadorForm";

const POSICIONES_FILTRO = [
  "Todos",
  "Arquero",
  "Defensa",
  "Mediocampista",
  "Delantero",
];

const Plantel = () => {
  // lista de jugadores con persistencia en localStorage
  const [plantel, setPlantel] = useState(obtenerPlantel);

  // estados de busqueda y filtros
  const [busqueda, setBusqueda] = useState("");
  const [posicionFiltro, setPosicionFiltro] = useState("Todos");

  // estado del modal de creacion / edicion
  const [modalAbierto, setModalAbierto] = useState(false);
  const [jugadorEnEdicion, setJugadorEnEdicion] = useState(null);

  // mensaje inline de feedback (sin alert ni popups)
  const [mensajeExito, setMensajeExito] = useState("");

  const mostrarMensaje = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => {
      setMensajeExito("");
    }, 3500);
  };

  // apertura de modal para creacion
  const handleAbrirCrear = () => {
    setJugadorEnEdicion(null);
    setModalAbierto(true);
  };

  // apertura de modal para edicion
  const handleAbrirEditar = (jugador) => {
    setJugadorEnEdicion(jugador);
    setModalAbierto(true);
  };

  // guardar (crear o actualizar)
  const handleGuardarJugador = (jugadorData) => {
    const actualizado = guardarJugadorStorage(jugadorData);
    setPlantel(actualizado);
    setModalAbierto(false);
    setJugadorEnEdicion(null);
    mostrarMensaje(
      jugadorData.id
        ? `Ficha de ${jugadorData.nombre} actualizada correctamente.`
        : `Jugador ${jugadorData.nombre} incorporado al plantel.`
    );
  };

  // eliminar (confirmado inline sin confirm())
  const handleEliminarJugador = (id) => {
    const jugadorEliminado = plantel.find((j) => j.id === id);
    const actualizado = eliminarJugadorStorage(id);
    setPlantel(actualizado);
    mostrarMensaje(
      `El jugador ${
        jugadorEliminado ? jugadorEliminado.nombre : ""
      } fue dado de baja del plantel.`
    );
  };

  // restablecer valores de prueba
  const handleRestablecer = () => {
    const inicial = restablecerPlantelStorage();
    setPlantel(inicial);
    mostrarMensaje("Plantel restablecido con los datos iniciales de prueba.");
  };

  // filtrado de jugadores
  const jugadoresFiltrados = useMemo(() => {
    return plantel.filter((j) => {
      const coincidePosicion =
        posicionFiltro === "Todos" || j.posicion === posicionFiltro;

      const texto = busqueda.trim().toLowerCase();
      const coincideTexto =
        !texto ||
        j.nombre.toLowerCase().includes(texto) ||
        String(j.dorsal).includes(texto) ||
        j.posicion.toLowerCase().includes(texto);

      return coincidePosicion && coincideTexto;
    });
  }, [plantel, busqueda, posicionFiltro]);

  // metricas resumidas
  const totalJugadores = plantel.length;
  const disponibles = plantel.filter((j) => j.estado === "Disponible").length;
  const enRecuperacion = plantel.filter(
    (j) => j.estado === "En recuperación"
  ).length;

  return (
    <div className="space-y-8 relative">
      {/* auras de luz ambiental azul electrico / cian para la gestion de plantel */}
      <div className="absolute -top-10 right-20 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(14,165,233,0.053),transparent_70%)] pointer-events-none -z-10"></div>
      <div className="absolute top-64 left-10 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(6,182,212,0.038),transparent_70%)] pointer-events-none -z-10"></div>
      {/* cabecera principal */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-block w-2.5 h-2.5 bg-sky-400 rounded-full shadow-[0_0_12px_rgba(56,189,248,0.9)] animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
              CC Analytics // Gestión Deportiva
            </span>
            <span className="text-neutral-700 text-xs hidden sm:inline">•</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border border-white/10 px-2 py-0.5 bg-white/2">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-white leading-none">
            Catálogo del Plantel
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Control de Jugadores, Fichas Técnicas y Estado del Equipo
          </p>
        </div>

        {/* accion principal: anadir jugador */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestablecer}
            className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3 py-2.5 bg-white/2 transition-colors cursor-pointer"
            title="Restablecer a los 15 futbolistas por defecto"
          >
            Restablecer Demo
          </button>
          <button
            type="button"
            onClick={handleAbrirCrear}
            className="flex items-center gap-2 bg-white text-black hover:bg-neutral-200 text-xs uppercase font-black tracking-widest px-4 py-2.5 transition-colors cursor-pointer"
          >
            <span className="text-base leading-none font-black">+</span>
            <span>Nuevo Jugador</span>
          </button>
        </div>
      </header>

      {/* banner de feedback inline */}
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

      {/* tarjetas de estado cuantitativo del plantel */}
      <section aria-labelledby="metricas-plantel" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <h2 id="metricas-plantel" className="sr-only">
          Resumen cuantitativo del plantel
        </h2>
        <div className="border border-white/10 bg-[#0a0a0a]/80 p-4 relative overflow-hidden group hover:border-white/30 transition-all">

          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Total en Plantel
          </span>
          <p className="text-3xl font-black text-white font-mono leading-none">
            {totalJugadores}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-1 block">
            Futbolistas inscritos
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-4 relative overflow-hidden group hover:border-white/30 transition-all">

          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Aptos para Competir
          </span>
          <p className="text-3xl font-black text-emerald-400 font-mono leading-none">
            {disponibles}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-1 block">
            100% condición física
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-4 relative overflow-hidden group hover:border-white/30 transition-all">

          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block mb-1">
            Área Médica
          </span>
          <p className="text-3xl font-black text-amber-400 font-mono leading-none">
            {enRecuperacion}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-1 block">
            En rehabilitación / bajas
          </span>
        </div>
      </section>

      {/* barra de control: Buscador y Filtro por posicion */}
      <div className="border border-white/10 bg-[#0a0a0a]/80 p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* buscador de texto */}
        <div className="relative flex-1">
          <input
            type="text"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar por nombre, dorsal o posición..."
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

        {/* botones de filtro por posicion */}
        <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/10 overflow-x-auto">
          {POSICIONES_FILTRO.map((pos) => (
            <button
              key={pos}
              type="button"
              onClick={() => setPosicionFiltro(pos)}
              className={`px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer whitespace-nowrap ${
                posicionFiltro === pos
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* grid del catalogo de jugadores */}
      {jugadoresFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {jugadoresFiltrados.map((jugador) => (
            <JugadorCard
              key={jugador.id}
              jugador={jugador}
              onEditar={handleAbrirEditar}
              onEliminar={handleEliminarJugador}
            />
          ))}
        </div>
      ) : (
        <div className="border border-white/10 bg-[#0a0a0a]/50 p-12 text-center space-y-3">
          <p className="text-sm font-bold uppercase tracking-wider text-neutral-400">
            No se encontraron jugadores que coincidan con la búsqueda
          </p>
          <p className="text-xs text-neutral-600">
            Prueba ajustando el texto o seleccionando otra posición táctica.
          </p>
          <button
            type="button"
            onClick={() => {
              setBusqueda("");
              setPosicionFiltro("Todos");
            }}
            className="text-[10px] uppercase font-bold tracking-widest text-white border border-white/20 px-3 py-1.5 hover:bg-white hover:text-black transition-colors cursor-pointer mt-2"
          >
            Limpiar Filtros
          </button>
        </div>
      )}

      {/* modal con el formulario controlado */}
      {modalAbierto && (
        <JugadorForm
          jugador={jugadorEnEdicion}
          plantelActual={plantel}
          onGuardar={handleGuardarJugador}
          onCancelar={() => {
            setModalAbierto(false);
            setJugadorEnEdicion(null);
          }}
        />
      )}

      {/* pie de pagina academico */}
      <footer className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 gap-2">
        <p>
          CC Analytics — Plataforma Académica Duoc UC // Desarrollo Fullstack II
        </p>
        <p>Persistencia local activa para control de plantel</p>
      </footer>
    </div>
  );
};

export default Plantel;
