import Swal from 'sweetalert2'
import { ActivityType } from "../shared/types"
import useActivityTypeStore from "./Store"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import { useNavigate } from "react-router"

export const useActivityType = () => {
    const navigate = useNavigate()
    const { 
        fetchActivityTypes, 
        deleteActivityType, 
        updateActivityType, 
    } = useActivityTypeStore()

    const handleDelete = async ({ idActivityType, name }: ActivityType) => {
        const result = await Swal.fire({
            title: '¿Desea eliminar el tipo de actividad?',
            text: `Estaría eliminando "${name}"`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        });

        if (result.isConfirmed) {
            const loggedUser = getAuthUser();
            if (!loggedUser?.idUser) {
                console.error("No user ID available");
                return;
            }

            try {
                const response = await deleteActivityType(
                    idActivityType, 
                    loggedUser.idUser
                );

                if (response?.ok) {
                    // Espera a que se complete la recarga
                    await fetchActivityTypes();
                    
                    await Swal.fire({
                        title: 'Tipo de actividad eliminada',
                        text: `Ha eliminado "${name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });
                }
            } catch (error) {
                await Swal.fire({
                    title: 'Error',
                    text: 'No se pudo eliminar el tipo de actividad',
                    icon: 'error',
                    confirmButtonColor: '#CFAD04'
                });
            }
        }
    };

    const handleRestore = async (activityType: ActivityType) => {
        const loggedUser = getAuthUser()
        const reqActivityType = {
            ...activityType, 
            isDeleted: 0,
            paramloggedIdUser: loggedUser?.idUser
        }
            
        await Swal.fire({
            title: '¿Desea restaurar el tipo de actividad?',
            text: `Estaría restaurando "${activityType.name}"`,
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
                const response = await updateActivityType(reqActivityType)

                if(response.ok){
                    Swal.fire({
                        title: 'Tipo de actividad restaurada',
                        text: `Ha restaurado "${activityType.name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchActivityTypes()
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
        handleRestore
    }
}