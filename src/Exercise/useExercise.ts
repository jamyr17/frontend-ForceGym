import { FormEvent } from "react";
import Swal from 'sweetalert2';
import { Exercise, ExerciseDataForm } from "../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useExerciseStore from "./Store";
import { useNavigate } from "react-router";

export const useExercise = () => {
    const navigate = useNavigate();
    const {
        fetchExercises,
        deleteExercise,
        updateExercise,
        changeSearchTerm,
        changeOrderBy,
        changeDirectionOrderBy,
        directionOrderBy
    } = useExerciseStore();

    const handleDelete = async ({ idExercise, name }: Exercise) => {
        await Swal.fire({
            title: '¿Desea eliminar este ejercicio?',
            text: `Está eliminando el ejercicio ${name}`,
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
                const response = await deleteExercise(idExercise, loggedUser?.idUser);

                if (response.ok) {
                    Swal.fire({
                        title: 'Ejercicio eliminado',
                        text: `Se ha eliminado el ejercicio ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });

                    fetchExercises();
                }

                if (response.logout) {
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate('/login', { replace: true });
                }
            }
        });
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const { searchTerm } = Object.fromEntries(new FormData(form));
        changeSearchTerm(searchTerm.toString());
    };

    const handleOrderByChange = (orderByTerm: string) => {
        changeOrderBy(orderByTerm);
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC');
    };

    const handleRestore = async (exercise: ExerciseDataForm) => {
        const loggedUser = getAuthUser();
        const reqExercise = {
            ...exercise,
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        };

        await Swal.fire({
            title: '¿Desea restaurar este ejercicio?',
            text: `Está restaurando el ejercicio ${exercise.name}`,
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
                const response = await updateExercise(reqExercise);

                if (response.ok) {
                    Swal.fire({
                        title: 'Ejercicio restaurado',
                        text: `Se ha restaurado el ejercicio ${exercise.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });

                    fetchExercises();
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
        handleSearch,
        handleOrderByChange,
        handleRestore
    };
};