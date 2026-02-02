import * as XLSX from 'xlsx';
import fs from 'fs';

try {
    const buf = fs.readFileSync('c:\\Users\\DELL\\Desktop\\المراجعات\\المراجعات.xlsx');
    const workbook = XLSX.read(buf, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(sheet);

    const mapped = data.map((row, i) => {
        const options = [row["الخيار أ"], row["الخيار ب"], row["الخيار ج"], row["الخيار د"]];
        let answerText = row["الإجابة"];

        if (answerText === "الخيار أ") answerText = row["الخيار أ"];
        else if (answerText === "الخيار ب") answerText = row["الخيار ب"];
        else if (answerText === "الخيار ج") answerText = row["الخيار ج"];
        else if (answerText === "الخيار د") answerText = row["الخيار د"];

        return {
            id: i + 1,
            question: row["السؤال"],
            options: options,
            answer: answerText,
            difficulty: row["المستوى"] || (i % 15) + 1,
            category: row["التصنيف"] || 'مراجعات'
        };
    });

    if (!fs.existsSync('src/data')) fs.mkdirSync('src/data', { recursive: true });
    fs.writeFileSync('src/data/questions.json', JSON.stringify(mapped, null, 2));
    console.log(`Successfully mapped ${mapped.length} questions to src/data/questions.json`);
} catch (error) {
    console.error('Error:', error.message);
}
