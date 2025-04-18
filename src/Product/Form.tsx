import { useForm } from "react-hook-form";
import Swal from 'sweetalert2';
import { ProductInventoryDataForm } from "../shared/types";
import ErrorForm from "../shared/components/ErrorForm";
import useProductInventoryStore from "./Store";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";

const MAXLENGTH_NAME = 100;
const MAXLENGTH_CODE = 10;

function Form() {
    const navigate = useNavigate();
    const { register, handleSubmit, setValue, formState: { errors }, reset, watch } = useForm<ProductInventoryDataForm>();
    const { productsInventory, activeEditingId, fetchProductsInventory, addProductInventory, updateProductInventory, closeModalForm } = useProductInventoryStore();

    // Observamos los valores de cantidad y costo
    const quantity = watch("quantity");
    const cost = watch("cost");

    const submitForm = async (data: ProductInventoryDataForm) => {
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

        if (data.cost <= 0) {
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
            result = await addProductInventory(reqData);
            action = 'agregado';
        } else {
            result = await updateProductInventory(reqData);
            action = 'editado';
        }

        closeModalForm();
        reset();
        
        if (result.ok) {
            const result2 = await fetchProductsInventory();
            
            if(result2.logout){
                setAuthHeader(null);
                setAuthUser(null);
                navigate('/login');
            } else {
                await Swal.fire({
                    title: `Producto de inventario ${action}`,
                    text: `Se ha ${action} el producto ${reqData.name}`,
                    icon: 'success',
                    confirmButtonText: 'OK',
                    timer: 3000,
                    timerProgressBar: true,
                    width: 500,
                    confirmButtonColor: '#CFAD04'
                });
            }
        } else if(result.logout) {
            setAuthHeader(null);
            setAuthUser(null);
            navigate('/login');
        }
    };

    useEffect(() => {
        if (activeEditingId) {
            const activeProduct = productsInventory.find(product => product.idProductInventory === activeEditingId);
            if (activeProduct) {
                setValue('idProductInventory', activeProduct.idProductInventory);
                setValue('idUser', activeProduct.user.idUser);
                setValue('isDeleted', activeProduct.isDeleted);
                setValue('name', activeProduct.name);
                setValue('code', activeProduct.code);
                setValue('quantity', activeProduct.quantity);
                setValue('cost', activeProduct.cost);
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
            setValue('cost', 0);
        }
    }, [cost]);

    return (
        <form 
            className="bg-white rounded-lg px-5 mb-10 overflow-scroll"
            noValidate
            onSubmit={handleSubmit(submitForm)}
        >
            <legend className="uppercase text-center text-yellow text-2xl font-black border-b-2 py-2 border-yellow">
                {activeEditingId ? 'Actualizar producto' : 'Registrar producto'}
            </legend>

            {/* inputs ocultos para la funcionalidad de actualizar */}
            <input  
                id="idUser" 
                type="hidden" 
                {...register('idUser')}
            />
            <input  
                id="idProductInventory" 
                type="hidden" 
                {...register('idProductInventory')}
            />
            <input  
                id="isDeleted" 
                type="hidden" 
                {...register('isDeleted')}
            />

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
                    Costo
                </label>
                <input  
                    id="cost"
                    className="w-full p-3 border border-gray-100"  
                    type="number" 
                    min="0"
                    step="0"
                    placeholder="Ingrese el costo" 
                    onWheel={(e) => {
                        e.preventDefault();
                        e.currentTarget.blur();
                    }}
                    {...register('cost', {
                        required: 'El costo es obligatorio', 
                        min: {
                            value: 0,
                            message: 'El costo no puede ser negativo'
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
                {errors.cost && 
                    <ErrorForm>
                        {errors.cost.message}
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