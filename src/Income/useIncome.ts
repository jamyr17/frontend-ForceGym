import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { EconomicIncome, EconomicIncomeDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useEconomicIncomeStore from "./Store"
import { useNavigate } from "react-router"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { formatAmountToCRC, formatDate } from "../shared/utils/format"

export const useEconomicIncome = () => {
    const navigate = useNavigate()
    const { economicIncomes, fetchEconomicIncomes, deleteEconomicIncome, updateEconomicIncome, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useEconomicIncomeStore()

    const handleDelete = async ({ idEconomicIncome, voucherNumber } : EconomicIncome) => {
        await Swal.fire({
            title: '¿Desea eliminar este ingreso económico?',
            text: `Está eliminando el ingreso con comprobante N° ${voucherNumber}`,
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
                const response = await deleteEconomicIncome(idEconomicIncome, loggedUser?.idUser)

                if(response.ok){
                    Swal.fire({
                        title: 'Ingreso eliminado',
                        text: `Se ha eliminado el ingreso con comprobante N° ${voucherNumber}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchEconomicIncomes()
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

    const handleRestore = async (economicIncome: EconomicIncomeDataForm) => {
        const loggedUser = getAuthUser()
        const reqEconomicIncome = {
            ...economicIncome, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar este ingreso económico?',
            text: `Está restaurando el ingreso con comprobante N° ${economicIncome.voucherNumber}`,
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
                const response = await updateEconomicIncome(reqEconomicIncome)

                if(response.ok){
                    Swal.fire({
                        title: 'Ingreso restaurado',
                        text: `Se ha restaurado el ingreso con comprobante N° ${economicIncome.voucherNumber}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchEconomicIncomes()
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
        doc.text("Reporte de Ingresos Económicos", 14, 10);
    
        const tableColumn = ["#", "Voucher", "Cliente", "Fecha", "Monto", "Método de Pago", "Tipo de actividad","Detalle"];
        
        const tableRows = economicIncomes.map((income, index) => [
            index + 1,
            income.voucherNumber !== '' ? income.voucherNumber : "No adjunto",
            `${income.client.person.name} ${income.client.person.firstLastName} ${income.client.person.secondLastName}`,
            formatDate(new Date(income.registrationDate)),
            formatAmountToCRC(income.amount),  // Aquí formateas con ₡
            income.meanOfPayment.name,
            income.activityType.name,  // Tipo de actividad
            income.detail ? income.detail : 'Sin detalle' // Detalle del ingreso
        ]);
    
         autoTable(doc, { 
             head: [tableColumn],
             body: tableRows,
             startY: 20,
         });

        doc.save("ingresos.pdf");
    };

    const exportToExcel = () => {
        // Encabezados de la tabla
        const tableColumn = ["#", "Voucher", "Cliente", "Fecha", "Monto", "Método de Pago","Tipo de actividad","Detalle"];
    
        // Mapeo de los datos
        const tableRows = economicIncomes.map((income, index) => [
            index + 1,
            income.voucherNumber !== '' ? income.voucherNumber : "No adjunto",
            `${income.client.person.name} ${income.client.person.firstLastName} ${income.client.person.secondLastName}`,
            formatDate(new Date(income.registrationDate)),
            formatAmountToCRC(income.amount), 
            income.meanOfPayment.name,
            income.activityType.name, 
            income.detail ? income.detail : 'Sin detalle' // Detalle del ingreso
        ]);
    
        // Crear worksheet y workbook
        const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Ingresos Económicos");
    
        // Descargar
        XLSX.writeFile(wb, "ingresos.xlsx");
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
