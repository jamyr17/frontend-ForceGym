const WhyUs = () => {
  const features = [
    { 
      img: "/LandingPage/coach.webp", 
      title: "ENTRENADORES ÉLITE", 
      desc: "Certificados para llevarte más allá de tus límites." 
    },
    { 
      img: "/LandingPage/gym.webp", 
      title: "INSTALACIONES PREMIUM", 
      desc: "Equipo y espacio diseñado para el alto rendimiento." 
    },
    { 
      img: "/LandingPage/resultados.webp", 
      title: "RESULTADOS GARANTIZADOS", 
      desc: "Programas científicos con seguimiento personalizado para maximizar tu potencial." 
    },
  ];

  return (
    <section className="py-16 md:py-24 bg-black">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Encabezado */}
        <div className="text-center mb-12 md:mb-20">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-3 md:mb-4">
            ¿POR QUÉ <span className="text-yellow-500">FORCE GYM</span>?
          </h2>
          <div className="w-16 md:w-20 h-1 bg-yellow-500 mx-auto"></div>
        </div>
        
        {/* Tarjetas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {features.map((item, index) => (
            <div key={index} className="group">
              <div className="relative h-72 sm:h-80 overflow-hidden rounded-lg border border-black 
                              transform transition-all duration-500 group-hover:scale-105 
                              hover:border-yellow-500 hover:shadow-lg hover:shadow-yellow-500/10">
                
                {/* Imagen con capa oscura y brillo reducido */}
                <div 
                  className="absolute inset-0 transition-all duration-700 group-hover:opacity-90 brightness-[0.5]"
                  style={{
                    backgroundImage: `url('${item.img}')`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.7
                  }}
                ></div>
                
                {/* Contenido */}
                <div className="absolute inset-0 flex flex-col justify-center p-6 text-center">
                  <h3 className="text-xl sm:text-2xl font-extrabold mb-2 text-yellow-400">
                    {item.title}
                  </h3>
                  <p className="text-white text-sm sm:text-base font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyUs;
