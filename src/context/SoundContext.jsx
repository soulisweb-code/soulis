import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMusicOn, setIsMusicOn] = useState(false); // เริ่มต้นปิดไว้ก่อน (กัน Browser บล็อก Autoplay)
  const [isNotifyOn, setIsNotifyOn] = useState(true);
  
  const musicRef = useRef(null);
  const notifyRef = useRef(null);
  const location = useLocation();

  // 🚫 รายชื่อหน้าที่ห้ามมีเสียง
  const silentPages = ['/', '/admin', '/admin-dashboard'];

  // จัดการเพลงพื้นหลัง (Background Music)
  useEffect(() => {
    if (silentPages.includes(location.pathname)) {
        // ถ้าอยู่หน้าห้าม -> หยุดเพลงทันที
        musicRef.current?.pause();
    } else {
        // ถ้าอยู่หน้าปกติ และเปิดเพลงไว้ -> เล่นต่อ
        if (isMusicOn) {
            musicRef.current?.play().catch(() => setIsMusicOn(false)); // กัน Error Autoplay
        }
    }
  }, [location, isMusicOn]);

  const toggleMusic = () => {
    if (isMusicOn) {
      musicRef.current?.pause();
    } else {
      musicRef.current?.play();
    }
    setIsMusicOn(!isMusicOn);
  };

  const toggleNotify = () => {
    setIsNotifyOn(!isNotifyOn);
  };

  const playNotification = () => {
    if (isNotifyOn && notifyRef.current) {
        notifyRef.current.currentTime = 0;
        notifyRef.current.play().catch(e => console.log("Notify error:", e));
    }
  };

  return (
    <SoundContext.Provider value={{ isMusicOn, toggleMusic, isNotifyOn, toggleNotify, playNotification }}>
      {children}
      
      {/* 🎵 1. ใส่ลิงก์เพลงพื้นหลังตรงนี้ (MP3) */}
      <audio ref={musicRef} loop>
        <source src="/assets/sounds/bg-music.mp3" type="audio/mpeg" />
      </audio>

      {/* 🔔 2. ใส่ลิงก์เสียงแจ้งเตือนตรงนี้ (MP3/WAV) */}
      <audio ref={notifyRef}>
        <source src="/assets/sounds/notification.mp3" type="audio/mpeg" />
      </audio>

    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);