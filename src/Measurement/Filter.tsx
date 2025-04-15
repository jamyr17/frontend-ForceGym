import { IoFilterOutline } from "react-icons/io5";
import useMeasurementStore from "./Store";
import { MdOutlineCancel } from "react-icons/md";

export function FilterButton() {
    const { filterByStatus, filterByDateRangeMin, filterByDateRangeMax, showModalFilter } = useMeasurementStore();
    const filteringStyles = (
        filterByStatus !== '' || filterByDateRangeMin !== null || filterByDateRangeMax !== null
    ) && ' bg-white outline-none';

    return (
        <button
            className={"flex items-center gap-4 text-lg uppercase outline-2 py-2 px-4 rounded-lg hover:cursor-pointer hover:bg-slate-300" + filteringStyles}
            onClick={() => { showModalFilter(); }}
        >
            <IoFilterOutline />
            <span>Filtrar</span>
        </button>
    );
}

export function FilterSelect() {
    const { 
        filterByStatus, 
        filterByDateRangeMin, 
        filterByDateRangeMax, 
        changeFilterByStatus, 
        changeFilterByDateRangeMin, 
        changeFilterByDateRangeMax,
        clearAllFilters
    } = useMeasurementStore();
    
    const filteredStatusSelectStyles = filterByStatus !== '' && ' px-0.5 border-yellow text-yellow';
    const filteredDateRangeStyles = (filterByDateRangeMin !== null && filterByDateRangeMax !== null)  && ' px-0.5 border-yellow text-yellow';

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
                    className={'border rounded-md p-2 w-78 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus} 
                    onChange={(e) => changeFilterByStatus(e.target.value)}
                >
                    <option value={''}> Activos </option>
                    <option value={'Inactivos'}> Inactivos </option>
                    <option value={'Todos'}> Todos </option>
                </select>
                { filterByStatus && 
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => { changeFilterByStatus('') }}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>
    
            {/* Filtro por Fecha */}
            <div className="flex items-center gap-4">
                <label className="w-20">Fecha</label>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="dateMin" className="text-sm">Inicio</label>
                        <input
                            className={'border-2 w-36 p-1 text-center' + filteredDateRangeStyles}
                            name="dateMin"
                            id="dateMin"
                            type="date"
                            min={'2010-01-01'}
                            max={new Date().toISOString().split('T')[0]}
                            value={filterByDateRangeMin ? filterByDateRangeMin.toISOString().split('T')[0] : ''}
                            onChange={(e) => changeFilterByDateRangeMin(new Date(e.target.value))}
                        />
                    </div>
                    <span>-</span>
                    <div className="flex flex-col">
                        <label htmlFor="dateMax" className="text-sm">Final</label>
                        <input
                            className={'border-2 w-36 p-1 text-center' + filteredDateRangeStyles}
                            name="dateMax"
                            id="dateMax"
                            type="date"
                            min={'2010-01-01'}
                            max={new Date().toISOString().split('T')[0]}
                            value={filterByDateRangeMax ? filterByDateRangeMax.toISOString().split('T')[0] : ''}
                            onChange={(e) => changeFilterByDateRangeMax(new Date(e.target.value))}
                        />
                    </div>
                    {(filterByDateRangeMin !== null || filterByDateRangeMax !== null) && 
                        <button
                            className="text-2xl text-yellow"
                            onClick={() => { 
                                changeFilterByDateRangeMin(null); 
                                changeFilterByDateRangeMax(null); 
                            }}
                        >
                            <MdOutlineCancel className="hover:cursor-pointer" />
                        </button>
                    }
                </div>
            </div>
        </div>
    );
}
