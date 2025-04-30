import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { RoutineDataForm, RoutineWithExercisesDTO } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useRoutineStore from "./Store";
import { useCommonDataStore } from "../shared/CommonDataStore";

type SelectedExercise = {
  idExercise: number;
  name: string;
  series: number;
  repetitions: number;
  category: string;
  categoryId: number;
};

function Form() {
  const navigate = useNavigate();
  const { difficultyRoutines, exercise, exerciseCategories, fetchExerciseCategories } = useCommonDataStore();
  const { register, handleSubmit, setValue, formState: { errors }, reset } = useForm<RoutineDataForm>();
  const { routines, activeEditingId, fetchRoutines, addRoutine, updateRoutine, closeModalForm } = useRoutineStore();

  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);

  useEffect(() => {
    fetchExerciseCategories();
  }, [fetchExerciseCategories]);

  useEffect(() => {
    if (exerciseCategories.length > 0) {
      const initialExercises = exerciseCategories.map(category => ({
        idExercise: 0,
        name: "",
        series: 0,
        repetitions: 0,
        category: category.name,
        categoryId: category.idExerciseCategory
      }));

      setSelectedExercises(initialExercises);
    }
  }, [exerciseCategories]);

  const submitForm = async (data: RoutineDataForm) => {
    const loggedUser = getAuthUser();

    const validExercises = selectedExercises.filter(ex => ex.idExercise > 0);

    if (validExercises.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe agregar al menos un ejercicio válido',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    // Format the data to match RoutineWithExercisesDTO
    const reqRoutine: RoutineWithExercisesDTO = {
      name: data.name,
      date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD
      idUser: loggedUser?.idUser || 0,
      difficultyRoutine: {
        idDifficultyRoutine: data.idDifficultyRoutine
      },
      exercises: validExercises.map(ex => ({
        idExercise: [ex.idExercise], // Wrapped in array as required
        series: ex.series,
        repetitions: ex.repetitions
      })),
      isDeleted: 0,
      paramLoggedIdUser: loggedUser?.idUser
    };

    let action = '', result;
    if (activeEditingId === 0) {
      result = await addRoutine(reqRoutine);
      action = 'agregado';
    } else {
      result = await updateRoutine({ 
        ...reqRoutine, 
        idRoutine: activeEditingId 
      });
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
            // Asegurarse que todos los campos requeridos están presentes
            setValue('idRoutine', routine.idRoutine);
            setValue('name', routine.name);
            setValue('idDifficultyRoutine', routine.difficultyRoutine?.idDifficultyRoutine || 0);
            setValue('isDeleted', Number(routine.isDeleted));
            
            // Verificar que el usuario existe antes de acceder a idUser
            if (routine.user) {
                setValue('idUser', routine.user.idUser);
            } else {
                const loggedUser = getAuthUser();
                setValue('idUser', loggedUser?.idUser || 0);
            }
            
            // Inicializar ejercicios si estamos editando
            if (routine.exercises && routine.exercises.length > 0) {
                const initialExercises = exerciseCategories.map(category => {
                    const categoryExercises = routine.exercises
                        .filter(ex => ex.exerciseCategory?.idExerciseCategory === category.idExerciseCategory)
                        .map(ex => ({
                            idExercise: ex.idExercise,
                            name: ex.name,
                            series: ex.series,
                            repetitions: ex.repetitions,
                            category: category.name,
                            categoryId: category.idExerciseCategory
                        }));

                    return categoryExercises.length > 0 ? categoryExercises[0] : {
                        idExercise: 0,
                        name: "",
                        series: 0,
                        repetitions: 0,
                        category: category.name,
                        categoryId: category.idExerciseCategory
                    };
                });

                setSelectedExercises(initialExercises);
            }
        }
    } else {
        // Resetear valores para nueva rutina
        reset({
            idRoutine: 0,
            name: '',
            idDifficultyRoutine: 0,
            idUser: getAuthUser()?.idUser || 0,
            isDeleted: 0
        });
        setSelectedExercises(exerciseCategories.map(category => ({
            idExercise: 0,
            name: "",
            series: 0,
            repetitions: 0,
            category: category.name,
            categoryId: category.idExerciseCategory
        })));
    }
}, [activeEditingId, routines, setValue, reset, exerciseCategories]);

  // Obtener ejercicios disponibles para una categoría
  const getAvailableExercises = (categoryId: number, currentExerciseId: number = 0) => {
    return exercise.filter(ex => 
      ex.exerciseCategory.idExerciseCategory === categoryId &&
      (currentExerciseId === ex.idExercise ||
      !selectedExercises.some(sel => sel.idExercise === ex.idExercise && sel.idExercise !== 0))
    );
  };

  const handleExerciseChange = (index: number, exerciseId: number) => {
    setSelectedExercises(prev => {
      const newExercises = [...prev];
      const categoryId = newExercises[index].categoryId;
      
      if (exerciseId > 0) {
        const selectedExercise = exercise.find(ex => 
          ex.idExercise === exerciseId && 
          ex.exerciseCategory.idExerciseCategory === categoryId
        );
        
        if (selectedExercise) {
          newExercises[index] = {
            ...newExercises[index],
            idExercise: selectedExercise.idExercise,
            name: selectedExercise.name,
            series: newExercises[index].series || 0,
            repetitions: newExercises[index].repetitions || 0
          };
        }
      } else {
        // Resetear si se selecciona la opción vacía
        newExercises[index] = {
          ...newExercises[index],
          idExercise: 0,
          name: "",
          series: 0,
          repetitions: 0
        };
      }
      
      return newExercises;
    });
  };

  const addNewExercise = (categoryId: number) => {
    const category = exerciseCategories.find(c => c.idExerciseCategory === categoryId);
    if (!category) return;

    // Verificar si hay ejercicios disponibles
    const availableExercises = getAvailableExercises(categoryId);
    if (availableExercises.length === 0) {
      Swal.fire({
        title: 'No hay ejercicios disponibles',
        text: 'Todos los ejercicios de esta categoría ya han sido seleccionados',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

    setSelectedExercises(prev => [
      ...prev,
      {
        idExercise: 0,
        name: "",
        series: 0,
        repetitions: 0,
        category: category.name,
        categoryId: category.idExerciseCategory
      }
    ]);
  };

  const updateExerciseField = (index: number, field: 'series' | 'repetitions', value: number) => {
    setSelectedExercises(prev => {
      const newExercises = [...prev];
      newExercises[index] = {
        ...newExercises[index],
        [field]: value
      };
      return newExercises;
    });
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(prev => prev.filter((_, i) => i !== index));
  };

  const getExercisesForCategory = (categoryId: number) => {
    return selectedExercises
      .map((ex, index) => ({ ...ex, index }))
      .filter(ex => ex.categoryId === categoryId);
  };

  return (
    <form
      className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
      noValidate
      onSubmit={handleSubmit(submitForm)}
    >
      <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
        {activeEditingId ? 'Actualizar Rutina' : 'Registrar Rutina'}
      </legend>

      {/* Hidden Fields */}
      <input id="idRoutine" type="hidden" {...register('idRoutine')} />
      <input id="idUser" type="hidden" {...register('idUser')} />
      <input id="isDeleted" type="hidden" {...register('isDeleted')} />

      {/* Dificultad */}
      <div className="my-5">
        <label htmlFor="idDifficultyRoutine" className="text-sm uppercase font-bold">
          Dificultad de Rutina
        </label>
        <select
          id="idDifficultyRoutine"
          className="w-full p-3 border border-gray-100"
          {...register('idDifficultyRoutine', { required: 'Debe seleccionar una dificultad' })}
        >
          <option value="">--Seleccione--</option>
          {difficultyRoutines.map(difficulty => (
            <option key={difficulty.idDifficultyRoutine} value={difficulty.idDifficultyRoutine}>
              {difficulty.name}
            </option>
          ))}
        </select>
        {errors.idDifficultyRoutine && (
          <ErrorForm>{errors.idDifficultyRoutine.message}</ErrorForm>
        )}
      </div>

      {/* Nombre de la Rutina */}
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
        {errors.name && (
          <ErrorForm>{errors.name.message}</ErrorForm>
        )}
      </div>

      {/* Ejercicios por categoría */}
      <div className="mb-5">
        <h2 className="text-lg font-bold mb-4 text-yellow">Ejercicios</h2>

        {exerciseCategories.map(category => {
          const categoryExercises = getExercisesForCategory(category.idExerciseCategory);
          
          return (
            <div key={category.idExerciseCategory} className="mb-8">
              {/* Nombre de la categoría */}
              <h3 className="text-md font-bold text-gray-700 mb-3">{category.name}</h3>

              {/* Ejercicios de la categoría */}
              {categoryExercises.map(({ index, ...ex }) => {
                const exercisesForSelect = getAvailableExercises(category.idExerciseCategory, ex.idExercise);
                
                return (
                  <div key={index} className="mb-4">
                    <div className="flex items-end gap-3">
                      {/* Select de ejercicio */}
                      <div className="flex-1">
                        <select
                          className="w-full p-2 border border-gray-300 rounded text-sm"
                          value={ex.idExercise}
                          onChange={(e) => handleExerciseChange(index, Number(e.target.value))}
                        >
                          <option value="0">Escoja un ejercicio</option>
                          {exercisesForSelect.map(opt => (
                            <option key={opt.idExercise} value={opt.idExercise} className="text-yellow-800">
                              {opt.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Campos de series y repeticiones */}
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-500 mb-1">Series</label>
                          <input
                            type="number"
                            min="0"
                            className="w-16 p-1 border border-gray-300 rounded text-center"
                            value={ex.series}
                            onChange={(e) => updateExerciseField(index, 'series', Number(e.target.value))}
                          />
                        </div>
                        
                        <div className="flex flex-col">
                          <label className="text-xs text-gray-500 mb-1">Repeticiones</label>
                          <input
                            type="number"
                            min="0"
                            className="w-16 p-1 border border-gray-300  rounded text-center"
                            value={ex.repetitions}
                            onChange={(e) => updateExerciseField(index, 'repetitions', Number(e.target.value))}
                          />
                        </div>

                        {/* Botón para eliminar */}
                        {categoryExercises.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 mb-1"
                            onClick={() => removeExercise(index)}
                          >
                            ✖
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}

              {/* Botón para agregar nuevo ejercicio */}
              {getAvailableExercises(category.idExerciseCategory).length > 0 && (
                <div className="flex justify-start mt-2">
                  <button
                    type="button"
                    className="text-gray-500 hover:text-yellow-600 text-sm flex items-center"
                    onClick={() => addNewExercise(category.idExerciseCategory)}
                  >
                    <span className="mr-1 text-lg">+</span> Agregar ejercicio
                  </button>
                </div>
              )}
            </div>
          );
        })}
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