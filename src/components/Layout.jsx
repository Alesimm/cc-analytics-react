import { Outlet, NavLink, useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // mas adelante aqui se limpia la sesion del usuario
    navigate("/login");
  };

  // dato temporal, el manejo de usuarios se hace despues (entrenador, medico o analista)
  const usuario = { rol: "Entrenador" };

  return (
    <div className="min-h-screen bg-[#050505] bg-[url('/pantalla_2_dashboard.png')] bg-cover bg-center bg-no-repeat bg-fixed relative flex text-white font-sans selection:bg-white selection:text-black animate-fade-in">
      {/* capa oscura sobre el fondo para que se lea bien la informacion */}
      <div className="absolute inset-0 bg-black/90 z-0"></div>

      {/* barra lateral casi transparente, deja ver el fondo */}
      <aside className="relative z-10 w-64 border-r border-white/5 flex flex-col bg-white/2 backdrop-blur-sm">
        {/* usuario conectado */}
        <div className="h-24 border-b border-white/5 flex items-center gap-4 px-6">
          <div className="w-12 h-12 shrink-0 border border-white/10 bg-white/4 flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              className="w-6 h-6 text-neutral-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
            </svg>
          </div>
          <div>
            <p className="text-[9px] text-neutral-500 font-bold uppercase tracking-[0.3em] mb-1.5">
              Sesión activa
            </p>
            <p className="text-white font-black uppercase tracking-[0.15em] text-sm leading-none">
              {usuario.rol}
            </p>
          </div>
        </div>

        {/* menu de navegacion */}
        <nav className="flex-1 p-6 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `block px-4 py-3 text-[11px] font-bold uppercase tracking-widest border-l-2 transition-all duration-300 ${
                isActive
                  ? "border-white bg-white/10 text-white"
                  : "border-transparent text-neutral-500 hover:border-white/40 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            Inicio
          </NavLink>
          {/* los demas enlaces se agregan despues */}
        </nav>

        {/* cerrar sesion */}
        <div className="p-6 border-t border-white/5">
          <button
            onClick={handleLogout}
            className="group w-full flex items-center justify-between border border-white/10 px-4 py-3 text-[11px] font-bold uppercase tracking-widest text-neutral-400 hover:bg-red-600 hover:border-red-600 hover:text-white transition-all duration-300 active:scale-[0.98]"
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

      {/* logo arriba a la derecha, igual que en el login */}
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
          src="/logo-colocolo.png"
          alt="Escudo Colo-Colo"
          className="w-12 h-auto"
        />
      </div>

      {/* aqui se muestra cada pantalla, el titulo queda pegado arriba */}
      <main className="relative z-10 flex-1 min-w-0 p-8 pt-8 lg:p-12 lg:pt-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
