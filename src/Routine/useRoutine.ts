import Swal from 'sweetalert2';
import { Routine, RoutineExerciseDTO } from "../shared/types";
import { useRoutineStore } from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { exportToPDF } from "../shared/utils/pdf";
import { exportToExcel } from "../shared/utils/excel";

export const useRoutine = () => {
    const navigate = useNavigate();
    const { 
        routines,
        currentRoutine,
        fetchRoutines, 
        deleteRoutine, 
        updateRoutine,
        getRoutineById
    } = useRoutineStore();

    const { exercise: allExercises, difficultyRoutines } = useCommonDataStore();

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
        if (!loggedUser?.idUser) return;

        const reqRoutine = {
            ...routine, 
            isDeleted: 0,
            difficultyRoutine: {
                idDifficultyRoutine: routine.difficultyRoutine.idDifficultyRoutine
            },
            paramLoggedIdUser: loggedUser.idUser
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

    const getExerciseDetails = (ex: RoutineExerciseDTO) => {
        const globalExercise = allExercises.find(e => e.idExercise === ex.idExercise);
        return {
            name: globalExercise?.name || `Ejercicio #${ex.idExercise}`,
            series: ex.series || 0,
            repetitions: ex.repetitions || 0,
            category: globalExercise?.exerciseCategory?.name || "Sin categoría",
        };
    };

    const getDifficultyName = (id: number) => {
        return difficultyRoutines.find(d => d.idDifficultyRoutine === id)?.name || `Dificultad #${id}`;
    };

    const handleExportRoutine = async (routineId: number) => {
        try {
            await getRoutineById(routineId);
            
            if (!currentRoutine) {
                throw new Error('Rutina no encontrada');
            }

            const exerciseHeaders = ["#", "Ejercicio", "Categoría", "Series", "Repeticiones"];
            const exerciseRows = currentRoutine.exercises?.map((ex, index) => {
                const details = getExerciseDetails(ex);
                return [
                    (index + 1).toString(),
                    details.name,
                    details.category,
                    details.series.toString(),
                    details.repetitions.toString()
                ];
            }) || [];

            const routineInfo = [
                ["Nombre:", currentRoutine.name],
                ["Dificultad:", getDifficultyName(currentRoutine.difficultyRoutine.idDifficultyRoutine)],
                ["Total ejercicios:", currentRoutine.exercises?.length.toString() || "0"]
            ];

            return {
                exportToPDF: () => exportToPDF(
                    `Rutina ${currentRoutine.name}`,
                    exerciseHeaders,
                    exerciseRows,
                    routineInfo
                ),
                exportToExcel: () => exportToExcel(
                    `Rutina ${currentRoutine.name}`,
                    exerciseHeaders,
                    exerciseRows,
                    routineInfo
                )
            };
        } catch (error) {
            Swal.fire({
                title: 'Error',
                text: 'Error al generar el reporte: ' + (error instanceof Error ? error.message : String(error)),
                icon: 'error',
                confirmButtonColor: '#CFAD04'
            });
            return null;
        }
    };

    const pdfTableHeaders = ["#", "Nombre", "Ejercicios", "Series", "Reps"];
    
    const pdfTableRows = routines.map((routine) => {
        const totals = routine.routineExercises?.reduce((acc, ex) => ({
            series: acc.series + (ex.series || 0),
            reps: acc.reps + (ex.repetitions || 0)
        }), { series: 0, reps: 0 }) || { series: 0, reps: 0 };

        return [
            routine.idRoutine.toString(),
            routine.name,
            routine.routineExercises?.length.toString() || "0",
            totals.series.toString(),
            totals.reps.toString()
        ];
    });

    return {
        handleDelete,
        handleRestore,
        handleExportRoutine,
        pdfTableHeaders,
        pdfTableRows
    };
};