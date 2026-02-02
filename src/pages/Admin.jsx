import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Database, BarChart3, Trash2 } from 'lucide-react';

const Admin = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginData, setLoginData] = useState({ username: '', password: '' });
    const [questions, setQuestions] = useState(JSON.parse(localStorage.getItem('cached_questions') || '[]'));
    const [stats, setStats] = useState({
        total: questions.length,
        byDifficulty: questions.reduce((acc, q) => {
            acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
            return acc;
        }, {})
    });

    const [newQuestion, setNewQuestion] = useState({
        question: '',
        options: ['', '', '', ''],
        answer: '',
        difficulty: 1,
        category: 'ديني'
    });

    const handleLogin = (e) => {
        e.preventDefault();
        if (loginData.username === 'admin' && loginData.password === '1234') {
            setIsLoggedIn(true);
        } else {
            alert('اسم المستخدم أو كلمة المرور غير صحيحة');
        }
    };

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (evt) => {
            const bstr = evt.target.result;
            const wb = XLSX.read(bstr, { type: 'binary' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws);

            const parsed = data.map((row, i) => {
                const options = [row["الخيار أ"], row["الخيار ب"], row["الخيار ج"], row["الخيار د"]];
                let answerText = row["الإجابة"];
                if (answerText === "الخيار أ") answerText = row["الخيار أ"];
                else if (answerText === "الخيار ب") answerText = row["الخيار ب"];
                else if (answerText === "الخيار ج") answerText = row["الخيار ج"];
                else if (answerText === "الخيار د") answerText = row["الخيار د"];

                return {
                    id: Date.now() + i,
                    question: row["السؤال"],
                    options: options,
                    answer: answerText,
                    difficulty: row["المستوى"] || (i % 15) + 1,
                    category: row["التصنيف"] || 'ثقافي'
                };
            });

            const updated = [...questions, ...parsed];
            updateQuestions(updated);
        };
        reader.readAsBinaryString(file);
    };

    const updateQuestions = (updated) => {
        setQuestions(updated);
        localStorage.setItem('cached_questions', JSON.stringify(updated));
        setStats({
            total: updated.length,
            byDifficulty: updated.reduce((acc, q) => {
                acc[q.difficulty] = (acc[q.difficulty] || 0) + 1;
                return acc;
            }, {})
        });
    };

    const handleAddQuestion = (e) => {
        e.preventDefault();
        const updated = [...questions, { ...newQuestion, id: Date.now() }];
        updateQuestions(updated);
        setNewQuestion({ question: '', options: ['', '', '', ''], answer: '', difficulty: 1, category: 'ديني' });
        alert('تم إضافة السؤال بنجاح');
    };

    const deleteQuestion = (id) => {
        if (window.confirm('هل أنت متأكد من حذف هذا السؤال؟')) {
            updateQuestions(questions.filter(q => q.id !== id));
        }
    };

    const exportToExcel = () => {
        const ws = XLSX.utils.json_to_sheet(questions.map(q => ({
            "السؤال": q.question,
            "الخيار أ": q.options[0],
            "الخيار ب": q.options[1],
            "الخيار ج": q.options[2],
            "الخيار د": q.options[3],
            "الإجابة": q.answer,
            "المستوى": q.difficulty,
            "التصنيف": q.category
        })));
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "الأسئلة");
        XLSX.writeFile(wb, "الأسئلة_المصدرة.xlsx");
    };

    if (!isLoggedIn) {
        return (
            <div style={{
                height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: 'var(--green-gradient)', direction: 'rtl'
            }}>
                <form className="premium-card" style={{ padding: '40px', background: '#fff', width: '350px' }} onSubmit={handleLogin}>
                    <h2 style={{ textAlign: 'center', marginBottom: '30px' }}>دخول الإدارة</h2>
                    <div style={{ marginBottom: '15px' }}>
                        <label>اسم المستخدم:</label>
                        <input type="text" style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            onChange={e => setLoginData({ ...loginData, username: e.target.value })} />
                    </div>
                    <div style={{ marginBottom: '25px' }}>
                        <label>كلمة المرور:</label>
                        <input type="password" style={{ width: '100%', padding: '10px', marginTop: '5px' }}
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                    </div>
                    <button type="submit" className="btn-primary" style={{ width: '100%' }}>دخول</button>
                </form>
            </div>
        );
    }

    return (
        <div style={{ padding: '40px', background: '#f5f5f5', minHeight: '100vh', direction: 'rtl' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ color: 'var(--primary)' }}>لوحة التحكم الإدارية</h1>
                <button onClick={exportToExcel} className="btn-secondary">تصدير الأسئلة (Excel)</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '30px' }}>
                {/* Main Content */}
                <div>
                    <section className="premium-card" style={{ padding: '25px', background: '#fff', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            <Upload size={20} style={{ marginLeft: '10px' }} />
                            استيراد الأسئلة من Excel
                        </h2>
                        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} style={{ padding: '10px', border: '1px dashed #ccc', width: '100%' }} />
                    </section>

                    <section className="premium-card" style={{ padding: '25px', background: '#fff', marginBottom: '30px' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px' }}>إضافة سؤال جديد يدوياً</h2>
                        <form onSubmit={handleAddQuestion} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label>نص السؤال:</label>
                                <textarea rows="2" style={{ width: '100%', padding: '8px' }} value={newQuestion.question}
                                    onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })} required />
                            </div>
                            {newQuestion.options.map((opt, i) => (
                                <div key={i}>
                                    <label>الخيار {String.fromCharCode(1571 + i)}:</label>
                                    <input type="text" style={{ width: '100%', padding: '8px' }} value={opt}
                                        onChange={e => {
                                            const newOpts = [...newQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setNewQuestion({ ...newQuestion, options: newOpts });
                                        }} required />
                                </div>
                            ))}
                            <div>
                                <label>الإجابة الصحيحة:</label>
                                <select style={{ width: '100%', padding: '8px' }} value={newQuestion.answer}
                                    onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })} required>
                                    <option value="">اختر الإجابة</option>
                                    {newQuestion.options.map((opt, i) => opt && <option key={i} value={opt}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label>مستوى الصعوبة (1-15):</label>
                                <input type="number" min="1" max="15" style={{ width: '100%', padding: '8px' }} value={newQuestion.difficulty}
                                    onChange={e => setNewQuestion({ ...newQuestion, difficulty: parseInt(e.target.value) })} />
                            </div>
                            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', marginTop: '10px' }}>حفظ السؤال</button>
                        </form>
                    </section>

                    <section className="premium-card" style={{ padding: '25px', background: '#fff' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            <Database size={20} style={{ marginLeft: '10px' }} />
                            الأسئلة الحالية ({questions.length})
                        </h2>
                        <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: '#f9f9f9', borderBottom: '2px solid #eee' }}>
                                        <th style={{ padding: '10px', textAlign: 'right' }}>السؤال</th>
                                        <th style={{ padding: '10px', textAlign: 'right' }}>الإجابة</th>
                                        <th style={{ padding: '10px', width: '50px' }}>حذف</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {questions.map(q => (
                                        <tr key={q.id} style={{ borderBottom: '1px solid #eee' }}>
                                            <td style={{ padding: '10px' }}>{q.question}</td>
                                            <td style={{ padding: '10px', color: 'green' }}>{q.answer}</td>
                                            <td style={{ padding: '10px' }}><Trash2 size={16} color="red" style={{ cursor: 'pointer' }} onClick={() => deleteQuestion(q.id)} /></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>

                {/* Sidebar Stats */}
                <div>
                    <section className="premium-card" style={{ padding: '25px', background: '#fff', position: 'sticky', top: '20px' }}>
                        <h2 style={{ fontSize: '1.2rem', marginBottom: '20px', display: 'flex', alignItems: 'center' }}>
                            <BarChart3 size={20} style={{ marginLeft: '10px' }} />
                            إحصائيات
                        </h2>
                        <div style={{ fontSize: '0.9rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span>إجمالي الأسئلة:</span>
                                <span style={{ fontWeight: 'bold' }}>{stats.total}</span>
                            </div>
                            <hr style={{ margin: '15px 0', border: '1px solid #eee' }} />
                            <h3 style={{ fontSize: '1rem', marginBottom: '10px' }}>حسب المستوى (عدد الأسئلة):</h3>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {Array.from({ length: 15 }, (_, i) => i + 1).map(lvl => (
                                    <div key={lvl} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0' }}>
                                        <span>مستوى {lvl}:</span>
                                        <span>{stats.byDifficulty[lvl] || 0}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Admin;
