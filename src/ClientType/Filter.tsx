import { IoFilterOutline } from "react-icons/io5";
import useProductInventoryStore from "./Store";
import { MdOutlineCancel } from "react-icons/md";
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterButton() {
    const { filterByStatus, filterByClientType, showModalFilter } = useProductInventoryStore();
    const filteringStyles = (
        filterByStatus !== '' || filterByClientType !== 0
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
        filterByClientType,
        changeFilterByStatus, 
        changeFilterByClientType
    } = useProductInventoryStore();
    const filteredStatusSelectStyles = filterByStatus !== '' && ' px-0.5 rounded-md border-2 border-yellow text-yellow';
    const filteredClientTypeStyles = filterByClientType !== 0 && ' px-0.5 border-2 border-yellow text-yellow';
    const { clientTypes } = useCommonDataStore();

    return (
        <div className="flex flex-col gap-4">
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
                    <option value={0}> Activos </option>
                    <option value={'Inactivos'}> Inactivos </option>
                    <option value={'Todos'}> Todos </option>
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

            {/* Filtro por Tipo de Cliente */}
            <div className="flex items-center gap-4">
                <label htmlFor="clientType" className="w-20">Tipo de Cliente</label>
                <select
                    className={'border rounded-md p-2 w-52 text-center' + filteredClientTypeStyles}
                    name="clientType"
                    id="clientType"
                    value={filterByClientType}
                    onChange={(e) => changeFilterByClientType(+e.target.value)}
                >
                    <option value={0}>Todos</option>

                    {clientTypes.map((client) => (
                        <option key={client.idClientType} value={client.idClientType}>
                            {client.clientTypeName}
                        </option>
                    ))}
                </select>
                {filterByClientType &&
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => changeFilterByClientType(0)}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>
        </div>
    );
}
