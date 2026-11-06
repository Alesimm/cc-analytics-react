import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";

const ENLACES_MENU = [
  { to: "/dashboard", label: "Inicio" },
  { to: "/plantel", label: "Plantel" },
  { to: "/rendimiento", label: "Rendimiento" },
  { to: "/formaciones", label: "Formaciones" },
  { to: "/calendario", label: "Calendario" },
  { to: "/medico", label: "Centro Médico" },
  { to: "/soporte", label: "Soporte Técnico" },
];

const Layout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const mainRef = useRef(null);
  const menuUsuarioRef = useRef(null);

  // estado para desplegar el menu de usuario hacia abajo al presionar el circulo/avatar
  const [menuUsuarioAbierto, setMenuUsuarioAbierto] = useState(false);

  // funcion para cerrar sesion y volver al login
  const handleLogout = () => {
    setMenuUsuarioAbierto(false);
    navigate("/login");
  };

  // reinicia la posicion de scroll arriba al navegar a una nueva seccion
  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTop = 0;
    }
  }, [location.pathname]);

  // cerrar el menu desplegable al hacer clic fuera o presionar Escape
  useEffect(() => {
    if (!menuUsuarioAbierto) return;

    const handleClickOutside = (e) => {
      if (menuUsuarioRef.current && !menuUsuarioRef.current.contains(e.target)) {
        setMenuUsuarioAbierto(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setMenuUsuarioAbierto(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuUsuarioAbierto]);

  // dato del usuario autenticado
  const usuario = {
    rol: "Admin",
    correo: "admin@colocolo.cl",
    area: "Dirección Deportiva Integral",
  };

  return (
    <div className="h-screen overflow-hidden bg-[#050505] relative flex flex-col text-white font-sans selection:bg-white selection:text-black">
      {/* barra superior (topbar) minimalista de alto contraste */}
      <header className="relative z-40 h-16 border-b border-white/10 bg-[#070707]/95 backdrop-blur-md px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 shrink-0">
        {/* marca e items de navegacion */}
        <div className="flex items-center gap-6 lg:gap-8 min-w-0 flex-1">
          <NavLink
            to="/dashboard"
            className="flex items-center gap-2.5 shrink-0 group"
          >
            <img
              src="/photos/logo-colocolo.webp"
              alt="Colo-Colo"
              className="w-6 h-6 object-contain opacity-95 group-hover:opacity-100 transition-opacity"
            />
            <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-white whitespace-nowrap">
              CC Analytics
            </span>
          </NavLink>

          <div className="h-4 w-px bg-white/10 hidden md:block shrink-0" />

          {/* navegacion horizontal adaptable */}
          <nav
            aria-label="Navegación principal"
            className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-1"
          >
            {ENLACES_MENU.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.08em] whitespace-nowrap border transition-all duration-150 ${
                    isActive
                      ? "border-white/25 bg-white/10 text-white"
                      : "border-transparent text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>

        {/* seccion derecha: circulo de usuario interactivo con desplegable hacia abajo */}
        <div className="relative shrink-0" ref={menuUsuarioRef}>
          <button
            type="button"
            onClick={() => setMenuUsuarioAbierto((prev) => !prev)}
            aria-expanded={menuUsuarioAbierto}
            aria-haspopup="true"
            aria-label="Menú de sesión de usuario"
            className={`flex items-center gap-3 py-1.5 px-2.5 border transition-all duration-200 cursor-pointer ${
              menuUsuarioAbierto
                ? "border-white/30 bg-white/10"
                : "border-transparent hover:border-white/15 hover:bg-white/[0.04]"
            }`}
          >
            {/* circulo del usuario */}
            <div className="w-8 h-8 rounded-full border border-white/20 bg-white/[0.06] flex items-center justify-center shrink-0">
              <svg
                viewBox="0 0 24 24"
                className="w-4 h-4 text-white"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
              </svg>
            </div>

            <div className="text-left hidden sm:block">
              <p className="text-[9px] text-neutral-400 font-semibold uppercase tracking-[0.14em] leading-none mb-1">
                Sesión activa
              </p>
              <p className="text-white font-bold text-xs leading-none">
                {usuario.rol}
              </p>
            </div>

            <svg
              viewBox="0 0 24 24"
              className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 ${
                menuUsuarioAbierto ? "rotate-180 text-white" : ""
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* componente desplegable hacia abajo con informacion de cuenta y boton de cerrar sesion */}
          {menuUsuarioAbierto && (
            <div
              role="menu"
              className="absolute right-0 top-full mt-2 w-64 bg-[#0a0a0a] border border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.85)] p-4 space-y-3.5 animate-modal-pop z-50"
            >
              <div className="flex items-center gap-3 pb-3 border-b border-white/10">
                <div className="w-10 h-10 rounded-full border border-white/25 bg-white/10 flex items-center justify-center shrink-0">
                  <svg
                    viewBox="0 0 24 24"
                    className="w-5 h-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                    <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-emerald-400">
                      Conectado
                    </span>
                  </div>
                  <p className="text-sm font-bold text-white truncate mt-0.5">
                    {usuario.rol}
                  </p>
                  <p className="text-[11px] text-neutral-400 truncate">
                    {usuario.correo}
                  </p>
                </div>
              </div>

              <div className="space-y-1 text-[11px]">
                <div className="flex items-center justify-between text-neutral-400 py-1">
                  <span>Departamento</span>
                  <span className="text-neutral-200 font-semibold">Cuerpo Técnico</span>
                </div>
                <div className="flex items-center justify-between text-neutral-400 py-1">
                  <span>Temporada</span>
                  <span className="text-neutral-200 font-mono font-semibold">2026</span>
                </div>
              </div>

              <div className="pt-2 border-t border-white/10">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center justify-between border border-white/15 bg-white/[0.03] hover:bg-red-600 hover:border-red-600 text-neutral-200 hover:text-white px-3.5 py-2.5 text-[11px] font-bold uppercase tracking-[0.12em] transition-colors duration-200 cursor-pointer"
                >
                  <span>Cerrar Sesión</span>
                  <svg
                    viewBox="0 0 24 24"
                    className="w-4 h-4"
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
            </div>
          )}
        </div>
      </header>

      {/* contenedor principal a ancho completo aprovechando el espacio central */}
      <main
        ref={mainRef}
        className="relative z-10 flex-1 min-w-0 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
      >
        <div
          key={location.pathname}
          className="max-w-[1440px] mx-auto w-full animate-page-enter"
        >
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
