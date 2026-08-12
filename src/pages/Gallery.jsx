import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Upload, Plus } from 'lucide-react';
import { db, storage } from '../firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

// Cloudinary config
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

const staticGalleryItems = [];

const Gallery = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [firestoreItems, setFirestoreItems] = useState([]);
  const [showUploadForm, setShowUploadForm] = useState(false);
  
  // Upload states
  const [file, setFile] = useState(null);
  const [text, setText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch items from Firestore
    const q = query(collection(db, 'gallery'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
      setFirestoreItems(items);
    }, (error) => {
      console.log("Error fetching gallery items:", error);
    });

    return () => unsubscribe();
  }, []);

  const galleryItems = [...staticGalleryItems, ...firestoreItems];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % galleryItems.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
  };

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    setProgress(10); // Fake initial progress since fetch doesn't support progress events easily

    try {
      const isVideo = file.type.startsWith('video/');
      const timestamp = Math.floor(Date.now() / 1000);
      const signature = await generateSignature(timestamp);

      const formData = new FormData();
      formData.append('file', file);
      formData.append('api_key', API_KEY);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);

      const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${isVideo ? 'video' : 'image'}/upload`;

      const response = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.secure_url) {
        setProgress(100);
        await addDoc(collection(db, 'gallery'), {
          url: data.secure_url,
          text: text,
          type: isVideo ? 'video' : 'image',
          createdAt: serverTimestamp()
        });

        setUploading(false);
        setShowUploadForm(false);
        setFile(null);
        setText('');
        setProgress(0);
        setCurrentIndex(galleryItems.length);
      } else {
        throw new Error(data.error?.message || "فشل الرفع");
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploading(false);
      alert('حصلت مشكلة أثناء الرفع: ' + error.message);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 0.6 }}
      style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px 0' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', marginBottom: '20px' }}>
        <h2 style={{ color: 'var(--gold)', fontSize: '2rem', textShadow: '0 2px 10px rgba(0,0,0,0.5)', margin: 0 }}>
          أجمل ذكرياتنا 📸
        </h2>
        <button 
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="glass-button" 
          style={{ padding: '10px', display: 'flex', alignItems: 'center', gap: '5px' }}
        >
          <Plus size={20} /> ضيف ذكرى
        </button>
      </div>

      <AnimatePresence>
        {showUploadForm && (
          <motion.form 
            onSubmit={handleUpload}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="glass-panel"
            style={{ width: '100%', padding: '20px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '15px' }}
          >
            <input type="file" onChange={handleFileChange} accept="image/*,video/*" className="glass-input" required />
            <input 
              type="text" 
              value={text} 
              onChange={(e) => setText(e.target.value)} 
              placeholder="اكتب كلام حلو للصورة أو الفيديو..." 
              className="glass-input" 
              required 
            />
            <button type="submit" className="glass-button" disabled={uploading}>
              {uploading ? `بيترفع... ${progress}%` : 'ارفع الذكرى ❤️'}
            </button>
          </motion.form>
        )}
      </AnimatePresence>
      
      {galleryItems.length > 0 ? (
        <div className="glass-panel" style={{ position: 'relative', width: '100%', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          
          <div style={{ position: 'relative', width: '100%', height: '50vh', minHeight: '300px', maxHeight: '500px', overflow: 'hidden', borderRadius: '15px' }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
              >
                {galleryItems[currentIndex].type === 'video' ? (
                  <video 
                    src={galleryItems[currentIndex].url} 
                    controls 
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                ) : (
                  <img
                    src={galleryItems[currentIndex].url}
                    alt="Memory"
                    style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          <motion.p 
            key={`text-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ marginTop: '20px', fontSize: '1.2rem', color: '#fff', textAlign: 'center', fontWeight: 'bold' }}
          >
            {galleryItems[currentIndex].text}
          </motion.p>

          <div style={{ display: 'flex', gap: '15px', marginTop: '30px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <button onClick={handlePrev} className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px' }}>
              <ChevronRight size={20} /> اللي قبله
            </button>
            <span style={{ display: 'flex', alignItems: 'center', color: 'var(--gold)', fontWeight: 'bold' }}>
              {currentIndex + 1} / {galleryItems.length}
            </span>
            <button onClick={handleNext} className="glass-button" style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '10px 20px' }}>
              اللي بعده <ChevronLeft size={20} />
            </button>
          </div>
        </div>
      ) : (
        <p style={{ color: '#fff', textAlign: 'center' }}>مفيش صور لسه، ضيف أول ذكرى ليكم! ❤️</p>
      )}

    </motion.div>
  );
};

export default Gallery;
