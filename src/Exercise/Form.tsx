import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { ExerciseDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useExerciseStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { useCommonDataStore } from "../shared/CommonDataStore";

const MAXLENGTH_NAME = 100;
const MAXLENGTH_DESCRIPTION = 255;

function FormExercise() {
  const navigate = useNavigate();
  const { exerciseCategories, exerciseDifficulty } = useCommonDataStore();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<ExerciseDataForm>();
  const {
    exercises,
    activeEditingId,
    fetchExercises,
    addExercise,
    updateExercise,
    closeModalForm
  } = useExerciseStore();

  const submitForm = async (data: ExerciseDataForm) => {
    const loggedUser = getAuthUser();

    if (!loggedUser) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
      return;
    }

    const reqData = {
      ...data,
      paramLoggedIdUser: loggedUser.idUser,
      idUser: loggedUser.idUser,
    };

    let result;
    const isEditing = activeEditingId !== 0;
    const actionText = isEditing ? "actualizada" : "agregada";

    result = isEditing
      ? await updateExercise(reqData)
      : await addExercise(reqData);

    closeModalForm();
    reset();

    if (result.ok) {
      const result2 = await fetchExercises();

      if (result2.logout) {
        setAuthHeader(null);
        setAuthUser(null);
        navigate('/login');
        return;
      }

      Swal.fire({
        title: `Ejercicio ${actionText}`,
        text: `Se ha ${actionText} el ejercicio ${reqData.name}`,
        icon: 'success',
        confirmButtonText: 'OK',
        timer: 3000,
        timerProgressBar: true,
        width: 500,
        confirmButtonColor: '#CFAD04'
      });
    } else if (result.logout) {
      setAuthHeader(null);
      setAuthUser(null);
      navigate("/login");
    }
  };

  useEffect(() => {
    if (activeEditingId !== 0) {
      const exercise = exercises.find(ex => ex.idExercise === activeEditingId);
      if (exercise) {
        setValue("idExercise", exercise.idExercise);
        setValue("name", exercise.name);
        setValue("description", exercise.description);
        // Cambios realizados aquí:
        setValue("idExerciseDifficulty", exercise.exerciseDifficulty?.idExerciseDifficulty); // ANTES ESTABA: exercise.idExerciseDifficulty || exercise.exerciseDifficulty?.idDifficulty, SE DEBE CORREGIR
        setValue("idExerciseCategory", exercise.exerciseCategory?.idExerciseCategory);
        setValue("isDeleted", exercise.isDeleted);
      }
    }
  }, [activeEditingId, exercises, setValue]);

  return (
    <form
      className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
      noValidate
      onSubmit={handleSubmit(submitForm)}
    >
      <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
        {activeEditingId ? "Actualizar ejercicio" : "Registrar ejercicio"}
      </legend>

      {/* Inputs ocultos */}
      <input type="hidden" {...register("idExercise")} />
      <input type="hidden" {...register("idUser")} />
      <input type="hidden" {...register("isDeleted")} />

      {/* Campo nombre */}
      <div className="mb-5">
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Nombre
        </label>
        <input
          id="name"
          className="w-full p-3 border border-gray-100"
          type="text"
          placeholder="Ingrese el nombre"
          {...register("name", {
            required: "El nombre es obligatorio",
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Máximo ${MAXLENGTH_NAME} caracteres`
            }
          })}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>

      {/* Campo descripción */}
      <div className="mb-5">
        <label htmlFor="description" className="text-sm uppercase font-bold">
          Descripción
        </label>
        <input
          id="description"
          className="w-full p-3 border border-gray-100"
          type="text"
          placeholder="Ingrese la descripción"
          {...register("description", {
            required: "La descripción es obligatoria",
            maxLength: {
              value: MAXLENGTH_DESCRIPTION,
              message: `Máximo ${MAXLENGTH_DESCRIPTION} caracteres`
            }
          })}
        />
        {errors.description && <ErrorForm>{errors.description.message}</ErrorForm>}
      </div>

      {/* Campo Dificultad (select) */}
      <div className="mb-5">
        <label htmlFor="idExerciseDifficulty" className="text-sm uppercase font-bold">
        Dificultad
        </label>
        <select
          id="idExerciseDifficulty"
          className="w-full p-3 border border-gray-100"
          {...register("idExerciseDifficulty", { required: "La Dificultad es obligatoria" })}
        >
          <option value="">Seleccione una Dificultad</option>
          {exerciseDifficulty.map(cat => (
            <option key={cat.idExerciseDifficulty} value={cat.idExerciseDifficulty}>
              {cat.difficulty}
            </option>
          ))}
        </select>
        {errors.idExerciseDifficulty && <ErrorForm>{errors.idExerciseDifficulty.message}</ErrorForm>}
      </div>

      {/* Campo categoría (select) */}
      <div className="mb-5">
        <label htmlFor="idExerciseCategory" className="text-sm uppercase font-bold">
          Categoría
        </label>
        <select
          id="idExerciseCategory"
          className="w-full p-3 border border-gray-100"
          {...register("idExerciseCategory", { required: "La categoría es obligatoria" })}
        >
          <option value="">Seleccione una categoría</option>
          {exerciseCategories.map(cat => (
            <option key={cat.idExerciseCategory} value={cat.idExerciseCategory}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.idExerciseCategory && <ErrorForm>{errors.idExerciseCategory.message}</ErrorForm>}
      </div>

      {/* Botón de submit */}
      <input
        type="submit"
        className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
        value={activeEditingId ? "Actualizar" : "Registrar"}
      />
    </form>
  );
}

export default FormExercise;
