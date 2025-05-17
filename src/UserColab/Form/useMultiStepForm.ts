import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useEffect } from "react";
import { UserDataForm } from "../../shared/types";
import { useCommonDataStore } from "../../shared/CommonDataStore";

interface UseMultiStepFormProps {
    initialData: UserDataForm;
    onSubmit: (data: UserDataForm) => Promise<void>;
    isUpdate: boolean;
}

export const useMultiStepForm = ({ initialData, onSubmit, isUpdate }: UseMultiStepFormProps) => {
  const { roles, genders } = useCommonDataStore();
  
  const methods = useForm<UserDataForm>({ 
    defaultValues: initialData,
    mode: 'onChange',
    reValidateMode: 'onChange',
    shouldFocusError: true,
    shouldUnregister: false
  });

  // Reset form when initialData changes
  useEffect(() => {
    methods.reset(initialData);
  }, [initialData]);

    const submitForm = async (data: UserDataForm) => {
    try {
        // Si es actualización y no hay cambios en la contraseña
        if (isUpdate && data.password === '') {
            data.password = undefined;
        }
        data.confirmPassword = undefined; // Siempre eliminamos esto

        await onSubmit(data);
    } catch (error) {
      console.error('Submission error:', error);
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al guardar los datos',
        icon: 'error',
        confirmButtonColor: '#CFAD04'
      });
    }
  };

  return {
    methods,
    roles,
    genders,
    submitForm
  };
};