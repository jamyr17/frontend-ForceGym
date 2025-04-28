import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Routine, RoutineDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type RoutineStore = {
    routines: Routine[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: Routine['idRoutine'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByDifficultyRoutine: number;

    fetchRoutines: () => Promise<any>;
    getRoutineById: (id: number) => void;
    addRoutine: (data: RoutineDataForm) => Promise<any>;
    updateRoutine: (data: RoutineDataForm) => Promise<any>;
    deleteRoutine: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByDifficultyRoutine: (newFilter: number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;

    clearAllFilters: () => void;
};

export const useRoutineStore = create<RoutineStore>()(
    devtools((set) => ({
        routines: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        orderBy: '',
        directionOrderBy: 'DESC',
        searchType: 1,
        searchTerm: '',
        filterByStatus: '',
        filterByDifficultyRoutine: 0,

        clearAllFilters: () => set(() => ({
            searchTerm: '',
            filterByStatus: '',
            filterByDifficultyRoutine: 0,
        })),

        fetchRoutines: async () => {
            const state = useRoutineStore.getState();
            let newPage = state.page;
            let filters = `&searchType=${state.searchType}`;

            if (state.searchTerm !== '') {
                filters += `&searchTerm=${state.searchTerm}`;
            }
            if (state.orderBy !== '') {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`;
            }
            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }
            if (state.filterByDifficultyRoutine !== 0) {
                filters += `&filterByDifficultyRoutine=${state.filterByDifficultyRoutine}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}routine/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const routines = result.data?.routines ?? [];
            const totalRecords = result.data?.totalRecords ?? 0;

            set({ routines: [...routines], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getRoutineById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addRoutine: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}routine/add`, data);
            return result;
        },

        updateRoutine: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}routine/update`, data);
            return result;
        },

        deleteRoutine: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}routine/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByDifficultyRoutine: (newFilter) => set(() => ({ filterByDifficultyRoutine: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false }))
    }))
);

export default useRoutineStore;
