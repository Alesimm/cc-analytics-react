import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { obtenerPerfil } from "../services/api";
import { obtenerToken, obtenerUsuario, guardarUsuario, cerrarSesion } from "../data/authData";

// guardia de las pantallas privadas: si no hay sesion valida manda al login.
// al recargar con f5 pregunta al backend (/me) si el token sigue vigente antes de mostrar la pantalla.
// si recibe rolesPermitidos y el rol del usuario no esta incluido, redirige a /dashboard.
const RutaPrivada = ({ rolesPermitidos = null }) => {
  const tieneToken = Boolean(obtenerToken());
  const [estado, setEstado] = useState(tieneToken ? "verificando" : "rechazada");
  const [rolUsuario, setRolUsuario] = useState(() => obtenerUsuario()?.rol || null);

  useEffect(() => {
    if (!tieneToken) return;

    let activo = true;
    obtenerPerfil()
      .then(({ token, usuario }) => {
        if (!activo) return;
        guardarUsuario(usuario, token);
        setRolUsuario(usuario?.rol || null);
        setEstado("valida");
      })
      .catch((error) => {
        if (!activo) return;
        // si el token no sirve (401) se borra la sesion guardada
        if (error.status === 401) cerrarSesion();
        setEstado("rechazada");
      });

    return () => {
      activo = false;
    };
  }, [tieneToken]);

  if (estado === "rechazada") return <Navigate to="/login" replace />;

  if (estado === "verificando") {
    return (
      <div className="h-screen bg-[#050505] flex flex-col items-center justify-center text-white select-none">
        <div className="w-7 h-7 rounded-full border-2 border-white/10 border-t-white animate-spin mb-3" />
        <span className="text-[10px] uppercase font-mono tracking-[0.25em] text-neutral-400">
          CC Analytics // Verificando sesión
        </span>
      </div>
    );
  }

  if (Array.isArray(rolesPermitidos) && rolUsuario && !rolesPermitidos.includes(rolUsuario)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

export default RutaPrivada;
