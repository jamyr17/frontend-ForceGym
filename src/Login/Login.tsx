import { useRef } from "react";
import type { CredencialUser } from "../shared/types/index";
import PasswordInput from "../shared/components/PasswordInput";
import ReCAPTCHA from 'react-google-recaptcha';
import { Link } from "react-router-dom";

type LoginProps = {
    credencialUser: CredencialUser;
    setCredencialUser: React.Dispatch<React.SetStateAction<CredencialUser>>;
    handleLoginSubmit: (e: React.FormEvent, refReCaptcha: React.RefObject<ReCAPTCHA>) => void;
    isSubmitting: boolean;
};

function Login({ credencialUser, setCredencialUser, handleLoginSubmit, isSubmitting }: LoginProps) {
    const recaptcha = useRef<ReCAPTCHA>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredencialUser(prev => ({
            ...prev,
            [name]: value
        }));

        // Resetear el ReCAPTCHA si hay cambios después de un error
        if (recaptcha.current?.getValue()) {
            recaptcha.current.reset();
        }
    };

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-black">
            <main className="flex justify-center h-[550px] gap-16 p-12 w-auto bg-white rounded-lg">
                <section className="flex flex-col h-full gap-4">
                    <header className="flex justify-center">
                        <img 
                            src="Logo.webp" 
                            alt="Logo de Force GYM" 
                            className="w-52 h-auto"
                        />
                    </header>

                    <form 
                        className="flex flex-col gap-4" 
                        onSubmit={(e) => handleLoginSubmit(e, recaptcha)}
                    >
                        <label htmlFor='username' className="text-1xl font-bold">Usuario</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            value={credencialUser.username} 
                            onChange={handleInputChange}
                            placeholder="Ingresar usuario" 
                            required 
                            className="p-2 outline-1"
                            disabled={isSubmitting}
                        />

                        <label htmlFor="password" className="text-1xl font-bold">Contraseña</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={credencialUser.password}
                            onChange={handleInputChange}
                            placeholder="Ingresar contraseña"
                            required
                            disabled={isSubmitting}
                        />

                        <ReCAPTCHA 
                            ref={recaptcha} 
                            sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`}
                        />

                        <button 
                            type="submit" 
                            disabled={isSubmitting}
                            className={`text-1xl mt-4 py-2 bg-black text-white rounded-4xl transition-all hover:bg-yellow hover:text-black hover:cursor-pointer ${
                                isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                            }`}
                        >
                            {isSubmitting ? 'Procesando...' : 'Iniciar Sesión'}
                        </button>

                        <Link
                            to="/forgot-password"
                            className="text-1xls text-center hover:underline hover:decoration-yellow"
                        >
                            ¿Olvidó su contraseña?
                        </Link>
                    </form>
                </section>
            
                <aside className="w-full max-w-[500px] flex items-center justify-center bg-white rounded-r-lg overflow-hidden">
                    <div className="w-full h-full rounded-xl overflow-hidden shadow-md">
                        <img 
                            src="Gym.webp" 
                            alt="Imagen del equipo de Force GYM" 
                            className="w-full h-full max-h-[550px] object-cover object-center"
                        />
                    </div>
                </aside>
            </main>
        </div>
    );
}

export default Login;