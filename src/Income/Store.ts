import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { EconomicIncome, EconomicIncomeDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { format } from 'date-fns';
import { isCompleteDate } from "../shared/utils/validation";

type EconomicIncomeStore = {
    economicIncomes: EconomicIncome[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    modalFileTypeDecision: boolean;
    activeEditingId: EconomicIncome['idEconomicIncome'];
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
    filterByClientType: number;

    fetchEconomicIncomes: () => Promise<any>;
    getEconomicIncomeById: (id: number) => void;
    addEconomicIncome: (data: EconomicIncomeDataForm) => Promise<any>;
    updateEconomicIncome: (data: EconomicIncomeDataForm) => Promise<any>;
    deleteEconomicIncome: (id: number, loggedIdUser: number) => Promise<any>;

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
    changeFilterByClientType: (newFilter : number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    showModalFileType: () => void;
    closeModalFileType: () => void;
    clearAllFilters: () => void;
};

export const useEconomicIncomeStore = create<EconomicIncomeStore>()(
    devtools((set) => ({
        economicIncomes: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        modalFileTypeDecision: false,
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
        filterByDateRangeMin: null,
        filterByMeanOfPayment: 0,
        filterByClientType: -1,

        clearAllFilters: () => set(() => ({
            searchTerm: '',
            filterByStatus: '',
            filterByAmountRangeMax: 0,
            filterByAmountRangeMin: 0,
            filterByDateRangeMax: null,
            filterByDateRangeMin: null ,
            filterByMeanOfPayment: 0,
            filterByCategory: -1,
        })),

        fetchEconomicIncomes: async () => {
            const state = useEconomicIncomeStore.getState();
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
            if (
                isCompleteDate(state.filterByDateRangeMax) &&
                isCompleteDate(state.filterByDateRangeMin)
            ) {
                const formattedDateMax = format(state.filterByDateRangeMax!, 'yyyy-MM-dd');
                const formattedDateMin = format(state.filterByDateRangeMin!, 'yyyy-MM-dd');
                filters += `&filterByDateRangeMax=${formattedDateMax}&filterByDateRangeMin=${formattedDateMin}`;
            }
            if (state.filterByMeanOfPayment != 0){
                filters += `&filterByMeanOfPayment=${state.filterByMeanOfPayment}`
            }
            if (state.filterByClientType != -1){
                filters += `&filterByTypeClient=${state.filterByClientType}`
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}economicIncome/list?size=${state.size}&page=${state.page}${filters}`
            );

            const totalPages = Math.max(1, Math.ceil(result.data.totalRecords / state.size));
            if (state.page > totalPages) {
                newPage = state.page-1; 
            }

            const incomes = result.data?.economicIncomes ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ economicIncomes: [...incomes], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getEconomicIncomeById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addEconomicIncome: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}economicIncome/add`, data);
            return result;
        },

        updateEconomicIncome: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}economicIncome/update`, data);
            return result;
        },

        deleteEconomicIncome: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}economicIncome/delete/${id}`, loggedIdUser);
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
        changeFilterByClientType: (newFilter) => set(() => ({ filterByClientType: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false })),
        showModalFileType: () => set(() => ({ modalFileTypeDecision: true })),
        closeModalFileType: () => set(() => ({ modalFileTypeDecision: false }))
    }))
);

export default useEconomicIncomeStore;