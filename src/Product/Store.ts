import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ProductInventory, ProductInventoryDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type ProductInventoryStore = {
    productsInventory: ProductInventory[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    modalFileTypeDecision: boolean;
    activeEditingId: ProductInventory['idProductInventory'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByCostRangeMax: number;
    filterByCostRangeMin: number;
    filterByQuantityRangeMax: number;
    filterByQuantityRangeMin: number;

    fetchProductsInventory: () => Promise<any>;
    getProductInventoryById: (id: number) => void;
    addProductInventory: (data: ProductInventoryDataForm) => Promise<any>;
    updateProductInventory: (data: ProductInventoryDataForm) => Promise<any>;
    deleteProductInventory: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByCostRangeMax: (newFilter: number) => void;
    changeFilterByCostRangeMin: (newFilter: number) => void;
    changeFilterByQuantityRangeMax: (newFilter: number) => void;
    changeFilterByQuantityRangeMin: (newFilter: number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
    showModalFileType: () => void;
    closeModalFileType: () => void;
};

export const useProductInventoryStore = create<ProductInventoryStore>()(
    devtools((set) => ({
        productsInventory: [],
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
        filterByCostRangeMax: 0,
        filterByCostRangeMin: 0,
        filterByQuantityRangeMax: 0,
        filterByQuantityRangeMin: 0,

        fetchProductsInventory: async () => {
            const state = useProductInventoryStore.getState();
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
            if (state.filterByCostRangeMax !== 0 && state.filterByCostRangeMin !== 0) {
                filters += `&filterByCostRangeMax=${state.filterByCostRangeMax}&filterByCostRangeMin=${state.filterByCostRangeMin}`;
            }
            if (state.filterByQuantityRangeMax !== 0 && state.filterByQuantityRangeMin !== 0) {
                filters += `&filterByQuantityRangeMax=${state.filterByQuantityRangeMax}&filterByQuantityRangeMin=${state.filterByQuantityRangeMin}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}productInventory/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const products = result.data?.products ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ productsInventory: [...products], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getProductInventoryById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addProductInventory: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}productInventory/add`, data);
            return result;
        },

        updateProductInventory: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}productInventory/update`, data);
            return result;
        },

        deleteProductInventory: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}productInventory/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByCostRangeMax: (newFilter) => set(() => ({ filterByCostRangeMax: newFilter })),
        changeFilterByCostRangeMin: (newFilter) => set(() => ({ filterByCostRangeMin: newFilter })),
        changeFilterByQuantityRangeMax: (newFilter) => set(() => ({ filterByQuantityRangeMax: newFilter })),
        changeFilterByQuantityRangeMin: (newFilter) => set(() => ({ filterByQuantityRangeMin: newFilter })),

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

export default useProductInventoryStore;