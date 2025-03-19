import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { NotificationTemplateDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useNotificationTemplateStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCommonDataStore } from "../shared/CommonDataStore";

// variable usada en este componente para validaciones del formulario
const MAXLENGTH_MESSAGE = 1027

function Form() {
    const navigate = useNavigate()
    const { notificationTypes } = useCommonDataStore()
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<NotificationTemplateDataForm>()
    const { notificationTemplates, activeEditingId, fetchNotificationTemplates, addNotificationTemplate, updateNotificationTemplate, closeModalForm } = useNotificationTemplateStore()

    const submitForm = async (data : NotificationTemplateDataForm) => {
        let action = '', result
        const loggedUser = getAuthUser()
        const reqNotificationTemplate = {
            ...data, 
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        // si el editingId está en 0 significa que se está agregando 
        if(activeEditingId==0){
            result = await addNotificationTemplate(reqNotificationTemplate)
            action = 'agregado'
        }else{
            result = await updateNotificationTemplate(reqNotificationTemplate)
            action = 'editado'
        }

        closeModalForm()
        reset()
        
        if(result.ok){
            const result2 = await fetchNotificationTemplates()

            if(result2.logout){
                setAuthHeader(null)
                setAuthUser(null)
                navigate('/login', {replace: true})
            }else{
                await Swal.fire({
                    title: `Plantilla ${action}`,
                    text: `Ha ${action} a la plantilla`,
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
            const activeEditingNotificationTemplate = notificationTemplates.filter(notificationTemplates => notificationTemplates.idNotificationTemplate === activeEditingId)[0]
            setValue('idNotificationTemplate', activeEditingNotificationTemplate.idNotificationTemplate)
            setValue('idUser', activeEditingNotificationTemplate.user.idUser)
            setValue('idNotificationType', activeEditingNotificationTemplate.notificationType.idNotificationType)
            setValue('message', activeEditingNotificationTemplate.message)
            setValue('isDeleted', Number(activeEditingNotificationTemplate.isDeleted))
        }
    }, [activeEditingId])

    return (  
        <form 
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar plantilla de notificación' : 'Registrar plantilla de notificación'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idNotificationTemplate" 
                type="hidden" 
                {...register('idNotificationTemplate')}
            />
            <input  
                id="idUser" 
                type="hidden" 
                {...register('idUser')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

            <div className="my-5">
                <label htmlFor="idNotificationType" className="text-sm uppercase font-bold">
                    Tipo de Notificación 
                </label>
                <select
                    id="idNotificationType"
                    className="w-full p-3 border border-gray-100" 
                    {...register("idNotificationType")}  
                >
                    {notificationTypes.map((noti)=> (
                        <option key={noti.idNotificationType} value={noti.idNotificationType}>
                            {noti.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="mb-5">
                <label htmlFor="message" className="text-sm uppercase font-bold">
                    Mensaje 
                </label>
                <input  
                    id="message"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el mensaje" 
                    {...register('message', {
                        required: 'El mensaje es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_MESSAGE,
                            message: `Debe ingresar un mensaje de máximo ${MAXLENGTH_MESSAGE} carácteres`
                        }
                    })}
                />

                {/* mostrar errores del input del nombre */}
                {errors.message && 
                    <ErrorForm>
                        {errors.message.message}
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