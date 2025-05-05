import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { formatAmountToCRC, formatDate } from '../shared/utils/format';
import { EconomicExpense } from '../shared/types';

interface ExpenseDashboardProps {
  economicExpenses: EconomicExpense[];
}

const ExpenseDashboard: React.FC<ExpenseDashboardProps> = ({ economicExpenses }) => {
  // Función para obtener número de semana
  const getWeekNumber = (date: Date): number => {
    const d = new Date(date);
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() + 3 - (d.getDay() + 6) % 7);
    const week1 = new Date(d.getFullYear(), 0, 4);
    return 1 + Math.round(((d.getTime() - week1.getTime()) / 86400000 - 3 + (week1.getDay() + 6) % 7) / 7);
  };

  // Cálculo de totales
  const calculateTotals = () => {
    const today = new Date();
    const currentDay = formatDate(today);
    const currentWeek = getWeekNumber(today);
    const currentMonth = today.toLocaleString('es-ES', { month: 'long' });
    const isFirstQuincena = today.getDate() <= 15;

    let dailyTotal = 0;
    let weeklyTotal = 0;
    let biweeklyTotal = 0;
    let monthlyTotal = 0;
    let highestDay = { date: '', amount: 0 };
    const dailyData: Record<string, number> = {};

    economicExpenses.forEach(expense => {
      const expenseDate = new Date(expense.registrationDate);
      const formattedDate = formatDate(expenseDate);
      
      // Acumular por día
      dailyData[formattedDate] = (dailyData[formattedDate] || 0) + expense.amount;
      
      // Diario
      if (formattedDate === currentDay) {
        dailyTotal += expense.amount;
      }
      
      // Semanal
      if (getWeekNumber(expenseDate) === currentWeek) {
        weeklyTotal += expense.amount;
      }
      
      // Quincenal
      if (expenseDate.getMonth() === today.getMonth()) {
        if ((isFirstQuincena && expenseDate.getDate() <= 15) || 
            (!isFirstQuincena && expenseDate.getDate() > 15)) {
          biweeklyTotal += expense.amount;
        }
      }
      
      // Mensual
      if (expenseDate.getMonth() === today.getMonth()) {
        monthlyTotal += expense.amount;
      }
    });

    // Encontrar el día con mayor gasto
    Object.entries(dailyData).forEach(([date, amount]) => {
      if (amount > highestDay.amount) {
        highestDay = { date, amount };
      }
    });

    return { 
      dailyTotal, 
      weeklyTotal, 
      biweeklyTotal, 
      monthlyTotal, 
      currentWeek, 
      currentMonth, 
      isFirstQuincena,
      highestDay
    };
  };

  const { 
    dailyTotal, 
    weeklyTotal, 
    biweeklyTotal, 
    monthlyTotal, 
    currentWeek, 
    currentMonth, 
    isFirstQuincena,
    highestDay
  } = calculateTotals();

  // Datos para el gráfico de barras
  const chartData = [
    {
      name: 'Diario',
      value: dailyTotal,
      fill: '#f87171' // Rojo para gastos
    },
    {
      name: 'Semanal',
      value: weeklyTotal,
      fill: '#fb923c' // Naranja
    },
    {
      name: 'Quincenal',
      value: biweeklyTotal,
      fill: '#fbbf24' // Amarillo
    },
    {
      name: 'Mensual',
      value: monthlyTotal,
      fill: '#f43f5e' // Rosa
    }
  ];

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard de Gastos</h2>
      
      {/* Tarjetas de resumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
          <h3 className="font-semibold text-gray-600">Hoy</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(dailyTotal)}</p>
          <p className="text-sm text-gray-500">{formatDate(new Date())}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <h3 className="font-semibold text-gray-600">Esta Semana</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(weeklyTotal)}</p>
          <p className="text-sm text-gray-500">Semana {currentWeek}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-amber-500">
          <h3 className="font-semibold text-gray-600">Quincena Actual</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(biweeklyTotal)}</p>
          <p className="text-sm text-gray-500">
            {currentMonth} {isFirstQuincena ? '(1-15)' : '(16-final)'}
          </p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-rose-500">
          <h3 className="font-semibold text-gray-600">Mes Actual</h3>
          <p className="text-2xl font-bold">{formatAmountToCRC(monthlyTotal)}</p>
          <p className="text-sm text-gray-500">{currentMonth}</p>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white p-4 rounded-lg shadow mb-8">
        <h3 className="text-lg font-semibold mb-4">Resumen por Periodos</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip 
              formatter={(value) => [`${formatAmountToCRC(Number(value))}`, "Gastos"]}
              labelFormatter={(name) => `Periodo: ${name}`}
            />
            <Legend />
            <Bar dataKey="value" name="Gastos">
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Estadísticas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Día con más gastos</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">{highestDay.date || 'No hay datos'}</span>
            <span className="text-red-600 font-bold">
              {highestDay.date ? `${formatAmountToCRC(highestDay.amount)}` : ''}
            </span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="font-semibold mb-2">Promedio diario</h3>
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Este mes</span>
            <span className="font-bold">
              {formatAmountToCRC(monthlyTotal / new Date().getDate())}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExpenseDashboard;