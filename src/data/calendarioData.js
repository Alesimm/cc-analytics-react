// datos simulados del calendario y fixture de partidos de colo-colo
// temporada 2026: campeonato nacional, copa libertadores y copa chile

export const ESCUDO_COLO_COLO = "/photos/logo-colocolo-oficial.webp";
export const ESCUDO_CDUC = "/photos/logo-cduc.webp";
export const ESCUDO_COBRELOA = "/photos/logo-cobreloa.webp";

export const PARTIDOS_INICIALES = [
  // proximos encuentros
  {
    id: "part-prox-1",
    tipo: "proximo",
    rival: "Universidad Católica",
    siglaRival: "UC",
    rivalEscudo: ESCUDO_CDUC,
    rivalEscudoColor: "#0284c7",
    condicion: "Local",
    torneo: "Campeonato Nacional",
    fecha: "2026-11-08",
    hora: "18:00",
    estadio: "Estadio Monumental David Arellano",
    ciudad: "Santiago",
    estado: "Confirmado",
    arbitro: "Piero Maza",
    jornada: "Fecha 28",
    clima: "Despejado 22°C",
    relevancia: "Clásico decisivo por la cima del torneo",
  },
  {
    id: "part-prox-2",
    tipo: "proximo",
    rival: "Palmeiras",
    siglaRival: "PAL",
    rivalEscudo: null,
    rivalEscudoColor: "#15803d",
    condicion: "Visita",
    torneo: "Copa Libertadores",
    fecha: "2026-11-14",
    hora: "21:30",
    estadio: "Allianz Parque",
    ciudad: "São Paulo, Brasil",
    estado: "Programado",
    arbitro: "Wilmar Roldán",
    jornada: "Cuartos de Final (Ida)",
    clima: "Húmedo 19°C",
    relevancia: "Duelo continental de alta exigencia táctica",
  },
  {
    id: "part-prox-3",
    tipo: "proximo",
    rival: "Coquimbo Unido",
    siglaRival: "COQ",
    rivalEscudo: null,
    rivalEscudoColor: "#ca8a04",
    condicion: "Visita",
    torneo: "Campeonato Nacional",
    fecha: "2026-11-21",
    hora: "17:30",
    estadio: "Estadio Francisco Sánchez Rumoroso",
    ciudad: "Coquimbo",
    estado: "Programado",
    arbitro: "Cristián Garay",
    jornada: "Fecha 29",
    clima: "Parcial 18°C",
    relevancia: "Penúltima fecha del campeonato",
  },
  {
    id: "part-prox-4",
    tipo: "proximo",
    rival: "Everton",
    siglaRival: "EVE",
    rivalEscudo: null,
    rivalEscudoColor: "#1e3a8a",
    condicion: "Local",
    torneo: "Campeonato Nacional",
    fecha: "2026-11-28",
    hora: "19:00",
    estadio: "Estadio Monumental David Arellano",
    ciudad: "Santiago",
    estado: "Programado",
    arbitro: "Por confirmar",
    jornada: "Fecha 30",
    clima: "Despejado 24°C",
    relevancia: "Cierre del torneo en Macul",
  },

  // partidos anteriores finalizados con resultado y estadisticas tecnicas
  {
    id: "part-ant-1",
    tipo: "anterior",
    rival: "Universidad de Chile",
    siglaRival: "UCH",
    rivalEscudo: null,
    rivalEscudoColor: "#1d4ed8",
    condicion: "Local",
    torneo: "Campeonato Nacional",
    fecha: "2026-10-27",
    hora: "18:00",
    estadio: "Estadio Monumental David Arellano",
    golesColoColo: 2,
    golesRival: 1,
    resultado: "Victoria",
    jornada: "Fecha 27",
    goleadores: ["J. Correa 34'", "C. Palacios 78'"],
    goleadoresRival: ["L. Pons 62'"],
    estadisticas: {
      posesion: 58,
      tirosArco: 7,
      tirosRival: 4,
      faltas: 12,
      tarjetasAmarillas: 2,
      tarjetasRojas: 0,
      precisionPases: 84,
    },
    resumen: "Victoria táctica clave con dominio de la medular y contundencia en los momentos determinantes del Superclásico.",
  },
  {
    id: "part-ant-2",
    tipo: "anterior",
    rival: "Junior de Barranquilla",
    siglaRival: "JUN",
    rivalEscudo: null,
    rivalEscudoColor: "#dc2626",
    condicion: "Visita",
    torneo: "Copa Libertadores",
    fecha: "2026-10-20",
    hora: "20:30",
    estadio: "Estadio Metropolitano Roberto Meléndez",
    golesColoColo: 2,
    golesRival: 1,
    resultado: "Victoria",
    jornada: "Octavos de Final (Vuelta)",
    goleadores: ["L. Cepeda 43'", "M. Falcón 74'"],
    goleadoresRival: ["C. Bacca 45+1'"],
    estadisticas: {
      posesion: 46,
      tirosArco: 5,
      tirosRival: 6,
      faltas: 16,
      tarjetasAmarillas: 3,
      tarjetasRojas: 0,
      precisionPases: 79,
    },
    resumen: "Clasificación histórica a cuartos de final con gol agónico de pelota parada y solidez defensiva en el caribe colombiano.",
  },
  {
    id: "part-ant-3",
    tipo: "anterior",
    rival: "Palestino",
    siglaRival: "PAL",
    rivalEscudo: null,
    rivalEscudoColor: "#166534",
    condicion: "Visita",
    torneo: "Campeonato Nacional",
    fecha: "2026-10-12",
    hora: "15:00",
    estadio: "Estadio Municipal de La Cisterna",
    golesColoColo: 3,
    golesRival: 2,
    resultado: "Victoria",
    jornada: "Fecha 26",
    goleadores: ["J. Correa 18'", "J. Correa 55'", "M. Bolados 88'"],
    goleadoresRival: ["B. Carrasco 29' (P)", "J. Benítez 68'"],
    estadisticas: {
      posesion: 62,
      tirosArco: 9,
      tirosRival: 5,
      faltas: 10,
      tarjetasAmarillas: 1,
      tarjetasRojas: 0,
      precisionPases: 86,
    },
    resumen: "Remontada en La Cisterna con doblete de Javier Correa y presión alta sostenida.",
  },
  {
    id: "part-ant-4",
    tipo: "anterior",
    rival: "Cobresal",
    siglaRival: "CSL",
    rivalEscudo: ESCUDO_COBRELOA,
    rivalEscudoColor: "#ea580c",
    condicion: "Local",
    torneo: "Campeonato Nacional",
    fecha: "2026-10-04",
    hora: "20:00",
    estadio: "Estadio Monumental David Arellano",
    golesColoColo: 2,
    golesRival: 0,
    resultado: "Victoria",
    jornada: "Fecha 25",
    goleadores: ["J. Correa 2'", "L. Cepeda 49'"],
    goleadoresRival: [],
    estadisticas: {
      posesion: 65,
      tirosArco: 8,
      tirosRival: 2,
      faltas: 8,
      tarjetasAmarillas: 0,
      tarjetasRojas: 0,
      precisionPases: 89,
    },
    resumen: "Control absoluto del partido desde el minuto inicial, neutralizando las salidas rápidas del rival minero.",
  },
  {
    id: "part-ant-5",
    tipo: "anterior",
    rival: "River Plate",
    siglaRival: "RIV",
    rivalEscudo: null,
    rivalEscudoColor: "#b91c1c",
    condicion: "Visita",
    torneo: "Copa Libertadores",
    fecha: "2026-09-24",
    hora: "21:30",
    estadio: "Estadio Mâs Monumental",
    golesColoColo: 0,
    golesRival: 1,
    resultado: "Derrota",
    jornada: "Fase de Grupos",
    goleadores: [],
    goleadoresRival: ["F. Colidio 16'"],
    estadisticas: {
      posesion: 48,
      tirosArco: 3,
      tirosRival: 7,
      faltas: 18,
      tarjetasAmarillas: 4,
      tarjetasRojas: 0,
      precisionPases: 81,
    },
    resumen: "Encuentro cerrado y de alto roce en Buenos Aires donde faltó profundidad en los últimos metros para rescatar el empate.",
  },
  {
    id: "part-ant-6",
    tipo: "anterior",
    rival: "Deportes Iquique",
    siglaRival: "IQQ",
    rivalEscudo: null,
    rivalEscudoColor: "#06b6d4",
    condicion: "Visita",
    torneo: "Campeonato Nacional",
    fecha: "2026-09-15",
    hora: "17:30",
    estadio: "Estadio Tierra de Campeones",
    golesColoColo: 2,
    golesRival: 2,
    resultado: "Empate",
    jornada: "Fecha 24",
    goleadores: ["A. Vidal 41'", "C. Palacios 67'"],
    goleadoresRival: ["S. Pino 22'", "E. Hoyos 81'"],
    estadisticas: {
      posesion: 54,
      tirosArco: 6,
      tirosRival: 5,
      faltas: 14,
      tarjetasAmarillas: 2,
      tarjetasRojas: 0,
      precisionPases: 83,
    },
    resumen: "Duelo vibrante en el norte con alternancia en el marcador y reparto de puntos.",
  },
];

export const STORAGE_KEY_CALENDARIO = "cc_analytics_calendario_partidos_v1";

// resolver de forma garantizada el escudo del rival
export const resolverEscudoRival = (partido) => {
  if (!partido) return null;
  if (partido.rivalEscudo) return partido.rivalEscudo;
  const nombre = (partido.rival || "").toLowerCase();
  if (nombre.includes("católica") || nombre.includes("catolica") || partido.siglaRival === "UC") {
    return ESCUDO_CDUC;
  }
  if (nombre.includes("cobreloa") || partido.siglaRival === "COB") {
    return ESCUDO_COBRELOA;
  }
  return null;
};

// obtener todos los partidos con persistencia y sincronizacion de logos en localstorage
export const obtenerPartidos = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_CALENDARIO);
    if (!raw) return PARTIDOS_INICIALES;
    const datos = JSON.parse(raw);
    if (!Array.isArray(datos)) return PARTIDOS_INICIALES;

    // sincronizar escudos oficiales si en localstorage estaban nulos o desactualizados
    return datos.map((p) => {
      const escudoSincronizado = resolverEscudoRival(p);
      return {
        ...p,
        rivalEscudo: escudoSincronizado || p.rivalEscudo,
      };
    });
  } catch (error) {
    console.warn("error al leer calendario de localstorage:", error);
    return PARTIDOS_INICIALES;
  }
};

// guardar nuevo partido en el calendario (crud: create)
export const guardarNuevoPartido = (nuevoPartido) => {
  try {
    const actuales = obtenerPartidos();
    const actualizados = [nuevoPartido, ...actuales];
    localStorage.setItem(STORAGE_KEY_CALENDARIO, JSON.stringify(actualizados));
    return true;
  } catch (error) {
    console.warn("error al guardar nuevo partido:", error);
    return false;
  }
};

// eliminar partido del calendario (crud: delete)
export const eliminarPartido = (id) => {
  try {
    const actuales = obtenerPartidos();
    const filtrados = actuales.filter((p) => p.id !== id);
    localStorage.setItem(STORAGE_KEY_CALENDARIO, JSON.stringify(filtrados));
    return true;
  } catch (error) {
    console.warn("error al eliminar partido:", error);
    return false;
  }
};
