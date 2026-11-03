import { useState } from "react";
import {
  FORMACIONES_DISPONIBLES,
  obtenerConfiguracionTactica,
  guardarConfiguracionTactica,
} from "../data/formacionesData";

// estilos de borde y color segun la posicion del futbolista en cancha
const obtenerColorPosicion = (posicion) => {
  switch (posicion) {
    case "Arquero":
      return "border-amber-500/80 text-amber-300 bg-amber-500/10";
    case "Defensa":
      return "border-sky-500/80 text-sky-300 bg-sky-500/10";
    case "Mediocampo":
      return "border-emerald-500/80 text-emerald-300 bg-emerald-500/10";
    case "Delantero":
      return "border-rose-500/80 text-rose-300 bg-rose-500/10";
    default:
      return "border-white/40 text-white bg-white/10";
  }
};

const Formaciones = () => {
  // estado de la formacion activa seleccionada
  const [formacionActivaId, setFormacionActivaId] = useState("4-3-3");

  // inicializacion perezosa de titulares y suplentes evitando useeffect sincrono
  const [titulares, setTitulares] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") {
      return guardado.titulares;
    }
    return FORMACIONES_DISPONIBLES[0].titulares;
  });

  const [suplentes, setSuplentes] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") {
      return guardado.suplentes;
    }
    return FORMACIONES_DISPONIBLES[0].suplentes;
  });

  // parametros tacticos del esquema
  const [lineaDefensiva, setLineaDefensiva] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.lineaDefensiva;
    return FORMACIONES_DISPONIBLES[0].lineaDefensiva;
  });

  const [intensidadPresion, setIntensidadPresion] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.intensidadPresion;
    return FORMACIONES_DISPONIBLES[0].intensidadPresion;
  });

  const [estiloPosesion, setEstiloPosesion] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.estiloPosesion;
    return FORMACIONES_DISPONIBLES[0].estiloPosesion;
  });

  const [anchuraEquipo, setAnchuraEquipo] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.anchuraEquipo;
    return FORMACIONES_DISPONIBLES[0].anchuraEquipo;
  });

  // jugador seleccionado en la cancha para ver ficha o sustituir
  const [jugadorSeleccionado, setJugadorSeleccionado] = useState(null);

  // formulario de directriz tactica del encuentro
  const [directrizTexto, setDirectrizTexto] = useState(() => {
    const guardado = obtenerConfiguracionTactica();
    if (guardado && guardado.formacionId === "4-3-3") return guardado.directriz || "";
    return "";
  });
  const [errorDirectriz, setErrorDirectriz] = useState("");
  const [mensajeFeedback, setMensajeFeedback] = useState("");

  // esquema actual para metadata
  const esquemaActual =
    FORMACIONES_DISPONIBLES.find((f) => f.id === formacionActivaId) ||
    FORMACIONES_DISPONIBLES[0];

  // cambiar formacion activa y sincronizar estado en respuesta al evento del usuario
  const handleCambiarFormacion = (nuevaFormacionId) => {
    setFormacionActivaId(nuevaFormacionId);
    setJugadorSeleccionado(null);

    const guardado = obtenerConfiguracionTactica();
    const esquema =
      FORMACIONES_DISPONIBLES.find((f) => f.id === nuevaFormacionId) ||
      FORMACIONES_DISPONIBLES[0];

    if (guardado && guardado.formacionId === nuevaFormacionId) {
      setTitulares(guardado.titulares);
      setSuplentes(guardado.suplentes);
      setLineaDefensiva(guardado.lineaDefensiva);
      setIntensidadPresion(guardado.intensidadPresion);
      setEstiloPosesion(guardado.estiloPosesion);
      setAnchuraEquipo(guardado.anchuraEquipo);
      setDirectrizTexto(guardado.directriz || "");
    } else {
      setTitulares(esquema.titulares);
      setSuplentes(esquema.suplentes);
      setLineaDefensiva(esquema.lineaDefensiva);
      setIntensidadPresion(esquema.intensidadPresion);
      setEstiloPosesion(esquema.estiloPosesion);
      setAnchuraEquipo(esquema.anchuraEquipo);
    }
  };

  // realizar sustitucion directa entre un titular seleccionado y un suplente
  const handleSustitucion = (suplente) => {
    if (!jugadorSeleccionado) return;

    const titularActual = titulares.find((t) => t.id === jugadorSeleccionado.id);
    if (!titularActual) return;

    // nuevo titular hereda posicion x, y y rol del titular sustituido
    const nuevoTitular = {
      ...suplente,
      rol: titularActual.rol,
      x: titularActual.x,
      y: titularActual.y,
    };

    // nuevo suplente toma la identidad del titular saliente
    const nuevoSuplente = {
      id: titularActual.id,
      dorsal: titularActual.dorsal,
      nombre: titularActual.nombre,
      posicion: titularActual.posicion,
      rol: titularActual.posicion === "Arquero" ? "POR" : titularActual.posicion.slice(0, 3).toUpperCase(),
    };

    const nuevosTitulares = titulares.map((t) =>
      t.id === titularActual.id ? nuevoTitular : t
    );
    const nuevosSuplentes = suplentes.map((s) =>
      s.id === suplente.id ? nuevoSuplente : s
    );

    setTitulares(nuevosTitulares);
    setSuplentes(nuevosSuplentes);
    setJugadorSeleccionado(nuevoTitular);

    setMensajeFeedback(
      `Sustitución realizada: ingresó ${suplente.nombre} (#${suplente.dorsal}) por ${titularActual.nombre}.`
    );
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  // guardar directriz y configuracion completa en localstorage
  const handleGuardarConfiguracion = (e) => {
    e.preventDefault();

    if (!directrizTexto.trim()) {
      setErrorDirectriz("Debes ingresar una indicación táctica para el partido.");
      return;
    }
    if (directrizTexto.trim().length < 5) {
      setErrorDirectriz("La indicación táctica debe tener al menos 5 caracteres.");
      return;
    }

    setErrorDirectriz("");

    const configAGuardar = {
      formacionId: formacionActivaId,
      titulares,
      suplentes,
      lineaDefensiva,
      intensidadPresion,
      estiloPosesion,
      anchuraEquipo,
      directriz: directrizTexto.trim(),
      fecha: new Date().toLocaleDateString("es-CL"),
    };

    guardarConfiguracionTactica(configAGuardar);
    setMensajeFeedback("Configuración táctica y directriz guardadas en la pizarra.");
    setTimeout(() => setMensajeFeedback(""), 3500);
  };

  // restablecer formacion predeterminada
  const handleRestablecerEsquema = () => {
    const esquema = FORMACIONES_DISPONIBLES.find(
      (f) => f.id === formacionActivaId
    );
    if (!esquema) return;

    setTitulares(esquema.titulares);
    setSuplentes(esquema.suplentes);
    setLineaDefensiva(esquema.lineaDefensiva);
    setIntensidadPresion(esquema.intensidadPresion);
    setEstiloPosesion(esquema.estiloPosesion);
    setAnchuraEquipo(esquema.anchuraEquipo);
    setJugadorSeleccionado(null);
    setMensajeFeedback("Formación restablecida a los valores oficiales por defecto.");
    setTimeout(() => setMensajeFeedback(""), 3000);
  };

  return (
    <div className="space-y-8">
      {/* cabecera principal estandarizada */}
      <header className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="inline-block w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>
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

        {/* boton de restablecer valores de fabrica */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRestablecerEsquema}
            className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-white border border-white/10 hover:border-white/30 px-3.5 py-2.5 bg-white/2 transition-colors cursor-pointer"
            title="Restablecer alineacion a los 11 titulares oficiales"
          >
            Restablecer Alineación
          </button>
        </div>
      </header>

      {/* mensaje de feedback reactivo sin popups */}
      {mensajeFeedback && (
        <div className="border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 p-3.5 text-xs font-bold uppercase tracking-wider flex items-center justify-between animate-fade-in">
          <span>{mensajeFeedback}</span>
          <button
            type="button"
            onClick={() => setMensajeFeedback("")}
            className="text-neutral-400 hover:text-white text-sm leading-none ml-4"
          >
            ×
          </button>
        </div>
      )}

      {/* selector horizontal de esquemas tacticos */}
      <section aria-labelledby="titulo-esquemas" className="space-y-3">
        <div className="flex items-center justify-between border-b border-white/10 pb-2">
          <h2
            id="titulo-esquemas"
            className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
          >
            <span className="w-1.5 h-1.5 bg-white inline-block"></span>
            Esquemas Tácticos Disponibles
          </h2>
          <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
            Formación Activa: {esquemaActual.nombre}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {FORMACIONES_DISPONIBLES.map((formacion) => {
            const estaActiva = formacion.id === formacionActivaId;
            return (
              <button
                key={formacion.id}
                type="button"
                onClick={() => handleCambiarFormacion(formacion.id)}
                className={`p-3.5 border text-left transition-all cursor-pointer ${
                  estaActiva
                    ? "border-white bg-white/10 text-white shadow-[0_0_15px_rgba(255,255,255,0.05)]"
                    : "border-white/10 bg-[#0a0a0a]/80 text-neutral-400 hover:border-white/30 hover:text-white"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-black tracking-wider uppercase">
                    {formacion.id}
                  </span>
                  {estaActiva && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(16,185,129,0.9)]"></span>
                  )}
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 truncate">
                  {formacion.nombre.split(" ")[1] || "Oficial"}
                </p>
              </button>
            );
          })}
        </div>

        <p className="text-[11px] text-neutral-400 font-medium italic border-l-2 border-neutral-700 pl-3 py-1">
          {esquemaActual.descripcion}
        </p>
      </section>

      {/* cuerpo principal de la pizarra: cancha a la izquierda y controles a la derecha */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* columna izquierda: cancha tactica */}
        <section
          aria-labelledby="titulo-cancha"
          className="lg:col-span-7 border border-white/10 bg-[#070e0a]/90 backdrop-blur-sm p-4 sm:p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
            <h3
              id="titulo-cancha"
              className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-emerald-400 inline-block"></span>
              Pizarra de Juego // {formacionActivaId}
            </h3>
            <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">
              11 Titulares en Cancha
            </span>
          </div>

          {/* representacion grafica del campo de futbol */}
          <div
            className="relative w-full aspect-[3/4] max-h-[580px] bg-gradient-to-b from-[#0a180f] via-[#09150d] to-[#061009] border-2 border-emerald-500/30 overflow-hidden shadow-inner select-none"
            aria-label="Cancha táctica con posiciones de jugadores"
          >
            {/* lineas de la cancha en svg de fondo */}
            <svg
              className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-white"
              fill="none"
              strokeWidth="1.5"
              viewBox="0 0 300 400"
              preserveAspectRatio="none"
            >
              {/* linea perimetral */}
              <rect x="8" y="8" width="284" height="384" />
              {/* linea de medio campo */}
              <line x1="8" y1="200" x2="292" y2="200" />
              {/* circulo central */}
              <circle cx="150" cy="200" r="42" />
              <circle cx="150" cy="200" r="2.5" fill="white" />
              {/* area penal superior (rival) */}
              <rect x="75" y="8" width="150" height="65" />
              <rect x="105" y="8" width="90" height="26" />
              <path d="M 120 73 A 30 30 0 0 0 180 73" />
              {/* area penal inferior (colo-colo) */}
              <rect x="75" y="327" width="150" height="65" />
              <rect x="105" y="366" width="90" height="26" />
              <path d="M 120 327 A 30 30 0 0 1 180 327" />
              {/* arcos */}
              <rect x="120" y="3" width="60" height="5" strokeDasharray="2,2" />
              <rect x="120" y="392" width="60" height="5" strokeDasharray="2,2" />
            </svg>

            {/* fichas de los 11 futbolistas ubicados segun coordenadas x, y */}
            {titulares.map((jugador) => {
              const estaSeleccionado = jugadorSeleccionado?.id === jugador.id;
              const colorClases = obtenerColorPosicion(jugador.posicion);

              return (
                <div
                  key={jugador.id}
                  style={{
                    left: `${jugador.x}%`,
                    top: `${jugador.y}%`,
                    transform: "translate(-50%, -50%)",
                  }}
                  className="absolute z-10 flex flex-col items-center group cursor-pointer"
                  onClick={() => setJugadorSeleccionado(jugador)}
                >
                  {/* circulo con dorsal del jugador */}
                  <div
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 flex items-center justify-center font-black text-xs sm:text-sm tracking-wider transition-all duration-300 ${
                      estaSeleccionado
                        ? "border-white bg-white text-black scale-115 shadow-[0_0_16px_rgba(255,255,255,0.7)]"
                        : `${colorClases} hover:scale-105 hover:border-white`
                    }`}
                  >
                    {jugador.dorsal}
                  </div>

                  {/* etiqueta con nombre y rol posicional */}
                  <div
                    className={`mt-1 px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-bold tracking-wider uppercase text-center leading-tight whitespace-nowrap transition-colors ${
                      estaSeleccionado
                        ? "bg-white text-black shadow-md"
                        : "bg-black/80 text-neutral-200 border border-white/10 group-hover:border-white/30"
                    }`}
                  >
                    <span>{jugador.nombre}</span>
                    <span className="text-neutral-400 font-normal ml-1">({jugador.rol})</span>
                  </div>
                </div>
              );
            })}
          </div>

          <p className="text-[10px] text-neutral-400 uppercase tracking-widest text-center mt-3 font-semibold">
            Haz clic en un titular para ver su detalle o sustituirlo con un suplente del banco.
          </p>
        </section>

        {/* columna derecha: detalle del jugador seleccionado, banco y parametros */}
        <div className="lg:col-span-5 space-y-6">
          {/* ficha del futbolista seleccionado o indicacion */}
          <section
            aria-labelledby="titulo-ficha-seleccionado"
            className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-3"
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
                    <p className="text-lg font-black text-white uppercase tracking-wider">
                      {jugadorSeleccionado.nombre}
                    </p>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                      Dorsal #{jugadorSeleccionado.dorsal} • {jugadorSeleccionado.posicion} ({jugadorSeleccionado.rol})
                    </p>
                  </div>
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2.5 py-1 border ${obtenerColorPosicion(
                      jugadorSeleccionado.posicion
                    )}`}
                  >
                    {jugadorSeleccionado.posicion}
                  </span>
                </div>

                <p className="text-[11px] text-neutral-300 leading-relaxed border-l-2 border-neutral-700 pl-3">
                  Para sustituir a {jugadorSeleccionado.nombre}, haz clic en cualquiera de los suplentes listados abajo.
                </p>
              </div>
            ) : (
              <p className="text-neutral-500 text-xs italic py-2">
                Selecciona cualquier titular en la cancha táctica para gestionar sus instrucciones o sustituirlo con la banca.
              </p>
            )}
          </section>

          {/* banco de suplentes con accion de sustitucion */}
          <section
            aria-labelledby="titulo-banco"
            className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3
                id="titulo-banco"
                className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                Banco de Suplentes
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                {suplentes.length} Disponibles
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {suplentes.map((suplente) => (
                <div
                  key={suplente.id}
                  className="border border-white/10 bg-white/2 p-3 flex items-center justify-between group hover:border-white/30 transition-colors"
                >
                  <div className="min-w-0 mr-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white">#{suplente.dorsal}</span>
                      <span className="text-xs font-bold text-neutral-200 truncate">{suplente.nombre}</span>
                    </div>
                    <span className="text-[10px] text-neutral-500 uppercase font-medium">
                      {suplente.posicion}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSustitucion(suplente)}
                    disabled={!jugadorSeleccionado}
                    className="shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-1 border transition-all cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed border-white/20 text-neutral-300 hover:border-white hover:bg-white hover:text-black"
                    title={
                      jugadorSeleccionado
                        ? `Sustituir a ${jugadorSeleccionado.nombre} por ${suplente.nombre}`
                        : "Selecciona primero un titular en cancha"
                    }
                  >
                    Sustituir
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* parametros tacticos de juego (controles sencillos descritos en el mockup) */}
          <section
            aria-labelledby="titulo-parametros"
            className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-4"
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
                Estrategia
              </span>
            </div>

            {/* altura de linea defensiva */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Altura del Bloque Defensivo
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Baja", "Media", "Alta"].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setLineaDefensiva(opcion)}
                    className={`py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer text-center ${
                      lineaDefensiva === opcion
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            {/* intensidad de presion */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Intensidad de Presión
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Conservadora", "Equilibrada", "Intensa"].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setIntensidadPresion(opcion)}
                    className={`py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer text-center ${
                      intensidadPresion === opcion
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            {/* estilo de posesion */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Estilo de Posesión
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Posicional", "Equilibrado", "Vertical"].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setEstiloPosesion(opcion)}
                    className={`py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer text-center ${
                      estiloPosesion === opcion
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>

            {/* anchura del equipo */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 block">
                Anchura del Equipo
              </span>
              <div className="grid grid-cols-3 gap-2">
                {["Estrecho", "Estándar", "Amplio"].map((opcion) => (
                  <button
                    key={opcion}
                    type="button"
                    onClick={() => setAnchuraEquipo(opcion)}
                    className={`py-1.5 px-2 text-[10px] font-bold uppercase tracking-wider border transition-colors cursor-pointer text-center ${
                      anchuraEquipo === opcion
                        ? "border-white bg-white text-black"
                        : "border-white/10 text-neutral-400 hover:border-white/30 hover:text-white"
                    }`}
                  >
                    {opcion}
                  </button>
                ))}
              </div>
            </div>
          </section>

          {/* formulario de directriz tactica del cuerpo tecnico */}
          <section
            aria-labelledby="titulo-directriz"
            className="border border-white/10 bg-[#0a0a0a]/80 backdrop-blur-sm p-5 space-y-3"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <h3
                id="titulo-directriz"
                className="text-xs font-black uppercase tracking-[0.2em] text-white flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-white inline-block"></span>
                Directriz Táctica del Partido
              </h3>
              <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500">
                Anotación
              </span>
            </div>

            <form onSubmit={handleGuardarConfiguracion} className="space-y-3" noValidate>
              <div className="space-y-1.5">
                <label
                  htmlFor="input-directriz"
                  className="block text-[10px] font-bold uppercase tracking-widest text-neutral-400"
                >
                  Instrucción Estratégica
                </label>
                <textarea
                  id="input-directriz"
                  rows={3}
                  value={directrizTexto}
                  onChange={(e) => {
                    setDirectrizTexto(e.target.value);
                    if (errorDirectriz) setErrorDirectriz("");
                  }}
                  placeholder="Ej: Presión alta al iniciador rival, transiciones veloces con extremos y repliegue ordenado en bloque medio..."
                  className={`w-full bg-[#050505] border p-3 text-xs text-white placeholder-neutral-600 focus:outline-none transition-colors resize-none ${
                    errorDirectriz
                      ? "border-red-500 focus:border-red-500"
                      : "border-white/10 focus:border-white/40"
                  }`}
                ></textarea>

                {errorDirectriz && (
                  <p className="text-red-400 text-xs font-medium parpadeo-error">
                    {errorDirectriz}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-xs py-3 px-4 hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Guardar Configuración Táctica
              </button>
            </form>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Formaciones;
