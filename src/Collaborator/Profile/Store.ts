import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserDataForm } from "../../shared/types";
import { getData, putData } from "../../shared/services/gym";
import { getAuthUser, setAuthHeader, setAuthUser } from "../../shared/utils/authentication";
import { useNavigate } from "react-router";

interface CollaboratorStore {
    userData: UserDataForm | null;
    fetchUserData: () => Promise<void>;
    updateProfile: (data: UserDataForm) => Promise<any>;
}

const useCollaboratorStore = create<CollaboratorStore>()(
    devtools((set) => ({
        userData: null,
        
        fetchUserData: async () => {
            const loggedUser = getAuthUser();
            if (!loggedUser) return;
            
            const result = await getData(
                `${import.meta.env.VITE_URL_API}user/${loggedUser.idUser}`
            );
            
            if (result.ok) {
                set({ userData: result.data });
            }
        },
        
        updateProfile: async (data) => {
            const loggedUser = getAuthUser();
            if (!loggedUser) return { ok: false, logout: true };
            
            const result = await putData(
                `${import.meta.env.VITE_URL_API}user/update`, 
                { ...data, paramLoggedIdUser: loggedUser.idUser }
            );
            
            return result;
        }
    }))
);

export default useCollaboratorStore;