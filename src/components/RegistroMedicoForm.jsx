import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// Estilo dinamico de input segun estado de validacion sin atributos HTML prohibidos
const claseInput = (error) =>
  `w-full bg-[#0a0a0a]/90 border p-3 text-white text-xs antialiased focus:outline-none transition-all duration-300 ${
    error
      ? "border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
      : "border-white/10 focus:border-white/30"
  }`;

const TIPOS_LESION_VALIDOS = [
  "Muscular",
  "Articular",
  "Ósea",
  "Sobrecarga",
  "Ligamentosa",
];

const GRAVEDADES_VALIDAS = ["Leve", "Moderada", "Grave"];

const FASES_VALIDAS = [
  "Rehabilitación Kinésica",
  "Reintegro Deportivo",
  "Alta Médica",
];

const RegistroMedicoForm = ({
  registro,
  plantel = [],
  onGuardar,
  onCancelar,
}) => {
  // Inicializacion del estado del formulario
  const [formData, setFormData] = useState({
    jugadorId: registro?.jugadorId || (plantel[0]?.id || ""),
    tipoLesion: registro?.tipoLesion || "Muscular",
    gravedad: registro?.gravedad || "Moderada",
    diagnostico: registro?.diagnostico || "",
    diasRecuperacion:
      registro?.diasRecuperacion !== undefined
        ? String(registro.diasRecuperacion)
        : "14",
    fase: registro?.fase || "Rehabilitación Kinésica",
    medicoTratante:
      registro?.medicoTratante || "Dr. Roberto Yáñez (Kinesiología CSD)",
    observaciones:
      registro?.observaciones ||
      "Control kinésico regular y crioterapia en gimnasio Monumental.",
  });

  // Estado para los mensajes de error
  const [errors, setErrors] = useState({});

  // Bloqueo de scroll y escucha de tecla Escape
  useEffect(() => {
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onCancelar();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onCancelar]);

  const handleChange = (campo, valor) => {
    setFormData((prev) => ({ ...prev, [campo]: valor }));
    if (errors[campo]) {
      setErrors((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    let esValido = true;

    // 1. Validacion de jugador
    if (!formData.jugadorId) {
      nuevosErrores.jugadorId = "Debes seleccionar un futbolista del plantel.";
      esValido = false;
    }

    // 2. Validacion de diagnostico (minimo 4 caracteres)
    const diagLimpio = formData.diagnostico.trim();
    if (!diagLimpio) {
      nuevosErrores.diagnostico = "El diagnóstico médico es obligatorio.";
      esValido = false;
    } else if (diagLimpio.length < 4) {
      nuevosErrores.diagnostico =
        "El diagnóstico debe contener al menos 4 caracteres.";
      esValido = false;
    }

    // 3. Validacion de dias estimados (entero positivo 1 a 365)
    const diasNum = Number(formData.diasRecuperacion);
    if (
      !formData.diasRecuperacion ||
      isNaN(diasNum) ||
      !Number.isInteger(diasNum)
    ) {
      nuevosErrores.diasRecuperacion =
        "Los días de recuperación deben ser un número entero.";
      esValido = false;
    } else if (diasNum < 1 || diasNum > 365) {
      nuevosErrores.diasRecuperacion =
        "El tiempo de recuperación debe estar entre 1 y 365 días.";
      esValido = false;
    }

    // 4. Validacion de tipo de lesion
    if (!TIPOS_LESION_VALIDOS.includes(formData.tipoLesion)) {
      nuevosErrores.tipoLesion = "Selecciona una categoría de lesión válida.";
      esValido = false;
    }

    setErrors(nuevosErrores);

    if (esValido) {
      // Obtener datos del jugador seleccionado
      const jugadorSeleccionado = plantel.find(
        (j) => j.id === formData.jugadorId
      );

      // Determinar el estado segun la fase clinica
      let estadoCalculado = "Baja Activa";
      if (formData.fase === "Reintegro Deportivo") {
        estadoCalculado = "En Reintegro";
      } else if (formData.fase === "Alta Médica") {
        estadoCalculado = "Alta Médica";
      }

      onGuardar({
        ...(registro?.id ? { id: registro.id } : {}),
        jugadorId: formData.jugadorId,
        jugadorNombre:
          jugadorSeleccionado?.nombre || registro?.jugadorNombre || "Jugador",
        dorsal: jugadorSeleccionado?.dorsal || registro?.dorsal || 0,
        posicion: jugadorSeleccionado?.posicion || registro?.posicion || "Plantel",
        tipoLesion: formData.tipoLesion,
        diagnostico: diagLimpio,
        gravedad: formData.gravedad,
        diasRecuperacion: diasNum,
        diasRestantes:
          formData.fase === "Alta Médica"
            ? 0
            : registro?.diasRestantes !== undefined
            ? registro.diasRestantes
            : diasNum,
        fase: formData.fase,
        estado: estadoCalculado,
        medicoTratante: formData.medicoTratante.trim(),
        observaciones: formData.observaciones.trim(),
        fechaIngreso:
          registro?.fechaIngreso || new Date().toISOString().split("T")[0],
      });
    }
  };

  const modalJSX = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onCancelar();
        }
      }}
    >
      <div className="border border-white/10 bg-[#0a0a0a] w-full max-w-lg p-5 sm:p-8 space-y-5 sm:space-y-6 shadow-2xl relative my-auto max-h-[92vh] overflow-y-auto">
        {/* Encabezado del modal */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-neutral-500">
              CC Analytics // Área Médica y Kinesiología
            </span>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              {registro ? "Editar Ficha Clínica" : "Nuevo Registro de Lesión"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onCancelar}
            className="text-neutral-500 hover:text-white text-xs uppercase font-bold tracking-widest px-2 py-1 border border-white/5 hover:border-white/20 transition-colors cursor-pointer"
          >
            Cerrar [ESC]
          </button>
        </div>

        {/* Formulario controlado sin atributos HTML automaticos */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Seleccionar Futbolista */}
          <div className="space-y-1.5">
            <label
              htmlFor="medico-jugador"
              className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
            >
              Futbolista Afectado
            </label>
            <select
              id="medico-jugador"
              value={formData.jugadorId}
              onChange={(e) => handleChange("jugadorId", e.target.value)}
              className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
            >
              {plantel.map((j) => (
                <option key={j.id} value={j.id} className="bg-black text-white">
                  #{j.dorsal} {j.nombre} ({j.posicion})
                </option>
              ))}
            </select>
            {errors.jugadorId && (
              <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error antialiased">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                {errors.jugadorId}
              </p>
            )}
          </div>

          {/* Fila Categoria y Gravedad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="medico-tipo"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Tipo de Lesión
              </label>
              <select
                id="medico-tipo"
                value={formData.tipoLesion}
                onChange={(e) => handleChange("tipoLesion", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {TIPOS_LESION_VALIDOS.map((tipo) => (
                  <option key={tipo} value={tipo} className="bg-black text-white">
                    {tipo}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="medico-gravedad"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Gravedad Médica
              </label>
              <select
                id="medico-gravedad"
                value={formData.gravedad}
                onChange={(e) => handleChange("gravedad", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {GRAVEDADES_VALIDAS.map((g) => (
                  <option key={g} value={g} className="bg-black text-white">
                    {g}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo Diagnostico Clinico */}
          <div className="space-y-1.5">
            <label
              htmlFor="medico-diagnostico"
              className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
            >
              Diagnóstico Clínico
            </label>
            <input
              id="medico-diagnostico"
              type="text"
              value={formData.diagnostico}
              onChange={(e) => handleChange("diagnostico", e.target.value)}
              placeholder="Ej. Desgarro miofascial en isquiotibial derecho"
              className={claseInput(errors.diagnostico)}
            />
            {errors.diagnostico && (
              <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error antialiased">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                {errors.diagnostico}
              </p>
            )}
          </div>

          {/* Fila Dias de recuperacion y Fase actual */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="medico-dias"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Días Estimados
              </label>
              <input
                id="medico-dias"
                type="text"
                value={formData.diasRecuperacion}
                onChange={(e) =>
                  handleChange("diasRecuperacion", e.target.value)
                }
                placeholder="Ej. 14"
                className={claseInput(errors.diasRecuperacion)}
              />
              {errors.diasRecuperacion && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error antialiased">
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                  {errors.diasRecuperacion}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="medico-fase"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Fase de Tratamiento
              </label>
              <select
                id="medico-fase"
                value={formData.fase}
                onChange={(e) => handleChange("fase", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {FASES_VALIDAS.map((f) => (
                  <option key={f} value={f} className="bg-black text-white">
                    {f}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Campo Medico / Kinesiologo tratante */}
          <div className="space-y-1.5">
            <label
              htmlFor="medico-responsable"
              className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
            >
              Profesional Responsable
            </label>
            <input
              id="medico-responsable"
              type="text"
              value={formData.medicoTratante}
              onChange={(e) => handleChange("medicoTratante", e.target.value)}
              placeholder="Ej. Dr. Roberto Yáñez"
              className={claseInput(false)}
            />
          </div>

          {/* Campo Observaciones */}
          <div className="space-y-1.5">
            <label
              htmlFor="medico-observaciones"
              className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
            >
              Observaciones Clínicas / Evolución
            </label>
            <input
              id="medico-observaciones"
              type="text"
              value={formData.observaciones}
              onChange={(e) => handleChange("observaciones", e.target.value)}
              placeholder="Detalle de evolución, ecografías o cargas físicas..."
              className={claseInput(false)}
            />
          </div>

          {/* Botones de accion */}
          <div className="pt-4 border-t border-white/10 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onCancelar}
              className="px-4 py-2.5 text-xs uppercase font-bold tracking-widest text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs uppercase font-bold tracking-widest bg-white text-black hover:bg-neutral-200 transition-colors cursor-pointer font-black"
            >
              {registro ? "Guardar Cambios" : "Registrar Lesión"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  return typeof document !== "undefined"
    ? createPortal(modalJSX, document.body)
    : modalJSX;
};

export default RegistroMedicoForm;

