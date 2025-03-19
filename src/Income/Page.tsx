import { MdModeEdit, MdOutlineDelete, MdOutlineFileDownload, MdOutlineSettingsBackupRestore } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import { useEconomicIncomeStore } from './Store'
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import Form from "./Form";
import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { useEconomicIncome } from "./useIncome";
import { mapEconomicIncomeToDataForm } from "../shared/types/mapper";
import DataInfo from "./DataInfo";
import { FilterButton, FilterSelect } from "./Filter";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function EconomicIncomeManagement() {
    const {
        economicIncomes,
        modalForm,
        modalFilter,
        modalInfo,
        page,
        size,
        totalRecords,
        orderBy,
        directionOrderBy,
        searchType,
        searchTerm,
        filterByStatus,
        filterByAmountRangeMin,
        filterByAmountRangeMax,
        filterByDateRangeMin,
        filterByDateRangeMax,
        filterByMeanOfPayment,
        filterByClientType,
        fetchEconomicIncomes,
        getEconomicIncomeById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useEconomicIncomeStore()

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore  } = useEconomicIncome()
    const navigate = useNavigate()

    const exportToPDF = () => {
        const doc = new jsPDF();   
        doc.setFont("helvetica");
        doc.text("Reporte de Ingresos Económicos", 14, 10);
    
        const tableColumn = ["#", "Voucher", "Cliente", "Fecha", "Monto", "Método de Pago"];
        
        const tableRows = economicIncomes.map((income, index) => [
            index + 1,
            income.voucherNumber !== '' ? income.voucherNumber : "No adjunto",
            `${income.client.person.name} ${income.client.person.firstLastName} ${income.client.person.secondLastName}`,
            formatDate(new Date(income.registrationDate)),
            formatAmountToCRC(income.amount),  // Aquí formateas con ₡
            income.meanOfPayment.name,
        ]);
    
         autoTable(doc, { 
             head: [tableColumn],
             body: tableRows,
             startY: 20,
         });

        doc.save("ingresos.pdf");
    };
    

    useEffect(() => {}, [economicIncomes])
    
    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchEconomicIncomes()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login')
            }    

        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByAmountRangeMin, filterByAmountRangeMax, filterByDateRangeMin, filterByDateRangeMax, filterByMeanOfPayment, filterByClientType])

    return ( 
        <div className="bg-black h-full w-full">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">INGRESOS</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Voucher</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Detalle</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={3} defaultChecked={searchType===3}>Cliente</option>
                </SearchInput>
                <ModalFilter modalFilter={modalFilter} closeModalFilter={closeModalFilter} FilterButton={FilterButton} FilterSelect={FilterSelect} />
            </header>

            <main className="justify-items-center ml-12 p-4">
                <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full overflow-scroll">
                    <div className="flex justify-between">
                        <Modal
                            Button={() => (
                                <button
                                    className="mt-4 ml-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer"
                                    type="button"
                                    onClick={showModalForm}
                                >
                                + Añadir
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getEconomicIncomeById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />

                       {economicIncomes?.length>0 &&
                         <button 
                         onClick={exportToPDF} 
                         className="flex gap-2 items-center text-end mt-4 mr-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer">
                         <MdOutlineFileDownload /> Descargar
                        </button>
                        }
                    </div>
                    
                    {economicIncomes?.length>0 ? (
                    <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-700 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('voucherNumber')}}
                                >
                                    VOUCHER  
                                    {(orderBy==='voucherNumber' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='voucherNumber' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th>CLIENTE</th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('registrationDate')}}
                                >
                                    FECHA  
                                    {(orderBy==='registrationDate' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='registrationDate' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('amount')}}
                                >
                                    MONTO  
                                    {(orderBy==='amount' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='amount' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>

                                <th>MÉTODO DE PAGO</th>
                                {filterByStatus && <th>ESTADO</th>}

                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {economicIncomes?.map((economicIncome, index) => (
                            <tr key={economicIncome.idEconomicIncome} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{economicIncome.voucherNumber!='' ? economicIncome.voucherNumber : 'No adjunto'}</td>
                                <td className="py-2">{economicIncome.client.person.name + ' ' + economicIncome.client.person.firstLastName + ' ' + economicIncome.client.person.secondLastName}</td>
                                <td className="py-2">{formatDate(new Date(economicIncome.registrationDate))}</td>
                                <td className="py-2">{formatAmountToCRC(economicIncome.amount)}</td>
                                <td className="py-2">{economicIncome.meanOfPayment.name}</td>
                                {filterByStatus && (
                                <td>
                                    {economicIncome.isDeleted ? (
                                    <button className="py-0.5 px-2 rounded-lg bg-red-500 text-white">Inactivo</button>
                                    ) : (
                                    <button className="py-0.5 px-2 rounded-lg bg-green-500 text-white">Activo</button>
                                    )}
                                </td>
                                )}
                                <td className="flex gap-4 justify-center py-2">
                                <Modal
                                    Button={() => (
                                        <button
                                            onClick={() => {
                                                getEconomicIncomeById(economicIncome.idEconomicIncome);
                                                showModalInfo();
                                            }}
                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                            title="Ver detalles"
                                        >
                                            <IoIosMore className="text-white" />
                                        </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getEconomicIncomeById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                <button
                                    onClick={() => {
                                        getEconomicIncomeById(economicIncome.idEconomicIncome);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                                {economicIncome.isDeleted ? (
                                    <button onClick={() => handleRestore(mapEconomicIncomeToDataForm(economicIncome))} className="p-2 bg-black rounded-sm hover:bg-slate-300 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleDelete(economicIncome)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Eliminar">
                                    <MdOutlineDelete className="text-white" />
                                    </button>
                                )}
                                </td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                    ) : 
                    (
                        <NoData module="ingresos económicos" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default EconomicIncomeManagement;