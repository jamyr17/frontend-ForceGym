import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import PasswordInput from "../../shared/components/PasswordInput";
import { Role } from "../../shared/types";
import { getAuthUser } from "../../shared/utils/authentication";

const MAXLENGTH_USERNAME = 50;

export const AccountInfoStep = ({ activeEditingId, roles }: { activeEditingId: number, roles: Role[] }) => {
  const { register, formState: { errors }, watch } = useFormContext();
  const loggedUser = getAuthUser();
  const isSelfEditing = loggedUser?.idUser === activeEditingId;

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
          defaultValue=""
          {...register("idRole", {
            required: 'El rol es obligatorio',
            validate: value => value !== 0 || 'Debe seleccionar un rol'
          })}  
        >
          <option value={0}>Seleccione un rol</option>
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
        
        {activeEditingId !== 0 && !isSelfEditing && (
          <p className="text-sm text-gray-500 mb-1 italic">
            Nota: Solo puedes modificar tu propio nombre de usuario cuando editas tu perfil.
          </p>
        )}
        
        <input  
          id="username"
          className={`w-full p-3 border ${activeEditingId !== 0 && !isSelfEditing ? 'bg-gray-100 cursor-not-allowed' : 'border-gray-100'}`}  
          type="text" 
          placeholder={activeEditingId !== 0 && !isSelfEditing ? "No editable" : "Ingrese el nombre de usuario"} 
          {...register('username', {
            required: 'El nombre de usuario es obligatorio',
            maxLength: {
              value: MAXLENGTH_USERNAME,
              message: `Debe ingresar un nombre de usuario de máximo ${MAXLENGTH_USERNAME} carácteres`
            },
            disabled: activeEditingId !== 0 && !isSelfEditing
          })}
          disabled={activeEditingId !== 0 && !isSelfEditing}
        />
        
        {errors.username && <ErrorForm>{errors.username.message?.toString()}</ErrorForm>}
      </div>

      {(activeEditingId === 0 || isSelfEditing) && (
  <>
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
          validate: (value) => {
            const password = watch('password');
            if ((activeEditingId === 0 || password) && value !== password) {
              return 'Las contraseñas no coinciden';
            }
            return true;
          }
        })}
      />
      {errors.confirmPassword && <ErrorForm>{errors.confirmPassword.message?.toString()}</ErrorForm>}
    </div>
  </>
)}

    </div>
  );
};