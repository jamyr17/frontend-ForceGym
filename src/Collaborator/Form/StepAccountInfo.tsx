import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import PasswordInput from "../../shared/components/PasswordInput";

const MAXLENGTH_USERNAME = 50;

export const AccountInfoStep = () => {
    const { register, formState: { errors }, watch } = useFormContext();
    
    const validatePassword = (password: string): true | string => {
        if (!password) return true; // Opcional al actualizar
        
        const num = /\d/;
        const lowercase = /[a-z]/;
        const uppercase = /[A-Z]/;
        const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
        const charLength = /^.{8,20}$/;

        if (!charLength.test(password)) {
            return "La contraseña debe tener entre 8 y 20 caracteres.";
        }
        if (!lowercase.test(password)) {
            return "Debe contener al menos una letra minúscula.";
        }
        if (!uppercase.test(password)) {
            return "Debe contener al menos una letra mayúscula.";
        }
        if (!num.test(password)) {
            return "Debe contener al menos un número.";
        }
        if (!specialChar.test(password)) {
            return "Debe contener al menos un carácter especial.";
        }

        return true;
    };

    return (
        <div className="space-y-5">
            <div>
                <label htmlFor="username" className="text-sm uppercase font-bold">
                    Nombre de usuario 
                </label>
                <input  
                    id="username"
                    className="w-full p-3 border border-gray-100"  
                    type="text" 
                    placeholder="Ingrese el nombre de usuario" 
                    {...register('username', {
                        required: 'El nombre de usuario es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_USERNAME,
                            message: `Máximo ${MAXLENGTH_USERNAME} caracteres`
                        }
                    })}
                />
                {errors.username && <ErrorForm>{errors.username.message?.toString()}</ErrorForm>}
            </div>

            <div>
                <label htmlFor="password" className="text-sm uppercase font-bold">
                    Nueva contraseña (opcional)
                </label>
                <PasswordInput     
                    id="password"
                    className="w-full p-3 border border-gray-100"  
                    type="password" 
                    placeholder="Dejar vacío para no cambiar" 
                    {...register('password', {
                        validate: validatePassword
                    })}
                />
                {errors.password && <ErrorForm>{errors.password.message?.toString()}</ErrorForm>}
                <p className="text-xs text-gray-500 mt-1">
                    La contraseña debe tener 8-20 caracteres, incluyendo mayúsculas, minúsculas, números y caracteres especiales.
                </p>
            </div>

            <div>
                <label htmlFor="confirmPassword" className="text-sm uppercase font-bold">
                    Confirmar contraseña
                </label>
                <PasswordInput     
                    id="confirmPassword"
                    className="w-full p-3 border border-gray-100"  
                    type="password" 
                    placeholder="Confirme la contraseña" 
                    {...register('confirmPassword', {
                        validate: value => {
                            const password = watch('password');
                            return !password || value === password || 'Las contraseñas no coinciden';
                        }
                    })}
                />
                {errors.confirmPassword && <ErrorForm>{errors.confirmPassword.message?.toString()}</ErrorForm>}
            </div>
        </div>
    );
};