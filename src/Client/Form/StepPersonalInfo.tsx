import { useFormContext } from "react-hook-form";
import ErrorForm from "../../shared/components/ErrorForm";
import { formatDate } from "../../shared/utils/format";

const MAXLENGTH_IDENTIFICATIONUMBER = 20;
const MAXLENGTH_NAME = 50;
const MAXLENGTH_FIRSTLASTNAME = 50;
const MAXLENGTH_SECONDLASTNAME = 50;
const MAXDATE_BIRTHDAY = new Date().toUTCString();

export const StepClientInfo = ({ genders, typesClient }: { genders: any[], typesClient: any[] }) => {
  const { register, formState: { errors } } = useFormContext();
  
  return (
    <div className="space-y-5">
      <div>
        <label htmlFor="idTypeClient" className="text-sm uppercase font-bold">
          Tipo de Cliente
        </label>
        <select
          id="idTypeClient"
          className="w-full p-3 border border-gray-100" 
          defaultValue=""
          {...register("idTypeClient", {
            required: "El tipo de cliente es obligatorio"
          })}  
        >
          <option value="">Seleccione un tipo de cliente</option>
          {typesClient.map((type) => (
            <option key={type.idTypeClient} value={type.idTypeClient}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.idTypeClient && <ErrorForm>{errors.idTypeClient.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="identificationNumber" className="text-sm uppercase font-bold">
          Cédula 
        </label>
        <input  
          id="identificationNumber"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese la cédula" 
          {...register('identificationNumber', {
            required: 'La cédula es obligatoria',
            maxLength: {
              value: MAXLENGTH_IDENTIFICATIONUMBER,
              message: `Debe ingresar una cédula de máximo ${MAXLENGTH_IDENTIFICATIONUMBER} carácteres`
            }
          })}
        />
        {errors.identificationNumber && 
          <ErrorForm>{errors.identificationNumber.message?.toString()}</ErrorForm>
        }
      </div>

      <div>
        <label htmlFor="name" className="text-sm uppercase font-bold">
          Nombre 
        </label>
        <input  
          id="name"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese el nombre" 
          {...register('name', {
            required: 'El nombre es obligatorio',
            maxLength: {
              value: MAXLENGTH_NAME,
              message: `Debe ingresar un nombre de máximo ${MAXLENGTH_NAME} carácteres`
            }
          })}
        />
        {errors.name && <ErrorForm>{errors.name.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="firstLastName" className="text-sm uppercase font-bold">
          Primer Apellido 
        </label>
        <input  
          id="firstLastName"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese el primer apellido" 
          {...register('firstLastName', {
            required: 'El primer apellido es obligatorio',
            maxLength: {
              value: MAXLENGTH_FIRSTLASTNAME,
              message: `Debe ingresar un primer apellido de máximo ${MAXLENGTH_FIRSTLASTNAME} carácteres`
            }
          })}
        />
        {errors.firstLastName && <ErrorForm>{errors.firstLastName.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="secondLastName" className="text-sm uppercase font-bold">
          Segundo Apellido 
        </label>
        <input  
          id="secondLastName"
          className="w-full p-3 border border-gray-100"  
          type="text" 
          placeholder="Ingrese el segundo apellido" 
          {...register('secondLastName', {
            required: 'El segundo apellido es obligatorio',
            maxLength: {
              value: MAXLENGTH_SECONDLASTNAME,
              message: `Debe ingresar un segundo apellido de máximo ${MAXLENGTH_SECONDLASTNAME} carácteres`
            }
          })}
        />
        {errors.secondLastName && <ErrorForm>{errors.secondLastName.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="birthday" className="text-sm uppercase font-bold">
          Fecha de nacimiento
        </label>
        <input  
          id="birthday"
          className="w-full p-3 border border-gray-100"  
          type="date" 
          {...register('birthday', {
            required: 'La fecha de nacimiento es obligatoria',
            max: {
              value: MAXDATE_BIRTHDAY,
              message: `Debe ingresar una fecha de nacimiento de máximo ${formatDate(new Date())}`
            }
          })}
        />
        {errors.birthday && <ErrorForm>{errors.birthday.message?.toString()}</ErrorForm>}
      </div>

      <div>
        <label htmlFor="idGender" className="text-sm uppercase font-bold">
          Género 
        </label>
        <select
          id="idGender"
          className="w-full p-3 border border-gray-100" 
          {...register("idGender", {
            required: 'El género es obligatorio',
            validate: value => value !== '0' || 'Debe seleccionar un género'
          })}   
        >
          {genders.map((gender) => (
            <option key={gender.idGender} value={gender.idGender}>
              {gender.name}
            </option>
          ))}
        </select>
        {errors.idGender && <ErrorForm>{errors.idGender.message?.toString()}</ErrorForm>}
      </div>
    </div>
  );
};