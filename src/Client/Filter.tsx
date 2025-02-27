import { IoFilterOutline } from "react-icons/io5";
import useClientStore from "./Store";
import { MdOutlineCancel } from "react-icons/md";
import { useCommonDataStore } from "../shared/CommonDataStore";

export function FilterButton() {
    const { 
        showModalFilter,
        filterByStatus, 
        filterByBalanceLoss,
        filterByBoneJointIssues,
        filterByBreathingIssues,
        filterByCardiovascularDisease,
        filterByDiabetes,
        filterByMuscleInjuries,
        filterByHypertension,
        filterByBirthDateRangeMax,
        filterByBirthDateRangeMin,
        filterByClientType
    } = useClientStore()
    const filteringStyles = (
        filterByStatus!='' || filterByBalanceLoss!=null || filterByBoneJointIssues!=null || filterByBreathingIssues!=null || filterByCardiovascularDisease!=null
        || filterByDiabetes!=null || filterByMuscleInjuries!=null || filterByHypertension!=null || filterByBirthDateRangeMax!=null || filterByBirthDateRangeMin!=null
        || filterByClientType!=-1
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
        filterByBalanceLoss,
        filterByBoneJointIssues,
        filterByBreathingIssues,
        filterByCardiovascularDisease,
        filterByDiabetes,
        filterByMuscleInjuries,
        filterByHypertension,
        filterByBirthDateRangeMax,
        filterByBirthDateRangeMin,
        filterByClientType,
        changeFilterByBalanceLoss,
        changeFilterByBirthDateRangeMax,
        changeFilterByBirthDateRangeMin,
        changeFilterByBoneJointIssues,
        changeFilterByBreathingIssues,
        changeFilterByCardiovascularDisease,
        changeFilterByDiabetes,
        changeFilterByHypertension,
        changeFilterByMuscleInjuries,
        changeFilterByStatus,
        changeFilterByClientType
    } = useClientStore();

    const filteredStatusSelectStyles = filterByStatus !== '' && ' px-0.5 border-yellow text-yellow';
    const filteredBirthDateRangeStyles = (filterByBirthDateRangeMin !== null && filterByBirthDateRangeMax !== null)  && ' px-0.5 border-yellow text-yellow';
    const filteredClientTypeSelectStyles = filterByClientType !== -1 && ' px-0.5 border-yellow text-yellow';

    const { typesClient } = useCommonDataStore();
    const filters = [
        { label: "Diabetes", state: filterByDiabetes, changeState: changeFilterByDiabetes },
        { label: "Hipertensión", state: filterByHypertension, changeState: changeFilterByHypertension },
        { label: "Lesiones musculares", state: filterByMuscleInjuries, changeState: changeFilterByMuscleInjuries },
        { label: "Pérdida de equilibrio", state: filterByBalanceLoss, changeState: changeFilterByBalanceLoss },
        { label: "Problemas óseos/articulares", state: filterByBoneJointIssues, changeState: changeFilterByBoneJointIssues },
        { label: "Problemas respiratorios", state: filterByBreathingIssues, changeState: changeFilterByBreathingIssues },
        { label: "Enfermedad cardiovascular", state: filterByCardiovascularDisease, changeState: changeFilterByCardiovascularDisease },
    ];

    return (
        <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
                <label htmlFor="status" className="w-20">Estado</label>
                <select 
                    className={'border rounded-md p-2 w-78 text-center' + filteredStatusSelectStyles}
                    name="status"
                    id="status"
                    value={filterByStatus} 
                    onChange={(e) => changeFilterByStatus(e.target.value || '')}
                >
                    <option value=""> Activos </option>
                    <option value="Inactivos"> Inactivos </option>
                    <option value="Todos"> Todos </option>
                </select>
                {filterByStatus && 
                    <button className="text-2xl text-yellow" onClick={() => changeFilterByStatus('')}>
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>

            <div className="flex items-center gap-4">
                <label htmlFor="idTypeClient" className="w-20">Tipo de Cliente</label>
                <select
                    id="idTypeClient"
                    className={"border rounded-md p-2 w-78 text-center" + filteredClientTypeSelectStyles}
                    value={filterByClientType}
                    onChange={(e) => changeFilterByClientType(+e.target.value)}
                >
                    <option value={-1}>Todos</option>

                    {typesClient.map((type)=> (
                        <option key={type.idTypeClient} value={type.idTypeClient}>
                            {type.name}
                        </option>
                    ))}
                </select>
                {filterByClientType!=-1 && 
                    <button className="text-2xl text-yellow" onClick={() => changeFilterByClientType(-1)}>
                        <MdOutlineCancel className="hover:cursor-pointer" />
                    </button>
                }
            </div>

            {filters.map(({ label, state, changeState }) => (
                <div key={label} className="flex items-center gap-4">
                    <label className="w-40">{label}</label>
                    <div className="flex items-center gap-2">
                        <label htmlFor={`${label}Yes`} className="w-20">Sí</label>
                        <input id={`${label}Yes`} type="radio" checked={state === true} onChange={() => changeState(true)} />
                        <label htmlFor={`${label}No`} className="w-20">No</label>
                        <input id={`${label}No`} type="radio" checked={state === false} onChange={() => changeState(false)} />
                        {state !== null && 
                            <button className="text-2xl text-yellow" onClick={() => changeState(null)}>
                                <MdOutlineCancel className="hover:cursor-pointer" />
                            </button>
                        }
                    </div>
                </div>
            ))}

            <div className="flex items-center gap-4">
                <label className="w-20">Fecha de nacimiento</label>
                <div className="flex items-center gap-2">
                    <div className="flex flex-col">
                        <label htmlFor="dateMin" className="text-sm">Inicio</label>
                        <input
                            className={'border-2 w-36 p-1 text-center' + filteredBirthDateRangeStyles}
                            name="dateMin"
                            id="dateMin"
                            type="date"
                            min={'2010-01-01'}
                            max={new Date().toISOString().split('T')[0]}
                            value={filterByBirthDateRangeMin ? filterByBirthDateRangeMin.toISOString().split('T')[0] : ''}
                            onChange={(e) => changeFilterByBirthDateRangeMin(new Date(e.target.value))}
                        />
                    </div>
                    <span>-</span>
                    <div className="flex flex-col">
                        <label htmlFor="dateMax" className="text-sm">Final</label>
                        <input
                            className={'border-2 w-36 p-1 text-center' + filteredBirthDateRangeStyles}
                            name="dateMax"
                            id="dateMax"
                            type="date"
                            min={'2010-01-01'}
                            max={new Date().toISOString().split('T')[0]}
                            value={filterByBirthDateRangeMax ? filterByBirthDateRangeMax.toISOString().split('T')[0] : ''}
                            onChange={(e) => changeFilterByBirthDateRangeMax(new Date(e.target.value))}
                        />
                    </div>
                    {(filterByBirthDateRangeMin !== null || filterByBirthDateRangeMax !== null) && 
                        <button
                            className="text-2xl text-yellow"
                            onClick={() => { 
                                changeFilterByBirthDateRangeMin(null); 
                                changeFilterByBirthDateRangeMax(null);
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
