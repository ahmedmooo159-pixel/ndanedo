import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, orderBy, onSnapshot } from 'firebase/firestore';

// ─── Cloudinary config ───
const CLOUD_NAME = "nfzcflqv";
const API_KEY = "443252812965861";
const API_SECRET = "J862RsJelEP049KZ382R2iSot4Y";

const generateSignature = async (timestamp) => {
  const str = `timestamp=${timestamp}${API_SECRET}`;
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// ─── 3D Carousel ───
const Carousel3D = ({ items, currentIndex, setCurrentIndex }) => {
  const total = items.length;
  if (total === 0) return null;

  const getStyle = (i) => {
    const offset = ((i - currentIndex + total) % total);
    const angle = (360 / total) * offset;
    const rad = (angle * Math.PI) / 180;
    const radius = Math.min(280, window.innerWidth * 0.35);
    const x = Math.sin(rad) * radius;
    const scale = 0.5 + 0.5 * ((Math.cos(rad) + 1) / 2);
    const opacity = 0.25 + 0.75 * ((Math.cos(rad) + 1) / 2);
    const isActive = offset === 0;
    return { x, scale, opacity, isActive, zIndex: Math.round(scale * 10) };
  };

  return (
    <div style={{
      position: 'relative',
      width: '100%',
      height: '420px',
      overflow: 'hidden',
      marginBottom: '16px'
    }}>
      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        {items.map((item, i) => {
          const { x, scale, opacity, isActive, zIndex } = getStyle(i);
          return (
            <motion.div
              key={item.id || i}
              onClick={() => setCurrentIndex(i)}
              animate={{ x, scale, opacity }}
              transition={{ type: 'spring', stiffness: 180, damping: 25 }}
              style={{
                position: 'absolute',
                width: isActive ? '280px' : '190px',
                zIndex,
                cursor: 'pointer',
                borderRadius: '18px',
                overflow: 'hidden',
                boxShadow: isActive
                  ? '0 20px 60px rgba(212,175,55,0.4), 0 0 40px rgba(128,0,32,0.3)'
                  : '0 8px 20px rgba(0,0,0,0.4)',
                border: isActive ? '2px solid #d4af37' : '1px solid rgba(255,255,255,0.1)',
                transition: 'width 0.4s ease'
              }}
            >
              <div style={{ width: '100%', height: isActive ? '280px' : '190px', transition: 'height 0.4s ease', background: '#1a0006' }}>
                {item.type === 'video' ? (
                  <video src={item.url} controls={isActive} muted={!isActive} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img src={item.url} alt="ذكرى" loading="lazy" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>

              <AnimatePresence>
                {isActive && item.text && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '14px',
                      background: 'linear-gradient(135deg, rgba(128,0,32,0.95), rgba(94,25,20,0.95))',
                      color: '#fff',
                      textAlign: 'center',
                      fontSize: '0.95rem',
                      lineHeight: 1.6,
                      fontWeight: 600
                    }}
                  >
                    {item.text}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// ─── Upload Form ───
const UploadForm = ({ onUploaded, onCancel }) => {
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;
    setUploading(true);
    setProgress(10);

    try {
      const isVideo = file.type.startsWith('video/');
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await generateSignature(timestamp);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const resourceType = isVideo ? 'video' : 'image';
      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`;

      setProgress(40);
      const response = await fetch(uploadUrl, { method: 'POST', body: formData });
      const data = await response.json();

      if (data.secure_url) {
        setProgress(80);
        // Save metadata to Firestore instead of Cloudinary tags!
        await addDoc(collection(db, 'gallery'), {
          url: data.secure_url,
          text: text,
          type: resourceType,
          createdAt: serverTimestamp()
        });

        setProgress(100);
        onUploaded();
      } else {
        throw new Error(data.error?.message || 'فشل الرفع');
      }
    } catch (err) {
      console.error(err);
      alert('حصلت مشكلة: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <motion.form
      onSubmit={handleUpload}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      style={{
        background: 'rgba(255,255,255,0.08)',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: '16px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        marginBottom: '20px',
        width: '100%',
        backdropFilter: 'blur(10px)'
      }}
    >
      <p style={{ color: '#d4af37', fontWeight: 700, textAlign: 'center', fontSize: '1.1rem' }}>
        ➕ ضيف ذكرى جديدة
      </p>
      <input
        type="file"
        accept="image/*,video/*"
        onChange={e => setFile(e.target.files[0])}
        required
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: '10px',
          padding: '10px',
          width: '100%',
          cursor: 'pointer'
        }}
      />
      <input
        type="text"
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="اكتب الموقف أو الكلام الحلو..."
        required
        style={{
          background: 'rgba(255,255,255,0.05)',
          border: '1px solid rgba(255,255,255,0.2)',
          color: '#fff',
          borderRadius: '10px',
          padding: '12px 16px',
          width: '100%',
          fontFamily: 'Cairo, sans-serif',
          fontSize: '1rem',
          outline: 'none'
        }}
      />
      {uploading && (
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', height: '8px' }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            style={{ height: '100%', background: 'linear-gradient(90deg, #800020, #d4af37)', borderRadius: '10px' }}
          />
        </div>
      )}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          type="submit"
          disabled={uploading}
          style={{
            flex: 1,
            padding: '12px',
            background: uploading ? 'rgba(255,255,255,0.1)' : 'linear-gradient(45deg, #800020, #d4af37)',
            border: '1px solid #d4af37',
            color: uploading ? '#aaa' : '#fff',
            borderRadius: '30px',
            fontWeight: 700,
            cursor: uploading ? 'not-allowed' : 'pointer',
            fontFamily: 'Cairo, sans-serif',
            fontSize: '1rem'
          }}
        >
          {uploading ? `بيترفع... ${progress}%` : 'ارفع ❤️'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            padding: '12px 20px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff',
            borderRadius: '30px',
            cursor: 'pointer',
            fontFamily: 'Cairo, sans-serif'
          }}
        >
          إلغاء
        </button>
      </div>
    </motion.form>
  );
};

// ─── Main Gallery ───
const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  useEffect(() => {
    // Listen to Firestore for realtime updates! No more Cloudinary list restrictions.
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'asc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const fetchedItems = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setItems(fetchedItems);
      setLoading(false);
    }, (error) => {
      console.error("Firestore error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  const prev = () => setCurrentIndex(i => (i - 1 + items.length) % items.length);
  const next = () => setCurrentIndex(i => (i + 1) % items.length);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        width: '100%',
        maxWidth: '760px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 12px 40px'
      }}
    >
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <h2 style={{ color: '#d4af37', fontSize: 'clamp(1.4rem, 5vw, 2rem)', margin: 0 }}>
          ذكرياتنا الحلوة 📸
        </h2>
        <button
          onClick={() => setShowUpload(v => !v)}
          style={{
            background: 'linear-gradient(45deg, #800020, #d4af37)',
            border: '1px solid #d4af37',
            color: '#fff',
            padding: '10px 20px',
            borderRadius: '30px',
            cursor: 'pointer',
            fontWeight: 700,
            fontFamily: 'Cairo, sans-serif',
            fontSize: '0.95rem'
          }}
        >
          ➕ ضيف ذكرى
        </button>
      </div>

      {/* Upload Form */}
      <AnimatePresence>
        {showUpload && (
          <UploadForm
            onUploaded={() => { setShowUpload(false); setCurrentIndex(items.length); }}
            onCancel={() => setShowUpload(false)}
          />
        )}
      </AnimatePresence>

      {/* 3D Carousel */}
      {loading ? (
        <motion.div
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ textAlign: 'center', padding: '60px 20px', color: '#d4af37', fontSize: '1.2rem' }}
        >
          بنجيب أحلى الذكريات... 💕
        </motion.div>
      ) : items.length > 0 ? (
        <>
          <Carousel3D items={items} currentIndex={currentIndex} setCurrentIndex={setCurrentIndex} />

          {/* Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button
              onClick={prev}
              style={{
                background: 'linear-gradient(45deg, #800020, #900020)',
                border: '1px solid #d4af37',
                color: '#d4af37',
                padding: '10px 24px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                fontSize: '1rem'
              }}
            >
              ❮ السابق
            </button>
            <span style={{ color: '#d4af37', fontWeight: 700 }}>
              {currentIndex + 1} / {items.length}
            </span>
            <button
              onClick={next}
              style={{
                background: 'linear-gradient(45deg, #800020, #900020)',
                border: '1px solid #d4af37',
                color: '#d4af37',
                padding: '10px 24px',
                borderRadius: '30px',
                cursor: 'pointer',
                fontWeight: 700,
                fontFamily: 'Cairo, sans-serif',
                fontSize: '1rem'
              }}
            >
              التالي ❯
            </button>
          </div>

          {/* Dots */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
            {items.map((_, i) => (
              <motion.div
                key={i}
                onClick={() => setCurrentIndex(i)}
                animate={{ scale: i === currentIndex ? 1.4 : 1, background: i === currentIndex ? '#d4af37' : 'rgba(255,255,255,0.3)' }}
                style={{ width: '10px', height: '10px', borderRadius: '50%', cursor: 'pointer' }}
              />
            ))}
          </div>
        </>
      ) : (
        <motion.div
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{ textAlign: 'center', padding: '60px 20px', color: 'rgba(255,255,255,0.7)' }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '16px' }}>📷</div>
          <p style={{ fontSize: '1.1rem', lineHeight: 1.8 }}>
            مفيش ذكريات لسه! اضغطي على "ضيف ذكرى" وارفعي أول صورة ليكم ❤️
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Gallery;
