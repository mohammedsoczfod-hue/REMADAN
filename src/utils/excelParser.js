import * as XLSX from 'xlsx';

export const parseExcelData = (buffer) => {
    const workbook = XLSX.read(buffer, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    // Mapping columns to app internal structure
    return data.map((row, index) => ({
        id: index,
        question: row["السؤال"],
        options: [
            row["الخيار أ"],
            row["الخيار ب"],
            row["الخيار ج"],
            row["الخيار د"]
        ],
        answer: row["الإجابة"], // Expecting "الخيار أ" etc. or literal
    }));
};
