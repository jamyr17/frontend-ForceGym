const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-yellow mb-4">FORCE GYM</h3>
            <p>Transformando cuerpos desde 2022.</p>
          </div>
          <div>
            <h4 className="text-white mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><a href="#servicios" className="hover:text-yellow">Servicios</a></li>
              <li><a href="#tarifas" className="hover:text-yellow">Tarifas</a></li>
              <li><a href="#contacto" className="hover:text-yellow">Contacto</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white mb-4">Horarios</h4>
            <p>Lunes-Viernes: 5:00 AM - 12:00 PM & 2:00 PM - 9:00 PM</p>
            <p>Sábado: 7:00 AM - 1:00 PM</p>
            <p>Domingo: Cerrado</p>
          </div>
          <div>
            <h4 className="text-white mb-4">Redes</h4>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/forcegym_fullfitness?igsh=aWR3bTVxbXhvOGln" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white">Instagram</a>
              <a href="https://www.facebook.com/profile.php?id=100083292401041" target="_blank" rel="noopener noreferrer" className="text-gold hover:text-white">Facebook</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p>© 2025 Force Gym. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
