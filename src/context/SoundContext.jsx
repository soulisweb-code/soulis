import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isNotifyOn, setIsNotifyOn] = useState(true);
  
  // 🔥 1. เพิ่ม Ref เพื่อเก็บสถานะล่าสุด (แก้ปัญหา Closure Trap)
  const isNotifyOnRef = useRef(isNotifyOn);
  
  const [volume, setVolume] = useState(0.1); 
  
  const musicRef = useRef(null);
  const notifyRef = useRef(null);
  const location = useLocation();

  const silentPages = ['/', '/admin', '/admin-dashboard'];

  // 🔥 2. อัปเดต Ref ทุกครั้งที่ State เปลี่ยน
  useEffect(() => {
    isNotifyOnRef.current = isNotifyOn;
  }, [isNotifyOn]);

  useEffect(() => {
    if (silentPages.includes(location.pathname)) {
        musicRef.current?.pause();
    } else {
        if (isMusicOn) {
            if (musicRef.current) musicRef.current.volume = volume;
            musicRef.current?.play().catch(() => setIsMusicOn(false));
        }
    }
  }, [location, isMusicOn]);

  useEffect(() => {
    if (musicRef.current) {
        musicRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (isMusicOn) {
      musicRef.current?.pause();
    } else {
      if (musicRef.current) musicRef.current.volume = volume;
      musicRef.current?.play();
    }
    setIsMusicOn(!isMusicOn);
  };

  const toggleNotify = () => {
    setIsNotifyOn(!isNotifyOn);
    // (Ref จะถูกอัปเดตอัตโนมัติจาก useEffect ข้างบน)
  };

  const playNotification = () => {
    // 🔥 3. เช็คจาก Ref แทน State (จะได้ค่าล่าสุดเสมอ แม้ใน Event Listener เก่า)
    if (isNotifyOnRef.current && notifyRef.current) {
        notifyRef.current.volume = 0.5;
        notifyRef.current.currentTime = 0;
        notifyRef.current.play().catch(e => console.log("Notify error:", e));
    }
  };

  return (
    <SoundContext.Provider value={{ isMusicOn, toggleMusic, isNotifyOn, toggleNotify, playNotification, volume, setVolume }}>
      {children}
      
      <audio ref={musicRef} loop>
        <source src="/assets/sounds/bg-music.mp3" type="audio/mpeg" />
      </audio>

      <audio ref={notifyRef}>
        <source src="/assets/sounds/notification.mp3" type="audio/mpeg" />
      </audio>

    </SoundContext.Provider>
  );
}

export const useSound = () => useContext(SoundContext);