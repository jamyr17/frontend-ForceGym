import { MdArrowBackIosNew } from "react-icons/md";
import { Link, useNavigate, useSearchParams } from "react-router";
import PasswordInput from "../shared/components/PasswordInput";
import { useForm } from "react-hook-form";
import ErrorForm from "../shared/components/ErrorForm";
import { useEffect, useRef } from "react";
import { postData } from "../shared/services/gym";
import Swal from 'sweetalert2';

function ChangePasswordForm () {
    const passwordRef = useRef<HTMLInputElement | null>(null);
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors } } = useForm<{password: string, confirmPassword: string}>()

    const validatePassword = (password: string): true | string => {
        const num = /\d/;
        const lowercase = /[a-z]/;
        const uppercase = /[A-Z]/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const charLength = /^.{8,20}$/;
    
        if (!charLength.test(password)) {
            return "La contraseña debe tener al menos 8 y 20 caracteres.";
        }
        if (!lowercase.test(password)) {
            return "La contraseña debe contener al menos una letra minúscula.";
        }
        if (!uppercase.test(password)) {
            return "La contraseña debe contener al menos una letra mayúscula.";
        }
        if (!num.test(password)) {
            return "La contraseña debe contener al menos un número.";
        }
        if (!specialChar.test(password)) {
            return "La contraseña debe contener al menos un carácter especial.";
        }
    
        return true;
    };

    const submitForm = async (data: {password: string, confirmPassword: string}) => {
        const reqData = {newPassword: data.password, token: searchParams.get('token')}
        const result = await postData(`${import.meta.env.VITE_URL_API}resetPassword`, reqData);
        
        if(result.ok){
            await Swal.fire({
                title: `Contraseña cambiada`,
                text: `Se ha cambiado su contraseña. Ahora puede iniciar sesión.`,
                icon: 'success',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 500,
                confirmButtonColor: '#CFAD04'
            })

            navigate("/login")
        } else {
            await Swal.fire({
                title: 'Error',
                text: result.data?.message || result.error || 'El token no es válido o ha expirado. Por favor, solicita un nuevo enlace de recuperación.',
                icon: 'error',
                confirmButtonText: 'OK',
                width: 500,
                confirmButtonColor: '#d33'
            })
        }
    }

    useEffect(() => {
        if(!searchParams.get('token') || searchParams.get('token')==null){
            Swal.fire({
                title: `Token no encontrado`,
                text: `Realice su solicitud de cambio de contraseña para recibirlo.`,
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 500,
                confirmButtonColor: '#CFAD04'
            }).then(() => {
                navigate("/login");
            })

            setTimeout(() => {
                navigate("/login");
            }, 3000)
        }

        passwordRef.current = document.getElementById("password") as HTMLInputElement
    }, []);

    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-black py-4 px-3 sm:py-8 sm:px-4">
            <main className="w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-white rounded-lg shadow-2xl p-4 sm:p-6 md:p-8">
                <header className="flex items-center gap-3 mb-4 sm:mb-6">
                    <Link
                        to={"/login"}
                        className="hover:text-yellow transition-colors flex-shrink-0"
                    >
                        <MdArrowBackIosNew size={20} className="sm:w-6 sm:h-6" />
                    </Link>

                    <h1 className="font-bold text-base sm:text-lg md:text-xl lg:text-2xl">Cambio de contraseña</h1>
                </header>

                <section className="flex flex-col">
                    <form className="text-left flex flex-col gap-3 sm:gap-4" onSubmit={handleSubmit(submitForm)}>
                        <div>
                            <label htmlFor="password" className="block text-xs sm:text-sm uppercase font-bold text-gray-700 mb-1.5">
                                Nueva Contraseña
                            </label>
                            <PasswordInput     
                                id="password"
                                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"  
                                type="password" 
                                placeholder="Ingrese la contraseña" 
                                {...register('password', {
                                    validate: validatePassword
                                })}
                            />

                            {/* mostrar errores del input de la contraseña */}
                            {errors.password && 
                                <ErrorForm>
                                    {errors.password.message}
                                </ErrorForm>
                            }
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-xs sm:text-sm uppercase font-bold text-gray-700 mb-1.5">
                                Confirmar Contraseña
                            </label>
                            <PasswordInput     
                                id="confirmPassword"
                                className="w-full p-2.5 sm:p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm sm:text-base"  
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

                        <button type="submit" className="w-full text-sm sm:text-base md:text-lg mt-2 sm:mt-4 py-2.5 sm:py-3 bg-black text-white rounded-lg transition-all hover:bg-yellow hover:text-black hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">Cambiar Contraseña</button>
                    </form>                    
                </section>
            </main>
        </div>
    )
}

export default ChangePasswordForm;