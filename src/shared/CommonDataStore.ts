import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { ActivityType, TypeClient, MeanOfPayment, Role, Gender, ClientOptions, Category, NotificationType, ExerciseCategory, Exercise, DifficultyRoutine} from "./types";
import { getData } from "./services/gym";

type CommonDataStore = {
    roles: Role[]
    activityTypes: ActivityType[]
    meansOfPayment: MeanOfPayment[]
    typesClient: TypeClient[]
    clientTypes: ClientTypes[]
    genders: Gender[]
    allClients: ClientOptions[]
    categories: Category[]
    notificationTypes: NotificationType[]
    exerciseCategories: ExerciseCategory[]
    exercise: Exercise[]
    difficultyRoutine: DifficultyRoutine[]
    fetchRoles: () => Promise<any>
    fetchMeansOfPayment: () => Promise<any>
    fetchActivityTypes: () => Promise<any>
    fetchTypesClient: () => Promise<any>
    fetchGenders: () => Promise<any>
    fetchAllClients: () => Promise<any>
    fetchCategories: () => Promise<any>
    fetchNotificationTypes: () => Promise<any>
    fetchExerciseCategories: () => Promise<any>
    fetchExercise: () => Promise<any>
    fetchDifficultyRoutine: () => Promise<any>
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
        notificationTypes: [],
        exerciseCategories: [],
        exercise: [],
        difficultyRoutine: [],

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
            const result = await getData(`${import.meta.env.VITE_URL_API}activityType/listFees`)
            set(() => ({ activityTypes: result.data }))
            return result
        },

        fetchTypesClient: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}typeClient/list`)
            set(() => ({ typesClient: result.data.typesClient }))
            return result
        },
        fetchClientTypes: async () => {
            const result = await getData(`${import.meta.env.VITE_URL_API}ClientType/list`)
            set(() => ({ clientTypes: result.data.typesClient }))
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
            const result = await getData(`${import.meta.env.VITE_URL_API}category/listAll`)
            set(() => ({ categories: result.data }))
            return result
        },

        fetchDifficultyRoutine: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}notificationType/list`)
            set(() => ({ notificationTypes: result.data.notificationTypes }))
            return result
        },

        fetchExerciseCategories: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}exercisecategory/list`);
            set(() => ({ exerciseCategories: result.data }));
            return result;
        },

        fetchExercise: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}exercise/listAll`);
            set(() => ({ exercise: result.data }));
            return result;
        },
        
        fetchNotificationTypes: async() => {
            const result = await getData(`${import.meta.env.VITE_URL_API}difficultyRoutine/list`)
            set(() => ({ difficultyRoutine: result.data }))
            return result
        },
    })
))