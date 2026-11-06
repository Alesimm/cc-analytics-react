import { useState, useMemo } from "react";
import {
  obtenerPlantel,
  obtenerRendimientoJugador,
  obtenerDirectricesStorage,
  guardarDirectrizStorage,
  eliminarDirectrizStorage,
} from "../data/plantelData";

// calculo de vertices para el radar poligonal svg nativo (6 ejes)
const generarPuntosRadar = (metricas, cx, cy, radioMaximo) => {
  const total = metricas.length;
  return metricas
    .map((m, index) => {
      const angulo = (index * 2 * Math.PI) / total - Math.PI / 2;
      const radio = (m.valor / m.max) * radioMaximo;
      const x = cx + radio * Math.cos(angulo);
      const y = cy + radio * Math.sin(angulo);
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
};

// badge sobrio y monocromatico para la posicion
const estiloPosicion = () => {
  return "border-white/15 text-neutral-300 bg-white/[0.03]";
};

const Rendimiento = () => {
  // obtener plantel completo
  const [plantel] = useState(obtenerPlantel);

  // id del jugador seleccionado (inicialmente vacio para estado skeleton)
  const [jugadorIdSeleccionado, setJugadorIdSeleccionado] = useState("");

  // buscador y catalogo desplegable
  const [busqueda, setBusqueda] = useState("");
  const [menuAbierto, setMenuAbierto] = useState(false);

  // directrices y observaciones tacticas unificadas (gestionadas por admin)
  const [todasDirectrices, setTodasDirectrices] = useState(
    obtenerDirectricesStorage
  );

  // control de formulario de directriz tactica (crear / editar)
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [dirEnEdicionId, setDirEnEdicionId] = useState(null);
  const [dirAEliminarId, setDirAEliminarId] = useState(null);

  const [formDirectriz, setFormDirectriz] = useState({
    area: "Táctica",
    prioridad: "Alta",
    calificacion: "8.5",
    indicacion: "",
  });
  const [erroresDirectriz, setErroresDirectriz] = useState({});
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  // jugador actual seleccionado (null si aun no se ha seleccionado ninguno)
  const jugadorSeleccionado = useMemo(() => {
    if (!jugadorIdSeleccionado) return null;
    return plantel.find((j) => j.id === jugadorIdSeleccionado) || null;
  }, [plantel, jugadorIdSeleccionado]);

  // directrices tacticas filtradas para el futbolista activo
  const directricesJugador = useMemo(() => {
    if (!jugadorSeleccionado) return [];
    return todasDirectrices.filter(
      (d) => d.jugadorId === jugadorSeleccionado.id
    );
  }, [todasDirectrices, jugadorSeleccionado]);

  // modelo de rendimiento y partidos especificos del jugador seleccionado
  const datosRendimiento = useMemo(() => {
    if (!jugadorSeleccionado) return null;
    return obtenerRendimientoJugador(jugadorSeleccionado);
  }, [jugadorSeleccionado]);

  // lista filtrada para el buscador
  const jugadoresFiltrados = useMemo(() => {
    const q = busqueda.trim().toLowerCase();
    if (!q) return plantel;
    return plantel.filter(
      (j) =>
        j.nombre.toLowerCase().includes(q) ||
        String(j.dorsal).includes(q) ||
        j.posicion.toLowerCase().includes(q)
    );
  }, [plantel, busqueda]);

  const handleSeleccionarJugador = (id) => {
    setJugadorIdSeleccionado(id);
    setMenuAbierto(false);
    setBusqueda("");
    setMostrarFormulario(false);
    setDirEnEdicionId(null);
  };

  const handleIniciarEdicion = (dir) => {
    setDirEnEdicionId(dir.id);
    setFormDirectriz({
      area: dir.area || "Táctica",
      prioridad: dir.prioridad || "Alta",
      calificacion: String(dir.calificacion || "8.0"),
      indicacion: dir.indicacion || dir.comentario || "",
    });
    setErroresDirectriz({});
    setMostrarFormulario(true);
  };

  const handleCancelarForm = () => {
    setMostrarFormulario(false);
    setDirEnEdicionId(null);
    setFormDirectriz({
      area: "Táctica",
      prioridad: "Alta",
      calificacion: "8.5",
      indicacion: "",
    });
    setErroresDirectriz({});
  };

  const handleGuardarDirectriz = (e) => {
    e.preventDefault();
    if (!jugadorSeleccionado) return;

    const nuevosErrores = {};
    let esValido = true;

    const indicacionLimpia = formDirectriz.indicacion.trim();
    if (!indicacionLimpia) {
      nuevosErrores.indicacion =
        "La directriz o recomendación táctica no puede estar vacía.";
      esValido = false;
    } else if (indicacionLimpia.length < 5) {
      nuevosErrores.indicacion =
        "La indicación debe tener al menos 5 caracteres descriptivos.";
      esValido = false;
    }

    const notaNum = Number(formDirectriz.calificacion);
    if (
      !formDirectriz.calificacion ||
      isNaN(notaNum) ||
      notaNum < 1 ||
      notaNum > 10
    ) {
      nuevosErrores.calificacion = "La calificación debe estar entre 1 y 10.";
      esValido = false;
    }

    setErroresDirectriz(nuevosErrores);

    if (esValido) {
      const payload = {
        id: dirEnEdicionId || undefined,
        jugadorId: jugadorSeleccionado.id,
        jugadorNombre: jugadorSeleccionado.nombre,
        area: formDirectriz.area,
        prioridad: formDirectriz.prioridad,
        calificacion: Number(notaNum.toFixed(1)),
        indicacion: indicacionLimpia,
        comentario: indicacionLimpia,
      };

      guardarDirectrizStorage(payload);
      setTodasDirectrices(obtenerDirectricesStorage());

      setMensajeFeedback(
        dirEnEdicionId
          ? "Directriz táctica actualizada correctamente."
          : `Directriz táctica registrada para ${jugadorSeleccionado.nombre}.`
      );

      handleCancelarForm();
      setTimeout(() => setMensajeFeedback(""), 3500);
    }
  };

  // confirmar eliminacion sin confirm()
  const handleConfirmarEliminar = (id) => {
    eliminarDirectrizStorage(id);
    setTodasDirectrices(obtenerDirectricesStorage());
    setDirAEliminarId(null);
    setMensajeFeedback("Directriz táctica eliminada del plan del jugador.");
    setTimeout(() => setMensajeFeedback(""), 3000);
  };

  // constantes geometricas para el radar svg (6 ejes)
  const radarCx = 160;
  const radarCy = 160;
  const radarRadio = 110;
  const metricasRadar = datosRendimiento ? datosRendimiento.radar : [];
  const totalEjes = metricasRadar.length || 6;
  const puntosPoligono = datosRendimiento
    ? generarPuntosRadar(metricasRadar, radarCx, radarCy, radarRadio)
    : "";

  return (
    <div className="space-y-8 relative">
      {/* cabecera principal minimalista */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-block w-1.5 h-1.5 bg-white"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
              CC Analytics // Analítica Avanzada
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-neutral-300 border border-white/15 px-2 py-0.5 bg-white/[0.03]">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-none">
            Análisis Individual
          </h1>
          <p className="text-neutral-400 text-xs font-medium mt-2">
            Métricas físicas, análisis táctico y seguimiento por futbolista
          </p>
        </div>
      </header>

      {/* buscador y selector de catalogo (iconos vectoriales svg limpios) */}
      <div className="relative">
        <div className="relative flex items-center">
          <span className="absolute left-3.5 text-neutral-500 pointer-events-none flex items-center">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35M17 11a6 6 0 11-12 0 6 6 0 0112 0z"
              />
            </svg>
          </span>
          <input
            id="buscador-jugador-rendimiento"
            type="text"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setMenuAbierto(true);
            }}
            onFocus={() => setMenuAbierto(true)}
            placeholder="Buscar futbolista por nombre, dorsal o posición (ej: Arturo Vidal, Brayan Cortés, E. Pavez...)"
            className="w-full bg-[#0a0a0a] border border-white/15 pl-10 pr-36 py-3 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40 transition-colors"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            {busqueda && (
              <button
                type="button"
                onClick={() => setBusqueda("")}
                className="px-2 py-1 text-xs text-neutral-400 hover:text-white cursor-pointer flex items-center gap-1"
                title="Limpiar búsqueda"
              >
                ✕
              </button>
            )}
            <button
              type="button"
              onClick={() => setMenuAbierto(!menuAbierto)}
              className="px-3 py-1.5 bg-white/10 hover:bg-white/15 text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border border-white/15 cursor-pointer transition-colors"
            >
              <span>Catálogo</span>
              <svg
                className={`w-3 h-3 transition-transform duration-200 ${
                  menuAbierto ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* catalogo desplegable profesional */}
        {menuAbierto && (
          <div className="absolute z-30 left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-[#0a0a0a] border border-white/20 shadow-2xl p-2 space-y-1">
            <div className="px-2 py-1 text-[9px] uppercase font-bold tracking-widest text-neutral-500 border-b border-white/5 flex justify-between">
              <span>Plantel Profesional Colo-Colo</span>
              <span>{jugadoresFiltrados.length} disponibles</span>
            </div>
            {jugadoresFiltrados.length === 0 ? (
              <div className="p-3 text-center text-xs text-neutral-500">
                No se encontraron futbolistas con el término &quot;{busqueda}&quot;.
              </div>
            ) : (
              jugadoresFiltrados.map((j) => (
                <button
                  key={j.id}
                  type="button"
                  onClick={() => handleSeleccionarJugador(j.id)}
                  className={`w-full text-left p-2.5 flex items-center justify-between text-xs border transition-colors cursor-pointer ${
                    j.id === jugadorSeleccionado?.id
                      ? "bg-white/10 border-white/40 text-white"
                      : "bg-transparent border-transparent hover:bg-white/5 text-neutral-300 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 bg-white/5 border border-white/10 flex items-center justify-center font-mono font-bold text-[11px] text-white">
                      #{j.dorsal}
                    </span>
                    <div>
                      <span className="font-bold block uppercase tracking-wide">
                        {j.nombre}
                      </span>
                      <span className="text-[10px] text-neutral-500">
                        {j.posicion} • {j.edad} años • {j.rol}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloPosicion()}`}
                  >
                    {j.posicion}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* SI NO HAY JUGADOR SELECCIONADO: ESTADO SKELETON ESPERANDO ASIGNACION */}
      {!jugadorSeleccionado ? (
        <div className="space-y-8 animate-fade-in">
          {/* banner informativo de asignacion con skeleton */}
          <div className="border border-white/15 bg-[#0a0a0a]/90 p-8 sm:p-12 text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full border border-white/15 bg-white/[0.03] flex items-center justify-center text-neutral-400">
              <svg
                viewBox="0 0 24 24"
                className="w-8 h-8"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>
            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-lg font-extrabold uppercase tracking-tight text-white">
                Ningún Futbolista Seleccionado
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-normal">
                Usa el buscador superior o haz clic en <strong>Catálogo</strong> para elegir a un jugador del plantel y cargar su perfil poligonal, rendimiento reciente y directrices.
              </p>
            </div>
          </div>

          {/* SKELETON ESTRUCTURAL DE LAS DOS COLUMNAS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start opacity-40">
            {/* skeleton izquierda: radar */}
            <div className="lg:col-span-6 border border-white/10 bg-[#0a0a0a]/50 p-6 space-y-4">
              <div className="h-4 w-44 bg-white/10 animate-pulse"></div>
              <div className="w-64 h-64 mx-auto rounded-full border border-dashed border-white/10 flex items-center justify-center">
                <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-600">
                  Esperando selección...
                </span>
              </div>
              <div className="grid grid-cols-3 gap-2 pt-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="h-10 bg-white/5 animate-pulse"></div>
                ))}
              </div>
            </div>

            {/* skeleton derecha: partidos recientes */}
            <div className="lg:col-span-6 border border-white/10 bg-[#0a0a0a]/50 p-6 space-y-3">
              <div className="h-4 w-52 bg-white/10 animate-pulse"></div>
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-14 bg-white/5 animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* VISTA ACTIVA CON DATOS DEL FUTBOLISTA SELECCIONADO */
        <div className="space-y-8 animate-fade-in">
          {/* ficha de identidad */}
          <section
            aria-labelledby="perfil-jugador"
            className="border border-white/10 bg-[#0a0a0a]/80 p-5 sm:p-6 relative overflow-hidden shadow-2xl"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 sm:w-24 sm:h-24 border border-white/20 bg-gradient-to-br from-neutral-800 to-neutral-950 flex flex-col items-center justify-center shrink-0 shadow-inner">
                  <svg
                    className="w-9 h-9 text-neutral-300"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    aria-hidden="true"
                  >
                    <path d="M12 2a4 4 0 100 8 4 4 0 000-8zm0 10c-4.42 0-8 2.24-8 5v2a1 1 0 001 1h14a1 1 0 001-1v-2c0-2.76-3.58-5-8-5z" />
                  </svg>
                  <span className="mt-1.5 text-[11px] font-mono font-black text-white px-2 py-0.5 bg-black/80 border border-white/20">
                    #{jugadorSeleccionado.dorsal}
                  </span>
                </div>

                <div className="space-y-1">
                  <h2
                    id="perfil-jugador"
                    className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white"
                  >
                    {jugadorSeleccionado.nombre}
                  </h2>
                  <p className="text-xs text-neutral-400 font-medium tracking-wide">
                    {jugadorSeleccionado.posicion} • #{jugadorSeleccionado.dorsal} •{" "}
                    {jugadorSeleccionado.edad} años
                  </p>
                  <div className="flex items-center gap-2 pt-1 flex-wrap">
                    <span
                      className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloPosicion()}`}
                    >
                      {jugadorSeleccionado.posicion}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
                      {jugadorSeleccionado.estado}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 text-neutral-300">
                      {jugadorSeleccionado.rol}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 text-neutral-400">
                      Pie: {jugadorSeleccionado.pie || "Derecho"}
                    </span>
                  </div>
                </div>
              </div>

              {/* kpis de temporada */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 text-center">
                <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                    Promedio
                  </span>
                  <span className="text-lg font-black font-mono text-emerald-400">
                    {datosRendimiento?.promedioTemporada || "—"}
                  </span>
                  <span className="text-[8px] text-neutral-500 block">/ 10</span>
                </div>

                <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                    Distancia
                  </span>
                  <span className="text-lg font-black font-mono text-white">
                    {datosRendimiento?.kmPorPartido || "—"}
                  </span>
                  <span className="text-[8px] text-neutral-500 block">p/juego</span>
                </div>

                <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                    Efectividad
                  </span>
                  <span className="text-lg font-black font-mono text-white">
                    {datosRendimiento?.pasesCompletados || "—"}
                  </span>
                  <span className="text-[8px] text-neutral-500 block">pases</span>
                </div>

                <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
                  <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                    Minutos
                  </span>
                  <span className="text-lg font-black font-mono text-neutral-300">
                    {datosRendimiento?.minutosJugados || 0}&apos;
                  </span>
                  <span className="text-[8px] text-neutral-500 block">totales</span>
                </div>
              </div>
            </div>
          </section>

          {/* grid principal de 2 columnas: radar y partidos recientes */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* columna izquierda: radar chart con 6 ejes */}
            <section
              aria-labelledby="seccion-radar"
              className="lg:col-span-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3
                  id="seccion-radar"
                  className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                  Estadísticas Avanzadas
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Perfil Poligonal
                </span>
              </div>

              <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 space-y-4 relative overflow-hidden shadow-2xl">
                <div className="w-full max-w-72 aspect-square mx-auto flex items-center justify-center py-2">
                  <svg
                    viewBox="0 0 320 320"
                    className="w-full h-full overflow-visible"
                    aria-label="Gráfico radial de estadísticas individuales"
                  >
                    {[0.25, 0.5, 0.75, 1.0].map((nivel, idx) => {
                      const nivelPts = metricasRadar
                        .map((_, i) => {
                          const ang = (i * 2 * Math.PI) / totalEjes - Math.PI / 2;
                          const r = nivel * radarRadio;
                          return `${(radarCx + r * Math.cos(ang)).toFixed(1)},${(
                            radarCy +
                            r * Math.sin(ang)
                          ).toFixed(1)}`;
                        })
                        .join(" ");

                      return (
                        <polygon
                          key={idx}
                          points={nivelPts}
                          fill="none"
                          stroke="rgba(255, 255, 255, 0.08)"
                          strokeWidth="1"
                        />
                      );
                    })}

                    {metricasRadar.map((m, i) => {
                      const ang = (i * 2 * Math.PI) / totalEjes - Math.PI / 2;
                      const x = radarCx + radarRadio * Math.cos(ang);
                      const y = radarCy + radarRadio * Math.sin(ang);
                      const labelX = radarCx + (radarRadio + 22) * Math.cos(ang);
                      const labelY = radarCy + (radarRadio + 18) * Math.sin(ang);

                      return (
                        <g key={i}>
                          <line
                            x1={radarCx}
                            y1={radarCy}
                            x2={x}
                            y2={y}
                            stroke="rgba(255, 255, 255, 0.12)"
                            strokeWidth="1"
                          />
                          <text
                            x={labelX}
                            y={labelY}
                            fill="#d4d4d4"
                            fontSize="9.5"
                            fontWeight="700"
                            letterSpacing="0.05em"
                            textAnchor="middle"
                            dominantBaseline="middle"
                            className="uppercase select-none"
                          >
                            {m.eje}
                          </text>
                        </g>
                      );
                    })}

                    <polygon
                      points={puntosPoligono}
                      fill="rgba(255, 255, 255, 0.14)"
                      stroke="#ffffff"
                      strokeWidth="1.8"
                      className="transition-all duration-500"
                    />

                    {metricasRadar.map((m, i) => {
                      const ang = (i * 2 * Math.PI) / totalEjes - Math.PI / 2;
                      const r = (m.valor / m.max) * radarRadio;
                      const px = radarCx + r * Math.cos(ang);
                      const py = radarCy + r * Math.sin(ang);

                      return (
                        <circle
                          key={i}
                          cx={px}
                          cy={py}
                          r="3"
                          fill="#ffffff"
                          stroke="#0a0a0a"
                          strokeWidth="1.5"
                        />
                      );
                    })}
                  </svg>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-white/5">
                  {metricasRadar.map((item, idx) => (
                    <div key={idx} className="border border-white/5 bg-white/2 p-2">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-neutral-400 font-medium">
                          {item.eje}
                        </span>
                        <span className="font-mono font-bold text-white">
                          {item.valor}
                        </span>
                      </div>
                      <div className="h-1 w-full bg-white/5 mt-1 overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 transition-all duration-500"
                          style={{ width: `${item.valor}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* columna derecha: forma y rendimiento reciente */}
            <section
              aria-labelledby="seccion-forma-reciente"
              className="lg:col-span-6 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <h3
                  id="seccion-forma-reciente"
                  className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                  Forma y Rendimiento Reciente
                </h3>
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                  Últimos 5 Partidos
                </span>
              </div>

              <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 space-y-4 relative overflow-hidden shadow-2xl">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
                    Puntaje Promedio Reciente
                  </span>
                  <span className="text-sm font-mono font-black text-emerald-400">
                    {datosRendimiento?.promedioReciente !== null
                      ? `${datosRendimiento.promedioReciente} / 10`
                      : "Sin minutos en cancha"}
                  </span>
                </div>

                <div className="space-y-2.5">
                  {datosRendimiento?.partidosRecientes.map((partido, index) => {
                    const esVictoria = partido.tipo === "Victoria";
                    const sinParticipacion =
                      partido.minutos === 0 || partido.calificacion === null;

                    return (
                      <div
                        key={index}
                        className="border border-white/5 bg-white/2 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:border-white/20 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-2 h-2 rounded-full shrink-0 ${
                              sinParticipacion
                                ? "bg-neutral-600"
                                : esVictoria
                                ? "bg-emerald-400"
                                : "bg-amber-400"
                            }`}
                          ></span>
                          <div>
                            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block">
                              {partido.torneo}
                            </span>
                            <span className="text-xs font-bold uppercase text-white">
                              {partido.rival}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs font-mono">
                          <span className="text-neutral-400 text-[11px]">
                            {sinParticipacion ? "Suplente" : `${partido.minutos}'`}
                          </span>
                          <span className="text-neutral-500 text-[11px]">
                            {partido.resultado}
                          </span>
                          {partido.metricaClave && (
                            <span className="text-neutral-400 text-[10px] hidden md:inline font-sans">
                              {partido.metricaClave}
                            </span>
                          )}
                          <span
                            className={`px-2 py-0.5 text-xs font-bold border ${
                              sinParticipacion
                                ? "border-neutral-700 bg-neutral-900 text-neutral-500"
                                : "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {sinParticipacion ? "Sin participación" : `${partido.calificacion} / 10`}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
          </div>

          {/* seccion inferior: directrices y recomendaciones tacticas */}
          <section
            aria-labelledby="seccion-directrices"
            className="border border-white/10 bg-[#0a0a0a]/80 p-6 space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-4 gap-3">
              <div>
                <h3
                  id="seccion-directrices"
                  className="text-sm font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
                >
                  <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                  Directrices y Recomendaciones Tácticas del Cuerpo Técnico
                </h3>
                <p className="text-neutral-400 text-xs mt-1">
                  Plan individualizado de optimización para {jugadorSeleccionado.nombre}
                </p>
              </div>

              {!mostrarFormulario && (
                <button
                  type="button"
                  onClick={() => {
                    handleCancelarForm();
                    setMostrarFormulario(true);
                  }}
                  className="bg-white text-black hover:bg-neutral-200 text-xs uppercase font-extrabold tracking-wider px-4 py-2 transition-colors cursor-pointer self-start sm:self-auto"
                >
                  + Nueva Directriz Táctica
                </button>
              )}
            </div>

            {mensajeFeedback && (
              <div className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 p-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between animate-fade-in">
                <span>{mensajeFeedback}</span>
                <button
                  type="button"
                  onClick={() => setMensajeFeedback("")}
                  className="text-neutral-400 hover:text-white cursor-pointer ml-3"
                >
                  ✕
                </button>
              </div>
            )}

            {mostrarFormulario && (
              <form
                onSubmit={handleGuardarDirectriz}
                className="border border-white/15 bg-white/2 p-5 space-y-4 animate-fade-in"
                noValidate
              >
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="form-area"
                      className="block text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1"
                    >
                      Área Táctica
                    </label>
                    <select
                      id="form-area"
                      value={formDirectriz.area}
                      onChange={(e) =>
                        setFormDirectriz({ ...formDirectriz, area: e.target.value })
                      }
                      className="w-full bg-[#0a0a0a] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="Táctica">Táctica</option>
                      <option value="Física">Física</option>
                      <option value="Técnica">Técnica</option>
                      <option value="Psicológica">Psicológica</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="form-prioridad"
                      className="block text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1"
                    >
                      Prioridad
                    </label>
                    <select
                      id="form-prioridad"
                      value={formDirectriz.prioridad}
                      onChange={(e) =>
                        setFormDirectriz({
                          ...formDirectriz,
                          prioridad: e.target.value,
                        })
                      }
                      className="w-full bg-[#0a0a0a] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30"
                    >
                      <option value="Alta">Alta</option>
                      <option value="Media">Media</option>
                      <option value="Baja">Baja</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="form-calificacion"
                      className="block text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1"
                    >
                      Calificación (1 a 10)
                    </label>
                    <input
                      id="form-calificacion"
                      type="text"
                      value={formDirectriz.calificacion}
                      onChange={(e) =>
                        setFormDirectriz({
                          ...formDirectriz,
                          calificacion: e.target.value,
                        })
                      }
                      className="w-full bg-[#0a0a0a] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30 font-mono"
                      placeholder="8.5"
                    />
                    {erroresDirectriz.calificacion && (
                      <p className="text-red-400 text-[11px] mt-1">
                        {erroresDirectriz.calificacion}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="form-indicacion"
                    className="block text-[10px] uppercase font-bold tracking-widest text-neutral-400 mb-1"
                  >
                    Directriz o recomendación táctica
                  </label>
                  <textarea
                    id="form-indicacion"
                    rows="3"
                    value={formDirectriz.indicacion}
                    onChange={(e) =>
                      setFormDirectriz({
                        ...formDirectriz,
                        indicacion: e.target.value,
                      })
                    }
                    placeholder="Escribe la recomendación táctica detallada para el jugador..."
                    className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-white/30"
                  />
                  {erroresDirectriz.indicacion && (
                    <p className="text-red-400 text-[11px] mt-1">
                      {erroresDirectriz.indicacion}
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={handleCancelarForm}
                    className="px-3.5 py-1.5 border border-white/10 text-neutral-400 hover:text-white text-xs uppercase font-bold tracking-wider cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-white text-black hover:bg-neutral-200 text-xs uppercase font-extrabold tracking-wider cursor-pointer"
                  >
                    {dirEnEdicionId ? "Actualizar Directriz" : "Guardar Directriz"}
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {directricesJugador.length === 0 ? (
                <p className="text-neutral-500 text-xs italic">
                  No hay directrices registradas para este futbolista.
                </p>
              ) : (
                directricesJugador.map((dir) => (
                  <div
                    key={dir.id}
                    className="border border-white/10 bg-white/2 p-4 space-y-2 hover:border-white/20 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest px-2 py-0.5 bg-white/10 text-white border border-white/15">
                          {dir.area}
                        </span>
                        <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-white/10 text-neutral-300">
                          Prioridad: {dir.prioridad || "Alta"}
                        </span>
                        {dir.calificacion && (
                          <span className="text-[10px] font-mono font-bold text-white">
                            Nota: {dir.calificacion}/10
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {dirAEliminarId === dir.id ? (
                          <div className="flex items-center gap-1.5 text-[10px] animate-fade-in">
                            <span className="text-red-400 font-bold">
                              ¿Eliminar directriz?
                            </span>
                            <button
                              type="button"
                              onClick={() => handleConfirmarEliminar(dir.id)}
                              className="px-2 py-0.5 bg-red-600 hover:bg-red-500 text-white font-bold uppercase cursor-pointer"
                            >
                              Sí
                            </button>
                            <button
                              type="button"
                              onClick={() => setDirAEliminarId(null)}
                              className="px-2 py-0.5 border border-white/20 text-neutral-300 hover:text-white cursor-pointer"
                            >
                              No
                            </button>
                          </div>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleIniciarEdicion(dir)}
                              className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white cursor-pointer px-1.5 py-0.5 hover:bg-white/5"
                            >
                              Editar
                            </button>
                            <span className="text-neutral-700 text-xs">•</span>
                            <button
                              type="button"
                              onClick={() => setDirAEliminarId(dir.id)}
                              className="text-[10px] uppercase font-bold tracking-wider text-red-400/80 hover:text-red-300 cursor-pointer px-1.5 py-0.5 hover:bg-red-500/10"
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 font-sans leading-relaxed flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0"></span>
                      <span>{dir.indicacion || dir.comentario}</span>
                    </p>

                    <div className="flex items-center justify-between text-[9px] text-neutral-500 uppercase tracking-widest pt-1 border-t border-white/5">
                      <span>Cuerpo Técnico // Colo-Colo</span>
                      <span>{dir.fecha || "Temporada Oficial"}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      )}

      {/* pie de pagina */}
      <footer className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 gap-2">
        <p>
          CC Analytics — Plataforma Oficial // Colo-Colo
        </p>
        <p>Módulo de analítica y optimización táctica individual</p>
      </footer>
    </div>
  );
};

export default Rendimiento;
