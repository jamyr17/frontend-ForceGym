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

function PrivateRoutes () {
    // fetchear los datos comunes: roles, tipos de pago, etc. para solo hacerlo 1 vez
    const { fetchRoles, fetchMeansOfPayment, fetchActivityTypes, fetchGenders, fetchTypesClient, fetchCategories, fetchNotificationTypes } = useCommonDataStore()
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
                <ProtectedRoute allowedRoles={['Administrador']}>
                <EconomicIncomeManagement/>
                </ProtectedRoute>
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
                <ProtectedRoute allowedRoles={['Administrador']}>
                <EconomicBalanceDashboard/>
                </ProtectedRoute>
                }
            />

            <Route 
                path="activos" 
                element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                <AssetManagement/>
                </ProtectedRoute>
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
        </Routes>
        </>
    );
}

export default PrivateRoutes;