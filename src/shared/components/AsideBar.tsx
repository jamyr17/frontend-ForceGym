import { useState, useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { FaRegUser, FaSignOutAlt } from 'react-icons/fa';
import { FaRegCircleUser } from "react-icons/fa6";
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdOutlineInventory, MdOutlineTrendingUp, MdTrendingDown } from 'react-icons/md';
import { PiHouseSimpleFill } from "react-icons/pi";
import { TbBellCog } from "react-icons/tb";
import { FaBalanceScale } from "react-icons/fa"; 
import { CgGym } from "react-icons/cg";
import { MdOutlineCategory } from "react-icons/md";
import { getAuthUser } from '../utils/authentication';
import { LogoutModal } from './LogoutModal';
import { Link, useNavigate, useLocation } from 'react-router';

function AsideBar() {
  const loggedUser = getAuthUser();
  const userRole = loggedUser?.role?.name;
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      const aside = document.getElementById('sidebar');
      if (aside && !aside.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const NavItem = ({ 
    to, 
    icon, 
    title, 
    text,
    allowedRoles 
  }: {
    to: string;
    icon: React.ReactNode;
    title: string;
    text: string;
    allowedRoles?: string[];
  }) => {
    if (allowedRoles && !allowedRoles.includes(userRole || '')) return null;

    const isActive = location.pathname === to;

    return (
      <Link
        to={to}
        className={`flex items-center gap-2 p-2 ${
          isActive 
            ? 'bg-yellow text-black rounded-b-sm font-semibold' 
            : 'hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer'
        }`}
        title={title}
      >
        {icon}
        {isOpen && <p>{text}</p>}
      </Link>
    );
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`md:flex flex-col fixed group items-center justify-between pt-6 bg-black text-white h-full transition-all duration-300 z-50 ${
          isOpen ? 'w-48' : 'w-12'
        }`}
      >
        <div
          className="flex items-center gap-2 p-2 text-lg hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
          title="Menú"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoMdMenu />
          {isOpen && <p>Menú</p>}
        </div>

        <div className="flex flex-col gap-6 text-lg">
          <NavItem to="/gestion/dashboard" icon={<PiHouseSimpleFill />} title="Dashboard" text="Dashboard" />
          <NavItem to="/gestion/usuarios" icon={<FaRegUser />} title="Usuarios" text="Usuarios" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/clientes" icon={<GiWeightLiftingUp />} title="Clientes" text="Clientes" />
          <NavItem to="/gestion/ingresos" icon={<MdOutlineTrendingUp />} title="Ingresos" text="Ingresos" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/gastos" icon={<MdTrendingDown />} title="Gastos" text="Gastos" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/balance" icon={<FaBalanceScale />} title="Balance Económico" text="Balance" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/inventario" icon={<MdOutlineInventory />} title="Inventario" text="Inventario" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/categorias" icon={<MdOutlineCategory />} title="Categorías" text="Categorías"/>
          <NavItem to="/gestion/plantillas-notificacion" icon={<TbBellCog />} title="Plantillas de Notificaciones" text="Plantillas"/>
          <NavItem to="/gestion/ejercicios" icon={<CgGym />} title="Ejercicios" text="Ejercicios"/>
        </div>

        <div>
          <div>
            {isOpen && (
              <div className="flex items-center justify-center gap-2 mb-2 text-sm border-t-2 pt-2 border-gray-500">
                <FaRegCircleUser className="text-base" />
                <p className="font-medium">{loggedUser?.username}</p>
              </div>
            )}
          </div>

          <div
            onClick={handleLogout}
            className="flex items-center text-lg gap-2 my-4 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
            title="Cerrar sesión"
          >
            <FaSignOutAlt />
            {isOpen && <p>Cerrar sesión</p>}
          </div>
        </div>
      </aside>

      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default AsideBar;