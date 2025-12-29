import { useLocation } from 'react-router-dom';
import { useSound } from '../context/SoundContext';
import { Music, VolumeX, Bell, BellOff } from 'lucide-react';

export default function SoundController() {
  const { isMusicOn, toggleMusic, isNotifyOn, toggleNotify, volume, setVolume } = useSound();
  const location = useLocation();

  const hiddenPages = ['/', '/admin', '/admin-dashboard'];
  if (hiddenPages.includes(location.pathname)) return null;

  return (
    // 🔥 แก้ใหม่: ใช้ inset-x-0 + flex justify-center เพื่อจัดกึ่งกลาง (ไม่ใช้ transform แล้ว)
    // pointer-events-none เพื่อให้กดทะลุพื้นที่ว่างๆ ได้ (ไม่บังปุ่มอื่น)
    <div className="fixed top-20 md:top-6 inset-x-0 flex justify-center z-[100] pointer-events-none">
      
      {/* ใส่ pointer-events-auto เพื่อให้ตัวปุ่มยังกดได้ */}
      <div className="pointer-events-auto animate-fade-in">
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
    </div>
  );
}