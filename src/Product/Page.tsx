import { MdModeEdit, MdOutlineDelete, MdOutlineFileDownload, MdOutlineSettingsBackupRestore } from "react-icons/md";
import Modal from "../shared/components/Modal";
import ModalFilter from "../shared/components/ModalFilter";
import SearchInput from "../shared/components/SearchInput";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { IoIosMore } from "react-icons/io";
import { mapProductInventoryToDataForm } from "../shared/types/mapper";
import DataInfo from "./DataInfo";
import { useEffect } from "react";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useNavigate } from "react-router";
import useProductInventoryStore from "./Store";
import Form from "./Form";
import { useProductInventory } from "./useProduct";
import { FilterButton, FilterSelect } from "./Filter";
import { formatAmountToCRC } from "../shared/utils/format";
import FileTypeDecision from "../shared/components/ModalFileType";

function ProductInventoryManagement() {
    const {
        productsInventory,
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
        filterByCostRangeMin,
        filterByCostRangeMax,
        filterByQuantityRangeMin,
        filterByQuantityRangeMax,
        fetchProductsInventory,
        getProductInventoryById,
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
    } = useProductInventoryStore()

    const { handleDelete, handleSearch, handleOrderByChange, handleRestore, exportToPDF, exportToExcel } = useProductInventory()
    const navigate = useNavigate()
    
    useEffect(() => {}, [productsInventory])
    
    useEffect(() => {
        const fetchData = async () => {
            const { logout } = await fetchProductsInventory()

            if(logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login')
            }    

        }
        
        fetchData()
    }, [page, size, searchType, searchTerm, orderBy, directionOrderBy, filterByStatus, filterByCostRangeMin, filterByCostRangeMax, filterByQuantityRangeMin, filterByQuantityRangeMax ])

    return ( 
        <div className="bg-black h-full w-full">
            <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
                <h1 className="text-4xl uppercase">INVENTARIO</h1>
                <SearchInput searchTerm={searchTerm} handleSearch={handleSearch} changeSearchType={changeSearchType} >
                    <option className="checked:bg-yellow hover:cursor-pointer hover:bg-slate-400" value={1} defaultChecked={searchType===1}>Código</option>
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
                            getDataById={getProductInventoryById}
                            closeModal={closeModalForm}
                            Content={Form}
                        />
                        
            {productsInventory?.length > 0 && (
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
                    getDataById={getProductInventoryById}
                    closeModal={closeModalFileType}
                    Content={() => <FileTypeDecision 
                                        modulo="Gastos económicos" 
                                        closeModal={closeModalFileType} 
                                        exportToPDF={exportToPDF}
                                        exportToExcel={exportToExcel}
                    />}
                />  
            </div>
            )}          

                    </div>
                    
                    {productsInventory?.length>0 ? (
                    <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-700 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('code')}}
                                >
                                    CÓDIGO  
                                    {(orderBy==='code' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='code' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-700 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('name')}}
                                >
                                    NOMBRE  
                                    {(orderBy==='name' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='name' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-700 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('quantity')}}
                                >
                                    CANTIDAD  
                                    {(orderBy==='quantity' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='quantity' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>
                                <th><button
                                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                                    onClick={() => {handleOrderByChange('cost')}}
                                >
                                    COSTO  
                                    {(orderBy==='cost' && directionOrderBy==='DESC') && <FaArrowUp className="text-yellow"/> } 
                                    {(orderBy==='cost' && directionOrderBy==='ASC') && <FaArrowDown className="text-yellow"/> } 
                                </button></th>

                                {filterByStatus && <th>ESTADO</th>}

                                <th>ACCIONES</th>
                            </tr>
                        </thead>
                        <tbody>
                        
                            {productsInventory?.map((product, index) => (
                            <tr key={product.idProductInventory} className="text-center py-8">
                                <td className="py-2">{index + 1}</td>
                                <td className="py-2">{product.code}</td>
                                <td className="py-2">{product.name}</td>
                                <td className="py-2">{product.quantity}</td>
                                <td className="py-2">{formatAmountToCRC(product.cost)}</td>
                                {filterByStatus && (
                                <td>
                                    {product.isDeleted ? (
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
                                                getProductInventoryById(product.idProductInventory);
                                                showModalInfo();
                                            }}
                                            className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                            title="Ver detalles"
                                        >
                                            <IoIosMore className="text-white" />
                                        </button>
                                    )}
                                    modal={modalInfo}
                                    getDataById={getProductInventoryById}
                                    closeModal={closeModalInfo}
                                    Content={DataInfo}
                                />
                                <button
                                    onClick={() => {
                                        getProductInventoryById(product.idProductInventory);
                                        showModalForm();
                                    }}
                                    className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                                    title="Editar"
                                >
                                    <MdModeEdit className="text-white" />
                                </button>
                                {product.isDeleted ? (
                                    <button onClick={() => handleRestore(mapProductInventoryToDataForm(product))} className="p-2 bg-black rounded-sm hover:bg-slate-300 hover:cursor-pointer">
                                    <MdOutlineSettingsBackupRestore className="text-white" />
                                    </button>
                                ) : (
                                    <button onClick={() => handleDelete(product)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
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
                        <NoData module="productos del inventario" />
                    )}
                    <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
                </div>
            </main>
        </div>
    );
}

export default ProductInventoryManagement;