import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Asset, AssetDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type AssetStore = {
    assets: Asset[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    modalFileTypeDecision: boolean;
    activeEditingId: Asset['idAsset'];
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

    fetchAssets: () => Promise<any>;
    getAssetById: (id: number) => void;
    addAsset: (data: AssetDataForm) => Promise<any>;
    updateAsset: (data: AssetDataForm) => Promise<any>;
    deleteAsset: (id: number, loggedIdUser: number) => Promise<any>;

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
    
    clearAllFilters: () => void;

};

export const useAssetStore = create<AssetStore>()(
    devtools((set) => ({
        assets: [],
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

        clearAllFilters: () => set(() => ({
            filterByStatus: '',
            filterByCostRangeMin: 0,
            filterByCostRangeMax: 0,
            filterByQuantityRangeMin: 0,
            filterByQuantityRangeMax: 0,
            searchTerm: ''
        })),
        

        fetchAssets: async () => {
            const state = useAssetStore.getState();
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
                `${import.meta.env.VITE_URL_API}asset/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const assets = result.data?.assets ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ assets: [...assets], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getAssetById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addAsset: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}asset/add`, data);
            return result;
        },

        updateAsset: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}asset/update`, data);
            return result;
        },

        deleteAsset: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}asset/delete/${id}`, loggedIdUser);
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

export default useAssetStore;