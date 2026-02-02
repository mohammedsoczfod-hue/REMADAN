const XLSX = require('xlsx');
const path = require('path');

try {
    const filePath = 'c:\\Users\\DELL\\Desktop\\المراجعات\\المراجعات.xlsx';
    console.log('Reading file:', filePath);
    const workbook = XLSX.readFile(filePath);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    
    console.log('Sheet Name:', sheetName);
    console.log('Header Row:', JSON.stringify(data[0]));
    console.log('First Data Row:', JSON.stringify(data[1]));
} catch (error) {
    console.error('Error reading Excel:', error.message);
}
