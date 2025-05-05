import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { ClientType, ClientTypeDataForm } from "../shared/types"
import useClientTypeStore from "./Store"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import { useNavigate } from "react-router"

export const useClientType = () => {
    const navigate = useNavigate()
    const { 
        fetchClientTypes, 
        directionOrderBy, 
        deleteClientType, 
        updateClientType, 
        changeSearchTerm, 
        changeOrderBy, 
        changeDirectionOrderBy 
    } = useClientTypeStore()

    const handleDelete = async ({ idClientType, name } : ClientType) => {
        await Swal.fire({
            title: '¿Desea eliminar el tipo de cliente?',
            text: `Estaría eliminando "${name}"`,
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
                const response = await deleteClientType(idClientType, loggedUser?.idUser as number)
                if(response.ok){
                    Swal.fire({
                        title: 'Tipo de cliente eliminado',
                        text: `Ha eliminado "${name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchClientTypes()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const { searchTerm } = Object.fromEntries(new FormData(form))
        changeSearchTerm(searchTerm.toString())
    }

    const handleOrderByChange = (orderByTerm: string) => {
        changeOrderBy(orderByTerm)
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC')
    }

    const handleRestore = async (clientType: ClientTypeDataForm) => {
        const loggedUser = getAuthUser()
        const reqClientType = {
            ...clientType, 
            isDeleted: 0,
            paramloggedIdUser: loggedUser?.idUser
        }
            
        await Swal.fire({
            title: '¿Desea restaurar el tipo de cliente?',
            text: `Estaría restaurando "${clientType.name}"`,
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
                const response = await updateClientType(reqClientType)

                if(response.ok){
                    Swal.fire({
                        title: 'Tipo de cliente restaurado',
                        text: `Ha restaurado "${clientType.name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchClientTypes()
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