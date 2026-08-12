import React, { useRef, useState, useEffect } from 'react';
import { Music, Music2 } from 'lucide-react';

const BackgroundMusic = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const playAudio = () => {
      if (audioRef.current && !isPlaying) {
        audioRef.current.volume = 0.5;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.then(() => {
            setIsPlaying(true);
            // Remove listeners once it plays
            document.removeEventListener('click', playAudio);
            document.removeEventListener('keydown', playAudio);
          }).catch(err => {
            console.log("Autoplay prevented:", err);
          });
        }
      }
    };

    // Try playing immediately
    playAudio();

    // Also attach listeners for first interaction
    document.addEventListener('click', playAudio);
    document.addEventListener('keydown', playAudio);

    return () => {
      document.removeEventListener('click', playAudio);
      document.removeEventListener('keydown', playAudio);
    };
  }, [isPlaying]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ position: 'fixed', bottom: '20px', left: '20px', zIndex: 100 }}>
      <audio ref={audioRef} loop>
        <source src="/assets/romantic_music.mp3" type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <button 
        onClick={togglePlay}
        className="glass-button"
        style={{ width: '50px', height: '50px', padding: '0', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%' }}
      >
        {isPlaying ? <Music size={24} /> : <Music2 size={24} color="#666" />}
      </button>
    </div>
  );
};

export default BackgroundMusic;
