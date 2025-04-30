import Swal from 'sweetalert2';
import { Routine } from "../shared/types";
import { useRoutineStore } from "./Store";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";

export const useRoutine = () => {
    const navigate = useNavigate();
    const { 
        fetchRoutines, 
        deleteRoutine, 
        updateRoutine 
    } = useRoutineStore();

    const handleDelete = async ({ idRoutine, name }: Routine) => {
        await Swal.fire({
            title: '¿Desea eliminar la rutina?',
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
                const loggedUser = getAuthUser();
                if (!loggedUser?.idUser) {
                    console.error("No user ID available");
                    return;
                }
                
                const response = await deleteRoutine(idRoutine, loggedUser.idUser);
                
                if (response?.ok) {
                    await Swal.fire({
                        title: 'Rutina eliminada',
                        text: `Ha eliminado "${name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });

                    await fetchRoutines();
                }

                if (response?.logout) {
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate('/login', {replace: true});
                }
            } 
        });
    };

    const handleRestore = async (routine: Routine) => {
        const loggedUser = getAuthUser();
        const reqRoutine = {
            ...routine, 
            isDeleted: 0,
            difficultyRoutine: {
                idDifficultyRoutine: routine.difficultyRoutine.idDifficultyRoutine
            },
            paramLoggedIdUser: loggedUser?.idUser
        };
            
        await Swal.fire({
            title: '¿Desea restaurar la rutina?',
            text: `Estaría restaurando "${routine.name}"`,
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
                const response = await updateRoutine(reqRoutine);

                if (response?.ok) {
                    await Swal.fire({
                        title: 'Rutina restaurada',
                        text: `Ha restaurado "${routine.name}"`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });

                    await fetchRoutines();
                }

                if (response?.logout) {
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate('/login', {replace: true});
                }
            } 
        });
    };

    return {
        handleDelete,
        handleRestore
    };
};