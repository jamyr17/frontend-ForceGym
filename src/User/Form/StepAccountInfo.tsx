import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import PasswordInput from "../../shared/components/PasswordInput";
import { Role } from "../../shared/types";

const MAXLENGTH_USERNAME = 50;

export const AccountInfoStep = ({ activeEditingId, roles }: { activeEditingId: number, roles: Role[] }) => {
  const { register, formState: { errors }, watch } = useFormContext();
  
  const validatePassword = (password: string): true | string => {
    if (activeEditingId !== 0 && !password) {
      return true;
    }
    
    const num = /\d/;
    const lowercase = /[a-z]/;
    const uppercase = /[A-Z]/;
    const specialChar = /[!@#$%^&*(),.?":{}|<>]/;
    const charLength = /^.{8,20}$/;

    if (!charLength.test(password)) {
      return "La contraseña debe tener al menos 8 y 20 caracteres.";
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

  console.log("Editing ID ", activeEditingId)

  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="idRole" className="text-sm uppercase font-bold">
          Rol 
        </label>
        <select
          id="idRole"
          className="w-full p-3 border border-gray-100" 
          {...register("idRole", {
            required: 'El rol es obligatorio',
            validate: value => value !== '0' || 'Debe seleccionar un rol'
          })}  
        >
          {roles.map((role) => (
            <option key={role.idRole} value={role.idRole}>
              {role.name}
            </option>
          ))}
        </select>
        {errors.idRole && <ErrorForm>{errors.idRole.message?.toString()}</ErrorForm>}
      </div>

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
              message: `Debe ingresar un nombre de usuario de máximo ${MAXLENGTH_USERNAME} carácteres`
            }
          })}
        />
        {errors.username && <ErrorForm>{errors.username.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="password" className="text-sm uppercase font-bold">
          Contraseña
        </label>
        <PasswordInput     
          id="password"
          className="w-full p-3 border border-gray-100"  
          type="password" 
          placeholder="Ingrese la contraseña" 
          {...register('password', {
            required: activeEditingId === 0 ? 'La contraseña es obligatoria' : false,
            validate: validatePassword
          })}
        />
        {errors.password && <ErrorForm>{errors.password.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="confirmPassword" className="text-sm uppercase font-bold">
          Confirmar Contraseña
        </label>
        <PasswordInput     
          id="confirmPassword"
          className="w-full p-3 border border-gray-100"  
          type="password" 
          placeholder="Confirme la contraseña" 
          {...register('confirmPassword', {
            validate: value => {
              if (activeEditingId === 0 && value !== watch('password')) {
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