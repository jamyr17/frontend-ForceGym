import { IoFilterOutline } from "react-icons/io5";
import useEconomicExpenseStore from "./Store";
import { MdOutlineCancel } from "react-icons/md";
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterButton() {
    const { filterByStatus, filterByAmountRangeMin, filterByAmountRangeMax, filterByDateRangeMin, filterByDateRangeMax, filterByMeanOfPayment, showModalFilter } = useEconomicExpenseStore()
    const filteringStyles = (
        filterByStatus!='' || filterByAmountRangeMin!=0 || filterByAmountRangeMax!=0 || filterByDateRangeMin!=null || filterByDateRangeMax!=null || filterByMeanOfPayment!=0
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
        filterByAmountRangeMin, 
        filterByAmountRangeMax, 
        filterByDateRangeMin, 
        filterByDateRangeMax, 
        filterByMeanOfPayment,
        changeFilterByStatus, 
        changeFilterByAmountRangeMin,
        changeFilterByAmountRangeMax,
        changeFilterByDateRangeMin, 
        changeFilterByDateRangeMax,
        changeFilterByMeanOfPayment
    } = useEconomicExpenseStore()
    const filteredStatusSelectStyles = filterByStatus!='' && ' px-0.5 border-yellow text-yellow'
    const filteredMeanOfPaymentStyles = filterByMeanOfPayment!=0 && ' px-0.5 border-yellow text-yellow'
    const filteredAmountRangeStyles = (filterByAmountRangeMin!=0 && filterByAmountRangeMax!=0)  && ' px-0.5 border-yellow text-yellow'
    const filteredDateRangeStyles = (filterByDateRangeMin !=null && filterByDateRangeMax!=null)  && ' px-0.5 border-yellow text-yellow'
    const { meansOfPayment } = useCommonDataStore()

    return (
        <div className="flex flex-col gap-4">
            {/* Filtro por Estado */}
            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select 
                    className={'border rounded-md p-2 w-78 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus} 
                    onChange={(e) => {
                        if(Number(e.target.value) === 0){
                            changeFilterByStatus('')
                        }else{
                            changeFilterByStatus(e.target.value)
                        }
                    }}
                >
                    <option value={0}> Activos </option>
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

            {/* Filtro por tipo de pago */}
            <div className="flex items-center gap-4">
                <label htmlFor="idMeanOfPayment" className="w-20">
                    Medio de Pago 
                </label>
                <select
                    id="idMeanOfPayment"
                    value={filterByMeanOfPayment} 
                    className={'border rounded-md p-2 w-78 text-center' + filteredMeanOfPaymentStyles}
                    onChange={(e) => {changeFilterByMeanOfPayment(+e.target.value)}}
                >
                    {meansOfPayment.map((meanOfPayment)=> (
                        <option key={meanOfPayment.idMeanOfPayment} value={meanOfPayment.idMeanOfPayment}>
                            {meanOfPayment.name}
                        </option>
                    ))}
                </select>
                { filterByMeanOfPayment!=0 && 
                    <button
                        className="text-2xl text-yellow"
                        onClick={() => { changeFilterByMeanOfPayment(0) }}
                    >
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>
    
            {/* Filtro por Monto */}
            <div className="flex items-center gap-4">
                <label className="w-20">Monto</label>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="amountMin" className="text-sm">Mínimo</label>
                        <input
                            className={'border-2 w-36 p-1 text-center' + filteredAmountRangeStyles}
                            name="amountMin"
                            id="amountMin"
                            type="number"
                            min={1}
                            value={filterByAmountRangeMin}
                            onChange={(e) => changeFilterByAmountRangeMin(+e.target.value)}
                        />
                    </div>
                    <span>-</span>
                    <div className="flex flex-col">
                        <label htmlFor="amountMax" className="text-sm">Máximo</label>
                        <input
                            className={'border-2 w-36 p-1 text-center' + filteredAmountRangeStyles}
                            name="amountMax"
                            id="amountMax"
                            type="number"
                            value={filterByAmountRangeMax}
                            onChange={(e) => changeFilterByAmountRangeMax(+e.target.value)}
                        />
                    </div>
                    {(filterByAmountRangeMin !== 0 || filterByAmountRangeMax !== 0) && 
                        <button
                            className="text-2xl text-yellow"
                            onClick={() => { 
                                changeFilterByAmountRangeMin(0) 
                                changeFilterByAmountRangeMax(0)
                            }}
                        >
                            <MdOutlineCancel className="hover:cursor-pointer" />
                        </button>
                    }
                </div>
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
                                changeFilterByDateRangeMin(null) 
                                changeFilterByDateRangeMax(null)
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
