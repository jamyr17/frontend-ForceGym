import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { UserDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useUserStore from "./Store";
import { useEffect, useRef } from "react";
import { formatDate } from "../shared/utils/format";
import { useNavigate } from "react-router";
import { useCommonDataStore } from "../shared/CommonDataStore";

// variables usadas en este componente para validaciones del formulario
const MAXLENGTH_IDENTIFICATIONUMBER = 20
const MAXLENGTH_NAME = 50
const MAXLENGTH_FIRSTLASTNAME = 50
const MAXLENGTH_SECONDLASTNAME = 50
const MAXDATE_BIRTHDAY = new Date().toUTCString()
const MAXLENGTH_PHONENUMBER = 15
const MAXLENGTH_EMAIL = 100
const MAXLENGTH_USERNAME = 50

function Form() {
    const navigate = useNavigate()
    const { roles, genders } = useCommonDataStore()
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<UserDataForm>()
    const { users, activeEditingId, fetchUsers, addUser, updateUser, closeModalForm } = useUserStore()

    const submitForm = async (data : UserDataForm) => {
        let action = '', result
        const loggedUser = getAuthUser()
        const reqUser = {
            ...data, 
            gender: 'Masculino', 
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        // si el editingId está en 0 significa que se está agregando 
        if(activeEditingId==0){
            result = await addUser(reqUser)
            action = 'agregado'
        }else{
            result = await updateUser(reqUser)
            action = 'editado'
        }

        closeModalForm()
        reset()
        
        if(result.ok){
            const result2 = await fetchUsers()

            if(result2.logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }else{
                await Swal.fire({
                    title: `Usuario ${action}`,
                    text: `Ha ${action} al usuario ${reqUser.username}`,
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

    }

    useEffect(() => { 
        if(activeEditingId){
            const activeEditingUser = users.filter(users => users.idUser === activeEditingId)[0]
            setValue('idUser', activeEditingUser.idUser)
            setValue('idRole', activeEditingUser.role.idRole)
            setValue('idGender', activeEditingUser.person.gender.idGender)
            setValue('idPerson', activeEditingUser.person.idPerson)
            setValue('identificationNumber', activeEditingUser.person.identificationNumber)
            setValue('name', activeEditingUser.person.name)
            setValue('firstLastName', activeEditingUser.person.firstLastName)
            setValue('secondLastName', activeEditingUser.person.secondLastName)
            setValue('phoneNumber', activeEditingUser.person.phoneNumber)
            setValue('birthday', activeEditingUser.person.birthday)
            setValue('email', activeEditingUser.person.email)
            setValue('username', activeEditingUser.username)
            setValue('isDeleted', Number(activeEditingUser.isDeleted))
        }
    }, [activeEditingId])

    useEffect(() => {
        passwordRef.current = document.getElementById("password") as HTMLInputElement
    }, []);

    return (  
        <form 
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar usuario' : 'Registrar usuario'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idUser" 
                type="hidden" 
                {...register('idUser')}
            />
            <input  
                id="idPerson" 
                type="hidden" 
                {...register('idPerson')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="my-5">
                <label htmlFor="idRole" className="text-sm uppercase font-bold">
                    Rol 
                </label>
                <select
                    id="idRole"
                    className="w-full p-3 border border-gray-100" 
                    {...register("idRole")}  
                >
                    {roles.map((role)=> (
                        <option key={role.idRole} value={role.idRole}>
                            {role.name}
                        </option>
                    ))}
                </select>
            </div>

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
                <label htmlFor="username" className="text-sm uppercase font-bold">
                    Nombre de usuario 
                </label>
                <input  
                    id="username"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el nombre de usuario" 
                    {...register('username', {
                        required: 'El nombre de usuario es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_USERNAME,
                            message: `Debe ingresar un nombre de usuario de máximo ${MAXLENGTH_USERNAME} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del nombre de usuario */}
                {errors.username && 
                    <ErrorForm>
                        {errors.username.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="password" className="text-sm uppercase font-bold">
                    Contraseña
                </label>
                <input  
                    id="password"
                    className="w-full p-3 border border-gray-100"  
                    type="password" 
                    placeholder="Ingrese la contraseña" 
                    {...register('password', {
                        required: 'La contraseña es obligatoria'
                    })}
                />

                {/* mostrar errores del input de la contraseña */}
                {errors.password && 
                    <ErrorForm>
                        {errors.password.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="confirmPassword" className="text-sm uppercase font-bold">
                    Confirmar Contraseña
                </label>
                <input  
                    id="confirmPassword"
                    className="w-full p-3 border border-gray-100"  
                    type="password" 
                    placeholder="Confirme la contraseña" 
                    {...register('confirmPassword', {
                        validate: value => value === passwordRef.current?.value || "Las contraseñas no coinciden"
                    })}
                />

                {/* mostrar errores del input de la confirmación de contraseña */}
                {errors.confirmPassword && 
                    <ErrorForm>
                        {errors.confirmPassword.message}
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