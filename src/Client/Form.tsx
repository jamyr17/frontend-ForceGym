import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { ClientDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useClientStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";

const MAXLENGTH_IDENTIFICATIONUMBER = 20
const MAXLENGTH_NAME = 50
const MAXLENGTH_FIRSTLASTNAME = 50
const MAXLENGTH_SECONDLASTNAME = 50
const MAXDATE_BIRTHDAY = new Date().toUTCString()
const MAXLENGTH_PHONENUMBER = 15
const MAXLENGTH_EMAIL = 100

function Form() {
    const navigate = useNavigate();
    const { genders } = useCommonDataStore();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ClientDataForm>();
    const { clients, activeEditingId, fetchClients, addClient, updateClient, closeModalForm } = useClientStore();

    const submitForm = async (data: ClientDataForm) => {
        let action = '', result;
        const loggedUser = getAuthUser()
        const reqUser = {
            ...data, 
            idUser: 7, 
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        if (activeEditingId === 0) {
            result = await addClient(reqUser);
            action = 'agregado';
        } else {
            result = await updateClient(reqUser);
            action = 'editado';
        }

        closeModalForm()
        reset()
        
        if (result.ok) {
            const result2 = await fetchClients()
            
            if(result2.logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }else{
                await Swal.fire({
                    title: `Cliente ${action}`,
                    text: `Se ha ${action} el cliente`,
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
            const activeClient = clients.find(client => client.idClient === activeEditingId)
            if (activeClient) {
                setValue('idClient', activeClient.idClient)
                setValue('idUser', activeClient.user.idUser)
                setValue('idTypeClient', activeClient.typeClient.idTypeClient)
                setValue('registrationDate', activeClient.registrationDate);
                setValue('emergencyContact', activeClient.emergencyContact);
                setValue('signatureImage', activeClient.signatureImage);
                setValue('isDeleted', activeClient.isDeleted);

                // Seteando los valores del HealthQuestionaire
                setValue('idHealthQuestionnaire', activeClient.healthQuestionnaire.idHealthQuestionnaire);
                setValue('diabetes', activeClient.healthQuestionnaire.diabetes);
                setValue('hypertension', activeClient.healthQuestionnaire.hypertension);
                setValue('muscleInjuries', activeClient.healthQuestionnaire.muscleInjuries);
                setValue('boneJointIssues', activeClient.healthQuestionnaire.boneJointIssues);
                setValue('balanceLoss', activeClient.healthQuestionnaire.balanceLoss);
                setValue('cardiovascularDisease', activeClient.healthQuestionnaire.cardiovascularDisease);
                setValue('breathingIssues', activeClient.healthQuestionnaire.breathingIssues);
                setValue('isDeleted', activeClient.healthQuestionnaire.isDeleted);

                // Seteando los valores de Person
                setValue('idPerson', activeClient.person.idPerson);
                setValue('identificationNumber', activeClient.person.identificationNumber);
                setValue('name', activeClient.person.name);
                setValue('firstLastName', activeClient.person.firstLastName);
                setValue('secondLastName', activeClient.person.secondLastName);
                setValue('birthday', activeClient.person.birthday);
                setValue('idGender', activeClient.person.gender.idGender);
                setValue('email', activeClient.person.email);
                setValue('phoneNumber', activeClient.person.phoneNumber);
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
                {activeEditingId ? 'Actualizar cliente' : 'Registrar cliente'}
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
                {...register('idClient')}
            />
            <input  
                id="idTypeClient" 
                type="hidden" 
                value={1}
                {...register('idTypeClient')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />
            <input  
                id="signatureImage" 
                type="hidden" 
                value={'ffiwiw'}
                {...register('signatureImage')}
            />

            {/* Se debe hacer un select para tipo de cliente
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
            */}

            <div className="mb-5">
                <label htmlFor="identificationNumber" className="text-sm uppercase font-bold">
                    Cédula 
                </label>
                <input  
                    id="identificationNumber"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese la cédula" 
                    {...register('identificationNumber', {
                        required: 'La cédula es obligatoria',
                        maxLength: {
                            value: MAXLENGTH_IDENTIFICATIONUMBER,
                            message: `Debe ingresar una cédula de máximo ${MAXLENGTH_IDENTIFICATIONUMBER} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input de la cedula */}
                {errors.identificationNumber && 
                    <ErrorForm>
                        {errors.identificationNumber.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre 
                </label>
                <input  
                    id="name"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el nombre" 
                    {...register('name', {
                        required: 'El nombre es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_NAME,
                            message: `Debe ingresar un nombre de máximo ${MAXLENGTH_NAME} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del nombre */}
                {errors.name && 
                    <ErrorForm>
                        {errors.name.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="firstLastName" className="text-sm uppercase font-bold">
                    Primer Apellido 
                </label>
                <input  
                    id="firstLastName"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el primer apellido" 
                    {...register('firstLastName', {
                        required: 'El primer apellido es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_FIRSTLASTNAME,
                            message: `Debe ingresar un primer apellido de máximo ${MAXLENGTH_FIRSTLASTNAME} carácteres`
                        }
                    })}
                />
                
                {/* mostrar errores del input del primer apellido */}
                {errors.firstLastName && 
                    <ErrorForm>
                        {errors.firstLastName.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="secondLastName" className="text-sm uppercase font-bold">
                    Segundo Apellido 
                </label>
                <input  
                    id="secondLastName"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el segundo apellido" 
                    {...register('secondLastName', {
                        required: 'El segundo apellido es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_SECONDLASTNAME,
                            message: `Debe ingresar un segundo apellido de máximo ${MAXLENGTH_SECONDLASTNAME} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del segundo apellido */}
                {errors.secondLastName && 
                    <ErrorForm>
                        {errors.secondLastName.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="birthday" className="text-sm uppercase font-bold">
                    Fecha de nacimiento
                </label>
                <input  
                    id="birthday"
                    className="w-full p-3 border border-gray-100"  
                    type="date" 
                    {...register('birthday', {
                        required: 'La fecha de nacimiento es obligatoria',
                        max: {
                            value: MAXDATE_BIRTHDAY,
                            message: `Debe ingresar una fecha de nacimiento de máximo ${formatDate(new Date())}`
                        }
                    })}
                />

                {/* mostrar errores del input de la fecha de nacimiento */}
                {errors.birthday && 
                    <ErrorForm>
                        {errors.birthday.message}
                    </ErrorForm>
                }
            </div>

            <div className="my-5">
                <label htmlFor="idGender" className="text-sm uppercase font-bold">
                    Género 
                </label>
                <select
                    id="idGender"
                    className="w-full p-3 border border-gray-100" 
                    {...register("idGender")}  
                >
                    {genders.map((gender)=> (
                        <option key={gender.idGender} value={gender.idGender}>
                            {gender.name}
                        </option>
                    ))}
                </select>
            </div>   

            <div className="mb-5">
                <label htmlFor="phoneNumber" className="text-sm uppercase font-bold">
                    Teléfono
                </label>
                <input  
                    id="phoneNumber"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el número de teléfono" 
                    {...register("phoneNumber", {
                        required: 'El número de teléfono es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_PHONENUMBER,
                            message: `Debe ingresar número de teléfono de máximo ${MAXLENGTH_PHONENUMBER} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del número de teléfono */}
                {errors.phoneNumber && 
                    <ErrorForm>
                        {errors.phoneNumber.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="emergencyContact" className="text-sm uppercase font-bold">
                    Contacto de emergencia
                </label>
                <input  
                    id="emergencyContact"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el contacto de emergencia" 
                    {...register("emergencyContact", {
                        required: 'El contacto de emergencia es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_PHONENUMBER,
                            message: `Debe ingresar un contacto de emergencia de máximo ${MAXLENGTH_PHONENUMBER} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del contacto de emergencia */}
                {errors.emergencyContact && 
                    <ErrorForm>
                        {errors.emergencyContact.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="email" className="text-sm uppercase font-bold">
                    Email 
                </label>
                <input  
                    id="email"
                    className="w-full p-3 border border-gray-100"  
                    type="email" 
                    placeholder="Ingrese el email" 
                    {...register("email", {
                        required: "El email es obligatorio",
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'Email no válido'
                        },
                        maxLength: {
                            value: MAXLENGTH_EMAIL,
                            message: `Debe ingresar email de máximo ${MAXLENGTH_EMAIL} carácteres`
                        }
                    })} 
                />
                
                {/* mostrar errores del input del email */}
                {errors.email && 
                    <ErrorForm>
                        {errors.email.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="registrationDate" className="text-sm uppercase font-bold">
                    Fecha de registro
                </label>
                <input  
                    id="registrationDate"
                    className="w-full p-3 border border-gray-100"  
                    type="date" 
                    {...register('registrationDate', {
                        required: 'La fecha de registro es obligatoria',
                        max: {
                            value: MAXDATE_BIRTHDAY,
                            message: `Debe ingresar una fecha de registro de máximo ${formatDate(new Date())}`
                        }
                    })}
                />

                {/* mostrar errores del input de la fecha de nacimiento */}
                {errors.registrationDate && 
                    <ErrorForm>
                        {errors.registrationDate.message}
                    </ErrorForm>
                }
            </div>

            {/* Datos de salud */}
            <fieldset className="border p-3 mb-5">
                <legend className="text-lg font-bold">Cuestionario de Salud</legend>

                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Tiene diabetes?</label>
                    <input type="checkbox" {...register('diabetes')} />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Tiene hipertensión?</label>
                    <input type="checkbox" {...register('hypertension')} />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Tiene lesiones musculares?</label>
                    <input type="checkbox" {...register('muscleInjuries')} />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Tiene problemas óseos o en articulaciones?</label>
                    <input type="checkbox" {...register('boneJointIssues')} />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Sufre de pérdida de equilibrio?</label>
                    <input type="checkbox" {...register('balanceLoss')} />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Tiene enfermedades cardiovasculares?</label>
                    <input type="checkbox" {...register('cardiovascularDisease')} />
                </div>
                <div className="mb-3">
                    <label className="block text-sm font-bold">¿Tiene problemas respiratorios?</label>
                    <input type="checkbox" {...register('breathingIssues')} />
                </div>
            </fieldset>

            <input type="submit" className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors" value={activeEditingId ? 'Actualizar' : 'Registrar'} />
        </form> 
    );
}

export default Form;
