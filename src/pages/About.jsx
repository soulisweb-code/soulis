import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Sparkles, Users, Mail, Facebook, User } from 'lucide-react'; // เพิ่ม Icon User
import { Helmet } from 'react-helmet-async';

export default function About() {
  const navigate = useNavigate();

  return (
    // 🔥 Layout Fix: Layout สำหรับการเลื่อน
    <div className="fixed inset-0 z-10 bg-transparent h-[100dvh] w-full overflow-y-auto overflow-x-hidden font-sans">
      
      {/* ✅ ส่วน SEO */}
      <Helmet>
        <title>เกี่ยวกับเรา - Soulis พื้นที่ปลอดภัยสำหรับใจคุณ</title>
        <meta 
          name="description" 
          content="ทำความรู้จัก Soulis แพลตฟอร์มระบายความในใจแบบไม่ระบุตัวตน เราคือพื้นที่ปลอดภัยที่สร้างขึ้นเพื่อให้ทุกคนมีเพื่อนรับฟังโดยไม่ตัดสิน" 
        />
        <link rel="canonical" href="https://soulis.in.th/about" />
        <meta property="og:title" content="เกี่ยวกับเรา - Soulis" />
        <meta property="og:description" content="ทำความรู้จัก Soulis แพลตฟอร์มระบายความในใจแบบไม่ระบุตัวตน" />
        <meta property="og:url" content="https://soulis.in.th/about" />
      </Helmet>
      
      {/* Wrapper */}
      <div className="min-h-full w-full flex flex-col items-center justify-center p-6 pt-24 pb-32">

        {/* Background Elements */}
        <div className="fixed top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-soulis-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-3xl relative z-20 animate-float">
            
            <button onClick={() => navigate('/select-role')} className="absolute top-6 left-6 text-soulis-300 hover:text-white transition flex items-center gap-1">
                <ChevronLeft size={20}/> กลับหน้าหลัก
            </button>

            <div className="text-center mb-10 mt-8">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
                    Soulis <Sparkles className="text-yellow-400" />
                </h1>
                <p className="text-lg text-soulis-200 font-light italic">
                    "เพราะทุกความรู้สึก... มีความหมาย"
                </p>
            </div>

            {/* 🔥 NEW SECTION: Soulis คือใคร? */}
            <div className="bg-white/5 rounded-2xl p-6 md:p-8 mb-10 border border-white/5 text-center shadow-inner">
                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 flex items-center justify-center gap-2">
                    <User className="text-soulis-400" size={24} /> Soulis คือใคร?
                </h2>
                <div className="text-gray-300 space-y-4 leading-relaxed text-sm md:text-base">
                    <p>
                        เว็บไซต์นี้จัดทำและพัฒนาโดย <strong>คนธรรมดาเพียงคนเดียว</strong> ที่มีความฝันเล็กๆ 
                        อยากเปลี่ยนโลกออนไลน์ให้น่าอยู่ขึ้น
                    </p>
                    <p>
                        เราตั้งใจสร้างพื้นที่แห่งนี้ให้เป็น <strong>"พื้นที่ปลอดภัย" (Safe Space)</strong> ของทุกคน 
                        เพื่อให้ใครก็ตามที่กำลังเหนื่อยล้า ได้เข้ามา <em>ระบายความในใจ</em> หรือ <em>รับฟังผู้อื่น</em> 
                        โดยไม่ต้องสวมหน้ากากและไม่ต้องกลัวการถูกตัดสิน
                    </p>
                    <p className="font-medium text-soulis-200">
                        "เราเชื่อว่าการรับฟังด้วยหัวใจ คือจุดเริ่มต้นของการสร้างสังคมที่ดี"
                    </p>
                </div>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-3 gap-6 text-center">
                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-soulis-500/30 transition group">
                    <div className="bg-rose-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300 group-hover:scale-110 transition-transform">
                        <Heart />
                    </div>
                    <h3 className="text-white font-bold mb-2">พื้นที่ปลอดภัย</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">ระบายความในใจได้โดยไม่ต้องเปิดเผยตัวตน (Anonymous)</p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-soulis-500/30 transition group">
                    <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-300 group-hover:scale-110 transition-transform">
                        <Users />
                    </div>
                    <h3 className="text-white font-bold mb-2">เพื่อนรับฟัง</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">เชื่อมต่อกับผู้ที่พร้อมรับฟังและให้กำลังใจด้วยความเข้าใจ</p>
                </div>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-soulis-500/30 transition group">
                    <div className="bg-yellow-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-300 group-hover:scale-110 transition-transform">
                        <Sparkles />
                    </div>
                    <h3 className="text-white font-bold mb-2">พลังบวก</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">สร้างสังคมแห่งการแบ่งปันความรู้สึกดีๆ ให้แก่กัน</p>
                </div>
            </div>

            {/* Footer Text & Contact */}
            <div className="mt-12 text-center border-t border-white/10 pt-8">
                <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-8">
                    <strong>ขอขอบคุณจากใจจริง</strong> สำหรับทุกคนที่แวะเวียนเข้ามาใช้งาน 
                    และร่วมเป็นส่วนหนึ่งในจักรวาลเล็กๆ แห่งนี้ หวังว่า Soulis จะช่วยโอบกอดและฮีลใจคุณได้ไม่มากก็น้อยนะคะ 💜
                </p>

                {/* Contact Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-3">
                    <a href="mailto:soulis.web@gmail.com" className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-5 py-2.5 rounded-full hover:bg-white/10 hover:scale-105 transition active:scale-95 cursor-pointer group">
                        <Mail size={18} className="text-soulis-300 group-hover:text-white transition"/>
                        <span className="text-sm text-gray-300 group-hover:text-white transition">ติดต่อทางอีเมล</span>
                    </a>

                    <a 
                        href="https://www.facebook.com/profile.php?id=61585944024410" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="inline-flex items-center gap-2 bg-[#1877F2]/10 border border-[#1877F2]/30 px-5 py-2.5 rounded-full hover:bg-[#1877F2]/20 hover:scale-105 transition active:scale-95 cursor-pointer group"
                    >
                        <Facebook size={18} className="text-[#1877F2] group-hover:text-white transition"/>
                        <span className="text-sm text-[#1877F2] group-hover:text-white transition font-medium">ติดต่อเรา</span>
                    </a>
                </div>

            </div>

        </div>
      </div>
    </div>
  );
}