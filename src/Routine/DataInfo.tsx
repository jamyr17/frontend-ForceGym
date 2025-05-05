import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";

function DataInfo() {
    const { routineToEdit } = useRoutineStore();
    const { difficultyRoutines, exercise } = useCommonDataStore();

    if (!routineToEdit) return <div className="text-gray-500 p-4">No hay rutina seleccionada</div>;


    const getExerciseDetails = (ex) => {
        const globalExercise = exercise.find(e => e.idExercise === ex.idExercise);
        
        return {
            name: globalExercise?.name || `Ejercicio #${ex.idExercise}`,
            series: ex.series || 0,
            repetitions: ex.repetitions || 0
        };
    };

    const getDifficultyName = (idDifficulty) => {
        const difficulty = difficultyRoutines.find(d => d.idDifficultyRoutine === idDifficulty);
        return difficulty?.name || `Dificultad #${idDifficulty}`;
    };

    const exercises = routineToEdit.exercises || [];

    return (
        <div className="grid grid-cols-2 gap-6 p-4">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-4 underline">RUTINA</h1>

                <div className="flex flex-col gap-4 text-lg">
                    <div>
                        <p className="font-semibold">Nombre:</p>
                        <p className="text-gray-700">{routineToEdit.name}</p>
                    </div>
                    
                    <div>
                        <p className="font-semibold">Dificultad:</p>
                        <p className="text-gray-700">
                            {getDifficultyName(routineToEdit.difficultyRoutine.idDifficultyRoutine)}
                        </p>
                    </div>
                    
                    <div>
                        <p className="font-semibold">Fecha:</p>
                        <p className="text-gray-700">
                            {new Date(routineToEdit.date).toLocaleDateString()}
                        </p>
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-4 underline">EJERCICIOS</h1>

                {exercises.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {exercises.map((ex, index) => {
                            const details = getExerciseDetails(ex);
                            
                            return (
                                <div key={`${ex.idExercise}-${index}`} className="bg-gray-50 p-3 rounded-md border">
                                    <h4 className="font-medium text-lg text-gray-800">
                                        {details.name}
                                    </h4>
                                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                                        <div>
                                            <span className="font-medium">Series:</span> {details.series}
                                        </div>
                                        <div>
                                            <span className="font-medium">Repeticiones:</span> {details.repetitions}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="bg-gray-50 p-4 rounded-md border text-center">
                        <p className="text-gray-500">No hay ejercicios en esta rutina</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DataInfo;