import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, UserDataForm } from "../shared/types";
import { deleteData, getData, postData, putData } from "../shared/services/gym";
import { getAuthUser } from "../shared/utils/authentication";

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

    clearAllFilters: () => void;
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

        clearAllFilters: () => set(() => ({
            searchTerm: '',
            filterByStatus: '',
            filterByRole: '',
        })),



        fetchUsers: async () => {
            const loggedUser = getAuthUser();

            if (!loggedUser?.idUser) return;

            const result = await getData(
                `${import.meta.env.VITE_URL_API}user/${loggedUser.idUser}`
            );
            console.log(result);
            const user = result?.data?.user;
            if (user) {
            set({ users: [user], totalRecords: result.data.totalRecords, page: 1 });
            } else {
            console.error("No se recibió el usuario correctamente");
            }
            return result;
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