const Dashboard = () => {
  return (
    <div className="animate-fade-in-up">
      {/* Cabecera de la vista */}
      <header className="mb-10 pb-6 border-b border-white/10">
        <h2 className="text-3xl lg:text-4xl font-black uppercase tracking-widest text-white">
          Dashboard
        </h2>
        <p className="text-neutral-500 text-xs font-bold uppercase tracking-[0.2em] mt-3">
          Resumen General del Equipo
        </p>
      </header>

      {/* Contenedor temporal indicando que está en construcción */}
      <div className="border border-white/10 p-12 flex flex-col items-center justify-center bg-white/5 h-64 border-dashed">
        <span className="block w-2 h-2 bg-neutral-500 rounded-full mb-4 animate-ping"></span>
        <p className="text-neutral-400 text-sm tracking-widest uppercase font-bold">
          Módulo en construcción
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
