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

function PrivateRoutes () {
    // fetchear los datos comunes: roles, tipos de pago, etc. para solo hacerlo 1 vez
    const { fetchRoles, fetchMeansOfPayment, fetchActivityTypes, fetchGenders, fetchTypesClient } = useCommonDataStore()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchData = async() => {
            const resultRoles = await fetchRoles()
            const resultMeansOfPayment = await fetchMeansOfPayment()
            const resultActivityTypes = await fetchActivityTypes()
            const resultGenders = await fetchGenders()
            const resultTypesClient = await fetchTypesClient()

            if(resultRoles.logout || resultMeansOfPayment.logout || resultActivityTypes.logout || resultGenders.logout || resultTypesClient.logout){
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
        </Routes>
        </>
    );
}

export default PrivateRoutes;