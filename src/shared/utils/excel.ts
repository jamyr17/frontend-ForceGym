import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import {
  formatCurrentDateWithHourForTitle,
  formatCurrentDateForDocument,
  formatCurrentHourForDocument,
} from "./format";
import { getAuthUser } from "./authentication";

export const exportToExcel = async (
  title: string,
  tableHeaders: string[],
  tableRows: any[][],
  includeReferenceTable: boolean = false,
  clientData?: { name: string; age: number; height: number }
) => {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(`Reporte de ${title}`);
  if (clientData) {
    worksheet.addRow([`Nombre del cliente: ${clientData.name}`]);
    worksheet.addRow([`Edad: ${clientData.age}`]);
    worksheet.addRow([`Estatura: ${clientData.height} cm`]);
    worksheet.addRow([]);
  }

  const formattedCurrentDate = formatCurrentDateWithHourForTitle();
  const formattedCurrentDateDoc = formatCurrentDateForDocument();
  const formattedCurrentHourDoc = formatCurrentHourForDocument();
  const user = getAuthUser();
  const userName = `${user?.person.name} ${user?.person.firstLastName} ${user?.person.secondLastName}`;

  const logoPath = "/Logo.png";
  const logoBuffer = await fetch(logoPath).then((res) => res.arrayBuffer());
  const logoImage = await workbook.addImage({
    buffer: logoBuffer,
    extension: "png",
  });
  
  worksheet.addImage(logoImage, {
    tl: { col: 0, row: 0 }, 
    ext: { width: 160, height: 63 }
  });

  worksheet.getRow(1).height = 50; 
  worksheet.getRow(2).height = 16;   
  worksheet.getRow(3).height = 20; 
  worksheet.getRow(4).height = 20; 
  worksheet.getRow(5).height = 20; 

  worksheet.mergeCells("D1:H1");
  const titleCell = worksheet.getCell("D1");
  titleCell.value = `Reporte de ${title}`;
  titleCell.font = { 
    size: 16, 
    bold: true,
    name: 'Arial'
  };
  titleCell.alignment = { 
    horizontal: "center",
    vertical: "middle"
  };

  const userCell = worksheet.getCell("A3");
  userCell.value = `Hecho por: ${userName}`;
  userCell.font = { 
    size: 11,
    italic: true,
    name: 'Arial'
  };

  const dateCell = worksheet.getCell("A4");
  dateCell.value = `Fecha: ${formattedCurrentDateDoc}`;
  dateCell.font = { 
    size: 11,
    italic: true,
    name: 'Arial'
  };

  const hourCell = worksheet.getCell("A5");
  hourCell.value = `Hora: ${formattedCurrentHourDoc}`;
  hourCell.font = { 
    size: 11,
    italic: true,
    name: 'Arial'
  };

  if (clientData) {
    const clientRow1 = worksheet.getRow(6);
    clientRow1.getCell(1).value = `Cliente: ${clientData.name}`;
    clientRow1.getCell(1).font = { 
      size: 11,
      bold: true,
      name: 'Arial'
    };

    const clientRow2 = worksheet.getRow(7);
    clientRow2.getCell(1).value = `Edad: ${clientData.age} años | Estatura: ${clientData.height} cm`;
    clientRow2.getCell(1).font = { 
      size: 11,
      name: 'Arial'
    };

    worksheet.mergeCells("A8:H8");
    const separatorCell = worksheet.getCell("A8");
    separatorCell.border = {
      bottom: { style: "thin", color: { argb: "FFC8C8C8" } }
    };
    worksheet.getRow(8).height = 5;
  } else {
    worksheet.mergeCells("A6:H6");
    const separatorCell = worksheet.getCell("A6");
    separatorCell.border = {
      bottom: { style: "thin", color: { argb: "FFC8C8C8" } }
    };
    worksheet.getRow(6).height = 5;
  }

  const headerRow = worksheet.addRow(tableHeaders);
  headerRow.height = 25;
  headerRow.eachCell((cell) => {
    cell.font = { 
      bold: true,
      size: 12,
      name: 'Arial',
      color: { argb: "FF000000" }
    };
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCFAD04" },
    };
    cell.border = {
      top: { style: "thin", color: { argb: "FF000000" } },
      left: { style: "thin", color: { argb: "FF000000" } },
      bottom: { style: "thin", color: { argb: "FF000000" } },
      right: { style: "thin", color: { argb: "FF000000" } },
    };
    cell.alignment = { 
      horizontal: "center", 
      vertical: "middle",
      wrapText: true 
    };
  });

  tableRows.forEach((rowData) => {
    const row = worksheet.addRow(rowData);
    row.eachCell((cell, colNumber) => {
      cell.font = {
        size: 11,
        name: 'Arial'
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FFD3D3D3" } },
        left: { style: "thin", color: { argb: "FFD3D3D3" } },
        bottom: { style: "thin", color: { argb: "FFD3D3D3" } },
        right: { style: "thin", color: { argb: "FFD3D3D3" } },
      };
      cell.alignment = { 
        vertical: "top", 
        wrapText: true,
        horizontal: "left"
      };

      if (colNumber === 1 && typeof cell.value === "number") {
        cell.numFmt = '0'; 
        cell.value = parseInt(cell.value.toString()); 
      }
      else if (typeof cell.value === "number") {
        cell.numFmt = '#,##0.00';
        cell.alignment.horizontal = "right";
      }
    });
  });

  if (includeReferenceTable && title.toLowerCase() === "medidas") {
    const startRow = worksheet.rowCount + 3;
    
    const headerLabels = ["", "BAJO", "NORMAL", "ELEVADO", "MUY ELEVADO"];
    const headerRow = worksheet.getRow(startRow);
    
    headerLabels.forEach((label, colIndex) => {
      const cell = headerRow.getCell(colIndex + 1);
      cell.value = label;
      cell.font = {
        bold: true,
        size: 10,
        name: 'Arial'
      };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE6E6E6" }, // Fondo gris claro
      };
      cell.border = {
        top: { style: "thin", color: { argb: "FF000000" } },
        left: { style: "thin", color: { argb: "FF000000" } },
        bottom: { style: "thin", color: { argb: "FF000000" } },
        right: { style: "thin", color: { argb: "FF000000" } },
      };
      cell.alignment = {
        horizontal: "center",
        vertical: "middle",
        wrapText: true
      };
    });

    const referenceData = [
      ["IMC", "<18.5", "18.5 a 25", "25 a 30", "30 o +"],
      ["VISCERAL", "", "<9", "10 a 14", "15 o +"],
      ["GRASA C", "FEM / MAS", "FEM / MAS", "FEM / MAS", "FEM / MAS"],
      ["20-39", "<21 / <8", "21-22.9 / 8-19.9", "33-38.9 / 20-24.9", ">39 / >25"],
      ["40-59", "<23 / <11", "23-33.9 / 11-21.9", "34-39.9 / 22-24.9", ">40 / >28"],
      ["60-79", "<24 / <13", "24-35.9 / 13-24.9", "36-41.9 / 25-29.9", ">42 / >30"],
      ["M.M", "FEM / MAS", "FEM / MAS", "FEM / MAS", "FEM / MAS"],
      ["18-39", "<24.3 / <33.3", "24.3-30.3 / 33.3-39.3", "30.4-35.3 / 39.4-44", ">35.4 / >44.1"],
      ["40-59", "<24.1 / <33.1", "24.1-30.1 / 33.1-39.1", "30.2-35.1 / 39.2-43.8", ">35.2 / >43.9"],
      ["60-80", "<23.9 / <32.9", "23.9-29.9 / 32.9-38.9", "30-34.9 / 39-43.6", ">35 / >43.7"]
    ];

    referenceData.forEach((rowData, rowIndex) => {
      const row = worksheet.getRow(startRow + rowIndex + 1);
      
      rowData.forEach((cellValue, colIndex) => {
        const cell = row.getCell(colIndex + 1);
        cell.value = cellValue;
        cell.font = {
          size: 9,
          name: 'Arial'
        };
        cell.border = {
          top: { style: "thin", color: { argb: "FF000000" } },
          left: { style: "thin", color: { argb: "FF000000" } },
          bottom: { style: "thin", color: { argb: "FF000000" } },
          right: { style: "thin", color: { argb: "FF000000" } },
        };
        cell.alignment = {
          vertical: "middle",
          horizontal: "center",
          wrapText: true
        };

        // Resaltar primera columna
        if (colIndex === 0) {
          cell.font = { ...cell.font, bold: true };
          cell.fill = {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: "FFF2F2F2" },
          };
        }
      });
    });

    worksheet.getColumn(1).width = 12; // Primera columna más ancha
    for (let i = 2; i <= 5; i++) {
      worksheet.getColumn(i).width = 15; // Columnas de valores
    }
  }

  // Ajustar anchos de columnas para la tabla principal
  const columnWidths = [8, 15, 12, 15, 20, 20, 40]; 
  worksheet.columns.forEach((column, index) => {
    const customWidth = columnWidths[index];
    let maxLength = customWidth || 15;
    
    if (!customWidth) {
      column.eachCell?.({ includeEmpty: true }, (cell) => {
        const columnLength = cell.value ? cell.value.toString().length + 2 : 10;
        if (columnLength > maxLength) {
          maxLength = columnLength;
        }
      });
    }
    
    column.width = Math.min(Math.max(maxLength, 8), 50); 
  });

  const buffer = await workbook.xlsx.writeBuffer();
  saveAs(
    new Blob([buffer]), 
    `Reporte de ${title} - ${formattedCurrentDate}.xlsx`
  );
};