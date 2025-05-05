import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Category, CategoryDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type CategoryStore = {
    categories: Category[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: Category["idCategory"];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;

    fetchCategories: () => Promise<any>;
    getCategoryById: (id: number) => void;
    addCategory: (data: CategoryDataForm) => Promise<any>;
    updateCategory: (data: CategoryDataForm) => Promise<any>;
    deleteCategory: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    clearAllFilters: () => void;
};

export const useCategoryStore = create<CategoryStore>()(
    devtools((set) => ({
        categories: [],
        modalForm: false,
        modalFilter: false,
        modalInfo: false,
        activeEditingId: 0,
        size: 5,
        page: 1,
        totalRecords: 0,
        orderBy: "",
        directionOrderBy: "DESC",
        searchType: 1,
        searchTerm: "",
        filterByStatus: "",

        clearAllFilters: () => set(() => ({
            searchTerm: "",
            filterByStatus: "",
        })),

        fetchCategories: async () => {
            const state = useCategoryStore.getState();
            let newPage = state.page;
            let filters = `&searchType=${state.searchType}`;

            if (state.searchTerm !== "") {
                filters += `&searchTerm=${state.searchTerm}`;
            }
            if (state.orderBy !== "") {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`;
            }
            if (state.filterByStatus !== "") {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}category/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const categories = result.data?.categories ?? [];
            const totalRecords = result.data?.totalRecords ?? 0;

            set({ categories, totalRecords, page: newPage });
            return result;
        },

        getCategoryById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addCategory: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}category/add`, data);
            return result;
        },

        updateCategory: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}category/update`, data);
            return result;
        },

        deleteCategory: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}category/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false })),
    }))
);

export default useCategoryStore;
