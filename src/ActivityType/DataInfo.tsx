import useActivityTypeStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore"; 

function DataInfo() {
    const { activityTypes, activeEditingId } = useActivityTypeStore();
    const { clientTypes } = useCommonDataStore();
    
    if (!activeEditingId) return <></>;

    const activityType = activityTypes.find(activity => activity.idActivityType === activeEditingId);
    if (!activityType) return <></>;

    const getClientTypeName = (id: number) => {
        const clientType = clientTypes.find(type => type.idClientType === id);
        return clientType ? clientType.name : `Tipo ${id}`;
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">ACTIVIDAD</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p>{activityType.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Tarifas</h1>

                {activityType.fees && activityType.fees.length > 0 ? (
                    <div className="space-y-4">
                        {activityType.fees.map((fee, index) => (
                            <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                <div className="grid grid-cols-2 gap-2">
                                    <div>
                                        <p className="font-semibold">Tipo de cliente:</p>
                                        <p>
                                            {fee.idClientType.map(id => getClientTypeName(id)).join(', ')}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="font-semibold">Precio:</p>
                                        <p>{`CRC ${fee.amount.toLocaleString()}`}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay tarifas definidas</p>
                )}
            </div>
        </div>
    );
}

export default DataInfo;