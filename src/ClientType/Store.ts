import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ClientType, ClientTypeDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type ClientTypeStore = {
    clientTypes: ClientType[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: ClientType['idClientType'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByClientType: number;

    fetchClientTypes: () => Promise<any>;
    getClientTypeById: (id: number) => void;
    addClientType: (data: ClientTypeDataForm) => Promise<any>;
    updateClientType: (data: ClientTypeDataForm) => Promise<any>;
    deleteClientType: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByClientType: (newFilter: number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
};

export const useClientTypeStore = create<ClientTypeStore>()(
    devtools((set) => ({
        clientTypes: [],
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
        filterByClientType: 0,

        fetchClientTypes: async () => {
            const state = useClientTypeStore.getState();
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
            if (state.filterByClientType !== 0) {
                filters += `&filterByClientType=${state.filterByClientType}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}clientType/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const clientTypes = result.data?.clientTypes ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ clientTypes: [...clientTypes], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getClientTypeById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addClientType: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}clientType/add`, data);
            return result;
        },

        updateClientType: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}clientType/update`, data);
            return result;
        },

        deleteClientType: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}clientType/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByClientType: (newFilter) => set(() => ({ filterByClientType: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false }))
    }))
);

export default useClientTypeStore;
