import { createContext, useContext, useState, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

interface ClientFormContextProps {
  step: number;
  nextStep: () => Promise<void>;
  prevStep: () => void;
  resetForm: () => void;
  setCustomStep: (step: number) => Promise<void>;
  formMethods?: UseFormReturn<any>;
}

const ClientFormContext = createContext<ClientFormContextProps | undefined>(undefined);

export const ClientFormProvider: React.FC<{ 
  children: React.ReactNode;
  formMethods?: UseFormReturn<any>;
}> = ({ children, formMethods }) => {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(async () => {
    if (formMethods) {
      const isValid = await formMethods.trigger();
      if (isValid) {
        setStep(prev => Math.min(prev + 1, 5));
      }
    } else {
      setStep(prev => Math.min(prev + 1, 5));
    }
  }, [formMethods]);

  const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);
  
  const setCustomStep = useCallback(async (newStep: number) => {
    if (newStep > step && formMethods) {
      const isValid = await formMethods.trigger();
      if (isValid) {
        setStep(Math.max(1, Math.min(newStep, 5)));
      }
    } else {
      setStep(Math.max(1, Math.min(newStep, 5)));
    }
  }, [step, formMethods]);

  const resetForm = useCallback(() => {
    setStep(1);
    formMethods?.reset();
  }, [formMethods]);

  return (
    <ClientFormContext.Provider value={{ 
      step, 
      nextStep, 
      prevStep, 
      setCustomStep, 
      resetForm,
      formMethods
    }}>
      {children}
    </ClientFormContext.Provider>
  );
};

export const useClientForm = () => {
  const context = useContext(ClientFormContext);
  if (!context) {
    throw new Error('useClientForm must be used within a ClientFormProvider');
  }
  return context;
};