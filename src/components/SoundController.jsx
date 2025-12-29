import { useLocation } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import { Music, VolumeX, Bell, BellOff } from 'lucide-react';

export default function SoundController() {
  const { isMusicOn, toggleMusic, isNotifyOn, toggleNotify } = useSound();
  const location = useLocation();

  // ถ้าอยู่หน้า Login หรือ Admin ให้ซ่อนปุ่มไปเลย
  const hiddenPages = ['/', '/admin', '/admin-dashboard'];
  if (hiddenPages.includes(location.pathname)) return null;

  return (
    <div className="fixed top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in">
      <div className="flex items-center gap-1 bg-soulis-900/40 backdrop-blur-xl border border-white/10 p-1.5 rounded-full shadow-lg shadow-purple-500/10 hover:scale-105 transition-transform duration-300">
        
        {/* ปุ่มเพลง */}
        <button 
            onClick={toggleMusic}
            className={`p-2 rounded-full transition-all duration-300 ${isMusicOn ? 'bg-purple-500/20 text-purple-300 shadow-[0_0_10px_rgba(168,85,247,0.3)]' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
            title="เพลงพื้นหลัง"
        >
            {isMusicOn ? <Music size={18} className="animate-pulse" /> : <VolumeX size={18} />}
        </button>

        <div className="w-[1px] h-4 bg-white/10 mx-1"></div>

        {/* ปุ่มแจ้งเตือน */}
        <button 
            onClick={toggleNotify}
            className={`p-2 rounded-full transition-all duration-300 ${isNotifyOn ? 'bg-yellow-500/20 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.3)]' : 'bg-transparent text-gray-500 hover:text-gray-300'}`}
            title="เสียงแจ้งเตือน"
        >
            {isNotifyOn ? <Bell size={18} /> : <BellOff size={18} />}
        </button>

      </div>
    </div>
  );
}