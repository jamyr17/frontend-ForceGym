import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EconomicExpense, EconomicExpenseDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { formatDateForParam } from "../shared/utils/format";

type EconomicExpenseStore = {
    economicExpenses: EconomicExpense[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: EconomicExpense['idEconomicExpense'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByAmountRangeMax: number;
    filterByAmountRangeMin: number;
    filterByDateRangeMax: Date | null;
    filterByDateRangeMin: Date | null;
    filterByMeanOfPayment: number;

    fetchEconomicExpenses: () => Promise<any>;
    getEconomicExpenseById: (id: number) => void;
    addEconomicExpense: (data: EconomicExpenseDataForm) => Promise<any>;
    updateEconomicExpense: (data: EconomicExpenseDataForm) => Promise<any>;
    deleteEconomicExpense: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByAmountRangeMax: (newFilter: number) => void;
    changeFilterByAmountRangeMin: (newFilter: number) => void;
    changeFilterByDateRangeMax: (newFilter: Date | null) => void;
    changeFilterByDateRangeMin: (newFilter: Date | null) => void;
    changeFilterByMeanOfPayment: (newFilter: number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
};

export const useEconomicExpenseStore = create<EconomicExpenseStore>()(
    devtools((set) => ({
        economicExpenses: [],
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
        filterByAmountRangeMax: 0,
        filterByAmountRangeMin: 0,
        filterByDateRangeMax: null,
        filterByDateRangeMin: null ,
        filterByMeanOfPayment: 0,

        fetchEconomicExpenses: async () => {
            const state = useEconomicExpenseStore.getState();
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
            if (state.filterByAmountRangeMax !== 0 && state.filterByAmountRangeMin !== 0) {
                filters += `&filterByAmountRangeMax=${state.filterByAmountRangeMax}&filterByAmountRangeMin=${state.filterByAmountRangeMin}`;
            }
            if (state.filterByDateRangeMax !== null && state.filterByDateRangeMin !== null) {
                filters += `&filterByDateRangeMax=${formatDateForParam(state.filterByDateRangeMax)}&filterByDateRangeMin=${formatDateForParam(state.filterByDateRangeMin)}`;
            }
            if (state.filterByMeanOfPayment != 0){
                filters += `&filterByMeanOfPayment=${state.filterByMeanOfPayment}`
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}economicExpense/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const expenses = result.data?.economicExpenses ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ economicExpenses: [...expenses], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getEconomicExpenseById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addEconomicExpense: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}economicExpense/add`, data);
            return result;
        },

        updateEconomicExpense: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}economicExpense/update`, data);
            return result;
        },

        deleteEconomicExpense: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}economicExpense/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByAmountRangeMax: (newFilter) => set(() => ({ filterByAmountRangeMax: newFilter })),
        changeFilterByAmountRangeMin: (newFilter) => set(() => ({ filterByAmountRangeMin: newFilter })),
        changeFilterByDateRangeMax: (newFilter) => set(() => ({ filterByDateRangeMax: newFilter })),
        changeFilterByDateRangeMin: (newFilter) => set(() => ({ filterByDateRangeMin: newFilter })),
        changeFilterByMeanOfPayment: (newFilter) => set(() => ({ filterByMeanOfPayment: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false }))
    }))
);

export default useEconomicExpenseStore;