import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

// estilo dinamico de input segun estado de validacion (sin atributos HTML prohibidos)
const claseInput = (error) =>
  `w-full bg-[#0a0a0a]/90 border p-3 text-white text-xs antialiased focus:outline-none transition-all duration-300 ${
    error
      ? "border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
      : "border-white/10 focus:border-white/30"
  }`;

const POSICIONES_VALIDAS = [
  "Arquero",
  "Defensa",
  "Mediocampista",
  "Delantero",
];

const ROLES_VALIDOS = ["Titular", "Suplente", "Reserva"];

const ESTADOS_VALIDOS = ["Disponible", "En recuperación", "Suspendido"];

const JugadorForm = ({ jugador, onGuardar, onCancelar, plantelActual = [] }) => {
  // estado local para los campos del formulario
  const [formData, setFormData] = useState({
    nombre: jugador?.nombre || "",
    dorsal: jugador?.dorsal !== undefined ? String(jugador.dorsal) : "",
    posicion: jugador?.posicion || "Mediocampista",
    edad: jugador?.edad !== undefined ? String(jugador.edad) : "",
    altura: jugador?.altura || "1.78 m",
    pie: jugador?.pie || "Derecho",
    rol: jugador?.rol || "Titular",
    estado: jugador?.estado || "Disponible",
  });

  // estado local para mensajes de error de validacion
  const [errors, setErrors] = useState({});

  // bloquear scroll de fondo y escuchar tecla Escape
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
    // limpiar error del campo al escribir
    if (errors[campo]) {
      setErrors((prev) => ({ ...prev, [campo]: "" }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = {};
    let esValido = true;

    // 1. Validacion de nombre (minimo 3 caracteres, no vacio)
    const nombreLimpio = formData.nombre.trim();
    if (!nombreLimpio) {
      nuevosErrores.nombre = "El nombre del jugador es obligatorio.";
      esValido = false;
    } else if (nombreLimpio.length < 3) {
      nuevosErrores.nombre = "El nombre debe tener al menos 3 caracteres.";
      esValido = false;
    }

    // 2. Validacion de dorsal (entero 1 a 99 y no repetido)
    const dorsalNum = Number(formData.dorsal);
    if (!formData.dorsal || isNaN(dorsalNum) || !Number.isInteger(dorsalNum)) {
      nuevosErrores.dorsal = "El dorsal debe ser un número entero válido.";
      esValido = false;
    } else if (dorsalNum < 1 || dorsalNum > 99) {
      nuevosErrores.dorsal = "El número de dorsal debe estar entre 1 y 99.";
      esValido = false;
    } else {
      // verificar que el dorsal no este ocupado por otro jugador
      const repetido = plantelActual.some(
        (j) => j.dorsal === dorsalNum && j.id !== jugador?.id
      );
      if (repetido) {
        nuevosErrores.dorsal = `El dorsal #${dorsalNum} ya está asignado a otro jugador.`;
        esValido = false;
      }
    }

    // 3. Validacion de posicion
    if (!POSICIONES_VALIDAS.includes(formData.posicion)) {
      nuevosErrores.posicion = "Selecciona una posición táctica válida.";
      esValido = false;
    }

    // 4. Validacion de edad (rango deportivo 16 a 45 años)
    const edadNum = Number(formData.edad);
    if (!formData.edad || isNaN(edadNum) || !Number.isInteger(edadNum)) {
      nuevosErrores.edad = "La edad debe ser un número entero.";
      esValido = false;
    } else if (edadNum < 16 || edadNum > 45) {
      nuevosErrores.edad = "La edad debe estar comprendida entre 16 y 45 años.";
      esValido = false;
    }

    setErrors(nuevosErrores);

    if (esValido) {
      onGuardar({
        ...(jugador?.id ? { id: jugador.id } : {}),
        nombre: nombreLimpio,
        dorsal: dorsalNum,
        posicion: formData.posicion,
        edad: edadNum,
        altura: formData.altura.trim() || "1.78 m",
        pie: formData.pie,
        rol: formData.rol,
        estado: formData.estado,
        partidos: jugador?.partidos || 0,
      });
    }
  };

  const modalJSX = (
    <div
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
      onClick={(e) => {
        // cerrar si se hace clic en el fondo oscuro
        if (e.target === e.currentTarget) {
          onCancelar();
        }
      }}
    >
      <div className="border border-white/10 bg-[#0a0a0a] w-full max-w-lg p-6 sm:p-8 space-y-6 shadow-2xl relative my-auto animate-modal-pop">
        {/* encabezado modal */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div>
            <span className="text-[9px] uppercase font-bold tracking-[0.25em] text-neutral-500">
              CC Analytics // Ficha de Plantel
            </span>
            <h2 className="text-xl font-black uppercase tracking-wider text-white">
              {jugador ? "Editar Jugador" : "Nuevo Jugador"}
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

        {/* formulario controlado sin atributos HTML de validacion automatica */}
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* campo Nombre */}
          <div className="space-y-1.5">
            <label
              htmlFor="jugador-nombre"
              className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
            >
              Nombre y Apellidos
            </label>
            <input
              id="jugador-nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleChange("nombre", e.target.value)}
              placeholder="Ej. Esteban Pavez"
              className={claseInput(errors.nombre)}
            />
            {errors.nombre && (
              <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error antialiased">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                {errors.nombre}
              </p>
            )}
          </div>

          {/* fila Dorsal y Edad */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="jugador-dorsal"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Dorsal (#)
              </label>
              <input
                id="jugador-dorsal"
                type="text"
                value={formData.dorsal}
                onChange={(e) => handleChange("dorsal", e.target.value)}
                placeholder="1 - 99"
                className={claseInput(errors.dorsal)}
              />
              {errors.dorsal && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error antialiased">
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                  {errors.dorsal}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="jugador-edad"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Edad (Años)
              </label>
              <input
                id="jugador-edad"
                type="text"
                value={formData.edad}
                onChange={(e) => handleChange("edad", e.target.value)}
                placeholder="16 - 45"
                className={claseInput(errors.edad)}
              />
              {errors.edad && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5 parpadeo-error antialiased">
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                  {errors.edad}
                </p>
              )}
            </div>
          </div>

          {/* fila Posicion y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="jugador-posicion"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Posición Táctica
              </label>
              <select
                id="jugador-posicion"
                value={formData.posicion}
                onChange={(e) => handleChange("posicion", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {POSICIONES_VALIDAS.map((pos) => (
                  <option key={pos} value={pos} className="bg-black text-white">
                    {pos}
                  </option>
                ))}
              </select>
              {errors.posicion && (
                <p className="text-red-500 text-[11px] font-semibold flex items-center gap-1.5">
                  <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                  {errors.posicion}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="jugador-estado"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Estado Físico / Médico
              </label>
              <select
                id="jugador-estado"
                value={formData.estado}
                onChange={(e) => handleChange("estado", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {ESTADOS_VALIDOS.map((est) => (
                  <option key={est} value={est} className="bg-black text-white">
                    {est}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* fila Rol y Pie Habil */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label
                htmlFor="jugador-rol"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Rol en el Plantel
              </label>
              <select
                id="jugador-rol"
                value={formData.rol}
                onChange={(e) => handleChange("rol", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                {ROLES_VALIDOS.map((rol) => (
                  <option key={rol} value={rol} className="bg-black text-white">
                    {rol}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="jugador-pie"
                className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
              >
                Pie Hábil
              </label>
              <select
                id="jugador-pie"
                value={formData.pie}
                onChange={(e) => handleChange("pie", e.target.value)}
                className="w-full bg-[#0a0a0a] border border-white/10 p-3 text-white text-xs antialiased focus:outline-none focus:border-white/30 cursor-pointer"
              >
                <option value="Derecho" className="bg-black text-white">
                  Derecho
                </option>
                <option value="Izquierdo" className="bg-black text-white">
                  Izquierdo
                </option>
                <option value="Ambidiestro" className="bg-black text-white">
                  Ambidiestro
                </option>
              </select>
            </div>
          </div>

          {/* botones de accion */}
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
              {jugador ? "Guardar Cambios" : "Crear Ficha"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  // renderizar usando Portal directamente en document.body para evitar que los scroll o transform de la pagina lo desfasen
  return typeof document !== "undefined"
    ? createPortal(modalJSX, document.body)
    : modalJSX;
};

export default JugadorForm;
