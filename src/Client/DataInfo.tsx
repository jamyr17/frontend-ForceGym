import { formatAmountToCRC, formatDate, formatNullable } from "../shared/utils/format";
import useClientStore from "./Store";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";

function DataInfo() {
    const { clients, activeEditingId } = useClientStore()
    if (!activeEditingId) return <></>;

    const client = clients.find(client => client.idClient === activeEditingId)
    if (!client) return <></>

    return (
        <div className="grid grid-cols-4 gap-16">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Persona</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CÉDULA</strong></p>
                    <p>{client.person.identificationNumber}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE</strong></p>
                    <p>{
                        client.person.name + ' ' + 
                        client.person.firstLastName + ' ' + 
                        client.person.secondLastName
                    }</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>GÉNERO</strong></p>
                    <p>{client.person.gender.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>FECHA DE NACIMIENTO</strong></p>
                    <p>{formatDate(new Date(client.person.birthday))}</p>
                </div>
                
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Contacto</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TELÉFONO</strong></p>
                    <p>{client.person.phoneNumber}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NÚMERO DEL CONTACTO DE EMERGENCIA</strong></p>
                    <p>{formatNullable(client.phoneNumberContactEmergency)}</p>
                </div>

                
                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE DEL CONTACTO EMERGENCIA</strong></p>
                    <p>{formatNullable(client.nameEmergencyContact)}</p>
                </div>
                
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">SALUD</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>DIABETES</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.diabetes ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div> 

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>HIPERTENSIÓN</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.hypertension ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>LESIONES MUSCULARES</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.muscleInjuries ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div>
                
                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PROBLEMAS ARTICULARES</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.boneJointIssues ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PÉRDIDA DE EQUILIBRIO</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.balanceLoss ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>ENFERMEDADES CARDIOVASCULARES</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.cardiovascularDisease ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PROBLEMAS PARA RESPIRAR</strong></p>
                    <p className="flex text-center items-center gap-4">
                        {client.healthQuestionnaire.breathingIssues ? (
                            <> <CiCircleCheck className="text-green-400" /> Sí </>
                        ) : (
                            <> <MdOutlineCancel className="text-red-400" /> No </>
                        )}
                    </p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">TIPO</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE</strong></p>
                    <p>{client.typeClient.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PRECIO POR DÍA</strong></p>
                    <p>{formatAmountToCRC(client.typeClient.dailyCharge)}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PRECIO POR SEMANA</strong></p>
                    <p>{formatAmountToCRC(client.typeClient.weeklyCharge)}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PRECIO POR QUINCENA</strong></p>
                    <p>{formatAmountToCRC(client.typeClient.biweeklyCharge)}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>PRECIO POR MES</strong></p>
                    <p>{formatAmountToCRC(client.typeClient.monthlyCharge)}</p>
                </div>
                
            </div>
        </div>
    );
}

export default DataInfo;
