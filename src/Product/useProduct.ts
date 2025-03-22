import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { ProductInventory, ProductInventoryDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useProductInventoryStore from "./Store"
import { useNavigate } from "react-router"
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
import { formatAmountToCRC } from "../shared/utils/format"

export const useProductInventory = () => {
    const navigate = useNavigate()
    const { productsInventory, fetchProductsInventory, deleteProductInventory, updateProductInventory, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useProductInventoryStore()

    const handleDelete = async ({ idProductInventory, name } : ProductInventory) => {
        await Swal.fire({
            title: '¿Desea eliminar este producto?',
            text: `Está eliminando el producto ${name}`,
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
                const response = await deleteProductInventory(idProductInventory, loggedUser?.idUser)

                if(response.ok){
                    Swal.fire({
                        title: 'Producto eliminado',
                        text: `Se ha eliminado el producto ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchProductsInventory()
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

    const handleRestore = async (productInventory: ProductInventoryDataForm) => {
        const loggedUser = getAuthUser()
        const reqProductInventory = {
            ...productInventory, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar este producto?',
            text: `Está restaurando el producto ${productInventory.name}`,
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
                const response = await updateProductInventory(reqProductInventory)

                if(response.ok){
                    Swal.fire({
                        title: 'Producto restaurado',
                        text: `Se ha restaurado el producto ${productInventory.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchProductsInventory()
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
        doc.text("Inventario de Productos", 14, 10);
    
        const tableColumn = ["#", "CÓDIGO", "NOMBRE", "CANTIDAD", "COSTO"];
        const tableRows = productsInventory.map((product, index) => [
            index + 1,
            product.code,
            product.name,
            product.quantity,
            formatAmountToCRC(product.cost),
        ]);
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });
    
    
        doc.save("Inventario.pdf");
    };
    
    const exportToExcel = () => {
        // Encabezados de la tabla
        const tableColumn = ["#", "Código", "Nombre", "Cantidad", "Costo"];
    
        // Mapeo de los datos
        const tableRows = productsInventory.map((product, index) => [
            index + 1,
            product.code,
            product.name,
            product.quantity,
            product.cost 
        ]);
    
        // Crear worksheet y workbook
        const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Productos Inventario");
    
        // Descargar
        XLSX.writeFile(wb, "Inventario_Productos.xlsx");
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
