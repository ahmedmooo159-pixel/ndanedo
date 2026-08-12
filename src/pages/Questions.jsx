import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const questions = [
  { id: 1, question: "  إيه أحلى لحظة قضيتيها معايا؟" },
  { id: 2, question: "ايه لسه محققنهوش عايزه نحقهه مع بعض؟" },
  { id: 3, question: "قولي رساله نفتكرها في عيد ميلادك ال جاي " },
];

const Questions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleNext = async () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitting(true);
      try {
        // Fallback or skip saving if config is invalid
        if(db.type !== "firestore") {
          const answersCollection = collection(db, 'answers');
          await addDoc(answersCollection, {
            answers,
            timestamp: serverTimestamp()
          });
        }
      } catch (err) {
        console.error("Error saving to Firebase:", err);
      } finally {
        setIsSubmitting(false);
        navigate('/gallery');
      }
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="glass-panel"
      style={{ padding: '40px', maxWidth: '500px', width: '90%' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '10px' }}>أسئلة من القلب 💖</h2>
        <p style={{ color: '#ccc' }}>جاوبي بصراحة يا روحي</p>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '30px' }}
      >
        <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', lineHeight: '1.5' }}>
          {questions[currentIndex].question}
        </h3>
        <textarea
          value={answers[questions[currentIndex].id] || ''}
          onChange={(e) => setAnswers({...answers, [questions[currentIndex].id]: e.target.value})}
          placeholder="اكتبي اجابتك هنا..."
          className="glass-input"
          style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
        />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--gold)' }}>
          {currentIndex + 1} / {questions.length}
        </span>
        <button 
          onClick={handleNext} 
          disabled={isSubmitting}
          className="glass-button"
        >
          {isSubmitting ? 'بحفظ كلامك...' : (currentIndex === questions.length - 1 ? 'خلصت يا حبيبي ❤️' : 'السؤال اللي بعده ✨')}
        </button>
      </div>
    </motion.div>
  );
};

export default Questions;
