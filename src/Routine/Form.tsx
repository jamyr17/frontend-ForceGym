import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { RoutineDataForm } from "../shared/types"; // Tu nuevo tipo de Rutinas
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useRoutineStore from "./Store"; // Tu nuevo store
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useCommonDataStore } from "../shared/CommonDataStore";

function Form() {
    const navigate = useNavigate();
    const { difficultyRoutine } = useCommonDataStore();
    const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<RoutineDataForm>();
    const { routines, activeEditingId, fetchRoutines, addRoutine, updateRoutine, closeModalForm } = useRoutineStore();

    const submitForm = async (data: RoutineDataForm) => {
        const loggedUser = getAuthUser();
        const reqRoutine = {
            ...data,
            paramLoggedIdUser: loggedUser?.idUser
        };

        let action = '', result;
        if (activeEditingId === 0) {
            result = await addRoutine(reqRoutine);
            action = 'agregado';
        } else {
            result = await updateRoutine(reqRoutine);
            action = 'editado';
        }

        closeModalForm();
        reset();

        if (result.ok) {
            const result2 = await fetchRoutines();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login', { replace: true });
            } else {
                await Swal.fire({
                    title: `Rutina ${action}`,
                    text: `Se ha ${action} la rutina correctamente`,
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
            const routine = routines.find(r => r.idRoutine === activeEditingId);
            if (routine) {
                setValue('idRoutine', routine.idRoutine);
                setValue('idUser', routine.user.idUser);
                setValue('idDifficultyRoutine', routine.difficultyRoutine.idDifficultyRoutine);
                setValue('isDeleted', Number(routine.isDeleted));
                setValue('name', routine.name);
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
                {activeEditingId ? 'Actualizar Rutina' : 'Registrar Rutina'}
            </legend>

            {/* Hidden fields */}
            <input id="idRoutine" type="hidden" {...register('idRoutine')} />
            <input id="idUser" type="hidden" {...register('idUser')} />
            <input id="isDeleted" type="hidden" {...register('isDeleted')} />

            {/* Select Dificultad de Rutina */}
            <div className="my-5">
                <label htmlFor="idDifficultyRoutine" className="text-sm uppercase font-bold">
                    Dificultad de Rutina
                </label>
                <select
                    id="idDifficultyRoutine"
                    className="w-full p-3 border border-gray-100"
                    {...register("idDifficultyRoutine")}
                >
                    {difficultyRoutine.map((difficultyRoutine) => (
                        <option key={difficultyRoutine.idDifficultyRoutine} value={difficultyRoutine.idDifficultyRoutine}>
                            {difficultyRoutine.name}
                        </option>
                    ))}
                </select>
            </div>

            {/* Input Nombre de Rutina */}
            <div className="mb-5">
                <label htmlFor="name" className="text-sm uppercase font-bold">
                    Nombre de la Rutina
                </label>
                <input
                    id="name"
                    className="w-full p-3 border border-gray-100"
                    type="text"
                    placeholder="Ingrese el nombre de la rutina"
                    {...register('name', { required: 'El nombre de la rutina es obligatorio' })}
                />
                {errors.name &&
                    <ErrorForm>
                        {errors.name.message}
                    </ErrorForm>
                }
            </div>

            {/* Submit */}
            <input
                type="submit"
                className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value={activeEditingId ? 'Actualizar' : 'Registrar'}
            />
        </form>
    );
}

export default Form;
