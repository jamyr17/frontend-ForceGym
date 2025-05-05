import { useEffect } from "react"
import useNotificationTemplateStore from "./Store"
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md"
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Pagination from "../shared/components/Pagination"
import { useNotificationTemplate } from "./useNotificationTemplate"
import SearchInput from "../shared/components/SearchInput"
import ModalFilter from "../shared/components/ModalFilter"
import { FilterButton, FilterSelect } from "./Filter"
import Modal from "../shared/components/Modal"
import Form from "./Form"
import DataInfo from "./DataInfo";
import { mapNotificationTemplateToDataForm } from "../shared/types/mapper";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";

function NotificationTemplateManagement() {
    const {
        notificationTemplates,
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
        filterByNotificationType,
        fetchNotificationTemplates,
        getNotificationTemplateById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useNotificationTemplateStore();

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore } = useNotificationTemplate()
    const navigate = useNavigate()

    useEffect(() => {}, [notificationTemplates])

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchNotificationTemplates()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }    

        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByNotificationType])

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Plantillas</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Mensaje</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Usuario</option>
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
                            getDataById={getNotificationTemplateById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />

                    </div>
                    
                    {notificationTemplates?.length>0 ? (
                    <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('message')}}
                                >
                                    MENSAJE  
                                    {(orderBy==='message' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='message' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>

                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('notificationType')}}
                                >
                                    TIPO DE NOTIFICACIÓN  
                                    {(orderBy==='notificationType' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='notificationType' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>

                                {filterByStatus && <th>ESTADO</th>}
                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {notificationTemplates?.map((notificationTemplate, index) => (
                            <tr key={notificationTemplate.idNotificationTemplate} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{notificationTemplate.message}</td>
                                <td className="py-2">{notificationTemplate.notificationType.name}</td>

                                {filterByStatus && (
                                <td>
                                    {notificationTemplate.isDeleted ? (
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
                                                getNotificationTemplateById(notificationTemplate.idNotificationTemplate);
                                                showModalInfo();
                                            }}
                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                            title="Ver detalles"
                                        >
                                            <IoIosMore className="text-white" />
                                        </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getNotificationTemplateById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                <button
                                    onClick={() => {
                                        getNotificationTemplateById(notificationTemplate.idNotificationTemplate);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                                {notificationTemplate.isDeleted ? (
                                    <button onClick={() => handleRestore(mapNotificationTemplateToDataForm(notificationTemplate))} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : ( 
                                    <button 
                                        onClick={() => handleDelete(notificationTemplate)} 
                                        className={`p-2 rounded-sm hover:cursor-pointer bg-black hover:bg-gray-700`}
                                        title="Eliminar"
                                    >
                                    <MdOutlineDelete className={`text-white`} />
                                    </button>
                                )}
                                </td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                    ) : 
                    (
                        <NoData module="plantillas de notificación" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default NotificationTemplateManagement;