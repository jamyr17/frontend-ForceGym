import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { useMemo } from "react";
import { useNavigate } from "react-router";
import { UserDataForm } from "../../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../../shared/utils/authentication";
import useCollaboratorStore from "../Profile/Store";
import { useCommonDataStore } from "../../shared/CommonDataStore";
import { useUserForm } from "../../User/Form/Context";

export const useCollaboratorForm = () => {
    const navigate = useNavigate();
    const { genders } = useCommonDataStore();
    const { userData, updateProfile, fetchUserData } = useCollaboratorStore();
    const { step, nextStep, prevStep, setCustomStep, resetForm } = useUserForm();

    const getDefaultValues = (): UserDataForm => ({
        idUser: 0,
        idRole: 2,
        idGender: 0,
        idPerson: 0,
        identificationNumber: '',
        name: '',
        firstLastName: '',
        secondLastName: '',
        phoneNumber: '',
        birthday: new Date(),
        email: '',
        username: '',
        password: '',
        isDeleted: 0,
        confirmPassword: ''
    });

    const getEditingValues = (): UserDataForm => {
        if (!userData) return getDefaultValues();
        
        return {
            ...userData,
            password: '',
            confirmPassword: ''
        };
    };

    const defaultValues = useMemo(getEditingValues, [userData]);
    const methods = useForm<UserDataForm>({ 
        defaultValues,
        mode: 'onChange',
        reValidateMode: 'onChange',
        shouldFocusError: true,
        shouldUnregister: false
    });

    const submitForm = async (data: UserDataForm) => {
        const reqUser: UserDataForm = {
            ...data,
            // Forzar el rol de colaborador
            idRole: userData?.idRole || 2, 
            password: data.password || "" 
        };

        delete (reqUser as any).confirmPassword;

        const result = await updateProfile(reqUser);
        
        if (result.ok) {
            await fetchUserData();
            await Swal.fire({
                title: 'Perfil actualizado',
                text: 'Tus datos se han actualizado correctamente',
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
            navigate('/login');
        }
    };

    type FormField = 
        | "idUser" | "username" | "isDeleted" | "idRole" | "idPerson" 
        | "name" | "firstLastName" | "secondLastName" | "birthday" 
        | "identificationNumber" | "email" | "phoneNumber" 
        | "confirmPassword" | "idGender" | "password";

    interface StepFields {
        step: number;
        fields: FormField[];
    }

    const inputsByStep: StepFields[] = [
        {step: 1, fields: ['identificationNumber', 'name', 'firstLastName', 'secondLastName', 'birthday', 'idGender']},
        {step: 2, fields: ['phoneNumber', 'email']},
        {step: 3, fields: ['username', 'password', 'confirmPassword']}
    ];

    const validateStepChange = async () => {
        try {
            const matchingItem = inputsByStep.find(item => item.step === step);
            if (!matchingItem) return false;
            
            if (methods.formState.isValid) return true;
            
            return await methods.trigger(matchingItem.fields);
        } catch (error) {
            console.error('Validation failed:', error);
            return false;
        }
    };

    const handleStepChangeByMenu = async (toStep: number) => {
        if (toStep > step) {
            if (await validateStepChange()) {
                setCustomStep(toStep);
            }
        } else {
            setCustomStep(toStep);
        }
    };

    const handleStepChangeByButton = async (stepChange: () => void) => {
        if (await validateStepChange()) {
            stepChange();
        }
    };

    return {
        methods,
        step,
        genders,
        submitForm,
        prevStep,
        nextStep,
        handleStepChangeByMenu,
        handleStepChangeByButton
    };
};