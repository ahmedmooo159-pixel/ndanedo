import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';

import { useNavigate } from 'react-router-dom';

const Cake = () => {
  const [blown, setBlown] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();

  const handleBlowCandle = () => {
    if (!blown) {
      setBlown(true);
      // Trigger confetti
      const duration = 3 * 1000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 5,
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#800020', '#d4af37', '#ff69b4']
        });
        confetti({
          particleCount: 5,
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#800020', '#d4af37', '#ff69b4']
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();

      setTimeout(() => {
        setShowPopup(true);
      }, 1500);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="cake-page-container"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', width: '100%' }}
    >
      <h2 style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '40px', textAlign: 'center' }}>
        🎂 طفي الشمعة يا حبيبتي 🎂
      </h2>

      <div className="cake-container" onClick={handleBlowCandle} style={{ cursor: 'pointer' }}>
        <div className="cake">
          <div className="cake-layer layer-1"></div>
          <div className="cake-layer layer-2"></div>
          <div className="cake-layer layer-3"></div>
          <div className="candle">
            <div className={`flame ${blown ? 'extinguished' : ''}`}></div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showPopup && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-panel"
            style={{
              position: 'fixed',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1000,
              padding: '40px',
              maxWidth: '500px',
              width: '90%',
              textAlign: 'center',
              background: 'rgba(128, 0, 32, 0.9)', // solid burgundy background for popup
              overflowY: 'auto',
              maxHeight: '90vh'
            }}
          >
            <h1 style={{ color: 'var(--gold)', fontSize: '2.5rem', marginBottom: '20px' }}>
              كل سنة وانتي أحلى حاجة في حياتي ❤️
            </h1>
            <div style={{ width: '100%', height: '250px', borderRadius: '15px', overflow: 'hidden', marginBottom: '20px', border: '3px solid var(--gold)' }}>
              <img 
                src="/assets/IMG-20250709-WA0062.jpg" 
                alt="Birthday Girl" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
            <p style={{ fontSize: '1.2rem', lineHeight: '1.6', color: '#fff', marginBottom: '20px' }}>
              من يوم ما دخلتي حياتي وكل حاجة بقت أحلى بيكي. ربنا يخليكي ليا وما يحرمني منك أبداً. عيد ميلاد سعيد يا روحي، وإن شاء الله كل سنيننا الجاية نبقى مع بعض ودايماً مبسوطين. بحبك! 💕
            </p>
            <button 
              onClick={() => navigate('/questions')}
              className="glass-button"
              style={{ width: '100%', fontSize: '1.2rem', background: 'linear-gradient(45deg, #d4af37, #f1c40f)', color: '#000' }}
            >
              يلا نجاوب على شوية أسئلة 😉
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.div>
  );
};

export default Cake;
