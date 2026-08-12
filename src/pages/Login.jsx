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
      setError('الباسورد غلط يا حبيبتي، ركزي شوية ❤️');
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.8 }}
      className="glass-panel"
      style={{ padding: '40px', maxWidth: '400px', width: '90%', textAlign: 'center' }}
    >
      <h1 style={{ color: 'var(--gold)', marginBottom: '10px', fontSize: '2.5rem' }}>✨ عيد ميلاد سعيد ✨</h1>
      <h2 style={{ fontSize: '1.5rem', marginBottom: '20px' }}>لحبيبة قلبي ❤️</h2>
      <p style={{ marginBottom: '30px', color: '#ccc' }}>تخيلي دخلتي ورايحة تشوفي حاجات حلوة جداً... بس الأول الباسورد 😉</p>
      
      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="الباسورد..."
          className="glass-input"
          style={{ width: '100%', fontSize: '1.2rem', textAlign: 'center' }}
        />
        {error && <p style={{ color: '#ff6b6b', fontSize: '0.9rem' }}>{error}</p>}
        <button type="submit" className="glass-button" style={{ fontSize: '1.2rem' }}>
          ادخلي 💕
        </button>
      </form>
    </motion.div>
  );
};

export default Login;
