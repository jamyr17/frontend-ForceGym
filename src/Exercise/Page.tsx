import { useEffect } from "react";
import { useNavigate } from "react-router";
import { FaArrowUp, FaArrowDown } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { MdOutlineDelete, MdModeEdit, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import SearchInput from "../shared/components/SearchInput";
import ModalFilter from "../shared/components/ModalFilter";
import Pagination from "../shared/components/Pagination";
import NoData from "../shared/components/NoData";

function ExerciseManagement() {
    const navigate = useNavigate();
    /*const {
        categories,
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
        fetchExercises,
        getExerciseById,
        changePage,
        changeSize,
        changeSearchType,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useExerciseStore();

    const {
        handleDelete,
        handleSearch,
        handleOrderByChange,
        handleRestore
    } = useExercise();*/

    /*useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchExercises();
            if (logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate("/login", { replace: true });
            }
        };
        fetchData();
    }, [
        page,
        size,
        searchType,
        searchTerm,
        orderBy,
        directionOrderBy,
        filterByStatus
    ]);*/

    return (
        <div className="bg-black min-h-screen">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">Ejercicios</h1>
            </header>

            <main className="justify-items-center ml-12 p-4">
                <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full overflow-scroll">
                    <div className="flex justify-between">
                        { /* <Modal
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
                            getDataById={getExerciseById}
                            closeModal={closeModalForm}
                            Content={Form}
                        /> */ }
                    </div>

                    {/* {categories?.length > 0 ? ( */ }
                        <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        <button
                                            className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300"
                                            
                                        >
                                            NOMBRE
                                            {/*{orderBy === "name" && (
                                                directionOrderBy === "DESC"
                                                    ? <FaArrowUp className="text-yellow" />
                                                    : <FaArrowDown className="text-yellow" />
                                            )} */}
                                        </button>
                                    </th>
                                    {/*filterByStatus && <th>ESTADO</th>*/}
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {/*categories.map((category, index) => (
                                    <tr key={category.idExercise} className="text-center py-8">
                                        <td className="py-2">{index + 1}</td>
                                        <td className="py-2">{category.name}</td>
                                        {filterByStatus && (
                                            <td>
                                                {category.isDeleted ? (
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
                                                            getExerciseById(category.idExercise);
                                                            showModalInfo();
                                                        }}
                                                        className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                        title="Ver detalles"
                                                    >
                                                        <IoIosMore className="text-white" />
                                                    </button>
                                                )}
                                                modal={modalInfo}
                                                getDataById={getExerciseById}
                                                closeModal={closeModalInfo}
                                                Content={DataInfo}
                                            />
                                            <button
                                                onClick={() => {
                                                    getExerciseById(category.idExercise);
                                                    showModalForm();
                                                }}
                                                className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                title="Editar"
                                            >
                                                <MdModeEdit className="text-white" />
                                            </button>
                                            {category.isDeleted ? (
                                                <button
                                                    onClick={() => handleRestore(mapExerciseToDataForm(category))}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    title="Restaurar"
                                                >
                                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleDelete(category)}
                                                    className="p-2 bg-black rounded-sm hover:bg-gray-700"
                                                    title="Eliminar"
                                                >
                                                    <MdOutlineDelete className="text-white" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))} */}
                            </tbody>
                        </table>
                    {/* ) : (
                        <NoData module="categorías" />
                    )} */}

                    {/*<Pagination
                        page={page}
                        size={size}
                        totalRecords={totalRecords}
                        onSizeChange={changeSize}
                        onPageChange={changePage}
                    /> */}
                </div>
            </main>
        </div>
    );
}

export default ExerciseManagement;
