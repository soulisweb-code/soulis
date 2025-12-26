import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Home, Rocket } from 'lucide-react';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden">
        <Helmet>
            <title>404 - หลงทางในอวกาศ | Soulis</title>
        </Helmet>

        {/* Decorative elements */}
        <div className="fixed top-20 left-20 w-32 h-32 bg-purple-500/20 rounded-full blur-[80px] animate-pulse"></div>
        <div className="fixed bottom-20 right-20 w-40 h-40 bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-700"></div>

        <div className="text-center relative z-10 max-w-lg mx-auto">
            <div className="mb-6 relative inline-block">
                <Rocket className="w-24 h-24 text-soulis-300 animate-bounce mx-auto" />
                <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-black/50 blur-md rounded-[100%]"></div>
            </div>
            
            <h1 className="text-9xl font-bold bg-gradient-to-b from-white to-white/10 bg-clip-text text-transparent mb-2">
                404
            </h1>
            
            <h2 className="text-2xl font-bold text-white mb-4">
                ดูเหมือนคุณจะหลงทางในอวกาศ
            </h2>
            
            <p className="text-gray-400 mb-8 leading-relaxed">
                หน้าที่คุณกำลังตามหาอาจถูกหลุมดำดูดไปแล้ว หรือย้ายไปยังกาแล็กซีอื่น 
                ลองกลับไปตั้งหลักที่สถานีหลักกันดีกว่า
            </p>

            <button 
                onClick={() => navigate('/')}
                className="group relative inline-flex items-center gap-2 px-8 py-3 bg-white text-soulis-900 rounded-xl font-bold hover:bg-soulis-50 transition-all transform hover:scale-105 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] active:scale-95"
            >
                <Home size={20} className="group-hover:-translate-y-1 transition-transform" />
                กลับสู่หน้าหลัก
            </button>
        </div>
    </div>
  );
}
