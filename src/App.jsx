import React from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Login from './pages/Login';
import Questions from './pages/Questions';
import Gallery from './pages/Gallery';
import Cake from './pages/Cake';
import FloatingHearts from './components/FloatingHearts';
import BackgroundMusic from './components/BackgroundMusic';

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Login />} />
        <Route path="/questions" element={<Questions />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/cake" element={<Cake />} />
      </Routes>
    </AnimatePresence>
  );
}

function App() {
  return (
    <Router>
      <div style={{ position: 'relative', width: '100%', minHeight: '100vh', overflow: 'hidden' }}>
        <FloatingHearts />
        <BackgroundMusic />
        <div style={{
          position: 'relative',
          zIndex: 10,
          width: '100%',
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px',
          boxSizing: 'border-box'
        }}>
          <AnimatedRoutes />
        </div>
      </div>
    </Router>
  );
}

export default App;
