import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { User, UserDataForm } from "../shared/types";
import { getData, putData } from "../shared/services/gym";
import { getAuthUser } from "../shared/utils/authentication";

type UserStore = {
    currentUser: User | null;
    loading: boolean;
    error: string | null;
    fetchUser: () => Promise<void>;
    updateUser: (data: UserDataForm) => Promise<{ok: boolean, logout?: boolean}>;
}

const useUserStore = create<UserStore>()(
    devtools((set) => ({
        currentUser: null,
        loading: false,
        error: null,

        fetchUser: async () => {
            set({ loading: true, error: null });
            try {
                const loggedUser = getAuthUser();
                if (!loggedUser?.idUser) return;

                const result = await getData(
                    `${import.meta.env.VITE_URL_API}user/${loggedUser.idUser}`
                );
                set({ currentUser: result?.data?.user || null });
            } catch (error) {
                set({ error: "Error al cargar los datos del usuario" });
            } finally {
                set({ loading: false });
            }
        },

        updateUser: async (data: UserDataForm) => {
            set({ loading: true, error: null });
            try {
                const loggedUser = getAuthUser();
                if (!loggedUser?.idUser) return { ok: false };

                const response = await putData(
                    `${import.meta.env.VITE_URL_API}user/update`,
                    { ...data, paramLoggedIdUser: loggedUser.idUser }
                );

                if (response.ok) {
                    await set(state => ({ 
                        currentUser: response.data?.user || state.currentUser 
                    }));
                }

                return response;
            } catch (error) {
                set({ error: "Error al actualizar el usuario" });
                return { ok: false };
            } finally {
                set({ loading: false });
            }
        }
    }))
)

export default useUserStore;