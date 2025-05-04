import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import DashboardManagement from "../Dashboard/Page";
import UserManagement from "../User/Page";
import EconomicIncomeManagement from "../Income/Page";
import EconomicExpenseManagement from "../Expense/Page";
import AssetManagement from "../Asset/Page";
import { useCommonDataStore } from "../shared/CommonDataStore";
import AsideBar from "../shared/components/AsideBar";
import ClientManagement from "../Client/Page";
import NotificationTemplateManagement from "../TemplateNotification/Page";
import MeasurementManagement from "../Measurement/Page";
import { ProtectedRoute } from "./ProtectedRoutes";
import EconomicBalanceDashboard from "../Balance/Page";
import CategoryManagement from "../Category/Page";
import ClientTypeManagement from "../ClientType/Page";
import ExerciseManagement from "../Exercise/Page";
import ActivityTypeManagement from "../ActivityType/Page";
import LandingPage from "../LandingPage/page";
import RoutineManagement from "../Routine/Page";
import ClientRoutineManagement from "../Client/Page";

function PrivateRoutes () {
    const { fetchRoles, fetchMeansOfPayment, fetchActivityTypes, fetchGenders, fetchTypesClient, fetchCategories, fetchNotificationTypes, fetchExerciseDifficulty, fetchDifficultyRoutines, fetchExercise } = useCommonDataStore()

    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async () => {
            // Lista de funciones a ejecutar en orden
            const fetchFunctions = [
                fetchRoles,
                fetchMeansOfPayment,
                fetchActivityTypes,
                fetchGenders,
                fetchTypesClient,
                fetchCategories,
                fetchNotificationTypes,
                fetchDifficultyRoutines,
                fetchExercise,
                fetchExerciseDifficulty,
                fetchNotificationTypes
            ];
    
            // Ejecutar cada función secuencialmente y validar
            for (const fetchFn of fetchFunctions) {
                const result = await fetchFn();
                if (result.logout) {
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate('/login', { replace: true });
                    return; // Salir del bucle y la función si hay logout
                }
            }
        };
    
        fetchData();
    }, []);

    return (
        <>
        <AsideBar />
        <Routes>
            <Route 
                path="dashboard" 
                element={
                    <DashboardManagement/>
                }
            />

            <Route 
                path="usuarios" 
                element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                <UserManagement/>
                </ProtectedRoute>
                }
            />
            <Route 
                path="ingresos" 
                element={
                <EconomicIncomeManagement/>
                }
            />
            <Route 
                path="gastos" 
                element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                <EconomicExpenseManagement/>
                </ProtectedRoute>
                }
            />
             <Route 
                path="balance" 
                element={              
                <EconomicBalanceDashboard/>
                }
            />

            <Route 
                path="activos" 
                element={
                    <AssetManagement/>
                }
            />
            <Route 
                path="clientes" 
                element={
                    <ClientManagement/>
                }
            />
              <Route 
                path="tipos-cliente" 
                element={
                    <ClientTypeManagement/>
                }
            />
            <Route 
                path="medidas" 
                element={
                    <MeasurementManagement/>
                }
            />
            <Route 
                path="plantillas-notificacion" 
                element={
                    <NotificationTemplateManagement/>
                }
            />
            <Route 
                path="categorias" 
                element={
                    <CategoryManagement/>
                }
            />
            <Route 
                path="ejercicios" 
                element={
                    <ExerciseManagement/>
                }
            />
            <Route 
                path="tipos-actividad" 
                element={
                    <ActivityTypeManagement/>
                }
            />
            <Route 
                path="rutinas" 
                element={
                    <RoutineManagement/>
                }
            />

        </Routes>
        </>
    );
}

export default PrivateRoutes;