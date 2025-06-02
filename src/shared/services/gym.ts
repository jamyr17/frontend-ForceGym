import { createHeaders } from '../utils/authentication';
import Swal from 'sweetalert2';

export const getData = async (url:string) =>  {
    const createdHeaders = createHeaders()

    try{
        const res = await fetch(url, {
            method: 'GET',
            headers: createdHeaders
        }) 

        return manageResponse(res)

    } catch(error:any){
        return error.message
    }
}

export const postData = async (url:string, dataReq:any) => {
    const createdHeaders = createHeaders()

    try{
        const res = await fetch(url, {
            method: 'POST',
            headers: createdHeaders,
            body: JSON.stringify(dataReq)
        }) 

        return manageResponse(res)
        
    } catch(error:any){
        return error
    }
}

export const putData = async (url:string, dataReq:any) => {
    const createdHeaders = createHeaders()

    try{
        const res = await fetch(url, {
            method: 'PUT',
            headers: createdHeaders,
            body: JSON.stringify(dataReq)
        }) 

        return manageResponse(res)

    } catch(error:any){
        return error
    }
}

export const deleteData = async (url:string, dataReq:any) => {
    const createdHeaders = createHeaders()

    try{
        const res = await fetch(url, {
            method: 'DELETE',
            headers: createdHeaders,
            body: dataReq
        }) 

        return manageResponse(res)
        
    } catch(error:any){
        return error
    }
}

const manageResponse = async (res: Response) => { 
    const code = res.status
    let result = {
        data: '',
        message: ''
    }

    let jsonRes
    try {
        const text = await res.text()

        // si el cuerpo tiene contenido, intentar parsearlo como JSON
        if (text) { 
            jsonRes = JSON.parse(text)
            result = {
                ...result, 
                data: jsonRes.data ?? '',
                message: jsonRes.message ?? ''
            }
        }
    } catch (error) {
        console.warn("Error al parsear JSON de res:", error)
    }

    // casos de éxito
    if ([200, 201, 202].includes(code)) {
        return { ...result, ok: true }
    }

    // manejo de errores
    if ([400, 405, 406, 407, 408].includes(code)) {
        await Swal.fire({
            title: 'Ha ocurrido un error',
            text: 'Inténtelo de nuevo',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            width: 300,
            confirmButtonColor: '#CFAD04'
        })
        return
    }

    // errores que ameritan logout
    if ([401, 403].includes(code)) {
        await Swal.fire({
            title: 'Ha ocurrido un error',
            text: 'Debe iniciar sesión',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            width: 300,
            confirmButtonColor: '#CFAD04'
        })
        return { ...result, logout: true }
    }

    // errores de servidor
    if ([500, 502, 501, 503, 504, 505, 506, 507, 508].includes(code)) {
        await Swal.fire({
            title: 'Ha ocurrido un error',
            text: result.message || 'Error en el servidor',
            icon: 'error',
            confirmButtonText: 'OK',
            timer: 3000,
            timerProgressBar: true,
            width: 300,
            confirmButtonColor: '#CFAD04'
        })
        return
    }

    return
}
