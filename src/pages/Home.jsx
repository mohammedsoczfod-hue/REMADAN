import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Play, ClipboardList, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const Home = () => {
    const navigate = useNavigate();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div style={{
            textAlign: 'center',
            padding: '40px 20px',
            flex: 1,
            background: 'var(--emerald-gradient)',
            color: 'var(--text)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Decorative BG Elements */}
            <motion.div
                style={{ position: 'absolute', top: '10%', right: '10%', opacity: 0.2 }}
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
            >
                <div style={{ fontSize: '3rem' }}>🌙</div>
            </motion.div>
            <motion.div
                style={{ position: 'absolute', bottom: '15%', left: '10%', opacity: 0.2 }}
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            >
                <div style={{ fontSize: '2rem' }}>⭐</div>
            </motion.div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                style={{ zIndex: 1, width: '100%', maxWidth: '600px' }}
            >
                <motion.div variants={itemVariants}>
                    <img src="/logo.png" alt="Logo" style={{ width: 'clamp(120px, 30vw, 180px)', marginBottom: '20px', filter: 'drop-shadow(0 4px 15px rgba(0,0,0,0.5))' }} />
                    <h1 style={{ marginBottom: '5px', fontWeight: '900' }} className="modern-title">
                        المسابقة الرمضانية
                    </h1>
                    <h2 className="gold-text" style={{ fontSize: 'var(--h2-size)', marginBottom: 'clamp(20px, 5vw, 50px)' }}>
                        تجمع شباب شط العرب
                    </h2>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    className="glass-morphism"
                    style={{ padding: 'var(--section-padding)', background: 'rgba(255,255,255,0.02)' }}
                >
                    <div style={{ display: 'grid', gap: '25px' }}>
                        <motion.button
                            className="btn-primary pulse-animation"
                            onClick={() => navigate('/quiz')}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            style={{ fontSize: '1.2rem' }}
                        >
                            <Play size={24} style={{ marginLeft: '12px', verticalAlign: 'middle' }} />
                            ابدأ المسابقة الآن
                        </motion.button>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '15px' }}>
                            <button className="btn-secondary" onClick={() => navigate('/results')}>
                                <Users size={18} style={{ marginLeft: '8px' }} />
                                السجل
                            </button>
                            <button className="btn-secondary" onClick={() => navigate('/admin')}>
                                <ClipboardList size={18} style={{ marginLeft: '8px' }} />
                                الإدارة
                            </button>
                        </div>
                    </div>
                </motion.div>

                <motion.div
                    variants={itemVariants}
                    style={{ marginTop: '60px', fontSize: '1.1rem', opacity: 0.8, fontStyle: 'italic' }}
                >
                    رمضان كريم وكل عام وأنتم بخير
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Home;
