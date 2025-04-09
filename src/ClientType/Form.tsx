import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { ClientTypeDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useClientTypeStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCommonDataStore } from "../shared/CommonDataStore";

// variable usada en este componente para validaciones del formulario
const MAXLENGTH_MESSAGE = 1027;

function Form() {
    const navigate = useNavigate();
    const { clientTypes } = useCommonDataStore();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ClientTypeDataForm>();
    const { clientTypesList, activeEditingId, fetchClientTypes, addClientType, updateClientType, closeModalForm } = useClientTypeStore();

    const submitForm = async (data: ClientTypeDataForm) => {
        let action = '', result;
        const loggedUser = getAuthUser();
        const reqClientType = {
            ...data,
            paramLoggedIdUser: loggedUser?.idUser
        };

        // si el editingId está en 0 significa que se está agregando 
        if (activeEditingId === 0) {
            result = await addClientType(reqClientType);
            action = 'agregado';
        } else {
            result = await updateClientType(reqClientType);
            action = 'editado';
        }

        closeModalForm();
        reset();

        if (result.ok) {
            const result2 = await fetchClientTypes();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                await Swal.fire({
                    title: `Tipo de cliente ${action}`,
                    text: `Ha ${action} al tipo de cliente`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            }

        } else if (result.logout) {
            setAuthHeader(null);
            setAuthUser(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        if (activeEditingId) {
            const activeEditingClientType = clientTypesList.filter(client => client.idClientType === activeEditingId)[0];
            setValue('idClientType', activeEditingClientType.idClientType);
            setValue('clientTypeName', activeEditingClientType.clientTypeName);
            setValue('isDeleted', Number(activeEditingClientType.isDeleted));
        }
    }, [activeEditingId]);

    return (
        <form
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar tipo de cliente' : 'Registrar tipo de cliente'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input
                id="idClientType"
                type="hidden"
                {...register('idClientType')}
            />
            <input
                id="isDeleted"
                type="hidden"
                {...register('isDeleted')}
            />

            <div className="my-5">
                <label htmlFor="clientTypeName" className="text-sm uppercase font-bold">
                    Nombre del tipo de cliente
                </label>
                <input
                    id="clientTypeName"
                    className="w-full p-3 border border-gray-100"
                    type="text"
                    placeholder="Ingrese el nombre del tipo de cliente"
                    {...register('clientTypeName', {
                        required: 'El nombre del tipo de cliente es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_MESSAGE,
                            message: `Debe ingresar un nombre de tipo de cliente de máximo ${MAXLENGTH_MESSAGE} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del nombre */}
                {errors.clientTypeName &&
                    <ErrorForm>
                        {errors.clientTypeName.message}
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
