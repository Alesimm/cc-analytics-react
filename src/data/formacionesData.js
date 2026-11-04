// formaciones tacticas predeterminadas, persistencia y gestion crud de esquemas
// cumple con la arquitectura modular y datos simulados del plantel de colo-colo

export const FORMACIONES_OFICIALES = [
  {
    id: "4-3-3",
    nombre: "4-3-3 Ofensivo",
    descripcion: "Amplitud ofensiva por bandas, posesion progresiva y presion alta tras perdida.",
    esOficial: true,
    alturaBloque: 75,
    anchuraEquipo: 70,
    intensidadPresion: 80,
    ritmoPosesion: 60,
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88, media: 84 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "LI", x: 16, y: 70, media: 79 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "DCI", x: 38, y: 73, media: 83 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 62, y: 73, media: 81 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "LD", x: 84, y: 70, media: 78 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MCD", x: 50, y: 54, media: 82 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MC", x: 32, y: 40, media: 86 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MCO", x: 68, y: 40, media: 80 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "EI", x: 18, y: 20, media: 81 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 50, y: 15, media: 83 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "ED", x: 82, y: 20, media: 85 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR", media: 78 },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC", media: 79 },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC", media: 80 },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC", media: 79 },
    ],
  },
  {
    id: "4-2-3-1",
    nombre: "4-2-3-1 Control",
    descripcion: "Doble pivote de contencion en la medular con enganche y transicion rapida.",
    esOficial: true,
    alturaBloque: 55,
    anchuraEquipo: 50,
    intensidadPresion: 65,
    ritmoPosesion: 50,
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88, media: 84 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "LI", x: 16, y: 72, media: 79 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "DCI", x: 38, y: 74, media: 83 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 62, y: 74, media: 81 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "LD", x: 84, y: 72, media: 78 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MCD", x: 36, y: 55, media: 82 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MCD", x: 64, y: 55, media: 86 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "MI", x: 18, y: 35, media: 81 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MCO", x: 50, y: 34, media: 80 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "MD", x: 82, y: 35, media: 85 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 50, y: 16, media: 83 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR", media: 78 },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC", media: 79 },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC", media: 80 },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC", media: 79 },
    ],
  },
  {
    id: "3-5-2",
    nombre: "3-5-2 Bloque Alto",
    descripcion: "Tres centrales con carrileros adelantados y doble referencia de ataque en el area.",
    esOficial: true,
    alturaBloque: 80,
    anchuraEquipo: 75,
    intensidadPresion: 85,
    ritmoPosesion: 70,
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88, media: 84 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "DCI", x: 26, y: 73, media: 79 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "LIB", x: 50, y: 76, media: 83 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 74, y: 73, media: 81 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "CARI", x: 14, y: 46, media: 81 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MCD", x: 50, y: 53, media: 82 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MC", x: 34, y: 38, media: 86 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MC", x: 66, y: 38, media: 80 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "CARD", x: 86, y: 46, media: 78 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "SD", x: 38, y: 18, media: 85 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 62, y: 18, media: 83 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR", media: 78 },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC", media: 79 },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC", media: 80 },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC", media: 79 },
    ],
  },
  {
    id: "4-4-2",
    nombre: "4-4-2 Presión Clásica",
    descripcion: "Estructura compacta en dos lineas de cuatro con balance defensivo y repliegue seguro.",
    esOficial: true,
    alturaBloque: 30,
    anchuraEquipo: 35,
    intensidadPresion: 40,
    ritmoPosesion: 45,
    titulares: [
      { id: "jug-1", dorsal: 1, nombre: "B. Cortés", posicion: "Arquero", rol: "POR", x: 50, y: 88, media: 84 },
      { id: "jug-5", dorsal: 21, nombre: "E. Wiemberg", posicion: "Defensa", rol: "LI", x: 16, y: 72, media: 79 },
      { id: "jug-3", dorsal: 37, nombre: "M. Falcón", posicion: "Defensa", rol: "DCI", x: 38, y: 74, media: 83 },
      { id: "jug-4", dorsal: 4, nombre: "A. Saldivia", posicion: "Defensa", rol: "DCD", x: 62, y: 74, media: 81 },
      { id: "jug-6", dorsal: 16, nombre: "Ó. Opazo", posicion: "Defensa", rol: "LD", x: 84, y: 72, media: 78 },
      { id: "jug-15", dorsal: 32, nombre: "L. Cepeda", posicion: "Delantero", rol: "MI", x: 18, y: 44, media: 81 },
      { id: "jug-8", dorsal: 8, nombre: "E. Pavez", posicion: "Mediocampo", rol: "MC", x: 38, y: 46, media: 82 },
      { id: "jug-9", dorsal: 23, nombre: "A. Vidal", posicion: "Mediocampo", rol: "MC", x: 62, y: 46, media: 86 },
      { id: "jug-10", dorsal: 5, nombre: "L. Gil", posicion: "Mediocampo", rol: "MD", x: 82, y: 44, media: 80 },
      { id: "jug-12", dorsal: 7, nombre: "C. Palacios", posicion: "Delantero", rol: "DC", x: 38, y: 18, media: 85 },
      { id: "jug-13", dorsal: 9, nombre: "J. Correa", posicion: "Delantero", rol: "DC", x: 62, y: 18, media: 83 },
    ],
    suplentes: [
      { id: "jug-2", dorsal: 30, nombre: "F. De Paul", posicion: "Arquero", rol: "POR", media: 78 },
      { id: "jug-7", dorsal: 15, nombre: "E. Amor", posicion: "Defensa", rol: "DFC", media: 79 },
      { id: "jug-11", dorsal: 34, nombre: "V. Pizarro", posicion: "Mediocampo", rol: "MC", media: 80 },
      { id: "jug-14", dorsal: 29, nombre: "G. Paiva", posicion: "Delantero", rol: "DC", media: 79 },
    ],
  },
];

// claves localstorage para persistencia
export const STORAGE_KEY_ESQUEMAS = "cc_analytics_esquemas_personalizados_v1";
export const STORAGE_KEY_TACTICA = "cc_analytics_pizarra_tactica_v1";

// obtener todas las formaciones (oficiales + personalizadas)
export const obtenerEsquemas = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ESQUEMAS);
    if (!raw) return FORMACIONES_OFICIALES;
    const personalizadas = JSON.parse(raw);
    return [...FORMACIONES_OFICIALES, ...personalizadas];
  } catch (error) {
    console.warn("error al leer esquemas de localstorage:", error);
    return FORMACIONES_OFICIALES;
  }
};

// guardar un nuevo esquema personalizado (crud: create)
export const guardarNuevoEsquema = (nuevoEsquema) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ESQUEMAS);
    const personalizadas = raw ? JSON.parse(raw) : [];
    const actualizadas = [nuevoEsquema, ...personalizadas];
    localStorage.setItem(STORAGE_KEY_ESQUEMAS, JSON.stringify(actualizadas));
    return true;
  } catch (error) {
    console.warn("error al guardar nuevo esquema:", error);
    return false;
  }
};

// actualizar un esquema existente (crud: update)
export const actualizarEsquema = (esquemaModificado) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ESQUEMAS);
    const personalizadas = raw ? JSON.parse(raw) : [];
    const index = personalizadas.findIndex((e) => e.id === esquemaModificado.id);
    if (index !== -1) {
      personalizadas[index] = esquemaModificado;
      localStorage.setItem(STORAGE_KEY_ESQUEMAS, JSON.stringify(personalizadas));
    }
    return true;
  } catch (error) {
    console.warn("error al actualizar esquema:", error);
    return false;
  }
};

// eliminar un esquema personalizado (crud: delete)
export const eliminarEsquema = (id) => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_ESQUEMAS);
    if (!raw) return true;
    const personalizadas = JSON.parse(raw);
    const filtradas = personalizadas.filter((e) => e.id !== id);
    localStorage.setItem(STORAGE_KEY_ESQUEMAS, JSON.stringify(filtradas));
    return true;
  } catch (error) {
    console.warn("error al eliminar esquema:", error);
    return false;
  }
};

// cargar la configuracion de pizarra y ticket guardado
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

// guardar la configuracion tactica y emitir ticket oficial
export const guardarConfiguracionTactica = (config) => {
  try {
    localStorage.setItem(STORAGE_KEY_TACTICA, JSON.stringify(config));
    return true;
  } catch (error) {
    console.warn("error al guardar configuracion tactica en localstorage:", error);
    return false;
  }
};

// compatibilidad hacia atras
export const FORMACIONES_DISPONIBLES = FORMACIONES_OFICIALES;
