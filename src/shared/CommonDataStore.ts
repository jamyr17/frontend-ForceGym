import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ActivityType, TypeClient, MeanOfPayment, Role, ClientOptions } from "./types";
import { getData } from "./services/gym";

type CommonDataStore = {
    roles: Role[]
    activityTypes: ActivityType[]
    meansOfPayment: MeanOfPayment[]
    typesClient: TypeClient[]
    allClients: ClientOptions[]
    fetchRoles: () => Promise<any>
    fetchMeansOfPayment: () => Promise<any>
    fetchActivityTypes: () => Promise<any>
    fetchTypesClient: () => Promise<any>
    fetchAllClients: () => Promise<any>
}

export const useCommonDataStore = create<CommonDataStore>()(
    devtools((set) => ({
        roles: [],
        meansOfPament: [],
        activityTypes: [],
        typesClient: [],
        allClients: [],

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

        fetchAllClients: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}client/listAll`)
            set(() => ({ allClients: result.data }))
            return result
        }
    })
))