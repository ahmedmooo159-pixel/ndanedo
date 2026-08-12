import React, { useEffect, useState } from 'react';

const FloatingHearts = () => {
  const [hearts, setHearts] = useState([]);

  useEffect(() => {
    // Generate some random hearts
    const newHearts = Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      animationDuration: `${Math.random() * 5 + 5}s`,
      animationDelay: `${Math.random() * 5}s`,
      fontSize: `${Math.random() * 1.5 + 1}rem`,
      opacity: Math.random() * 0.5 + 0.3
    }));
    setHearts(newHearts);
  }, []);

  return (
    <div className="hearts-container" style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
      {hearts.map(heart => (
        <div
          key={heart.id}
          className="heart"
          style={{
            position: 'absolute',
            bottom: '-10%',
            left: heart.left,
            fontSize: heart.fontSize,
            color: 'rgba(255, 105, 180, 0.7)',
            opacity: heart.opacity,
            animation: `floatUp ${heart.animationDuration} linear infinite`,
            animationDelay: heart.animationDelay
          }}
        >
          ❤️
        </div>
      ))}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-120vh) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default FloatingHearts;
