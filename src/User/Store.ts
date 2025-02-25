import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, UserDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";

type UserStore = {
    users: User[]
    modalForm: boolean
    modalFilter: boolean
    modalInfo: boolean
    activeEditingId: User['idUser']
    size: number
    page: number
    totalRecords: number
    orderBy: string
    directionOrderBy: string
    searchType: number
    searchTerm: string
    filterByStatus: string
    filterByRole: string

    fetchUsers: () => Promise<any>
    getUserById: (id : number) => void
    addUser: (data : UserDataForm) => Promise<any>
    updateUser: (data: UserDataForm) => Promise<any>
    deleteUser: (id : User['idUser'], loggedIdUser : User['idUser']) => Promise<any>

    changeSize: (newSize: number) => void
    changePage: (newPage: number) => void
    changeOrderBy: (newOrderBy: string) => void
    changeDirectionOrderBy: (newDirectionOrderBy: string) => void
    changeSearchType: (newSearchType: number) => void
    changeSearchTerm: (newSearchTerm: string) => void
    changeFilterByStatus: (newFilterByStatus: string) => void
    changeFilterByRole: (newFilterByRole: string) => void

    showModalForm: () => void
    closeModalForm: () => void
    showModalFilter: () => void
    closeModalFilter: () => void
    showModalInfo: () => void
    closeModalInfo: () => void
}

const useUserStore = create<UserStore>()(
    devtools((set) => ({
        users: [],
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
        filterByRole: '',

        fetchUsers: async () => {
            // Obtener el estado actual usando get()
            const state = useUserStore.getState()
            
            // empieza en la pagina que se encuentra
            let newPage = state.page;
            let filters = `&searchType=${state.searchType}`
        
            // validacion de filtros
            if (state.searchTerm !== '') {
                filters += `&searchTerm=${state.searchTerm}`
            }
            if (state.orderBy !== '') {
                filters += `&orderBy=${state.orderBy}&directionOrderBy=${state.directionOrderBy}`
            }
            if (state.filterByStatus !== '') {
                filters += `&filterByStatus=${state.filterByStatus}`
            }
            if (state.filterByRole !== '') {
                filters += `&filterByRole=${state.filterByRole}`
            }
        
            const result = await getData(
                `${import.meta.env.VITE_URL_API}user/list?size=${state.size}&page=${state.page}${filters}`
            )
    
            // si la página en la que estoy es mayor que la cantidad nueva de páginas posibles me tengo que devolver a la pag 1
            if (state.page > (Math.trunc(result.data.totalRecords / state.size) + 1)) {
                newPage = 1
            }

            const users = result.data?.users ?? []
            const totalRecords = result.data?.totalRecords ?? 0

            set({ users: [...users], totalRecords: totalRecords, page: newPage })
            return result
        },        

        getUserById: (id) => {
            set(() => ({ activeEditingId: id }))
        },

        addUser: async (data) => {
            const result = await postData(`${import.meta.env.VITE_URL_API}user/add`, data)
            return result
        },

        updateUser: async (data) => {
            const result = await putData(`${import.meta.env.VITE_URL_API}user/update`, data)
            return result
        },

        deleteUser: async (id, loggedIdUser) => {
            const result = await deleteData(`${import.meta.env.VITE_URL_API}user/delete/${id}`, loggedIdUser)
            return result
        },

        changeSize: (newSize) => {
            set(() => ({ size:  newSize}))
        },
        changePage: (newPage) => {
            set(() => ({ page: newPage }))
        },
        changeOrderBy: (newOrderBy) => {
            set(() => ({ orderBy: newOrderBy }))
        },
        changeDirectionOrderBy: (newDirecitionOrderBy) => {
            set(() => ({ directionOrderBy: newDirecitionOrderBy }))
        },
        changeSearchType: (newSearchType) => {
            set(() => ({ searchType: newSearchType }))
        },
        changeSearchTerm: (newSearchTerm) => {
            set(() => ({ searchTerm: newSearchTerm }))
        },
        changeFilterByStatus: (newFilterByStatus) => {
            set(() => ({ filterByStatus: newFilterByStatus }))
        },
        changeFilterByRole: (newFilterByRole) => {
            set(() => ({ filterByRole: newFilterByRole }))
        },

        showModalForm: () => {
            set(() => ({ modalForm: true }))
        },
        closeModalForm: () => {
            set(() => ({ modalForm: false }))
        },
        showModalFilter: () => {
            set(() => ({ modalFilter: true }))
        },
        closeModalFilter: () => {
            set(() => ({ modalFilter: false }))
        },
        showModalInfo: () => {
            set(() => ({ modalInfo: true }))
        },
        closeModalInfo: () => {
            set(() => ({ modalInfo: false }))
        }
    })
))

export default useUserStore;