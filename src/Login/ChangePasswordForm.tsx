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
        <div className="flex flex-col justify-center items-center h-screen bg-black">
            <main className="self-center text-center justify-center h-[70vh] gap-16 p-12 w-[80vh] bg-white rounded-lg">
                <header className="flex between gap-4 items-center mb-8">
                    <Link
                        to={"/login"}
                        className="hover:text-yellow "
                    >
                        <MdArrowBackIosNew/>
                    </Link>

                    <h1 className="font-bold text-xl">Cambio de contraseña</h1>
                </header>

                <section className="flex flex-col h-full gap-4">
                    <form className="text-left flex flex-col gap-4" onSubmit={handleSubmit(submitForm)}>
                        <div className="mb-5">
                            <label htmlFor="password" className="text-sm uppercase font-bold">
                                Nueva Contraseña
                            </label>
                            <PasswordInput     
                                id="password"
                                className="w-full p-3 border border-gray-100"  
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

                        <div className="mb-5">
                            <label htmlFor="confirmPassword" className="text-sm uppercase font-bold">
                                Confirmar Contraseña
                            </label>
                            <PasswordInput     
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

                        <button type="submit" className="text-1xl mt-4 py-2 bg-black text-white rounded-4xl transition-all hover:bg-yellow hover:text-black hover:cursor-pointer">Enviar</button>
                    </form>                    
                </section>
            </main>
        </div>
    )
}

export default ChangePasswordForm;