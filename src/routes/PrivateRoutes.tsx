import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import DashboardManagement from "../Dashboard/Page";
import UserManagement from "../User/Page";
import EconomicIncomeManagement from "../Income/Page";
import EconomicExpenseManagement from "../Expense/Page";
import ProductInventoryManagement from "../Product/Page";
import { useCommonDataStore } from "../shared/CommonDataStore";
import AsideBar from "../shared/components/AsideBar";
import ClientManagement from "../Client/Page";
import NotificationTemplateManagement from "../TemplateNotification/Page";
import MeasurementManagement from "../Measurement/Page";
import { ProtectedRoute } from "./ProtectedRoutes";
import EconomicBalanceDashboard from "../Balance/Page";


function PrivateRoutes () {
    // fetchear los datos comunes: roles, tipos de pago, etc. para solo hacerlo 1 vez
    const { fetchRoles, fetchMeansOfPayment, fetchActivityTypes, fetchGenders, fetchTypesClient, fetchCategories, fetchNotificationTypes } = useCommonDataStore()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
            const resultRoles = await fetchRoles()
            const resultMeansOfPayment = await fetchMeansOfPayment()
            const resultActivityTypes = await fetchActivityTypes()
            const resultGenders = await fetchGenders()
            const resultTypesClient = await fetchTypesClient()
            const resultCategories = await fetchCategories()
            const resultNotificationTypes = await fetchNotificationTypes()

            if(resultRoles.logout || resultMeansOfPayment.logout || resultActivityTypes.logout || resultGenders.logout || resultTypesClient.logout || resultCategories.logout || resultNotificationTypes.logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }
        }

        fetchData()
    }, [])

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
                path="inventario" 
                element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                <ProductInventoryManagement/>
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
        </Routes>
        </>
    );
}

export default PrivateRoutes;