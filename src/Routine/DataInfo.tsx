import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";

function DataInfo() {
    const { routines, activeEditingId } = useRoutineStore();
    const { difficultyRoutines, exercise } = useCommonDataStore();
    
    if (!activeEditingId) return <></>;

    const routine = routines.find(r => r.idRoutine === activeEditingId);
    if (!routine) return <></>;

    const getExerciseDetails = (idExercise: number) => {
        const exerciseConstan = exercise.find(ex => ex.idExercise === idExercise);
        return exerciseConstan || { name: "Ejercicio no encontrado", series: 0, repetitions: 0 };
    };

    return (
        <div className="grid grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">RUTINA</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <div className="mb-4">
                        <p className="font-semibold">Nombre:</p>
                        <p>{routine.name}</p>
                    </div>
                    
                    <div>
                        <p className="font-semibold">Dificultad:</p>
                        <p>{routine.difficultyRoutine.name}</p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">EJERCICIOS</h1>

                {routine.exercises && routine.exercises.length > 0 ? (
                    <div className="space-y-4">
                        {routine.exercises.map((exercise, index) => {
                            const details = getExerciseDetails(
                                Array.isArray(exercise.idExercise) ? 
                                exercise.idExercise[0] : exercise.idExercise
                            );
                            
                            return (
                                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <p className="font-semibold">Ejercicio:</p>
                                            <p>{details.name}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Series:</p>
                                            <p>{exercise.series}</p>
                                        </div>
                                        <div>
                                            <p className="font-semibold">Repeticiones:</p>
                                            <p>{exercise.repetitions}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <p className="text-gray-500">No hay ejercicios definidos</p>
                )}
            </div>
        </div>
    );
}

export default DataInfo;