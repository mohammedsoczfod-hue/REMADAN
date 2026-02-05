import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Trophy, RefreshCcw, Home as HomeIcon, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Results = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { score, win } = location.state || { score: "0", win: false };

    return (
        <div style={{
            flex: 1,
            background: 'var(--emerald-gradient)',
            color: 'var(--text)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '20px',
            minHeight: '100vh'
        }}>
            <motion.div
                className="premium-card"
                style={{ padding: '50px', textAlign: 'center', maxWidth: '500px', width: '90%', background: 'rgba(255,255,255,0.05)' }}
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
            >
                <Trophy size={80} color="#d4af37" style={{ marginBottom: '20px' }} />
                <h1 style={{ marginBottom: '10px' }}>{win ? 'يا له من إنجاز!' : 'حظاً موفقاً'}</h1>
                <p style={{ fontSize: '1.2rem', marginBottom: '30px' }}>
                    لقد ربحت: <span className="gold-text" style={{ fontSize: '2rem' }}>{score} ريال</span>
                </p>

                <div style={{ display: 'grid', gap: '15px' }}>
                    <button className="btn-primary" onClick={() => navigate('/quiz')}>
                        <RefreshCcw size={20} style={{ marginLeft: '10px' }} />
                        محاولة مرة أخرى
                    </button>
                    <button className="btn-secondary" onClick={() => navigate('/')} style={{ color: '#fff', borderColor: '#fff' }}>
                        <HomeIcon size={20} style={{ marginLeft: '10px' }} />
                        العودة للرئيسية
                    </button>
                    <button className="btn-secondary" style={{ color: '#fff', borderColor: '#fff' }}>
                        <Share2 size={20} style={{ marginLeft: '10px' }} />
                        مشاركة النتيجة
                    </button>
                </div>
            </motion.div>
        </div>
    );
};

export default Results;
