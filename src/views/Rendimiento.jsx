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

// badge estilizado segun la posicion
const estiloPosicion = (posicion) => {
  switch (posicion) {
    case "Arquero":
      return "border-sky-500/40 text-sky-400 bg-sky-500/10";
    case "Defensa":
      return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
    case "Mediocampista":
      return "border-blue-500/40 text-blue-400 bg-blue-500/10";
    case "Delantero":
      return "border-amber-500/40 text-amber-400 bg-amber-500/10";
    default:
      return "border-neutral-500/40 text-neutral-400 bg-neutral-500/10";
  }
};

const Rendimiento = () => {
  // obtener plantel completo
  const [plantel] = useState(obtenerPlantel);

  // id del jugador seleccionado (por defecto arturo vidal o el primer registro)
  const [jugadorIdSeleccionado, setJugadorIdSeleccionado] = useState(
    () =>
      plantel.find((j) => j.nombre.includes("Vidal"))?.id ||
      plantel[0]?.id ||
      ""
  );

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

  // jugador actual seleccionado
  const jugadorSeleccionado = useMemo(() => {
    return (
      plantel.find((j) => j.id === jugadorIdSeleccionado) ||
      plantel[0] ||
      null
    );
  }, [plantel, jugadorIdSeleccionado]);

  // directrices tacticas filtradas para el futbolista activo
  const directricesJugador = useMemo(() => {
    if (!jugadorSeleccionado) return [];
    return todasDirectrices.filter(
      (d) => d.jugadorId === jugadorSeleccionado.id
    );
  }, [todasDirectrices, jugadorSeleccionado]);

  // datos dinamicos especificos de rendimiento del jugador
  const datosRendimiento = useMemo(() => {
    return obtenerRendimientoJugador(jugadorSeleccionado);
  }, [jugadorSeleccionado]);

  // lista filtrada para el buscador / desplegable de catalogo
  const jugadoresFiltrados = useMemo(() => {
    if (!busqueda.trim()) return plantel;
    const texto = busqueda.trim().toLowerCase();
    return plantel.filter(
      (j) =>
        j.nombre.toLowerCase().includes(texto) ||
        String(j.dorsal).includes(texto) ||
        j.posicion.toLowerCase().includes(texto)
    );
  }, [plantel, busqueda]);

  // seleccion de jugador desde el catalogo desplegable
  const handleSeleccionarJugador = (id) => {
    setJugadorIdSeleccionado(id);
    setBusqueda("");
    setMenuAbierto(false);
    setDirEnEdicionId(null);
    setDirAEliminarId(null);
    setMostrarFormulario(false);
    setFormDirectriz({
      area: "Táctica",
      prioridad: "Alta",
      calificacion: "8.5",
      indicacion: "",
    });
    setErroresDirectriz({});
  };

  // cambios controlados en el formulario
  const handleCambioForm = (campo, valor) => {
    setFormDirectriz((prev) => ({ ...prev, [campo]: valor }));
    if (erroresDirectriz[campo]) {
      setErroresDirectriz((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  // iniciar edicion de una directriz existente
  const handleIniciarEdicion = (dir) => {
    setDirEnEdicionId(dir.id);
    setFormDirectriz({
      area: dir.area || "Táctica",
      prioridad: dir.prioridad || "Alta",
      calificacion: String(dir.calificacion || "8.5"),
      indicacion: dir.indicacion || dir.comentario || "",
    });
    setErroresDirectriz({});
    setMostrarFormulario(true);
  };

  // cancelar formulario
  const handleCancelarForm = () => {
    setDirEnEdicionId(null);
    setFormDirectriz({
      area: "Táctica",
      prioridad: "Alta",
      calificacion: "8.5",
      indicacion: "",
    });
    setErroresDirectriz({});
    setMostrarFormulario(false);
  };

  // guardar o actualizar directriz tactica
  const handleGuardarDirectriz = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    let esValido = true;

    // validacion manual en javascript sin atributos html prohibidos
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

  if (!jugadorSeleccionado || !datosRendimiento) {
    return (
      <div className="p-8 text-neutral-400">
        No hay datos de plantel disponibles.
      </div>
    );
  }

  // constantes geometricas para el radar svg (6 ejes)
  const radarCx = 160;
  const radarCy = 160;
  const radarRadio = 110;
  const metricasRadar = datosRendimiento.radar;
  const totalEjes = metricasRadar.length;
  const puntosPoligono = generarPuntosRadar(
    metricasRadar,
    radarCx,
    radarCy,
    radarRadio
  );

  // calculo de minutos reales en los ultimos 5 partidos
  const minutosRecientesTotales = datosRendimiento.partidosRecientes.reduce(
    (acc, p) => acc + p.minutos,
    0
  );
  const partidosDisputadosRecientes = datosRendimiento.partidosRecientes.filter(
    (p) => p.minutos > 0
  ).length;

  return (
    <div className="space-y-8 relative">
      {/* auras de luz ambiental dorada / ambar para el analisis de rendimiento individual */}
      <div className="absolute -top-10 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(245,158,11,0.053),transparent_70%)] pointer-events-none -z-10"></div>
      <div className="absolute top-72 left-8 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(234,179,8,0.038),transparent_70%)] pointer-events-none -z-10"></div>
      {/* cabecera principal con la misma estructura visual exacta del dashboard y del plantel */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-block w-2.5 h-2.5 bg-amber-400 rounded-full shadow-[0_0_12px_rgba(251,191,36,0.9)] animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
              CC Analytics // Analítica Avanzada
            </span>
            <span className="text-neutral-700 text-xs hidden sm:inline">•</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border border-white/10 px-2 py-0.5 bg-white/2">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-white leading-none">
            Análisis Individual
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Métricas Físicas, Análisis Táctico y Seguimiento por Futbolista
          </p>
        </div>
      </header>

      {/* buscador y selector de catalogo (iconos vectoriales svg limpios, sin emojis) */}
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
                <svg
                  className="w-3.5 h-3.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
                <span className="text-[10px] uppercase font-bold tracking-wider">
                  Limpiar
                </span>
              </button>
            )}
            <button
              type="button"
              onClick={() => setMenuAbierto((prev) => !prev)}
              className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider border border-white/10 text-neutral-300 hover:text-white hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>Catálogo</span>
              <svg
                className={`w-3.5 h-3.5 transition-transform ${
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
                    j.id === jugadorSeleccionado.id
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
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloPosicion(
                      j.posicion
                    )}`}
                  >
                    {j.posicion}
                  </span>
                </button>
              ))
            )}
          </div>
        )}
      </div>

      {/* ficha de identidad: solo logo de jugador y numero, sin numero gigante de fondo */}
      <section
        aria-labelledby="perfil-jugador"
        className="border border-white/10 bg-[#0a0a0a]/80 p-5 sm:p-6 relative overflow-hidden shadow-2xl"
      >

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 relative z-10">
          <div className="flex items-center gap-4">
            {/* contenedor profesional de foto / logo: solo silueta vectorial y dorsal */}
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
                  className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloPosicion(
                    jugadorSeleccionado.posicion
                  )}`}
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
                {datosRendimiento.promedioTemporada}
              </span>
              <span className="text-[8px] text-neutral-500 block">/ 10</span>
            </div>

            <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                Distancia
              </span>
              <span className="text-lg font-black font-mono text-white">
                {datosRendimiento.kmPorPartido}
              </span>
              <span className="text-[8px] text-neutral-500 block">p/juego</span>
            </div>

            <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                Efectividad
              </span>
              <span className="text-lg font-black font-mono text-white">
                {datosRendimiento.pasesCompletados}
              </span>
              <span className="text-[8px] text-neutral-500 block">pases</span>
            </div>

            <div className="border border-white/10 bg-white/2 p-2.5 min-w-20">
              <span className="text-[8px] font-bold uppercase tracking-widest text-neutral-500 block">
                Minutos
              </span>
              <span className="text-lg font-black font-mono text-neutral-300">
                {datosRendimiento.minutosJugados}&apos;
              </span>
              <span className="text-[8px] text-neutral-500 block">totales</span>
            </div>
          </div>
        </div>
      </section>

      {/* grid principal de 2 columnas: radar y partidos recientes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* columna izquierda: estadisticas avanzadas (radar chart con 6 ejes) */}
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

            {/* grafico radar svg nativo */}
            <div className="w-full max-w-72 aspect-square mx-auto flex items-center justify-center py-2">
              <svg
                viewBox="0 0 320 320"
                className="w-full h-full overflow-visible"
                aria-label="Gráfico radial de estadísticas individuales"
              >
                {/* niveles hexagonales de referencia */}
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

                {/* rayos y etiquetas de cada eje */}
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

                {/* poligono de datos del futbolista */}
                <polygon
                  points={puntosPoligono}
                  fill="rgba(16, 185, 129, 0.22)"
                  stroke="#10b981"
                  strokeWidth="2"
                  className="transition-all duration-500"
                />

                {/* vertices */}
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
                      r="3.5"
                      fill="#ffffff"
                      stroke="#10b981"
                      strokeWidth="1.5"
                    />
                  );
                })}
              </svg>
            </div>

            {/* desglose cuantitativo inferior */}
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
                {datosRendimiento.promedioReciente !== null
                  ? `${datosRendimiento.promedioReciente} / 10`
                  : "Sin minutos en cancha"}
              </span>
            </div>

            {/* listado comprensible de los ultimos 5 partidos con estadisticas realistas */}
            <div className="space-y-2.5">
              {datosRendimiento.partidosRecientes.map((partido, index) => {
                const esVictoria = partido.tipo === "Victoria";
                const sinParticipacion =
                  partido.minutos === 0 || partido.calificacion === null;

                return (
                  <div
                    key={index}
                    className="border border-white/10 bg-white/2 p-3 space-y-2 hover:border-white/25 transition-all"
                  >
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        {/* insignia de resultado */}
                        <span
                          className={`text-[9px] font-black uppercase px-2 py-0.5 border ${
                            esVictoria
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-white/5 border-white/15 text-neutral-300"
                          }`}
                        >
                          {partido.tipo} {partido.resultado}
                        </span>
                        <span className="font-bold text-white text-xs uppercase tracking-wide">
                          vs {partido.rival}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">
                          ({partido.condicion})
                        </span>
                      </div>

                      {/* evaluacion del partido o indicador de no jugado */}
                      <div className="flex items-center gap-2">
                        {!sinParticipacion ? (
                          <>
                            <span className="text-[10px] text-neutral-400 font-medium">
                              Nota:
                            </span>
                            <span
                              className={`font-mono font-black text-xs px-2 py-0.5 border ${
                                partido.calificacion >= 8.0
                                  ? "text-emerald-400 bg-emerald-500/10 border-emerald-500/30"
                                  : partido.calificacion >= 6.8
                                  ? "text-white bg-white/5 border-white/20"
                                  : "text-amber-400 bg-amber-500/10 border-amber-500/30"
                              }`}
                            >
                              {partido.calificacion} / 10
                            </span>
                          </>
                        ) : (
                          <span className="text-[9px] uppercase font-bold tracking-wider text-neutral-500 border border-white/10 px-2 py-0.5 bg-white/2">
                            Sin participación
                          </span>
                        )}
                      </div>
                    </div>

                    {/* aporte tecnico individual y minutos */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-neutral-300 gap-1 pt-1 border-t border-white/5">
                      <span className="text-[11px] font-sans">
                        {partido.metricaClave}
                      </span>
                      <span className="text-[10px] text-neutral-500 font-mono shrink-0">
                        {partido.minutos > 0
                          ? `${partido.minutos}'`
                          : "0 min"}{" "}
                        • {partido.fecha}
                      </span>
                    </div>

                    {/* barra visual de rendimiento del partido (solo si participo) */}
                    {!sinParticipacion && (
                      <div className="h-1 w-full bg-white/5 overflow-hidden">
                        <div
                          className={`h-full ${
                            partido.calificacion >= 8.0
                              ? "bg-emerald-500/80"
                              : partido.calificacion >= 6.8
                              ? "bg-white/70"
                              : "bg-amber-500/80"
                          }`}
                          style={{ width: `${partido.calificacion * 10}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* balance de forma personalizado segun la participacion del jugador */}
            <div className="pt-2 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] text-neutral-400 gap-2">
              <span className="uppercase font-bold tracking-wider">
                Participación: {partidosDisputadosRecientes} de 5 cotejos
              </span>
              <span className="font-mono text-neutral-500">
                {minutosRecientesTotales} minutos en cancha
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* seccion unificada: directrices y recomendaciones tacticas */}
      <section
        aria-labelledby="seccion-directrices-tacticas"
        className="space-y-4"
      >
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3
            id="seccion-directrices-tacticas"
            className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-white inline-block"></span>
            Directrices y Recomendaciones Tácticas del Cuerpo Técnico
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Gestión Deportiva
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-widest font-bold block">
                Plan Individual del Futbolista
              </span>
              <p className="text-xs text-neutral-500 mt-0.5">
                Instrucciones y ajustes tácticos administrados por el cuerpo técnico para {jugadorSeleccionado.nombre}
              </p>
            </div>

            {!mostrarFormulario && (
              <button
                type="button"
                onClick={() => {
                  setDirEnEdicionId(null);
                  setFormDirectriz({
                    area: "Táctica",
                    prioridad: "Alta",
                    calificacion: "8.5",
                    indicacion: "",
                  });
                  setErroresDirectriz({});
                  setMostrarFormulario(true);
                }}
                className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-200 text-black transition-colors cursor-pointer self-start sm:self-auto"
              >
                + Nueva Directriz Táctica
              </button>
            )}
          </div>

          {/* feedback inline de exito */}
          {mensajeFeedback && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 p-2.5 text-xs text-emerald-400 font-semibold flex items-center gap-2 animate-fade-in">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
              <span>{mensajeFeedback}</span>
            </div>
          )}

          {/* formulario controlado para agregar o editar una directriz */}
          {mostrarFormulario && (
            <form
              onSubmit={handleGuardarDirectriz}
              noValidate
              className="border border-white/15 bg-white/2 p-4 space-y-3.5 animate-fade-in"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white">
                  {dirEnEdicionId
                    ? "Editar Directriz Táctica"
                    : "Registrar Nueva Directriz Táctica"}
                </span>
                <button
                  type="button"
                  onClick={handleCancelarForm}
                  className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cerrar
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label
                    htmlFor="dir-area"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Área de Aplicación
                  </label>
                  <select
                    id="dir-area"
                    value={formDirectriz.area}
                    onChange={(e) => handleCambioForm("area", e.target.value)}
                    className="w-full bg-[#050505] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="Táctica">Táctica</option>
                    <option value="Estrategia">Estrategia de Partido</option>
                    <option value="Técnica Individual">Técnica Individual</option>
                    <option value="Preparación Física">Preparación Física</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="dir-prioridad"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Prioridad
                  </label>
                  <select
                    id="dir-prioridad"
                    value={formDirectriz.prioridad}
                    onChange={(e) =>
                      handleCambioForm("prioridad", e.target.value)
                    }
                    className="w-full bg-[#050505] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30"
                  >
                    <option value="Alta">Alta</option>
                    <option value="Media">Media</option>
                    <option value="Estándar">Estándar</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="dir-calificacion"
                    className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                  >
                    Calificación Estimada (1 a 10)
                  </label>
                  <input
                    id="dir-calificacion"
                    type="text"
                    value={formDirectriz.calificacion}
                    onChange={(e) =>
                      handleCambioForm("calificacion", e.target.value)
                    }
                    className="w-full bg-[#050505] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30"
                    placeholder="Ej. 8.5"
                  />
                  {erroresDirectriz.calificacion && (
                    <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error">
                      <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                      {erroresDirectriz.calificacion}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label
                  htmlFor="dir-indicacion"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Directriz o Recomendación Táctica
                </label>
                <textarea
                  id="dir-indicacion"
                  rows="2"
                  value={formDirectriz.indicacion}
                  onChange={(e) =>
                    handleCambioForm("indicacion", e.target.value)
                  }
                  placeholder="Ej. Sostener presión alta durante los primeros 25 minutos para forzar pérdidas en salida rival..."
                  className="w-full bg-[#050505] border border-white/10 p-2 text-xs text-white focus:outline-none focus:border-white/30 font-sans"
                ></textarea>
                {erroresDirectriz.indicacion && (
                  <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                    {erroresDirectriz.indicacion}
                  </p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={handleCancelarForm}
                  className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider border border-white/10 text-neutral-400 hover:text-white cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-black uppercase tracking-wider bg-white hover:bg-neutral-200 text-black transition-colors cursor-pointer"
                >
                  {dirEnEdicionId ? "Actualizar Directriz" : "Guardar Directriz"}
                </button>
              </div>
            </form>
          )}

          {/* lista de directrices tacticas del futbolista */}
          <div className="space-y-2.5">
            {directricesJugador.length === 0 ? (
              <p className="text-xs text-neutral-500 italic py-2">
                No hay directrices tácticas registradas para este futbolista aún.
              </p>
            ) : (
              directricesJugador.map((dir) => (
                <div
                  key={dir.id}
                  className="border border-white/10 bg-white/2 p-3 space-y-2 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div className="flex items-center gap-2">
                      <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10">
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

                    {/* acciones discretas para admin */}
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
        </div>
      </section>

      {/* pie de pagina */}
      <footer className="pt-4 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 gap-2">
        <p>
          CC Analytics — Plataforma Académica Duoc UC // Desarrollo Fullstack II
        </p>
        <p>Módulo de analítica y optimización táctica individual</p>
      </footer>
    </div>
  );
};

export default Rendimiento;
