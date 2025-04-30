import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { Asset, AssetDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useAssetStore from "./Store"
import { useNavigate } from "react-router"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { formatAmountToCRC } from "../shared/utils/format"

export const useAsset = () => {
    const navigate = useNavigate()
    const { assets, fetchAssets, deleteAsset, updateAsset, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useAssetStore()

    const handleDelete = async ({ idAsset, name } : Asset) => {
        await Swal.fire({
            title: '¿Desea eliminar este activo?',
            text: `Está eliminando el activo ${name}`,
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
                const response = await deleteAsset(idAsset, loggedUser?.idUser)

                if(response.ok){
                    Swal.fire({
                        title: 'Activo eliminado',
                        text: `Se ha eliminado el activo ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchAssets()
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

    const handleRestore = async (asset: AssetDataForm) => {
        const loggedUser = getAuthUser()
        const reqAsset = {
            ...asset, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar este activo?',
            text: `Está restaurando el activo ${asset.name}`,
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
                const response = await updateAsset(reqAsset)

                if(response.ok){
                    Swal.fire({
                        title: 'Activo restaurado',
                        text: `Se ha restaurado el activo ${asset.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchAssets()
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
        doc.text("Registro de Activos", 14, 10);
    
        const tableColumn = ["#", "Código", "Nombre", "Cantidad", "Costo"];
        const tableRows = assets.map((asset, index) => [
            index + 1,
            asset.code,
            asset.name,
            asset.quantity,
            formatAmountToCRC(asset.initialCost),
        ]);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
    
    
        doc.save("Activos.pdf");
    };
    
    const exportToExcel = () => {
        // Encabezados de la tabla
        const tableColumn = ["#", "Código", "Nombre", "Cantidad", "Costo"];
    
        // Mapeo de los datos
        const tableRows = assets.map((asset, index) => [
            index + 1,
            asset.code,
            asset.name,
            asset.quantity,
            formatAmountToCRC(asset.initialCost)
        ]);
    
        // Crear worksheet y workbook
        const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Activos");
    
        // Descargar
        XLSX.writeFile(wb, "Activos.xlsx");
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
