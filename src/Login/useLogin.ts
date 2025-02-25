import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { postData } from "../shared/services/gym"
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import { CredencialUser } from "../shared/types"

export const useLogin = () => {
    const [credencialUser, setCredencialUser] = useState<CredencialUser>({username: '', password: ''})
    const navigate = useNavigate()

    useEffect(() => {
        setAuthHeader(null)
        setAuthUser(null)
    }, [])

    const handleLoginSubmit = async (e:any) => {
        e.preventDefault()

        const res = await postData(`${import.meta.env.VITE_URL_API}login`, credencialUser)

        if(res.data.loggedUser){
            setAuthHeader(res.data.loggedUser.token)
            setAuthUser(res.data.loggedUser)
            navigate('/gestion/usuarios', { replace: true })
        }else{
            setAuthHeader(null)
            setAuthUser(null)

            await Swal.fire({
                title: 'Usuario y/o contraseña incorrectos',
                text: 'Inténtelo de nuevo',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 300,
                confirmButtonColor: '#CFAD04'
            })

            return
        }
        
    }

    return{
        credencialUser,
        setCredencialUser,
        handleLoginSubmit
    }
}