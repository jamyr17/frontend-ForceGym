import jsPDF from "jspdf";
import { formatCurrentDateForDocument, formatCurrentDateWithHourForTitle, formatCurrentHourForDocument } from "./format";
import { getAuthUser } from "./authentication";
import autoTable from "jspdf-autotable";

export const exportToPDF = (title: string, tableColumn : string[], tableRows: any) => {
    // 1. INSTANCIA Y PROPIEDADES:
    const doc = new jsPDF({
        putOnlyUsedFonts: true
    });   

    // 1.1 Recuperar datos para título y nombre
    const formattedCurrentDate = formatCurrentDateWithHourForTitle();
    const formattedCurrentDateDoc = formatCurrentDateForDocument();
    const formattedCurrentHourDoc = formatCurrentHourForDocument();
    const user = getAuthUser();
    const userName = `${user?.person.name} ${user?.person.firstLastName} ${user?.person.secondLastName}`;

    // 1.2 Propiedades del documento
    doc.setProperties({
        title: `Reporte de ${title} - ${formattedCurrentDate}`
    })

    // 2. ENCABEZADO:
    // 2.1 Añadir logo al documento
    const logo = "/Logo.webp";
    doc.addImage(logo, 'WEBP', 13, 8, 35, 15);

    // 2.2 Añadir título
    doc.setFont("helvetica", "bold");
    doc.text("Reporte de " + title, 105, 18, {align: 'center'});
    
    // 2.3 Separador
    doc.setLineWidth(0.1);
    doc.setDrawColor(200, 200, 200);
    doc.line(13, 27, 195, 27)

    // 3. INFO: 
    // 3.1 Añadir usuario 
    doc.setFont("arial", "light");
    doc.setTextColor(0,0,0);
    doc.setFontSize(11)
    doc.text("Hecho por: " + userName, 13, 35, {align: 'left'});

    // 3.2 Añadir fecha 
    doc.text("Fecha: " + formattedCurrentDateDoc, 13, 40, {align: 'left'});

    // 3.3 Añadir hora 
    doc.text("Hora: " +formattedCurrentHourDoc, 13, 45, {align: 'left'});

    // 3.4 Separador
    doc.setLineWidth(0.1);
    doc.setDrawColor(200, 200, 200);
    doc.line(13, 50, 195, 50)

    // 4. TABLA:
    doc.setFontSize(13)
    autoTable(doc, { 
        theme: 'striped',
        head: [tableColumn],
        body: tableRows,
        startY: 55,
        styles: {
            font: "helvetica",
            textColor: [0, 0, 0],
        },
        headStyles: {
            fillColor: [207, 173, 4],
            textColor: [0, 0, 0], 
        }
    });

    doc.save(`Reporte de ${title} - ${formattedCurrentDate}.pdf`);
};