import { useState, useMemo } from "react";
import {
  obtenerTickets,
  guardarNuevoTicket,
  cambiarEstadoTicket,
  eliminarTicket,
  restablecerTicketsStorage,
} from "../data/soporteData";

const DEPARTAMENTOS_DISPONIBLES = [
  "Cuerpo Técnico",
  "Analítica & GPS",
  "Área Médica",
  "Coordinación Deportiva",
  "Administración",
];

const CATEGORIAS_DISPONIBLES = [
  "Incidencia Técnica",
  "Métricas & Estadísticas",
  "Cuentas & Accesos",
  "Sugerencia",
];

const PRIORIDADES_DISPONIBLES = ["Baja", "Media", "Alta", "Urgente"];

// regex para validacion propia de correo electronico sin type="email"
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Soporte = () => {
  const [tickets, setTickets] = useState(() => obtenerTickets());
  const [busqueda, setBusqueda] = useState("");
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroCategoria, setFiltroCategoria] = useState("todos");

  // ticket seleccionado para ver respuesta tecnica detallada
  const [ticketDetalleId, setTicketDetalleId] = useState(null);

  // confirmacion inline de eliminacion sin confirm()
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

  // estado para el ticket recien generado y mensaje de feedback
  const [ticketGenerado, setTicketGenerado] = useState(null);
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  // formulario controlado para nuevo requerimiento
  const [formData, setFormData] = useState({
    nombreSolicitante: "",
    email: "",
    departamento: "Cuerpo Técnico",
    categoria: "Incidencia Técnica",
    prioridad: "Media",
    asunto: "",
    descripcion: "",
  });

  const [errores, setErrores] = useState({});

  const handleCambioForm = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errores[campo]) {
      setErrores((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  // validaciones javascript propias segun reglas academicas
  const validarFormulario = () => {
    const nuevosErrores = {};
    let esValido = true;

    // 1. nombre: minimo 3 letras, no vacio
    const nombreLimpio = formData.nombreSolicitante.trim();
    if (!nombreLimpio) {
      nuevosErrores.nombreSolicitante = "El nombre del solicitante es obligatorio.";
      esValido = false;
    } else if (nombreLimpio.length < 3) {
      nuevosErrores.nombreSolicitante = "El nombre debe contener al menos 3 caracteres.";
      esValido = false;
    }

    // 2. correo: sin type="email", validacion regex propia
    const emailLimpio = formData.email.trim();
    if (!emailLimpio) {
      nuevosErrores.email = "El correo de contacto es obligatorio.";
      esValido = false;
    } else if (!EMAIL_REGEX.test(emailLimpio)) {
      nuevosErrores.email = "Ingresa un formato de correo válido (ej: usuario@colocolo.cl).";
      esValido = false;
    }

    // 3. asunto: minimo 4 letras
    const asuntoLimpio = formData.asunto.trim();
    if (!asuntoLimpio) {
      nuevosErrores.asunto = "El asunto de la solicitud es obligatorio.";
      esValido = false;
    } else if (asuntoLimpio.length < 4) {
      nuevosErrores.asunto = "El asunto debe contener al menos 4 caracteres.";
      esValido = false;
    }

    // 4. descripcion: minimo 10 caracteres
    const descLimpia = formData.descripcion.trim();
    if (!descLimpia) {
      nuevosErrores.descripcion = "La descripción del problema es obligatoria.";
      esValido = false;
    } else if (descLimpia.length < 10) {
      nuevosErrores.descripcion = "Describe la solicitud con al menos 10 caracteres para poder procesarla.";
      esValido = false;
    }

    setErrores(nuevosErrores);
    return esValido;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    const nuevo = guardarNuevoTicket({
      nombreSolicitante: formData.nombreSolicitante.trim(),
      email: formData.email.trim().toLowerCase(),
      departamento: formData.departamento,
      categoria: formData.categoria,
      prioridad: formData.prioridad,
      asunto: formData.asunto.trim(),
      descripcion: formData.descripcion.trim(),
    });

    if (nuevo) {
      setTickets(obtenerTickets());
      setTicketGenerado(nuevo);
      setMensajeFeedback(`Ticket ${nuevo.id.toUpperCase()} generado exitosamente en la Mesa de Ayuda.`);
      // resetear formulario
      setFormData({
        nombreSolicitante: "",
        email: "",
        departamento: "Cuerpo Técnico",
        categoria: "Incidencia Técnica",
        prioridad: "Media",
        asunto: "",
        descripcion: "",
      });
      setErrores({});
    }
  };

  const handleCambiarEstado = (id, nuevoEstado) => {
    const actualizados = cambiarEstadoTicket(id, nuevoEstado);
    setTickets(actualizados);
    setMensajeFeedback(`Estado del ticket actualizado a "${nuevoEstado}".`);
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  const handleConfirmarEliminar = (id) => {
    const actualizados = eliminarTicket(id);
    setTickets(actualizados);
    setConfirmarEliminarId(null);
    if (ticketDetalleId === id) setTicketDetalleId(null);
    setMensajeFeedback("Ticket eliminado del registro de soporte.");
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  const handleRestablecer = () => {
    const demo = restablecerTicketsStorage();
    setTickets(demo);
    setTicketDetalleId(null);
    setTicketGenerado(null);
    setMensajeFeedback("Registro de tickets restablecido a los datos de demostración iniciales.");
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  // filtrado reactivo de tickets
  const ticketsFiltrados = useMemo(() => {
    return tickets.filter((ticket) => {
      const coincideEstado =
        filtroEstado === "todos" || ticket.estado === filtroEstado;
      const coincideCategoria =
        filtroCategoria === "todos" || ticket.categoria === filtroCategoria;

      const q = busqueda.trim().toLowerCase();
      const coincideTexto =
        !q ||
        ticket.asunto.toLowerCase().includes(q) ||
        ticket.nombreSolicitante.toLowerCase().includes(q) ||
        ticket.id.toLowerCase().includes(q) ||
        ticket.departamento.toLowerCase().includes(q);

      return coincideEstado && coincideCategoria && coincideTexto;
    });
  }, [tickets, busqueda, filtroEstado, filtroCategoria]);

  // contadores para kpis superiores
  const totalTickets = tickets.length;
  const ticketsResueltos = tickets.filter((t) => t.estado === "Resuelto").length;
  const ticketsAbiertos = tickets.filter((t) => t.estado === "Abierto").length;
  const ticketsEnRevision = tickets.filter((t) => t.estado === "En Revisión").length;

  const colorPrioridad = (prioridad) => {
    switch (prioridad) {
      case "Urgente":
        return "border-rose-500/40 text-rose-400 bg-rose-500/10";
      case "Alta":
        return "border-amber-500/40 text-amber-400 bg-amber-500/10";
      default:
        return "border-white/15 text-neutral-300 bg-white/[0.03]";
    }
  };

  const colorEstado = (estado) => {
    switch (estado) {
      case "Resuelto":
        return "border-emerald-500/40 text-emerald-400 bg-emerald-500/10";
      case "En Revisión":
        return "border-amber-500/40 text-amber-400 bg-amber-500/10";
      default:
        return "border-white/15 text-neutral-300 bg-white/[0.03]";
    }
  };

  return (
    <div className="space-y-8 relative">
      {/* cabecera principal minimalista */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5 mb-2 flex-wrap">
            <span className="inline-block w-1.5 h-1.5 bg-white"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-neutral-400">
              CC Analytics // Mesa de Ayuda
            </span>
            <span className="text-[10px] uppercase font-bold tracking-[0.14em] text-neutral-300 border border-white/15 px-2 py-0.5 bg-white/[0.03]">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold uppercase tracking-tight text-white leading-none">
            Soporte Técnico
          </h1>
          <p className="text-neutral-400 text-xs font-medium mt-2">
            Mesa de ayuda, registro de incidencias y asistencia a usuarios
          </p>
        </div>

        {/* boton de restablecer demo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestablecer}
            className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3.5 py-2.5 bg-white/2 transition-colors cursor-pointer"
            title="Restablecer tickets a los valores demo por defecto"
          >
            Restablecer Demo
          </button>
        </div>
      </header>

      {/* mensaje de feedback superior */}
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

      {/* kpis cuantitativos del servicio de soporte */}
      <section aria-labelledby="metricas-soporte" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <h2 id="metricas-soporte" className="sr-only">
          Métricas generales de la mesa de ayuda
        </h2>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 flex flex-col justify-between group hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Tickets Totales
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-white border border-white/10 px-1.5 py-0.5">
              Histórico
            </span>
          </div>
          <p className="text-3xl font-black text-white font-mono leading-none">
            {totalTickets}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-2 block">
            Solicitudes registradas
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 flex flex-col justify-between group hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Casos Resueltos
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-400 border border-emerald-500/30 bg-emerald-500/10 px-1.5 py-0.5">
              Completados
            </span>
          </div>
          <p className="text-3xl font-black text-emerald-400 font-mono leading-none">
            {ticketsResueltos}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-2 block">
            {totalTickets > 0 ? Math.round((ticketsResueltos / totalTickets) * 100) : 0}% de tasa de resolución
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 flex flex-col justify-between group hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              En Gestión Activa
            </span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-400 border border-amber-500/30 bg-amber-500/10 px-1.5 py-0.5">
              En Proceso
            </span>
          </div>
          <p className="text-3xl font-black text-amber-400 font-mono leading-none">
            {ticketsAbiertos + ticketsEnRevision}
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-2 block">
            {ticketsAbiertos} Abiertos • {ticketsEnRevision} En Revisión
          </span>
        </div>

        <div className="border border-white/10 bg-[#0a0a0a]/80 p-5 flex flex-col justify-between group hover:border-white/30 transition-colors">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Mesa de Ayuda
            </span>
            <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.9)] animate-pulse"></span>
          </div>
          <p className="text-xl font-black text-white uppercase tracking-wider leading-none mt-1">
            Operativa
          </p>
          <span className="text-[10px] text-neutral-500 tracking-wider mt-2 block">
            Tiempo respuesta: &lt; 2 hrs
          </span>
        </div>
      </section>

      {/* cuerpo principal de dos columnas: formulario de envio + catalogo de tickets */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* columna izquierda (6 columnas): formulario de contacto controlado */}
        <section
          aria-labelledby="titulo-formulario-contacto"
          className="lg:col-span-6 border border-white/10 bg-[#0a0a0a]/90 p-6 sm:p-8 space-y-6 shadow-2xl relative"
        >
          <div className="border-b border-white/10 pb-4">
            <div className="flex items-center justify-between gap-2">
              <h2
                id="titulo-formulario-contacto"
                className="text-base font-black uppercase tracking-wider text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-fuchsia-400 inline-block"></span>
                Enviar Solicitud a Soporte
              </h2>
              <span className="text-[9px] uppercase font-bold tracking-widest text-neutral-400 border border-white/10 px-2 py-0.5 bg-white/2">
                Ticket Nuevo
              </span>
            </div>
            <p className="text-neutral-500 text-xs mt-1">
              Completa los datos del requerimiento para que el área de soporte técnico evalúe la incidencia.
            </p>
          </div>

          {/* confirmacion destacada del ticket recien emitido */}
          {ticketGenerado && (
            <div className="border border-emerald-500/40 bg-emerald-950/20 p-4 space-y-2 animate-fade-in">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">
                  Ticket #{ticketGenerado.id.toUpperCase()} Generado con Éxito
                </span>
                <button
                  type="button"
                  onClick={() => setTicketGenerado(null)}
                  className="text-neutral-400 hover:text-white text-xs cursor-pointer"
                >
                  Cerrar
                </button>
              </div>
              <p className="text-xs text-neutral-200">
                <strong>Asunto:</strong> {ticketGenerado.asunto}
              </p>
              <div className="text-[10px] text-neutral-400 flex items-center gap-3">
                <span>Solicitante: <strong>{ticketGenerado.nombreSolicitante}</strong></span>
                <span>•</span>
                <span>Prioridad: <strong>{ticketGenerado.prioridad}</strong></span>
              </div>
            </div>
          )}

          {/* formulario sin atributos html prohibidos (required, type=email, minLength) */}
          <form onSubmit={handleSubmit} noValidate className="space-y-4">
            {/* solicitante y correo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="soporte-nombre"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Nombre del Solicitante
                </label>
                <input
                  id="soporte-nombre"
                  type="text"
                  value={formData.nombreSolicitante}
                  onChange={(e) => handleCambioForm("nombreSolicitante", e.target.value)}
                  placeholder="Ej: Jorge Almirón"
                  className={`w-full bg-[#050505] border p-2.5 text-xs text-white focus:outline-none transition-colors ${
                    errores.nombreSolicitante
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-white/10 focus:border-white/40"
                  }`}
                />
                {errores.nombreSolicitante && (
                  <p className="text-rose-400 text-[10px] font-semibold parpadeo-error">
                    {errores.nombreSolicitante}
                  </p>
                )}
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="soporte-email"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Correo de Contacto
                </label>
                <input
                  id="soporte-email"
                  type="text"
                  value={formData.email}
                  onChange={(e) => handleCambioForm("email", e.target.value)}
                  placeholder="Ej: j.almiron@colocolo.cl"
                  className={`w-full bg-[#050505] border p-2.5 text-xs text-white focus:outline-none transition-colors ${
                    errores.email
                      ? "border-rose-500/80 focus:border-rose-500"
                      : "border-white/10 focus:border-white/40"
                  }`}
                />
                {errores.email && (
                  <p className="text-rose-400 text-[10px] font-semibold parpadeo-error">
                    {errores.email}
                  </p>
                )}
              </div>
            </div>

            {/* departamento, categoria y prioridad */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="soporte-departamento"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Departamento
                </label>
                <select
                  id="soporte-departamento"
                  value={formData.departamento}
                  onChange={(e) => handleCambioForm("departamento", e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                >
                  {DEPARTAMENTOS_DISPONIBLES.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="soporte-categoria"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Categoría
                </label>
                <select
                  id="soporte-categoria"
                  value={formData.categoria}
                  onChange={(e) => handleCambioForm("categoria", e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                >
                  {CATEGORIAS_DISPONIBLES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="soporte-prioridad"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Prioridad
                </label>
                <select
                  id="soporte-prioridad"
                  value={formData.prioridad}
                  onChange={(e) => handleCambioForm("prioridad", e.target.value)}
                  className="w-full bg-[#050505] border border-white/10 p-2.5 text-xs text-white focus:outline-none focus:border-white/40"
                >
                  {PRIORIDADES_DISPONIBLES.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* asunto */}
            <div className="space-y-1.5">
              <label
                htmlFor="soporte-asunto"
                className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
              >
                Asunto del Requerimiento
              </label>
              <input
                id="soporte-asunto"
                type="text"
                value={formData.asunto}
                onChange={(e) => handleCambioForm("asunto", e.target.value)}
                placeholder="Ej: Falla en la carga de clips tácticos post partido"
                className={`w-full bg-[#050505] border p-2.5 text-xs text-white focus:outline-none transition-colors ${
                  errores.asunto
                    ? "border-rose-500/80 focus:border-rose-500"
                    : "border-white/10 focus:border-white/40"
                }`}
              />
              {errores.asunto && (
                <p className="text-rose-400 text-[10px] font-semibold parpadeo-error">
                  {errores.asunto}
                </p>
              )}
            </div>

            {/* descripcion */}
            <div className="space-y-1.5">
              <label
                htmlFor="soporte-descripcion"
                className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
              >
                Descripción Detallada
              </label>
              <textarea
                id="soporte-descripcion"
                rows={4}
                value={formData.descripcion}
                onChange={(e) => handleCambioForm("descripcion", e.target.value)}
                placeholder="Describe los pasos para reproducir el problema o las métricas que necesitas que sean revisadas por el equipo de TI."
                className={`w-full bg-[#050505] border p-2.5 text-xs text-white focus:outline-none resize-none transition-colors ${
                  errores.descripcion
                    ? "border-rose-500/80 focus:border-rose-500"
                    : "border-white/10 focus:border-white/40"
                }`}
              ></textarea>
              {errores.descripcion && (
                <p className="text-rose-400 text-[10px] font-semibold parpadeo-error">
                  {errores.descripcion}
                </p>
              )}
            </div>



            {/* boton de envio */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full bg-white hover:bg-neutral-200 text-black font-black text-xs uppercase tracking-widest py-3 transition-colors cursor-pointer"
              >
                Registrar Ticket en Mesa de Ayuda
              </button>
            </div>
          </form>
        </section>

        {/* columna derecha (6 columnas): listado de tickets registrados */}
        <section
          aria-labelledby="titulo-tickets-registrados"
          className="lg:col-span-6 space-y-4"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-2">
            <h2
              id="titulo-tickets-registrados"
              className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-white inline-block"></span>
              Historial de Solicitudes ({ticketsFiltrados.length})
            </h2>

            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
              Gestión de Casos
            </span>
          </div>

          {/* filtros y buscador */}
          <div className="space-y-3">
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Buscar por asunto, solicitante o ID de ticket..."
              aria-label="Buscar tickets de soporte"
              className="w-full bg-[#0a0a0a] border border-white/15 px-3 py-2 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-white/40"
            />

            <div className="flex items-center gap-2 flex-wrap text-xs">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Estado:
              </span>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                aria-label="Filtrar por estado"
                className="bg-[#0a0a0a] border border-white/10 px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-white/40"
              >
                <option value="todos">Todos los Estados</option>
                <option value="Abierto">Abierto</option>
                <option value="En Revisión">En Revisión</option>
                <option value="Resuelto">Resuelto</option>
              </select>

              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 ml-2">
                Categoría:
              </span>
              <select
                value={filtroCategoria}
                onChange={(e) => setFiltroCategoria(e.target.value)}
                aria-label="Filtrar por categoría"
                className="bg-[#0a0a0a] border border-white/10 px-2.5 py-1 text-xs text-neutral-300 focus:outline-none focus:border-white/40"
              >
                <option value="todos">Todas las Categorías</option>
                {CATEGORIAS_DISPONIBLES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>

              {(filtroEstado !== "todos" || filtroCategoria !== "todos" || busqueda) && (
                <button
                  type="button"
                  onClick={() => {
                    setFiltroEstado("todos");
                    setFiltroCategoria("todos");
                    setBusqueda("");
                  }}
                  className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white underline ml-auto cursor-pointer"
                >
                  Limpiar filtros
                </button>
              )}
            </div>
          </div>

          {/* confirmacion inline de eliminacion sin confirm() */}
          {confirmarEliminarId && (
            <div className="border border-rose-500/50 bg-rose-950/30 p-3.5 flex items-center justify-between text-xs animate-fade-in">
              <span className="text-rose-200">
                ¿Eliminar ticket <strong>#{confirmarEliminarId.toUpperCase()}</strong> del registro?
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleConfirmarEliminar(confirmarEliminarId)}
                  className="bg-rose-600 hover:bg-rose-500 text-white font-bold text-[10px] uppercase px-3 py-1 cursor-pointer"
                >
                  Sí, eliminar
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmarEliminarId(null)}
                  className="border border-white/20 text-neutral-300 hover:text-white font-bold text-[10px] uppercase px-3 py-1 cursor-pointer"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* listado de tarjetas de tickets */}
          <div className="space-y-3">
            {ticketsFiltrados.length === 0 ? (
              <div className="border border-white/10 bg-[#0a0a0a]/80 p-8 text-center space-y-2">
                <p className="text-white text-xs font-bold uppercase tracking-wider">
                  No se encontraron tickets con los criterios de búsqueda
                </p>
                <p className="text-neutral-500 text-[11px]">
                  Prueba cambiando los filtros de categoría o estado.
                </p>
              </div>
            ) : (
              ticketsFiltrados.map((ticket) => {
                const esDetalleAbierto = ticketDetalleId === ticket.id;

                return (
                  <article
                    key={ticket.id}
                    className="border border-white/10 bg-[#0a0a0a]/90 p-4 space-y-3 hover:border-white/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[10px] font-mono font-black text-white px-2 py-0.5 bg-white/5 border border-white/10">
                            #{ticket.id.toUpperCase()}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${colorPrioridad(ticket.prioridad)}`}>
                            {ticket.prioridad}
                          </span>
                          <span className={`text-[9px] font-bold uppercase px-2 py-0.5 border ${colorEstado(ticket.estado)}`}>
                            {ticket.estado}
                          </span>
                          <span className="text-[10px] text-neutral-500">
                            {ticket.fecha}
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-white uppercase tracking-wider pt-1">
                          {ticket.asunto}
                        </h3>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 leading-relaxed">
                      {ticket.descripcion}
                    </p>

                    <div className="flex items-center justify-between text-[10px] text-neutral-400 border-t border-white/5 pt-2 flex-wrap gap-2">
                      <div>
                        <span>Solicitado por: <strong className="text-white">{ticket.nombreSolicitante}</strong> ({ticket.departamento})</span>
                      </div>
                      <span className="text-neutral-500">{ticket.email}</span>
                    </div>

                    {/* respuesta tecnica expandible */}
                    {esDetalleAbierto && (
                      <div className="bg-white/2 border border-white/10 p-3 space-y-1 text-xs animate-fade-in">
                        <span className="text-[9px] font-bold uppercase tracking-widest text-emerald-400 block">
                          Respuesta de Mesa de Ayuda
                        </span>
                        <p className="text-neutral-300 text-[11px] leading-relaxed">
                          {ticket.respuestaTecnica}
                        </p>
                      </div>
                    )}

                    {/* barra de acciones del ticket */}
                    <div className="flex items-center justify-between border-t border-white/5 pt-2 flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setTicketDetalleId(esDetalleAbierto ? null : ticket.id)}
                        className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white underline cursor-pointer"
                      >
                        {esDetalleAbierto ? "Ocultar Respuesta" : "Ver Respuesta Técnica"}
                      </button>

                      <div className="flex items-center gap-2">
                        {ticket.estado !== "Resuelto" ? (
                          <button
                            type="button"
                            onClick={() => handleCambiarEstado(ticket.id, "Resuelto")}
                            className="text-[9px] uppercase font-bold text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 hover:border-emerald-500 px-2 py-1 bg-emerald-500/5 cursor-pointer"
                          >
                            Marcar Resuelto
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleCambiarEstado(ticket.id, "En Revisión")}
                            className="text-[9px] uppercase font-bold text-amber-400 hover:text-amber-300 border border-amber-500/30 hover:border-amber-500 px-2 py-1 bg-amber-500/5 cursor-pointer"
                          >
                            Reabrir Caso
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => setConfirmarEliminarId(ticket.id)}
                          className="text-[9px] uppercase font-bold text-rose-400 hover:text-rose-300 px-2 py-1 border border-rose-500/20 hover:border-rose-500/50 cursor-pointer"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })
            )}
          </div>
        </section>
      </div>

      {/* pie de pagina institucional */}
      <footer className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] uppercase tracking-widest text-neutral-500 gap-2">
        <p>CC Analytics — Soporte Técnico Oficial // Colo-Colo</p>
        <p>Mesa de Ayuda Operativa • Tiempo de atención promedio: 1.8 hrs</p>
      </footer>
    </div>
  );
};

export default Soporte;

