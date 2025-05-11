import { FormProvider } from "react-hook-form";
import { PersonalInfoStep } from "../../User/Form/StepPersonalInfo";
import { ContactInfoStep } from "../../User/Form/StepContactInfo";
import { AccountInfoStep } from "./StepAccountInfo";
import { UserFormProvider } from "../../User/Form/Context";
import { useCollaboratorForm } from "./useCollaboratorForm";

const CollaboratorForm = () => {
    const {
        methods,
        step,
        genders,
        submitForm,
        prevStep,
        nextStep,
        handleStepChangeByMenu,
        handleStepChangeByButton
    } = useCollaboratorForm();

    const renderStep = () => {
        switch (step) {
            case 1:
                return <PersonalInfoStep genders={genders} />;
            case 2:
                return <ContactInfoStep />;
            case 3:
                return <AccountInfoStep />;
            default:
                return null;
        }
    };

    const formMenu = () => {
        return (
            <ul className="flex text-center justify-around mt-6 mb-8 gap-4 text-xl font-medium">
                <button 
                    type="button"   
                    className={`opacity-45 p-1 ${step === 1 && 'opacity-100 font-bold disabled'} disabled:opacity-65 hover:border-b-2 cursor-pointer`}
                    onClick={() => handleStepChangeByMenu(1)}
                >
                    Información Personal
                </button>

                <button 
                    type="button"
                    className={`opacity-45 p-1 ${step === 2 && 'opacity-100 font-bold disabled'} disabled:opacity-65 hover:border-b-2 cursor-pointer`}
                    onClick={() => handleStepChangeByMenu(2)}
                >
                    Información de Contacto
                </button>

                <button 
                    type="button"
                    className={`opacity-45 p-1 ${step === 3 && 'opacity-100 font-bold disabled'} disabled:opacity-65 hover:border-b-2 cursor-pointer`}
                    onClick={() => handleStepChangeByMenu(3)}
                >
                    Cuenta
                </button>
            </ul>
        );
    };

    return (
        <FormProvider {...methods}>
            <form 
                className="bg-white rounded-lg px-5 py-4"
                noValidate
                onSubmit={methods.handleSubmit(submitForm)}
            >
                <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                    Actualizar mi perfil
                </legend>

                {/* Hidden inputs */}
                <input id="idUser" type="hidden" {...methods.register('idUser')} />
                <input id="idPerson" type="hidden" {...methods.register('idPerson')} />
                <input id="isDeleted" type="hidden" {...methods.register('isDeleted')} />
                <input id="idRole" type="hidden" {...methods.register('idRole')} />

                {/* Menu de Steps */}
                {formMenu()}

                {/* Current step */}
                {renderStep()}

                {/* Navigation buttons */}
                <div className="flex justify-between mt-5">
                    {step > 1 && (
                        <button
                            type="button"
                            onClick={prevStep}
                            className="border-2 border-gray-600 text-gray-600 py-2 px-3 uppercase font-bold rounded-md hover:opacity-50 cursor-pointer transition-colors"
                        >
                            Anterior
                        </button>
                    )}

                    {step < 3 ? (
                        <button
                            type="button"
                            onClick={() => handleStepChangeByButton(nextStep)}
                            className="bg-yellow text-white py-2 px-3 uppercase font-bold rounded-md hover:bg-amber-600 cursor-pointer transition-colors ml-auto"
                        >
                            Siguiente
                        </button>
                    ) : (
                        <input
                            type="submit"
                            className="bg-yellow py-2 px-3 rounded-md text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                            value="Actualizar"
                        />
                    )}
                </div>
            </form>
        </FormProvider>
    );
};

export default function Form() {
    return (
        <UserFormProvider>
            <CollaboratorForm />
        </UserFormProvider>
    );
}