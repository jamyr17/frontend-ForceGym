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

  // Process data for charts
  const processChartData = () => {
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    
    // Initialize monthly data
    const monthlyData = months.map(month => ({
      name: month,
      income: 0,
      expense: 0,
      balance: 0
    }));

    // Process incomes
    economicIncomes.forEach((income: any) => {
      const date = new Date(income.registrationDate);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].income += income.amount;
      monthlyData[monthIndex].balance += income.amount;
    });

    // Process expenses
    economicExpenses.forEach((expense: any) => {
      const date = new Date(expense.registrationDate);
      const monthIndex = date.getMonth();
      monthlyData[monthIndex].expense += expense.amount;
      monthlyData[monthIndex].balance -= expense.amount;
    });

    return monthlyData;
  };

  const chartData = processChartData();

  return (
    <div className="bg-black min-h-screen">
      <header className="relative flex justify-center items-center py-2">
        <img src="/LogoBlack.jpg" alt="Logo de Force GYM" className="w-40 h-auto" />
        <IoIosNotificationsOutline 
          className="text-white text-3xl cursor-pointer absolute right-2 top-1/2 transform -translate-y-1/2" 
          onClick={() => setIsNotificationsOpen(true)}
        />
      </header>

      {/* Contenedor principal */}
      <div className="grid grid-cols-1 gap-6">
        <div className="mt-6"></div>  {/* Margen superior */}
        
        {/* Balance Mensual */}
        <div className="bg-white p-6 rounded-lg shadow-md text-black mx-auto w-full max-w-4xl">
          <h2 className="text-lg font-semibold text-center mb-2">Balance Mensual</h2>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666' }}
                />
                <YAxis 
                  tickFormatter={(value: number) => formatAmountToCRC(value).replace('₡', '')}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#666' }}
                />
                <Tooltip 
                  formatter={(value: number) => [formatAmountToCRC(value), 'Monto']}
                  labelFormatter={(label) => `Mes: ${label}`}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #eee',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="balance" 
                  name="Balance" 
                  fill="#8a2be2" // Morado
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Ingresos y Gastos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full max-w-5xl">
          {/* Ingresos */}
          <div className="bg-white p-4 rounded-lg shadow-md text-black">
            <h2 className="text-md font-semibold mb-2">Ingresos Mensuales</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    tickFormatter={(value: number) => formatAmountToCRC(value).replace('₡', '')}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatAmountToCRC(value), 'Monto']}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="income" 
                    name="Ingresos" 
                    fill="#4CAF50" // Verde
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Gastos */}
          <div className="bg-white p-4 rounded-lg shadow-md text-black">
            <h2 className="text-md font-semibold mb-2">Gastos Mensuales</h2>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666' }}
                  />
                  <YAxis 
                    tickFormatter={(value: number) => formatAmountToCRC(value).replace('₡', '')}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#666' }}
                  />
                  <Tooltip 
                    formatter={(value: number) => [formatAmountToCRC(value), 'Monto']}
                    labelFormatter={(label) => `Mes: ${label}`}
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #eee',
                      borderRadius: '4px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                    }}
                  />
                  <Legend />
                  <Bar 
                    dataKey="expense" 
                    name="Gastos" 
                    fill="#FFD700" // Dorado
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
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