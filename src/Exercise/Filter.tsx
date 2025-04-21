import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import useExerciseStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterButton() {
    const { filterByStatus, filterByDifficulty, filterByCategory, showModalFilter } = useExerciseStore();

    const filteringStyles =(
        filterByStatus !== '' || filterByDifficulty !== '' || filterByCategory !== 0
    ) && ' bg-white outline-none'

    return (
        <button
            className={"flex items-center gap-4 text-lg uppercase outline-2 py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-slate-300" + filteringStyles}
            onClick={()=>{ showModalFilter() }}
        >
            <IoFilterOutline />
            <span>Filtrar</span>
        </button>
    );
}

export function FilterSelect() {
    const {
        filterByStatus,
        filterByDifficulty,
        filterByCategory,
        changeFilterByStatus,
        changeFilterByDifficulty,
        changeFilterByCategory,
        clearAllFilters
    } = useExerciseStore();

    const { exerciseCategories } = useCommonDataStore();

    const filteredStatusSelectStyles = filterByStatus !== '' && ' px-0.5 rounded-md border-2 border-yellow text-yellow';
    const filteredDifficultySelectStyles = filterByDifficulty !== '' && ' px-0.5 border-2 border-yellow text-yellow';
    const filteredCategorySelectStyles = filterByCategory !== 0 && ' px-0.5 border-2 border-yellow text-yellow';

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
                        const value = Number(e.target.value);
                        changeFilterByStatus(value === 0 ? '' : e.target.value);
                    }}
                >
                    <option value={0}>Activos</option>
                    <option value="Inactivos">Inactivos</option>
                    <option value="Todos">Todos</option>
                </select>
                {filterByStatus && (
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByStatus('')}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                )}
            </div>

            {/* Filtro por Dificultad */}
            <div className="flex items-center gap-4">
                <label htmlFor="difficulty" className="w-20">Dificultad</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredDifficultySelectStyles}
                    name="difficulty"
                    id="difficulty"
                    value={filterByDifficulty}
                    onChange={(e) => {
                        const value = e.target.value;
                        changeFilterByDifficulty(value === "0" ? '' : value);
                    }}
                >
                    <option value={0}>Todas</option>
                    <option value="Fácil">Fácil</option>
                    <option value="Media">Media</option>
                    <option value="Difícil">Difícil</option>
                </select>
                {filterByDifficulty && (
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByDifficulty('')}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                )}
            </div>

            {/* Filtro por Categoría */}
            <div className="flex items-center gap-4">
                <label htmlFor="category" className="w-20">Categoría</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredCategorySelectStyles}
                    name="category"
                    id="category"
                    value={filterByCategory}
                    onChange={(e) => changeFilterByCategory(Number(e.target.value))}
                >
                    <option value={0}>Todas</option>
                    {exerciseCategories.map((cat) => (
                        <option key={cat.idExerciseCategory} value={cat.idExerciseCategory}>
                            {cat.name}
                        </option>
                    ))}
                </select>
                {filterByCategory !== 0 && (
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByCategory(0)}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                )}
            </div>
        </div>
    );
}
