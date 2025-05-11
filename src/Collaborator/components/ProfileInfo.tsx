import { formatDate } from "../../shared/utils/format";

export default function ProfileInfo({ userData }: { userData: any }) {
    if (!userData) return <div className="text-center py-4">Cargando información...</div>;
    
    return (
        <div className="bg-gray-50 p-4 rounded-lg h-full">
            <h2 className="text-xl font-semibold mb-4 border-b pb-2">Información Personal</h2>
            <div className="space-y-3">
                <div>
                    <p className="text-sm text-gray-500">Nombre completo</p>
                    <p className="font-medium">{`${userData.name} ${userData.firstLastName} ${userData.secondLastName}`}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Cédula</p>
                    <p className="font-medium">{userData.identificationNumber}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Fecha de nacimiento</p>
                    <p className="font-medium">{formatDate(new Date(userData.birthday))}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Género</p>
                    <p className="font-medium">{userData.gender?.name || 'No especificado'}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Teléfono</p>
                    <p className="font-medium">{userData.phoneNumber}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{userData.email}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Nombre de usuario</p>
                    <p className="font-medium">{userData.username}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500">Rol</p>
                    <p className="font-medium">{userData.role?.name || 'Colaborador'}</p>
                </div>
            </div>
        </div>
    );
}