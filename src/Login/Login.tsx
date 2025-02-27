import type { CredencialUser } from "../shared/types/index"

type LoginProps = {
    credencialUser: CredencialUser
    setCredencialUser: React.Dispatch<React.SetStateAction<CredencialUser>>
    handleLoginSubmit: (e: any) => void
}

function Login ({credencialUser, setCredencialUser, handleLoginSubmit} : LoginProps) {

    return (
        <div className="flex flex-col justify-center items-center h-screen bg-black">
            <main className="flex justify-center h-[550px] gap-16 p-12 w-auto bg-white rounded-lg">
                <section className="flex flex-col h-full gap-12">
                    <header className="flex justify-center">
                        <img src="Logo.jpg" alt="Logo de Force GYM" className="w-64 h-auto"></img>
                    </header>

                    <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
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

                        <label htmlFor='password' className="text-1xl font-bold">Contraseña</label>
                        <input 
                            type="password" 
                            name="password" 
                            id="password" 
                            value={credencialUser.password} 
                            onChange={e => setCredencialUser({...credencialUser, password: e.target.value})} 
                            placeholder="Ingresar contraseña" 
                            required 
                            className="p-2 outline-1"
                        />

                        <button type="submit" className="text-1xl mt-8 py-2 bg-black text-white rounded-4xl transition-all hover:bg-yellow hover:text-black hover:cursor-pointer">Iniciar Sesión</button>
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