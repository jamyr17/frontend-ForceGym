import { MdModeEdit, MdOutlineDelete, MdOutlineSettingsBackupRestore } from "react-icons/md";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import { IoIosMore } from "react-icons/io";
import { mapEconomicIncomeToDataForm } from "../shared/types/mapper";
import DataInfo from "./DataInfo";
import Modal from "../shared/components/Modal";
import { EconomicIncome } from "../shared/types";
import NoData from "../shared/components/NoData";
import Pagination from "../shared/components/Pagination";

interface IncomeTableProps {
  economicIncomes: EconomicIncome[];
  modalInfo: boolean;
  modalForm: boolean;
  orderBy: string;
  directionOrderBy: string;
  filterByStatus: boolean;
  page: number;
  size: number;
  totalRecords: number;
  handleOrderByChange: (field: string) => void;
  getEconomicIncomeById: (id: number) => void;
  showModalInfo: () => void;
  closeModalInfo: () => void;
  showModalForm: () => void;
  handleDelete: (income: EconomicIncome) => void;
  handleRestore: (income: any) => void;
  changePage: (page: number) => void;
  changeSize: (size: number) => void;
}

function IncomeTable({
  economicIncomes,
  modalInfo,
  orderBy,
  directionOrderBy,
  filterByStatus,
  page,
  size,
  totalRecords,
  handleOrderByChange,
  getEconomicIncomeById,
  showModalInfo,
  closeModalInfo,
  showModalForm,
  handleDelete,
  handleRestore,
  changePage,
  changeSize
}: IncomeTableProps) {
  return (
    <div className="flex flex-col mx-12 mt-4 bg-white text-lg w-full max-h-full overflow-scroll">
      {economicIncomes?.length > 0 ? (
        <>
          <table className="w-full mt-8 border-t-2 border-slate-200 overflow-scroll">
            <thead>
              <tr>
                <th>#</th>
                <th>
                  <button
                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-gray-300 hover:cursor-pointer"
                    onClick={() => { handleOrderByChange('voucherNumber') }}
                  >
                    VOUCHER
                    {(orderBy === 'voucherNumber' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow" />}
                    {(orderBy === 'voucherNumber' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow" />}
                  </button>
                </th>
                <th>CLIENTE</th>
                <th>
                  <button
                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                    onClick={() => { handleOrderByChange('registrationDate') }}
                  >
                    FECHA
                    {(orderBy === 'registrationDate' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow" />}
                    {(orderBy === 'registrationDate' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow" />}
                  </button>
                </th>
                <th>
                  <button
                    className="inline-flex text-center items-center gap-2 py-0.5 px-2 rounded-full hover:bg-slate-300 hover:cursor-pointer"
                    onClick={() => { handleOrderByChange('amount') }}
                  >
                    MONTO
                    {(orderBy === 'amount' && directionOrderBy === 'DESC') && <FaArrowUp className="text-yellow" />}
                    {(orderBy === 'amount' && directionOrderBy === 'ASC') && <FaArrowDown className="text-yellow" />}
                  </button>
                </th>
                <th>MÉTODO DE PAGO</th>
                {filterByStatus && <th>ESTADO</th>}
                <th>ACCIONES</th>
              </tr>
            </thead>
            <tbody>
              {economicIncomes?.map((economicIncome, index) => (
                <tr key={economicIncome.idEconomicIncome} className="text-center py-8">
                  <td className="py-2">{index + 1}</td>
                  <td className="py-2">{economicIncome.voucherNumber != '' ? economicIncome.voucherNumber : 'No adjunto'}</td>
                  <td className="py-2">{economicIncome.client.person.name + ' ' + economicIncome.client.person.firstLastName + ' ' + economicIncome.client.person.secondLastName}</td>
                  <td className="py-2">{formatDate(new Date(economicIncome.registrationDate))}</td>
                  <td className="py-2">{formatAmountToCRC(economicIncome.amount)}</td>
                  <td className="py-2">{economicIncome.meanOfPayment.name}</td>
                  {filterByStatus && (
                    <td>
                      {economicIncome.isDeleted ? (
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
                            getEconomicIncomeById(economicIncome.idEconomicIncome);
                            showModalInfo();
                          }}
                          className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                          title="Ver detalles"
                        >
                          <IoIosMore className="text-white" />
                        </button>
                      )}
                      modal={modalInfo}
                      getDataById={getEconomicIncomeById}
                      closeModal={closeModalInfo}
                      Content={DataInfo}
                    />
                    <button
                      onClick={() => {
                        getEconomicIncomeById(economicIncome.idEconomicIncome);
                        showModalForm();
                      }}
                      className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                      title="Editar"
                    >
                      <MdModeEdit className="text-white" />
                    </button>
                    {economicIncome.isDeleted ? (
                      <button onClick={() => handleRestore(mapEconomicIncomeToDataForm(economicIncome))} className="p-2 bg-black rounded-sm hover:bg-slate-700 hover:cursor-pointer">
                        <MdOutlineSettingsBackupRestore className="text-white" />
                      </button>
                    ) : (
                      <button onClick={() => handleDelete(economicIncome)} className="p-2 bg-black rounded-sm hover:bg-gray-700 hover:cursor-pointer"
                        title="Eliminar">
                        <MdOutlineDelete className="text-white" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="mt-6 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold">Total de Ingresos:
                {formatAmountToCRC(economicIncomes.reduce((total, item) => total + item.amount, 0))}
              </h3>
            </div>
          </div>

          <Pagination page={page} size={size} totalRecords={totalRecords} onSizeChange={changeSize} onPageChange={changePage} />
        </>
      ) : (
        <NoData module="ingresos económicos" />
      )}
    </div>
  );
}

export default IncomeTable;