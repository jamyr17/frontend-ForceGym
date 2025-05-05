import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { EconomicExpense, EconomicExpenseDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useEconomicExpenseStore from "./Store"
import { useNavigate } from "react-router"
import { formatAmountToCRC, formatDate } from "../shared/utils/format"

export const useEconomicExpense = () => {
    const navigate = useNavigate()
    const { economicExpenses, fetchEconomicExpenses,deleteEconomicExpense, updateEconomicExpense, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useEconomicExpenseStore()

    const handleDelete = async ({ idEconomicExpense, voucherNumber } : EconomicExpense) => {
        await Swal.fire({
            title: '¿Desea eliminar este gasto económico?',
            text: `Está eliminando el gasto con comprobante N° ${voucherNumber}`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loggedUser = getAuthUser()
                const response = await deleteEconomicExpense(idEconomicExpense, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Gasto eliminado',
                        text: `Se ha eliminado el gasto con comprobante N° ${voucherNumber}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchEconomicExpenses()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleSearch = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const { searchTerm } = Object.fromEntries(new FormData(form))
        changeSearchTerm(searchTerm.toString())
    }

    const handleOrderByChange = (orderByTerm : string) => {
        changeOrderBy(orderByTerm)
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC')
    }

    const handleRestore = async (economicExpense: EconomicExpenseDataForm) => {
        const loggedUser = getAuthUser()
        const reqEconomicExpense = {
            ...economicExpense, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar este gasto económico?',
            text: `Está restaurando el gasto con comprobante N° ${economicExpense.voucherNumber}`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Restaurar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateEconomicExpense(reqEconomicExpense)

                if(response.ok){
                    Swal.fire({
                        title: 'Gasto restaurado',
                        text: `Se ha restaurado el gasto con comprobante N° ${economicExpense.voucherNumber}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchEconomicExpenses()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const pdfTableHeaders = ["#", "Voucher", "Fecha", "Monto", "Método de Pago", "Categoría","Detalle"];
    const pdfTableRows = economicExpenses.map((expense, index) => [
        index + 1,
        expense.voucherNumber || "No adjunto",
        formatDate(new Date(expense.registrationDate)),
        formatAmountToCRC(expense.amount), 
        expense.meanOfPayment.name,
        expense.category.name,
        expense.detail ? expense.detail : 'Sin detalle'
    ]);

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore,
        pdfTableHeaders,
        pdfTableRows
    }
}
