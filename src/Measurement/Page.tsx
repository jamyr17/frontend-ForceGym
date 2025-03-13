import { MdModeEdit, MdOutlineDelete, MdOutlineFileDownload, MdOutlineSettingsBackupRestore } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import { useMeasurementStore } from './Store';
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import { useMeasurement } from "./useMeasurement";
import Form from "./Form";
import DataInfo from "./DataInfo";

function MeasurementManagement() {
    const {
        measurements,
        modalForm,
        modalFilter,
        modalInfo,
        page,
        size,
        totalRecords,
        orderBy,
        directionOrderBy,
        searchTerm,
        fetchMeasurements,
        getMeasurementById,
        changePage,
        changeSize,
        showModalForm,
        showModalInfo,
        closeModalForm,
        closeModalFilter,
        closeModalInfo,
    } = useMeasurementStore();

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore } = useMeasurement();
    const navigate = useNavigate();

    useEffect(() => {}, [measurements]);
    
    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchMeasurements();
            if (logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            }
        };
        fetchData();
    }, [page, size, searchTerm, orderBy, directionOrderBy]);

    return (
        <div className="bg-black h-full w-full">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">MEDICIONES</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={function (newSearchType: number): void {
                    throw new Error("Function not implemented.");
                } } children={undefined} />
                <ModalFilter modalFilter={modalFilter} closeModalFilter={closeModalFilter} FilterButton={function (): JSX.Element {
                    throw new Error("Function not implemented.");
                } } FilterSelect={function (): JSX.Element {
                    throw new Error("Function not implemented.");
                } } />
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
                            getDataById={getMeasurementById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />

                        {measurements?.length > 0 && (
                            <button className="flex gap-2 items-center text-end mt-4 mr-2 px-2 py-1 hover:bg-gray-300 hover:rounded-full hover:cursor-pointer">
                                <MdOutlineFileDownload /> Descargar
                            </button>
                        )}
                    </div>
                    
                    {measurements?.length > 0 ? (
                        <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>
                                        <button className="inline-flex items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-700 hover:cursor-pointer" onClick={() => handleOrderByChange('measurementDate')}>
                                            FECHA DE MEDICIÓN
                                            {orderBy === 'measurementDate' && directionOrderBy === 'DESC' && <FaArrowUp className="text-yellow" />}
                                            {orderBy === 'measurementDate' && directionOrderBy === 'ASC' && <FaArrowDown className="text-yellow" />}
                                        </button>
                                    </th>
                                    <th>PESO (kg)</th>
                                    <th>ALTURA (cm)</th>
                                    <th>MÚSCULO (%)</th>
                                    <th>GRASA CORPORAL (%)</th>
                                    <th>GRASA VISCERAL (%)</th>
                                    <th>ACCIONES</th>
                                </tr>
                            </thead>
                            <tbody>
                                {measurements?.map((measurement, index) => (
                                    <tr key={measurement.idMeasurement} className="text-center py-8">
                                        <td className="py-2">{index + 1}</td>
                                        <td className="py-2">{formatDate(new Date(measurement.measurementDate))}</td>
                                        <td className="py-2">{measurement.weight}</td>
                                        <td className="py-2">{measurement.height}</td>
                                        <td className="py-2">{measurement.bmi}</td>
                                        <td className="py-2">{measurement.bodyFatPercentage}</td>
                                        <td className="py-2">{measurement.visceralFatPercentage}</td>
                                        <td className="flex gap-4 justify-center py-2">
                                            <Modal
                                                Button={() => (
                                                    <button onClick={() => { getMeasurementById(measurement.idMeasurement); showModalInfo(); }} className="p-2 bg-black rounded-sm hover:bg-slate-300 hover:cursor-pointer">
                                                        <IoIosMore className="text-white" />
                                                    </button>
                                                )}
                                                modal={modalInfo}
                                                getDataById={getMeasurementById}
                                                closeModal={closeModalInfo}
                                                Content={DataInfo}
                                            />
                                            <button onClick={() => { getMeasurementById(measurement.idMeasurement); showModalForm(); }} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer" title="Editar">
                                                <MdModeEdit className="text-white" />
                                            </button>
                                            {measurement.isDeleted ? (
                                                <button onClick={() => handleRestore(measurement)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer">
                                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                                </button>
                                            ) : (
                                                <button onClick={() => handleDelete(measurement)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer" title="Eliminar">
                                                    <MdOutlineDelete className="text-white" />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <NoData module="mediciones" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default MeasurementManagement;
