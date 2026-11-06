// Datos y operaciones de persistencia simulada para el Centro Medico y Lesiones de Colo-Colo
// Cumple con el requisito de la evaluacion: fuente de datos CRUD en JavaScript

export const REGISTROS_MEDICOS_INICIALES = [
  {
    id: "med-1",
    jugadorId: "jug-4",
    jugadorNombre: "Alan Saldivia",
    dorsal: 4,
    posicion: "Defensa",
    tipoLesion: "Muscular",
    diagnostico: "Desgarro miofascial en isquiotibial derecho (Grado 1)",
    gravedad: "Moderada",
    fechaIngreso: "2026-04-14",
    diasRecuperacion: 21,
    diasRestantes: 7,
    fase: "Reintegro Deportivo",
    estado: "En Reintegro",
    medicoTratante: "Dr. Roberto Yáñez (Kinesiología CSD)",
    observaciones: "Buena cicatrización ecográfica. Inició trote y trabajo diferenciado con balón en cancha.",
  },
  {
    id: "med-2",
    jugadorId: "jug-15",
    jugadorNombre: "Alexander Oroz",
    dorsal: 20,
    posicion: "Delantero",
    tipoLesion: "Ligamentosa",
    diagnostico: "Esguince de ligamento colateral medial en rodilla izquierda (Grado 2)",
    gravedad: "Grave",
    fechaIngreso: "2026-04-02",
    diasRecuperacion: 42,
    diasRestantes: 18,
    fase: "Rehabilitación Kinésica",
    estado: "Baja Activa",
    medicoTratante: "Dr. Gastón Carvajal (Traumatología)",
    observaciones: "Trabajo en piscina y fortalecimiento de cuádriceps en gimnasio sin dolor residual.",
  },
  {
    id: "med-3",
    jugadorId: "jug-30",
    jugadorNombre: "Fernando de Paul",
    dorsal: 30,
    posicion: "Arquero",
    tipoLesion: "Sobrecarga",
    diagnostico: "Sobrecarga en aductor mayor derecho por esfuerzo repetitivo",
    gravedad: "Leve",
    fechaIngreso: "2026-04-18",
    diasRecuperacion: 7,
    diasRestantes: 2,
    fase: "Reintegro Deportivo",
    estado: "En Reintegro",
    medicoTratante: "Kgo. Wilson Ferrada",
    observaciones: "Descarga muscular completa y crioterapia. Realiza trabajos de reacción en portería.",
  },
  {
    id: "med-4",
    jugadorId: "jug-23",
    jugadorNombre: "Arturo Vidal",
    dorsal: 23,
    posicion: "Mediocampista",
    tipoLesion: "Articular",
    diagnostico: "Sinovitis reactiva post-esfuerzo en rodilla derecha",
    gravedad: "Leve",
    fechaIngreso: "2026-03-25",
    diasRecuperacion: 10,
    diasRestantes: 0,
    fase: "Alta Médica",
    estado: "Alta Médica",
    medicoTratante: "Dr. Roberto Yáñez (Área Médica)",
    observaciones: "Control ecográfico normal, sin derrame articular. Alta médica otorgada para competencia oficial.",
  },
  {
    id: "med-5",
    jugadorId: "jug-9",
    jugadorNombre: "Javier Correa",
    dorsal: 9,
    posicion: "Delantero",
    tipoLesion: "Muscular",
    diagnostico: "Contractura en gemelo interno de pierna izquierda",
    gravedad: "Leve",
    fechaIngreso: "2026-03-10",
    diasRecuperacion: 8,
    diasRestantes: 0,
    fase: "Alta Médica",
    estado: "Alta Médica",
    medicoTratante: "Kgo. Wilson Ferrada",
    observaciones: "Evolución satisfactoria. Completó microciclo de entrenamiento con el grupo profesional.",
  },
];

const CLAVE_STORAGE_MEDICO = "cc_analytics_medico_v1";

// Cargar registros medicos desde localStorage o inicializar si no existen
export const obtenerRegistrosMedicos = () => {
  try {
    const guardado = localStorage.getItem(CLAVE_STORAGE_MEDICO);
    if (!guardado) {
      localStorage.setItem(
        CLAVE_STORAGE_MEDICO,
        JSON.stringify(REGISTROS_MEDICOS_INICIALES)
      );
      return REGISTROS_MEDICOS_INICIALES;
    }
    const datos = JSON.parse(guardado);
    return Array.isArray(datos) && datos.length > 0
      ? datos
      : REGISTROS_MEDICOS_INICIALES;
  } catch {
    return REGISTROS_MEDICOS_INICIALES;
  }
};

// Guardar o actualizar registro medico
export const guardarRegistroMedicoStorage = (registro) => {
  const actual = obtenerRegistrosMedicos();
  let actualizado;

  if (registro.id) {
    // Modo edicion
    actualizado = actual.map((item) =>
      item.id === registro.id ? { ...item, ...registro } : item
    );
  } else {
    // Modo creacion
    const nuevo = {
      ...registro,
      id: `med-${Date.now()}`,
      fechaIngreso: registro.fechaIngreso || new Date().toISOString().split("T")[0],
      diasRestantes: registro.diasRecuperacion ? Number(registro.diasRecuperacion) : 10,
    };
    actualizado = [nuevo, ...actual];
  }

  try {
    localStorage.setItem(CLAVE_STORAGE_MEDICO, JSON.stringify(actualizado));
  } catch {
    // Fallback en caso de error de almacenamiento
  }

  return actualizado;
};

// Dar de alta medica a un futbolista
export const darAltaMedicaStorage = (id) => {
  const actual = obtenerRegistrosMedicos();
  const actualizado = actual.map((item) => {
    if (item.id === id) {
      return {
        ...item,
        fase: "Alta Médica",
        estado: "Alta Médica",
        diasRestantes: 0,
        observaciones: `${item.observaciones} • Alta médica concedida por el cuerpo médico del club.`,
      };
    }
    return item;
  });

  try {
    localStorage.setItem(CLAVE_STORAGE_MEDICO, JSON.stringify(actualizado));
  } catch {
    // Fallback
  }

  return actualizado;
};

// Eliminar un registro medico
export const eliminarRegistroMedicoStorage = (id) => {
  const actual = obtenerRegistrosMedicos();
  const actualizado = actual.filter((r) => r.id !== id);

  try {
    localStorage.setItem(CLAVE_STORAGE_MEDICO, JSON.stringify(actualizado));
  } catch {
    // Fallback
  }

  return actualizado;
};

// Restablecer al registro inicial de prueba
export const restablecerRegistrosMedicosStorage = () => {
  try {
    localStorage.setItem(
      CLAVE_STORAGE_MEDICO,
      JSON.stringify(REGISTROS_MEDICOS_INICIALES)
    );
  } catch {
    // Fallback
  }
  return REGISTROS_MEDICOS_INICIALES;
};

