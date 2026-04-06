import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import XLSX from "xlsx-js-style";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function exportToExcel(data: any[], filename: string = "checklist.xlsx") {
  const worksheet = XLSX.utils.json_to_sheet(data);
  
  const maxTaskLength = data.reduce((max, item) => {
    const text = String(item.Task || "");
    return Math.max(max, Math.ceil(text.length));
  }, 30);

  worksheet["!cols"] = [
    { wch: maxTaskLength },
    { wch: 10 },
  ];

  const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:B1");
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, C });
      if (!worksheet[cellAddress]) continue;

      worksheet[cellAddress].s = worksheet[cellAddress].s || {};
      
      if (C === 1) {
        worksheet[cellAddress].s.alignment = { horizontal: "center", vertical: "center" };
      }

      if (R === 0) {
        worksheet[cellAddress].s.font = { bold: true };
        worksheet[cellAddress].s.alignment = { horizontal: "center", vertical: "center" };
      }
    }
  }

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Tasks");
  XLSX.writeFile(workbook, filename);
}
