/*
 * Copyright (C) 2025 Vyst Ltda., Pedro Henrique Gracia & Antônio A. Meloni
 * All rights reserved.
 *
*/
import { Request } from '../types';
import * as XLSX from 'xlsx';

/**
 * Converts an array of objects to a CSV string.
 */
function convertToCSV(data: any[], options?: { delimiter: string }): string {
    if (!data || data.length === 0) {
        return '';
    }
    const delimiter = options?.delimiter || ',';

    const headers = Object.keys(data[0]);
    const csvRows = [];
    csvRows.push(headers.join(delimiter));

    for (const row of data) {
        const values = headers.map(header => {
            let value = row[header] === null || row[header] === undefined ? '' : String(row[header]);
            if (value.includes(delimiter) || value.includes('"')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        });
        csvRows.push(values.join(delimiter));
    }

    return csvRows.join('\n');
}

/**
 * Triggers a browser download for a file from a Blob.
 */
function downloadBlob(blob: Blob, filename: string): void {
    const link = document.createElement('a');
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', filename);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }
}

/**
 * Triggers a browser download for a CSV file.
 * NOTE: The 'data' parameter is typed as 'Request[]' but the implementation is generic.
 * It's kept for consistency with other parts of the app, but can accept any object array.
 */
export function exportRequestsToCSV(data: Request[], filename: string): void {
    const csvData = convertToCSV(data);
    const blob = new Blob([`\uFEFF${csvData}`], { type: 'text/csv;charset=utf-8;' }); // BOM for Excel
    downloadBlob(blob, filename);
}

function s2ab(s: string): ArrayBuffer {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
        view[i] = s.charCodeAt(i) & 0xFF;
    }
    return buf;
}

/**
 * Triggers a browser download for an Excel (.xlsx) file.
 * NOTE: The 'data' parameter is typed as 'Request[]' but the implementation is generic.
 */
export function exportRequestsToExcel(data: Request[], filename: string): void {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Dados");
    
    const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'binary' });

    const blob = new Blob([s2ab(wbout)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
    
    downloadBlob(blob, filename);
}