import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { NotificationTemplateDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useNotificationTemplateStore from "./Store";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useCommonDataStore } from "../shared/CommonDataStore";
import EmojiPicker from 'emoji-picker-react';

const MAXLENGTH_MESSAGE = 1027;

function Form() {
    const messageInputRef = useRef<HTMLInputElement>(null);
    const [messageValue, setMessageValue] = useState("");
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [cursorPosition, setCursorPosition] = useState<number>(0);

    const navigate = useNavigate();
    const { notificationTypes } = useCommonDataStore();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<NotificationTemplateDataForm>();
    const { notificationTemplates, activeEditingId, fetchNotificationTemplates, addNotificationTemplate, updateNotificationTemplate, closeModalForm } = useNotificationTemplateStore();

    const submitForm = async (data: NotificationTemplateDataForm) => {
        data.message = messageValue;

        let action = '', result;
        const loggedUser = getAuthUser();
        const reqNotificationTemplate = {
            ...data,
            paramLoggedIdUser: loggedUser?.idUser
        };

        if (activeEditingId === 0) {
            result = await addNotificationTemplate(reqNotificationTemplate);
            action = 'agregado';
        } else {
            result = await updateNotificationTemplate(reqNotificationTemplate);
            action = 'editado';
        }

        closeModalForm();
        reset();
        setMessageValue("");

        if (result.ok) {
            const result2 = await fetchNotificationTemplates();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                await Swal.fire({
                    title: `Plantilla ${action}`,
                    text: `Ha ${action} a la plantilla`,
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
            const template = notificationTemplates.find(n => n.idNotificationTemplate === activeEditingId);
            if (template) {
                setValue('idNotificationTemplate', template.idNotificationTemplate);
                setValue('idUser', template.user.idUser);
                setValue('idNotificationType', template.notificationType.idNotificationType);
                setValue('isDeleted', Number(template.isDeleted));
                setMessageValue(template.message);
                setValue('message', template.message);
            }
        }
    }, [activeEditingId]);

    return (
        <form
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar plantilla de notificación' : 'Registrar plantilla de notificación'}
            </legend>

            <input id="idNotificationTemplate" type="hidden" {...register('idNotificationTemplate')} />
            <input id="idUser" type="hidden" {...register('idUser')} />
            <input id="isDeleted" type="hidden" {...register('isDeleted')} />

            <div className="my-5">
                <label htmlFor="idNotificationType" className="text-sm uppercase font-bold">
                    Tipo de Notificación
                </label>
                <select
                    id="idNotificationType"
                    className="w-full p-3 border border-gray-100"
                    {...register("idNotificationType")}
                >
                    {notificationTypes.map((noti) => (
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
                <div className="relative">
                    <input
                        ref={messageInputRef}
                        id="message"
                        className="w-full p-3 border border-gray-100"
                        type="text"
                        placeholder="Ingrese el mensaje"
                        value={messageValue}
                        onChange={(e) => {
                            setMessageValue(e.target.value);
                            setValue('message', e.target.value);
                        }}
                        onClick={(e) => {
                            const input = e.currentTarget;
                            setCursorPosition(input.selectionStart ?? 0);
                        }}
                        onKeyUp={(e) => {
                            const input = e.currentTarget;
                            setCursorPosition(input.selectionStart ?? 0);
                        }}
                        onFocus={(e) => {
                            const input = e.currentTarget;
                            setCursorPosition(input.selectionStart ?? 0);
                        }}
                    />
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-gray-100 p-1 rounded hover:bg-gray-200 transition"
                        title={showEmojiPicker ? 'Ocultar emojis' : 'Mostrar emojis'}
                        onClick={() => {
                            setShowEmojiPicker(!showEmojiPicker);
                            const input = messageInputRef.current;
                            if (input) {
                                setTimeout(() => {
                                    input.focus();
                                    setCursorPosition(input.selectionStart ?? 0);
                                }, 0);
                            }
                        }}
                    >
                        😊
                    </button>
                </div>

                {showEmojiPicker && (
                    <div className="mt-2">
                        <EmojiPicker
                            onEmojiClick={(emojiData) => {
                                const emoji = emojiData.emoji;
                                const start = cursorPosition;
                                const end = cursorPosition;

                                const newText =
                                    messageValue.slice(0, start) +
                                    emoji +
                                    messageValue.slice(end);

                                const newCursorPosition = start + emoji.length;

                                setMessageValue(newText);
                                setValue('message', newText);
                                setCursorPosition(newCursorPosition);

                                setTimeout(() => {
                                    const input = messageInputRef.current;
                                    if (input) {
                                        input.focus();
                                        input.setSelectionRange(newCursorPosition, newCursorPosition);
                                    }
                                }, 0);
                            }}
                        />
                    </div>
                )}

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