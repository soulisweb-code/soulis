import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  const [isMusicOn, setIsMusicOn] = useState(false);
  const [isNotifyOn, setIsNotifyOn] = useState(true);
  
  // 🔥 เพิ่ม State ระดับเสียง (เริ่มที่ 0.1 = 10%)
  const [volume, setVolume] = useState(0.1); 
  
  const musicRef = useRef(null);
  const notifyRef = useRef(null);
  const location = useLocation();

  const silentPages = ['/', '/admin', '/admin-dashboard'];

  // จัดการการเล่นเพลง (Play/Pause)
  useEffect(() => {
    if (silentPages.includes(location.pathname)) {
        musicRef.current?.pause();
    } else {
        if (isMusicOn) {
            // 🔥 ต้องตั้งค่า volume ก่อนเล่นเสมอ
            if (musicRef.current) musicRef.current.volume = volume;
            
            musicRef.current?.play().catch(() => setIsMusicOn(false));
        }
    }
  }, [location, isMusicOn]);

  // 🔥 จัดการระดับเสียงแบบ Realtime
  useEffect(() => {
    if (musicRef.current) {
        musicRef.current.volume = volume;
    }
  }, [volume]);

  const toggleMusic = () => {
    if (isMusicOn) {
      musicRef.current?.pause();
    } else {
      if (musicRef.current) musicRef.current.volume = volume; // กันเหนียว
      musicRef.current?.play();
    }
    setIsMusicOn(!isMusicOn);
  };

  const toggleNotify = () => {
    setIsNotifyOn(!isNotifyOn);
  };

  const playNotification = () => {
    if (isNotifyOn && notifyRef.current) {
        notifyRef.current.volume = 0.5; // เสียงแจ้งเตือนดัง 50% (ดังกว่าเพลงหน่อยจะได้ยินชัด)
        notifyRef.current.currentTime = 0;
        notifyRef.current.play().catch(e => console.log("Notify error:", e));
    }
  };

  return (
    // ส่ง volume และ setVolume ออกไปให้ Controller ใช้
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