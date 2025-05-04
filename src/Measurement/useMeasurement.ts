import { FormEvent } from "react";
import Swal from 'sweetalert2';
import { Client, Measurement, MeasurementDataForm } from "../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useMeasurementStore from "./Store";
import { useNavigate } from "react-router";
import { formatDate } from "../shared/utils/format";

export const useMeasurement = () => {
    const navigate = useNavigate();
    const { measurements, fetchMeasurements, deleteMeasurement, updateMeasurement, changeSearchTerm, changeOrderBy, changeDirectionOrderBy, directionOrderBy } = useMeasurementStore();

    const handleDelete = async ({ idMeasurement }: Measurement) => {
        await Swal.fire({
            title: '¿Desea eliminar esta medición?',
            text: `Está eliminando la medición con ID ${idMeasurement}`,
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
                const loggedUser = getAuthUser();
                const response = await deleteMeasurement(idMeasurement, loggedUser?.idUser);

                if(response.ok){
                    Swal.fire({
                        title: 'Medición eliminada',
                        text: `Se ha eliminado la medición con ID ${idMeasurement}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });
                    fetchMeasurements();
                }

                if(response.logout){
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate('/login', {replace: true});
                }
            } 
        });
    };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = e.target as HTMLFormElement;
        const { searchTerm } = Object.fromEntries(new FormData(form));
        changeSearchTerm(searchTerm.toString());
    };

    const handleOrderByChange = (orderByTerm: string) => {
        changeOrderBy(orderByTerm);
        changeDirectionOrderBy(directionOrderBy === 'DESC' ? 'ASC' : 'DESC');
    };

    const handleRestore = async (measurement: MeasurementDataForm) => {
        const loggedUser = getAuthUser();
        const reqMeasurement = {
            ...measurement, 
            isDeleted: 0,
            paramLoggedIdUser: loggedUser?.idUser
        };
        
        await Swal.fire({
            title: '¿Desea restaurar esta medición?',
            text: `Está restaurando la medición con ID ${measurement.idMeasurement}`,
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
                const response = await updateMeasurement(reqMeasurement);

                if(response.ok){
                    Swal.fire({
                        title: 'Medición restaurada',
                        text: `Se ha restaurado la medición con ID ${measurement.idMeasurement}`,
                        icon: 'success',
                        confirmButtonText: 'OK',
                        timer: 3000,
                        timerProgressBar: true,
                        width: 500,
                        confirmButtonColor: '#CFAD04'
                    });
                    fetchMeasurements();
                }

                if(response.logout){
                    setAuthHeader(null);
                    setAuthUser(null);
                    navigate('/login', {replace: true});
                }
            } 
        });
    };

    const calculateAge = (birthDate: Date | string): number => {
        const birth = new Date(birthDate);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        
        return age;
    };

    const clientData = measurements.length > 0 ? {
        name: `${measurements[0].client.person.name} ${measurements[0].client.person.firstLastName}`,
        age: calculateAge(measurements[0].client.person.birthday),
        height: measurements[0].height
    } : null;
    
    const tableColumn = [
        "Fecha",
        "Peso",
        "% G.Corp", 
        "M.M",
        "%G.Visc",
        "Pecho",
        "Espalda",
        "Cintura",
        "Cadera",
        "Pierna D/I",
        "Pantorrilla D/I",
        "antebrazo",
        "brazo"
    ];

    const tableRows = measurements.map(measurement => {
        return [
            formatDate(new Date(measurement.measurementDate)), // Fecha
            measurement.weight, // Peso
            measurement.bodyFatPercentage, // % Grasa Corporal
            measurement.muscleMass, // Masa Muscular
            measurement.visceralFatPercentage, // % Grasa Visceral
            measurement.chestSize || "/", // Pecho
            measurement.backSize || "/", // Espalda
            measurement.waistSize || "/", // Cintura
            measurement.hipSize || "/", // Cadera
            `${measurement.rightLegSize} / ${measurement.leftLegSize}`, // Pierna D/I
            `${measurement.rightCalfSize} / ${measurement.leftCalfSize}`, // Pantorrilla D/I
            `${measurement.rightForeArmSize} / ${measurement.leftForeArmSize}`, // Antebrazo D/I
            `${measurement.rightArmSize} / ${measurement.leftArmSize}` // Brazo D/I
        ];
            
    });

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore,
        tableColumn,
        tableRows,
        clientData
    };
};
