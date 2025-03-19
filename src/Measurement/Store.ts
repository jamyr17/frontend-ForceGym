import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { Measurement, MeasurementDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { format } from 'date-fns';
import { isCompleteDate } from "../shared/utils/validation";

type MeasurementStore = {
    idClient: number;
    setIdClient: (id: number) => void;
    measurements: Measurement[];
    modalForm: boolean;
    modalFilter: boolean;
    modalInfo: boolean;
    activeEditingId: Measurement['idClient'];
    size: number;
    page: number;
    totalRecords: number;
    orderBy: string;
    directionOrderBy: string;
    searchType: number;
    searchTerm: string;
    filterByStatus: string;
    filterByDateRangeMax: Date | null;
    filterByDateRangeMin: Date | null;

    fetchMeasurements: () => Promise<any>;
    getMeasurementById: (idClient: number) => void;
    addMeasurement: (data: MeasurementDataForm) => Promise<any>;
    updateMeasurement: (data: MeasurementDataForm) => Promise<any>;
    deleteMeasurement: (id: number, loggedIdUser: number) => Promise<any>;

    changeSize: (newSize: number) => void;
    changePage: (newPage: number) => void;
    changeOrderBy: (newOrderBy: string) => void;
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void;
    changeSearchType: (newSearchType: number) => void;
    changeSearchTerm: (newSearchTerm: string) => void;
    changeFilterByStatus: (newFilterByStatus: string) => void;
    changeFilterByDateRangeMax: (newFilter: Date | null) => void;
    changeFilterByDateRangeMin: (newFilter: Date | null) => void;

    showModalForm: () => void;
    closeModalForm: () => void;
    showModalFilter: () => void;
    closeModalFilter: () => void;
    showModalInfo: () => void;
    closeModalInfo: () => void;
};

export const useMeasurementStore = create<MeasurementStore>()(
    
    devtools((set) => ({
        idClient: 0,
        setIdClient: (id) => set(() => ({ idClient: id })),
        measurements: [],
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
        filterByDateRangeMax: null,
        filterByDateRangeMin: null ,

        fetchMeasurements: async () => {
            const state = useMeasurementStore.getState();
            let filters = `&searchType=${state.searchType}`;
            if (state.searchTerm !== '') {
                filters += `&searchTerm=${state.searchTerm}`;
            }
            if (state.orderBy !== '') {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`;
            }
            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`;
            }if (
                    isCompleteDate(state.filterByDateRangeMax) &&
                    isCompleteDate(state.filterByDateRangeMin)
                ) {
                    const formattedDateMax = format(state.filterByDateRangeMax!, 'yyyy-MM-dd');
                    const formattedDateMin = format(state.filterByDateRangeMin!, 'yyyy-MM-dd');
                    filters += `&filterByDateRangeMax=${formattedDateMax}&filterByDateRangeMin=${formattedDateMin}`;
            }

            const result = await getData(
                `${import.meta.env.VITE_URL_API}measurement/list?idClient=${state.idClient}&size=${state.size}&page=${state.page}${filters}`
            );

            set({ measurements: result.data?.measurements ?? [], totalRecords: result.data?.totalRecords ?? 0 });
            return result;
        },

        getMeasurementById: (id) => {
            set(() => ({ activeEditingId: id }));
        },

        addMeasurement: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}measurement/add`, data);
            return result;
        },

        updateMeasurement: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}measurement/update`, data);
            return result;
        },

        deleteMeasurement: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}measurement/delete/${id}`, loggedIdUser);
            return result;
        },

        changeSize: (newSize) => set(() => ({ size: newSize })),
        changePage: (newPage) => set(() => ({ page: newPage })),
        changeOrderBy: (newOrderBy) => set(() => ({ orderBy: newOrderBy })),
        changeDirectionOrderBy: (newDirectionOrderBy) => set(() => ({ directionOrderBy: newDirectionOrderBy })),
        changeSearchType: (newSearchType) => set(() => ({ searchType: newSearchType })),
        changeSearchTerm: (newSearchTerm) => set(() => ({ searchTerm: newSearchTerm })),
        changeFilterByStatus: (newFilterByStatus) => set(() => ({ filterByStatus: newFilterByStatus })),
        changeFilterByDateRangeMax: (newFilter) => set(() => ({ filterByDateRangeMax: newFilter })),
        changeFilterByDateRangeMin: (newFilter) => set(() => ({ filterByDateRangeMin: newFilter })),

        showModalForm: () => set(() => ({ modalForm: true })),
        closeModalForm: () => set(() => ({ modalForm: false })),
        showModalFilter: () => set(() => ({ modalFilter: true })),
        closeModalFilter: () => set(() => ({ modalFilter: false })),
        showModalInfo: () => set(() => ({ modalInfo: true })),
        closeModalInfo: () => set(() => ({ modalInfo: false }))
    }))
);

export default useMeasurementStore;
