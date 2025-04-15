import { IoFilterOutline } from "react-icons/io5";
import { MdOutlineCancel } from "react-icons/md";
import useCategoryStore from "./Store";

export function FilterButton() {
    const { filterByStatus, showModalFilter } = useCategoryStore();
    const filteringStyles = filterByStatus !== "" && " bg-white outline-none";

    return (
        <button
            className={"flex items-center gap-4 text-lg uppercase outline-2 py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-slate-300" + filteringStyles}
            onClick={showModalFilter}
        >
            <IoFilterOutline />
            <span>Filtrar</span>
        </button>
    );
}

export function FilterSelect() {
    const {
        filterByStatus,
        changeFilterByStatus,
        clearAllFilters
    } = useCategoryStore();

    const filteredStatusSelectStyles = filterByStatus !== "" && " px-0.5 rounded-md border-2 border-yellow text-yellow";

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

            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus}
                    onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value === 0) {
                            changeFilterByStatus("");
                        } else {
                            changeFilterByStatus(e.target.value);
                        }
                    }}
                >
                    <option value={0}>Activos</option>
                    <option value={'Inactivos'}>Inactivos</option>
                    <option value={'Todos'}>Todos</option>
                </select>
                {filterByStatus && (
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByStatus("")}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                )}
            </div>
        </div>
    );
}
