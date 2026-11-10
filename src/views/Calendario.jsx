import { useState, useMemo, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { Link } from "react-router-dom";
import {
  ESCUDO_COLO_COLO,
  resolverEscudoRival,
  obtenerPartidos,
  guardarNuevoPartido,
  eliminarPartido,
} from "../data/calendarioData";

const Calendario = () => {
  // estado de partidos cargados desde localstorage o datos iniciales
  const [partidos, setPartidos] = useState(() => obtenerPartidos());

  // pestana activa: "proximos" | "anteriores" | "todos"
  const [pestanaActiva, setPestanaActiva] = useState("proximos");

  // filtros
  const [filtroTorneo, setFiltroTorneo] = useState("todos");
  const [filtroCondicion, setFiltroCondicion] = useState("todos");
  const [busquedaRival, setBusquedaRival] = useState("");

  // partido seleccionado para ver ficha tecnica detallada
  const [partidoDetalleId, setPartidoDetalleId] = useState(null);

  // estado de confirmacion inline para eliminacion
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

  // modal para programar nuevo partido
  const [modalNuevoPartido, setModalNuevoPartido] = useState(false);
  const [formNuevo, setFormNuevo] = useState({
    rival: "",
    siglaRival: "",
    torneo: "Campeonato Nacional",
    condicion: "Local",
    fecha: "",
    hora: "",
    estadio: "Estadio Monumental David Arellano",
    arbitro: "",
    relevancia: "",
  });
  const [erroresForm, setErroresForm] = useState({});
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  // un solo timer: un mensaje nuevo cancela el borrado del anterior
  const timerMensajeRef = useRef(null);

  const mostrarMensaje = (texto) => {
    setMensajeFeedback(texto);
    if (timerMensajeRef.current) clearTimeout(timerMensajeRef.current);
    timerMensajeRef.current = setTimeout(() => {
      setMensajeFeedback("");
    }, 3500);
  };

  // limpia el timer al salir de la vista
  useEffect(() => {
    return () => {
      if (timerMensajeRef.current) clearTimeout(timerMensajeRef.current);
    };
  }, []);

  // partido mas proximo en el tiempo
  const siguientePartido = useMemo(() => {
    return partidos.find((p) => p.tipo === "proximo");
  }, [partidos]);

  // escudo del rival del proximo partido, se resuelve una sola vez
  const escudoRivalSiguiente = siguientePartido
    ? resolverEscudoRival(siguientePartido)
    : null;

  // lista de partidos filtrados
  const partidosFiltrados = useMemo(() => {
    return partidos.filter((partido) => {
      // filtro por tipo / pestana
      if (pestanaActiva === "proximos" && partido.tipo !== "proximo") return false;
      if (pestanaActiva === "anteriores" && partido.tipo !== "anterior") return false;

      // filtro por torneo
      if (filtroTorneo !== "todos" && partido.torneo !== filtroTorneo) return false;

      // filtro por localia
      if (filtroCondicion !== "todos" && partido.condicion !== filtroCondicion) return false;

      // busqueda por texto (rival o estadio)
      if (busquedaRival.trim()) {
        const query = busquedaRival.toLowerCase();
        const coincideRival = partido.rival.toLowerCase().includes(query);
        const coincideEstadio = partido.estadio.toLowerCase().includes(query);
        if (!coincideRival && !coincideEstadio) return false;
      }

      return true;
    });
  }, [partidos, pestanaActiva, filtroTorneo, filtroCondicion, busquedaRival]);

  // contadores para las pestanas
  const contadorProximos = useMemo(
    () => partidos.filter((p) => p.tipo === "proximo").length,
    [partidos]
  );
  const contadorAnteriores = useMemo(
    () => partidos.filter((p) => p.tipo === "anterior").length,
    [partidos]
  );

  // validacion javascript propia para programar nuevo partido
  const validarFormularioNuevo = () => {
    const nuevosErrores = {};

    if (!formNuevo.rival.trim()) {
      nuevosErrores.rival = "Debes ingresar el nombre del club rival.";
    } else if (formNuevo.rival.trim().length < 3) {
      nuevosErrores.rival = "El nombre del rival debe tener al menos 3 caracteres.";
    }

    if (!formNuevo.fecha.trim()) {
      nuevosErrores.fecha = "Debes seleccionar la fecha del partido.";
    }

    if (!formNuevo.hora.trim()) {
      nuevosErrores.hora = "Debes ingresar la hora de inicio.";
    }

    if (!formNuevo.estadio.trim()) {
      nuevosErrores.estadio = "Debes especificar el estadio del encuentro.";
    }

    setErroresForm(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // crear nuevo partido (crud: create)
  const handleGuardarNuevoPartido = (e) => {
    e.preventDefault();

    if (!validarFormularioNuevo()) {
      return;
    }

    const nuevo = {
      id: `part-custom-${Date.now()}`,
      tipo: "proximo",
      rival: formNuevo.rival.trim(),
      siglaRival:
        formNuevo.siglaRival.trim().toUpperCase() ||
        formNuevo.rival.trim().slice(0, 3).toUpperCase(),
      rivalEscudo: null,
      rivalEscudoColor: "#64748b",
      condicion: formNuevo.condicion,
      torneo: formNuevo.torneo,
      fecha: formNuevo.fecha,
      hora: formNuevo.hora,
      estadio: formNuevo.estadio.trim(),
      ciudad: formNuevo.condicion === "Local" ? "Santiago" : "Por definir",
      estado: "Programado",
      arbitro: formNuevo.arbitro.trim() || "Por designar",
      jornada: "Amistoso / Oficial",
      clima: "Despejado",
      relevancia: formNuevo.relevancia.trim() || "Encuentro programado en fixture",
    };

    guardarNuevoPartido(nuevo);
    setPartidos(obtenerPartidos());
    setModalNuevoPartido(false);
    setFormNuevo({
      rival: "",
      siglaRival: "",
      torneo: "Campeonato Nacional",
      condicion: "Local",
      fecha: "",
      hora: "",
      estadio: "Estadio Monumental David Arellano",
      arbitro: "",
      relevancia: "",
    });
    setErroresForm({});
    mostrarMensaje(`Partido contra ${nuevo.rival} programado exitosamente en el calendario.`);
  };

  // eliminar partido (crud: delete)
  const handleConfirmarEliminar = (id, rival) => {
    eliminarPartido(id);
    setPartidos(obtenerPartidos());
    setConfirmarEliminarId(null);
    if (partidoDetalleId === id) setPartidoDetalleId(null);
    mostrarMensaje(`Partido contra ${rival} eliminado del calendario.`);
  };

  // bloquear scroll y tecla escape para modal de programar partido
  useEffect(() => {
    if (!modalNuevoPartido) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalNuevoPartido(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalNuevoPartido]);

  return (
    <div className="space-y-8 relative">
      {/* cabecera principal minimalista */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-block w-1.5 h-1.5 bg-white"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
              CC Analytics // Fixture y Competiciones
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-neutral-300 border border-white/15 px-2 py-0.5 bg-white/[0.03]">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-none">
            Calendario de Partidos
          </h1>
          <p className="text-neutral-400 text-xs font-medium mt-2">
            Programación oficial, resultados y resumen de encuentros
          </p>
        </div>

        {/* boton de accion para programar nuevo partido */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setModalNuevoPartido(true)}
            className="text-[10px] uppercase font-extrabold tracking-wider text-black bg-white hover:bg-neutral-200 px-4 py-2.5 transition-colors cursor-pointer"
          >
            + Programar Partido
          </button>
        </div>
      </header>

      {/* mensaje de feedback */}
      {mensajeFeedback && (
        <div className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 p-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between animate-fade-in">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>{mensajeFeedback}</span>
          </div>
          <button
            type="button"
            onClick={() => setMensajeFeedback("")}
            className="text-neutral-400 hover:text-white text-sm ml-4 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* tarjeta destacada de gran tamano: proximo desafio oficial */}
      {siguientePartido && (pestanaActiva === "proximos" || pestanaActiva === "todos") && (
        <section
          aria-labelledby="titulo-proximo-desafio"
          className="border border-white/10 bg-[#0a0a0a]/90 p-6 sm:p-8 lg:p-10 relative overflow-hidden shadow-2xl transition-all duration-300 animate-fade-in-up stagger-1"
        >




          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8 flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
              <h2
                id="titulo-proximo-desafio"
                className="text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-white"
              >
                Próximo Encuentro Oficial // {siguientePartido.torneo}
              </h2>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-3 py-1">
              {siguientePartido.jornada}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* enfrentamiento central ampliado con logos oficiales garantizados */}
            <div className="lg:col-span-8 flex items-center justify-between sm:justify-around gap-4 bg-white/[0.02] border border-white/5 p-6 sm:p-8">
              {/* club local: colo-colo */}
              <div className="flex flex-col items-center gap-3 text-center flex-1 min-w-0">
                <div className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-white/10 bg-white/5 flex items-center justify-center p-3 sm:p-4 shadow-xl">
                  <img
                    src={ESCUDO_COLO_COLO}
                    alt="Colo-Colo"
                    width="80"
                    height="80"
                    decoding="async"
                    className="w-full h-full object-contain drop-shadow"
                  />
                </div>
                <div>
                  <p className="text-base sm:text-lg md:text-xl font-black uppercase text-white tracking-wider truncate">
                    Colo-Colo
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5 block">
                    {siguientePartido.condicion === "Local" ? "Local" : "Visitante"}
                  </span>
                </div>
              </div>

              {/* vs y horario principal */}
              <div className="text-center px-4 shrink-0">
                <span className="text-xs sm:text-sm font-black text-neutral-500 uppercase tracking-widest block mb-1">
                  VS
                </span>
                <span className="text-2xl sm:text-3xl md:text-5xl font-black text-white block tracking-wider font-mono my-2">
                  {siguientePartido.hora} HRS
                </span>
                <span className="inline-block text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 font-mono tracking-wider">
                  {siguientePartido.fecha}
                </span>
              </div>

              {/* club rival con logo oficial garantizado (ej: cduc) */}
              <div className="flex flex-col items-center gap-3 text-center flex-1 min-w-0">
                <div
                  style={{ borderColor: siguientePartido.rivalEscudoColor }}
                  className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 border border-white/10 bg-white/5 flex items-center justify-center p-3 sm:p-4 shadow-xl"
                >
                  {escudoRivalSiguiente ? (
                    <img
                      src={escudoRivalSiguiente}
                      alt={siguientePartido.rival}
                      width="80"
                      height="80"
                      decoding="async"
                      className="w-full h-full object-contain drop-shadow"
                    />
                  ) : (
                    <span className="text-2xl sm:text-3xl font-black text-white">
                      {siguientePartido.siglaRival}
                    </span>
                  )}
                </div>
                <div>
                  <p className="text-base sm:text-lg md:text-xl font-black uppercase text-white tracking-wider truncate">
                    {siguientePartido.rival}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-0.5 block">
                    {siguientePartido.condicion === "Local" ? "Visitante" : "Local"}
                  </span>
                </div>
              </div>
            </div>

            {/* informacion tecnica del estadio, arbitro y acceso tactico */}
            <div className="lg:col-span-4 space-y-4 text-xs">
              <div className="space-y-1.5 border-b border-white/5 pb-3">
                <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider block">
                  Estadio y Ubicación
                </span>
                <p className="font-bold text-white text-sm sm:text-base">{siguientePartido.estadio}</p>
                <p className="text-neutral-400 text-xs">{siguientePartido.ciudad}</p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Árbitro
                  </span>
                  <span className="text-neutral-200 font-bold">{siguientePartido.arbitro}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-500 block">
                    Pronóstico
                  </span>
                  <span className="text-neutral-200 font-bold">{siguientePartido.clima}</span>
                </div>
              </div>

              <p className="text-xs text-neutral-400 italic pt-2 border-t border-white/5 leading-relaxed">
                {siguientePartido.relevancia}
              </p>

              <div className="pt-3">
                <Link
                  to="/formaciones"
                  className="w-full block text-center text-xs font-black uppercase tracking-wider text-black bg-white hover:bg-neutral-200 px-4 py-2.5 transition-colors cursor-pointer"
                >
                  Configurar Pizarra Táctica →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* barra de control: pestanas y filtros */}
      <section aria-label="Controles y filtros del calendario" className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-4">
          {/* pestanas */}
          <div className="flex items-center gap-2 border border-white/10 p-1 bg-[#0a0a0a]/80">
            <button
              type="button"
              onClick={() => {
                setPestanaActiva("proximos");
                setPartidoDetalleId(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                pestanaActiva === "proximos"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Próximos Partidos ({contadorProximos})
            </button>
            <button
              type="button"
              onClick={() => {
                setPestanaActiva("anteriores");
                setPartidoDetalleId(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                pestanaActiva === "anteriores"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Historial de Resultados ({contadorAnteriores})
            </button>
            <button
              type="button"
              onClick={() => {
                setPestanaActiva("todos");
                setPartidoDetalleId(null);
              }}
              className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                pestanaActiva === "todos"
                  ? "bg-white text-black"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              Todos ({partidos.length})
            </button>
          </div>

          {/* busqueda rapida */}
          <div className="w-full md:w-72">
            <input
              type="text"
              value={busquedaRival}
              onChange={(e) => setBusquedaRival(e.target.value)}
              placeholder="Buscar por rival o estadio..."
              aria-label="Buscar partido por rival o estadio"
              className="w-full bg-[#0a0a0a] border border-white/10 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
            />
          </div>
        </div>

        {/* filtros secundarios por competicion y localia */}
        <div className="flex items-center gap-3 flex-wrap text-xs">
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
            Filtrar por:
          </span>

          <select
            value={filtroTorneo}
            onChange={(e) => setFiltroTorneo(e.target.value)}
            aria-label="Filtrar por torneo"
            className="bg-[#0a0a0a] border border-white/10 px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40"
          >
            <option value="todos">Todos los Torneos</option>
            <option value="Campeonato Nacional">Campeonato Nacional</option>
            <option value="Copa Libertadores">Copa Libertadores</option>
            <option value="Copa Chile">Copa Chile</option>
          </select>

          <select
            value={filtroCondicion}
            onChange={(e) => setFiltroCondicion(e.target.value)}
            aria-label="Filtrar por condición de localía"
            className="bg-[#0a0a0a] border border-white/10 px-3 py-1.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40"
          >
            <option value="todos">Cualquier Condición</option>
            <option value="Local">Solo de Local</option>
            <option value="Visita">Solo de Visita</option>
          </select>

          {(filtroTorneo !== "todos" || filtroCondicion !== "todos" || busquedaRival) && (
            <button
              type="button"
              onClick={() => {
                setFiltroTorneo("todos");
                setFiltroCondicion("todos");
                setBusquedaRival("");
              }}
              className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white underline tracking-wider cursor-pointer"
            >
              Limpiar filtros
            </button>
          )}
        </div>
      </section>

      {/* confirmacion inline de eliminacion */}
      {confirmarEliminarId && (
        <div className="border border-rose-500/50 bg-rose-950/30 p-4 flex items-center justify-between text-xs animate-fade-in">
          <span className="text-rose-200">
            ¿Confirmas la eliminación de este partido del fixture oficial?
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                const p = partidos.find((item) => item.id === confirmarEliminarId);
                handleConfirmarEliminar(confirmarEliminarId, p ? p.rival : "seleccionado");
              }}
              className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase px-3 py-1.5 cursor-pointer"
            >
              Sí, eliminar
            </button>
            <button
              type="button"
              onClick={() => setConfirmarEliminarId(null)}
              className="border border-white/20 text-neutral-300 hover:text-white font-bold text-[10px] uppercase px-3 py-1.5 cursor-pointer"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {/* listado de partidos: grilla rigurosa de 12 columnas para alineacion vertical perfecta */}
      <section aria-labelledby="titulo-listado-partidos" className="space-y-3">
        <h2 id="titulo-listado-partidos" className="sr-only">
          Listado de Encuentros
        </h2>

        {partidosFiltrados.length === 0 ? (
          <div className="border border-white/10 bg-[#0a0a0a]/80 p-12 text-center space-y-3">
            <p className="text-white font-bold uppercase tracking-wider text-sm">
              No se encontraron partidos con los filtros seleccionados
            </p>
            <p className="text-neutral-400 text-xs">
              Intenta cambiar los parámetros de búsqueda o selecciona otra pestaña.
            </p>
          </div>
        ) : (
          <div className="space-y-2.5">
            {partidosFiltrados.map((partido) => {
              const esAnterior = partido.tipo === "anterior";
              const estaExpandido = partidoDetalleId === partido.id;

              // identificacion estricta de local y visita
              const equipoLocal = partido.condicion === "Local" ? "Colo-Colo" : partido.rival;
              const equipoVisita = partido.condicion === "Local" ? partido.rival : "Colo-Colo";
              const escudoRivalResuelto = resolverEscudoRival(partido);

              const escudoLocal =
                partido.condicion === "Local" ? ESCUDO_COLO_COLO : escudoRivalResuelto;
              const escudoVisita =
                partido.condicion === "Local" ? escudoRivalResuelto : ESCUDO_COLO_COLO;

              return (
                <article
                  key={partido.id}
                  className={`border transition-all duration-200 ${
                    estaExpandido
                      ? "border-white bg-[#0e0e0e] shadow-xl"
                      : "border-white/10 bg-[#0a0a0a]/80 hover:border-white/30 hover:bg-[#0c0c0c] hover:-translate-y-0.5"
                  }`}
                >
                  {/* estructura fija de 12 columnas: columna 1 (4 cols), columna 2 (6 cols), columna 3 (2 cols) */}
                  <div className="p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 items-center gap-4">
                    {/* columna izquierda fija (4 columnas): fecha, hora, torneo y estadio */}
                    <div className="md:col-span-4 flex items-center gap-3.5 min-w-0">
                      <div className="w-14 text-center border-r border-white/10 pr-3.5 shrink-0">
                        <span className="text-[10px] uppercase font-bold text-neutral-400 block leading-tight">
                          {partido.fecha.split("-")[1]}/{partido.fecha.split("-")[2]}
                        </span>
                        <span className="text-xs sm:text-sm font-black text-white font-mono block mt-0.5">
                          {partido.hora}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] uppercase font-bold text-white tracking-wider truncate">
                            {partido.torneo}
                          </span>
                          <span className="text-neutral-700 text-xs">•</span>
                          <span className="text-[10px] uppercase font-bold text-neutral-400">
                            {partido.jornada}
                          </span>
                          <span
                            className={`text-[9px] uppercase font-bold px-1.5 py-0.5 border ${
                              partido.condicion === "Local"
                                ? "border-emerald-500/40 text-emerald-400 bg-emerald-500/10"
                                : "border-sky-500/40 text-sky-400 bg-sky-500/10"
                            }`}
                          >
                            {partido.condicion}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 truncate" title={partido.estadio}>
                          {partido.estadio}
                        </p>
                      </div>
                    </div>

                    {/* columna central fija (6 columnas): enfrentamiento perfectamente alineado en el eje vertical */}
                    <div className="md:col-span-6 grid grid-cols-[1fr_auto_1fr] items-center gap-2 sm:gap-3 w-full">
                      {/* equipo 1 (local): texto a la derecha + escudo pegado al centro */}
                      <div className="flex items-center justify-end gap-2 text-right min-w-0">
                        <span className="text-xs sm:text-sm font-black uppercase text-white tracking-wider truncate">
                          {equipoLocal}
                        </span>
                        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                          {escudoLocal ? (
                            <img
                              src={escudoLocal}
                              alt={equipoLocal}
                              width="20"
                              height="20"
                              loading="lazy"
                              decoding="async"
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-white/20 bg-white/5 text-[9px] font-black text-neutral-300 flex items-center justify-center">
                              {partido.condicion === "Local" ? "CC" : partido.siglaRival}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* vs o marcador central: ancho fijo para que todas las filas queden en la misma posicion horizontal */}
                      <div className="w-24 sm:w-28 flex justify-center shrink-0">
                        {esAnterior ? (
                          <div className="flex items-center gap-1.5 sm:gap-2">
                            <span className="text-xs sm:text-sm font-black text-white font-mono bg-white/5 border border-white/10 px-2 py-0.5">
                              {partido.condicion === "Local"
                                ? `${partido.golesColoColo} - ${partido.golesRival}`
                                : `${partido.golesRival} - ${partido.golesColoColo}`}
                            </span>
                            <span
                              className={`text-[9px] uppercase font-black px-1.5 py-0.5 border ${
                                partido.resultado === "Victoria"
                                  ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                                  : partido.resultado === "Empate"
                                  ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                                  : "bg-rose-500/20 text-rose-300 border-rose-500/40"
                              }`}
                            >
                              {partido.resultado.slice(0, 3).toUpperCase()}
                            </span>
                          </div>
                        ) : (
                          <span className="px-3 py-1 text-[10px] font-black uppercase tracking-widest bg-white/5 border border-white/10 text-neutral-400">
                            VS
                          </span>
                        )}
                      </div>

                      {/* equipo 2 (visita): escudo pegado al centro + texto a la izquierda */}
                      <div className="flex items-center justify-start gap-2 text-left min-w-0">
                        <div className="w-6 h-6 shrink-0 flex items-center justify-center">
                          {escudoVisita ? (
                            <img
                              src={escudoVisita}
                              alt={equipoVisita}
                              width="20"
                              height="20"
                              loading="lazy"
                              decoding="async"
                              className="w-5 h-5 object-contain"
                            />
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-white/20 bg-white/5 text-[9px] font-black text-neutral-300 flex items-center justify-center">
                              {partido.condicion === "Local" ? partido.siglaRival : "CC"}
                            </span>
                          )}
                        </div>
                        <span className="text-xs sm:text-sm font-black uppercase text-white tracking-wider truncate">
                          {equipoVisita}
                        </span>
                      </div>
                    </div>

                    {/* columna derecha fija (2 columnas): acciones */}
                    <div className="md:col-span-2 flex items-center gap-2 justify-end min-w-0">
                      {esAnterior && (
                        <button
                          type="button"
                          onClick={() =>
                            setPartidoDetalleId(estaExpandido ? null : partido.id)
                          }
                          className="text-[10px] uppercase font-bold tracking-wider px-3 py-1.5 border border-white/15 text-neutral-300 hover:text-white hover:border-white transition-colors cursor-pointer"
                        >
                          {estaExpandido ? "Ocultar Ficha" : "Ver Ficha"}
                        </button>
                      )}

                      {/* si fue un partido creado por el usuario permitir eliminar */}
                      {partido.id.startsWith("part-custom") && (
                        <button
                          type="button"
                          onClick={() => setConfirmarEliminarId(partido.id)}
                          className="text-[10px] uppercase font-bold text-rose-400 hover:text-rose-300 p-1.5 cursor-pointer"
                          title="Eliminar partido personalizado"
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </div>

                  {/* panel desplegable con ficha tecnica y estadisticas de partidos finalizados */}
                  {esAnterior && estaExpandido && (
                    <div className="border-t border-white/10 p-5 bg-black/40 space-y-4 animate-fade-in">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* goleadores y cronica */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/10 pb-1.5">
                            Incidencias y Goleadores
                          </h3>

                          <div className="space-y-1.5 text-xs">
                            <div className="flex items-start gap-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase w-20 shrink-0">
                                Colo-Colo:
                              </span>
                              <span className="text-white font-medium">
                                {partido.goleadores?.length
                                  ? partido.goleadores.join(", ")
                                  : "Sin goles registrados"}
                              </span>
                            </div>

                            <div className="flex items-start gap-2">
                              <span className="text-[10px] font-bold text-neutral-400 uppercase w-20 shrink-0">
                                {partido.rival}:
                              </span>
                              <span className="text-neutral-400 font-medium">
                                {partido.goleadoresRival?.length
                                  ? partido.goleadoresRival.join(", ")
                                  : "Sin goles"}
                              </span>
                            </div>
                          </div>

                          <div className="pt-2">
                            <h4 className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                              Resumen Técnico del Encuentro
                            </h4>
                            <p className="text-xs text-neutral-300 leading-relaxed italic border-l-2 border-neutral-700 pl-3">
                              {partido.resumen}
                            </p>
                          </div>
                        </div>

                        {/* estadisticas comparativas */}
                        <div className="space-y-3">
                          <h3 className="text-xs font-black uppercase tracking-widest text-white border-b border-white/10 pb-1.5">
                            Estadísticas del Partido
                          </h3>

                          {partido.estadisticas && (
                            <div className="space-y-2.5 text-xs">
                              {/* posesion */}
                              <div className="space-y-1">
                                <div className="flex justify-between text-[11px] font-bold">
                                  <span className="text-white">{partido.estadisticas.posesion}%</span>
                                  <span className="text-neutral-400 uppercase text-[9px] tracking-wider">
                                    Posesión
                                  </span>
                                  <span className="text-neutral-400">
                                    {100 - partido.estadisticas.posesion}%
                                  </span>
                                </div>
                                <div className="w-full bg-neutral-800 h-1.5 flex overflow-hidden">
                                  <div
                                    style={{ width: `${partido.estadisticas.posesion}%` }}
                                    className="bg-white"
                                  ></div>
                                  <div
                                    style={{ width: `${100 - partido.estadisticas.posesion}%` }}
                                    className="bg-neutral-600"
                                  ></div>
                                </div>
                              </div>

                              {/* tiros al arco */}
                              <div className="flex justify-between items-center py-1 border-b border-white/5">
                                <span className="font-bold text-white">
                                  {partido.estadisticas.tirosArco}
                                </span>
                                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                                  Tiros al Arco
                                </span>
                                <span className="font-bold text-neutral-400">
                                  {partido.estadisticas.tirosRival}
                                </span>
                              </div>

                              {/* precision de pases */}
                              <div className="flex justify-between items-center py-1 border-b border-white/5">
                                <span className="font-bold text-white">
                                  {partido.estadisticas.precisionPases}%
                                </span>
                                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                                  Precisión de Pases
                                </span>
                                <span className="font-bold text-neutral-400">-</span>
                              </div>

                              {/* faltas y tarjetas */}
                              <div className="flex justify-between items-center py-1">
                                <span className="font-bold text-white">
                                  {partido.estadisticas.faltas} (A:{partido.estadisticas.tarjetasAmarillas})
                                </span>
                                <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">
                                  Faltas / Tarjetas
                                </span>
                                <span className="font-bold text-neutral-400">-</span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* modal para programar nuevo partido montado en portal sobre todo el viewport */}
      {modalNuevoPartido && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm animate-fade-in flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalNuevoPartido(false);
          }}
        >
          <div className="border border-white/10 bg-[#0a0a0a] w-full max-w-lg p-5 sm:p-8 space-y-4 shadow-2xl relative my-auto animate-modal-pop max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Programar Nuevo Encuentro
              </h3>
              <button
                type="button"
                onClick={() => setModalNuevoPartido(false)}
                className="text-neutral-400 hover:text-white text-base leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleGuardarNuevoPartido} className="space-y-4" noValidate>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="input-partido-rival"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Club Rival
                  </label>
                  <input
                    id="input-partido-rival"
                    type="text"
                    value={formNuevo.rival}
                    onChange={(e) => setFormNuevo({ ...formNuevo, rival: e.target.value })}
                    placeholder="Ej: Ñublense"
                    className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                  />
                  {erroresForm.rival && (
                    <p className="text-red-400 text-[10px] font-semibold parpadeo-error">
                      {erroresForm.rival}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="input-partido-sigla"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Sigla Rival (3 letras)
                  </label>
                  <input
                    id="input-partido-sigla"
                    type="text"
                    value={formNuevo.siglaRival}
                    onChange={(e) => setFormNuevo({ ...formNuevo, siglaRival: e.target.value })}
                    placeholder="Ej: ÑUB"
                    className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white uppercase focus:outline-none focus:border-white/40"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="input-partido-torneo"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Torneo / Competición
                  </label>
                  <select
                    id="input-partido-torneo"
                    value={formNuevo.torneo}
                    onChange={(e) => setFormNuevo({ ...formNuevo, torneo: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Campeonato Nacional">Campeonato Nacional</option>
                    <option value="Copa Libertadores">Copa Libertadores</option>
                    <option value="Copa Chile">Copa Chile</option>
                    <option value="Amistoso">Amistoso</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="input-partido-condicion"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Condición
                  </label>
                  <select
                    id="input-partido-condicion"
                    value={formNuevo.condicion}
                    onChange={(e) => setFormNuevo({ ...formNuevo, condicion: e.target.value })}
                    className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                  >
                    <option value="Local">Local (Estadio Monumental)</option>
                    <option value="Visita">Visitante</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label
                    htmlFor="input-partido-fecha"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Fecha (AAAA-MM-DD)
                  </label>
                  <input
                    id="input-partido-fecha"
                    type="text"
                    value={formNuevo.fecha}
                    onChange={(e) => setFormNuevo({ ...formNuevo, fecha: e.target.value })}
                    placeholder="2026-12-05"
                    className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                  />
                  {erroresForm.fecha && (
                    <p className="text-red-400 text-[10px] font-semibold parpadeo-error">
                      {erroresForm.fecha}
                    </p>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label
                    htmlFor="input-partido-hora"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Hora (HH:MM)
                  </label>
                  <input
                    id="input-partido-hora"
                    type="text"
                    value={formNuevo.hora}
                    onChange={(e) => setFormNuevo({ ...formNuevo, hora: e.target.value })}
                    placeholder="18:30"
                    className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                  />
                  {erroresForm.hora && (
                    <p className="text-red-400 text-[10px] font-semibold parpadeo-error">
                      {erroresForm.hora}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="input-partido-estadio"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Estadio
                </label>
                <input
                  id="input-partido-estadio"
                  type="text"
                  value={formNuevo.estadio}
                  onChange={(e) => setFormNuevo({ ...formNuevo, estadio: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                />
                {erroresForm.estadio && (
                  <p className="text-red-400 text-[10px] font-semibold parpadeo-error">
                    {erroresForm.estadio}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="input-partido-relevancia"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Objetivo o Nota Táctica
                </label>
                <input
                  id="input-partido-relevancia"
                  type="text"
                  value={formNuevo.relevancia}
                  onChange={(e) => setFormNuevo({ ...formNuevo, relevancia: e.target.value })}
                  placeholder="Ej: Partido clave para asegurar puestos de clasificación directa"
                  className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalNuevoPartido(false)}
                  className="px-4 py-2 border border-white/10 text-neutral-300 hover:text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-black text-xs uppercase hover:bg-neutral-200 cursor-pointer"
                >
                  Guardar Encuentro
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Calendario;
