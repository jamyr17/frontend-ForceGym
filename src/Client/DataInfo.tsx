import { useCallback } from "react";
import { formatAmountToCRC, formatDate, formatNullable } from "../shared/utils/format";
import useClientStore from "./Store";
import { CiCircleCheck } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";

function DataInfo() {
    const { clients, activeEditingId } = useClientStore();

    const client = clients.find(client => client.idClient === activeEditingId);

    const getValidSignature = useCallback(() => {
        if (!client?.signatureImage) return null;

        try {
            if (client.signatureImage.startsWith('data:image/png;base64,')) {
                return client.signatureImage;
            }

            if (/^[A-Za-z0-9+/=]+$/.test(client.signatureImage)) {
                return `data:image/png;base64,${client.signatureImage}`;
            }

            const decoded = decodeURIComponent(client.signatureImage);
            if (decoded.startsWith('data:image')) {
                return decoded;
            }

            return null;
        } catch (error) {
            console.error('Error al procesar firma:', error);
            return null;
        }
    }, [client]);

    const validSignature = getValidSignature();

    const handleDownload = useCallback(() => {
        if (!validSignature || !client) return;

        try {
            const link = document.createElement('a');
            link.href = validSignature;
            link.download = `firma-${client.person.identificationNumber}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            console.error('Error al descargar firma:', error);
        }
    }, [validSignature, client]);

    if (!activeEditingId || !client) return <></>;

    // Renderizado de la firma
    const renderSignature = () => {
        if (!validSignature) {
            return <p className="text-gray-500">No hay firma registrada</p>;
        }
    }

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
                    <p>{client.clientType.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>FIRMA DEL CLIENTE</strong></p>
                    {client.signatureImage ? (
                        <div className="border border-gray-300 p-2 rounded-md">
                            <img
                                src={client.signatureImage}
                                alt="Firma del cliente"
                                className="max-w-full h-auto"
                            />
                        </div>
                    ) : (
                        <p className="text-gray-500">No hay firma registrada</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default DataInfo;