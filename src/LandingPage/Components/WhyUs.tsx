const WhyUs = () => {
  const features = [
    { img: "/trainer.jpg", title: "Entrenadores Profesionales", desc: "Guías expertos que te impulsan a alcanzar tu mejor versión." },
    { img: "/equipment.jpg", title: "Instalaciones de Primera", desc: "Espacios modernos, limpios y equipados para todos los niveles." },
    { img: "/results.jpg", title: "Resultados Reales", desc: "Programas diseñados para transformar tu cuerpo y mente." },
  ];

  return (
    <section className="py-24 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl md:text-5xl font-extrabold text-center text-black mb-16">
          ¿POR QUÉ <span className="text-gold">FORCE GYM</span>?
        </h2>
        <div className="grid gap-12 md:grid-cols-3">
          {features.map((item, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition group"
            >
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-64 object-cover transform group-hover:scale-105 transition duration-300"
              />
              <div className="absolute inset-0 bg-black bg-opacity-40 group-hover:bg-opacity-50 transition duration-300"></div>
              <div className="absolute bottom-0 p-6 text-white">
                <h3 className="text-2xl font-bold mb-2">{item.title}</h3>
                <p className="text-gray-300 text-md">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
export default WhyUs;
