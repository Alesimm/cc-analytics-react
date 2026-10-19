import { useState } from "react";

// datos ficticios del ultimo partido jugado por el equipo
const ultimoPartido = {
  torneo: "Campeonato Nacional 2026 — Fecha 8",
  fecha: "Domingo 19 de Abril, 18:00 hrs",
  estadio: "Estadio Monumental David Arellano",
  local: {
    nombre: "Colo-Colo",
    sigla: "CC",
    goles: 2,
    escudo: "/photos/logo-colocolo-oficial.webp",
  },
  visita: {
    nombre: "Cobreloa",
    sigla: "COB",
    goles: 0,
    escudo: "/photos/logo-cobreloa.webp",
  },
  estado: "Finalizado",
  goleadores: [
    { minuto: "32'", jugador: "C. Palacios", detalle: "Remate cruzado" },
    { minuto: "68'", jugador: "J. Correa", detalle: "Cabezazo tras tiro de esquina" },
  ],
  estadisticas: [
    { etiqueta: "Posesión", local: "62%", visita: "38%" },
    { etiqueta: "Tiros al Arco", local: "7", visita: "2" },
    { etiqueta: "Tiros Totales", local: "15", visita: "6" },
    { etiqueta: "Pases Completados", local: "482 (86%)", visita: "294 (74%)" },
    { etiqueta: "Faltas", local: "9", visita: "14" },
    { etiqueta: "Tiros de Esquina", local: "6", visita: "2" },
  ],
};

// metricas de rendimiento general del equipo
const metricasEquipo = [
  {
    id: "posesion",
    etiqueta: "Posesión Promedio",
    valor: "58.4%",
    cambio: "+2.1%",
    detalle: "Frente a la media del torneo",
  },
  {
    id: "goles",
    etiqueta: "Goles a Favor / En Contra",
    valor: "18 / 6",
    cambio: "+12",
    detalle: "Diferencia de gol positiva",
  },
  {
    id: "tiros",
    etiqueta: "Tiros al Arco por Partido",
    valor: "6.8",
    cambio: "42%",
    detalle: "Tasa de efectividad al arco",
  },
  {
    id: "pases",
    etiqueta: "Precisión de Pases",
    valor: "85.2%",
    cambio: "+1.8%",
    detalle: "410 pases promedio por juego",
  },
];

// noticias de actualidad general del futbol chileno con lenguaje claro y profesional
const noticiasFutbolChileno = [
  {
    id: "fc-1",
    categoria: "Torneo",
    categoriaColor: "border-sky-500/50 text-sky-400",
    fecha: "Hoy",
    titulo: "U. de Chile iguala 1-1 ante Cobresal y la punta del torneo sigue muy apretada",
    resumen:
      "Un duelo intenso en el norte donde ambos equipos repartieron puntos, manteniendo la tabla de posiciones al rojo vivo.",
    fuente: "Primera División",
  },
  {
    id: "fc-2",
    categoria: "Mercado",
    categoriaColor: "border-emerald-500/50 text-emerald-400",
    fecha: "18 Abr 2026",
    titulo: "Cierra el mercado de pases con refuerzos de última hora en varios equipos",
    resumen:
      "Los clubes completaron sus planteles para la primera rueda y aseguraron nuevas contrataciones antes del límite de inscripción.",
    fuente: "Mercado de Pases",
  },
  {
    id: "fc-3",
    categoria: "Programación",
    categoriaColor: "border-purple-500/50 text-purple-400",
    fecha: "17 Abr 2026",
    titulo: "Confirmados los días y horarios oficiales para la fecha 9 del campeonato",
    resumen:
      "La ANFP dio a conocer el calendario completo del fin de semana con partidos clave en la lucha por el título y la permanencia.",
    fuente: "Programación ANFP",
  },
  {
    id: "fc-4",
    categoria: "Copas",
    categoriaColor: "border-amber-500/50 text-amber-400",
    fecha: "16 Abr 2026",
    titulo: "Listos los cruces directos para la siguiente ronda de Copa Chile",
    resumen:
      "El sorteo oficial definió las llaves de octavos de final que enfrentarán a clubes de distintas divisiones del país.",
    fuente: "Copa Chile",
  },
];

// noticias internas del club y del sistema con redaccion sencilla y directa
const noticiasClub = [
  {
    id: "club-1",
    categoria: "Táctica",
    categoriaColor: "border-blue-500/50 text-blue-400",
    fecha: "18 Abr 2026",
    titulo: "El cuerpo técnico afina los últimos movimientos tácticos para el fin de semana",
    resumen:
      "Durante la práctica matutina se repasaron salidas rápidas, jugadas de balón detenido y la presión coordinada en ataque.",
    fuente: "Cuerpo Técnico",
  },
  {
    id: "club-2",
    categoria: "Médico",
    categoriaColor: "border-amber-500/50 text-amber-400",
    fecha: "17 Abr 2026",
    titulo: "Buena recuperación: jugadores con molestias entrenan con mayor normalidad",
    resumen:
      "El área médica informó avances positivos en los futbolistas en recuperación, quienes ya completaron trabajos físicos con balón.",
    fuente: "Área Médica",
  },
  {
    id: "club-3",
    categoria: "Rendimiento",
    categoriaColor: "border-emerald-500/50 text-emerald-400",
    fecha: "15 Abr 2026",
    titulo: "El plantel mantiene una intensidad física alta en los entrenamientos",
    resumen:
      "Los registros de GPS muestran buenos índices de velocidad y distancias recorridas en los ejercicios de fútbol reducido.",
    fuente: "Preparación Física",
  },
  {
    id: "club-4",
    categoria: "Sistema",
    categoriaColor: "border-purple-500/50 text-purple-400",
    fecha: "14 Abr 2026",
    titulo: "Nuevas mejoras en los reportes individuales dentro de CC Analytics",
    resumen:
      "Se optimizó la visualización de datos post partido para que analistas y entrenadores revisen el rendimiento de forma más ágil.",
    fuente: "Equipo CC Analytics",
  },
];

const Dashboard = () => {
  // estado para alternar entre noticias de futbol chileno y noticias internas
  const [categoriaNoticias, setCategoriaNoticias] = useState("chileno");

  // lista activa segun la pestana seleccionada
  const listaNoticias =
    categoriaNoticias === "chileno" ? noticiasFutbolChileno : noticiasClub;

  return (
    <div className="space-y-8 animate-fade-in-up">
      {/* cabecera principal con titulo y datos discretos de temporada sin sobrecargar la vista */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
              CC Analytics // Inteligencia Deportiva
            </span>
            <span className="text-neutral-700 text-xs hidden sm:inline">•</span>
            {/* badge discreto de temporada oficial para evitar sobrecarga visual */}
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border border-white/10 px-2 py-0.5 bg-white/2">
              Temporada 2026
            </span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-white leading-none">
            Panel Principal
          </h2>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Resumen General del Rendimiento del Plantel
          </p>
        </div>
      </header>

      {/* cabecera visible para las metricas del plantel */}
      <section aria-labelledby="seccion-metricas" className="space-y-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h3
            id="seccion-metricas"
            className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-white inline-block"></span>
            Métricas Clave del Equipo
          </h3>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Rendimiento Colectivo
          </span>
        </div>

        {/* tarjetas con las 4 metricas mas importantes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {metricasEquipo.map((item) => (
            <div
              key={item.id}
              className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 leading-tight">
                  {item.etiqueta}
                </span>
                <span className="text-[10px] font-black tracking-wider text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5">
                  {item.cambio}
                </span>
              </div>
              <div>
                <p className="text-3xl font-black text-white tracking-wider leading-none mb-2 group-hover:translate-x-0.5 transition-transform duration-300">
                  {item.valor}
                </p>
                <p className="text-[11px] text-neutral-500 font-medium tracking-wide">
                  {item.detalle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* seccion dividida entre el ultimo partido y las noticias */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* lado izquierdo con el resumen completo del ultimo partido jugado */}
        <section
          aria-labelledby="seccion-ultimo-partido"
          className="lg:col-span-7 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h3
              id="seccion-ultimo-partido"
              className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-white inline-block"></span>
              Último Partido
            </h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
              {ultimoPartido.estado}
            </span>
          </div>

          <div className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-6 sm:p-8 space-y-6">
            {/* encabezado con el torneo y la fecha del encuentro */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] uppercase tracking-widest text-neutral-400 gap-1 border-b border-white/5 pb-4">
              <span className="font-bold text-white">
                {ultimoPartido.torneo}
              </span>
              <span>{ultimoPartido.fecha}</span>
            </div>

            {/* marcador central con los equipos y el resultado final */}
            <div className="grid grid-cols-3 items-center text-center py-4">
              {/* equipo local: colo-colo con su escudo oficial webp sin fondo blanco */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border border-white/10 bg-white/5 flex items-center justify-center p-2">
                  <img
                    src={ultimoPartido.local.escudo}
                    alt={ultimoPartido.local.nombre}
                    className="w-12 h-auto max-h-12 object-contain drop-shadow"
                  />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    {ultimoPartido.local.nombre}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Local
                  </span>
                </div>
              </div>

              {/* resultado y estado del partido */}
              <div className="flex flex-col items-center">
                <div className="flex items-center justify-center gap-3 sm:gap-4 font-black text-4xl sm:text-5xl text-white tracking-widest">
                  <span>{ultimoPartido.local.goles}</span>
                  <span className="text-neutral-600 text-2xl font-light">-</span>
                  <span>{ultimoPartido.visita.goles}</span>
                </div>
                <span className="mt-2 text-[10px] uppercase font-bold tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2.5 py-0.5">
                  Victoria
                </span>
                <span className="mt-2 text-[10px] uppercase tracking-wider text-neutral-500 text-center">
                  {ultimoPartido.estadio}
                </span>
              </div>

              {/* equipo visitante: cobreloa con su escudo oficial webp sin fondo blanco */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 border border-white/10 bg-white/5 flex items-center justify-center p-2">
                  <img
                    src={ultimoPartido.visita.escudo}
                    alt={ultimoPartido.visita.nombre}
                    className="w-12 h-auto max-h-12 object-contain drop-shadow"
                  />
                </div>
                <div>
                  <h4 className="text-sm sm:text-base font-black uppercase tracking-wider text-white">
                    {ultimoPartido.visita.nombre}
                  </h4>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                    Visita
                  </span>
                </div>
              </div>
            </div>

            {/* lista de goles con el minuto y nombre del jugador */}
            <div className="border-t border-white/5 pt-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 mb-2">
                Acontecimientos del partido
              </p>
              <div className="space-y-1.5">
                {ultimoPartido.goleadores.map((gol, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-xs text-neutral-300 bg-white/2 border border-white/5 px-3 py-2"
                  >
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-white text-[11px] bg-white/10 px-1.5 py-0.5">
                        {gol.minuto}
                      </span>
                      <span className="font-bold uppercase tracking-wider text-white text-[12px]">
                        {gol.jugador}
                      </span>
                    </div>
                    <span className="text-[11px] text-neutral-400">
                      {gol.detalle}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* tabla comparativa de estadisticas del encuentro */}
            <div className="border-t border-white/5 pt-4 space-y-3">
              <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Comparativa Estadística del Partido
              </p>
              <div className="space-y-2">
                {ultimoPartido.estadisticas.map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between text-xs py-1 border-b border-white/5 last:border-0"
                  >
                    <span className="font-mono font-bold text-white w-20 text-left">
                      {stat.local}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 text-center flex-1">
                      {stat.etiqueta}
                    </span>
                    <span className="font-mono font-bold text-neutral-400 w-20 text-right">
                      {stat.visita}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* lado derecho con el panel de noticias y boton selector */}
        <section
          aria-labelledby="seccion-noticias"
          className="lg:col-span-5 space-y-4"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/10 pb-2 gap-2">
            <h3
              id="seccion-noticias"
              className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-white inline-block"></span>
              Noticias y Actualidad
            </h3>

            {/* botones minimalistas para alternar entre futbol chileno y noticias del club */}
            <div className="flex items-center gap-1 bg-white/5 p-0.5 border border-white/10 self-start sm:self-auto">
              <button
                type="button"
                onClick={() => setCategoriaNoticias("chileno")}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  categoriaNoticias === "chileno"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Fútbol Chileno
              </button>
              <button
                type="button"
                onClick={() => setCategoriaNoticias("club")}
                className={`px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider transition-colors duration-200 cursor-pointer ${
                  categoriaNoticias === "club"
                    ? "bg-white text-black"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                Club y Sistema
              </button>
            </div>
          </div>

          {/* lista de noticias segun la categoria seleccionada */}
          <div className="space-y-3">
            {listaNoticias.map((noticia) => (
              <article
                key={noticia.id}
                className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-4 hover:border-white/30 transition-all duration-300 space-y-2 group"
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${noticia.categoriaColor}`}
                  >
                    {noticia.categoria}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-medium">
                    {noticia.fecha}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white leading-snug uppercase tracking-wide group-hover:text-neutral-200 transition-colors">
                  {noticia.titulo}
                </h4>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {noticia.resumen}
                </p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 font-bold">
                  <span>{noticia.fuente}</span>
                  <span className="text-neutral-400 group-hover:text-white transition-colors">
                    Ficha Informativa →
                  </span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      {/* pie de pagina con la nota de datos simulados para la asignatura */}
      <footer className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-600 gap-2">
        <p>
          CC Analytics — Plataforma Académica Duoc UC // Desarrollo Fullstack II
        </p>
        <p>Datos simulados para control de interfaz deportiva</p>
      </footer>
    </div>
  );
};

export default Dashboard;

