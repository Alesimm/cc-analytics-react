import { Outlet, NavLink, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  // funcion para cerrar sesion y volver al login
  const handleLogout = () => {
    navigate("/login");
  };

  // dato provisional del usuario, mas adelante se maneja con roles reales
  const usuario = { rol: "Entrenador" };

  return (
    <div className="min-h-screen bg-[#050505] bg-[url('/photos/bg-dashboard.webp')] bg-cover bg-center bg-no-repeat bg-fixed relative flex text-white font-sans selection:bg-white selection:text-black animate-fade-in">
      {/* capa oscura sobre el fondo para que el texto se lea sin problemas */}
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      {/* barra lateral mas transparente y un poco mas pequena para integrarse suave con el fondo */}
      <aside className="relative z-10 w-56 border-r border-white/10 flex flex-col bg-black/30 backdrop-blur-md">
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
        <nav className="flex-1 p-3 space-y-1.5">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest border-l-2 transition-all duration-300 ${
                isActive
                  ? "border-white bg-white/10 text-white"
                  : "border-transparent text-neutral-500 hover:border-white/40 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            Inicio
          </NavLink>
          {/* los demas enlaces a las otras pantallas se agregaran despues */}
        </nav>

        {/* boton para salir del sistema */}
        <div className="p-3 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-between border border-white/10 px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 active:scale-[0.98]"
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

      {/* logo institucional ubicado arriba a la derecha */}
      <div className="absolute top-8 right-8 z-20 flex items-center gap-4 select-none">
        <div className="text-right hidden sm:block">
          <p className="text-white font-black uppercase tracking-[0.2em] text-[18px] leading-none mb-1.5">
            Colo-Colo
          </p>
          <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[11px] leading-none">
            CC Analytics
          </p>
        </div>
        <img
          src="/photos/logo-colocolo.webp"
          alt="Escudo Colo-Colo"
          className="w-12 h-auto"
        />
      </div>

      {/* contenedor principal donde se cargan las distintas pantallas */}
      <main className="relative z-10 flex-1 min-w-0 p-8 pt-8 lg:p-12 lg:pt-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
