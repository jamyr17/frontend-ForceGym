import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { AssetDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useAssetStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import { formatDate } from "../shared/utils/format";

const MAXLENGTH_NAME = 100;
const MAXLENGTH_CODE = 10;
const MAXDATE = new Date().toUTCString();
const MIN_UNIT_VALUE = 115000; // Valor mínimo por unidad


function Form() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<AssetDataForm>();
    const { assets, activeEditingId, fetchAssets, addAsset, updateAsset, closeModalForm } = useAssetStore();

    // Observamos los valores de cantidad y costo
    const quantity = watch("quantity");
    const cost = watch("initialCost");

    const submitForm = async (data: AssetDataForm) => {
        // Validación adicional para valores negativos
        if (data.quantity <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'La cantidad no puede ser negativa o cero',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }
        // Validación clave: costo unitario ≥ 115,000
        if (data.initialCost < MIN_UNIT_VALUE) {
            Swal.fire({
                title: 'Error',
                text: `Cada activo debe valer ₡${MIN_UNIT_VALUE.toLocaleString()} o más (valor unitario insuficiente)`,
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        if (data.initialCost <= 0) {
            Swal.fire({
                title: 'Error',
                text: 'El costo no puede ser negativo o cero',
                icon: 'error',
                confirmButtonText: 'OK'
            });
            return;
        }

        let action = '', result;
        const loggedUser = getAuthUser();
        const reqData = {
            ...data,
            idUser: loggedUser?.idUser,
            paramLoggedIdUser: loggedUser?.idUser
        };

        if (activeEditingId === 0) {
            result = await addAsset(reqData as AssetDataForm);
            action = 'agregado';
        } else {
            result = await updateAsset(reqData as AssetDataForm);
            action = 'editado';
        }

        if (result.ok) {
            const result2 = await fetchAssets();

            if (result2.logout) {
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login');

            } else {
                closeModalForm();
                reset();

                await Swal.fire({
                    title: `Activo ${action}`,
                    text: `Se ha ${action} el activo ${reqData.name}`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            }
        } else if (result.logout) {
            setAuthHeader(null);
            setAuthUser(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        if (activeEditingId) {
            const activeAsset = assets.find(asset => asset.idAsset === activeEditingId);
            if (activeAsset) {
                setValue('idAsset', activeAsset.idAsset);
                setValue('idUser', activeAsset.user.idUser);
                setValue('boughtDate', activeAsset.boughtDate);
                setValue('isDeleted', activeAsset.isDeleted);
                setValue('name', activeAsset.name);
                setValue('code', activeAsset.code);
                setValue('quantity', activeAsset.quantity);
                setValue('initialCost', activeAsset.initialCost);
                setValue('serviceLifeYears', activeAsset.serviceLifeYears);
            }
        }
    }, [activeEditingId]);

    // Efecto para prevenir valores negativos en cantidad
    useEffect(() => {
        if (quantity !== undefined && quantity < 0) {
            setValue('quantity', 0);
        }
    }, [quantity]);

    // Efecto para prevenir valores negativos en costo
    useEffect(() => {
        if (cost !== undefined && cost < 0) {
            setValue('initialCost', 0);
        }
    }, [cost]);

    return (
        <form
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar activo' : 'Registrar activo'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input
                id="idUser"
                type="hidden"
                {...register('idUser')}
            />
            <input
                id="idAsset"
                type="hidden"
                {...register('idAsset')}
            />
            <input
                id="isDeleted"
                type="hidden"
                {...register('isDeleted')}
            />

            <div className="mb-5">
                <label htmlFor="boughtDate" className="text-sm uppercase font-bold">
                    Fecha de compra
                </label>
                <input
                    id="registrationDate"
                    className="w-full p-3 border border-gray-100"
                    type="date"
                    {...register('boughtDate', {
                        required: 'La fecha de compra es obligatoria',
                        max: {
                            value: MAXDATE,
                            message: `Debe ingresar una fecha de compra de máximo ${formatDate(new Date())}`
                        }
                    })}
                />
                {errors.boughtDate && <ErrorForm>{errors.boughtDate.message?.toString()}</ErrorForm>}
            </div>

            <div className="mb-5">
                <label htmlFor="code" className="text-sm uppercase font-bold">
                    Código
                </label>
                <input
                    id="code"
                    className="w-full p-3 border border-gray-100"
                    type="text"
                    placeholder="Ingrese el código"
                    {...register('code', {
                        required: 'El código es obligatorio',
                        maxLength: {
                            value: MAXLENGTH_CODE,
                            message: `Debe ingresar un código de máximo ${MAXLENGTH_CODE} carácteres`
                        }
                    })}
                />
                {errors.code &&
                    <ErrorForm>
                        {errors.code.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
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
                {errors.name &&
                    <ErrorForm>
                        {errors.name.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="quantity" className="text-sm uppercase font-bold">
                    Cantidad
                </label>
                <input
                    id="quantity"
                    className="w-full p-3 border border-gray-100"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ingrese la cantidad"
                    onWheel={(e) => {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }}
                    {...register('quantity', {
                        required: 'La cantidad es obligatoria',
                        min: {
                            value: 0,
                            message: 'La cantidad no puede ser negativa'
                        },
                        valueAsNumber: true
                    })}
                    onKeyDown={(e) => {
                        // Prevenir la entrada de caracteres negativos
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                />
                {errors.quantity &&
                    <ErrorForm>
                        {errors.quantity.message}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="cost" className="text-sm uppercase font-bold">
                    Costo unitario (Mínimo: ₡{MIN_UNIT_VALUE.toLocaleString()})
                </label>
                <input
                    id="cost"
                    className="w-full p-3 border border-gray-100"
                    type="number"
                    min={MIN_UNIT_VALUE}
                    step="0.01"
                    placeholder={`Mínimo ₡${MIN_UNIT_VALUE.toLocaleString()}`}
                    onWheel={(e) => {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }}
                    {...register('initialCost', {
                        required: 'El costo unitario es obligatorio',
                        min: {
                            value: MIN_UNIT_VALUE,
                            message: `El valor por unidad debe ser ≥ ₡${MIN_UNIT_VALUE.toLocaleString()}`
                        },
                        valueAsNumber: true
                    })}
                />
                {errors.initialCost &&
                    <ErrorForm>
                        {errors.initialCost.message?.toString().replace("initialCost", "valor unitario")}
                    </ErrorForm>
                }
            </div>

            <div className="mb-5">
                <label htmlFor="serviceLifeYears" className="text-sm uppercase font-bold">
                    Años de vida útil
                </label>
                <input
                    id="serviceLifeYears"
                    className="w-full p-3 border border-gray-100"
                    type="number"
                    min="0"
                    step="1"
                    placeholder="Ingrese los años de vida útil"
                    onWheel={(e) => {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }}
                    {...register('serviceLifeYears', {
                        required: 'Los años de vida útil son obligatorios',
                        min: {
                            value: 0,
                            message: 'Los ños de vida útil no pueden ser negativos'
                        },
                        valueAsNumber: true
                    })}
                    onKeyDown={(e) => {
                        // Prevenir la entrada de caracteres negativos
                        if (e.key === '-' || e.key === 'e' || e.key === 'E') {
                            e.preventDefault();
                        }
                    }}
                />
                {errors.serviceLifeYears &&
                    <ErrorForm>
                        {errors.serviceLifeYears.message}
                    </ErrorForm>
                }
            </div>

            <input
                type="submit"
                className="bg-yellow w-full p-3 text-white uppercase font-bold hover:bg-amber-600 cursor-pointer transition-colors"
                value={activeEditingId ? 'Actualizar' : 'Registrar'}
            />
        </form>
    );
}

export default Form;