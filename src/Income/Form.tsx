import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import Select from 'react-select';
import { EconomicIncomeDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useEconomicIncomeStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";

const MAXLENGTH_VOUCHER = 100
const MAXLENGTH_DETAIL = 100
const MAXDATE = new Date().toUTCString()

function Form() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<EconomicIncomeDataForm>();
    const { onChange, ...rest } = register('idClient');
    const { meansOfPayment, activityTypes, allClients, fetchAllClients} = useCommonDataStore();
    const { economicIncomes, activeEditingId, fetchEconomicIncomes, addEconomicIncome, updateEconomicIncome, closeModalForm } = useEconomicIncomeStore();
    const idMeanOfPayment = watch("idMeanOfPayment") ? Number(watch("idMeanOfPayment")) : null;

    const submitForm = async (data: EconomicIncomeDataForm) => {
        let action = '', result;
        const loggedUser = getAuthUser()
        const reqUser = {
            ...data, 
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        if (activeEditingId === 0) {
            result = await addEconomicIncome(reqUser);
            action = 'agregado';
        } else {
            result = await updateEconomicIncome(reqUser);
            action = 'editado';
        }

        closeModalForm()
        reset()
        
        if (result.ok) {
            const result2 = await fetchEconomicIncomes()
            
            if(result2.logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }else{
                await Swal.fire({
                    title: `Ingreso económico ${action}`,
                    text: `Se ha ${action} el ingreso`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                })
            }

        }else if(result.logout){
            setAuthHeader(null)
            setAuthUser(null)
            navigate('/login')
        }
    };

    useEffect(() => {
        fetchAllClients()
    }, [])

    useEffect(() => {
        if (activeEditingId) {
            const activeIncome = economicIncomes.find(income => income.idEconomicIncome === activeEditingId)
            if (activeIncome) {
                setValue('idEconomicIncome', activeIncome.idEconomicIncome)
                setValue('idClient', activeIncome.client.idClient)
                setValue('isDeleted', activeIncome.isDeleted)
                setValue('registrationDate', activeIncome.registrationDate)
                setValue('amount', activeIncome.amount)
                setValue('detail', activeIncome.detail)
                setValue('voucherNumber', activeIncome.voucherNumber)
                setValue('idMeanOfPayment', activeIncome.meanOfPayment.idMeanOfPayment)
                setValue('idActivityType', activeIncome.activityType.idActivityType)
            }
        }
    }, [activeEditingId]);

    return (
        <form 
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar ingreso' : 'Registrar ingreso'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idEconomicIncome" 
                type="hidden" 
                {...register('idEconomicIncome')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="mb-5">
                <label htmlFor="idClient" className="text-sm uppercase font-bold">
                    Cliente
                </label>
                <Select
                    id="idClient"
                    className="w-full"
                    onChange={(selectedOption) => {
                        setValue("idClient", selectedOption?.value, { shouldValidate: true });
                    }}
                    options={allClients}
                />

                {/* mostrar errores de cliente */}
                {errors.idClient && 
                    <ErrorForm>
                        {errors.idClient.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="registrationDate" className="text-sm uppercase font-bold">
                    Fecha
                </label>
                <input  
                    id="registrationDate"
                    className="w-full p-3 border border-gray-100"  
                    type="date" 
                    {...register('registrationDate', {
                        required: 'La fecha es obligatoria',
                        max: {
                            value: MAXDATE,
                            message: `Debe ingresar una fecha de máximo ${formatDate(new Date())}`
                        }
                    })}
                />

                {/* mostrar errores del input de la fecha */}
                {errors.registrationDate && 
                    <ErrorForm>
                        {errors.registrationDate.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="voucherNumber" className="text-sm uppercase font-bold">
                    Voucher
                </label>
                <input  
                    id="voucherNumber"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el voucher" 
                    {...register('voucherNumber', {
                        required: idMeanOfPayment === 1 ? 'El voucher es obligatorio' : false,
                        maxLength: {
                            value: MAXLENGTH_VOUCHER,
                            message: `Debe ingresar un voucher de máximo ${MAXLENGTH_VOUCHER} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input deL voucher */}
                {errors.voucherNumber && 
                    <ErrorForm>
                        {errors.voucherNumber.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="detail" className="text-sm uppercase font-bold">
                    Detalle
                </label>
                <input  
                    id="detail"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el detalle" 
                    {...register('detail', {
                        required: 'El detalle es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_DETAIL,
                            message: `Debe ingresar un detalle de máximo ${MAXLENGTH_DETAIL} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del detalle */}
                {errors.detail && 
                    <ErrorForm>
                        {errors.detail.message}
                    </ErrorForm>
                }
            </div>

            <div className="my-5">
                <label htmlFor="idMeanOfPayment" className="text-sm uppercase font-bold">
                    Medio de Pago 
                </label>
                <select
                    id="idMeanOfPayment"
                    className="w-full p-3 border border-gray-100" 
                    {...register("idMeanOfPayment")}  
                >
                    {meansOfPayment.map((meanOfPayment)=> (
                        <option key={meanOfPayment.idMeanOfPayment} value={meanOfPayment.idMeanOfPayment}>
                            {meanOfPayment.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Monto
                </label>
                <input  
                    id="amount"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese el monto" 
                    {...register('amount', {
                        required: 'El monto es obligatorio', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un monto válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.amount && 
                    <ErrorForm>
                        {errors.amount.message}
                    </ErrorForm>
                }
            </div>

            <div className="my-5">
                <label htmlFor="idActivityType" className="text-sm uppercase font-bold">
                    Actividad 
                </label>
                <select
                    id="idActivityType"
                    className="w-full p-3 border border-gray-100" 
                    {...register("idActivityType")}  
                >
                    {activityTypes.map((activity)=> (
                        <option key={activity.idActivityType} value={activity.idActivityType}>
                            {activity.name}
                        </option>
                    ))}
                </select>
            </div>

            <input type="submit" className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" value={activeEditingId ? 'Actualizar' : 'Registrar'} />
        </form> 
    );
}

export default Form;
