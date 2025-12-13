import { useNavigate } from 'react-router-dom';
import { Sparkles, Home } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function ThankYouTalker() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ✅ ส่วน SEO: เปลี่ยนชื่อแท็บให้กำลังใจ และซ่อนจาก Google Search */}
      <Helmet>
        <title>ขอบคุณที่ไว้ใจเรา - Soulis ขอให้ใจเบาขึ้นนะ</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-soulis-500/20 rounded-full blur-[100px] animate-float"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-12 rounded-[2rem] shadow-2xl w-full max-w-lg text-center relative z-10 animate-float">
        <div className="w-24 h-24 bg-soulis-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-4 border-soulis-500/30 shadow-lg shadow-soulis-900/50">
            <Sparkles size={48} className="text-soulis-400 fill-soulis-400/50 animate-pulse" />
        </div>

        <h1 className="text-4xl font-bold text-white mb-4 drop-shadow-lg">ขอบคุณที่ไว้ใจเรานะ</h1>
        
        <div className="space-y-4 text-gray-300 mb-8 leading-relaxed font-light text-lg">
            <p>
                การได้ระบายสิ่งที่อยู่ในใจออกมา<br/>
                คือการก้าวแรกของการฮีลใจตัวเอง
            </p>
            <p className="text-soulis-300 font-medium text-xl mt-4">
                ขอให้วันนี้เป็นวันที่ใจเบาขึ้นกว่าเดิมนะ<br/>
                ถ้าไม่ไหว... กลับมาหาเราได้เสมอ 💜
            </p>
        </div>

        <button 
            onClick={() => navigate('/select-role', { replace: true })}
            className="w-full bg-soulis-600 hover:bg-soulis-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-soulis-900/50 flex items-center justify-center gap-2 transition transform hover:scale-105">
            <Home size={20} /> กลับสู่หน้าหลัก
        </button>
      </div>
    </div>
  );
}