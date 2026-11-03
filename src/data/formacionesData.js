// formaciones tacticas predeterminadas y parametros estrategicos para la pizarra
// cumple con la arquitectura modular y datos simulados del plantel de colo-colo

export const FORMACIONES_DISPONIBLES = [
  {
    id: "4-3-3",
    nombre: "4-3-3 Ofensivo",
    descripcion: "Amplitud ofensiva por bandas, posesion progresiva y presion alta tras perdida.",
    lineaDefensiva: "Alta",
    intensidadPresion: "Intensa",
    estiloPosesion: "Posicional",
    anchuraEquipo: "Amplio",
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "LI", x: 16, y: 70 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "DCI", x: 38, y: 73 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 62, y: 73 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "LD", x: 84, y: 70 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MCD", x: 50, y: 54 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MC", x: 32, y: 40 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MCO", x: 68, y: 40 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "EI", x: 18, y: 20 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 50, y: 15 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "ED", x: 82, y: 20 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR" },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC" },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC" },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC" },
    ],
  },
  {
    id: "4-2-3-1",
    nombre: "4-2-3-1 Control",
    descripcion: "Doble pivote de contencion en la medular con enganche y transicion rapida.",
    lineaDefensiva: "Media",
    intensidadPresion: "Equilibrada",
    estiloPosesion: "Equilibrado",
    anchuraEquipo: "Estándar",
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "LI", x: 16, y: 72 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "DCI", x: 38, y: 74 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 62, y: 74 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "LD", x: 84, y: 72 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MCD", x: 36, y: 55 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MCD", x: 64, y: 55 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "MI", x: 18, y: 35 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MCO", x: 50, y: 34 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "MD", x: 82, y: 35 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 50, y: 16 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR" },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC" },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC" },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC" },
    ],
  },
  {
    id: "3-5-2",
    nombre: "3-5-2 Bloque Alto",
    descripcion: "Tres centrales con carrileros adelantados y doble referencia de ataque en el area.",
    lineaDefensiva: "Alta",
    intensidadPresion: "Intensa",
    estiloPosesion: "Vertical",
    anchuraEquipo: "Amplio",
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "DCI", x: 26, y: 73 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "LIB", x: 50, y: 76 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 74, y: 73 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "CARI", x: 14, y: 46 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MCD", x: 50, y: 53 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MC", x: 34, y: 38 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MC", x: 66, y: 38 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "CARD", x: 86, y: 46 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "SD", x: 38, y: 18 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 62, y: 18 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR" },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC" },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC" },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC" },
    ],
  },
  {
    id: "4-4-2",
    nombre: "4-4-2 Presión Clásica",
    descripcion: "Estructura compacta en dos lineas de cuatro con balance defensivo y repliegue seguro.",
    lineaDefensiva: "Baja",
    intensidadPresion: "Conservadora",
    estiloPosesion: "Transición",
    anchuraEquipo: "Estrecho",
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "LI", x: 16, y: 72 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "DCI", x: 38, y: 74 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 62, y: 74 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "LD", x: 84, y: 72 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "MI", x: 18, y: 44 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MC", x: 38, y: 46 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MC", x: 62, y: 46 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MD", x: 82, y: 44 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "DC", x: 38, y: 18 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 62, y: 18 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR" },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC" },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC" },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC" },
    ],
  },
];

// clave localstorage para persistir parametros tacticos y anotaciones
export const STORAGE_KEY_TACTICA = "cc_analytics_pizarra_tactica_v1";

// funcion para cargar la configuracion guardada
export const obtenerConfiguracionTactica = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_TACTICA);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (error) {
    console.warn("error al leer configuracion tactica de localstorage:", error);
    return null;
  }
};

// funcion para guardar la configuracion tactica
export const guardarConfiguracionTactica = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY_TACTICA, JSON.stringify(config));
    return true;
  } catch (error) {
    console.warn("error al guardar configuracion tactica en localstorage:", error);
    return false;
  }
};

