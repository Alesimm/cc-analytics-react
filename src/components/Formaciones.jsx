import { useState, useMemo, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  obtenerEsquemas,
  guardarNuevoEsquema,
  actualizarEsquema,
  eliminarEsquema,
  obtenerConfiguracionTactica,
  guardarConfiguracionTactica,
} from "../data/formacionesData";

// etiquetas dinamicas para los porcentajes de parametros tacticos
const obtenerEtiquetaBloque = (porcentaje) => {
  if (porcentaje <= 35) return "Baja (Repliegue bajo en área)";
  if (porcentaje <= 70) return "Media (Bloque equilibrado)";
  return "Alta (Presión asfixiante)";
};

const obtenerEtiquetaAnchura = (porcentaje) => {
  if (porcentaje <= 35) return "Estrecho (Cerrar carriles centrales)";
  if (porcentaje <= 70) return "Estándar (Distribución equilibrada)";
  return "Amplio (Apertura máxima por bandas)";
};

const obtenerEtiquetaPresion = (porcentaje) => {
  if (porcentaje <= 35) return "Conservadora (Esperar rival)";
  if (porcentaje <= 70) return "Equilibrada tras pérdida";
  return "Intensa y Continua";
};

const obtenerEtiquetaRitmo = (porcentaje) => {
  if (porcentaje <= 35) return "Pausado y Posicional";
  if (porcentaje <= 70) return "Circulación fluida";
  return "Vertical y Directo";
};

// estilos de acento visual segun la demarcacion del futbolista
const obtenerColorLinea = (posicion) => {
  switch (posicion) {
    case "Arquero":
      return {
        borde: "border-amber-400",
        texto: "text-amber-400",
        bg: "bg-amber-400/10",
        badge: "bg-amber-500/20 text-amber-300 border-amber-500/40",
      };
    case "Defensa":
      return {
        borde: "border-sky-400",
        texto: "text-sky-400",
        bg: "bg-sky-400/10",
        badge: "bg-sky-500/20 text-sky-300 border-sky-500/40",
      };
    case "Mediocampo":
      return {
        borde: "border-emerald-400",
        texto: "text-emerald-400",
        bg: "bg-emerald-400/10",
        badge: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
      };
    case "Delantero":
      return {
        borde: "border-rose-400",
        texto: "text-rose-400",
        bg: "bg-rose-400/10",
        badge: "bg-rose-500/20 text-rose-300 border-rose-500/40",
      };
    default:
      return {
        borde: "border-white",
        texto: "text-white",
        bg: "bg-white/10",
        badge: "bg-white/20 text-white border-white/40",
      };
  }
};

const Formaciones = () => {
  // listado de esquemas cargados (oficiales + personalizados)
  const [esquemas, setEsquemas] = useState(() => obtenerEsquemas());
  const [formacionActivaId, setFormacionActivaId] = useState("4-3-3");

  // titulares y suplentes del esquema activo
  const [titulares, setTitulares] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    const lista = obtenerEsquemas();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.titulares;
    return lista[0]?.titulares || [];
  });

  const [suplentes, setSuplentes] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    const lista = obtenerEsquemas();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.suplentes;
    return lista[0]?.suplentes || [];
  });

  // parametros tacticos en porcentaje (0 a 100)
  const [alturaBloque, setAlturaBloque] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado?.formacionId === "4-3-3" && typeof guardado.alturaBloque === "number") {
      return guardado.alturaBloque;
    }
    return 75;
  });

  const [anchuraEquipo, setAnchuraEquipo] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado?.formacionId === "4-3-3" && typeof guardado.anchuraEquipo === "number") {
      return guardado.anchuraEquipo;
    }
    return 70;
  });

  const [intensidadPresion, setIntensidadPresion] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado?.formacionId === "4-3-3" && typeof guardado.intensidadPresion === "number") {
      return guardado.intensidadPresion;
    }
    return 80;
  });

  const [ritmoPosesion, setRitmoPosesion] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado?.formacionId === "4-3-3" && typeof guardado.ritmoPosesion === "number") {
      return guardado.ritmoPosesion;
    }
    return 60;
  });

  // futbolista seleccionado en cancha para ver su ficha tecnica
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

  // estado de arrastre para drag & drop
  const [suplenteArrastrado, setSuplenteArrastrado] = useState(null);
  const [titularDestinoHover, setTitularDestinoHover] = useState(null);

  // mensajes de feedback y error ubicados junto a la zona de accion del usuario
  const [mensajeFeedback, setMensajeFeedback] = useState("");
  const [errorSuplentes, setErrorSuplentes] = useState("");

  // modales para crear y editar esquemas
  const [modalNuevoEsquema, setModalNuevoEsquema] = useState(false);
  const [modalEditarEsquema, setModalEditarEsquema] = useState(false);
  const [confirmarEliminarId, setConfirmarEliminarId] = useState(null);

  const [formNuevo, setFormNuevo] = useState({
    nombre: "",
    descripcion: "",
    esquemaBaseId: "4-3-3",
  });
  const [errorFormNuevo, setErrorFormNuevo] = useState("");

  const [formEditar, setFormEditar] = useState({
    nombre: "",
    descripcion: "",
  });

  // esquema activo actual
  const esquemaActual = useMemo(() => {
    return esquemas.find((e) => e.id === formacionActivaId) || esquemas[0];
  }, [esquemas, formacionActivaId]);

  // promedio de calificacion del once titular
  const mediaOnceTitular = useMemo(() => {
    if (!titulares.length) return 80;
    const suma = titulares.reduce((acc, t) => acc + (t.media || 80), 0);
    return (suma / titulares.length).toFixed(1);
  }, [titulares]);

  // calculo de posiciones dinamicas optimizadas con aceleracion gpu
  const posicionesDinamicas = useMemo(() => {
    return titulares.map((titular) => {
      // portero permanece en el area chica
      if (titular.rol === "POR") {
        return { ...titular, xCalc: 50, yCalc: 88 };
      }

      // desplazamiento vertical segun altura de bloque defensivo
      let factorY = 0.12;
      if (titular.posicion === "Defensa") factorY = 0.18;
      if (titular.posicion === "Mediocampo") factorY = 0.14;
      if (titular.posicion === "Delantero") factorY = 0.08;

      const deltaY = (50 - alturaBloque) * factorY;
      const yCalculada = Math.min(Math.max(titular.y + deltaY, 12), 85);

      // desplazamiento horizontal segun anchura del equipo
      let xCalculada = titular.x;
      if (titular.x < 45) {
        const deltaX = ((anchuraEquipo - 50) / 50) * 8;
        xCalculada = Math.max(titular.x - deltaX, 8);
      } else if (titular.x > 55) {
        const deltaX = ((anchuraEquipo - 50) / 50) * 8;
        xCalculada = Math.min(titular.x + deltaX, 92);
      }

      return {
        ...titular,
        xCalc: Number(xCalculada.toFixed(1)),
        yCalc: Number(yCalculada.toFixed(1)),
      };
    });
  }, [titulares, alturaBloque, anchuraEquipo]);

  // cambiar formacion activa
  const handleCambiarFormacion = (nuevoId) => {
    setFormacionActivaId(nuevoId);
    setJugadorSeleccionado(null);
    setErrorSuplentes("");

    const esquema = esquemas.find((e) => e.id === nuevoId) || esquemas[0];
    const guardado = obtenerConfiguracionTactica();

    if (guardado && guardado.formacionId === nuevoId) {
      setTitulares(guardado.titulares);
      setSuplentes(guardado.suplentes);
      setAlturaBloque(guardado.alturaBloque ?? esquema.alturaBloque ?? 70);
      setAnchuraEquipo(guardado.anchuraEquipo ?? esquema.anchuraEquipo ?? 60);
      setIntensidadPresion(guardado.intensidadPresion ?? esquema.intensidadPresion ?? 75);
      setRitmoPosesion(guardado.ritmoPosesion ?? esquema.ritmoPosesion ?? 60);
    } else {
      setTitulares(esquema.titulares);
      setSuplentes(esquema.suplentes);
      setAlturaBloque(esquema.alturaBloque ?? 70);
      setAnchuraEquipo(esquema.anchuraEquipo ?? 60);
      setIntensidadPresion(esquema.intensidadPresion ?? 75);
      setRitmoPosesion(esquema.ritmoPosesion ?? 60);
    }
  };

  // validacion de demarcacion posicional estricta
  const esCompatible = (suplente, titular) => {
    if (!suplente || !titular) return false;
    // portero unicamente con portero
    if (titular.posicion === "Arquero" || suplente.posicion === "Arquero") {
      return titular.posicion === suplente.posicion;
    }
    // jugadores de campo deben coincidir con la posicion de la demarcacion
    return titular.posicion === suplente.posicion;
  };

  // ejecutar sustitucion
  const ejecutarSustitucion = (suplente, titular) => {
    if (!esCompatible(suplente, titular)) {
      setErrorSuplentes(
        `Incompatibilidad táctica: No puedes colocar a un ${suplente.posicion} en la posición de ${titular.posicion}. Respeta las demarcaciones tácticas.`
      );
      setTimeout(() => setErrorSuplentes(""), 4500);
      return false;
    }

    setErrorSuplentes("");

    // nuevo titular hereda coordenadas y rol tactico
    const nuevoTitular = {
      ...suplente,
      rol: titular.rol,
      x: titular.x,
      y: titular.y,
    };

    // nuevo suplente toma la identidad del titular saliente
    const nuevoSuplente = {
      id: titular.id,
      dorsal: titular.dorsal,
      nombre: titular.nombre,
      posicion: titular.posicion,
      media: titular.media || 80,
      rol: titular.rol || (titular.posicion === "Arquero" ? "POR" : titular.posicion.slice(0, 3).toUpperCase()),
    };

    const nuevosTitulares = titulares.map((t) =>
      t.id === titular.id ? nuevoTitular : t
    );
    const nuevosSuplentes = suplentes.map((s) =>
      s.id === suplente.id ? nuevoSuplente : s
    );

    setTitulares(nuevosTitulares);
    setSuplentes(nuevosSuplentes);
    setJugadorSeleccionado(nuevoTitular);

    setMensajeFeedback(
      `Sustitución realizada: ingresó ${suplente.nombre} (#${suplente.dorsal}) por ${titular.nombre}.`
    );
    setTimeout(() => setMensajeFeedback(""), 3500);
    return true;
  };

  // sustitucion al hacer clic en un suplente
  const handleClicSuplente = (suplente) => {
    if (!jugadorSeleccionado) {
      setErrorSuplentes("Selecciona primero un titular en la cancha táctica para sustituirlo.");
      setTimeout(() => setErrorSuplentes(""), 3500);
      return;
    }
    const titular = titulares.find((t) => t.id === jugadorSeleccionado.id);
    if (titular) {
      ejecutarSustitucion(suplente, titular);
    }
  };

  // manejadores de drag & drop
  const handleDragStartSuplente = (e, suplente) => {
    setSuplenteArrastrado(suplente);
    e.dataTransfer.setData("text/plain", suplente.id);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOverTitular = (e, titular) => {
    e.preventDefault();
    setTitularDestinoHover(titular.id);
    e.dataTransfer.dropEffect = "move";
  };

  const handleDragLeaveTitular = () => {
    setTitularDestinoHover(null);
  };

  const handleDropTitular = (e, titular) => {
    e.preventDefault();
    setTitularDestinoHover(null);
    if (!suplenteArrastrado) return;
    ejecutarSustitucion(suplenteArrastrado, titular);
    setSuplenteArrastrado(null);
  };

  // guardar configuracion de la pizarra en memoria
  const handleGuardarConfiguracion = () => {
    const config = {
      formacionId: formacionActivaId,
      titulares,
      suplentes,
      alturaBloque,
      anchuraEquipo,
      intensidadPresion,
      ritmoPosesion,
      fecha: new Date().toLocaleDateString("es-CL"),
    };
    guardarConfiguracionTactica(config);
    setMensajeFeedback("Configuración táctica y parámetros del partido guardados correctamente.");
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  // restablecer posiciones
  const handleRestablecerEsquema = () => {
    const base = esquemas.find((e) => e.id === formacionActivaId) || esquemas[0];
    setTitulares(base.titulares);
    setSuplentes(base.suplentes);
    setAlturaBloque(base.alturaBloque ?? 70);
    setAnchuraEquipo(base.anchuraEquipo ?? 60);
    setIntensidadPresion(base.intensidadPresion ?? 75);
    setRitmoPosesion(base.ritmoPosesion ?? 60);
    setJugadorSeleccionado(null);
    setErrorSuplentes("");
    setMensajeFeedback("Alineación y posiciones restablecidas a los valores oficiales.");
    setTimeout(() => setMensajeFeedback(""), 3000);
  };

  // crear nuevo esquema (crud: create)
  const handleCrearNuevoEsquema = (e) => {
    e.preventDefault();
    if (!formNuevo.nombre.trim()) {
      setErrorFormNuevo("Debes ingresar un nombre para el nuevo esquema táctico.");
      return;
    }
    if (formNuevo.nombre.trim().length < 3) {
      setErrorFormNuevo("El nombre debe tener al menos 3 caracteres.");
      return;
    }

    const esquemaBase =
      esquemas.find((e) => e.id === formNuevo.esquemaBaseId) || esquemas[0];

    const nuevoEsquemaId = `custom-${Date.now()}`;
    const nuevo = {
      id: nuevoEsquemaId,
      nombre: formNuevo.nombre.trim(),
      descripcion:
        formNuevo.descripcion.trim() ||
        `Variante táctica personalizada basada en ${esquemaBase.nombre}.`,
      esOficial: false,
      alturaBloque,
      anchuraEquipo,
      intensidadPresion,
      ritmoPosesion,
      titulares: JSON.parse(JSON.stringify(titulares)),
      suplentes: JSON.parse(JSON.stringify(suplentes)),
    };

    guardarNuevoEsquema(nuevo);
    const actualizados = obtenerEsquemas();
    setEsquemas(actualizados);
    setFormacionActivaId(nuevoEsquemaId);
    setModalNuevoEsquema(false);
    setFormNuevo({ nombre: "", descripcion: "", esquemaBaseId: "4-3-3" });
    setErrorFormNuevo("");
    setMensajeFeedback(`Nuevo esquema táctico "${nuevo.nombre}" creado exitosamente.`);
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  // editar esquema (crud: update)
  const handleAbrirEditar = () => {
    setFormEditar({
      nombre: esquemaActual.nombre,
      descripcion: esquemaActual.descripcion,
    });
    setModalEditarEsquema(true);
  };

  const handleGuardarEdicion = (e) => {
    e.preventDefault();
    if (!formEditar.nombre.trim()) return;

    const modificado = {
      ...esquemaActual,
      nombre: formEditar.nombre.trim(),
      descripcion: formEditar.descripcion.trim() || esquemaActual.descripcion,
      alturaBloque,
      anchuraEquipo,
      intensidadPresion,
      ritmoPosesion,
      titulares,
      suplentes,
    };

    actualizarEsquema(modificado);
    setEsquemas(obtenerEsquemas());
    setModalEditarEsquema(false);
    setMensajeFeedback(`Esquema táctico "${modificado.nombre}" actualizado.`);
    setTimeout(() => setMensajeFeedback(""), 3000);
  };

  // eliminar esquema (crud: delete)
  const handleConfirmarEliminar = (id) => {
    eliminarEsquema(id);
    const restantes = obtenerEsquemas();
    setEsquemas(restantes);
    setConfirmarEliminarId(null);
    setFormacionActivaId(restantes[0].id);
    setTitulares(restantes[0].titulares);
    setSuplentes(restantes[0].suplentes);
    setMensajeFeedback("Esquema táctico personalizado eliminado de la pizarra.");
    setTimeout(() => setMensajeFeedback(""), 3000);
  };

  // bloquear scroll y tecla escape para modales de esquemas
  useEffect(() => {
    if (!modalNuevoEsquema && !modalEditarEsquema) return;
    const overflowOriginal = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setModalNuevoEsquema(false);
        setModalEditarEsquema(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflowOriginal;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [modalNuevoEsquema, modalEditarEsquema]);

  return (
    <div className="space-y-8 relative">
      {/* auras de luz ambiental indigo / violeta para la pizarra tactica */}
      <div className="absolute -top-10 right-1/4 w-96 h-96 rounded-full bg-[radial-gradient(circle,rgba(99,102,241,0.053),transparent_70%)] pointer-events-none -z-10"></div>
      <div className="absolute top-64 left-10 w-80 h-80 rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.038),transparent_70%)] pointer-events-none -z-10"></div>
      {/* cabecera principal estandarizada */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-block w-2.5 h-2.5 bg-indigo-400 rounded-full shadow-[0_0_12px_rgba(129,140,248,0.9)] animate-pulse"></span>
            <span className="text-[10px] uppercase font-bold tracking-[0.25em] text-neutral-400">
              CC Analytics // Táctica y Estrategia
            </span>
            <span className="text-neutral-700 text-xs hidden sm:inline">•</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 border border-white/10 px-2 py-0.5 bg-white/2">
              Temporada 2026
            </span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-white leading-none">
            Pizarra Táctica
          </h1>
          <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">
            Distribución Posicional, Esquemas y Parámetros del Partido
          </p>
        </div>

        {/* botones de accion */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => setModalNuevoEsquema(true)}
            className="text-[10px] uppercase font-black tracking-wider text-black bg-white hover:bg-neutral-200 px-3.5 py-2.5 transition-colors cursor-pointer"
          >
            + Nuevo Esquema
          </button>
          <button
            type="button"
            onClick={handleGuardarConfiguracion}
            className="text-[10px] uppercase font-black tracking-wider text-white border border-emerald-500/60 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black px-3.5 py-2.5 transition-colors cursor-pointer"
          >
            Guardar Configuración
          </button>
          <button
            type="button"
            onClick={handleRestablecerEsquema}
            className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3.5 py-2.5 bg-white/2 transition-colors cursor-pointer"
            title="Restablecer posiciones al esquema oficial"
          >
            Restablecer Posiciones
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

      {/* selector y gestion de esquemas tacticos */}
      <section aria-labelledby="titulo-esquemas" className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2 flex-wrap gap-2">
          <h2
            id="titulo-esquemas"
            className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-white inline-block"></span>
            Esquemas Tácticos Disponibles
          </h2>

          <div className="flex items-center gap-3">
            <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
              Activo: <strong className="text-white">{esquemaActual.nombre}</strong>
            </span>
            <button
              type="button"
              onClick={handleAbrirEditar}
              className="text-[10px] uppercase font-bold text-neutral-400 hover:text-white underline tracking-wider cursor-pointer"
            >
              Editar Nombre
            </button>
            {!esquemaActual.esOficial && (
              <button
                type="button"
                onClick={() => setConfirmarEliminarId(esquemaActual.id)}
                className="text-[10px] uppercase font-bold text-rose-400 hover:text-rose-300 underline tracking-wider cursor-pointer"
              >
                Eliminar
              </button>
            )}
          </div>
        </div>

        {/* confirmacion inline de eliminacion sin confirm() */}
        {confirmarEliminarId === esquemaActual.id && (
          <div className="border border-rose-500/50 bg-rose-950/30 p-3 flex items-center justify-between text-xs animate-fade-in">
            <span className="text-rose-200">
              ¿Eliminar el esquema <strong>{esquemaActual.nombre}</strong> de forma permanente?
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleConfirmarEliminar(esquemaActual.id)}
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

        {/* tarjetas de esquemas */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-3">
          {esquemas.map((formacion) => {
            const estaActiva = formacion.id === formacionActivaId;
            return (
              <button
                key={formacion.id}
                type="button"
                onClick={() => handleCambiarFormacion(formacion.id)}
                className={`p-3.5 border text-left transition-all cursor-pointer relative overflow-hidden ${
                  estaActiva
                    ? "border-white bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.06)]"
                    : "border-white/10 bg-[#0a0a0a]/80 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {estaActiva && (
                  <span className="absolute top-0 left-0 right-0 h-0.5 bg-emerald-400"></span>
                )}
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs sm:text-sm font-black tracking-wider uppercase truncate">
                    {formacion.nombre.split(" ")[0]}
                  </span>
                  {estaActiva ? (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]"></span>
                  ) : (
                    !formacion.esOficial && (
                      <span className="text-[9px] uppercase font-bold text-amber-400">Custom</span>
                    )
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 truncate">
                  {formacion.nombre.split(" ").slice(1).join(" ") || "Oficial"}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-neutral-400 font-medium italic border-l-2 border-neutral-700 pl-3 py-1">
          {esquemaActual.descripcion}
        </p>
      </section>

      {/* cuerpo principal: cancha de alta definicion (estilo gris oscuro brutalista) y parametros */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* columna izquierda (7 columnas): cancha tactica y bandeja horizontal de suplentes */}
        <section
          aria-labelledby="titulo-cancha"
          className="lg:col-span-7 border border-white/10 bg-[#0d0e11] p-4 sm:p-6 space-y-4 relative overflow-hidden shadow-2xl"
        >

          <div className="flex items-center justify-between border-b border-white/10 pb-3 relative z-10">
            <h3
              id="titulo-cancha"
              className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-white inline-block"></span>
              Pizarra Táctica // {esquemaActual.nombre}
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
              Media Titular: <strong className="text-white">{mediaOnceTitular}</strong>
            </span>
          </div>

          {/* campo de juego estilo pizarra tactica negra con lineas blancas de alto contraste */}
          <div
            className="relative w-full aspect-[4/5] max-h-[660px] rounded-xl border border-white/20 bg-[#050505] overflow-hidden select-none shadow-[0_0_35px_rgba(0,0,0,0.9)]"
            aria-label="Cancha táctica con posiciones de jugadores"
          >
            {/* lineas de cal en blanco nitido de alta definicion segun referencia visual */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-90 stroke-white"
              fill="none"
              strokeWidth="1.8"
              viewBox="0 0 300 400"
              preserveAspectRatio="none"
            >
              {/* perimetro exterior con curvatura */}
              <rect x="10" y="10" width="280" height="380" rx="3" />
              {/* linea divisoria central */}
              <line x1="10" y1="200" x2="290" y2="200" />
              {/* circulo y punto central */}
              <circle cx="150" cy="200" r="42" />
              <circle cx="150" cy="200" r="3" fill="white" />
              {/* area grande superior */}
              <rect x="68" y="10" width="164" height="66" />
              {/* area chica superior */}
              <rect x="104" y="10" width="92" height="24" />
              {/* arco de penal superior */}
              <path d="M 120 76 A 30 30 0 0 0 180 76" />
              {/* punto de penal superior */}
              <circle cx="150" cy="50" r="2.5" fill="white" />
              {/* area grande inferior */}
              <rect x="68" y="324" width="164" height="66" />
              {/* area chica inferior */}
              <rect x="104" y="366" width="92" height="24" />
              {/* arco de penal inferior */}
              <path d="M 120 324 A 30 30 0 0 1 180 324" />
              {/* punto de penal inferior */}
              <circle cx="150" cy="350" r="2.5" fill="white" />
              {/* arcos de esquina en las 4 esquinas */}
              <path d="M 10 24 A 14 14 0 0 0 24 10" />
              <path d="M 276 10 A 14 14 0 0 0 290 24" />
              <path d="M 10 376 A 14 14 0 0 1 24 390" />
              <path d="M 276 390 A 14 14 0 0 1 290 376" />
            </svg>

            {/* fichas de los futbolistas con traslacion fluida a 60 fps mediante transformaciones aceleradas */}
            {posicionesDinamicas.map((jugador) => {
              const estaSeleccionado = jugadorSeleccionado?.id === jugador.id;
              const esDestinoHover = titularDestinoHover === jugador.id;
              const colorInfo = obtenerColorLinea(jugador.posicion);

              const compatibleConArrastrado =
                suplenteArrastrado && esCompatible(suplenteArrastrado, jugador);

              return (
                <div
                  key={jugador.id}
                  style={{
                    left: `${jugador.xCalc}%`,
                    top: `${jugador.yCalc}%`,
                    transform: "translate(-50%, -50%)",
                    transition: "left 0.4s cubic-bezier(0.16, 1, 0.3, 1), top 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  className={`absolute z-10 flex flex-col items-center group cursor-pointer ${
                    esDestinoHover
                      ? compatibleConArrastrado
                        ? "scale-[1.20] z-30"
                        : "scale-105 opacity-80"
                      : ""
                  }`}
                  onClick={() => setJugadorSeleccionado(jugador)}
                  onDragOver={(e) => handleDragOverTitular(e, jugador)}
                  onDragLeave={handleDragLeaveTitular}
                  onDrop={(e) => handleDropTitular(e, jugador)}
                >
                  {/* circulo con dorsal y aro de demarcacion */}
                  <div
                    className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full border-2 flex flex-col items-center justify-center font-black transition-[transform,background-color,border-color,box-shadow] duration-200 shadow-xl ${
                      estaSeleccionado
                        ? "border-amber-400 bg-amber-400 text-black scale-[1.15] shadow-[0_0_22px_rgba(251,191,36,0.9)]"
                        : esDestinoHover && compatibleConArrastrado
                        ? "border-emerald-400 bg-emerald-500 text-white ring-4 ring-emerald-400/80"
                        : esDestinoHover && !compatibleConArrastrado
                        ? "border-rose-500 bg-rose-600 text-white ring-4 ring-rose-500/80 cursor-not-allowed"
                        : `bg-[#0a0b0d] text-white ${colorInfo.borde} hover:scale-105 hover:border-white`
                    }`}
                  >
                    <span className="text-sm font-black leading-none">{jugador.dorsal}</span>
                    <span className="text-[8px] font-bold uppercase tracking-wider opacity-80 leading-none mt-0.5">
                      {jugador.rol}
                    </span>
                  </div>

                  {/* etiqueta con nombre y calificacion */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-center leading-tight whitespace-nowrap transition-colors ${
                      estaSeleccionado
                        ? "bg-amber-400 text-black font-black shadow-md"
                        : "bg-black/90 text-neutral-200 border border-white/10 group-hover:border-white/40"
                    }`}
                  >
                    <span>{jugador.nombre}</span>
                    <span className="text-neutral-400 font-normal ml-1">({jugador.media || 80})</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* bandeja horizontal inferior de suplentes con aviso de error incorporado directamente aqui */}
          <div className="border border-white/10 bg-[#08090b] p-4 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-[0.2em] text-white">
                  Suplentes
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 bg-emerald-500/10 px-2 py-0.5 border border-emerald-500/20">
                  {suplentes.length} Disponibles
                </span>
              </div>
              <span className="text-[10px] text-neutral-400 uppercase tracking-wider">
                Arrastra a la cancha o haz clic para sustituir
              </span>
            </div>

            {/* aviso de error inmediato situado en la propia bandeja de suplentes para maxima visibilidad sin scroll */}
            {errorSuplentes && (
              <div className="border border-rose-500/60 bg-rose-950/40 text-rose-300 p-3 text-xs font-bold uppercase tracking-wider flex items-center justify-between animate-fade-in parpadeo-error">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0"></span>
                  <span>{errorSuplentes}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setErrorSuplentes("")}
                  className="text-neutral-400 hover:text-white text-base ml-3 cursor-pointer"
                >
                  ×
                </button>
              </div>
            )}

            {/* tarjetas horizontales de futbolistas suplentes */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {suplentes.map((suplente) => {
                const colorInfo = obtenerColorLinea(suplente.posicion);
                return (
                  <div
                    key={suplente.id}
                    draggable={true}
                    onDragStart={(e) => handleDragStartSuplente(e, suplente)}
                    onClick={() => handleClicSuplente(suplente)}
                    className="border border-white/10 bg-white/2 hover:bg-white/5 hover:border-white/30 p-2.5 transition-all cursor-grab active:cursor-grabbing flex flex-col justify-between group"
                    title={`Arrastra a ${suplente.nombre} hacia la cancha o haz clic si ya tienes un titular seleccionado`}
                  >
                    <div className="flex items-start justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-black text-white">#{suplente.dorsal}</span>
                        <span className={`text-[9px] font-bold uppercase px-1 py-0.5 border ${colorInfo.badge}`}>
                          {suplente.rol}
                        </span>
                      </div>
                      <span className="text-[10px] font-black text-neutral-400">
                        {suplente.media || 79}
                      </span>
                    </div>

                    <p className="text-[11px] font-bold text-white uppercase tracking-wider truncate mb-2">
                      {suplente.nombre}
                    </p>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClicSuplente(suplente);
                      }}
                      className="w-full text-[9px] font-bold uppercase tracking-wider py-1 border border-white/10 text-neutral-400 group-hover:border-white group-hover:text-black group-hover:bg-white transition-colors cursor-pointer text-center"
                    >
                      Sustituir
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* columna derecha (5 columnas): ficha del futbolista seleccionado y parametros tacticos */}
        <div className="lg:col-span-5 space-y-6">
          {/* ficha del futbolista seleccionado en cancha */}
          <section
            aria-labelledby="titulo-ficha-seleccionado"
            className="border border-white/10 bg-[#0a0a0a]/80 p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3
                id="titulo-ficha-seleccionado"
                className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                Futbolista en Pizarra
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                {jugadorSeleccionado ? "Ficha Activa" : "Sin Selección"}
              </span>
            </div>

            {jugadorSeleccionado ? (
              <div className="space-y-3 animate-fade-in">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-black text-white uppercase tracking-wider">
                      {jugadorSeleccionado.nombre}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Dorsal #{jugadorSeleccionado.dorsal} • {jugadorSeleccionado.posicion} ({jugadorSeleccionado.rol})
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white block leading-none">
                      {jugadorSeleccionado.media || 82}
                    </span>
                    <span className="text-[9px] font-bold uppercase text-neutral-500">
                      Media
                    </span>
                  </div>
                </div>

                <div className="p-3 bg-white/2 border border-white/5 space-y-1.5 text-xs">
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Demarcación táctica:</span>
                    <strong className="text-white">{jugadorSeleccionado.posicion}</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400 text-[11px]">
                    <span>Rol táctico asignado:</span>
                    <span className="text-white font-mono">{jugadorSeleccionado.rol}</span>
                  </div>
                </div>

                <p className="text-[11px] text-neutral-300 leading-relaxed border-l-2 border-neutral-700 pl-3">
                  Para sustituir a {jugadorSeleccionado.nombre}, haz clic en cualquiera de los suplentes de la misma demarcación en la bandeja inferior.
                </p>
              </div>
            ) : (
              <p className="text-neutral-500 text-xs italic py-3 leading-relaxed">
                Haz clic en cualquier futbolista en la cancha táctica para ver su ficha técnica detallada o realizar una sustitución.
              </p>
            )}
          </section>

          {/* parametros tacticos con barras de porcentaje interactivas */}
          <section
            aria-labelledby="titulo-parametros"
            className="border border-white/10 bg-[#0a0a0a]/80 p-5 space-y-5"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3
                id="titulo-parametros"
                className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                Parámetros Tácticos del Partido
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Ajuste Dinámico
              </span>
            </div>

            {/* 1. altura de bloque defensivo (mueve a los jugadores en el eje y a 60 fps) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-300">
                  Altura del Bloque Defensivo
                </span>
                <span className="font-black text-white bg-white/10 px-2 py-0.5 border border-white/15">
                  {alturaBloque}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={alturaBloque}
                onChange={(e) => setAlturaBloque(Number(e.target.value))}
                aria-label="Altura del Bloque Defensivo"
                className="w-full accent-white bg-neutral-800 h-1.5 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400">
                <span>0% Baja</span>
                <span className="text-white font-bold">{obtenerEtiquetaBloque(alturaBloque)}</span>
                <span>100% Alta</span>
              </div>
            </div>

            {/* 2. anchura del equipo (mueve a los laterales y extremos en el eje x a 60 fps) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-300">
                  Anchura del Equipo
                </span>
                <span className="font-black text-white bg-white/10 px-2 py-0.5 border border-white/15">
                  {anchuraEquipo}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={anchuraEquipo}
                onChange={(e) => setAnchuraEquipo(Number(e.target.value))}
                aria-label="Anchura del Equipo"
                className="w-full accent-white bg-neutral-800 h-1.5 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400">
                <span>0% Estrecho</span>
                <span className="text-white font-bold">{obtenerEtiquetaAnchura(anchuraEquipo)}</span>
                <span>100% Amplio</span>
              </div>
            </div>

            {/* 3. intensidad de presion */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-300">
                  Intensidad de Presión
                </span>
                <span className="font-black text-white bg-white/10 px-2 py-0.5 border border-white/15">
                  {intensidadPresion}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={intensidadPresion}
                onChange={(e) => setIntensidadPresion(Number(e.target.value))}
                aria-label="Intensidad de Presión"
                className="w-full accent-white bg-neutral-800 h-1.5 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400">
                <span>0% Conservadora</span>
                <span className="text-white font-bold">{obtenerEtiquetaPresion(intensidadPresion)}</span>
                <span>100% Asfixiante</span>
              </div>
            </div>

            {/* 4. ritmo y circulacion de balon */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-wider text-neutral-300">
                  Ritmo y Circulación
                </span>
                <span className="font-black text-white bg-white/10 px-2 py-0.5 border border-white/15">
                  {ritmoPosesion}%
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={ritmoPosesion}
                onChange={(e) => setRitmoPosesion(Number(e.target.value))}
                aria-label="Ritmo y Circulación"
                className="w-full accent-white bg-neutral-800 h-1.5 cursor-pointer"
              />
              <div className="flex items-center justify-between text-[10px] font-medium text-neutral-400">
                <span>0% Pausado</span>
                <span className="text-white font-bold">{obtenerEtiquetaRitmo(ritmoPosesion)}</span>
                <span>100% Directo</span>
              </div>
            </div>
          </section>

          {/* balance y resumen de la pizarra */}
          <section
            aria-labelledby="titulo-balance"
            className="border border-white/10 bg-[#0a0a0a]/80 p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3
                id="titulo-balance"
                className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-emerald-400 inline-block"></span>
                Balance del Once Titular
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400">
                11 Jugadores
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-3 bg-white/2 border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400 font-bold uppercase text-[10px]">Arquero</span>
                <span className="text-white font-black">1</span>
              </div>
              <div className="p-3 bg-white/2 border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400 font-bold uppercase text-[10px]">Defensas</span>
                <span className="text-white font-black">
                  {titulares.filter((t) => t.posicion === "Defensa").length}
                </span>
              </div>
              <div className="p-3 bg-white/2 border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400 font-bold uppercase text-[10px]">Mediocampistas</span>
                <span className="text-white font-black">
                  {titulares.filter((t) => t.posicion === "Mediocampo").length}
                </span>
              </div>
              <div className="p-3 bg-white/2 border border-white/5 flex justify-between items-center">
                <span className="text-neutral-400 font-bold uppercase text-[10px]">Delanteros</span>
                <span className="text-white font-black">
                  {titulares.filter((t) => t.posicion === "Delantero").length}
                </span>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* modal minimalista para crear nuevo esquema tactico montado en portal sobre todo el viewport */}
      {modalNuevoEsquema && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalNuevoEsquema(false);
          }}
        >
          <div className="border border-white/10 bg-[#0a0a0a] w-full max-w-md p-6 space-y-4 shadow-2xl relative my-auto animate-modal-pop">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Crear Nuevo Esquema Táctico
              </h3>
              <button
                type="button"
                onClick={() => setModalNuevoEsquema(false)}
                className="text-neutral-400 hover:text-white text-base leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleCrearNuevoEsquema} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-nuevo-nombre"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Nombre del Esquema
                </label>
                <input
                  id="input-nuevo-nombre"
                  type="text"
                  value={formNuevo.nombre}
                  onChange={(e) => setFormNuevo({ ...formNuevo, nombre: e.target.value })}
                  placeholder="Ej: 4-1-4-1 Asfixiante"
                  className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="input-nuevo-esquema-base"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Esquema Base de Referencia
                </label>
                <select
                  id="input-nuevo-esquema-base"
                  value={formNuevo.esquemaBaseId}
                  onChange={(e) => setFormNuevo({ ...formNuevo, esquemaBaseId: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-white/40"
                >
                  <option value="4-3-3">4-3-3 Ofensivo</option>
                  <option value="4-2-3-1">4-2-3-1 Control</option>
                  <option value="3-5-2">3-5-2 Bloque Alto</option>
                  <option value="4-4-2">4-4-2 Presión Clásica</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="input-nueva-desc"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Descripción o Filosofía de Juego
                </label>
                <textarea
                  id="input-nueva-desc"
                  rows={2}
                  value={formNuevo.descripcion}
                  onChange={(e) => setFormNuevo({ ...formNuevo, descripcion: e.target.value })}
                  placeholder="Ej: Bloque alto agresivo, desdoblamiento constante de laterales y búsqueda de segundas jugadas."
                  className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-white/40 resize-none"
                ></textarea>
              </div>

              {errorFormNuevo && (
                <p className="text-red-400 text-xs font-semibold parpadeo-error">
                  {errorFormNuevo}
                </p>
              )}

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalNuevoEsquema(false)}
                  className="px-4 py-2 border border-white/10 text-neutral-300 hover:text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-black text-xs uppercase hover:bg-neutral-200 cursor-pointer"
                >
                  Guardar Esquema
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* modal para editar nombre y descripcion del esquema activo montado en portal sobre todo el viewport */}
      {modalEditarEsquema && typeof document !== "undefined" && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) setModalEditarEsquema(false);
          }}
        >
          <div className="border border-white/10 bg-[#0a0a0a] w-full max-w-md p-6 space-y-4 shadow-2xl relative my-auto animate-modal-pop">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-sm font-black uppercase tracking-widest text-white">
                Editar Esquema Táctico
              </h3>
              <button
                type="button"
                onClick={() => setModalEditarEsquema(false)}
                className="text-neutral-400 hover:text-white text-base leading-none cursor-pointer"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleGuardarEdicion} className="space-y-4" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-editar-nombre"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Nombre del Esquema
                </label>
                <input
                  id="input-editar-nombre"
                  type="text"
                  value={formEditar.nombre}
                  onChange={(e) => setFormEditar({ ...formEditar, nombre: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-white/40"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="input-editar-desc"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Descripción
                </label>
                <textarea
                  id="input-editar-desc"
                  rows={3}
                  value={formEditar.descripcion}
                  onChange={(e) => setFormEditar({ ...formEditar, descripcion: e.target.value })}
                  className="w-full bg-[#050505] border border-white/10 p-3 text-xs text-white focus:outline-none focus:border-white/40 resize-none"
                ></textarea>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalEditarEsquema(false)}
                  className="px-4 py-2 border border-white/10 text-neutral-300 hover:text-white text-xs font-bold uppercase cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-white text-black font-black text-xs uppercase hover:bg-neutral-200 cursor-pointer"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default Formaciones;
