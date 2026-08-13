import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

const initialQuestions = [
  "إيه أحلى لحظة قضيتيها معايا؟",
  "إيه أكتر حاجة بتحبيها فيا؟",
  "امتى حسيتي إنك بتحبيني بجد؟",
  "نفسك نسافر فين مع بعض؟",
  "إيه أكتر موقف ضحكنا فيه سوا؟"
];

const Questions = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [savedQAs, setSavedQAs] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // For adding new Q&A manually
  const [showAddForm, setShowAddForm] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Listen to all saved Q&As
    const q = query(collection(db, 'answers'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setSavedQAs(fetchedItems);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const handleNext = async () => {
    if (currentIndex < initialQuestions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setIsSubmitting(true);
      try {
        // Save all answers as individual documents
        const answersRef = collection(db, 'answers');
        for (let i = 0; i < initialQuestions.length; i++) {
          const q = initialQuestions[i];
          const a = answers[i] || "لا توجد إجابة";
          await addDoc(answersRef, {
            question: q,
            answer: a,
            createdAt: serverTimestamp()
          });
        }
      } catch (err) {
        console.error("Error saving to Firebase:", err);
        alert("تأكدي من تفعيل Firestore في وضع Test Mode!");
      } finally {
        setIsSubmitting(false);
        // It will automatically switch to the dashboard view because savedQAs will update
      }
    }
  };

  const handleAddNewQA = async (e) => {
    e.preventDefault();
    if(!newQuestion.trim() || !newAnswer.trim()) return;
    setIsAdding(true);
    try {
      await addDoc(collection(db, 'answers'), {
        question: newQuestion,
        answer: newAnswer,
        createdAt: serverTimestamp()
      });
      setNewQuestion('');
      setNewAnswer('');
      setShowAddForm(false);
    } catch (err) {
      console.error("Error adding Q&A:", err);
      alert("خطأ أثناء الحفظ.");
    } finally {
      setIsAdding(false);
    }
  };

  if (loading) {
    return (
      <div style={{ color: '#d4af37', fontSize: '1.2rem', textAlign: 'center', marginTop: '50px' }}>
        جاري تحميل الذكريات... ⏳
      </div>
    );
  }

  // If there are already answers, show the Q&A Dashboard!
  if (savedQAs.length > 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel"
        style={{ padding: '30px 20px', maxWidth: '600px', width: '90%', margin: '40px auto' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '10px' }}>أسئلتنا الحلوة 💖</h2>
          <p style={{ color: '#ccc' }}>هنا كل الكلام اللي طالع من القلب</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
          {savedQAs.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(212,175,55,0.3)',
                borderRadius: '16px',
                padding: '20px',
                position: 'relative'
              }}
            >
              <div style={{ color: 'var(--gold)', fontWeight: 'bold', fontSize: '1.1rem', marginBottom: '10px' }}>
                <span style={{ fontSize: '1.3rem', marginRight: '8px' }}>💬</span>
                {item.question}
              </div>
              <div style={{ color: '#fff', fontSize: '1rem', lineHeight: '1.6', paddingRight: '35px' }}>
                {item.answer}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Add new Q&A Section */}
        <AnimatePresence>
          {showAddForm ? (
            <motion.form 
              onSubmit={handleAddNewQA}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column', gap: '15px' }}
            >
              <h3 style={{ color: 'var(--gold)', fontSize: '1.2rem', margin: 0 }}>سؤال جديد لينا ✨</h3>
              <input
                type="text"
                placeholder="اكتبي السؤال هنا..."
                value={newQuestion}
                onChange={e => setNewQuestion(e.target.value)}
                required
                className="glass-input"
              />
              <textarea
                placeholder="اكتبي الإجابة هنا..."
                value={newAnswer}
                onChange={e => setNewAnswer(e.target.value)}
                required
                className="glass-input"
                style={{ minHeight: '100px', resize: 'vertical' }}
              />
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={isAdding} className="glass-button" style={{ flex: 1 }}>
                  {isAdding ? 'بحفظ...' : 'حفظ 💖'}
                </button>
                <button type="button" onClick={() => setShowAddForm(false)} className="glass-button" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  إلغاء
                </button>
              </div>
            </motion.form>
          ) : (
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowAddForm(true)}
              className="glass-button"
              style={{ width: '100%', marginBottom: '15px', background: 'linear-gradient(45deg, var(--burgundy), var(--gold))' }}
            >
              ➕ ضيفي سؤال وإجابة جديدة
            </motion.button>
          )}
        </AnimatePresence>

        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate('/gallery')}
          className="glass-button"
          style={{ width: '100%', marginTop: '10px', background: 'transparent', border: '1px solid var(--gold)' }}
        >
          يلا نروح المعرض 📸
        </motion.button>

      </motion.div>
    );
  }

  // Quiz View (Only if no answers exist yet)
  return (
    <motion.div 
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.6 }}
      className="glass-panel"
      style={{ padding: '40px', maxWidth: '500px', width: '90%', margin: '40px auto' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ color: 'var(--gold)', fontSize: '2rem', marginBottom: '10px' }}>أسئلة من القلب 💖</h2>
        <p style={{ color: '#ccc' }}>أول وآخر مرة هتتسألي الأسئلة دي، جاوبي بصراحة!</p>
      </div>

      <motion.div 
        key={currentIndex}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        style={{ marginBottom: '30px' }}
      >
        <h3 style={{ fontSize: '1.3rem', marginBottom: '20px', lineHeight: '1.5', color: '#fff' }}>
          {initialQuestions[currentIndex]}
        </h3>
        <textarea
          value={answers[currentIndex] || ''}
          onChange={(e) => setAnswers({...answers, [currentIndex]: e.target.value})}
          placeholder="اكتبي اجابتك هنا..."
          className="glass-input"
          style={{ width: '100%', minHeight: '120px', resize: 'vertical' }}
        />
      </motion.div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ color: 'var(--gold)', fontWeight: 'bold' }}>
          {currentIndex + 1} / {initialQuestions.length}
        </span>
        <button 
          onClick={handleNext} 
          disabled={isSubmitting}
          className="glass-button"
          style={{ minWidth: '150px' }}
        >
          {isSubmitting ? 'بحفظ كلامك...' : (currentIndex === initialQuestions.length - 1 ? 'خلصت يا حبيبي ❤️' : 'السؤال اللي بعده ✨')}
        </button>
      </div>
    </motion.div>
  );
};

export default Questions;
