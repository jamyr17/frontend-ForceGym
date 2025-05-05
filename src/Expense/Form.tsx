import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { EconomicExpenseDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { useCommonDataStore } from "../shared/CommonDataStore";
import useEconomicExpenseStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { formatDate } from "../shared/utils/format";

const MAXLENGTH_VOUCHER = 100;
const MAXLENGTH_DETAIL = 100;
//const MAXDATE = new Date().toLocaleDateString('sv-SE');
const CASH_PAYMENT_ID = 2; 
const MAXDATE = new Date().toUTCString();

function Form() {
    const navigate = useNavigate();
    const { meansOfPayment, categories } = useCommonDataStore();
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<EconomicExpenseDataForm>();
    const { economicExpenses, activeEditingId, fetchEconomicExpenses, addEconomicExpense, updateEconomicExpense, closeModalForm } = useEconomicExpenseStore();
    
    // Observamos los valores del formulario
    const idMeanOfPayment = watch("idMeanOfPayment") ? Number(watch("idMeanOfPayment")) : null;
    const voucherNumber = watch("voucherNumber");
    const amount = watch("amount");
    const isCashPayment = idMeanOfPayment === CASH_PAYMENT_ID;

    const submitForm = async (data: EconomicExpenseDataForm) => {
        // Validación para comprobante con efectivo
        if (isCashPayment && data.voucherNumber) {
            Swal.fire({
                title: 'Error',
                text: 'No se puede ingresar número de comprobante cuando el medio de pago es Efectivo',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validación para fecha futura
        const selectedDate = new Date(data.registrationDate);
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Eliminamos la hora para comparar solo fechas
        
        if (selectedDate > today) {
            Swal.fire({
                title: 'Error',
                text: 'No se pueden registrar gastos con fecha futura',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        // Validación para monto negativo o cero
        if (data.amount <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'El monto debe ser mayor a cero',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        let action = '', result;
        const loggedUser = getAuthUser();
        const reqUser = {
            ...data, 
            idUser: loggedUser?.idUser, 
            paramLoggedIdUser: loggedUser?.idUser
        };
        
        if (activeEditingId === 0) {
            result = await addEconomicExpense(reqUser);
            action = 'agregado';
        } else {
            result = await updateEconomicExpense(reqUser);
            action = 'editado';
        }

        closeModalForm();
        reset();
        
        if (result.ok) {
            const result2 = await fetchEconomicExpenses();
            
            if(result2.logout){
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', {replace: true});
            } else {
                await Swal.fire({
                    title: `Gasto económico ${action}`,
                    text: `Se ha ${action} el gasto`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            }
        } else if(result.logout) {
            setAuthHeader(null);
            setAuthUser(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        if (activeEditingId) {
            const activeExpense = economicExpenses.find(expense => expense.idEconomicExpense === activeEditingId);
            if (activeExpense) {
                setValue('idEconomicExpense', activeExpense.idEconomicExpense);
                setValue('idUser', activeExpense.user.idUser);
                setValue('isDeleted', activeExpense.isDeleted);
                setValue('registrationDate', activeExpense.registrationDate);
                setValue('amount', activeExpense.amount);
                setValue('detail', activeExpense.detail);
                setValue('voucherNumber', activeExpense.voucherNumber);
                setValue('idMeanOfPayment', activeExpense.meanOfPayment.idMeanOfPayment);
                setValue('idCategory', activeExpense.category.idCategory);
            }
        }
    }, [activeEditingId]);

    // Efecto para limpiar el voucherNumber cuando se selecciona Efectivo
    useEffect(() => {
        if (isCashPayment && voucherNumber) {
            setValue('voucherNumber', '');
        }
    }, [isCashPayment, voucherNumber]);

    // Efecto para prevenir valores negativos en el monto
    useEffect(() => {
        if (amount !== undefined && amount < 0) {
            setValue('amount', 0);
        }
    }, [amount]);

    return (
        <form 
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar gasto' : 'Registrar gasto'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idUser" 
                type="hidden" 
                {...register('idUser')}
            />
            <input  
                id="idEconomicExpense" 
                type="hidden" 
                {...register('idEconomicExpense')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="my-5">
                <label htmlFor="idCategory" className="text-sm uppercase font-bold">
                    Categoría
                </label>
                <select
                    id="idCategory"
                    className="w-full p-3 border border-gray-100" 
                    {...register("idCategory", {
                        required: 'La categoría es obligatoria'
                    })}  
                >
                    <option value="">Seleccione una categoría</option>
                    {categories.map((category) => (
                        <option key={category.idCategory} value={category.idCategory}>
                            {category.name}
                        </option>
                    ))}
                </select>
                {errors.idCategory && 
                    <ErrorForm>
                        {errors.idCategory.message}
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
                        required: 'La fecha de registro es obligatoria',
                        max: {
                        value: MAXDATE,
                        message: `Debe ingresar una fecha de registro de máximo ${formatDate(new Date())}`
                        }
                    })}
                    />
                {errors.registrationDate && <ErrorForm>{errors.registrationDate.message?.toString()}</ErrorForm>}
            </div>

            <div className="mb-5">
                <label htmlFor="voucherNumber" className="text-sm uppercase font-bold">
                    Voucher
                </label>
                <input  
                    id="voucherNumber"
                    className={`w-full p-3 border ${isCashPayment ? 'bg-gray-100' : 'border-gray-100'}`}  
                    type="text" 
                    placeholder={isCashPayment ? 'No aplica para efectivo' : 'Ingrese el voucher'} 
                    disabled={isCashPayment}
                    {...register('voucherNumber', {
                        required: isCashPayment ? false : 'El voucher es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_VOUCHER,
                            message: `Debe ingresar un voucher de máximo ${MAXLENGTH_VOUCHER} carácteres`
                        },
                        validate: (value) => {
                            if (isCashPayment && value) {
                                return 'No se puede ingresar voucher con pago en efectivo';
                            }
                            return true;
                        }
                    })}
                />
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
                    {...register("idMeanOfPayment", {
                        required: 'El medio de pago es obligatorio'
                    })}  
                >
                    <option value="">Seleccione un medio de pago</option>
                    {meansOfPayment.map((meanOfPayment) => (
                        <option key={meanOfPayment.idMeanOfPayment} value={meanOfPayment.idMeanOfPayment}>
                            {meanOfPayment.name}
                        </option>
                    ))}
                </select>
                {errors.idMeanOfPayment && 
                    <ErrorForm>
                        {errors.idMeanOfPayment.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="amount" className="text-sm uppercase font-bold">
                    Monto
                </label>
                <input  
                    id="amount"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    min="0"
                    step="1"
                    placeholder="Ingrese el monto" 
                    onWheel={(e) => {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }}
                    onKeyDown={(e) => {
                        // Prevenir la entrada de caracteres no deseados
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                    {...register('amount', {
                        required: 'El monto es obligatorio',
                        min: {
                            value: 0,
                            message: 'El monto debe ser mayor a cero'
                        },
                        valueAsNumber: true
                    })}
                />
                {errors.amount && 
                    <ErrorForm>
                        {errors.amount.message}
                    </ErrorForm>
                }
            </div>

            <input 
                type="submit" 
                className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" 
                value={activeEditingId ? 'Actualizar' : 'Registrar'} 
            />
        </form> 
    );
}

export default Form;