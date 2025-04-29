const History = () => {
  return (
    <section id="historia" className="relative h-[80vh] flex items-center justify-center bg-black text-white overflow-hidden">
      {/* Imagen de fondo */}
      <img
        src="/gym-history.jpg"
        alt="Historia Force Gym"
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      />
      {/* Capa de color para desvanecido */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Contenido */}
      <div className="relative z-10 text-center px-4 md:px-20">
        <h2 className="text-4xl md:text-5xl font-extrabold mb-6">
          NUESTRA <span className="text-gold">HISTORIA</span>
        </h2>
        <p className="text-gray-300 text-lg md:text-xl mb-8 max-w-3xl mx-auto leading-relaxed">
          Fundado en 2015, Force Gym nació con la visión de revolucionar el fitness en la ciudad,
          combinando fuerza, mente y comunidad en un solo lugar.
        </p>
        <button className="border-2 border-gold text-gold px-8 py-3 rounded-lg text-lg font-semibold hover:bg-gold hover:text-black transition">
          Conoce Más
        </button>
      </div>
    </section>
  );
};

export default History;
