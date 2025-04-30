import { useEffect } from "react";
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import Modal from "../shared/components/Modal";
import { useNavigate } from "react-router";
import NoData from "../shared/components/NoData";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useRoutineStore } from "./Store";
import { useRoutine } from "./useRoutine";
import Form from "./Form";
import DataInfo from "./DataInfo";

function RoutineManagement() {
    const {
        routines,
        modalForm,
        modalInfo,
        fetchRoutines,
        getRoutineById,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalInfo,
    } = useRoutineStore();

    const { handleDelete, handleRestore } = useRoutine();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchRoutines();
            if (logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login');
            }
        };
        fetchData();
    }, []);

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Rutinas</h1>
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
                            getDataById={getRoutineById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                    </div>

                    {routines?.length > 0 ? (
                        <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>NOMBRE</th>
                                    <th>DIFICULTAD</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {routines.map((routine, index) => (
                                    <tr key={routine.idRoutine} className="text-center py-8">
                                        <td className="py-2">{index + 1}</td>
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
                    ) : (
                        <NoData module="rutinas" />
                    )}
                </div>
            </main>
        </div>
    );
}

export default RoutineManagement;