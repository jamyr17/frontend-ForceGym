import useRoutineStore from "./Store"; // Tu nuevo store de rutinas

function DataInfo() {
    const { routines, activeEditingId } = useRoutineStore();
    if (!activeEditingId) return <></>;

    const routine = routines.find(routine => routine.idRoutine === activeEditingId);
    if (!routine) return <></>;

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Rutina</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Nombre</strong></p>
                    <p>{routine.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Detalles</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>Dificultad de Rutina</strong></p>
                    <p>{routine.difficultyRoutine.name}</p>
                </div>

            </div>
        </div>
    );
}

export default DataInfo;
