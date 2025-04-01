import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { formatAmountToCRC } from "../shared/utils/format";
import { EconomicExpense } from "../shared/types";

interface MiniExpenseChartProps {
  economicExpenses: EconomicExpense[];
}

const MiniExpenseChart: React.FC<MiniExpenseChartProps> = ({ economicExpenses }) => {
  // Cálculo de totales
  const calculateTotals = () => {
    let dailyTotal = 0, weeklyTotal = 0, biweeklyTotal = 0, monthlyTotal = 0;
    
    economicExpenses.forEach(expense => {
      const expenseDate = new Date(expense.registrationDate);
      const today = new Date();
      
      // Diario
      if (expenseDate.toDateString() === today.toDateString()) {
        dailyTotal += expense.amount;
      }
      
      // Semanal
      if (expenseDate >= new Date(today.setDate(today.getDate() - 7))) {
        weeklyTotal += expense.amount;
      }
      
      // Quincenal
      if (expenseDate.getMonth() === today.getMonth() && expenseDate.getDate() <= 15) {
        biweeklyTotal += expense.amount;
      }
      
      // Mensual
      if (expenseDate.getMonth() === today.getMonth()) {
        monthlyTotal += expense.amount;
      }
    });

    return { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal };
  };

  const { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal } = calculateTotals();

  // Datos para el gráfico de barras
  const chartData = [
    { name: "Diario", value: dailyTotal, fill: "#e63946" },
    { name: "Semanal", value: weeklyTotal, fill: "#f4a261" },
    { name: "Quincenal", value: biweeklyTotal, fill: "#2a9d8f" },
    { name: "Mensual", value: monthlyTotal, fill: "#264653" },
  ];

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${formatAmountToCRC(Number(value))}`, "Gastos"]} />
          <Bar dataKey="value" name="Gastos">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniExpenseChart;
