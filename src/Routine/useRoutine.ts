import { FormEvent } from "react";
import Swal from "sweetalert2";
import { Routine, RoutineDataForm } from "../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useRoutineStore from "./Store";
import { useNavigate } from "react-router";

export const useRoutine = () => {
    const navigate = useNavigate();
    const { fetchRoutines, deleteRoutine, updateRoutine, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useRoutineStore();

    const handleDelete = async ({ idRoutine }: Routine) => {
        await Swal.fire({
            title: '¿Desea eliminar esta rutina?',
            text: `Está eliminando la rutina`,
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
                const response = await deleteRoutine(idRoutine, loggedUser?.idUser);

                if (response.ok) {
                    Swal.fire({
                        title: 'Rutina eliminada',
                        text: `Se ha eliminado la rutina`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });
                    fetchRoutines();
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

    const handleRestore = async (routine: RoutineDataForm) => {
        const loggedUser = getAuthUser();
        const reqRoutine = {
            ...routine,
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        };

        await Swal.fire({
            title: '¿Desea restaurar esta rutina?',
            text: `Está restaurando la rutina`,
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

                if (response.ok) {
                    Swal.fire({
                        title: 'Rutina restaurada',
                        text: `Se ha restaurado la rutina`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });
                    fetchRoutines();
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
