import { useEffect } from "react"
import useClientTypeStore from "./Store"
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md"
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Pagination from "../shared/components/Pagination"
import { useClientType } from "./useClientType"
import SearchInput from "../shared/components/SearchInput"
import ModalFilter from "../shared/components/ModalFilter"
import { FilterButton, FilterSelect } from "./Filter"
import Modal from "../shared/components/Modal"
import Form from "./Form"
import DataInfo from "./DataInfo";
import { mapClientTypeToDataForm } from "../shared/types/mapper";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";

function ClientTypeManagement() {
    const {
        clientTypes,
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
        fetchClientTypes,
        getClientTypeById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useClientTypeStore();

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore } = useClientType()
    const navigate = useNavigate()

    useEffect(() => {}, [clientTypes])

    useEffect(() => {
        const fetchData = async () => {
            await fetchClientTypes()
        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus])

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Tipos de Cliente</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>ID</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Nombre</option>
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
                            getDataById={getClientTypeById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>
                    
                    {clientTypes?.length > 0 ? (
                    <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('name')}}
                                >
                                    NOMBRE  
                                    {(orderBy==='name' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='name' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>

                                {filterByStatus && <th>ESTADO</th>}

                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {clientTypes?.map((clientType, index) => (
                            <tr key={clientType.idClientType} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{clientType.name}</td> 
                                {filterByStatus && (
                                <td>
                                    {clientType.isDeleted ? (
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
                                                getClientTypeById(clientType.idClientType);
                                                showModalInfo();
                                            }}
                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                            title="Ver detalles"
                                        >
                                            <IoIosMore className="text-white" />
                                        </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getClientTypeById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                <button
                                    onClick={() => {
                                        getClientTypeById(clientType.idClientType);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                                {clientType.isDeleted ? (
                                    <button onClick={() => handleRestore(mapClientTypeToDataForm(clientType))} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : ( 
                                    <button 
                                        onClick={() => handleDelete(clientType)} 
                                        className="p-2 rounded-sm hover:cursor-pointer bg-black hover:bg-gray-700"
                                        title="Eliminar"
                                    >
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
                        <NoData module="tipos de cliente" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default ClientTypeManagement;