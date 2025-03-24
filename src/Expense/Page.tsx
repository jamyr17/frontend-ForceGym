import { MdModeEdit, MdOutlineDelete, MdOutlineFileDownload, MdOutlineSettingsBackupRestore } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import { useEconomicExpenseStore } from './Store'
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { mapEconomicExpenseToDataForm } from "../shared/types/mapper";
import { FilterButton, FilterSelect } from "./Filter";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { useEconomicExpense } from "./useExpense";
import Form from "./Form";
import DataInfo from "./DataInfo";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";


function EconomicExpenseManagement() {
    const {
        economicExpenses,
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
        filterByCategory,
        fetchEconomicExpenses,
        getEconomicExpenseById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useEconomicExpenseStore()

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore  } = useEconomicExpense()
    const navigate = useNavigate()
    
    const exportToPDF = () => {
        const doc = new jsPDF();
        doc.setFont("helvetica");
        doc.text("Reporte de Gastos", 14, 10);

        const tableColumn = ["#", "Voucher", "Fecha", "Monto", "Método de Pago", "Categoría"];
        const tableRows = economicExpenses.map((expense, index) => [
            index + 1,
            expense.voucherNumber || "No adjunto",
            formatDate(new Date(expense.registrationDate)),
            formatAmountToCRC(expense.amount), 
            expense.meanOfPayment.name,
            expense.category.name
        ]);
        autoTable(doc, { 
            head: [tableColumn],
            body: tableRows,
            startY: 20,
        });

        doc.save("gastos.pdf");
    };

    const exportToExcel = () => {
        // Encabezados de la tabla
        const tableColumn = ["#", "Voucher", "Fecha", "Monto", "Método de Pago", "Categoría"];

        // Mapeo de los datos
        const tableRows = economicExpenses.map((expense, index) => [
            index + 1,
            expense.voucherNumber !== '' ? expense.voucherNumber : "No adjunto",
            formatDate(new Date(expense.registrationDate)),
            expense.amount, 
            expense.meanOfPayment.name,
            expense.category.name,
        ]);

        // Crear worksheet y workbook
        const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Gastos Económicos");

        // Descargar
        XLSX.writeFile(wb, "gastos.xlsx");
    };


    useEffect(() => {}, [economicExpenses])
    
        useEffect(() => {
            const fetchData = async () => {
                const { logout } = await fetchEconomicExpenses()
    
                if(logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }    
    
            }
            
            fetchData()
        }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByAmountRangeMin, filterByAmountRangeMax, filterByDateRangeMin, filterByDateRangeMax, filterByMeanOfPayment, filterByCategory ])

    return ( 
        <div className="bg-black h-full w-full">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">GASTOS</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Voucher</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Detalle</option>
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
                            getDataById={getEconomicExpenseById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />

                     {economicExpenses?.length > 0 && (
                            <div className="flex gap-2">
                            <button 
                                onClick={exportToPDF} 
                            className="flex gap-2 items-center text-end mt-4 mr-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer">
                         <MdOutlineFileDownload /> Descargar PDF
                            </button>
                            <button 
                                onClick={exportToExcel} 
                                className="flex gap-2 items-center text-end mt-4 mr-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer">
                            <MdOutlineFileDownload /> Descargar Excel
                                </button>
                            </div>
                           )} 
                    </div>
                    
                    {economicExpenses?.length>0 ? (
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
                                <th>CATEGORÍA</th>
                                {filterByStatus && <th>ESTADO</th>}

                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {economicExpenses?.map((economicExpense, index) => (
                            <tr key={economicExpense.idEconomicExpense} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{economicExpense.voucherNumber!='' ? economicExpense.voucherNumber : 'No adjunto'}</td>
                                <td className="py-2">{formatDate(new Date(economicExpense.registrationDate))}</td>
                                <td className="py-2">{formatAmountToCRC(economicExpense.amount)}</td>
                                <td className="py-2">{economicExpense.meanOfPayment.name}</td>
                                <td className="py-2">{economicExpense.category.name}</td>
                                {filterByStatus && (
                                <td>
                                    {economicExpense.isDeleted ? (
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
                                                getEconomicExpenseById(economicExpense.idEconomicExpense);
                                                showModalInfo();
                                            }}
                                            className="p-2 bg-black rounded-sm hover:bg-slate-300 hover:cursor-pointer"
                                        >
                                            <IoIosMore className="text-white" />
                                        </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getEconomicExpenseById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                <button
                                    onClick={() => {
                                        getEconomicExpenseById(economicExpense.idEconomicExpense);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                                {economicExpense.isDeleted ? (
                                    <button onClick={() => handleRestore(mapEconomicExpenseToDataForm(economicExpense))} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleDelete(economicExpense)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
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
                        <NoData module="gastos económicos" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default EconomicExpenseManagement;