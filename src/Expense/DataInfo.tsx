import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import useEconomicExpenseStore from "./Store";

function DataInfo() {
    const { economicExpenses, activeEditingId } = useEconomicExpenseStore()
    if (!activeEditingId) return <></>;

    const economicExpense = economicExpenses.find(income => income.idEconomicExpense === activeEditingId)
    if (!economicExpense) return <></>

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Gasto</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NUMERO DE VOUCHER</strong></p>
                    <p>{economicExpense.voucherNumber!='' ? economicExpense.voucherNumber : 'No adjunto'}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>DETALLE</strong></p>
                    <p>{economicExpense.detail}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>FECHA DE REGISTRO</strong></p>
                    <p>{formatDate(new Date(economicExpense.registrationDate))}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Medio de Pago</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>MEDIO DE PAGO</strong></p>
                    <p>{economicExpense.meanOfPayment.name}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Actividad</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>MONTO</strong></p>
                    <p>{formatAmountToCRC(economicExpense.amount)}</p>
                </div>
            </div>
        </div>
    );
}

export default DataInfo;
