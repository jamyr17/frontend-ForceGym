import { FormEvent } from "react";
import Swal from 'sweetalert2';
import { Measurement, MeasurementDataForm } from "../shared/types";
import { getAuthUser, setAuthHeader, setAuthUser } from "../shared/utils/authentication";
import useMeasurementStore from "./Store";
import { useNavigate } from "react-router";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from 'xlsx';
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

    const exportToPDF = () => {
        const doc = new jsPDF(); 
        doc.setFont("helvetica");
        doc.text("Reporte de Medidas Corporales", 14, 10);
    
        const tableColumn = [
            "#", 
            "Fecha", 
            "Peso (kg)", 
            "Altura (cm)", 
            "Músculo (%)", 
            "Grasa Corporal (%)", 
            "Grasa Visceral (%)",
            "Cuello (cm)",
            "Hombros (cm)",
            "Pecho (cm)",
            "Cintura (cm)",
            "Muslo (cm)",
            "Pantorrilla (cm)",
            "Antebrazo (cm)",
            "Brazo (cm)"
        ];
    
        const tableRows = measurements.map((measurement, index) => [
            index + 1,
            formatDate(new Date(measurement.measurementDate)),
            measurement.weight,
            measurement.height,
            measurement.muscleMass,
            measurement.bodyFatPercentage,
            measurement.visceralFatPercentage,
            measurement.neckSize,
            measurement.shoulderSize,
            measurement.chestSize,
            measurement.waistSize,
            measurement.thighSize,
            measurement.calfSize,
            measurement.forearmSize,
            measurement.armSize
        ]);
    
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 20,
            styles: { fontSize: 7 }, // Para que quepan todas las columnas
        });
    
        doc.save("Medidas_Corporales.pdf");
    };
    
    const exportToExcel = () => {
        // Encabezados de la tabla
        const tableColumn = [
            "#", 
            "Fecha", 
            "Peso (kg)", 
            "Altura (cm)", 
            "Músculo (%)", 
            "Grasa Corporal (%)", 
            "Grasa Visceral (%)",
            "Cuello (cm)",
            "Hombros (cm)",
            "Pecho (cm)",
            "Cintura (cm)",
            "Muslo (cm)",
            "Pantorrilla (cm)",
            "Antebrazo (cm)",
            "Brazo (cm)"
        ];
    
        const tableRows = measurements.map((measurement, index) => [
            index + 1,
            formatDate(new Date(measurement.measurementDate)),
            measurement.weight,
            measurement.height,
            measurement.muscleMass,
            measurement.bodyFatPercentage,
            measurement.visceralFatPercentage,
            measurement.neckSize,
            measurement.shoulderSize,
            measurement.chestSize,
            measurement.waistSize,
            measurement.thighSize,
            measurement.calfSize,
            measurement.forearmSize,
            measurement.armSize
        ]);
        // Crear worksheet y workbook
        const ws = XLSX.utils.aoa_to_sheet([tableColumn, ...tableRows]);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Medidas Corporales");
    
        // Descargar
        XLSX.writeFile(wb, "Medidas_Corporales.xlsx");
    };

    return {
        handleDelete,
        handleSearch,
        handleOrderByChange, 
        handleRestore,
        exportToPDF,
        exportToExcel
    };
};