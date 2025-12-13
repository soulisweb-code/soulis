import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Gift, Copy, HeartHandshake } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

export default function Support() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const accountNo = "144-1-13505-6"; 
  const bankName = "ธนาคารกสิกรไทย (KBank)";
  const accountName = "อิทธิณัฐ รัตนโยธิน      ";

  const handleCopy = () => {
    navigator.clipboard.writeText(accountNo);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    // 🔥 HERO FIX: บังคับด้วย style โดยตรง เพื่อแหกกฎ index.css
    <div 
        className="fixed inset-0 z-50 bg-soulis-900 w-full"
        style={{ 
            height: '100dvh',           // ความสูงเต็มจอแบบ Dynamic
            overflowY: 'scroll',        // บังคับให้มี Scrollbar เสมอ (แหกกฎ hidden)
            overflowX: 'hidden',        // ห้ามเลื่อนซ้ายขวา
            WebkitOverflowScrolling: 'touch', // ให้ iOS เลื่อนลื่นๆ
            position: 'fixed'           // ยึดทับหน้าจอเดิม
        }}
    >
      
      {/* ✅ ส่วน SEO: เพิ่ม Helmet สำหรับหน้าสนับสนุน */}
      <Helmet>
        <title>สนับสนุนผู้พัฒนา - Soulis ร่วมส่งต่อกำลังใจ</title>
        <meta 
          name="description" 
          content="ร่วมสนับสนุนทีมงานผู้พัฒนา Soulis เพื่อให้เราได้พัฒนาและดูแลรักษาพื้นที่ปลอดภัยสำหรับระบายความในใจแห่งนี้ต่อไป" 
        />
        <link rel="canonical" href="https://soulis.vercel.app/support" />
        
        {/* Social Media Tags */}
        <meta property="og:title" content="สนับสนุนผู้พัฒนา - Soulis" />
        <meta property="og:description" content="ร่วมเป็นส่วนหนึ่งในการขับเคลื่อนสังคมแห่งการรับฟัง" />
        <meta property="og:url" content="https://soulis.vercel.app/support" />
      </Helmet>

      {/* Wrapper ข้างใน: ใช้ min-h-full และ padding เยอะๆ */}
      <div className="min-h-full w-full flex flex-col items-center justify-center p-6 pt-24 pb-40">

        {/* Background Elements */}
        <div className="fixed top-[-20%] left-1/2 transform -translate-x-1/2 w-[600px] h-[600px] bg-yellow-500/10 rounded-full blur-[120px] animate-pulse pointer-events-none -z-10"></div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-lg relative z-20 animate-float">
            
            <button onClick={() => navigate('/select-role')} className="absolute top-6 left-6 text-soulis-300 hover:text-white transition flex items-center gap-1">
                <ChevronLeft size={20}/> กลับหน้าหลัก
            </button>

            <div className="text-center mb-8 mt-4">
                <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-yellow-500/30">
                    <Gift size={40} className="text-white animate-bounce" />
                </div>
                <h1 className="text-3xl font-bold text-white mb-2">สนับสนุนผู้พัฒนา</h1>
                <p className="text-soulis-200 font-light text-sm">
                ช่วยเป็นกำลังใจให้ Soulis พัฒนาต่อไป <br/> เพื่อพื้นที่ปลอดภัยของทุกคน 💜
                </p>
            </div>

            {/* กล่องเลขบัญชี */}
            <div className="bg-black/20 border border-white/10 rounded-2xl p-6 text-center space-y-4 relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                
                <div className="space-y-1">
                    <p className="text-soulis-300 text-sm font-medium">{bankName}</p>
                    <div className="flex items-center justify-center gap-2 cursor-pointer active:scale-95 transition-transform" onClick={handleCopy} role="button">
                        <h2 className="text-2xl font-mono font-bold text-white tracking-wider">{accountNo}</h2>
                        <Copy size={18} className={`text-soulis-400 hover:text-white transition ${copied ? 'text-green-400' : ''}`}/>
                    </div>
                    {copied && <span className="text-xs text-green-400 absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black/50 px-2 py-1 rounded">คัดลอกแล้ว!</span>}
                </div>
                
                <div className="pt-3 border-t border-white/10">
                    <p className="text-white text-sm">{accountName}</p>
                </div>
            </div>

            <div className="mt-8 text-center">
                <p className="text-soulis-400 text-xs flex items-center justify-center gap-1">
                    <HeartHandshake size={14}/> ขอบคุณที่สนับสนุนพวกเรานะ <HeartHandshake size={14}/>
                </p>
            </div>

        </div>
      </div>
    </div>
  );
}