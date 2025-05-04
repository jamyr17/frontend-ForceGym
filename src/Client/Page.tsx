import { MdModeEdit, MdOutlineDelete, MdOutlineFileDownload, MdOutlineSettingsBackupRestore } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import FileTypeDecision from "../shared/components/ModalFileType"
import SearchInput from "../shared/components/SearchInput";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import { useClientStore } from './Store'
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { LuPencilRuler } from "react-icons/lu";
import { mapClientToDataForm } from "../shared/types/mapper";
import { FilterButton, FilterSelect } from "./Filter";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate, Link } from "react-router";
import { useClient } from "./useClient";
import Form from "./Form/MultiStepForm";
import DataInfo from "./DataInfo";
import { exportToPDF } from "../shared/utils/pdf";

function ClientManagement() {
    const {
        clients,
        modalForm,
        modalFilter,
        modalInfo,
        modalFileTypeDecision,
        page,
        size,
        totalRecords,
        orderBy,
        directionOrderBy,
        searchType,
        searchTerm,
        filterByStatus,
        filterByBalanceLoss,
        filterByBirthDateRangeMax,
        filterByBirthDateRangeMin,
        filterByBoneJointIssues,
        filterByBreathingIssues,
        filterByCardiovascularDisease,
        filterByClientType,
        filterByDiabetes,
        filterByHypertension,
        filterByMuscleInjuries,
        fetchClients,
        getClientById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
        showModalFileType,
        closeModalFileType
    } = useClientStore()
    
    const { handleDelete, handleSearch, handleOrderByChange, handleRestore, exportToExcel, pdfTableHeaders, pdfTableRows } = useClient()
    const navigate = useNavigate()
    
    useEffect(() => {}, [clients])
    
        useEffect(() => {
            const fetchData = async () => {
                const { logout } = await fetchClients()
    
                if(logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }    
    
            }
            
            fetchData()
        }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByBalanceLoss, filterByBirthDateRangeMax, filterByBirthDateRangeMin, filterByBoneJointIssues, filterByBreathingIssues, filterByCardiovascularDisease, filterByClientType, filterByDiabetes, filterByHypertension, filterByMuscleInjuries, ])

    return ( 
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">CLIENTES</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Cédula</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Nombre</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={3} defaultChecked={searchType===3}>Télefono</option>
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
                            getDataById={getClientById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />

                        {clients?.length > 0 && (
                        <div className="flex gap-2">
                            <Modal
                                Button={() => (
                                    <button 
                                        onClick={showModalFileType}
                                        className="flex gap-2 items-center text-end mt-4 mr-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer">
                                        <MdOutlineFileDownload /> Descargar
                                    </button>
                                )}
                                modal={modalFileTypeDecision}
                                getDataById={getClientById}
                                closeModal={closeModalFileType}
                                Content={() => 
                                            <FileTypeDecision 
                                                modulo="Clientes" 
                                                closeModal={closeModalFileType} 
                                                exportToPDF={() => exportToPDF('Clientes', pdfTableHeaders, pdfTableRows)}
                                                exportToExcel={exportToExcel}
                                            />
                                        }
                            />
                        </div>
                        )}          

                    </div>     
                    
                    {clients?.length>0 ? (
                    <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('identificationNumber')}}
                                >
                                    CÉDULA  
                                    {(orderBy==='identificationNumber' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='identificationNumber' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('name')}}
                                >
                                    NOMBRE
                                    {(orderBy==='name' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='name' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('registrationDate')}}
                                >
                                    FECHA DE REGISTRO
                                    {(orderBy==='registrationDate' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='registrationDate' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>

                                <th>TIPO DE CLIENTE</th>
                                {filterByStatus && <th>ESTADO</th>}

                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {clients?.map((client, index) => (
                            <tr key={client.idClient} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{client.person.identificationNumber}</td>
                                <td className="py-2">{client.person.name + ' ' + client.person.firstLastName + ' ' + client.person.secondLastName}</td> 
                                <td className="py-2">{formatDate(new Date(client.registrationDate))}</td>
                                <td className="py-2">{client.typeClient.name}</td>
                                {filterByStatus && (
                                <td>
                                    {client.isDeleted ? (
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
                                        onClick={(e) => {
                                          e.preventDefault();
                                          e.stopPropagation();
                                          getClientById(client.idClient);
                                          setTimeout(() => showModalInfo(), 0);
                                        }}
                                        className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                        title="Ver detalles"
                                      >
                                        <IoIosMore className="text-white" />
                                      </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getClientById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                
                                <button
                                    onClick={() => {
                                        getClientById(client.idClient);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                           
                                <Link 
                                    to="/gestion/medidas"
                                    state={{ idClient: client.idClient }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Ver medidas"
                                >
                                    <LuPencilRuler className="text-white" />
                                </Link>

                                <Link 
                                    to="/gestion/rutinas"
                                    state={{ idClient: client.idClient }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Ver medidas"
                                >
                                    <LuPencilRuler className="text-white" />
                                </Link>

                                {client.isDeleted ? (
                                    <button onClick={() => handleRestore(mapClientToDataForm(client))} className="p-2 bg-black rounded-sm hover:bg-slate-700 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleDelete(client)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
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
                        <NoData module="clientes" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default ClientManagement;