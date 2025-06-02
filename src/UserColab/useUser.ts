import Swal from 'sweetalert2';
import { useNavigate } from "react-router";
import { setAuthHeader, setAuthUser } from "../shared/utils/authentication";

export const useUser = () => {
    const navigate = useNavigate();

    const handleUpdateSuccess = () => {
        Swal.fire({
            title: '¡Actualizado!',
            text: 'Tus datos se han actualizado correctamente',
            icon: 'success',
            confirmButtonColor: '#CFAD04'
        });
    };

    const handleUpdateError = () => {
        Swal.fire({
            title: 'Error',
            text: 'No se pudo actualizar tus datos',
            icon: 'error',
            confirmButtonColor: '#CFAD04'
        });
    };

    return {
        handleUpdateSuccess,
        handleUpdateError
    };
};