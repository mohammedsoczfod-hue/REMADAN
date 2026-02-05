import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Upload, Database, BarChart3, Trash2, LogOut, PlusCircle, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
        if (!file) return;
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
            alert(`تم استيراد ${parsed.length} سؤال بنجاح`);
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
                background: 'var(--emerald-gradient)', direction: 'rtl', padding: '20px'
            }}>
                <motion.form
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-morphism"
                    style={{ padding: '40px', width: '100%', maxWidth: '400px', border: '1px solid rgba(255,255,255,0.1)' }}
                    onSubmit={handleLogin}
                >
                    <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                        <img src="/logo.png" alt="Logo" style={{ width: '80px', marginBottom: '15px' }} />
                        <h2 className="gold-text" style={{ fontSize: '1.8rem' }}>دخول الإدارة</h2>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent)' }}>اسم المستخدم</label>
                        <input
                            type="text"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                            placeholder="username"
                            onChange={e => setLoginData({ ...loginData, username: e.target.value })}
                        />
                    </div>

                    <div style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent)' }}>كلمة المرور</label>
                        <input
                            type="password"
                            style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', borderRadius: '8px' }}
                            placeholder="••••••••"
                            onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="btn-primary" style={{ width: '100%', padding: '15px', fontSize: '1.1rem' }}>
                        تسجيل الدخول
                    </button>
                </motion.form>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            background: 'var(--background)',
            color: 'var(--text)',
            direction: 'rtl',
            padding: '20px'
        }}>
            {/* Navbar */}
            <nav className="glass-morphism" style={{ padding: '15px 30px', marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderRadius: '15px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <img src="/logo.png" alt="Logo" style={{ width: '40px' }} />
                    <h1 style={{ fontSize: '1.4rem', fontWeight: 'bold' }} className="gold-text">لوحة إدارة المسابقة</h1>
                </div>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button onClick={exportToExcel} className="btn-secondary" style={{ fontSize: '0.9rem' }}>تصدير بيانات Excel</button>
                    <button onClick={() => setIsLoggedIn(false)} className="lifeline" style={{ padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <LogOut size={18} /> خروج
                    </button>
                </div>
            </nav>

            <div className="responsive-grid" style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '25px', maxWidth: '1400px', margin: '0 auto' }}>

                {/* Right Column: Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* Quick Stats Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px' }}>
                        <div className="glass-morphism" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ color: 'var(--accent)', fontSize: '0.9rem', marginBottom: '5px' }}>إجمالي الأسئلة</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>{questions.length}</div>
                        </div>
                        <div className="glass-morphism" style={{ padding: '20px', textAlign: 'center' }}>
                            <div style={{ color: 'var(--secondary)', fontSize: '0.9rem', marginBottom: '5px' }}>أعلى مستوى</div>
                            <div style={{ fontSize: '2rem', fontWeight: 'bold' }}>15</div>
                        </div>
                    </div>

                    {/* Import Questions */}
                    <section className="glass-morphism" style={{ padding: '25px' }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} className="gold-text">
                            <Upload size={20} /> استيراد من Excel
                        </h2>
                        <div className="file-input-wrapper" style={{ position: 'relative' }}>
                            <input
                                type="file"
                                accept=".xlsx, .xls"
                                onChange={handleFileUpload}
                                style={{
                                    width: '100%', padding: '30px',
                                    border: '2px dashed rgba(255,255,255,0.1)',
                                    borderRadius: '12px', textAlign: 'center',
                                    background: 'rgba(255,255,255,0.02)',
                                    cursor: 'pointer'
                                }}
                            />
                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', pointerEvents: 'none', opacity: 0.6 }}>
                                اسحب ملف Excel هنا أو انقر للإضافة
                            </div>
                        </div>
                    </section>

                    {/* Manual Question Form */}
                    <section className="glass-morphism" style={{ padding: '25px' }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} className="gold-text">
                            <PlusCircle size={20} /> إضافة سؤال يدوياً
                        </h2>
                        <form onSubmit={handleAddQuestion} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--accent)', fontSize: '0.9rem' }}>نص السؤال</label>
                                <textarea
                                    rows="2"
                                    style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }}
                                    value={newQuestion.question}
                                    onChange={e => setNewQuestion({ ...newQuestion, question: e.target.value })}
                                    required
                                />
                            </div>
                            {newQuestion.options.map((opt, i) => (
                                <div key={i}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>الخيار {['أ', 'ب', 'ج', 'د'][i]}</label>
                                    <input
                                        type="text"
                                        style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                                        value={opt}
                                        onChange={e => {
                                            const newOpts = [...newQuestion.options];
                                            newOpts[i] = e.target.value;
                                            setNewQuestion({ ...newQuestion, options: newOpts });
                                        }}
                                        required
                                    />
                                </div>
                            ))}
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', color: 'var(--secondary)', fontSize: '0.9rem' }}>الإجابة الصحيحة</label>
                                <select
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                                    value={newQuestion.answer}
                                    onChange={e => setNewQuestion({ ...newQuestion, answer: e.target.value })}
                                    required
                                >
                                    <option value="" style={{ background: 'var(--background)' }}>اختر الإجابة</option>
                                    {newQuestion.options.map((opt, i) => opt && <option key={i} value={opt} style={{ background: 'var(--background)' }}>{opt}</option>)}
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontSize: '0.9rem' }}>مستوى الصعوبة (1-15)</label>
                                <input
                                    type="number" min="1" max="15"
                                    style={{ width: '100%', padding: '10px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', borderRadius: '8px' }}
                                    value={newQuestion.difficulty}
                                    onChange={e => setNewQuestion({ ...newQuestion, difficulty: parseInt(e.target.value) })}
                                />
                            </div>
                            <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '12px', marginTop: '10px' }}>
                                <CheckCircle2 size={18} style={{ marginLeft: '8px' }} /> حفظ السؤال في النظام
                            </button>
                        </form>
                    </section>
                </div>

                {/* Left Column: List & Stats */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>

                    {/* Distribution Stats */}
                    <section className="glass-morphism" style={{ padding: '25px' }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} className="gold-text">
                            <BarChart3 size={20} /> توزيع الأسئلة عبر المستويات
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '300px', overflowY: 'auto', paddingLeft: '10px' }}>
                            {Array.from({ length: 15 }, (_, i) => i + 1).map(lvl => (
                                <div key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                    <span style={{ width: '70px', fontSize: '0.85rem' }}>مستوى {lvl}</span>
                                    <div style={{ flex: 1, height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${Math.min((stats.byDifficulty[lvl] || 0) * 10, 100)}%` }}
                                            style={{ height: '100%', background: 'var(--blue-gradient)' }}
                                        />
                                    </div>
                                    <span style={{ width: '30px', textAlign: 'left', fontWeight: 'bold' }}>{stats.byDifficulty[lvl] || 0}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Question List */}
                    <section className="glass-morphism" style={{ padding: '25px', flex: 1 }}>
                        <h2 style={{ fontSize: '1.1rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }} className="gold-text">
                            <Database size={20} /> قاعدة البيانات الحالية
                        </h2>
                        <div style={{ maxHeight: '500px', overflowY: 'auto', borderRadius: '10px' }}>
                            <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 8px' }}>
                                <thead>
                                    <tr style={{ color: 'var(--accent)', fontSize: '0.9rem' }}>
                                        <th style={{ padding: '10px', textAlign: 'right' }}>السؤال</th>
                                        <th style={{ padding: '10px', textAlign: 'right' }}>الإجابة</th>
                                        <th style={{ padding: '10px', width: '50px' }}></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <AnimatePresence>
                                        {questions.map((q, idx) => (
                                            <motion.tr
                                                layout
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                key={q.id}
                                                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}
                                            >
                                                <td style={{ padding: '15px', borderRadius: '10px 0 0 10px', fontSize: '0.9rem' }}>{q.question}</td>
                                                <td style={{ padding: '15px', color: 'var(--secondary)', fontSize: '0.9rem' }}>{q.answer}</td>
                                                <td style={{ padding: '15px', borderRadius: '0 10px 10px 0' }}>
                                                    <Trash2
                                                        size={18}
                                                        style={{ cursor: 'pointer', color: '#ff4d4d', opacity: 0.7 }}
                                                        onClick={() => deleteQuestion(q.id)}
                                                    />
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default Admin;

