import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { NotificationTemplate, NotificationTemplateDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type NotificationTemplateStore = {
    notificationTemplates: NotificationTemplate[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: NotificationTemplate['idNotificationTemplate'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByNotificationType: number;

    fetchNotificationTemplates: () => Promise<any>;
    getNotificationTemplateById: (id: number) => void;
    addNotificationTemplate: (data: NotificationTemplateDataForm) => Promise<any>;
    updateNotificationTemplate: (data: NotificationTemplateDataForm) => Promise<any>;
    deleteNotificationTemplate: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByNotificationType: (newFilter: number) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
};

export const useNotificationTemplateStore = create<NotificationTemplateStore>()(
    devtools((set) => ({
        notificationTemplates: [],
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
        filterByNotificationType: 0,

        fetchNotificationTemplates: async () => {
            const state = useNotificationTemplateStore.getState();
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
            if (state.filterByNotificationType !== 0) {
                filters += `&filterByNotificationType=${state.filterByNotificationType}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}notificationTemplate/list?size=${state.size}&page=${state.page}${filters}`
            );

            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1;
            }

            const templates = result.data?.notificationTemplates ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ notificationTemplates: [...templates], totalRecords: totalRecords, page: newPage });
            return result;
        },

        getNotificationTemplateById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addNotificationTemplate: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}notificationTemplate/add`, data);
            return result;
        },

        updateNotificationTemplate: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}notificationTemplate/update`, data);
            return result;
        },

        deleteNotificationTemplate: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}notificationTemplate/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByNotificationType: (newFilter) => set(() => ({ filterByNotificationType: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false }))
    }))
);

export default useNotificationTemplateStore;