import { Routes, Route, useNavigate } from "react-router";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import UserManagement from "../User/Page";
import EconomicIncomeManagement from "../Income/Page";
import EconomicExpenseManagement from "../Expense/Page";
import ProductInventoryManagement from "../Product/Page";
import { useCommonDataStore } from "../shared/CommonDataStore";
import AsideBar from "../shared/components/AsideBar";
import ClientManagement from "../Client/Page";
import NotificationTemplateManagement from "../TemplateNotification/Page";

function PrivateRoutes () {
    // fetchear los datos comunes: roles, tipos de pago, etc. para solo hacerlo 1 vez
    const { fetchRoles, fetchMeansOfPayment, fetchActivityTypes, fetchGenders, fetchTypesClient, fetchCategories } = useCommonDataStore()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
            const resultRoles = await fetchRoles()
            const resultMeansOfPayment = await fetchMeansOfPayment()
            const resultActivityTypes = await fetchActivityTypes()
            const resultGenders = await fetchGenders()
            const resultTypesClient = await fetchTypesClient()
            const resultCategories = await fetchCategories()

            if(resultRoles.logout || resultMeansOfPayment.logout || resultActivityTypes.logout || resultGenders.logout || resultTypesClient.logout || resultCategories.logout){
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
                path="usuarios" 
                element={
                    <UserManagement/>
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
                    <EconomicExpenseManagement/>
                }
            />
            <Route 
                path="inventario" 
                element={
                    <ProductInventoryManagement/>
                }
            />
            <Route 
                path="clientes" 
                element={
                    <ClientManagement/>
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