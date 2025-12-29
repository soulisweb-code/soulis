import { useLocation } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import { Music, VolumeX, Bell, BellOff } from 'lucide-react';

export default function SoundController() {
  const { isMusicOn, toggleMusic, isNotifyOn, toggleNotify, volume, setVolume } = useSound();
  const location = useLocation();

  const hiddenPages = ['/', '/admin', '/admin-dashboard'];
  if (hiddenPages.includes(location.pathname)) return null;

  return (
    // 🔥 แก้บรรทัดนี้: เปลี่ยนจาก top-6 เฉยๆ เป็น "top-20 md:top-6"
    // top-20 = มือถือ (ดันลงมาให้พ้น Header)
    // md:top-6 = จอใหญ่ (กลับไปอยู่ตำแหน่งเดิม)
    <div className="fixed top-20 md:top-6 left-1/2 transform -translate-x-1/2 z-[100] animate-fade-in w-max">
      
      <div className="flex items-center gap-2 bg-soulis-900/60 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-lg shadow-purple-500/10 hover:shadow-purple-500/20 transition-all duration-300">
        
        {/* กลุ่มปุ่มเพลง + Slider */}
        <div className="flex items-center gap-2">
            <button 
                onClick={toggleMusic}
                className={`p-2 rounded-full transition-all duration-300 ${isMusicOn ? 'bg-purple-500 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
                title="เพลงพื้นหลัง"
            >
                {isMusicOn ? <Music size={16} /> : <VolumeX size={16} />}
            </button>

            {/* Slider */}
            <div className={`overflow-hidden transition-all duration-500 ease-in-out ${isMusicOn ? 'w-20 opacity-100 mr-1' : 'w-0 opacity-0'}`}>
                <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-400"
                />
            </div>
        </div>

        <div className="w-[1px] h-4 bg-white/20"></div>

        {/* ปุ่มแจ้งเตือน */}
        <button 
            onClick={toggleNotify}
            className={`p-2 rounded-full transition-all duration-300 ${isNotifyOn ? 'bg-yellow-500/80 text-white shadow-[0_0_10px_rgba(234,179,8,0.5)]' : 'bg-white/5 text-gray-400 hover:text-white'}`}
            title="เสียงแจ้งเตือน"
        >
            {isNotifyOn ? <Bell size={16} /> : <BellOff size={16} />}
        </button>

      </div>
    </div>
  );
}