import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import Select from 'react-select';
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
  note: string;
  category: string;
  categoryId: number;
};

type ClientOption = {
  value: number;
  label: string;
};

function Form() {
  const navigate = useNavigate();
  const { 
    difficultyRoutines, 
    exercise, 
    exerciseCategories, 
    fetchExerciseCategories, 
    allClients,
    fetchAllClients 
  } = useCommonDataStore();
  
  const { 
    register, 
    handleSubmit, 
    setValue, 
    formState: { errors }, 
    reset,
  } = useForm<RoutineDataForm>();
  
  const { 
    activeEditingId,
    routineToEdit,
    fetchRoutines, 
    addRoutine, 
    updateRoutine, 
    closeModalForm 
  } = useRoutineStore();

  const [selectedExercises, setSelectedExercises] = useState<SelectedExercise[]>([]);
  const [selectedClients, setSelectedClients] = useState<ClientOption[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos iniciales
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        await Promise.all([
          fetchExerciseCategories(),
          fetchAllClients(),
          fetchRoutines()
        ]);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, [fetchExerciseCategories, fetchAllClients, fetchRoutines]);

  // Precargar ejercicios cuando se cargan las categorías
  useEffect(() => {
    if (exerciseCategories.length > 0) {
      const initialExercises = exerciseCategories.map(category => ({
        idExercise: 0,
        name: "",
        series: 0,
        repetitions: 0,
        note: "",
        category: category.name,
        categoryId: category.idExerciseCategory
      }));
      setSelectedExercises(initialExercises);
    }
  }, [exerciseCategories]);

  // Precargar datos para edición basado en routineToEdit
  useEffect(() => {
    if (activeEditingId && !loading && routineToEdit) {
      console.log('Precargando datos para edición:', routineToEdit);
      
      // Cargar datos básicos
      setValue('idRoutine', routineToEdit.idRoutine);
      setValue('name', routineToEdit.name);
      setValue('idDifficultyRoutine', routineToEdit.difficultyRoutine?.idDifficultyRoutine || 0);
      
      // Cargar clientes seleccionados
      if (routineToEdit.assignments?.length > 0) {
        const clientOptions = routineToEdit.assignments.map(assignment => ({
          value: assignment.idClient,
          label: assignment.idClient.toString() // Antes era: `${assignment.client?.person?.name || ''} ${assignment.client?.person?.firstLastName || ''}`.trim(), pero el objeto no contiene el atributo client CORREGIR
        }));
        setSelectedClients(clientOptions);
      }
      
      // Cargar ejercicios - versión simplificada basada en la estructura vista
      if (routineToEdit.exercises?.length > 0 && exercise.length > 0) {
        const loadedExercises = routineToEdit.exercises.map(ex => {
          const exerciseData = exercise.find(e => e.idExercise === ex.idExercise);
          const category = exerciseData?.exerciseCategory;
          
          return {
            idExercise: ex.idExercise,
            name: exerciseData?.name || `Ejercicio ${ex.idExercise}`,
            series: ex.series || 0,
            repetitions: ex.repetitions || 0,
            note: ex.note || "Sin nota",
            category: category?.name || "Sin categoría",
            categoryId: category?.idExerciseCategory || 0
          };
        });
        
        // Agregamos también las categorías vacías que no están en los ejercicios
        const categoriesWithExercises = loadedExercises.map(ex => ex.categoryId);
        const emptyCategories = exerciseCategories
          .filter(cat => !categoriesWithExercises.includes(cat.idExerciseCategory))
          .map(cat => ({
            idExercise: 0,
            name: "",
            series: 0,
            repetitions: 0,
            note: "",
            category: cat.name,
            categoryId: cat.idExerciseCategory
          }));
        
        setSelectedExercises([...loadedExercises, ...emptyCategories]);
      }
    } else if (!activeEditingId && !loading) {
      resetForm();
    }
  }, [activeEditingId, loading, routineToEdit, setValue, exercise]);

  const submitForm = async (data: RoutineDataForm) => {
    const loggedUser = getAuthUser();

    // Validaciones
    if (selectedClients.length === 0) {
      Swal.fire({
        title: 'Error',
        text: 'Debe seleccionar al menos un cliente',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }

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
      
    const invalidExercises = validExercises.filter(ex => 
      ex.series <= 0 || ex.repetitions <= 0
    );
    
    if (invalidExercises.length > 0) {
      const htmlList = invalidExercises.map(ex => {
        const errors = [];
        if (ex.series <= 0) errors.push('Series');
        if (ex.repetitions <= 0) errors.push('Repeticiones');
        return `<strong>${ex.name}</strong>: ${errors.join(' y ')}`;
      }).join('<br>');
    
      await Swal.fire({
        title: 'Error en ejercicios',
        html: `Los siguientes ejercicios tienen valores inválidos:<br><br>${htmlList}`,
        icon: 'error',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#CFAD04'
      });
    
      setSelectedExercises(prev => prev.map(ex => ({
        ...ex,
        hasError: invalidExercises.some(ie => ie.idExercise === ex.idExercise)
      })));
    
      return;
    }
    
    const hasInvalidValues = selectedExercises.some(ex => 
      ex.idExercise > 0 && (ex.series <= 0 || ex.repetitions <= 0)
    );
    // Preparar datos para enviar
    const reqRoutine: RoutineWithExercisesDTO = {
      name: data.name,
      date: new Date().toISOString(),
      idUser: loggedUser?.idUser || 0,
      difficultyRoutine: {
        idDifficultyRoutine: data.idDifficultyRoutine
      },
      exercises: selectedExercises
      .filter(ex => ex.idExercise > 0)
      .map(ex => ({
        idExercise: ex.idExercise,
        series: ex.series,
        repetitions: ex.repetitions,
        note: ex.note
      })),
      assignments: selectedClients.map(client => ({
        idClient: client.value,
        assignmentDate: new Date().toISOString()
      })),
      isDeleted: 0,
      paramLoggedIdUser: loggedUser?.idUser
    };

    try {
      let result;
      let action = '';
      
      const isEditing = activeEditingId !== null && activeEditingId !== 0;

      if (isEditing) {
        console.log('Actualizando rutina con ID:', activeEditingId);
        result = await updateRoutine({ 
          ...reqRoutine,
          idRoutine: activeEditingId
        });
        action = 'actualizada';
      } else {
        console.log('Creando nueva rutina');
        result = await addRoutine(reqRoutine);
        action = 'creada';
      }

      if (result?.ok) {
        await fetchRoutines();
        Swal.fire({
          title: `Rutina ${action}`,
          text: `La rutina ha sido ${action} correctamente`,
          icon: 'success',
          confirmButtonText: 'OK',
          timer: 3000,
          confirmButtonColor: '#CFAD04'
        });
        closeModalForm();
        resetForm();
      } else if (result?.logout) {
        handleLogout();
      }
    } catch (error) {
      console.error("Error al guardar la rutina:", error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al guardar la rutina',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
    }
  };

  const resetForm = () => {
    reset({
      idRoutine: 0,
      name: '',
      idDifficultyRoutine: 0,
      idUser: getAuthUser()?.idUser || 0,
      isDeleted: 0
    });
    setSelectedClients([]);
    
    if (exerciseCategories.length > 0) {
      setSelectedExercises(
        exerciseCategories.map(category => ({
          idExercise: 0,
          name: "",
          series: 0,
          repetitions: 0,
          note: "",
          category: category.name,
          categoryId: category.idExerciseCategory
        }))
      );
    }
  };

  const handleLogout = () => {
    setAuthHeader(null);
    setAuthUser(null);
    navigate('/login', { replace: true });
  };

  const getAvailableExercises = (categoryId: number, currentExerciseId: number = 0) => {
    return exercise.filter(ex => 
      ex.exerciseCategory?.idExerciseCategory === categoryId &&
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
          ex.exerciseCategory?.idExerciseCategory === categoryId
        );
        
        if (selectedExercise) {
          newExercises[index] = {
            ...newExercises[index],
            idExercise: selectedExercise.idExercise,
            name: selectedExercise.name,
            series: newExercises[index].series || 0,
            repetitions: newExercises[index].repetitions || 0,
            note: newExercises[index].note,
          };
        }
      } else {
        newExercises[index] = {
          ...newExercises[index],
          idExercise: 0,
          name: "",
          series: 0,
          repetitions: 0,
          note: "",
        };
      }
      
      return newExercises;
    });
  };

  const addNewExercise = (categoryId: number) => {
    const category = exerciseCategories.find(c => c.idExerciseCategory === categoryId);
    if (!category) return;

    // Obtener ejercicios disponibles para esta categoría
    const availableExercises = getAvailableExercises(categoryId);
    
    // Obtener ejercicios actualmente seleccionados para esta categoría
    const currentExercisesInCategory = selectedExercises.filter(
      ex => ex.categoryId === categoryId && ex.idExercise === 0
    );
    
    // Verificar si hay ejercicios disponibles y si no hemos alcanzado el límite
    if (availableExercises.length <= currentExercisesInCategory.length) {
      Swal.fire({
        title: 'Límite alcanzado',
        text: 'No puedes agregar más ejercicios de esta categoría que los disponibles',
        icon: 'info',
        confirmButtonText: 'OK',
        confirmButtonColor: '#CFAD04'
      });
      return;
    }
      
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
        note: "",
        category: category.name,
        categoryId: category.idExerciseCategory
      }
    ]);
  };

  const updateExerciseField = (index: number, field: 'series' | 'repetitions' | 'note', value: number | string) => {
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
        {activeEditingId ? 'Actualizar Rutina' : 'Crear Rutina'}
      </legend>

      <input id="idRoutine" type="hidden" {...register('idRoutine')} />
      <input id="idUser" type="hidden" {...register('idUser')} />
      <input id="isDeleted" type="hidden" {...register('isDeleted')} />

      <div className="my-5">
        <label htmlFor="clients" className="text-sm uppercase font-bold">
          Clientes
        </label>
        <Select
          id="clients"
          className="w-full"
          options={allClients}
          value={selectedClients}
          onChange={(selectedOptions) => setSelectedClients(selectedOptions as ClientOption[])}
          isMulti
          placeholder="Seleccione los clientes..."
          noOptionsMessage={() => "No hay clientes disponibles"}
          isDisabled={loading}
        />
        {selectedClients.length === 0 && (
          <ErrorForm>Debe seleccionar al menos un cliente</ErrorForm>
        )}
      </div>

      <div className="my-5">
        <label htmlFor="idDifficultyRoutine" className="text-sm uppercase font-bold">
          Dificultad
        </label>
        <select
          id="idDifficultyRoutine"
          className="w-full p-3 border border-gray-100"
          {...register('idDifficultyRoutine', { required: 'Debe seleccionar una dificultad' })}
          disabled={loading}
        >
          <option value="">--Seleccione--</option>
          {difficultyRoutines.map(difficulty => (
            <option 
              key={difficulty.idDifficultyRoutine} 
              value={difficulty.idDifficultyRoutine}
              selected={routineToEdit?.difficultyRoutine?.idDifficultyRoutine === difficulty.idDifficultyRoutine}
            >
              {difficulty.name}
            </option>
          ))}
        </select>
        {errors.idDifficultyRoutine && (
          <ErrorForm>{errors.idDifficultyRoutine.message}</ErrorForm>
        )}
      </div>

      <div className="mb-5">
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Nombre
        </label>
        <input
          id="name"
          className="w-full p-3 border border-gray-100"
          type="text"
          placeholder="Nombre de la rutina"
          {...register('name', { 
            required: 'El nombre es obligatorio',
            value: routineToEdit?.name || ''
          })}
          disabled={loading}
        />
        {errors.name && <ErrorForm>{errors.name.message}</ErrorForm>}
      </div>

      <div className="mb-5">
        <h2 className="text-lg font-bold mb-4 text-yellow">Ejercicios</h2>
        {exerciseCategories.map(category => {
          const categoryExercises = getExercisesForCategory(category.idExerciseCategory);
          
          return (
            <div key={category.idExerciseCategory} className="mb-8">
              <h3 className="text-md font-bold text-gray-700 mb-3">{category.name}</h3>

              {categoryExercises.map(({ index, ...ex }) => {
                const exercisesForSelect = getAvailableExercises(category.idExerciseCategory, ex.idExercise);
                
                return (
                  <div key={index} className="mb-4">
                   <div className="flex items-end gap-4">
                    {/* Selector de ejercicio */}
                    <div className="flex-1 min-w-[450px]"> 
                      <select
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                        value={ex.idExercise}
                        onChange={(e) => handleExerciseChange(index, Number(e.target.value))}
                        disabled={loading}
                      >
                        <option value="0">Escoja un ejercicio</option>
                        {exercisesForSelect.map(opt => (
                          <option 
                            key={opt.idExercise} 
                            value={opt.idExercise} 
                            className="text-yellow-800"
                          >
                            {opt.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Contenedor de series y repeticiones (más estrecho) */}
                    <div className="flex items-end gap-3">
                      {/* Input Series */}
                      <div className="flex flex-col w-[70px]">  {/* Ancho fijo */}
                        <label className="text-xs text-gray-500 mb-1">Series</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded text-center h-[38px]"  /* Misma altura */
                            value={ex.series || "0"}
                            onChange={(e) => updateExerciseField(index, 'series', Math.max(1, Number(e.target.value)))}
                            disabled={loading}
                          />
                          {ex.idExercise > 0 && ex.series <= 0 && (
                            <span className="absolute -bottom-5 left-0 right-0 text-xs text-red-500 text-center whitespace-nowrap">
                              Mínimo 1
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Input Repeticiones */}
                      <div className="flex flex-col w-[70px]">  {/* Ancho fijo */}
                        <label className="text-xs text-gray-500 mb-1">Repeticiones</label>
                        <div className="relative">
                          <input
                            type="number"
                            min="1"
                            className="w-full p-2 border border-gray-300 rounded text-center h-[38px]"  /* Misma altura */
                            value={ex.repetitions || "0"}
                            onChange={(e) => updateExerciseField(index, 'repetitions', Math.max(1, Number(e.target.value)))}
                            disabled={loading}
                          />
                          {ex.idExercise > 0 && ex.repetitions <= 0 && (
                            <span className="absolute -bottom-5 left-0 right-0 text-xs text-red-500 text-center whitespace-nowrap">
                              Mínimo 1
                            </span>
                          )}
                        </div>

                        <div className="flex flex-col">
                          <label className="text-xs text-gray-500 mb-1">Notas</label>
                          <input
                            type="text"
                            className="w-24 p-1 border border-gray-300 rounded text-center"
                            value={ex.note}
                            onChange={(e) => updateExerciseField(index, 'note', e.target.value)}
                            disabled={loading}
                          />
                        </div>

                        {categoryExercises.length > 1 && (
                          <button
                            type="button"
                            className="text-red-500 hover:text-red-700 mb-1"
                            onClick={() => removeExercise(index)}
                            disabled={loading}
                          >
                            ✖
                          </button>
                        )}

                      </div>
                    </div>
                  </div>
                );
              })}
                {getAvailableExercises(category.idExerciseCategory).length > 0 && 
                  getAvailableExercises(category.idExerciseCategory).length > 
                    selectedExercises.filter(ex => ex.categoryId === category.idExerciseCategory && ex.idExercise === 0).length && (
                  <div className="flex justify-start mt-2">
                    <button
                      type="button"
                      className="text-gray-500 hover:text-yellow-600 text-sm flex items-center"
                      onClick={() => addNewExercise(category.idExerciseCategory)}
                      disabled={loading}
                    >
                      <span className="mr-1 text-lg">+</span> Agregar ejercicio
                    </button>
                  </div>
              )}
            </div>
          );
        })}
      </div>

      <input
        type="submit"
        className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors disabled:opacity-50"
        value={activeEditingId ? 'Actualizar' : 'Crear'}
        disabled={
          loading || 
          selectedClients.length === 0 || 
          selectedExercises.filter(ex => ex.idExercise > 0).length === 0
        }
      />
    </form>
  );
}

export default Form;