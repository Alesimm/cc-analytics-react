import { useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);

  // funcion para cerrar sesion y volver al login
  const handleLogout = () => {
    navigate("/login");
  };

  // reinicia el scroll arriba al cambiar de seccion en la barra lateral
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // dato provisional del usuario, mas adelante se maneja con roles reales
  const usuario = { rol: "Entrenador" };

  return (
    <div className="h-screen overflow-hidden bg-[#050608] relative flex text-white font-sans selection:bg-white selection:text-black">
      {/* fondo tecnico de alto contraste con degradado y cuadricula tactica sutil */}
      <div className="fixed inset-0 bg-gradient-to-b from-[#090b10] via-[#050608] to-[#020304] pointer-events-none -z-20"></div>
      <div
        className="fixed inset-0 pointer-events-none -z-10 opacity-70"
        style={{
          backgroundImage: `
            radial-gradient(1200px circle at 50% -10%, rgba(255, 255, 255, 0.04), transparent 70%),
            linear-gradient(to right, rgba(255, 255, 255, 0.015) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.015) 1px, transparent 1px)
          `,
          backgroundSize: "100% 100%, 48px 48px, 48px 48px",
        }}
      ></div>

      {/* barra lateral fija ajustada al tamano de la pantalla */}
      <aside className="relative z-10 w-56 h-screen border-r border-white/10 flex flex-col justify-between bg-black/40 backdrop-blur-md shrink-0">
        <div>
          {/* seccion con la sesion activa del usuario */}
          <div className="h-20 border-b border-white/5 flex items-center gap-3 px-4">
            <div className="w-10 h-10 shrink-0 border border-white/10 bg-white/5 flex items-center justify-center">
              <svg
                viewBox="0 0 24 24"
                className="w-5 h-5 text-neutral-300"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.25em] mb-1">
                Sesión activa
              </p>
              <p className="text-white font-black uppercase tracking-[0.15em] text-xs leading-none truncate">
                {usuario.rol}
              </p>
            </div>
          </div>

          {/* menu de navegacion principal */}
          <nav className="p-3 space-y-1.5">
            <NavLink
              to="/dashboard"
              className={({ isActive }) =>
                `block px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest border-l-2 transition-colors duration-150 ${
                  isActive
                    ? "border-white bg-white/10 text-white"
                    : "border-transparent text-neutral-500 hover:border-white/40 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              Inicio
            </NavLink>
            <NavLink
              to="/plantel"
              className={({ isActive }) =>
                `block px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest border-l-2 transition-colors duration-150 ${
                  isActive
                    ? "border-white bg-white/10 text-white"
                    : "border-transparent text-neutral-500 hover:border-white/40 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              Plantel
            </NavLink>
            <NavLink
              to="/rendimiento"
              className={({ isActive }) =>
                `block px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest border-l-2 transition-colors duration-150 ${
                  isActive
                    ? "border-white bg-white/10 text-white"
                    : "border-transparent text-neutral-500 hover:border-white/40 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              Rendimiento
            </NavLink>
            {/* los demas enlaces a las otras pantallas se agregaran despues */}
          </nav>
        </div>

        {/* boton para salir del sistema siempre visible y accesible al pie de la barra lateral */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-between border border-white/10 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 active:scale-[0.98] cursor-pointer"
          >
            <span>Cerrar Sesión</span>
            <svg
              viewBox="0 0 24 24"
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
            </svg>
          </button>
        </div>
      </aside>

      {/* contenedor principal con scroll vertical suave y restablecimiento de posicion */}
      <main
        ref={mainRef}
        className="relative z-10 flex-1 min-w-0 h-screen overflow-y-auto scroll-smooth p-6 sm:p-8 lg:p-12"
      >
        <div key={location.pathname}>
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
