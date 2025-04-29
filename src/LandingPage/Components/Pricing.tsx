const Pricing = () => {
  const tarifas = [
    { name: "Mensualidad", price: "₡17,000" },
    { name: "Estudiante (Instituciones Públicas)", price: "₡14,500" },
    { name: "Quincena", price: "₡11,000" },
    { name: "Semana", price: "₡7,000" },
    { name: "Sesión", price: "₡2,500" },
    { name: "Limitada (8am-10am / 2pm-4pm)", price: "₡15,000" },
  ];

  return (
    <section id="tarifas" className="py-20 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">NUESTRAS <span className="text-gold">TARIFAS</span></h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tarifas.map((tarifa, index) => (
            <div
              key={index}
              className="p-6 rounded-xl shadow-md bg-white text-center hover:shadow-xl transition duration-300"
            >
              <h3 className="text-xl font-bold mb-2">{tarifa.name}</h3>
              <p className="text-3xl text-gold font-extrabold">{tarifa.price}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-600">
          <p className="mb-2">Incluye medición, rutina mensual y uso diario de las instalaciones*</p>
          <p className="text-sm italic">*Sujeto a condiciones.</p>
          <p className="mt-6 font-bold">Consulte en recepción para más información.</p>
        </div>
      </div>
    </section>
  );
};

export default Pricing;
