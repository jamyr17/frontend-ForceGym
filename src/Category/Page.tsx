import { useEffect } from "react";
import { useNavigate } from "react-router";
import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { IoIosMore } from "react-icons/io";
import useCategoryStore from "./Store";
import DataInfo from "./DataInfo";
import Form from "./Form";
import Modal from "../shared/components/Modal";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";

import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

function CategoryManagement() {
  const {
    categories,
    modalForm,
    modalInfo,
    page,
    size,
    totalRecords,
    fetchCategories,
    getCategoryById,
    changePage,
    changeSize,
    showModalForm,
    showModalInfo,
    closeModalForm,
    closeModalInfo,
  } = useCategoryStore();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const { logout } = await fetchCategories();
      if (logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate("/login", { replace: true });
      }
    };

    fetchData();
  }, [page, size]);

  return (
    <div className="bg-black min-h-screen">
      <header className="flex ml-12 h-20 w-0.90 items-center text-black bg-yellow justify-between px-4">
        <h1 className="text-4xl uppercase">Categorías</h1>
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
                  getDataById={getCategoryById}
                  closeModal={closeModalForm}
                  Content={Form}
                />
            </div>
          {categories?.length > 0 ? (
            <table className="w-full mt-8 border-t-2 border-slate-200">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Nombre</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr key={category.idCategory} className="text-center">
                    <td className="py-2">{index + 1}</td>
                    <td>{category.name}</td>
                    <td className="flex justify-center gap-2 py-2">
                      <Modal
                        Button={() => (
                          <button
                            onClick={() => {
                              getCategoryById(category.idCategory);
                              showModalInfo();
                            }}
                            className="p-2 bg-black rounded hover:bg-gray-700"
                            title="Ver detalles"
                          >
                            <IoIosMore className="text-white" />
                          </button>
                        )}
                        modal={modalInfo}
                        getDataById={getCategoryById}
                        closeModal={closeModalInfo}
                        Content={DataInfo}
                      />
                      <button
                        onClick={() => {
                          getCategoryById(category.idCategory);
                          showModalForm();
                        }}
                        className="p-2 bg-black rounded hover:bg-gray-700"
                        title="Editar"
                      >
                        <MdModeEdit className="text-white" />
                      </button>
                      {category.isDeleted ? (
                        <button
                          className="p-2 bg-black rounded hover:bg-gray-700"
                          title="Restaurar"
                        >
                          <MdOutlineSettingsBackupRestore className="text-white" />
                        </button>
                      ) : (
                        <button
                          className="p-2 bg-black rounded hover:bg-gray-700"
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
            <NoData module="categorías" />
          )}

          <Pagination
            page={page}
            size={size}
            totalRecords={totalRecords}
            onSizeChange={changeSize}
            onPageChange={changePage}
          />
        </div>
      </main>
    </div>
  );
}

export default CategoryManagement;
