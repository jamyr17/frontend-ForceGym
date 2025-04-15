import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import { formatDate } from "../../shared/utils/format";

const MAXLENGTH_PHONENUMBER = 15;
const MAXLENGTH_EMAIL = 100;
const MAXDATE_BIRTHDAY = new Date().toUTCString();
const MAXLENGTH_NAME = 50;

export const StepContactInfo = () => {
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

      <div>
        <label htmlFor="nameEmergencyContact" className="text-sm uppercase font-bold">
          Nombre del contacto de emergencia
        </label>
        <input  
          id="nameEmergencyContact"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese el nombre del contacto de emergencia" 
          {...register("nameEmergencyContact", {
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Debe ingresar un nombre de contacto de emergencia de máximo ${MAXLENGTH_NAME} carácteres`
            }
          })}
        />
        {errors.nameEmergencyContact && <ErrorForm>{errors.nameEmergencyContact.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="phoneNumberContactEmergency" className="text-sm uppercase font-bold">
          Número del contacto de emergencia
        </label>
        <input  
          id="phoneNumberContactEmergency"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese el número del contacto de emergencia" 
          {...register("phoneNumberContactEmergency", {
            maxLength: {
              value: MAXLENGTH_PHONENUMBER,
              message: `Debe ingresar un número de contacto de emergencia de máximo ${MAXLENGTH_PHONENUMBER} carácteres`
            }
          })}
        />
        {errors.phoneNumberContactEmergency && <ErrorForm>{errors.phoneNumberContactEmergency.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="registrationDate" className="text-sm uppercase font-bold">
          Fecha de registro
        </label>
        <input  
          id="registrationDate"
          className="w-full p-3 border border-gray-100"  
          type="date" 
          {...register('registrationDate', {
            required: 'La fecha de registro es obligatoria',
            max: {
              value: MAXDATE_BIRTHDAY,
              message: `Debe ingresar una fecha de registro de máximo ${formatDate(new Date())}`
            }
          })}
        />
        {errors.registrationDate && <ErrorForm>{errors.registrationDate.message?.toString()}</ErrorForm>}
      </div>
    </div>
  );
};