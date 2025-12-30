import { createContext, useContext, useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SoundContext = createContext();

export function SoundProvider({ children }) {
  // 🔥 แก้จุดที่ 1: เปลี่ยนค่าเริ่มต้นจาก false เป็น true (เพื่อให้เพลงเริ่มเล่นเองเลย)
  const [isMusicOn, setIsMusicOn] = useState(true);
  
  const [isNotifyOn, setIsNotifyOn] = useState(true);
  const isNotifyOnRef = useRef(isNotifyOn);
  
  const [volume, setVolume] = useState(0.1); 
  
  const musicRef = useRef(null);
  const notifyRef = useRef(null);
  const location = useLocation();

  const silentPages = ['/', '/admin', '/admin-dashboard'];

  // อัปเดต Ref ทุกครั้งที่ State เปลี่ยน (แก้บั๊กปิดเสียงแจ้งเตือนไม่ได้)
  useEffect(() => {
    isNotifyOnRef.current = isNotifyOn;
  }, [isNotifyOn]);

  // จัดการการเล่นเพลง (Play/Pause) ตามหน้าและสถานะ
  useEffect(() => {
    if (silentPages.includes(location.pathname)) {
        musicRef.current?.pause();
    } else {
        if (isMusicOn) {
            if (musicRef.current) musicRef.current.volume = volume;
            
            // สั่งเล่นเพลง
            const playPromise = musicRef.current?.play();

            // 🔥 เพิ่มการดัก Error กรณี Browser บล็อก Autoplay
            if (playPromise !== undefined) {
                playPromise.catch((error) => {
                    console.log("Autoplay prevented by browser:", error);
                    // ถ้าอยากให้ปุ่มยังขึ้นว่า ON อยู่ แม้เสียงจะไม่ออก (รอคนคลิก) ให้คอมเมนต์บรรทัดล่างทิ้งครับ
                    // setIsMusicOn(false); 
                });
            }
        }
    }
  }, [location, isMusicOn]);

  // จัดการระดับเสียงแบบ Realtime
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
      musicRef.current?.play().catch(e => console.log("Play error:", e));
    }
    setIsMusicOn(!isMusicOn);
  };

  const toggleNotify = () => {
    setIsNotifyOn(!isNotifyOn);
  };

  const playNotification = () => {
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