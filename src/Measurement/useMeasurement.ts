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

    const referenceTables = [
        {
            title: "Índice de Masa Corporal (IMC)",
            headers: ["Categoría", "Rango"],
            rows: [
                ["BAJO", "<18.5"],
                ["NORMAL", "18.5 a 25"],
                ["ELEVADO", "25 a 30"],
                ["MUY ELEVADO", "30 o +"]
            ]
        },
        {
            title: "Grasa Visceral",
            headers: ["Categoría", "Rango"],
            rows: [
                ["NORMAL", "<9"],
                ["ELEVADO", "10 a 14"],
                ["MUY ELEVADO", "15 o +"]
            ]
        },
        {
            title: "Grasa Corporal (%) por Edad y Sexo",
            headers: ["Edad", "Categoría", "FEM", "MAS"],
            rows: [
                ["20-39", "NORMAL", "<21%", "<8%"],
                ["20-39", "ELEVADO", "21-22.9%", "8-19.9%"],
                ["20-39", "ALTO", "33-38.9%", "20-24.9%"],
                ["20-39", "MUY ALTO", ">39%", ">25%"],
                ["40-59", "NORMAL", "<23%", "<11%"],
                ["40-59", "ELEVADO", "23-33.9%", "11-21.9%"],
                ["40-59", "ALTO", "34-39.9%", "22-24.9%"],
                ["40-59", "MUY ALTO", ">40%", ">28%"],
                ["60-79", "NORMAL", "<24%", "<13%"],
                ["60-79", "ELEVADO", "24-35.9%", "13-24.9%"],
                ["60-79", "ALTO", "36-41.9%", "25-29.9%"],
                ["60-79", "MUY ALTO", ">42%", ">30%"]
            ]
        },
        {
            title: "Masa Muscular (M.M) por Edad y Sexo",
            headers: ["Edad", "Categoría", "FEM", "MAS"],
            rows: [
                ["18-39", "BAJO", "<24.3", "<33.3"],
                ["18-39", "NORMAL", "24.3-30.3", "33.3-39.3"],
                ["18-39", "ELEVADO", "30.4-35.3", "39.4-44"],
                ["18-39", "MUY ELEVADO", ">35.4", ">44.1"],
                ["40-59", "BAJO", "<24.1", "<33.1"],
                ["40-59", "NORMAL", "24.1-30.1", "33.1-39.1"],
                ["40-59", "ELEVADO", "30.2-35.1", "39.2-43.8"],
                ["40-59", "MUY ELEVADO", ">35.2", ">43.9"],
                ["60-80", "BAJO", "<23.9", "<32.9"],
                ["60-80", "NORMAL", "23.9-29.9", "32.9-38.9"],
                ["60-80", "ELEVADO", "30-34.9", "39-43.6"],
                ["60-80", "MUY ELEVADO", ">35", ">43.7"]
            ]
        }
    ];
    
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
        const heightInMeters = measurement.height / 100;
        
        const piernaFormat = measurement.leftLegSize && measurement.rightLegSize 
            ? `${measurement.rightLegSize}/${measurement.leftLegSize}`
            : "/";
            
        const pantorrillaFormat = measurement.leftCalfSize && measurement.rightCalfSize
            ? `${measurement.rightCalfSize}/${measurement.leftCalfSize}`
            : "/";
            
        const antebrazoFormat = measurement.leftForeArmSize && measurement.rightForeArmSize
            ? `${measurement.rightForeArmSize}/${measurement.leftForeArmSize}`
            : "/";
            
        const brazoFormat = measurement.leftArmSize && measurement.rightArmSize
            ? `${measurement.rightArmSize}/${measurement.leftArmSize}`
            : "/";

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
        clientData,
        referenceTables
    };
};
