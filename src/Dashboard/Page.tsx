import React, { useEffect, useState } from "react";
import MiniIncomeChart from "../Income/MiniIncomeChart";
import MiniExpenseChart from "../Expense/MiniExpenseChart";
import { IoIosNotificationsOutline } from "react-icons/io";
import { NotificationsModal } from "../shared/components/NotificationsModal";
import { ClientSelectionModal } from "../shared/components/ClientSelectionModal";

function DashboardManagement() {
  const [economicIncomes, setEconomicIncomes] = useState([]);
  const [economicExpenses, setEconomicExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false); // Nuevo estado para el modal de notificaciones

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Obtener ingresos
        const incomeResponse = await fetch("/api/economic-incomes");
        const incomeData = await incomeResponse.json();
        setEconomicIncomes(incomeData);

        // Obtener gastos
        const expenseResponse = await fetch("/api/economic-expenses");
        const expenseData = await expenseResponse.json();
        setEconomicExpenses(expenseData);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="bg-black min-h-screen p-8 text-white">
      <header className="relative flex justify-center items-center py-4">
        <img src="/LogoBlack.jpg" alt="Logo de Force GYM" className="w-52 h-auto" />
        <IoIosNotificationsOutline 
          className="text-white text-4xl cursor-pointer absolute right-4 top-1/2 transform -translate-y-1/2" 
          onClick={() => setIsNotificationsOpen(true)} // Ahora abre el modal de notificaciones
        />
      </header>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 gap-6">
        <div className="mt-6"></div>  {/* Margen superior */}

        {/* Balance Mensual */}
        <div className="bg-white p-6 rounded-lg shadow-md text-black mx-auto w-full max-w-4xl">
          <h2 className="text-lg font-bold text-center">Balance Mensual</h2>
          <div className="h-48 flex items-center justify-center text-gray-400">Gráfico en desarrollo...</div>
        </div>

        {/* Ingresos y Gastos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full max-w-5xl">
          <div className="bg-white p-4 rounded-lg shadow-md text-black">
            <h2 className="text-md font-bold">Ingresos Mensuales</h2>
            {loading ? (
              <p className="text-gray-500 text-center">Cargando...</p>
            ) : (
              <MiniIncomeChart economicIncomes={economicIncomes} />
            )}
          </div>
          <div className="bg-white p-4 rounded-lg shadow-md text-black">
            <h2 className="text-md font-bold">Gastos Mensuales</h2>
            {loading ? (
              <p className="text-gray-500 text-center">Cargando...</p>
            ) : (
              <MiniExpenseChart economicExpenses={economicExpenses} />
            )}
          </div>
        </div>
      </div>

      {/* Modal de Notificaciones */}
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}

export default DashboardManagement;
