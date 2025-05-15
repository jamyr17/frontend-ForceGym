import { createContext, useContext, useState, useCallback } from "react";
interface ClientFormContextProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  setCustomStep: (step: number) => void;
}

const ClientFormContext = createContext<ClientFormContextProps | undefined>(undefined);

export const ClientFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, 5)), []);
  const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);
  const setCustomStep = useCallback((newStep: number) => setStep(Math.max(1, Math.min(newStep, 5))), []);
  const resetForm = useCallback(() => setStep(1), []);

  return (
    <ClientFormContext.Provider value={{ step, nextStep, prevStep, setCustomStep, resetForm }}>
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