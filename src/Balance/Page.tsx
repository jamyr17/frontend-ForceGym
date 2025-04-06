import { useEffect, useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useEconomicStore } from "./Store";

const EconomicCharts = () => {
  const { incomes, expenses, fetchIncomes, fetchExpenses } = useEconomicStore();

  useEffect(() => {
    fetchIncomes();
    fetchExpenses();
  }, [fetchIncomes, fetchExpenses]);

  const aggregatedData = useMemo(() => {
    const monthlyData: Record<string, { month: string; incomes: number; expenses: number }> = {};
    
    incomes.forEach(({ registrationDate, amount }) => {
      const month = new Date(registrationDate).toLocaleString("default", { month: "short" });
      if (!monthlyData[month]) monthlyData[month] = { month, incomes: 0, expenses: 0 };
      monthlyData[month].incomes += amount;
    });

    expenses.forEach(({ registrationDate, amount }) => {
      const month = new Date(registrationDate).toLocaleString("default", { month: "short" });
      if (!monthlyData[month]) monthlyData[month] = { month, incomes: 0, expenses: 0 };
      monthlyData[month].expenses += amount;
    });

    return Object.values(monthlyData);
  }, [incomes, expenses]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Gastos por Mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="expenses" fill="#f56565" name="Gastos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Ingresos por Mes</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="incomes" fill="#48bb78" name="Ingresos" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-xl font-bold mb-4">Balance Económico</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={aggregatedData.map(d => ({ ...d, balance: d.incomes - d.expenses }))}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="balance" fill="#4299e1" name="Balance" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EconomicCharts;
