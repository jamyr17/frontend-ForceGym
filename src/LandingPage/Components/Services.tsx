const Services = () => {
  const services = [
    { name: "Instalaciones de Gimnasio", img: "/gimnasio.jpg" },
    { name: "Clases de Zumba", img: "/zumba.jpg" },
    { name: "Clases de Yoga", img: "/yoga.jpg" },
  ];

  return (
    <section id="servicios" className="py-24 bg-white">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center mb-16 text-black">
          NUESTROS <span className="text-gold">SERVICIOS</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-12">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-lg group"
            >
              <img
                src={service.img}
                alt={service.name}
                className="w-full h-72 object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition-all duration-500 flex items-center justify-center">
                <h3 className="text-white text-2xl md:text-3xl font-bold text-center px-4">
                  {service.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
