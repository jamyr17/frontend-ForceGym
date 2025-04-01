import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";
import { formatAmountToCRC } from "../shared/utils/format";
import { EconomicIncome } from "../shared/types";

interface MiniIncomeChartProps {
  economicIncomes: EconomicIncome[];
}

const MiniIncomeChart: React.FC<MiniIncomeChartProps> = ({ economicIncomes }) => {
  // Cálculo de totales
  const calculateTotals = () => {
    let dailyTotal = 0, weeklyTotal = 0, biweeklyTotal = 0, monthlyTotal = 0;
    
    economicIncomes.forEach(income => {
      const incomeDate = new Date(income.registrationDate);
      const today = new Date();
      
      // Diario
      if (incomeDate.toDateString() === today.toDateString()) {
        dailyTotal += income.amount;
      }
      
      // Semanal
      if (incomeDate >= new Date(today.setDate(today.getDate() - 7))) {
        weeklyTotal += income.amount;
      }
      
      // Quincenal
      if (incomeDate.getMonth() === today.getMonth() && incomeDate.getDate() <= 15) {
        biweeklyTotal += income.amount;
      }
      
      // Mensual
      if (incomeDate.getMonth() === today.getMonth()) {
        monthlyTotal += income.amount;
      }
    });

    return { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal };
  };

  const { dailyTotal, weeklyTotal, biweeklyTotal, monthlyTotal } = calculateTotals();

  // Datos para el gráfico de barras
  const chartData = [
    { name: "Diario", value: dailyTotal, fill: "#8884d8" },
    { name: "Semanal", value: weeklyTotal, fill: "#82ca9d" },
    { name: "Quincenal", value: biweeklyTotal, fill: "#ffc658" },
    { name: "Mensual", value: monthlyTotal, fill: "#ff8042" },
  ];

  return (
    <div className="h-36">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip formatter={(value) => [`${formatAmountToCRC(Number(value))}`, "Ingresos"]} />
          <Bar dataKey="value" name="Ingresos">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MiniIncomeChart;
