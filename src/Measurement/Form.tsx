import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { MeasurementDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useMeasurementStore from "./Store";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";

const MAXDATE = new Date().toUTCString()

function Form() {
    const navigate = useNavigate();
    const location = useLocation(); 
    const idClient = location.state?.idClient;
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<MeasurementDataForm>();
    const { measurements, activeEditingId, fetchMeasurements, addMeasurement, updateMeasurement, closeModalForm } = useMeasurementStore();
    
    const submitForm = async (data: MeasurementDataForm) => {
        let action = '', result;
        const loggedUser = getAuthUser()
        const reqUser = {
            ...data, 
            idUser: loggedUser?.idUser, 
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        if (activeEditingId === 0) {
            result = await addMeasurement(reqUser);
            action = 'agregado';
        } else {
            result = await updateMeasurement(reqUser);
            action = 'editado';
        }

        closeModalForm()
        reset()
        
        if (result.ok) {
            const result2 = await fetchMeasurements()
            
            if(result2.logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }else{
                await Swal.fire({
                    title: `Medida ${action}`,
                    text: `Se ha ${action} la medida`,
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
        if (activeEditingId) {
            const activeMeasurement = measurements.find(m => m.idMeasurement === activeEditingId)
            if (activeMeasurement) {
                

                setValue('idMeasurement', activeMeasurement.idMeasurement)
                setValue('idClient', activeMeasurement.client.idClient)
                setValue('isDeleted', activeMeasurement.isDeleted)
                setValue('measurementDate', activeMeasurement.measurementDate)
                setValue('weight', activeMeasurement.weight)
                setValue('height', activeMeasurement.height)
                setValue('muscleMass', activeMeasurement.muscleMass)
                setValue('bodyFatPercentage', activeMeasurement.bodyFatPercentage)
                setValue('visceralFatPercentage', activeMeasurement.visceralFatPercentage)
                setValue('neckSize', activeMeasurement.neckSize)
                setValue('shoulderSize', activeMeasurement.shoulderSize)
                setValue('chestSize', activeMeasurement.chestSize)
                setValue('waistSize', activeMeasurement.waistSize)
                setValue('thighSize', activeMeasurement.thighSize)
                setValue('calfSize', activeMeasurement.calfSize)
                setValue('forearmSize', activeMeasurement.forearmSize)
                setValue('armSize', activeMeasurement.armSize)              
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
                {activeEditingId ? 'Actualizar medida corporal' : 'Registrar medida corporal'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idUser" 
                type="hidden" 
                {...register('idUser')}
            />
            <input  
                id="idClient" 
                type="hidden"
                value={idClient}
                {...register('idClient')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="mb-5">
                <label htmlFor="measurementDate" className="text-sm uppercase font-bold">
                    Fecha
                </label>
                <input  
                    id="measurementDate"
                    className="w-full p-3 border border-gray-100"  
                    type="date" 
                    {...register('measurementDate', {
                        required: 'La fecha es obligatoria',
                        max: {
                            value: MAXDATE,
                            message: `Debe ingresar una fecha de máximo ${formatDate(new Date())}`
                        }
                    })}
                />

                {/* mostrar errores del input de la fecha */}
                {errors.measurementDate && 
                    <ErrorForm>
                        {errors.measurementDate.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="weight" className="text-sm uppercase font-bold">
                    Peso (KG)
                </label>
                <input  
                    id="weight"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese el peso en kilogramos (KG)" 
                    {...register('weight', {
                        required: 'El peso es obligatorio',
                        min: {
                            value: 1,
                            message: `Debe ingresar un peso valido`
                        }
                    })}
                />

                {/* mostrar errores del input deL voucher */}
                {errors.weight && 
                    <ErrorForm>
                        {errors.weight.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="height" className="text-sm uppercase font-bold">
                    Altura (CM)
                </label>
                <input  
                    id="height"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la Altura en centimetros (CM)" 
                    {...register('height', {
                        required: 'La altura es obligatoria',
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor valido`
                        }
                    })}
                />

                {/* mostrar errores del input del detalle */}
                {errors.height && 
                    <ErrorForm>
                        {errors.height.message}
                    </ErrorForm>
                }
            </div>


            <div className="mb-5">
                <label htmlFor="muscleMass" className="text-sm uppercase font-bold">
                    Masa Muscular
                </label>
                <input  
                    id="muscleMass"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la masa muscular" 
                    {...register('muscleMass', {
                        required: 'La masa muscular es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.muscleMass && 
                    <ErrorForm>
                        {errors.muscleMass.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="bodyFatPercentage" className="text-sm uppercase font-bold">
                    Porcentaje Grasa Corporal
                </label>
                <input  
                    id="bodyFatPercentage"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la el porcentaje de grasa" 
                    {...register('bodyFatPercentage', {
                        required: 'El porcentaje de grasa es obligatorio', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.bodyFatPercentage && 
                    <ErrorForm>
                        {errors.bodyFatPercentage.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="visceralFatPercentage" className="text-sm uppercase font-bold">
                    Porcentaje Grasa Viceral 
                </label>
                <input  
                    id="visceralFatPercentage"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingresar el porcentaje de grasa viceral" 
                    {...register('visceralFatPercentage', {
                        required: 'El porcentaje de grasa viceral es obligatorio', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.visceralFatPercentage && 
                    <ErrorForm>
                        {errors.visceralFatPercentage.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="neckSize" className="text-sm uppercase font-bold">
                    Medida del cuello
                </label>
                <input  
                    id="neckSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del cuello" 
                    {...register('neckSize', {
                        required: 'La medida del cuello es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.neckSize && 
                    <ErrorForm>
                        {errors.neckSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="shoulderSize" className="text-sm uppercase font-bold">
                    Medida de los hombros
                </label>
                <input  
                    id="shoulderSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de los hombros" 
                    {...register('shoulderSize', {
                        required: 'La medida de los hombros es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.shoulderSize && 
                    <ErrorForm>
                        {errors.shoulderSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="chestSize" className="text-sm uppercase font-bold">
                    Medida del pecho
                </label>
                <input  
                    id="chestSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del pecho" 
                    {...register('chestSize', {
                        required: 'La medida del pecho es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.chestSize && 
                    <ErrorForm>
                        {errors.chestSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="waistSize" className="text-sm uppercase font-bold">
                    Medida de la cintura
                </label>
                <input  
                    id="waistSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la cintura" 
                    {...register('waistSize', {
                        required: 'La medida de la cintura es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.waistSize && 
                    <ErrorForm>
                        {errors.waistSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="thighSize" className="text-sm uppercase font-bold">
                    Medida del muslo
                </label>
                <input  
                    id="thighSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del muslo" 
                    {...register('thighSize', {
                        required: 'La medida del muslo es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.thighSize && 
                    <ErrorForm>
                        {errors.thighSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="calfSize" className="text-sm uppercase font-bold">
                    Medida de la pantorrilla
                </label>
                <input  
                    id="calfSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida de la pantorrilla" 
                    {...register('calfSize', {
                        required: 'La medida de la pantorrilla es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.calfSize && 
                    <ErrorForm>
                        {errors.calfSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="forearmSize" className="text-sm uppercase font-bold">
                    Medida del antebrazo
                </label>
                <input  
                    id="forearmSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del antebrazo" 
                    {...register('forearmSize', {
                        required: 'La medida del antebrazo es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.calfSize && 
                    <ErrorForm>
                        {errors.calfSize.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="armSize" className="text-sm uppercase font-bold">
                    Medida del brazo
                </label>
                <input  
                    id="armSize"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    placeholder="Ingrese la medida del brazo" 
                    {...register('armSize', {
                        required: 'La medida del brazo es obligatoria', 
                        min: {
                            value: 1,
                            message: `Debe ingresar un valor válido`
                        }
                    })}
                />

                {/* mostrar errores del input del monto */}
                {errors.armSize && 
                    <ErrorForm>
                        {errors.armSize.message}
                    </ErrorForm>
                }
            </div>

            <input type="submit" className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" value={activeEditingId ? 'Actualizar' : 'Registrar'} />
        </form> 
    );
}

export default Form;
