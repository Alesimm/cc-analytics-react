// Datos y operaciones de persistencia simulada para Soporte Tecnico y Mesa de Ayuda de CC Analytics
// Fuente de datos CRUD en JavaScript y persistencia en localStorage para Soporte Técnico

export const TICKETS_INICIALES = [
  {
    id: "tk-101",
    nombreSolicitante: "Jorge Almirón",
    email: "j.almiron@colocolo.cl",
    departamento: "Cuerpo Técnico",
    categoria: "Métricas & Estadísticas",
    prioridad: "Alta",
    asunto: "Sincronización de velocidad punta en módulo de Rendimiento",
    descripcion:
      "Los reportes de la práctica matutina del jueves no están promediando las aceleraciones por encima de 25 km/h en los laterales.",
    fecha: "2026-05-02",
    estado: "Resuelto",
    respuestaTecnica:
      "Mesa de Ayuda TI: Se recalibró el convertidor telemétrico de GPS Catapult. Los datos ya se reflejan en el radar de Rendimiento.",
  },
  {
    id: "tk-102",
    nombreSolicitante: "Dr. Roberto Yáñez",
    email: "r.yanez@colocolo.cl",
    departamento: "Área Médica",
    categoria: "Incidencia Técnica",
    prioridad: "Media",
    asunto: "Actualización de protocolo en fichas de reintegro deportivo",
    descripcion:
      "Requerimos añadir una anotación sobre el test de fuerza isocinética en los futbolistas con alta médica reciente.",
    fecha: "2026-05-03",
    estado: "En Revisión",
    respuestaTecnica:
      "Soporte CC: Requerimiento derivado al equipo de desarrollo para la próxima actualización de campos clínicos.",
  },
  {
    id: "tk-103",
    nombreSolicitante: "Maximiliano Velázquez",
    email: "m.velazquez@colocolo.cl",
    departamento: "Cuerpo Técnico",
    categoria: "Cuentas & Accesos",
    prioridad: "Urgente",
    asunto: "Habilitación de acceso analítico para nuevo preparador asistente",
    descripcion:
      "Solicitamos credenciales con rol de Entrenador para el cuerpo técnico auxiliar de cara al partido del fin de semana.",
    fecha: "2026-05-04",
    estado: "Abierto",
    respuestaTecnica:
      "En espera de validación de credenciales por la coordinación del club.",
  },
  {
    id: "tk-104",
    nombreSolicitante: "Matías Camacho",
    email: "m.camacho@colocolo.cl",
    departamento: "Coordinación Deportiva",
    categoria: "Sugerencia",
    prioridad: "Baja",
    asunto: "Exportación de fixture oficial a formato imprimible",
    descripcion:
      "Sería de gran utilidad poder descargar el listado de los próximos 5 encuentros del campeonato en una ficha resumen.",
    fecha: "2026-05-04",
    estado: "Abierto",
    respuestaTecnica:
      "Ticket registrado en el backlog de mejoras visuales del sistema.",
  },
];

const STORAGE_KEY = "cc_analytics_soporte_tickets";

// recupera los tickets desde localstorage o devuelve los iniciales
export const obtenerTickets = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(TICKETS_INICIALES));
      return TICKETS_INICIALES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : TICKETS_INICIALES;
  } catch (error) {
    console.error("Error al leer tickets de soporte desde localStorage:", error);
    return TICKETS_INICIALES;
  }
};

// guarda un nuevo ticket de soporte en localstorage (crud: create)
export const guardarNuevoTicket = (nuevoTicket) => {
  try {
    const actuales = obtenerTickets();
    const idGenerado = `tk-${Date.now().toString().slice(-4)}`;
    const ticketCompleto = {
      ...nuevoTicket,
      id: idGenerado,
      fecha: nuevoTicket.fecha || new Date().toISOString().split("T")[0],
      estado: nuevoTicket.estado || "Abierto",
      respuestaTecnica:
        nuevoTicket.respuestaTecnica ||
        "Ticket recibido en cola de atención. Asignado a especialista de Mesa de Ayuda.",
    };
    const actualizados = [ticketCompleto, ...actuales];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
    return ticketCompleto;
  } catch (error) {
    console.error("Error al registrar ticket en localStorage:", error);
    return null;
  }
};

// actualiza el estado de un ticket existente (crud: update)
export const cambiarEstadoTicket = (id, nuevoEstado) => {
  try {
    const actuales = obtenerTickets();
    const actualizados = actuales.map((t) =>
      t.id === id ? { ...t, estado: nuevoEstado } : t
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(actualizados));
    return actualizados;
  } catch (error) {
    console.error("Error al actualizar estado del ticket:", error);
    return [];
  }
};

// elimina un ticket (crud: delete)
export const eliminarTicket = (id) => {
  try {
    const actuales = obtenerTickets();
    const filtrados = actuales.filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtrados));
    return filtrados;
  } catch (error) {
    console.error("Error al eliminar ticket de soporte:", error);
    return [];
  }
};

// restablece los tickets a los valores demo por defecto
export const restablecerTicketsStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(TICKETS_INICIALES));
    return TICKETS_INICIALES;
  } catch (error) {
    console.error("Error al restablecer tickets de soporte:", error);
    return TICKETS_INICIALES;
  }
};

