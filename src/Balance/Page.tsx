import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEconomicBalanceStore } from './Store';
import { formatAmountToCRC } from "../shared/utils/format";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { FilterButton, FilterSelect } from "./Filter";
import ModalFilter from "../shared/components/ModalFilter";

function EconomicBalanceDashboard() {
    const {
        economicExpenses,
        economicIncomes,
        modalFilter,
        filterByStatus,
        filterByAmountRangeMin,
        filterByAmountRangeMax,
        filterByDateRangeMin,
        filterByDateRangeMax,
        filterByMeanOfPayment,
        fetchEconomicExpenses,
        fetchEconomicIncomes,
        closeModalFilter
    } = useEconomicBalanceStore();

    const navigate = useNavigate();

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
    }, [filterByStatus, filterByAmountRangeMin, filterByAmountRangeMax, 
        filterByDateRangeMin, filterByDateRangeMax, filterByMeanOfPayment]);

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
        economicIncomes.forEach(income => {
            const date = new Date(income.registrationDate);
            const monthIndex = date.getMonth();
            monthlyData[monthIndex].income += income.amount;
            monthlyData[monthIndex].balance += income.amount;
        });

        // Process expenses
        economicExpenses.forEach(expense => {
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
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">BALANCE</h1>
                <ModalFilter modalFilter={modalFilter} closeModalFilter={closeModalFilter} FilterButton={FilterButton} FilterSelect={FilterSelect} />
            </header>

            {/* Contenedor principal */}
            <div className="grid grid-cols-1 gap-6 p-6">
                {/* Balance Mensual */}
                <div className="bg-white p-1 rounded-lg mx-auto w-full max-w-4xl">
                    <h2 className="text-lg font-semibold text-center mb-4">Balance Mensual</h2>
                    <ResponsiveContainer width="100%" height={230}>
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
                            <Bar 
                                dataKey="balance" 
                                name="Balance" 
                                fill="#8a2be2" // Morado
                                radius={[4, 4, 0, 0]}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Ingresos y Gastos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full max-w-6xl">
                    {/* Ingresos */}
                    <div className="bg-white p-1 rounded-lg">
                        <h2 className="text-lg font-semibold text-center mb-4">Ingresos</h2>
                        <ResponsiveContainer width="100%" height={230}>
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
                                <Bar 
                                    dataKey="income" 
                                    name="Ingresos" 
                                    fill="#4CAF50" // Verde
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Gastos */}
                    <div className="bg-white p-1 rounded-lg">
                        <h2 className="text-lg font-semibold text-center mb-4">Gastos</h2>
                        <ResponsiveContainer width="100%" height={230}>
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
    );
}

export default EconomicBalanceDashboard;