import { useEffect } from "react";
import CollaboratorForm from "../Form/CollaboratorForm";
import ProfileInfo from "../components/ProfileInfo";
import useCollaboratorStore from "./Store";

export default function CollaboratorProfile() {
    const { userData, fetchUserData } = useCollaboratorStore();
    
    useEffect(() => {
        fetchUserData();
    }, []);
    
    return (
        <div className="bg-white rounded-lg p-6 max-w-4xl mx-auto mt-8">
            <h1 className="text-3xl font-bold text-yellow mb-6">Mi Perfil</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <ProfileInfo userData={userData} />
                </div>
                
                <div className="md:col-span-2">
                    <CollaboratorForm />
                </div>
            </div>
        </div>
    );
}