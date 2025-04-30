import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Routine, RoutineWithExercisesDTO } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type RoutineStore = {
    routines: Routine[];
    modalForm: boolean;
    modalInfo: boolean;
    activeEditingId: Routine['idRoutine'];

    fetchRoutines: () => Promise<any>;
    getRoutineById: (id: number) => void;
    addRoutine: (data: RoutineWithExercisesDTO) => Promise<any>;
    updateRoutine: (data: RoutineWithExercisesDTO) => Promise<any>;
    deleteRoutine: (id: number, loggedIdUser: number) => Promise<any>;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
};

export const useRoutineStore = create<RoutineStore>()(
    devtools((set) => ({
        routines: [],
        modalForm: false,
        modalInfo: false,
        activeEditingId: 0,

        fetchRoutines: async () => {
            const result = await getData(
                `${import.meta.env.VITE_URL_API}routine/listExercises`
            );

            if (result?.logout) {
                return { logout: true };
            }

            const routines = result?.data ?? [];
            set({ routines: [...routines] });
            return result;
        },

        getRoutineById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addRoutine: async (data) => {
            const result = await postData(
                `${import.meta.env.VITE_URL_API}routine/add`, 
                data
            );

            if (result?.logout) {
                return { logout: true };
            }

            return result;
        },

        updateRoutine: async (data) => {
            const result = await putData(
                `${import.meta.env.VITE_URL_API}routine/update`, 
                data
            );

            if (result?.logout) {
                return { logout: true };
            }

            return result;
        },

        deleteRoutine: async (id, loggedIdUser) => {
            const result = await deleteData(
                `${import.meta.env.VITE_URL_API}routine/delete/${id}`,
                { userId: loggedIdUser } // Send as object in request body
            );

            if (result?.logout) {
                return { logout: true };
            }

            return result;
        },

        showModalForm: () => {
            set(() => ({ modalForm: true }));
        },
        closeModalForm: () => {
            set(() => ({ modalForm: false }));
        },
        showModalInfo: () => {
            set(() => ({ modalInfo: true }));
        },
        closeModalInfo: () => {
            set(() => ({ modalInfo: false }));
        }
    }))
);
export default useRoutineStore;