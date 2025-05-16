import { FormProvider } from "react-hook-form";
import { PersonalInfoStep } from "./StepPersonalInfo";
import { ContactInfoStep } from "./StepContactInfo";
import { AccountInfoStep } from "./StepAccountInfo";
import { useMultiStepForm } from "./useMultiStepForm";

interface MultiStepFormProps {
    initialData: any;
    onSubmit: (data: any) => void;
    isUpdate: boolean;
}

const MultiStepForm = ({ initialData, onSubmit, isUpdate }: MultiStepFormProps) => {
  const {
    methods,
    roles,
    genders,
    submitForm
  } = useMultiStepForm({ initialData, onSubmit, isUpdate });

  return (
    <FormProvider {...methods}>
      <form 
        className="bg-white rounded-lg px-5 mb-10"
        noValidate
        onSubmit={methods.handleSubmit(submitForm)}
      >
        <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
          {isUpdate ? 'Mi Perfil' : 'Registrar usuario'}
        </legend>

        {/* Hidden inputs */}
        <input id="idUser" type="hidden" {...methods.register('idUser')} />
        <input id="idPerson" type="hidden" {...methods.register('idPerson')} />
        <input id="isDeleted" type="hidden" {...methods.register('isDeleted')} />

        {/* Mostrar todos los pasos juntos */}
        <div className="space-y-8 mt-6">
          <div className="border-b pb-4">
            <h2 className="text-xl font-bold mb-4 text-yellow">Información Personal</h2>
            <PersonalInfoStep genders={genders} />
          </div>

          <div className="border-b pb-4">
            <h2 className="text-xl font-bold mb-4 text-yellow">Información de Contacto</h2>
            <ContactInfoStep />
          </div>

          <div className="pb-4">
            <h2 className="text-xl font-bold mb-4 text-yellow">Información de Cuenta</h2>
            <AccountInfoStep roles={roles} isUpdate={isUpdate} />
          </div>
        </div>

        {/* Botón de submit */}
        <div className="flex justify-end mt-5">
          <input
            type="submit"
            className="bg-yellow py-2 px-6 rounded-md text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
            value={isUpdate ? 'Actualizar perfil' : 'Registrar'}
          />
        </div>
      </form>
    </FormProvider>
  );
};

export default MultiStepForm;