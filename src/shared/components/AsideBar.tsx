import { useState, useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { FaRegUser, FaSignOutAlt } from 'react-icons/fa';
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdOutlineInventory, MdOutlineTrendingUp, MdTrendingDown } from 'react-icons/md';
import { PiHouseSimpleFill } from "react-icons/pi";
import { TbBellCog } from "react-icons/tb";
import { FaBalanceScale } from "react-icons/fa"; 
import { getAuthUser } from '../utils/authentication';
import { LogoutModal } from './LogoutModal';
import { Link, useNavigate } from 'react-router';

function AsideBar() {
  const loggedUser = getAuthUser();
  const userRole = loggedUser?.role?.name;
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navigate = useNavigate();

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
    if (allowedRoles && !allowedRoles.includes(userRole || '')) {
      return null;
    }
    
    return (
      <Link
        to={to}
        className={`flex items-center gap-2 p-2 ${to === '/gestion/dashboard' ? 
          'bg-yellow-500 text-black rounded-b-sm cursor-pointer' : 
          'hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer'}`}
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
        className={`md:flex flex-col fixed group items-center justify-between pt-6 bg-black text-white h-full transition-all ${
          isOpen ? 'w-/12' : 'w-12'
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
          <NavItem
            to="/gestion/dashboard"
            icon={<PiHouseSimpleFill />}
            title="Dashboard"
            text="Dashboard"
          />

          <NavItem
            to="/gestion/usuarios"
            icon={<FaRegUser />}
            title="Usuarios"
            text="Usuarios"
          />

          <NavItem
            to="/gestion/clientes"
            icon={<GiWeightLiftingUp />}
            title="Clientes"
            text="Clientes"
          />

          <NavItem
            to="/gestion/ingresos"
            icon={<MdOutlineTrendingUp />}
            title="Ingresos"
            text="Ingresos"
          />

          <NavItem
            to="/gestion/gastos"
            icon={<MdTrendingDown />}
            title="Gastos"
            text="Gastos"
          />

          <NavItem
            to="/gestion/balance"
            icon={<FaBalanceScale />}
            title="Balance Económico"
            text="Balance"
          />

          {/* Ítem de inventario solo para Administrador */}
          <NavItem
            to="/gestion/inventario"
            icon={<MdOutlineInventory />}
            title="Inventario"
            text="Inventario"
            allowedRoles={['Administrador']}
          />

          <NavItem
            to="/gestion/plantillas-notificacion"
            icon={<TbBellCog />}
            title="Plantillas de Notificaciones"
            text="Plantillas"
          />
        </div>

        <div>
          <div>
            {isOpen && <p className="text-center text-lg">{loggedUser?.username}</p>}
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