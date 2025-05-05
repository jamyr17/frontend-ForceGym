import Swal from 'sweetalert2'
import { ExerciseCategory } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useExerciseCategoryStore from "./Store"
import { useNavigate } from "react-router"

export const useExerciseCategory = () => {
    const navigate = useNavigate()
    const { fetchExerciseCategories, deleteExerciseCategory, updateExerciseCategory } = useExerciseCategoryStore()

    const handleDelete = async ({ idExerciseCategory, name } : ExerciseCategory) => {
        await Swal.fire({
            title: '¿Desea eliminar esta categoría?',
            text: `Está eliminando la categoría ${name}`,
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
                const response = await deleteExerciseCategory(idExerciseCategory, loggedUser?.idUser)

                if(response.ok){
                    Swal.fire({
                        title: 'Categoría eliminada',
                        text: `Se ha eliminado la categoría ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchExerciseCategories()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleRestore = async (category: ExerciseCategory) => {
            const loggedUser = getAuthUser();
            const reqExercise = {
                ...category,
                isDeleted: 0,
                paramLoggedIdUser: loggedUser?.idUser
            };
    
            await Swal.fire({
                title: '¿Desea restaurar esta categoría?',
                text: `Está restaurando la categoría ${category.name}`,
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
                    const response = await updateExerciseCategory(reqExercise);
    
                    if (response.ok) {
                        Swal.fire({
                            title: 'Categoría restaurada',
                            text: `Se ha restaurado la categoría ${category.name}`,
                            icon: 'success',
                            confirmButtonText: 'OK',
                            timer: 3000,
                            timerProgressBar: true,
                            width: 500,
                            confirmButtonColor: '#CFAD04'
                        });
    
                        fetchExerciseCategories();
                    }
    
                    if (response.logout) {
                        setAuthHeader(null);
                        setAuthUser(null);
                        navigate('/login', { replace: true });
                    }
                }
            });
        };

    return {
        handleDelete,
        handleRestore
    }
}
