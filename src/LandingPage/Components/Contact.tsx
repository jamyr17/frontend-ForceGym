const Contact = () => {
  return (
    <section id="contacto" className="py-20 bg-black text-white">
      <div className="container mx-auto px-6">
        <h2 className="text-5xl font-bold text-center mb-12">CONTÁCTANOS</h2>
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-6">
            <p className="text-xl">¡Estamos aquí para ayudarte! Contáctanos por cualquier duda o consulta.</p>
            <div className="space-y-4">
              <p className="text-lg">📧 Correo electrónico: <a href="mailto:forcegymfullfitness@gmail.com" className="text-gray-300 hover:text-white">forcegymfullfitness@gmail.com</a></p>
              <p className="text-lg">📍 Dirección: <a href="https://www.google.com/maps/place/83CP%2B452,+Heredia,+La+Victoria/@10.3202,-83.9144,17z/data=!4m5!3m4!1s0x8fa0bd9a713f6e0d:0xa206b90f4a24b947!8m2!3d10.3202625!4d-83.9146094?hl=es&entry=ttu&g_ep=EgoyMDI1MDQyMy4wIKXMDSoASAFQAw%3D%3D" className="text-gray-300 hover:text-white" target="_blank" rel="noopener noreferrer">83CP+452, Heredia, La Victoria</a></p>
              <p className="text-lg">📞 Teléfono: <a href="tel:+50688437359" className="text-gray-300 hover:text-white">+506 8843 7359</a></p>
              <p className="text-lg">🌐 Síguenos en nuestras redes sociales:</p>
              <div className="flex space-x-6">
                <a href="https://www.facebook.com/profile.php?id=100083292401041" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="https://www.instagram.com/forcegym_fullfitness?igsh=aWR3bTVxbXhvOGln" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white text-2xl">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <div>
            {/* Mapa con la ubicación de Force Gym */}
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.4323445760934!2d-83.9146094!3d10.3202625!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8fa0bd9a713f6e0d%3A0xa206b90f4a24b947!2s83CP%2B452%2C%20Heredia%2C%20La%20Victoria!5e0!3m2!1ses!2scr!4v1682588905686!5m2!1ses!2scr" 
              width="100%" 
              height="400" 
              className="border-0 rounded-lg shadow-xl"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
