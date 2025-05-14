import { useEffect } from "react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useEconomicBalanceStore } from './Store';
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

    // Función para formatear los valores del eje Y con ₡ pegado al monto
    const formatYAxis = (value: number) => {
        const amount = value.toLocaleString('es-CR');
        return `₡${amount}`;
    };

    return (
        <div className="bg-black min-h-screen text-gray-800 pl-0 md:pl-12 transition-all duration-300">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">BALANCE</h1>
                <ModalFilter modalFilter={modalFilter} closeModalFilter={closeModalFilter} FilterButton={FilterButton} FilterSelect={FilterSelect} />
            </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 gap-6 px-4 sm:px-6 lg:px-20">
            <div className="grid grid-cols-1 gap-6 p-6">
                {/* Gráfico Principal: Balance */}
                <div className="bg-white p-6 rounded-lg shadow-md mx-auto w-full max-w-4xl">
                <h2 className="text-lg font-semibold text-center mb-4">Balance Mensual</h2>
                <div className="w-full h-40 sm:h-48 lg:h-52">
                    <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 20, right: 30, left: 30, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fill: "#444", fontSize: 12 }} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fill: "#444", fontSize: 12 }} width={90} />
                        <Tooltip
                        formatter={(value: number) => [`₡${value.toLocaleString("es-CR")}`, "Monto"]}
                        labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />
                        <Bar dataKey="balance" name="Balance" fill="#6B46C1" radius={[4, 4, 0, 0]} />
                    </BarChart>
                    </ResponsiveContainer>
                </div>
                </div>

                {/* Gráficos de Ingresos y Gastos */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mx-auto w-full max-w-6xl">
                {/* Ingresos */}
                <div className="bg-white p-6 rounded-lg shadow-md">
                    <h2 className="text-lg font-semibold text-center mb-4">Ingresos</h2>
                    <div className="w-full h-32 sm:h-45">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="name" tick={{ fill: "#444", fontSize: 11 }} />
                        <YAxis tickFormatter={formatYAxis} tick={{ fill: "#444", fontSize: 11 }} width={80} />
                        <Tooltip
                            formatter={(value: number) => [`₡${value.toLocaleString("es-CR")}`, "Monto"]}
                            labelFormatter={(label) => `Mes: ${label}`}
                        />
                        <Legend wrapperStyle={{ paddingTop: "10px" }} />
                        <Bar dataKey="income" name="Ingresos" fill="#48BB78" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                    </div>
                </div>
                    {/* Gastos */}
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-lg font-semibold text-center mb-4">Gastos</h2>
                        <div className="w-full h-32 sm:h-45">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 20, left: 20, bottom: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" tick={{ fill: "#444", fontSize: 11 }} />
                            <YAxis tickFormatter={formatYAxis} tick={{ fill: "#666", fontSize: 11 }} width={80} />
                            <Tooltip
                                formatter={(value: number) => [`₡${value.toLocaleString("es-CR")}`, "Monto"]}
                                labelFormatter={(label) => `Mes: ${label}`}
                            />
                            <Legend wrapperStyle={{ paddingTop: "10px" }} />
                            <Bar dataKey="expense" name="Gastos" fill="#FFD700" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
      </main>
        </div>
    );
}

export default EconomicBalanceDashboard;