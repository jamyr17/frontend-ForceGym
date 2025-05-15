import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { User, UserDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useUserStore from "./Store"
import { useNavigate } from "react-router"

export const useUser = () => {
    const navigate = useNavigate()
    const { fetchUsers, directionOrderBy, deleteUser, updateUser, changeSearchTerm, changeOrderBy, changeDirectionOrderBy } = useUserStore()

    const handleDelete = async ({ idUser, username } : User) => {
            
        await Swal.fire({
            title: '¿Desea eliminar al usuario?',
            text: `Estaría eliminando a ${username}`,
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
                const response = await deleteUser(idUser, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Usuario eliminado',
                        text: `Ha eliminado al usuario ${username}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchUsers()
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

        if(directionOrderBy==='DESC'){
            changeDirectionOrderBy('ASC')
        }else{
            changeDirectionOrderBy('DESC')
        }

    }

    const handleRestore = async ( user  : UserDataForm) => {
        const loggedUser = getAuthUser()
        const reqUser = {
            ...user, 
            isDeleted: 0,
            gender: 'Masculino', 
            paramLoggedIdUser: loggedUser?.idUser
        }
            
        await Swal.fire({
            title: '¿Desea restaurar al usuario?',
            text: `Estaría restaurando a ${user.username}`,
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
                
                const response = await updateUser(reqUser)

                if(response.ok){
                    Swal.fire({
                        title: 'Usuario restaurado',
                        text: `Ha restaurado al usuario ${user.username}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchUsers()
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