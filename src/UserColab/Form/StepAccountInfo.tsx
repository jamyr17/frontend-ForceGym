import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import PasswordInput from "../../shared/components/PasswordInput";
import { Role } from "../../shared/types";
import { getAuthUser } from "../../shared/utils/authentication";
import { useEffect } from "react";

const MAXLENGTH_USERNAME = 50;

export const AccountInfoStep = ({ roles, isUpdate }: { roles: Role[], isUpdate: boolean }) => {
  const { register, formState: { errors }, watch, setValue } = useFormContext();
  const loggedUser = getAuthUser();

  // Establecer el valor por defecto del rol como 2
  useEffect(() => {
    setValue("idRole", 2);
  }, [setValue]);

  const validatePassword = (password: string): true | string => {
    if (!password && isUpdate) {
      return true; 
    }
    
    const num = /\d/;
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const charLength = /^.{8,20}$/;

    if (!charLength.test(password)) {
      return "La contraseña debe tener entre 8 y 20 caracteres.";
    }
    if (!lowercase.test(password)) {
      return "La contraseña debe contener al menos una letra minúscula.";
    }
    if (!uppercase.test(password)) {
      return "La contraseña debe contener al menos una letra mayúscula.";
    }
    if (!num.test(password)) {
      return "La contraseña debe contener al menos un número.";
    }
    if (!specialChar.test(password)) {
      return "La contraseña debe contener al menos un carácter especial.";
    }

    return true;
  };

  return (
    <div className="space-y-5">
      {/* Input oculto para el idRole con valor fijo 2 */}
      <input type="hidden" {...register("idRole")} value={2} />

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
          {isUpdate ? 'Nueva Contraseña (dejar vacío para no cambiar)' : 'Contraseña'}
        </label>
        <PasswordInput     
          id="password"
          className="w-full p-3 border border-gray-100"  
          type="password" 
          placeholder={isUpdate ? 'Dejar vacío para no cambiar' : 'Ingrese la contraseña'} 
          {...register('password', {
            required: !isUpdate ? 'La contraseña es obligatoria' : false,
            validate: validatePassword
          })}
        />
        {errors.password && <ErrorForm>{errors.password.message?.toString()}</ErrorForm>}
        {isUpdate && (
          <p className="text-sm text-gray-500 mt-1">
            Solo complete si desea cambiar la contraseña
          </p>
        )}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-sm uppercase font-bold">
          Confirmar {isUpdate ? 'Nueva ' : ''}Contraseña
        </label>
        <PasswordInput     
          id="confirmPassword"
          className="w-full p-3 border border-gray-100"  
          type="password" 
          placeholder={isUpdate ? 'Confirmar nueva contraseña' : 'Confirme la contraseña'} 
          {...register('confirmPassword', {
            validate: value => {
              const password = watch('password');
              if (password && value !== password) {
                return 'Las contraseñas no coinciden';
              }
              return true;
            }
          })}
        />
        {errors.confirmPassword && <ErrorForm>{errors.confirmPassword.message?.toString()}</ErrorForm>}
      </div>
    </div>
  );
};