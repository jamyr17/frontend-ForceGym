import { useEffect } from "react"
import useUserStore from "./Store"
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md"
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import Pagination from "../shared/components/Pagination"
import { useUser } from "./useUser"
import SearchInput from "../shared/components/SearchInput"
import ModalFilter from "../shared/components/ModalFilter"
import { FilterButton, FilterSelect } from "./Filter"
import Modal from "../shared/components/Modal"
import DataInfo from "./DataInfo";
import { mapUserToDataForm } from "../shared/types/mapper";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import Form from "./Form/MultiStepForm";

function UserManagement() {
    const {
        users,
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
        filterByRole,
        fetchUsers,
        getUserById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useUserStore();

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore } = useUser()
    const navigate = useNavigate()
    const authUser = getAuthUser()

    //useEffect(() => {}, [users])
    useEffect(() => {
    fetchUsers(); // Esto ahora solo carga al usuario logueado
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchUsers()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }    

        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByRole])

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Usuarios</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Cédula</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={2} defaultChecked={searchType===2}>Nombre</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={3} defaultChecked={searchType===3}>Usuario</option>
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={4} defaultChecked={searchType===3}>Teléfono</option>
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
                            getDataById={getUserById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>
                    
                    {users?.length>0 ? (
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
                                    onClick={() => {handleOrderByChange('username')}}
                                >
                                    USUARIO  
                                    {(orderBy==='username' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='username' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th>TIPO</th>

                                {filterByStatus && <th>ESTADO</th>}

                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {users?.map((user, index) => (
                            <tr key={user.idUser} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{user.person.identificationNumber}</td>
                                <td className="py-2">{user.person.name + ' ' + user.person.firstLastName + ' ' + user.person.secondLastName}</td> 
                                <td className="py-2">{user.username}</td>
                                <td className="py-2">{user.role.name}</td>
                                {filterByStatus && (
                                <td>
                                    {user.isDeleted ? (
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
                                                getUserById(user.idUser);
                                                showModalInfo();
                                            }}
                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                            title="Ver detalles"
                                        >
                                            <IoIosMore className="text-white" />
                                        </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getUserById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                <button
                                    onClick={() => {
                                        getUserById(user.idUser);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                                {user.isDeleted ? (
                                    <button onClick={() => handleRestore(mapUserToDataForm(user))} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : ( 
                                    <button 
                                        onClick={() => handleDelete(user)} 
                                        disabled={user.idUser === authUser?.idUser}
                                        className={`p-2 rounded-sm hover:cursor-pointer bg-black
                                        ${user.idUser === authUser?.idUser ? ' opacity-50 cursor-not-allowed' : 'hover:bg-gray-700'}`}
                                        title="Eliminar"
                                    >
                                    <MdOutlineDelete className={`text-white  ${user.idUser === authUser?.idUser && ' cursor-not-allowed'}`} />
                                    </button>
                                )}
                                </td>
                            </tr>
                            ))}

                        </tbody>
                    </table>
                    ) : 
                    (
                        <NoData module="usuarios" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default UserManagement;