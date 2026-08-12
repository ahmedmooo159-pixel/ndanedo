import React, { useRef, useState, useEffect } from 'react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = 0.45;

    const startOnInteraction = () => {
      if (started) return;
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setStarted(true);
        })
        .catch(() => {});
    };

    // Try immediate autoplay first
    audioRef.current.play()
      .then(() => { setIsPlaying(true); setStarted(true); })
      .catch(() => {
        // Fallback: play on any first user interaction
        document.addEventListener('click', startOnInteraction, { once: true });
        document.addEventListener('touchstart', startOnInteraction, { once: true });
        document.addEventListener('keydown', startOnInteraction, { once: true });
      });

    return () => {
      document.removeEventListener('click', startOnInteraction);
      document.removeEventListener('touchstart', startOnInteraction);
      document.removeEventListener('keydown', startOnInteraction);
    };
  }, []);

  const togglePlay = (e) => {
    e.stopPropagation();
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 9999 }}>
      <audio ref={audioRef} loop src="/assets/romantic_music.mp3" />
      <button
        onClick={togglePlay}
        style={{
          width: '50px',
          height: '50px',
          borderRadius: '50%',
          background: isPlaying
            ? 'linear-gradient(45deg, #800020, #d4af37)'
            : 'rgba(255,255,255,0.1)',
          border: '2px solid #d4af37',
          color: '#d4af37',
          fontSize: '1.4rem',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isPlaying ? '0 0 15px rgba(212,175,55,0.5)' : 'none',
          transition: 'all 0.3s ease',
          backdropFilter: 'blur(10px)'
        }}
        title={isPlaying ? 'إيقاف الموسيقى' : 'تشغيل الموسيقى'}
      >
        {isPlaying ? '🎵' : '🎶'}
      </button>
    </div>
  );
};

export default BackgroundMusic;
