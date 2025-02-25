import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { ProductInventory, ProductInventoryDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useProductInventoryStore from "./Store"
import { useNavigate } from "react-router"

export const useProductInventory = () => {
    const navigate = useNavigate()
    const { fetchProductsInventory, deleteProductInventory, updateProductInventory, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useProductInventoryStore()

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

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore
    }
}
