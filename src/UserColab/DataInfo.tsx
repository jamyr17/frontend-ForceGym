import { formatDate } from "../shared/utils/format";
import useUserStore from "./Store";

function DataInfo() {
    const { currentUser } = useUserStore()
    if (!currentUser) return <></>

    const activeEditingUser = currentUser
    if (!activeEditingUser) return <></>

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Persona</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CÉDULA</strong></p>
                    <p>{activeEditingUser.person.identificationNumber}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE</strong></p>
                    <p>{
                        activeEditingUser.person.name + ' ' + 
                        activeEditingUser.person.firstLastName + ' ' + 
                        activeEditingUser.person.secondLastName
                    }</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>GÉNERO</strong></p>
                    <p>{activeEditingUser.person.gender.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>FECHA DE NACIMIENTO</strong></p>
                    <p>{formatDate(new Date(activeEditingUser.person.birthday))}</p>
                </div>
                
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Contacto</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TELÉFONO</strong></p>
                    <p>{activeEditingUser.person.phoneNumber}</p>
                    </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>EMAIL</strong></p>
                    <p>{activeEditingUser.person.email}</p>
                </div>
                
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Usuario</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>ROL</strong></p>
                    <p>{activeEditingUser.role.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE DE USUARIO</strong></p>
                    <p>{activeEditingUser.username}</p>
                </div>

            </div>
        </div>
    );
}

export default DataInfo;