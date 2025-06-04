import { useEffect, useState } from "react"
import { useNavigate } from "react-router";
import Swal from 'sweetalert2';
import { postData } from "../shared/services/gym"
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import { CredencialUser } from "../shared/types"

export const useLogin = () => {
    const [credencialUser, setCredencialUser] = useState<CredencialUser>({
        username: '', 
        password: '', 
        recaptchaToken: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        setAuthHeader(null);
        setAuthUser(null);
    }, []);

    const handleLoginSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {

            const response = await postData(`${import.meta.env.VITE_URL_API}login`, {
                ...credencialUser
            });

            if (response.data?.loggedUser) {
                setAuthHeader(response.data.loggedUser.token);
                setAuthUser(response.data.loggedUser);
                navigate('/gestion/dashboard', { replace: true });
            } else {
                throw new Error('Credenciales incorrectas');
            }
        } catch (error) {
            // Cambio aqui 
            setCredencialUser({ username: '', password: '', recaptchaToken: '' });
            
            await Swal.fire({
                title: 'Error de autenticación',
                text: 'Usuario y/o contraseña incorrectos. Por favor, intente nuevamente.',
                icon: 'error',
                confirmButtonText: 'OK',
                timer: 3000,
                timerProgressBar: true,
                width: 300,
                confirmButtonColor: '#CFAD04'
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return {
        credencialUser,
        setCredencialUser,
        handleLoginSubmit,
        isSubmitting
    };
};