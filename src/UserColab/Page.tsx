import { useEffect } from "react";
import useUserStore from "./Store";
import Form from "./Form/MultiStepForm";
import { mapUserToDataForm } from "../shared/types/mapper";
import { useUser } from "./useUser";

function UserProfile() {
    const { currentUser, loading, error, fetchUser, updateUser } = useUserStore();
    const { handleUpdateSuccess, handleUpdateError } = useUser();

    useEffect(() => {
        fetchUser();
    }, []);

    if (loading && !currentUser) {
        return <div className="text-center mt-8">Cargando perfil...</div>;
    }

    if (error) {
        return <div className="text-red-500 text-center mt-8">{error}</div>;
    }

    if (!currentUser) {
        return <div className="text-center mt-8">No se encontraron datos del usuario</div>;
    }

    const handleSubmit = async (data: any) => {
        try {
            const result = await updateUser(data);
            if (result?.ok) {
                await handleUpdateSuccess();
                await fetchUser(); // Recargar datos actualizados
            } else {
                handleUpdateError();
            }
            return Promise.resolve(); // Asegurar que devuelve una Promise
        } catch (error) {
            return Promise.reject(error);
        }
    };

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Mi Perfil</h1>
            </header>

            <main className="justify-items-center ml-12 p-4">
                <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full p-8 rounded-lg">
                    <Form 
                        initialData={mapUserToDataForm(currentUser)} 
                        onSubmit={handleSubmit}
                        isUpdate={true}
                    />
                </div>
            </main>
        </div>
    );
}

export default UserProfile;