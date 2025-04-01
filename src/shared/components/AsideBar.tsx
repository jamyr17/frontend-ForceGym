import { useState, useEffect } from 'react';
import { IoMdMenu } from 'react-icons/io';
import { FaRegUser, FaSignOutAlt } from 'react-icons/fa';
import { GiWeightLiftingUp } from "react-icons/gi";
import { MdOutlineInventory, MdOutlineTrendingUp , MdTrendingDown   } from 'react-icons/md';
import { PiHouseSimpleFill } from "react-icons/pi";
import { TbBellCog } from "react-icons/tb";
import { Link } from 'react-router';
import { getAuthUser } from '../utils/authentication';

function AsideBar() {
  const loggedUser = getAuthUser()
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event : any) => {
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

  return (
    <aside
      id="sidebar"
      className={`md:flex flex-col fixed group items-center justify-between pt-6 bg-black text-white h-full transition-all ${
        isOpen ? 'w-/12' : 'w-12'
      }`}
    >
      <div
        className=" flex items-center gap-2 p-2 text-lg hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Menu"
        onClick={() => setIsOpen(!isOpen)}
      >
        <IoMdMenu />
        {isOpen && <p>Menú</p>}
      </div>

      <div className="flex flex-col gap-6 text-lg">
      <Link
        to={'/gestion/dashboard'}
        className="flex items-center gap-2 p-2 bg-yellow-500 text-black rounded-b-sm cursor-pointer"
        title="Dashboard">
        <PiHouseSimpleFill />
        {isOpen && <p>Dashboard</p>}
      </Link>

        <Link to={'/gestion/usuarios'} className="flex items-center gap-2 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Usuarios">
          <FaRegUser />
          {isOpen && <p>Usuarios</p>}
        </Link>

        <Link  to={'/gestion/clientes'} className="flex items-center gap-2 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Clientes">
          <GiWeightLiftingUp />
          {isOpen && <p>Clientes</p>}
        </Link>

        <Link to={'/gestion/ingresos'} className="flex items-center gap-2 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Ingresos">
          <MdOutlineTrendingUp />
          {isOpen && <p>Ingresos</p>}
        </Link>

        <Link to={'/gestion/gastos'} className="flex items-center gap-2 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Gastos">
          <MdTrendingDown />
          {isOpen && <p>Gastos</p>}
        </Link>

        <Link  to={'/gestion/inventario'} className="flex items-center gap-2 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Inventario">
          <MdOutlineInventory />
          {isOpen && <p>Inventario</p>}
        </Link>

        <Link  to={'/gestion/plantillas-notificacion'} className="flex items-center gap-2 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Plantillas de Notificaciones">
          <TbBellCog />
          {isOpen && <p>Plantillas</p>}
        </Link>
      </div>

      <div>
        <div>
          {isOpen && <p className="text-center text-lg">{loggedUser?.username}</p>}
        </div>

        <Link to={'/login'} className="flex items-center text-lg gap-2 my-4 p-2 hover:bg-yellow hover:rounded-b-sm hover:text-black hover:cursor-pointer"
        title="Cerrar sesión">
          <FaSignOutAlt />
          {isOpen && <p>Cerrar sesión</p>}
        </Link>
      </div>
    </aside>
  );
}

export default AsideBar;