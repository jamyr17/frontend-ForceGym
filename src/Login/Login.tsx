import { useRef } from "react"
import type { CredencialUser } from "../shared/types/index"
import PasswordInput from "../shared/components/PasswordInput";
import ReCAPTCHA from 'react-google-recaptcha'

type LoginProps = {
    credencialUser: CredencialUser
    setCredencialUser: React.Dispatch<React.SetStateAction<CredencialUser>>
    handleLoginSubmit: (e: any, refReCaptcha: React.RefObject<ReCAPTCHA>) => void
}

function Login ({credencialUser, setCredencialUser, handleLoginSubmit} : LoginProps) {
    const recaptcha = useRef<ReCAPTCHA>(null)

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-black">
            <main className="flex justify-center h-[550px] gap-16 p-12 w-auto bg-white rounded-lg">
                <section className="flex flex-col h-full gap-4">
                    <header className="flex justify-center">
                        <img src="Logo.jpg" alt="Logo de Force GYM" className="w-52 h-auto"></img>
                    </header>

                    <form className="flex flex-col gap-4" onSubmit={(e) => handleLoginSubmit(e, recaptcha)}>
                        <label htmlFor='username' className="text-1xl font-bold">Usuario</label>
                        <input 
                            type="text" 
                            name="username" 
                            id="username" 
                            value={credencialUser.username} 
                            onChange={e => setCredencialUser({...credencialUser, username: e.target.value})} 
                            placeholder="Ingresar usuario" 
                            required 
                            className="p-2 outline-1"
                        />

                        <label htmlFor="password" className="text-1xl font-bold">Contraseña</label>
                        <PasswordInput
                            id="password"
                            name="password"
                            value={credencialUser.password}
                            onChange={e => setCredencialUser({ ...credencialUser, password: e.target.value })}
                            placeholder="Ingresar contraseña"
                            required
                        />

                        <ReCAPTCHA ref={recaptcha} sitekey={`${import.meta.env.VITE_RECAPTCHA_SITE_KEY}`} />

                        <button type="submit" className="text-1xl mt-4 py-2 bg-black text-white rounded-4xl transition-all hover:bg-yellow hover:text-black hover:cursor-pointer">Iniciar Sesión</button>
                        <a href="#" className="text-1xls text-center hover:underline hover:decoration-yellow">¿Olvidó su contraseña?</a>
                
                    </form>
                </section>
                <aside className="bg-yellow self-center h-[470px] w-[375px] rounded-2xl">

                </aside>
            </main>
        </div>
    );
}

export default Login;