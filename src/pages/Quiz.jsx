import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Timer, Users, Phone, Trash2, HelpCircle } from 'lucide-react';
import * as XLSX from 'xlsx';
import defaultQuestions from '../data/questions.json';

const Quiz = () => {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameState, setGameState] = useState('loading'); // loading, playing, won, lost
    const [score, setScore] = useState(0);
    const [lifelines, setLifelines] = useState({
        fiftyFifty: true,
        callFriend: true,
        audience: true,
        scientist: true
    });
    const [removedOptions, setRemovedOptions] = useState([]);

    const levels = [
        "100", "200", "300", "500", "1,000",
        "2,000", "4,000", "8,000", "16,000", "32,000",
        "64,000", "125,000", "250,000", "500,000", "1,000,000"
    ];

    useEffect(() => {
        const loadQuestions = () => {
            try {
                const cached = localStorage.getItem('cached_questions');
                let allQuestions = [];

                if (cached) {
                    allQuestions = JSON.parse(cached);
                } else {
                    allQuestions = defaultQuestions;
                }

                if (allQuestions.length === 0) {
                    alert("لا توجد أسئلة حالياً. يرجى مراجعة لوحة التحكم.");
                    navigate('/admin');
                    return;
                }

                // Sort or filter by difficulty to ensure 15 levels
                const gameQuestions = [];
                for (let i = 1; i <= 15; i++) {
                    const levelQuestions = allQuestions.filter(q => parseInt(q.difficulty) === i);
                    if (levelQuestions.length > 0) {
                        const randomQ = { ...levelQuestions[Math.floor(Math.random() * levelQuestions.length)] };
                        // Shuffle options using a random sort
                        randomQ.options = [...randomQ.options].sort(() => Math.random() - 0.5);
                        gameQuestions.push(randomQ);
                    } else {
                        // Fill with random if missing specific level
                        const randomQ = { ...allQuestions[Math.floor(Math.random() * allQuestions.length)] };
                        randomQ.options = [...randomQ.options].sort(() => Math.random() - 0.5);
                        gameQuestions.push(randomQ);
                    }
                }

                setQuestions(gameQuestions);
                setGameState('playing');
            } catch (e) {
                console.error("Failed to load questions", e);
            }
        };
        loadQuestions();
    }, []);

    useEffect(() => {
        if (gameState === 'playing' && timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleGameOver(false);
        }
    }, [timeLeft, gameState]);

    const handleAnswer = (option) => {
        const currentQuestion = questions[currentIndex];
        if (option === currentQuestion.answer) {
            if (currentIndex === 14) {
                setGameState('won');
            } else {
                setCurrentIndex(currentIndex + 1);
                setTimeLeft(30);
                setRemovedOptions([]);
            }
        } else {
            handleGameOver(false);
        }
    };

    const handleGameOver = (win) => {
        setGameState(win ? 'won' : 'lost');
        setTimeout(() => {
            navigate('/results', { state: { score: levels[currentIndex - 1] || "0", win } });
        }, 2000);
    };

    const useLifeline = (type) => {
        if (!lifelines[type]) return;

        const currentQuestion = questions[currentIndex];
        const correctAnswer = currentQuestion.answer;

        if (type === 'fiftyFifty') {
            const wrongOptions = currentQuestion.options.filter(o => o !== correctAnswer);
            const shuffled = wrongOptions.sort(() => 0.5 - Math.random());
            setRemovedOptions([shuffled[0], shuffled[1]]);
        } else if (type === 'callFriend') {
            alert(`صديقك يقول: أعتقد أن الإجابة هي "${correctAnswer}"`);
        } else if (type === 'audience') {
            alert(`الجمهور يصوت بنسبة 70% للخيار المحتمل وهو "${correctAnswer}"`);
        } else if (type === 'scientist') {
            alert(`العالم يقول: البحث التاريخي يشير إلى أن "${correctAnswer}" هي الإجابة الأرجح.`);
        }

        setLifelines({ ...lifelines, [type]: false });
    };

    if (gameState === 'loading') return <div style={{ color: '#fff', textAlign: 'center', marginTop: '100px' }}>جاري التحميل...</div>;

    const currentQuestion = questions[currentIndex] || questions[0];

    return (
        <div className="quiz-container" style={{
            flex: 1,
            background: 'var(--emerald-gradient)',
            color: 'var(--text)',
            display: 'flex',
            flexDirection: 'column',
            padding: '20px',
            gap: '20px',
            overflowY: 'auto'
        }}>
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '20px',
                width: '100%',
                maxWidth: '1200px',
                margin: '0 auto'
            }} className="responsive-quiz-grid">

                {/* Quiz Area */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
                    {/* Header: Timer and Lifelines */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                            <img src="/logo.png" alt="Logo" style={{ width: '50px' }} onClick={() => navigate('/')} />
                            <div style={{ display: 'flex', gap: '15px' }}>
                                <button className={`lifeline ${!lifelines.fiftyFifty ? 'used' : ''}`} onClick={() => useLifeline('fiftyFifty')}>50:50</button>
                                <button className={`lifeline ${!lifelines.callFriend ? 'used' : ''}`} onClick={() => useLifeline('callFriend')}><Phone size={20} /></button>
                                <button className={`lifeline ${!lifelines.audience ? 'used' : ''}`} onClick={() => useLifeline('audience')}><Users size={20} /></button>
                                <button className={`lifeline ${!lifelines.scientist ? 'used' : ''}`} onClick={() => useLifeline('scientist')}><HelpCircle size={20} /></button>
                            </div>
                        </div>
                        <div style={{
                            width: 'clamp(60px, 15vw, 80px)', height: 'clamp(60px, 15vw, 80px)', border: '5px solid var(--secondary)',
                            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 'clamp(1rem, 4vw, 1.5rem)', fontWeight: 'bold'
                        }}>
                            {timeLeft}
                        </div>
                    </div>

                    {/* Question */}
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <motion.div
                            key={currentIndex}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="premium-card"
                            style={{ padding: 'clamp(15px, 4vw, 30px)', background: 'rgba(0,0,0,0.3)', marginBottom: '30px' }}
                        >
                            <h2 style={{ fontSize: 'var(--h2-size)' }}>{currentQuestion.question}</h2>
                        </motion.div>

                        <div className="options-grid">
                            {currentQuestion.options.map((opt, i) => (
                                <motion.button
                                    key={opt}
                                    whileHover={!removedOptions.includes(opt) ? { scale: 1.02 } : {}}
                                    whileTap={!removedOptions.includes(opt) ? { scale: 0.98 } : {}}
                                    onClick={() => handleAnswer(opt)}
                                    disabled={removedOptions.includes(opt)}
                                    style={{
                                        padding: '15px',
                                        borderRadius: '10px',
                                        border: '1px solid var(--secondary)',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: '#fff',
                                        cursor: 'pointer',
                                        visibility: removedOptions.includes(opt) ? 'hidden' : 'visible'
                                    }}
                                >
                                    <span className="gold-text" style={{ marginRight: '10px' }}>{String.fromCharCode(65 + i)}:</span>
                                    {opt}
                                </motion.button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Sidebar: Progress */}
                <div className="premium-card" style={{ background: 'rgba(0,0,0,0.4)', padding: '20px', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ textAlign: 'center', marginBottom: '20px' }} className="gold-text">مستويات الجائزة</h3>
                    <div style={{ display: 'flex', flexDirection: 'column-reverse', flex: 1 }}>
                        {levels.map((lvl, i) => (
                            <div key={lvl} style={{
                                padding: '8px 15px',
                                margin: '2px 0',
                                borderRadius: '5px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                background: i === currentIndex ? 'var(--secondary)' : 'transparent',
                                color: i === currentIndex ? '#004d40' : (i < currentIndex ? 'var(--secondary)' : '#fff'),
                                fontWeight: i === currentIndex ? 'bold' : 'normal',
                                opacity: i > currentIndex && i !== currentIndex ? 0.5 : 1
                            }}>
                                <span>{i + 1}</span>
                                <span>{lvl} ريال</span>
                            </div>
                        ))}
                    </div>
                </div>

                <style>{`
        .quiz-container { min-height: 100vh; }
        @media (min-width: 992px) {
            .responsive-quiz-grid { grid-template-columns: 1fr 300px !important; }
        }
        .options-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        @media (max-width: 600px) {
            .options-grid { grid-template-columns: 1fr; }
            .premium-card h2 { font-size: 1.2rem; }
        }
        .lifeline {
          width: 45px;
          height: 38px;
          border: 1px solid var(--secondary);
          background: rgba(245,158,11,0.1);
          color: var(--secondary);
          border-radius: var(--radius-md);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8rem;
        }
        .lifeline.used {
          opacity: 0.3;
          background: #e5e7eb;
          border-color: #9ca3af;
          cursor: not-allowed;
        }
      `}</style>
            </div>
        </div>
    );
};

export default Quiz;
