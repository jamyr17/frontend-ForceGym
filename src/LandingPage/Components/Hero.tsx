const Hero = () => {
  return (
    <section className="relative h-screen flex items-center justify-center bg-black">
      <div className="absolute inset-0 bg-[url('/gym-hero.jpg')] bg-cover bg-center opacity-60" />
      <div className="z-10 text-center px-6">
        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          DESAFÍA TU <span className="text-gold">CUERPO</span>,<br />
          CONQUISTA TU <span className="text-gold">MENTE</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-10">
          Bienvenido a <span className="font-bold text-gold">Force Gym</span>: donde la fuerza física y mental se forjan juntas.
        </p>
        <div className="flex justify-center space-x-6">
          <button className="bg-gold text-black px-8 py-3 rounded-lg text-lg font-semibold hover:bg-opacity-90 transition">
            ¡Únete Hoy!
          </button>
          <button className="border-2 border-gold text-gold px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gold hover:text-black transition">
            Conoce Más
          </button>
        </div>
      </div>
    </section>
  );
};
export default Hero;
