import { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault(); 
    let newErrors = { email: '', password: '' };
    let isValid = true;

    // validar dominios exactos
    const dominiosPermitidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com', '@colocolo.cl'];
    const emailValido = dominiosPermitidos.some(dominio => email.toLowerCase().endsWith(dominio));

    if (!emailValido) {
      newErrors.email = 'El correo debe terminar en  @colocolo.cl, @gmail.com o @duoc.cl';
      isValid = false;
    }

    // longitud estricta de contraseña
    if (password.length < 4 || password.length > 10) {
      newErrors.password = 'La contraseña debe tener entre 4 y 10 caracteres.';
      isValid = false;
    }

    setErrors(newErrors);

    if (isValid) {
      console.log('Login exitoso - Transicionando al Dashboard...');
      // integrar react router dom para redirigir a /dashboard
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-4 relative overflow-hidden">
      {/* efecto de resplandor de fondo */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-[100px] pointer-events-none"></div>

      {/* tarjeta principal */}
      <div className="w-full max-w-md bg-neutral-900/80 backdrop-blur-md border border-neutral-800 p-10 shadow-2xl relative z-10">
        
        {/* cabecera y logo */}
        <div className="mb-10 text-center flex flex-col items-center">
          {/* Placeholder para logo-colocolo.png de la Fase 1 */}
          <div className="w-16 h-16 bg-[#111] rounded-full flex items-center justify-center mb-5 border border-neutral-700 shadow-inner">
            <span className="text-white font-black text-2xl tracking-tighter">CC</span>
          </div>
          <h1 className="text-3xl font-black text-white uppercase tracking-[0.15em] mb-1">
            Analytics
          </h1>
          <p className="text-neutral-500 text-[10px] uppercase tracking-[0.3em] font-bold">
            Inteligencia Deportiva
          </p>
        </div>

        {/* formulario controlado */}
        <form onSubmit={handleLogin} className="space-y-6" noValidate>
          
          {/* input co  rreo */}
          <div className="space-y-2">
            <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
              Correo Institucional
            </label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full bg-[#111] border p-3.5 text-white text-sm focus:outline-none transition-all duration-300 ${
                errors.email 
                  ? 'border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
                  : 'border-neutral-800 focus:border-neutral-500'
              }`}
              placeholder="usuario@colocolo.cl"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1.5 animate-pulse">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.email}
              </p>
            )}
          </div>

          {/* input contraseña */}
          <div className="space-y-2">
            <label className="block text-neutral-400 text-[10px] font-bold uppercase tracking-widest">
              Código de Acceso
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full bg-[#111] border p-3.5 text-white text-sm focus:outline-none transition-all duration-300 ${
                errors.password 
                  ? 'border-red-500/80 focus:border-red-500 shadow-[0_0_10px_rgba(239,68,68,0.15)]' 
                  : 'border-neutral-800 focus:border-neutral-500'
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 font-medium flex items-center gap-1.5 animate-pulse">
                <span className="inline-block w-1.5 h-1.5 bg-red-500 rounded-full"></span>
                {errors.password}
              </p>
            )}
          </div>

          {/* boton de accion */}
          <button
            type="submit"
            className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-sm p-4 mt-8 hover:bg-neutral-200 transition-all duration-300 active:scale-[0.98]"
          >
            Ingresar al Sistema
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;