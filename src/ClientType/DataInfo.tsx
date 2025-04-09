import useClientTypeStore from "./Store"; // Asegúrate de tener un store para el ClientType

function DataInfoClientType() {
    const { clientTypes, activeEditingId } = useClientTypeStore();  // Obtén los tipos de clientes y el ID del que está siendo editado.
    if (!activeEditingId) return <></>;  // Si no hay ID activo, no renderiza nada.

    const clientType = clientTypes.find(client => client.idClientType === activeEditingId);  // Busca el tipo de cliente con el ID activo.
    if (!clientType) return <></>;  // Si no se encuentra el tipo de cliente, no renderiza nada.

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Tipo de Cliente</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Nombre</strong></p>
                    <p>{clientType.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Detalles</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Estado</strong></p>
                    <p>{clientType.isDeleted === 0 ? "Activo" : "Inactivo"}</p>
                </div>

            </div>
        </div>
    );
}

export default DataInfoClientType;
