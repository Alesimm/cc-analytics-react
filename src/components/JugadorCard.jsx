import { useState } from "react";

// insignia sobria y monocromatica para la posicion tactica (sin ruido de color innecesario)
const estiloPosicion = () => {
  return "border-white/15 text-neutral-300 bg-white/[0.03]";
};

// indicador de disponibilidad medica y deportiva
const estiloEstado = (estado) => {
  switch (estado) {
    case "Disponible":
      return "text-emerald-400 border-emerald-500/30 bg-emerald-500/10";
    case "En recuperación":
      return "text-amber-400 border-amber-500/30 bg-amber-500/10";
    case "Suspendido":
      return "text-red-400 border-red-500/30 bg-red-500/10";
    default:
      return "text-neutral-400 border-neutral-500/30 bg-neutral-500/10";
  }
};

const JugadorCard = ({ jugador, onEditar, onEliminar }) => {
  // estado local para confirmacion inline de eliminacion (sin confirm() ni alert())
  const [confirmando, setConfirmando] = useState(false);

  return (
    <article className="border border-white/10 bg-[#0a0a0a]/80 p-5 hover:border-white/30 transition-all duration-300 flex flex-col justify-between group">
      <div>
        {/* cabecera de la ficha: dorsal y badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono font-extrabold text-lg sm:text-xl text-white tracking-tight border border-white/15 bg-white/[0.04] px-2.5 py-1.5 min-w-[50px] text-center flex items-center justify-center">
              #{jugador.dorsal}
            </span>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-white leading-tight">
                {jugador.nombre}
              </h3>
              <span
                className={`inline-block mt-1 text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border ${estiloPosicion(
                  jugador.posicion
                )}`}
              >
                {jugador.posicion}
              </span>
            </div>
          </div>

          <span
            className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 border shrink-0 ${estiloEstado(
              jugador.estado
            )}`}
          >
            {jugador.estado}
          </span>
        </div>

        {/* datos tecnicos del futbolista */}
        <div className="grid grid-cols-2 gap-2 py-3 border-y border-white/5 text-[11px]">
          <div>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] block">
              Edad
            </span>
            <span className="font-bold text-neutral-200">
              {jugador.edad} años
            </span>
          </div>
          <div>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] block">
              Estatura
            </span>
            <span className="font-bold text-neutral-200">
              {jugador.altura || "—"}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] block">
              Pie Hábil
            </span>
            <span className="font-bold text-neutral-200">
              {jugador.pie || "Derecho"}
            </span>
          </div>
          <div>
            <span className="text-neutral-500 uppercase tracking-widest text-[9px] block">
              Rol de Plantel
            </span>
            <span className="font-bold text-neutral-200">
              {jugador.rol || "Titular"}
            </span>
          </div>
        </div>
      </div>

      {/* zona de acciones y confirmacion inline */}
      <div className="mt-4 pt-3 border-t border-white/5">
        {confirmando ? (
          <div className="bg-red-500/10 border border-red-500/30 p-2.5 space-y-2 animate-fade-in">
            <p className="text-[10px] uppercase font-bold tracking-wider text-red-400">
              ¿Confirmar baja de {jugador.nombre}?
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEliminar(jugador.id)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold uppercase tracking-wider py-1.5 transition-colors cursor-pointer"
              >
                Sí, Dar de Baja
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(false)}
                className="flex-1 bg-white/5 hover:bg-white/10 text-neutral-300 text-[10px] font-bold uppercase tracking-wider py-1.5 border border-white/10 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2">
            <span className="text-[10px] uppercase tracking-widest text-neutral-600 font-mono">
              ID: {jugador.id}
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEditar(jugador)}
                className="text-[10px] uppercase font-bold tracking-wider text-neutral-300 hover:text-white px-2.5 py-1 border border-white/10 hover:border-white/30 bg-white/2 transition-colors cursor-pointer"
              >
                Editar
              </button>
              <button
                type="button"
                onClick={() => setConfirmando(true)}
                className="text-[10px] uppercase font-bold tracking-wider text-neutral-400 hover:text-red-400 px-2.5 py-1 border border-white/10 hover:border-red-500/40 bg-white/2 transition-colors cursor-pointer"
              >
                Eliminar
              </button>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};

export default JugadorCard;
