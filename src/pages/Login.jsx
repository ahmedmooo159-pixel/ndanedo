import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Login = () => {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '1685') {
      navigate('/cake');
    } else {
      setError('الباسورد غلط يا ندانيدو، ركزي شوية ❤️');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '24px',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
        padding: '40px 30px',
        maxWidth: '420px',
        width: '90vw',
        textAlign: 'center'
      }}
    >
      {/* Animated emoji hearts */}
      <motion.div
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        style={{ fontSize: '3rem', marginBottom: '8px' }}
      >
        💖
      </motion.div>

      <h1 style={{ color: '#d4af37', marginBottom: '6px', fontSize: '2rem', fontWeight: 700 }}>
        ✨ عيد ميلاد سعيد ✨
      </h1>
      <h2 style={{ fontSize: '1.3rem', marginBottom: '8px', color: '#fff' }}>
        لأحلى ندانيدو في الدنيا ❤️
      </h2>
      <p style={{ marginBottom: '28px', color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem' }}>
        تخيلي دخلتي ورايحة تشوفي حاجات حلوة جداً... بس الأول الباسورد 😉
      </p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="الباسورد..."
          style={{
            width: '100%',
            fontSize: '1.3rem',
            textAlign: 'center',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.25)',
            color: '#fff',
            borderRadius: '12px',
            padding: '14px 20px',
            outline: 'none',
            letterSpacing: '4px',
            direction: 'ltr',
            fontFamily: 'Cairo, sans-serif'
          }}
        />
        {error && (
          <p style={{ color: '#ff6b6b', fontSize: '0.9rem', margin: 0 }}>{error}</p>
        )}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          type="submit"
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(135deg, #800020, #d4af37)',
            border: '1px solid #d4af37',
            borderRadius: '30px',
            color: '#fff',
            fontSize: '1.2rem',
            fontWeight: 700,
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          ادخلي 💕
        </motion.button>
      </form>
    </motion.div>
  );
};

export default Login;
