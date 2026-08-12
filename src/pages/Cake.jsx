import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import { useNavigate } from 'react-router-dom';

/* ─── Mini Calendar Component ─── */
const BirthdayCalendar = () => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.4 }}
    style={{
      background: 'rgba(255,255,255,0.08)',
      border: '1px solid rgba(212,175,55,0.4)',
      borderRadius: '16px',
      padding: '18px 28px',
      textAlign: 'center',
      marginTop: '28px',
      backdropFilter: 'blur(10px)'
    }}
  >
    {/* Month header */}
    <div style={{ color: '#d4af37', fontWeight: 700, fontSize: '1rem', marginBottom: '10px', letterSpacing: '2px' }}>
      أغسطس 🌙
    </div>

    {/* Days row */}
    <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', flexWrap: 'wrap' }}>
      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
        <div
          key={day}
          style={{
            width: '34px',
            height: '34px',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: day === 16 ? '1rem' : '0.8rem',
            fontWeight: day === 16 ? 700 : 400,
            background: day === 16
              ? 'linear-gradient(135deg, #c0392b, #e74c3c)'
              : 'transparent',
            color: day === 16 ? '#fff' : 'rgba(255,255,255,0.5)',
            border: day === 16 ? '2px solid #ff6b6b' : '1px solid transparent',
            boxShadow: day === 16 ? '0 0 12px rgba(231,76,60,0.6)' : 'none',
            position: 'relative',
            cursor: 'default'
          }}
        >
          {day}
          {day === 16 && (
            <motion.span
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
              style={{
                position: 'absolute',
                top: '-10px',
                right: '-8px',
                fontSize: '0.75rem'
              }}
            >
              ❤️
            </motion.span>
          )}
        </div>
      ))}
    </div>

    <motion.p
      animate={{ opacity: [0.7, 1, 0.7] }}
      transition={{ duration: 2, repeat: Infinity }}
      style={{ marginTop: '14px', color: '#d4af37', fontWeight: 600, fontSize: '1rem' }}
    >
      تالت سنة وبقيت العمر مع بعض يا حبيبتي 💕
    </motion.p>
  </motion.div>
);

/* ─── Main Cake Page ─── */
const Cake = () => {
  const [blown, setBlown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleBlowCandle = () => {
    if (blown) return;
    setBlown(true);

    const duration = 4000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({ particleCount: 6, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#800020', '#d4af37', '#ff69b4', '#fff'] });
      confetti({ particleCount: 6, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#800020', '#d4af37', '#ff69b4', '#fff'] });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();

    setTimeout(() => setShowPopup(true), 1200);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        maxWidth: '600px',
        padding: '20px 16px',
        textAlign: 'center',
        overflowY: 'auto'
      }}
    >
      <motion.h2
        animate={{ textShadow: ['0 0 8px #d4af37', '0 0 20px #d4af37', '0 0 8px #d4af37'] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ color: '#d4af37', fontSize: 'clamp(1.4rem, 5vw, 2.2rem)', marginBottom: '24px' }}
      >
        🎂 طفي الشمعة يا ندانيدو 🎂
      </motion.h2>

      {/* ─── Cake SVG-style CSS ─── */}
      <motion.div
        onClick={handleBlowCandle}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.96 }}
        style={{ cursor: 'pointer', position: 'relative', width: '220px', height: '230px', margin: '0 auto' }}
      >
        {/* Flame */}
        {!blown && (
          <motion.div
            animate={{ scaleY: [1, 1.15, 0.92, 1.08, 1], scaleX: [1, 0.9, 1.1, 0.95, 1], x: [0, 2, -2, 1, 0] }}
            transition={{ duration: 0.6, repeat: Infinity }}
            style={{
              position: 'absolute',
              top: '4px',
              left: '50%',
              transform: 'translateX(-50%)',
              width: '18px',
              height: '30px',
              background: 'radial-gradient(ellipse at bottom, #ffeb3b 0%, #ff9800 60%, transparent 100%)',
              borderRadius: '50% 50% 40% 40%',
              filter: 'drop-shadow(0 0 8px #ff9800) drop-shadow(0 0 18px #ff6b35)',
              zIndex: 5
            }}
          />
        )}
        {/* Smoke after blown */}
        {blown && (
          <motion.div
            initial={{ opacity: 0.8, y: 0 }}
            animate={{ opacity: 0, y: -30 }}
            transition={{ duration: 1.5 }}
            style={{
              position: 'absolute',
              top: '0px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '1.5rem',
              zIndex: 5
            }}
          >
            💨
          </motion.div>
        )}

        {/* Candle */}
        <div style={{
          position: 'absolute',
          top: '34px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '14px',
          height: '46px',
          background: 'repeating-linear-gradient(180deg, #fff 0px, #fff 6px, #d4af37 6px, #d4af37 12px)',
          borderRadius: '3px',
          zIndex: 4
        }} />

        {/* Layer 3 top */}
        <div style={{
          position: 'absolute',
          bottom: '120px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '130px',
          height: '58px',
          background: 'linear-gradient(135deg, #ffb3c6, #ff8fab)',
          borderRadius: '10px',
          boxShadow: '0 6px 20px rgba(255,100,150,0.4)',
          zIndex: 3
        }} />

        {/* Layer 2 middle */}
        <div style={{
          position: 'absolute',
          bottom: '62px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '175px',
          height: '58px',
          background: 'linear-gradient(135deg, #ff8fab, #fb6f92)',
          borderRadius: '10px',
          boxShadow: '0 6px 20px rgba(255,80,120,0.4)',
          zIndex: 2
        }} />

        {/* Layer 1 bottom */}
        <div style={{
          position: 'absolute',
          bottom: '0px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '220px',
          height: '62px',
          background: 'linear-gradient(135deg, #e74c3c, #c0392b)',
          borderRadius: '12px',
          boxShadow: '0 8px 25px rgba(200,50,50,0.5)',
          zIndex: 1
        }} />
      </motion.div>

      {!blown && (
        <motion.p
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ color: 'rgba(255,255,255,0.7)', marginTop: '16px', fontSize: '0.95rem' }}
        >
          اضغطي على التورتة عشان تطفي الشمعة 🌬️
        </motion.p>
      )}

      {/* ─── Birthday Calendar ─── */}
      <BirthdayCalendar />

      {/* ─── Full-screen Popup ─── */}
      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.85)',
              zIndex: 9000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '16px',
              overflowY: 'auto'
            }}
            onClick={() => setShowPopup(false)}
          >
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', damping: 16 }}
              onClick={e => e.stopPropagation()}
              style={{
                background: 'linear-gradient(135deg, rgba(128,0,32,0.97), rgba(94,25,20,0.97))',
                border: '2px solid #d4af37',
                borderRadius: '24px',
                padding: '32px 24px',
                maxWidth: '480px',
                width: '100%',
                textAlign: 'center',
                position: 'relative',
                boxShadow: '0 20px 60px rgba(0,0,0,0.6)'
              }}
            >
              {/* Close */}
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  color: '#fff',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >✕</button>

              <motion.h1
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                style={{ color: '#d4af37', fontSize: 'clamp(1.4rem, 5vw, 2rem)', marginBottom: '18px' }}
              >
                كل سنة وانتي أحلى ندانيدو ❤️
              </motion.h1>

              <div style={{
                width: '100%',
                height: '220px',
                borderRadius: '16px',
                overflow: 'hidden',
                marginBottom: '18px',
                border: '3px solid #d4af37'
              }}>
                <img
                  src="/assets/IMG-20250709-WA0062.jpg"
                  alt="ندانيدو"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>

              <p style={{ fontSize: '1.05rem', lineHeight: 1.8, color: 'rgba(255,255,255,0.9)', marginBottom: '22px' }}>
                من يوم ما دخلتي حياتي يا ندانيدو وكل حاجة بقت أحلى بيكي. ربنا يخليكي ليا وما يحرمني منك أبداً. عيد ميلاد سعيد يا روحي، وإن شاء الله كل سنيننا الجاية نبقى مع بعض ودايماً مبسوطين. بحبك أوي! 💕
              </p>

              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/questions')}
                style={{
                  width: '100%',
                  padding: '14px',
                  background: 'linear-gradient(45deg, #d4af37, #f1c40f)',
                  border: 'none',
                  borderRadius: '30px',
                  color: '#1a0006',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontFamily: 'Cairo, sans-serif'
                }}
              >
                يلا نجاوب على شوية أسئلة 😉
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default Cake;
