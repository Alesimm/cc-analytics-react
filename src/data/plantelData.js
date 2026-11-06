// Datos y operaciones de persistencia en almacenamiento local para el plantel profesional de Colo-Colo
// Módulo de administración de plantilla, dorsales y fichas técnicas

export const PLANTEL_INICIAL = [
  {
    id: "jug-1",
    nombre: "Brayan Cortés",
    dorsal: 1,
    posicion: "Arquero",
    edad: 29,
    altura: "1.86 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 24,
  },
  {
    id: "jug-2",
    nombre: "Fernando de Paul",
    dorsal: 30,
    posicion: "Arquero",
    edad: 33,
    altura: "1.83 m",
    pie: "Derecho",
    rol: "Suplente",
    estado: "Disponible",
    partidos: 8,
  },
  {
    id: "jug-3",
    nombre: "Maximiliano Falcón",
    dorsal: 37,
    posicion: "Defensa",
    edad: 27,
    altura: "1.80 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 26,
  },
  {
    id: "jug-4",
    nombre: "Alan Saldivia",
    dorsal: 4,
    posicion: "Defensa",
    edad: 22,
    altura: "1.81 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "En recuperación",
    partidos: 20,
  },
  {
    id: "jug-5",
    nombre: "Erick Wiemberg",
    dorsal: 21,
    posicion: "Defensa",
    edad: 30,
    altura: "1.78 m",
    pie: "Izquierdo",
    rol: "Titular",
    estado: "Disponible",
    partidos: 25,
  },
  {
    id: "jug-6",
    nombre: "Óscar Opazo",
    dorsal: 16,
    posicion: "Defensa",
    edad: 34,
    altura: "1.70 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 22,
  },
  {
    id: "jug-7",
    nombre: "Esteban Pavez",
    dorsal: 8,
    posicion: "Mediocampista",
    edad: 34,
    altura: "1.80 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 28,
  },
  {
    id: "jug-8",
    nombre: "Arturo Vidal",
    dorsal: 23,
    posicion: "Mediocampista",
    edad: 37,
    altura: "1.80 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 23,
  },
  {
    id: "jug-9",
    nombre: "Vicente Pizarro",
    dorsal: 34,
    posicion: "Mediocampista",
    edad: 22,
    altura: "1.76 m",
    pie: "Izquierdo",
    rol: "Titular",
    estado: "Disponible",
    partidos: 27,
  },
  {
    id: "jug-10",
    nombre: "Carlos Palacios",
    dorsal: 7,
    posicion: "Mediocampista",
    edad: 24,
    altura: "1.81 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 25,
  },
  {
    id: "jug-11",
    nombre: "Javier Correa",
    dorsal: 9,
    posicion: "Delantero",
    edad: 32,
    altura: "1.86 m",
    pie: "Derecho",
    rol: "Titular",
    estado: "Disponible",
    partidos: 19,
  },
  {
    id: "jug-12",
    nombre: "Guillermo Paiva",
    dorsal: 29,
    posicion: "Delantero",
    edad: 27,
    altura: "1.82 m",
    pie: "Derecho",
    rol: "Suplente",
    estado: "Disponible",
    partidos: 21,
  },
  {
    id: "jug-13",
    nombre: "Lucas Cepeda",
    dorsal: 32,
    posicion: "Delantero",
    edad: 22,
    altura: "1.77 m",
    pie: "Izquierdo",
    rol: "Titular",
    estado: "Disponible",
    partidos: 24,
  },
  {
    id: "jug-14",
    nombre: "Marcos Bolados",
    dorsal: 11,
    posicion: "Delantero",
    edad: 28,
    altura: "1.70 m",
    pie: "Derecho",
    rol: "Suplente",
    estado: "Disponible",
    partidos: 18,
  },
  {
    id: "jug-15",
    nombre: "Alexander Oroz",
    dorsal: 20,
    posicion: "Delantero",
    edad: 21,
    altura: "1.72 m",
    pie: "Derecho",
    rol: "Reserva",
    estado: "En recuperación",
    partidos: 6,
  },
];

const CLAVE_STORAGE = "cc_analytics_plantel_v1";
const CLAVE_DIRECTRICES = "cc_analytics_directrices_v2";

// cargar jugadores desde localstorage o inicializar si no existen
export const obtenerPlantel = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE);
    if (!guardado) {
      localStorage.setItem(CLAVE_STORAGE, JSON.stringify(PLANTEL_INICIAL));
      return PLANTEL_INICIAL;
    }
    const datos = JSON.parse(guardado);
    return Array.isArray(datos) && datos.length > 0 ? datos : PLANTEL_INICIAL;
  } catch {
    return PLANTEL_INICIAL;
  }
};

// crear o actualizar un jugador
export const guardarJugadorStorage = (jugador) => {
  const actual = obtenerPlantel();
  let actualizado;

  if (jugador.id) {
    actualizado = actual.map((item) =>
      item.id === jugador.id ? { ...item, ...jugador } : item
    );
  } else {
    const nuevo = {
      ...jugador,
      id: `jug-${Date.now()}`,
      partidos: jugador.partidos ? Number(jugador.partidos) : 0,
    };
    actualizado = [nuevo, ...actual];
  }

  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(actualizado));
  } catch {
    // fallback en memoria
  }

  return actualizado;
};

// eliminar un jugador por id
export const eliminarJugadorStorage = (id) => {
  const actual = obtenerPlantel();
  const actualizado = actual.filter((j) => j.id !== id);

  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(actualizado));
  } catch {
    // fallback en memoria
  }

  return actualizado;
};

// restablecer al plantel original de muestra
export const restablecerPlantelStorage = () => {
  try {
    localStorage.setItem(CLAVE_STORAGE, JSON.stringify(PLANTEL_INICIAL));
  } catch {
    // fallback
  }
  return PLANTEL_INICIAL;
};

// directrices y recomendaciones tacticas iniciales (cuerpo tecnico / admin)
export const DIRECTRICES_INICIALES = [
  // arturo vidal (#23)
  {
    id: "dir-1",
    jugadorId: "jug-8",
    jugadorNombre: "Arturo Vidal",
    area: "Táctica",
    prioridad: "Alta",
    calificacion: 8.8,
    indicacion: "Sostener presión alta en campo rival durante los primeros 25 minutos para forzar salidas defectuosas.",
    fecha: "20 Abr 2026",
  },
  {
    id: "dir-2",
    jugadorId: "jug-8",
    jugadorNombre: "Arturo Vidal",
    area: "Estrategia",
    prioridad: "Alta",
    calificacion: 8.6,
    indicacion: "Distribuir en rombo con Vicente Pizarro para oxigenar los cambios de orientación de banda a banda.",
    fecha: "18 Abr 2026",
  },
  {
    id: "dir-3",
    jugadorId: "jug-8",
    jugadorNombre: "Arturo Vidal",
    area: "Técnica Individual",
    prioridad: "Media",
    calificacion: 8.4,
    indicacion: "Llegar al área contraria en segunda oleada tras centros rasantes de los extremos.",
    fecha: "16 Abr 2026",
  },
  {
    id: "dir-4",
    jugadorId: "jug-8",
    jugadorNombre: "Arturo Vidal",
    area: "Preparación Física",
    prioridad: "Media",
    calificacion: 8.2,
    indicacion: "Dosificar aceleraciones en bloque medio cuando el marcador sea favorable en el segundo tiempo.",
    fecha: "14 Abr 2026",
  },
  // brayan cortes (#1)
  {
    id: "dir-5",
    jugadorId: "jug-1",
    jugadorNombre: "Brayan Cortés",
    area: "Técnica Individual",
    prioridad: "Alta",
    calificacion: 8.7,
    indicacion: "Priorizar salida rápida con pase rasante hacia laterales para eludir el primer bloque de presión rival.",
    fecha: "19 Abr 2026",
  },
  {
    id: "dir-6",
    jugadorId: "jug-1",
    jugadorNombre: "Brayan Cortés",
    area: "Táctica",
    prioridad: "Alta",
    calificacion: 8.5,
    indicacion: "Mantener posicionamiento adelantado como líbero anticipando balones filtrados a la espalda de centrales.",
    fecha: "17 Abr 2026",
  },
  {
    id: "dir-7",
    jugadorId: "jug-1",
    jugadorNombre: "Brayan Cortés",
    area: "Estrategia",
    prioridad: "Media",
    calificacion: 8.1,
    indicacion: "Ordenar basculaciones de la zaga en tiros de esquina cerrados al primer vertical.",
    fecha: "15 Abr 2026",
  },
  // maximiliano falcon (#37)
  {
    id: "dir-8",
    jugadorId: "jug-3",
    jugadorNombre: "Maximiliano Falcón",
    area: "Táctica",
    prioridad: "Alta",
    calificacion: 8.6,
    indicacion: "Anticipar la referencia de pase rival y despejar hacia zonas exteriores de seguridad sin comprometer la zaga.",
    fecha: "19 Abr 2026",
  },
  {
    id: "dir-9",
    jugadorId: "jug-3",
    jugadorNombre: "Maximiliano Falcón",
    area: "Estrategia",
    prioridad: "Alta",
    calificacion: 8.4,
    indicacion: "Cerrar el intervalo con el lateral izquierdo durante transiciones rápidas del adversario.",
    fecha: "17 Abr 2026",
  },
  // carlos palacios (#7)
  {
    id: "dir-10",
    jugadorId: "jug-10",
    jugadorNombre: "Carlos Palacios",
    area: "Táctica",
    prioridad: "Alta",
    calificacion: 8.7,
    indicacion: "Recibir a espaldas de la primera línea de volantes rivales y buscar el giro rápido hacia el arco.",
    fecha: "19 Abr 2026",
  },
  {
    id: "dir-11",
    jugadorId: "jug-10",
    jugadorNombre: "Carlos Palacios",
    area: "Técnica Individual",
    prioridad: "Media",
    calificacion: 8.3,
    indicacion: "Asociarse en corto en tres cuartos de cancha y buscar remate de media distancia ante bloques cerrados.",
    fecha: "18 Abr 2026",
  },
  // vicente pizarro (#34)
  {
    id: "dir-12",
    jugadorId: "jug-9",
    jugadorNombre: "Vicente Pizarro",
    area: "Táctica",
    prioridad: "Alta",
    calificacion: 8.6,
    indicacion: "Mantener el primer pase progresivo hacia adelante para romper líneas de presión adversaria.",
    fecha: "19 Abr 2026",
  },
  // javier correa (#9)
  {
    id: "dir-13",
    jugadorId: "jug-11",
    jugadorNombre: "Javier Correa",
    area: "Táctica",
    prioridad: "Alta",
    calificacion: 8.5,
    indicacion: "Fijar a los centrales rivales para liberar la llegada frontal de los volantes ofensivos.",
    fecha: "19 Abr 2026",
  },
  // guillermo paiva (#29, suplente)
  {
    id: "dir-14",
    jugadorId: "jug-12",
    jugadorNombre: "Guillermo Paiva",
    area: "Preparación Física",
    prioridad: "Alta",
    calificacion: 6.8,
    indicacion: "Aumentar intensidad en los primeros 10 minutos al ingresar desde la banca para fijar a la defensa rival.",
    fecha: "18 Abr 2026",
  },
  {
    id: "dir-15",
    jugadorId: "jug-12",
    jugadorNombre: "Guillermo Paiva",
    area: "Técnica Individual",
    prioridad: "Media",
    calificacion: 6.5,
    indicacion: "Controlar la ansiedad en el remate de primera intención y asegurar la posesión en balones aéreos divididos.",
    fecha: "16 Abr 2026",
  },
  // marcos bolados (#11, suplente)
  {
    id: "dir-16",
    jugadorId: "jug-14",
    jugadorNombre: "Marcos Bolados",
    area: "Táctica",
    prioridad: "Media",
    calificacion: 6.7,
    indicacion: "Mejorar la toma de decisiones al llegar a línea de fondo; priorizar el pase atrás al punto penal.",
    fecha: "18 Abr 2026",
  },
];

// directrices tácticas predeterminadas para futbolistas sin registro manual
const generarDirectricesPorDefecto = (jugador) => {
  const defaults = {
    Arquero: [
      { area: "Técnica Individual", prioridad: "Alta", calificacion: 8.0, indicacion: "Priorizar salida rasa hacia centrales para eludir la primera línea de presión rival." },
      { area: "Táctica", prioridad: "Media", calificacion: 7.8, indicacion: "Mantener posición adelantada como líbero anticipando balones largos a la espalda." },
    ],
    Defensa: [
      { area: "Táctica", prioridad: "Alta", calificacion: 8.1, indicacion: "Ajustar distancia de basculación en bloque medio para evitar filtraciones interiores." },
      { area: "Estrategia", prioridad: "Media", calificacion: 7.9, indicacion: "Sostener anticipación en duelos aéreos y despejar hacia zonas exteriores." },
    ],
    Mediocampista: [
      { area: "Táctica", prioridad: "Alta", calificacion: 8.2, indicacion: "Intensificar la presión tras pérdida durante los primeros 5 segundos en zona dos." },
      { area: "Estrategia", prioridad: "Media", calificacion: 8.0, indicacion: "Sostener distribución en rombo para garantizar línea de pase constante a los costados." },
    ],
    Delantero: [
      { area: "Táctica", prioridad: "Alta", calificacion: 8.0, indicacion: "Atacar el primer palo en centros laterales con desmarque de ruptura diagonal." },
      { area: "Técnica Individual", prioridad: "Media", calificacion: 7.7, indicacion: "Presionar la salida limpia de los centrales rivales para forzar balones divididos." },
    ],
  };

  const lista = defaults[jugador.posicion] || defaults.Mediocampista;
  return lista.map((item, idx) => ({
    id: `dir-def-${jugador.id}-${idx}`,
    jugadorId: jugador.id,
    jugadorNombre: jugador.nombre,
    area: item.area,
    prioridad: item.prioridad,
    calificacion: item.calificacion,
    indicacion: item.indicacion,
    fecha: "Directriz de Temporada",
  }));
};

// obtener directrices tacticas desde localstorage
export const obtenerDirectricesStorage = (jugadorId = null) => {
  try {
    const guardado = localStorage.getItem(CLAVE_DIRECTRICES);
    let lista = DIRECTRICES_INICIALES;
    if (guardado) {
      const parsed = JSON.parse(guardado);
      if (Array.isArray(parsed) && parsed.length > 0) {
        lista = parsed;
      }
    } else {
      localStorage.setItem(CLAVE_DIRECTRICES, JSON.stringify(DIRECTRICES_INICIALES));
    }

    if (jugadorId) {
      const filtradas = lista.filter((d) => d.jugadorId === jugadorId);
      if (filtradas.length > 0) return filtradas;
      const jugador = obtenerPlantel().find((j) => j.id === jugadorId);
      return jugador ? generarDirectricesPorDefecto(jugador) : [];
    }
    return lista;
  } catch {
    if (jugadorId) {
      const filtradas = DIRECTRICES_INICIALES.filter((d) => d.jugadorId === jugadorId);
      if (filtradas.length > 0) return filtradas;
      const jugador = PLANTEL_INICIAL.find((j) => j.id === jugadorId);
      return jugador ? generarDirectricesPorDefecto(jugador) : [];
    }
    return DIRECTRICES_INICIALES;
  }
};

// guardar o editar directriz tactica
export const guardarDirectrizStorage = (directriz) => {
  try {
    const guardado = localStorage.getItem(CLAVE_DIRECTRICES);
    let lista = guardado ? JSON.parse(guardado) : DIRECTRICES_INICIALES;
    if (!Array.isArray(lista)) lista = [...DIRECTRICES_INICIALES];

    if (directriz.id && !directriz.id.startsWith("dir-def-")) {
      lista = lista.map((item) =>
        item.id === directriz.id ? { ...item, ...directriz } : item
      );
    } else {
      const nueva = {
        ...directriz,
        id: `dir-${Date.now()}`,
        fecha: "Hoy",
      };
      lista = [nueva, ...lista];
    }

    localStorage.setItem(CLAVE_DIRECTRICES, JSON.stringify(lista));
    return lista;
  } catch {
    return [];
  }
};

// eliminar directriz tactica
export const eliminarDirectrizStorage = (id) => {
  try {
    const guardado = localStorage.getItem(CLAVE_DIRECTRICES);
    let lista = guardado ? JSON.parse(guardado) : DIRECTRICES_INICIALES;
    if (!Array.isArray(lista)) lista = [...DIRECTRICES_INICIALES];

    const filtrada = lista.filter((item) => item.id !== id);
    localStorage.setItem(CLAVE_DIRECTRICES, JSON.stringify(filtrada));
    return filtrada;
  } catch {
    return [];
  }
};

// compatibilidad retroactiva con nombres anteriores
export const obtenerObservacionesStorage = obtenerDirectricesStorage;
export const guardarObservacionStorage = guardarDirectrizStorage;
export const eliminarObservacionStorage = eliminarDirectrizStorage;

// partidos recientes realistas con partidos destacados y tambien partidos dificiles/suplentes
const PARTIDOS_POR_JUGADOR = {
  // arturo vidal (#23, titular indiscutido pero con desgaste y partido dificil)
  "jug-8": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 8.6, minutos: 90, metricaClave: "1 gol anotado • 92% precisión en pases" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 8.9, minutos: 90, metricaClave: "1 asistencia decisiva • MVP del clásico" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.4, minutos: 82, metricaClave: "7 recuperaciones • 11.4 km recorridos" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 6.8, minutos: 70, metricaClave: "1 tarjeta amarilla • 4 faltas recibidas • desgaste medio" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 8.2, minutos: 85, metricaClave: "88% pases acertados • 2 remates al arco" },
  ],
  // brayan cortes (#1, arquero titular con partido dificil)
  "jug-1": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 8.5, minutos: 90, metricaClave: "Valla invicta • 5 atajadas determinantes" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 8.9, minutos: 90, metricaClave: "Penal atajado en min 84 • MVP clásico" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 6.5, minutos: 90, metricaClave: "1 gol encajado con rebote corto • 2 atajadas" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 7.8, minutos: 90, metricaClave: "4 atajadas clave bajo los tres postes" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.9, minutos: 90, metricaClave: "4 atajadas • 81% efectividad salida con pie" },
  ],
  // fernando de paul (#30, arquero suplente, alternancia de minutos)
  "jug-2": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: null, minutos: 0, metricaClave: "En banca de suplentes • sin minutos en cancha" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: null, minutos: 0, metricaClave: "En banca de suplentes • apoyo desde el banquillo" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: null, minutos: 0, metricaClave: "En banca de suplentes sin ingreso" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 6.6, minutos: 90, metricaClave: "Titular por rotación • 3 atajadas • 1 gol concedido" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.1, minutos: 90, metricaClave: "Titular • 4 atajadas seguras • 1 gol recibido" },
  ],
  // maximiliano falcon (#37, defensa titular)
  "jug-3": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 8.4, minutos: 90, metricaClave: "Valla invicta • 8 duelos individuales ganados" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 8.7, minutos: 90, metricaClave: "Salvada en la línea en min 72 • 10 duelos" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.6, minutos: 90, metricaClave: "7 recuperaciones limpias sin falta" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 6.5, minutos: 90, metricaClave: "1 tarjeta amarilla • 1 desatención en marca de gol" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.9, minutos: 90, metricaClave: "5 despejes aéreos efectivos" },
  ],
  // alan saldivia (#4, titular en recuperacion)
  "jug-4": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: null, minutos: 0, metricaClave: "En recuperación médica • trabajo diferenciado" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 8.5, minutos: 90, metricaClave: "7 duelos ganados • solidez defensiva" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 5.9, minutos: 35, metricaClave: "Sustituido en min 35' por molestia muscular" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 7.1, minutos: 90, metricaClave: "4 intercepciones • salida bajo presión" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.8, minutos: 90, metricaClave: "82% precisión en salida limpia" },
  ],
  // carlos palacios (#7, volante ofensivo titular)
  "jug-10": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 8.8, minutos: 88, metricaClave: "1 gol • 1 asistencia • Generador principal" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 6.3, minutos: 64, metricaClave: "Férrea marca personal rival • 4 pérdidas de balón" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 8.1, minutos: 90, metricaClave: "4 pases clave • 85% pases en último tercio" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 7.5, minutos: 90, metricaClave: "3 regates exitosos • 1 tiro en el travesaño" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 8.9, minutos: 90, metricaClave: "1 gol de tiro libre • 2 asistencias" },
  ],
  // guillermo paiva (#29, delantero suplente con minutos desde el banco)
  "jug-12": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 6.2, minutos: 18, metricaClave: "Ingresó min 72' • 1 remate desviado en contraataque" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 6.0, minutos: 12, metricaClave: "Ingresó min 78' • sin ocasiones de remate" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 6.5, minutos: 45, metricaClave: "Ingreso en entretiempo • 1 falta cometida • pivoteo difícil" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 5.8, minutos: 28, metricaClave: "Ingresó min 62' • 1 tarjeta amarilla • 2 balones perdidos" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.4, minutos: 32, metricaClave: "Ingresó min 58' • 1 gol en los descuentos (90+2')" },
  ],
  // marcos bolados (#11, delantero suplente)
  "jug-14": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 6.4, minutos: 22, metricaClave: "Ingresó min 68' • 1 centro defectuoso • desborde contenido" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 6.1, minutos: 15, metricaClave: "Ingresó min 75' • 2 regates fallidos por derecha" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 6.9, minutos: 65, metricaClave: "Titular por banda • 1 asistencia de gol • sustituido" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: null, minutos: 0, metricaClave: "En banca de suplentes • opción no utilizada" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 6.7, minutos: 18, metricaClave: "Ingresó min 72' • 1 tiro atajado al primer palo" },
  ],
  // alexander oroz (#20, delantero reserva en recuperacion)
  "jug-15": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 5.7, minutos: 10, metricaClave: "Ingresó min 80' • fuera de juego en avance claro" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: null, minutos: 0, metricaClave: "No convocado • recuperación física progresiva" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 6.2, minutos: 15, metricaClave: "Ingresó min 75' • reingreso tras molestia muscular" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: null, minutos: 0, metricaClave: "En banca de suplentes • sin minutos" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 6.6, minutos: 20, metricaClave: "Ingresó min 70' • 1 tiro bloqueado en el área" },
  ],
  // javier correa (#9, delantero titular)
  "jug-11": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 8.7, minutos: 85, metricaClave: "2 goles anotados • Figura del ataque albo" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 8.3, minutos: 88, metricaClave: "1 gol de cabeza definitorio en el clásico" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.5, minutos: 90, metricaClave: "1 remate al poste • 3 desmarques profundos" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 6.4, minutos: 70, metricaClave: "Bien fijado por centrales rivales • 1 tiro desviado" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.6, minutos: 77, metricaClave: "1 tiro al travesaño • 1 asistencia rasa" },
  ],
  // vicente pizarro (#34, mediocampista titular)
  "jug-9": [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local", calificacion: 8.3, minutos: 86, metricaClave: "1 asistencia clave • 89 pases correctos" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita", calificacion: 8.4, minutos: 90, metricaClave: "Control táctico del medio • 93% efectividad" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.8, minutos: 90, metricaClave: "91% pases acertados • 6 recuperaciones" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita", calificacion: 6.9, minutos: 80, metricaClave: "Presión rival alta • 7 recuperaciones defensivas" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local", calificacion: 7.7, minutos: 82, metricaClave: "78 pases completados en zona media" },
  ],
};

// cálculo de historial de partidos para suplentes, reservas o titulares
const generarPartidosRecientes = (jugador) => {
  const cotejos = [
    { fecha: "19 Abr", rival: "Cobreloa", resultado: "2 - 0", tipo: "Victoria", condicion: "Local" },
    { fecha: "13 Abr", rival: "U. Católica", resultado: "1 - 0", tipo: "Victoria", condicion: "Visita" },
    { fecha: "06 Abr", rival: "Huachipato", resultado: "2 - 1", tipo: "Victoria", condicion: "Local" },
    { fecha: "30 Mar", rival: "Everton", resultado: "1 - 1", tipo: "Empate", condicion: "Visita" },
    { fecha: "16 Mar", rival: "Audax Italiano", resultado: "3 - 1", tipo: "Victoria", condicion: "Local" },
  ];

  const dorsalSeed = Number(jugador.dorsal) || 10;
  const esSuplente = jugador.rol === "Suplente";
  const esReserva = jugador.rol === "Reserva";

  return cotejos.map((item, idx) => {
    let minutos;
    let calificacion;
    let metricaClave;

    if (esReserva) {
      minutos = idx === 1 || idx === 3 ? 0 : 10 + (dorsalSeed % 12);
      calificacion = minutos === 0 ? null : Number((5.8 + ((dorsalSeed + idx) % 7) / 10).toFixed(1));
      metricaClave =
        minutos === 0
          ? "No convocado • trabajo de reacondicionamiento físico"
          : `Ingresó min ${90 - minutos}' • ${1 + (idx % 2)} intervenciones • en reintegro`;
    } else if (esSuplente) {
      minutos = idx === 3 ? 0 : idx === 0 ? 18 : 12 + (dorsalSeed % 20);
      calificacion = minutos === 0 ? null : Number((6.0 + ((dorsalSeed * (idx + 1)) % 13) / 10).toFixed(1));
      metricaClave =
        minutos === 0
          ? "En banca de suplentes • opción no utilizada"
          : `Ingresó en segundo tiempo (${minutos} min) • rotación táctica`;
    } else {
      // titular: alterna partidos sobresalientes con cotejos exigentes
      const esCotejoDificil = idx === 3; // partido vs everton
      minutos = 75 + ((dorsalSeed + idx) % 16);
      const base = esCotejoDificil ? 6.7 : 7.6 + ((dorsalSeed * (idx + 2)) % 12) / 10;
      calificacion = Number(Math.min(8.8, Math.max(6.4, base)).toFixed(1));

      if (jugador.posicion === "Arquero") {
        metricaClave = esCotejoDificil
          ? "1 gol encajado bajo presión • 3 atajadas"
          : `${3 + (idx % 3)} atajadas determinantes • seguridad aérea`;
      } else if (jugador.posicion === "Defensa") {
        metricaClave = esCotejoDificil
          ? "1 tarjeta amarilla • 4 faltas cometidas • despejes bajo presión"
          : `${5 + (idx % 4)} duelos ganados • anticipación de juego`;
      } else if (jugador.posicion === "Mediocampista") {
        metricaClave = esCotejoDificil
          ? "Presión intensa del rival • 76% efectividad pases • desgaste"
          : `${84 + (idx % 8)}% pases acertados • control de zona media`;
      } else {
        metricaClave = esCotejoDificil
          ? "Bien contenido por la marca rival • 1 remate desviado"
          : `${1 + (idx % 3)} tiros al arco • rupturas al espacio`;
      }
    }

    return {
      fecha: item.fecha,
      rival: item.rival,
      resultado: item.resultado,
      tipo: item.tipo,
      condicion: item.condicion,
      calificacion,
      minutos,
      metricaClave,
    };
  });
};

// metricas de radar (6 ejes: velocidad, resistencia, pase, tiro, defensa, fisico)
export const obtenerRendimientoJugador = (jugador) => {
  if (!jugador) return null;

  const basesPorPosicion = {
    Arquero: { velocidad: 66, resistencia: 75, pase: 79, tiro: 38, defensa: 92, fisico: 84 },
    Defensa: { velocidad: 77, resistencia: 86, pase: 78, tiro: 54, defensa: 90, fisico: 88 },
    Mediocampista: { velocidad: 76, resistencia: 90, pase: 89, tiro: 79, defensa: 82, fisico: 85 },
    Delantero: { velocidad: 88, resistencia: 82, pase: 76, tiro: 90, defensa: 49, fisico: 82 },
  };

  const base = basesPorPosicion[jugador.posicion] || basesPorPosicion.Mediocampista;

  const perfilesEspecificos = {
    // vidal
    "jug-8": {
      radar: [
        { eje: "Velocidad", valor: 76, max: 100 },
        { eje: "Resistencia", valor: 92, max: 100 },
        { eje: "Pase", valor: 90, max: 100 },
        { eje: "Tiro", valor: 84, max: 100 },
        { eje: "Defensa", valor: 86, max: 100 },
        { eje: "Físico", valor: 88, max: 100 },
      ],
      promedioTemporada: 8.0,
      kmPorPartido: "11.2 km",
      pasesCompletados: "89%",
      minutosJugados: 1980,
    },
    // palacios
    "jug-10": {
      radar: [
        { eje: "Velocidad", valor: 84, max: 100 },
        { eje: "Resistencia", valor: 81, max: 100 },
        { eje: "Pase", valor: 91, max: 100 },
        { eje: "Tiro", valor: 88, max: 100 },
        { eje: "Defensa", valor: 58, max: 100 },
        { eje: "Físico", valor: 78, max: 100 },
      ],
      promedioTemporada: 7.9,
      kmPorPartido: "10.1 km",
      pasesCompletados: "86%",
      minutosJugados: 1890,
    },
    // cortes
    "jug-1": {
      radar: [
        { eje: "Velocidad", valor: 68, max: 100 },
        { eje: "Resistencia", valor: 77, max: 100 },
        { eje: "Pase", valor: 82, max: 100 },
        { eje: "Tiro", valor: 35, max: 100 },
        { eje: "Defensa", valor: 93, max: 100 },
        { eje: "Físico", valor: 85, max: 100 },
      ],
      promedioTemporada: 7.9,
      kmPorPartido: "5.4 km",
      pasesCompletados: "80%",
      minutosJugados: 2160,
    },
    // de paul (suplente)
    "jug-2": {
      radar: [
        { eje: "Velocidad", valor: 64, max: 100 },
        { eje: "Resistencia", valor: 72, max: 100 },
        { eje: "Pase", valor: 74, max: 100 },
        { eje: "Tiro", valor: 32, max: 100 },
        { eje: "Defensa", valor: 85, max: 100 },
        { eje: "Físico", valor: 80, max: 100 },
      ],
      promedioTemporada: 6.5,
      kmPorPartido: "4.8 km",
      pasesCompletados: "75%",
      minutosJugados: 680,
    },
    // paiva (suplente)
    "jug-12": {
      radar: [
        { eje: "Velocidad", valor: 80, max: 100 },
        { eje: "Resistencia", valor: 76, max: 100 },
        { eje: "Pase", valor: 71, max: 100 },
        { eje: "Tiro", valor: 82, max: 100 },
        { eje: "Defensa", valor: 45, max: 100 },
        { eje: "Físico", valor: 81, max: 100 },
      ],
      promedioTemporada: 6.4,
      kmPorPartido: "7.8 km",
      pasesCompletados: "74%",
      minutosJugados: 740,
    },
    // bolados (suplente)
    "jug-14": {
      radar: [
        { eje: "Velocidad", valor: 85, max: 100 },
        { eje: "Resistencia", valor: 74, max: 100 },
        { eje: "Pase", valor: 73, max: 100 },
        { eje: "Tiro", valor: 78, max: 100 },
        { eje: "Defensa", valor: 44, max: 100 },
        { eje: "Físico", valor: 72, max: 100 },
      ],
      promedioTemporada: 6.4,
      kmPorPartido: "8.1 km",
      pasesCompletados: "76%",
      minutosJugados: 620,
    },
    // oroz (reserva / en recuperacion)
    "jug-15": {
      radar: [
        { eje: "Velocidad", valor: 82, max: 100 },
        { eje: "Resistencia", valor: 65, max: 100 },
        { eje: "Pase", valor: 68, max: 100 },
        { eje: "Tiro", valor: 75, max: 100 },
        { eje: "Defensa", valor: 40, max: 100 },
        { eje: "Físico", valor: 69, max: 100 },
      ],
      promedioTemporada: 6.1,
      kmPorPartido: "6.2 km",
      pasesCompletados: "71%",
      minutosJugados: 230,
    },
  };

  const especifico = perfilesEspecificos[jugador.id];

  const radar = especifico?.radar || [
    { eje: "Velocidad", valor: base.velocidad, max: 100 },
    { eje: "Resistencia", valor: base.resistencia, max: 100 },
    { eje: "Pase", valor: base.pase, max: 100 },
    { eje: "Tiro", valor: base.tiro, max: 100 },
    { eje: "Defensa", valor: base.defensa, max: 100 },
    { eje: "Físico", valor: base.fisico, max: 100 },
  ];

  // partidos recientes realistas
  const partidosRecientes =
    PARTIDOS_POR_JUGADOR[jugador.id] || generarPartidosRecientes(jugador);

  // calculo de promedio unicamente sobre cotejos disputados
  const partidosDisputados = partidosRecientes.filter(
    (p) => p.minutos > 0 && p.calificacion !== null
  );

  const promedioReciente =
    partidosDisputados.length > 0
      ? Number(
          (
            partidosDisputados.reduce((acc, p) => acc + p.calificacion, 0) /
            partidosDisputados.length
          ).toFixed(1)
        )
      : null;

  return {
    radar,
    partidosRecientes,
    promedioReciente,
    promedioTemporada: especifico?.promedioTemporada || promedioReciente || 6.5,
    kmPorPartido: especifico?.kmPorPartido || (jugador.rol === "Titular" ? "10.2 km" : "7.5 km"),
    pasesCompletados: especifico?.pasesCompletados || (jugador.rol === "Titular" ? "84%" : "75%"),
    minutosJugados:
      especifico?.minutosJugados ||
      (jugador.partidos ? jugador.partidos * (jugador.rol === "Titular" ? 78 : 32) : 540),
  };
};
