import { FormEvent } from "react"
import Swal from 'sweetalert2'
import { Asset, AssetDataForm } from "../shared/types"
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication"
import useAssetStore from "./Store"
import { useNavigate } from "react-router"
import { formatAmountToCRC } from "../shared/utils/format"

export const useAsset = () => {
    const navigate = useNavigate()
    const { assets, fetchAssets, deleteAsset, updateAsset, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useAssetStore()

    const handleDelete = async ({ idAsset, name } : Asset) => {
        await Swal.fire({
            title: '¿Desea eliminar este activo?',
            text: `Está eliminando el activo ${name}`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Eliminar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const loggedUser = getAuthUser()
                const response = await deleteAsset(idAsset, loggedUser?.idUser as number)

                if(response.ok){
                    Swal.fire({
                        title: 'Activo eliminado',
                        text: `Se ha eliminado el activo ${name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })

                    fetchAssets()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }

    const handleSearch = (e : FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const form = e.target as HTMLFormElement
        const { searchTerm } = Object.fromEntries(new FormData(form))
        changeSearchTerm(searchTerm.toString())
    }

    const handleOrderByChange = (orderByTerm : string) => {
        changeOrderBy(orderByTerm)
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC')
    }

    const handleRestore = async (asset: AssetDataForm) => {
        const loggedUser = getAuthUser()
        const reqAsset = {
            ...asset, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        }
        
        await Swal.fire({
            title: '¿Desea restaurar este activo?',
            text: `Está restaurando el activo ${asset.name}`,
            icon: 'question',
            showCancelButton: true,
            cancelButtonText: "Cancelar",
            cancelButtonColor: '#bebdbd',
            confirmButtonText: 'Restaurar',
            confirmButtonColor: '#CFAD04',
            width: 500,
            reverseButtons: true
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await updateAsset(reqAsset)

                if(response.ok){
                    Swal.fire({
                        title: 'Activo restaurado',
                        text: `Se ha restaurado el activo ${asset.name}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    })
                    
                    fetchAssets()
                }

                if(response.logout){
                    setAuthHeader(null)
                    setAuthUser(null)
                    navigate('/login', {replace: true})
                }
            } 
        })
    }
    
    const pdfTableHeaders = ["#", "Código", "Nombre", "Cantidad", "Costo inicial por unidad", "Años de vida útil", "Valor actual por unidad", "Valor actual en total"];
    const pdfTableRows = assets.map((asset, index) => {
        const yearsSincePurchase = new Date().getFullYear() - new Date(asset.boughtDate).getFullYear();
        const currentValue = asset.initialCost - (asset.deprecationPerYear * yearsSincePurchase);
        const totalValue = currentValue * asset.quantity;
        
        return [
            index + 1,
            asset.code,
            asset.name,
            asset.quantity,
            formatAmountToCRC(asset.initialCost),
            asset.serviceLifeYears,
            formatAmountToCRC(currentValue),
            formatAmountToCRC(totalValue)
        ];
    });

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore,
        pdfTableHeaders,
        pdfTableRows
    }
}
