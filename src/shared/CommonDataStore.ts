import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ActivityType, TypeClient, MeanOfPayment, Role, Gender, ClientOptions, Category} from "./types";
import { getData } from "./services/gym";

type CommonDataStore = {
    roles: Role[]
    activityTypes: ActivityType[]
    meansOfPayment: MeanOfPayment[]
    typesClient: TypeClient[]
    genders: Gender[]
    allClients: ClientOptions[]
    categories: Category[]
    fetchRoles: () => Promise<any>
    fetchMeansOfPayment: () => Promise<any>
    fetchActivityTypes: () => Promise<any>
    fetchTypesClient: () => Promise<any>
    fetchGenders: () => Promise<any>
    fetchAllClients: () => Promise<any>
    fetchCategories: () => Promise<any>
}

export const useCommonDataStore = create<CommonDataStore>()(
    devtools((set) => ({
        roles: [],
        meansOfPayment: [],
        activityTypes: [],
        typesClient: [],
        genders: [],
        allClients: [],
        categories: [],

        fetchRoles: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}role/list`) 
            set(() => ({ roles: result.data }))
            return result
        },
        
        fetchMeansOfPayment: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}meanOfPayment/list`) 
            set(() => ({ meansOfPayment: result.data }))
            return result
        },

        fetchActivityTypes: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}activityType/list`)
            set(() => ({ activityTypes: result.data }))
            return result
        },

        fetchTypesClient: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}typeClient/list`)
            set(() => ({ typesClient: result.data.typesClient }))
            return result
        },

        fetchGenders: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}gender/list`)
            set(() => ({ genders: result.data }))
            return result
        },

        fetchAllClients: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}client/listAll`)
            set(() => ({ allClients: result.data }))
            return result
        },

        fetchCategories: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}category/list`)
            set(() => ({ categories: result.data }))
            return result
        }
    })
))