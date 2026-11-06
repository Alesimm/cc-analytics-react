import { useState } from "react";
import { useNavigate } from "react-router-dom";

// funcion para cambiar el color del borde si hay error
const claseInput = (error) =>
  `w-full bg-[#0a0a0a]/80 border p-4 text-white text-sm antialiased focus:outline-none transition-all duration-300 ${
    error
      ? "border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]"
      : "border-white/10 focus:border-white/30"
  }`;

const Login = () => {
  const navigate = useNavigate();

  // estados para guardar lo que escribe el usuario
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // estado para indicar proceso y mensaje de autenticacion
  const [cargando, setCargando] = useState(false);
  const [mensajeCarga, setMensajeCarga] = useState("Verificando credenciales...");

  // estado para guardar mensajes de error
  const [errors, setErrors] = useState({ email: "", password: "" });

  const handleLogin = (e) => {
    e.preventDefault();

    let newErrors = { email: "", password: "" };
    let isValid = true;

    const dominiosPermitidos = [
      "@duoc.cl",
      "@profesor.duoc.cl",
      "@gmail.com",
      "@colocolo.cl",
    ];
    const emailValido = dominiosPermitidos.some((dominio) =>
      email.trim().toLowerCase().endsWith(dominio)
    );

    if (!emailValido) {
      newErrors.email =
        "El correo debe terminar en @colocolo.cl o @gmail.com";
      isValid = false;
    }

    if (password.length < 4 || password.length > 10) {
      newErrors.password = "La contraseña debe tener entre 4 y 10 caracteres.";
      isValid = false;
    }
    // guarda los errores para que se muestren en pantalla
    setErrors(newErrors);

    if (isValid) {
      setCargando(true);
      setMensajeCarga("Verificando credenciales...");

      // en entorno de test navegamos de inmediato para no demorar la prueba unitaria
      if (import.meta.env?.MODE === "test") {
        navigate("/dashboard");
        return;
      }

      // transicion deliberada en tres fases para una experiencia analitica inmersiva y profesional
      setTimeout(() => {
        setMensajeCarga("Sincronizando métricas del plantel...");
      }, 650);

      setTimeout(() => {
        setMensajeCarga("Accediendo a la plataforma...");
      }, 1300);

      setTimeout(() => {
        navigate("/dashboard");
      }, 1850);
    }
  };

  return (
    // pantalla principal con imagen tactica de fondo
    <div className="min-h-screen overflow-hidden flex flex-col lg:flex-row bg-[#050505] bg-[url('/photos/bg-tactica.webp')] bg-cover bg-center bg-no-repeat relative">
      {/* filtro oscuro para el fondo */}
      <div className="absolute inset-0 bg-black/75 z-0"></div>

      {/* lado izquierdo con informacion y bienvenida con animacion deliberada */}
      <div className="relative z-10 hidden lg:flex flex-col justify-center w-full lg:w-1/2 p-12 lg:p-24 animate-login-enter">
        {/* logo cc analytics */}
        <div className="max-w-2xl lg:-mt-24">
          <img
            src="/photos/logo-escudo-blanco.webp"
            alt="Cacique Logo"
            className="w-32 h-auto mb-8 drop-shadow-2xl"
          />

          <h1 className="text-5xl lg:text-6xl font-black text-white uppercase tracking-widest leading-tight mb-4">
            CC Analytics
          </h1>
          <h2 className="text-xl text-neutral-400 font-bold uppercase tracking-[0.3em] mb-12">
            Inteligencia Deportiva
          </h2>

          <div className="space-y-6 text-neutral-300 text-[15px] leading-relaxed antialiased max-w-md border-l-2 border-neutral-700 pl-6">
            <p>
              <strong className="text-white">Plataforma Centralizada.</strong>{" "}
              Unificación de métricas de rendimiento físico, análisis táctico
              automatizado y control médico integral del plantel profesional.
            </p>
            <p>
              Diseñado para acelerar la toma de decisiones estratégicas del
              cuerpo técnico a través de datos precisos en tiempo real.
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-12 lg:left-24 text-neutral-600 text-[10px] uppercase tracking-widest font-bold">
          © 2026 Club Social y Deportivo Colo-Colo
        </div>
      </div>

      {/* lado derecho con formulario protegido con vidrio borroso */}
      <div className="relative z-10 w-full lg:w-[42%] lg:ml-auto flex items-center justify-center p-6 sm:p-8 bg-[linear-gradient(90deg,rgba(10,10,10,0.18)_0%,rgba(10,10,10,0.4)_35%,rgba(10,10,10,0.7)_100%)] border-l border-white/5 shadow-[-20px_0_40px_rgba(0,0,0,0.28)] animate-login-enter delay-200 overflow-hidden">

        {/* logo arriba a la derecha */}
        <div className="absolute top-8 right-8 flex items-center gap-4 select-none animate-login-enter delay-400">
          <div className="text-right hidden sm:block">
            <p className="text-white font-black uppercase tracking-[0.2em] leading-none mb-1.5 text-[18px]">
              Colo-Colo
            </p>
            <p className="text-neutral-500 font-bold uppercase tracking-[0.3em] text-[11px] leading-none">
              CC Analytics
            </p>
          </div>
          <img
            src="/photos/logo-colocolo.webp"
            alt="Escudo Colo-Colo"
            className="w-12 h-auto opacity-100"
          />
        </div>

        {/* caja del formulario */}
        <div className="w-full max-w-md mt-10 lg:mt-0 lg:mr-8">
          <div className="mb-12">
            <h3 className="text-2xl font-black text-white uppercase tracking-widest mb-2">
              Iniciar Sesión
            </h3>
            <p className="text-neutral-500 text-xs font-bold uppercase tracking-widest">
              Ingresa tus credenciales autorizadas
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-8" noValidate>
            <div className="space-y-6">
              {/* campo de correo */}
              <div className="space-y-2 relative">
                <label
                  htmlFor="login-email"
                  className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
                >
                  Correo Institucional
                </label>
                <input
                  id="login-email"
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={claseInput(errors.email)}
                  placeholder="usuario@colocolo.cl"
                />

                {/* muestra error si existe */}
                {errors.email && (
                  <p className="text-red-500 text-[13px] mt-1.5 font-semibold flex items-center gap-2 parpadeo-error antialiased">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                    {errors.email}
                  </p>
                )}
              </div>

              {/* campo de contrasena */}
              <div className="space-y-2 relative">
                <label
                  htmlFor="login-password"
                  className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest"
                >
                  Código de Acceso
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={claseInput(errors.password)}
                  placeholder="•••••••••••••"
                />

                {/* muestra error si existe */}
                {errors.password && (
                  <p className="text-red-500 text-[13px] mt-1.5 font-semibold flex items-center gap-2 parpadeo-error antialiased">
                    <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full shadow-[0_0_5px_rgba(239,68,68,0.8)]"></span>
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-6 mt-4">
              {/* boton transparente que muestra barra de carga y estado al pulsar */}
              <button
                type="submit"
                disabled={cargando}
                className="relative overflow-hidden w-full bg-transparent border border-neutral-700 text-white font-bold uppercase tracking-[0.2em] text-xs p-4 hover:enabled:bg-white hover:enabled:text-black hover:enabled:border-white transition-all duration-500 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-3 disabled:border-white/30 disabled:text-white disabled:cursor-wait disabled:bg-transparent"
              >
                {/* barra animada de progreso */}
                {cargando && (
                  <span className="absolute bottom-0 left-0 h-0.5 bg-white animate-login-progress"></span>
                )}

                {cargando ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin text-white shrink-0"
                      viewBox="0 0 24 24"
                      fill="none"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="3"
                      />
                      <path
                        className="opacity-90"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="tracking-wider text-[11px] font-semibold">
                      {mensajeCarga}
                    </span>
                  </>
                ) : (
                  <span>Ingresar al Sistema</span>
                )}
              </button>

              {/* links inferiores separados con una linea suave */}
              <div className="flex items-center justify-between text-[9px] uppercase tracking-widest font-bold text-neutral-500 pt-2 border-t border-white/5">
                <button
                  type="button"
                  className="hover:text-white transition-colors duration-300"
                >
                  ¿Olvidaste tu contraseña?
                </button>
                <button
                  type="button"
                  className="hover:text-white transition-colors duration-300"
                >
                  Soporte Técnico
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
