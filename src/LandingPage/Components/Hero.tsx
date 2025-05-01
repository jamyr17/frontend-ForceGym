const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden">
      {/* Fondo con overlay de gradiente */}
      <div className="absolute inset-0 bg-[url('/gym-hero.jpg')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 to-black/40" />
      </div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-6 animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6 drop-shadow-lg">
          DESAFÍA TU <span className="text-yellow-500">CUERPO</span>,<br />
          CONQUISTA TU <span className="text-yellow-500">MENTE</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-200 mb-10 max-w-2xl mx-auto">
          Bienvenido a <span className="font-bold text-yellow-500">Force Gym</span>: donde la fuerza física y mental se forjan juntas.
        </p>

        <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6">
        </div>
      </div>
    </section>
  );
};

export default Hero;
