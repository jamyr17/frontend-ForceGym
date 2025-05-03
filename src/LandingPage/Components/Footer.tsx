import { FaUser, FaInstagram, FaFacebook } from 'react-icons/fa';
import { Link } from 'react-router-dom';


const Footer = () => {
  return (
    <footer className="bg-black text-gray-400 py-12 relative">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-yellow mb-4">FORCE GYM</h3>
            <p>Transformando cuerpos desde 2022.</p>
          </div>

          {/* Columna 2 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Enlaces</h4>
            <ul className="space-y-2">
              <li><a href="#galeria" className="hover:text-yellow-600 transition-colors duration-200">Galería</a></li>
              <li><a href="#tarifas" className="hover:text-yellow-600 transition-colors duration-200">Tarifas</a></li>
              <li><a href="#contacto" className="hover:text-yellow-600 transition-colors duration-200">Contacto</a></li>
            </ul>
          </div>

          {/* Columna 3 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Horarios</h4>
            <div className="space-y-2 text-gray-300">
              <p>Lunes-Viernes: 5:00 AM - 12:00 PM & 2:00 PM - 9:00 PM</p>
              <p>Sábado: 7:00 AM - 1:00 PM</p>
              <p>Domingo: Cerrado</p>
            </div>
          </div>

          {/* Columna 4 */}
          <div>
            <h4 className="text-white text-lg font-semibold mb-4">Redes</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-yellow-600 hover:text-white transition-colors duration-200">
                <FaInstagram className="h-6 w-6" />
              </a>
              <a href="#" className="text-yellow-600 hover:text-white transition-colors duration-200">
                <FaFacebook className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
          <p>© {new Date().getFullYear()} Force Gym. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
