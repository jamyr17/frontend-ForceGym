
import { createContext, useContext, useState, useCallback } from "react";

interface UserFormContextProps {
  step: number;
  nextStep: () => void;
  prevStep: () => void;
  resetForm: () => void;
  setCustomStep: (step : number) => void;
}

const UserFormContext = createContext<UserFormContextProps | undefined>(undefined);

export const UserFormProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [step, setStep] = useState(1);

  const nextStep = useCallback(() => setStep(prev => Math.min(prev + 1, 3)), []);
  const prevStep = useCallback(() => setStep(prev => Math.max(prev - 1, 1)), []);
  const setCustomStep = useCallback((newStep: number) => setStep(Math.max(1, Math.min(newStep, 3))), []);
  const resetForm = useCallback(() => setStep(1), []);

  return (
    <UserFormContext.Provider value={{ step, nextStep, prevStep, setCustomStep, resetForm }}>
      {children}
    </UserFormContext.Provider>
  );
};

export const useUserForm = () => {
  const context = useContext(UserFormContext);
  if (!context) {
    throw new Error('useUserForm must be used within a UserFormProvider');
  }
  return context;
};