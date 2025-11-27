import { useNavigate } from 'react-router-dom';
import { Heart, Home } from 'lucide-react';

export default function ThankYouListener() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[100px] animate-float"></div>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] shadow-2xl w-full max-w-lg text-center relative z-10 animate-float">
        <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-emerald-500/30 shadow-lg shadow-emerald-900/50">
            <Heart size={48} className="text-emerald-400 fill-emerald-400/50 animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">ขอบคุณที่รับฟังนะคะ</h1>
        
        <div className="space-y-4 text-gray-300 mb-8 leading-relaxed font-light text-lg">
            <p>
                การสละเวลาอันมีค่าของคุณเพื่อรับฟังใครสักคน<br/>
                อาจเป็นสิ่งที่ช่วยต่อลมหายใจของเขาในวันนี้ก็ได้
            </p>
            <p className="text-emerald-300 font-medium text-xl mt-4">
                "คุณคือฮีโร่ที่ไม่มีผ้าคลุม" 🦸‍♂️
            </p>
        </div>

        <button 
            onClick={() => navigate('/select-role', { replace: true })}
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-2 transition transform hover:scale-105">
            <Home size={20} /> กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}