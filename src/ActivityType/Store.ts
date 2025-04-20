import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ActivityType } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type ActivityTypeStore = {
    activityTypes: ActivityType[]
    modalForm: boolean
    modalInfo: boolean
    activeEditingId: ActivityType['idActivityType']

    fetchActivityTypes: () => Promise<any>
    getActivityTypeById: (id: number) => void
    addActivityType: (data: ActivityType) => Promise<any>
    updateActivityType: (data: ActivityType) => Promise<any>
    deleteActivityType: (id: number, loggedIdUser: number) => Promise<any>;

    showModalForm: () => void
    closeModalForm: () => void
    showModalInfo: () => void
    closeModalInfo: () => void
}

const useActivityTypeStore = create<ActivityTypeStore>()(
    devtools((set) => ({
        activityTypes: [],
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

        fetchActivityTypes: async () => {
            const result = await getData(
                `${import.meta.env.VITE_URL_API}activityType/listFees`
            )

            const activityTypes = result.data

            set({ activityTypes: [...activityTypes]})
            return result
        },        

        getActivityTypeById: (id) => {
            set(() => ({ activeEditingId: id }))
        },

        addActivityType: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}activityType/add`, data)
            return result
        },

        updateActivityType: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}activityType/update`, data)
            return result
        },

        deleteActivityType: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}activityType/delete/${id}`, loggedIdUser)
            return result
        },

        showModalForm: () => {
            set(() => ({ modalForm: true }))
        },
        closeModalForm: () => {
            set(() => ({ modalForm: false }))
        },
        showModalInfo: () => {
            set(() => ({ modalInfo: true }))
        },
        closeModalInfo: () => {
            set(() => ({ modalInfo: false }))
        }
    }))
)

export default useActivityTypeStore;