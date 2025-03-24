import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { EconomicExpense, EconomicExpenseDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useEconomicExpenseStore from "./Store"
import { useNavigate } from "react-router"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { formatAmountToCRC, formatDate } from "../shared/utils/format"

export const useEconomicExpense = () => {
    const navigate = useNavigate()
    const { economicExpenses, fetchEconomicExpenses, deleteEconomicExpense, updateEconomicExpense, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useEconomicExpenseStore()

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
                const response = await deleteEconomicExpense(idEconomicExpense, loggedUser?.idUser)

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

    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica");
        doc.text("Reporte de Gastos", 14, 10);

        const tableColumn = ["#", "Voucher", "Fecha", "Monto", "Método de Pago", "Categoría","Detalle"];
        const tableRows = economicExpenses.map((expense, index) => [
            index + 1,
            expense.voucherNumber || "No adjunto",
            formatDate(new Date(expense.registrationDate)),
            formatAmountToCRC(expense.amount), 
            expense.meanOfPayment.name,
            expense.category.name,
            expense.detail ? expense.detail : 'Sin detalle' // Detalle del ingreso
        ]);
        autoTable(doc, { 
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("gastos.pdf");
    };

    const exportToExcel = () => {
        // Encabezados de la tabla
        const tableColumn = ["#", "Voucher", "Fecha", "Monto", "Método de Pago", "Categoría","Detalle"];

        // Mapeo de los datos
        const tableRows = economicExpenses.map((expense, index) => [
            index + 1,
            expense.voucherNumber !== '' ? expense.voucherNumber : "No adjunto",
            formatDate(new Date(expense.registrationDate)),
            expense.amount, 
            expense.meanOfPayment.name,
            expense.category.name,
            expense.detail ? expense.detail : 'Sin detalle' // Detalle del ingreso
        ]);

        // Crear worksheet y workbook
        const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Gastos Económicos");

        // Descargar
        XLSX.writeFile(wb, "gastos.xlsx");
    };

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore,
        exportToPDF,
        exportToExcel
    }
}
