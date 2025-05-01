import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import Modal from "../shared/components/Modal";
import NoData from "../shared/components/NoData";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useRoutineStore } from "../Routine/Store";
import { useRoutine } from "../Routine/useRoutine";
import Form from "../Routine/Form";
import DataInfo from "../Routine/DataInfo";

function ClientRoutinePage() {
    const location = useLocation();
    const { idClient } = location.state || {}; // Obtener el ID del cliente del estado de navegación
    
    const {
        routines,
        modalForm,
        modalInfo,
        fetchClientRoutines, // Nueva función en el store para obtener rutinas por cliente
        getRoutineById,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalInfo,
        page,
        size,
        totalRecords,
        orderBy,
        directionOrderBy,
        changePage,
        changeSize,
        changeOrderBy
    } = useRoutineStore();

    const { handleDelete, handleRestore } = useRoutine();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            if (!idClient) {
                navigate(-1); // Volver atrás si no hay ID de cliente
                return;
            }

            const { logout } = await fetchClientRoutines(idClient, page, size, orderBy, directionOrderBy);
            
            if (logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login');
            }
        };
        
        fetchData();
    }, [idClient, page, size, orderBy, directionOrderBy]);

    if (!idClient) {
        return null; // O podrías mostrar un mensaje de carga o error
    }

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <div className="flex items-center gap-4">
                    <h1 className="text-4xl uppercase">Rutinas del Cliente</h1>
                    <Link 
                        to="/gestion/clientes" 
                        className="text-sm underline hover:text-blue-700"
                    >
                        Volver a clientes
                    </Link>
                </div>
            </header>

            <main className="justify-items-center ml-12 p-4">
                <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full overflow-scroll">
                    <div className="flex justify-between">
                        <Modal
                            Button={() => (
                                <button
                                    className="mt-4 ml-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer"
                                    type="button"
                                    onClick={() => showModalForm({ idClient })}
                                >
                                    + Añadir Rutina
                                </button>
                            )}
                            modal={modalForm}
                            getDataById={getRoutineById}
                            closeModal={closeModalForm}
                            Content={Form}
                            initialData={{ idClient }} // Pasar el idClient al formulario
                        />
                    </div>

                    {routines?.length > 0 ? (
                        <>
                            <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
                                                onClick={() => changeOrderBy('name')}
                                            >
                                                NOMBRE
                                                {(orderBy === 'name' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow"/>}
                                                {(orderBy === 'name' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow"/>}
                                            </button>
                                        </th>
                                        <th>
                                            <button
                                                className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
                                                onClick={() => changeOrderBy('difficultyRoutine.name')}
                                            >
                                                DIFICULTAD
                                                {(orderBy === 'difficultyRoutine.name' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow"/>}
                                                {(orderBy === 'difficultyRoutine.name' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow"/>}
                                            </button>
                                        </th>
                                        <th>ACCIONES</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {routines.map((routine, index) => (
                                        <tr key={routine.idRoutine} className="text-center py-8">
                                            <td className="py-2">{(page - 1) * size + index + 1}</td>
                                            <td className="py-2">{routine.name}</td>
                                            <td className="py-2">{routine.difficultyRoutine.name}</td>
                                            <td className="flex gap-4 justify-center py-2">
                                                <Modal
                                                    Button={() => (
                                                        <button
                                                            onClick={() => {
                                                                getRoutineById(routine.idRoutine);
                                                                showModalInfo();
                                                            }}
                                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                            title="Ver detalles"
                                                        >
                                                            <IoIosMore className="text-white" />
                                                        </button>
                                                    )}
                                                    modal={modalInfo}
                                                    getDataById={getRoutineById}
                                                    closeModal={closeModalInfo}
                                                    Content={DataInfo}
                                                />
                                                <button
                                                    onClick={() => {
                                                        getRoutineById(routine.idRoutine);
                                                        showModalForm();
                                                    }}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                    title="Editar"
                                                >
                                                    <MdModeEdit className="text-white" />
                                                </button>
                                                {routine.isDeleted ? (
                                                    <button 
                                                        onClick={() => handleRestore(routine)} 
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                                        title="Restaurar"
                                                    >
                                                        <MdOutlineSettingsBackupRestore className="text-white" />
                                                    </button>
                                                ) : (
                                                    <button
                                                        onClick={() => handleDelete(routine)}
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
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
                            <Pagination 
                                page={page} 
                                size={size} 
                                totalRecords={totalRecords} 
                                onSizeChange={changeSize} 
                                onPageChange={changePage} 
                            />
                        </>
                    ) : (
                        <NoData module="rutinas para este cliente" />
                    )}
                </div>
            </main>
        </div>
    );
}

export default ClientRoutineManagement;