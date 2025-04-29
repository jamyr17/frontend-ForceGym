import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <nav className="fixed w-full bg-black text-white p-4 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-yellow">FORCE GYM</Link>
        <div className="hidden md:flex space-x-8">
          <li><a href="#historia" className="hover:text-yellow">Historia</a></li>
          <li><a href="#servicios" className="hover:text-yellow">Servicios</a></li>
          <li><a href="#tarifas" className="hover:text-yellow">Tarifas</a></li>
          <li><a href="#contacto" className="hover:text-yellow">Contacto</a></li>
        </div>
      </div>
    </nav>
  );
};
export default Navbar; 
