import { useState, useEffect, useRef } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { FaRegUser, FaSignOutAlt, FaBalanceScale, FaSlidersH } from 'react-icons/fa';
import { FaRegCircleUser } from "react-icons/fa6";
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdOutlineInventory, MdOutlineTrendingUp, MdTrendingDown, MdOutlineGroups, MdOutlineCategory } from 'react-icons/md';
import { PiHouseSimpleFill } from "react-icons/pi";
import { TbBellCog } from "react-icons/tb";
import { CgGym } from "react-icons/cg";
import { FaRegCalendarAlt } from 'react-icons/fa';
import { getAuthUser } from '../utils/authentication';
import { LogoutModal } from './LogoutModal';
import { Link, useNavigate, useLocation } from 'react-router-dom';

function AsideBar() {
  const loggedUser = getAuthUser();
  const userRole = loggedUser?.role?.name;
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showFloatingMenu, setShowFloatingMenu] = useState(false);
  const submenuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        submenuRef.current &&
        !submenuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setShowFloatingMenu(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
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
        className={`flex items-center gap-3 px-4 py-2 w-full transition-colors duration-200 ${
          isActive
            ? 'bg-yellow text-black font-semibold shadow-sm rounded-md'
            : 'hover:bg-yellow hover:text-black hover:rounded-md'
        }`}
        title={title}
        onClick={() => setShowFloatingMenu(false)}
      >
        <span className="text-xl">{icon}</span>
        <span className="text-sm truncate">{text}</span>
      </Link>
    );
  };

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <>
      <aside
        id="sidebar"
        className={`md:flex flex-col fixed items-start justify-between pt-6 pb-6 bg-black text-white h-full transition-all duration-300 z-50 overflow-y-auto ${
          isOpen ? 'w-56 px-2' : 'w-14'
        }`}
      >
        {/* Botón Menú */}
        <div
          className="flex items-center gap-2 p-2 text-lg hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
          title="Menú"
          onClick={() => setIsOpen(!isOpen)}
        >
          <IoMdMenu className="text-xl" />
          {isOpen && <span className="text-base font-semibold">Menú</span>}
        </div>

        <div className="flex flex-col gap-4 text-base w-full mt-4">
          <NavItem to="/gestion/dashboard" icon={<PiHouseSimpleFill />} title="Dashboard" text="Dashboard" />
          <NavItem to="/gestion/usuarios" icon={<FaRegUser />} title="Usuarios" text="Usuarios" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/clientes" icon={<GiWeightLiftingUp />} title="Clientes" text="Clientes" />
          <NavItem to="/gestion/ingresos" icon={<MdOutlineTrendingUp />} title="Ingresos" text="Ingresos" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/gastos" icon={<MdTrendingDown />} title="Gastos" text="Gastos" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/balance" icon={<FaBalanceScale />} title="Balance Económico" text="Balance" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/inventario" icon={<MdOutlineInventory />} title="Inventario" text="Inventario" allowedRoles={['Administrador']} />
          <NavItem to="/gestion/plantillas-notificacion" icon={<TbBellCog />} title="Plantillas" text="Plantillas" />
          <NavItem to="/gestion/ejercicios" icon={<CgGym />} title="Ejercicios" text="Ejercicios" />

          {/* Botón más opciones */}
          <div
            ref={buttonRef}
            className="flex items-center gap-3 px-4 py-2 cursor-pointer hover:bg-yellow hover:text-black hover:rounded-md"
            title="Más opciones"
            onClick={(e) => {
              e.stopPropagation();
              setShowFloatingMenu(!showFloatingMenu);
            }}
          >
            <FaSlidersH className="text-xl" />
            {isOpen && <span className="text-base">Más opciones</span>}
          </div>
        </div>

        <div className="w-full">
          {isOpen && (
            <div className="flex items-center justify-center gap-2 mb-2 text-sm border-t-2 pt-2 border-gray-500">
              <FaRegCircleUser className="text-base" />
              <p className="font-medium truncate">{loggedUser?.username}</p>
            </div>
          )}

          <div
            onClick={handleLogout}
            className="flex items-center text-lg gap-2 my-4 px-4 py-2 hover:bg-yellow hover:rounded-md hover:text-black hover:cursor-pointer"
            title="Cerrar sesión"
          >
            <FaSignOutAlt className="text-xl" />
            {isOpen && <span className="text-base">Cerrar sesión</span>}
          </div>
        </div>
      </aside>

    {/* Submenú flotante */}
    {showFloatingMenu && (
      <div
        ref={submenuRef}
        className="fixed bg-black border border-gray-600 text-white rounded-md shadow-md p-2 w-64 z-50 flex flex-col gap-2 text-sm max-h-[400px] overflow-y-auto"
        style={{
          top: `${(buttonRef.current?.getBoundingClientRect().top ?? 0) - 40}px`,
          left: `${(buttonRef.current?.getBoundingClientRect().right ?? 0) + 12}px`,
        }}
      >
        <NavItem to="/gestion/categorias" icon={<MdOutlineCategory />} title="Categorías" text="Categorías" />
        <NavItem to="/gestion/tipos-cliente" icon={<MdOutlineGroups />} title="Tipos Cliente" text="Tipos Cliente" allowedRoles={['Administrador']} />
        <NavItem to="/gestion/tipos-actividad" icon={<FaRegCalendarAlt />} title="Tipos Actividad" text="Tipos Actividad" allowedRoles={['Administrador']} />
      </div>
    )}


      <LogoutModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
      />
    </>
  );
}

export default AsideBar;
