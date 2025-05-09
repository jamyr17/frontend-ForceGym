import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IoIosNotificationsOutline } from "react-icons/io";
import { NotificationsModal } from "../shared/components/NotificationsModal";
import { formatAmountToCRC } from "../shared/utils/format";
import { useEconomicBalanceStore } from '../Balance/Store';
import { useNavigate } from "react-router";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

function DashboardManagement() {
  const {
    economicExpenses,
    economicIncomes,
    fetchEconomicExpenses,
    fetchEconomicIncomes,
  } = useEconomicBalanceStore();

  const navigate = useNavigate();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const expenseResult = await fetchEconomicExpenses();
      const incomeResult = await fetchEconomicIncomes();

      if (expenseResult.logout || incomeResult.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate('/login', { replace: true });
      }
    };

    fetchData();
  }, []);

  // Procesamiento de datos mensuales para el gráfico
  const processChartData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const monthlyData = months.map(month => ({
      name: month,
      income: 0,
      expense: 0,
      balance: 0
    }));

    economicIncomes.forEach((income: any) => {
      const monthIndex = new Date(income.registrationDate).getMonth();
      monthlyData[monthIndex].income += income.amount;
      monthlyData[monthIndex].balance += income.amount;
    });

    economicExpenses.forEach((expense: any) => {
      const monthIndex = new Date(expense.registrationDate).getMonth();
      monthlyData[monthIndex].expense += expense.amount;
      monthlyData[monthIndex].balance -= expense.amount;
    });

    return monthlyData;
  };

  const chartData = processChartData();

  // Formato del eje Y (colón costarricense)
  const formatYAxis = (value: number) => `₡${value.toLocaleString('es-CR')}`;

  return (
    <div className="bg-black min-h-screen p-4">
      {/* Header con logo y botón de notificación */}
      <header className="relative flex justify-center items-center py-4 mb-6">
        <img 
          src="/LogoBlack.jpg" 
          alt="Logo de Force GYM" 
          className="w-40 h-auto" // Tamaño del logo
        />
        <button 
          className="p-2 rounded-full hover:bg-gray-800 absolute right-4"
          onClick={() => setIsNotificationsOpen(true)}
        >
          <IoIosNotificationsOutline className="text-white text-2xl" /> {/* Tamaño del ícono */}
        </button>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 gap-6">
        {/* Gráfico Balance Mensual */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-center text-gray-800 mb-4">
            Balance Mensual
          </h2>
          <div className="h-64"> {/* Altura del gráfico principal */}
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 30, right: 20, left: 10, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }} // Tamaño fuente eje X
                />
                <YAxis 
                  tickFormatter={formatYAxis}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666', fontSize: 12 }} // Tamaño fuente eje Y
                  width={90} // Ancho del eje Y
                />
                <Tooltip 
                  formatter={(value: number) => [`₡${value.toLocaleString('es-CR')}`, 'Monto']}
                  labelFormatter={(label) => `Mes: ${label}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '6px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    fontSize: '14px' // Tamaño del tooltip
                  }}
                />
                <Legend wrapperStyle={{ paddingTop: '20px' }} />
                <Bar 
                  dataKey="balance" 
                  name="Balance" 
                  fill="#8a2be2"
                  radius={[4, 4, 0, 0]} // Bordes redondeados arriba
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ingresos y Gastos en dos columnas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Ingresos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
              Ingresos Mensuales
            </h2>
            <div className="h-48"> {/* Altura del gráfico de ingresos */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }} // Fuente eje X
                  />
                  <YAxis 
                    tickFormatter={formatYAxis}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }} // Fuente eje Y
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₡${value.toLocaleString('es-CR')}`, 'Monto']}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{ fontSize: '13px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar 
                    dataKey="income" 
                    name="Ingresos" 
                    fill="#4CAF50"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gastos */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-lg font-semibold text-center text-gray-800 mb-4">
              Gastos Mensuales
            </h2>
            <div className="h-48"> {/* Altura del gráfico de gastos */}
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }}
                  />
                  <YAxis 
                    tickFormatter={formatYAxis}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666', fontSize: 11 }}
                    width={80}
                  />
                  <Tooltip 
                    formatter={(value: number) => [`₡${value.toLocaleString('es-CR')}`, 'Monto']}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{ fontSize: '13px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '10px' }} />
                  <Bar 
                    dataKey="expense" 
                    name="Gastos" 
                    fill="#FFD700"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de notificaciones */}
      <NotificationsModal 
        isOpen={isNotificationsOpen} 
        onClose={() => setIsNotificationsOpen(false)}
      />
    </div>
  );
}

export default DashboardManagement;