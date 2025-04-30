import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterButton() {
    const { filterByStatus, filterByDifficultyRoutine, showModalFilter } = useRoutineStore();
    const filteringStyles = (
        filterByStatus !== '' || filterByDifficultyRoutine!=0
    ) && ' bg-white outline-none';

    return (
        <button
            className={"flex items-center gap-4 text-lg uppercase outline-2 py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-slate-300" + filteringStyles}
            onClick={() => { showModalFilter() }}
        >
            <IoFilterOutline />
            <span>Filtrar</span>
        </button>
    );
}

export function FilterSelect() {
    const { 
        filterByStatus, 
        filterByDifficultyRoutine,
        changeFilterByStatus, 
        changeFilterByDifficultyRoutine,
        clearAllFilters
    } = useRoutineStore();
    const { difficultyRoutines } = useCommonDataStore();

    const filteredStatusSelectStyles = filterByStatus !== '' && ' px-0.5 rounded-md border-2 border-yellow text-yellow';
    const filteredRoutineTypeStyles = filterByDifficultyRoutine !== 0 && ' px-0.5 border-2 border-yellow text-yellow';

    return (
        <div className="flex flex-col gap-4">
            {/* Botón de limpiar todos */}
            <div className="flex justify-end pr-4">
                <button
                    className="text-yellow border border-yellow px-3 py-1 rounded-md hover:bg-yellow hover:text-black transition-all"
                    onClick={clearAllFilters}
                >
                    Limpiar todos los filtros
                </button>
            </div>

            {/* Filtro por Estado */}
            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus}
                    onChange={(e) => {
                        if (Number(e.target.value) === 0) {
                            changeFilterByStatus('');
                        } else {
                            changeFilterByStatus(e.target.value);
                        }
                    }}
                >
                    <option value={0}>Activos</option>
                    <option value={'Inactivos'}>Inactivos</option>
                    <option value={'Todos'}>Todos</option>
                </select>
                {filterByStatus && 
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByStatus('')}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>

            {/* Filtro por Tipo de Rutina */}
            <div className="flex items-center gap-4">
                <label htmlFor="routineType" className="w-20">Tipo de Rutina</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredRoutineTypeStyles}
                    name="routineType"
                    id="routineType"
                    value={filterByDifficultyRoutine}
                    onChange={(e) => changeFilterByDifficultyRoutine(+e.target.value)}
                >
                    <option value={0}>Todos</option>
                    {difficultyRoutines.map((routine) => (
                        <option key={routine.idDifficultyRoutine} value={routine.idDifficultyRoutine}>
                            {routine.name}
                        </option>
                    ))}
                </select>
                {filterByDifficultyRoutine &&
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByDifficultyRoutine(0)}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>
        </div>
    );
}
