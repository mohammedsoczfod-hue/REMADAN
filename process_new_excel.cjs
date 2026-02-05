const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const EXCEL_PATH = 'c:\\Users\\DELL\\Desktop\\المراجعات\\صثق.xlsx';
const OUTPUT_PATH = 'c:\\Users\\DELL\\Desktop\\المراجعات\\src\\data\\questions.json';

try {
    console.log('Reading file:', EXCEL_PATH);
    const workbook = XLSX.readFile(EXCEL_PATH);
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet);

    console.log(`Found ${data.length} rows in Excel.`);

    const parsedQuestions = data.map((row, i) => {
        // Adjust column names based on common patterns or previous excel structure
        const options = [
            row["الخيار أ"] || row["Option A"] || row["A"],
            row["الخيار ب"] || row["Option B"] || row["B"],
            row["الخيار ج"] || row["Option C"] || row["C"],
            row["الخيار د"] || row["Option D"] || row["D"]
        ].filter(Boolean);

        let answer = row["الإجابة"] || row["Answer"] || row["Correct"];

        // Map "الخيار أ" -> actual text if needed
        if (answer === "الخيار أ" || answer === "A") answer = options[0];
        else if (answer === "الخيار ب" || answer === "B") answer = options[1];
        else if (answer === "الخيار ج" || answer === "C") answer = options[2];
        else if (answer === "الخيار د" || answer === "D") answer = options[3];

        return {
            id: Date.now() + i,
            question: row["السؤال"] || row["Question"],
            options: options,
            answer: answer,
            difficulty: parseInt(row["المستوى"] || row["Level"]) || (i % 15) + 1,
            category: row["التصنيف"] || row["Category"] || 'ثقافي'
        };
    });

    // Check existing questions
    let existingQuestions = [];
    if (fs.existsSync(OUTPUT_PATH)) {
        existingQuestions = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf8'));
    }

    const updatedQuestions = [...existingQuestions, ...parsedQuestions];
    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(updatedQuestions, null, 2));

    console.log(`Successfully added ${parsedQuestions.length} questions. Total questions: ${updatedQuestions.length}`);
} catch (error) {
    console.error('Error processing Excel:', error.message);
}
