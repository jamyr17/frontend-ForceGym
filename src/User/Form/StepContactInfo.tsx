import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";

const MAXLENGTH_PHONENUMBER = 15;
const MAXLENGTH_EMAIL = 100;

export const ContactInfoStep = () => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="phoneNumber" className="text-sm uppercase font-bold">
          Teléfono
        </label>
        <input  
          id="phoneNumber"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese el número de teléfono" 
          {...register("phoneNumber", {
            required: 'El número de teléfono es obligatorio',
            maxLength: {
              value: MAXLENGTH_PHONENUMBER,
              message: `Debe ingresar número de teléfono de máximo ${MAXLENGTH_PHONENUMBER} carácteres`
            }
          })}
        />
        {errors.phoneNumber && <ErrorForm>{errors.phoneNumber.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="email" className="text-sm uppercase font-bold">
          Email 
        </label>
        <input  
          id="email"
          className="w-full p-3 border border-gray-100"  
          type="email" 
          placeholder="Ingrese el email" 
          {...register("email", {
            required: "El email es obligatorio",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Email no válido'
            },
            maxLength: {
              value: MAXLENGTH_EMAIL,
              message: `Debe ingresar email de máximo ${MAXLENGTH_EMAIL} carácteres`
            }
          })} 
        />
        {errors.email && <ErrorForm>{errors.email.message?.toString()}</ErrorForm>}
      </div>
    </div>
  );
};