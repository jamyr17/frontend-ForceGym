import { formatAmountToCRC, formatDate } from "../shared/utils/format";
import useEconomicIncomeStore from "./Store";

function DataInfo() {
    const { economicIncomes, activeEditingId } = useEconomicIncomeStore()
    if (!activeEditingId) return <></>;

    const economicIncome = economicIncomes.find(income => income.idEconomicIncome === activeEditingId)
    if (!economicIncome) return <></>

    return (
        <div className="grid grid-cols-3 gap-6">
            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Ingreso</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NUMERO DE VOUCHER</strong></p>
                    <p>{economicIncome.voucherNumber!='' ? economicIncome.voucherNumber : 'No adjunto'}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>DETALLE</strong></p>
                    <p>{economicIncome.detail}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>MEDIO DE PAGO</strong></p>
                    <p>{economicIncome.meanOfPayment.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>FECHA DE REGISTRO</strong></p>
                    <p>{formatDate(new Date(economicIncome.registrationDate))}</p>
                </div>

            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Cliente</h1>
                
                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>CÉDULA</strong></p>
                    <p>{economicIncome.client.person.identificationNumber}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NOMBRE</strong></p>
                    <p>{economicIncome.client.person.name + ' ' + economicIncome.client.person.firstLastName + ' ' + economicIncome.client.person.secondLastName}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TIPO </strong></p>
                    <p>{economicIncome.client.clientType.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>NÚMERO </strong></p>
                    <p>{economicIncome.client.person.phoneNumber}</p>
                </div>
            </div>

            <div className="flex flex-col gap-2">
                <h1 className="text-yellow font-black text-2xl uppercase mb-8 underline">Actividad</h1>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>TIPO DE ACTIVIDAD</strong></p>
                    <p>{economicIncome.activityType.name}</p>
                </div>

                <div className="flex flex-col gap-2 text-lg">
                    <p><strong>MONTO</strong></p>
                    <p>{formatAmountToCRC(economicIncome.amount)}</p>
                </div>

            </div>
        </div>
    );
}

export default DataInfo;
