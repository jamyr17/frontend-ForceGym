import { useEffect } from 'react';
import { useEconomicStore } from './Store';
import {
  BarChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  Area
} from 'recharts';

const EconomicChartsPage = () => {
  const { 
    incomes, 
    expenses, 
    fetchIncomes, 
    fetchExpenses,
    filters,
    setFilter
  } = useEconomicStore();

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
  }, [fetchIncomes, fetchExpenses]);

  // Procesar datos para los gráficos
  const processChartData = () => {
    const monthlyData: Record<string, { 
      name: string; 
      income: number; 
      expense: number;
      balance: number;
    }> = {};

    // Inicializar todos los meses
    const months = [
      'Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 
      'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'
    ];
    
    months.forEach(month => {
      monthlyData[month] = { 
        name: month, 
        income: 0, 
        expense: 0,
        balance: 0
      };
    });

    // Procesar ingresos
    incomes.forEach(income => {
      const date = new Date(income.registrationDate);
      const month = months[date.getMonth()];
      monthlyData[month].income += income.amount;
      monthlyData[month].balance += income.amount;
    });

    // Procesar gastos
    expenses.forEach(expense => {
      const date = new Date(expense.registrationDate);
      const month = months[date.getMonth()];
      monthlyData[month].expense += expense.amount;
      monthlyData[month].balance -= expense.amount;
    });

    return Object.values(monthlyData);
  };

  const chartData = processChartData();

  // Formateador para el tooltip
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS'
    }).format(value);
  };

  // Custom Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border rounded shadow-lg">
          <p className="font-bold">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`tooltip-${index}`} style={{ color: entry.color }}>
              {entry.name}: {formatCurrency(entry.value)}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Dashboard Económico</h1>
      
      {/* Filtros básicos */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h2 className="text-lg font-semibold mb-3">Filtros</h2>
        <div className="flex flex-wrap gap-4">
          <select 
            className="p-2 border rounded"
            value={filters.filterByStatus || ''}
            onChange={(e) => setFilter({ filterByStatus: e.target.value })}
          >
            <option value="">Todos los estados</option>
            <option value="Activos">Activos</option>
            <option value="Inactivos">Inactivos</option>
          </select>
          
          <input
            type="date"
            className="p-2 border rounded"
            value={filters.filterByDateRangeStart || ''}
            onChange={(e) => setFilter({ filterByDateRangeStart: e.target.value })}
            placeholder="Fecha inicio"
          />
          
          <input
            type="date"
            className="p-2 border rounded"
            value={filters.filterByDateRangeEnd || ''}
            onChange={(e) => setFilter({ filterByDateRangeEnd: e.target.value })}
            placeholder="Fecha fin"
          />
          
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => {
              fetchIncomes();
              fetchExpenses();
            }}
          >
            Aplicar Filtros
          </button>
        </div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Gráfico de Ingresos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Ingresos Mensuales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="income" 
                  name="Ingresos" 
                  fill="#4ade80" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Gráfico de Gastos */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Gastos Mensuales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis 
                  tickFormatter={(value) => formatCurrency(value)}
                  width={100}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar 
                  dataKey="expense" 
                  name="Gastos" 
                  fill="#f87171" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Gráfico de Balance */}
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Balance Económico</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis 
                tickFormatter={(value) => formatCurrency(value)}
                width={100}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar 
                dataKey="income" 
                name="Ingresos" 
                fill="#4ade80" 
                radius={[4, 4, 0, 0]}
              />
              <Bar 
                dataKey="expense" 
                name="Gastos" 
                fill="#f87171" 
                radius={[4, 4, 0, 0]}
              />
              <Line 
                type="monotone" 
                dataKey="balance" 
                name="Balance" 
                stroke="#60a5fa" 
                strokeWidth={2}
                dot={{ r: 4 }}
              />
              <Area 
                type="monotone" 
                dataKey="balance" 
                fill="#93c5fd" 
                fillOpacity={0.2} 
                stroke="none"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default EconomicChartsPage;