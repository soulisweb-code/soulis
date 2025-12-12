import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Heart, Sparkles, Users, Mail } from 'lucide-react';

export default function About() {
  const navigate = useNavigate();

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden font-sans relative">
      {/* Background Elements */}
      <div className="absolute top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-soulis-600/20 rounded-full blur-[120px]"></div>

      <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-3xl relative z-10 animate-float">
        
        <button onClick={() => navigate('/select-role')} className="absolute top-6 left-6 text-soulis-300 hover:text-white transition flex items-center gap-1">
            <ChevronLeft size={20}/> กลับหน้าหลัก
        </button>

        <div className="text-center mb-10 mt-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 flex items-center justify-center gap-3">
               Soulis <Sparkles className="text-yellow-400" />
            </h1>
            <p className="text-lg text-soulis-200 font-light">
               "เพราะทุกความรู้สึก... มีความหมาย"
            </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 text-center">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-soulis-500/30 transition group">
                <div className="bg-rose-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-rose-300 group-hover:scale-110 transition-transform">
                    <Heart />
                </div>
                <h3 className="text-white font-bold mb-2">พื้นที่ปลอดภัย</h3>
                <p className="text-sm text-gray-400">ระบายความในใจได้โดยไม่ต้องเปิดเผยตัวตน (Anonymous)</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-soulis-500/30 transition group">
                <div className="bg-purple-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-purple-300 group-hover:scale-110 transition-transform">
                    <Users />
                </div>
                <h3 className="text-white font-bold mb-2">เพื่อนรับฟัง</h3>
                <p className="text-sm text-gray-400">เชื่อมต่อกับผู้ที่พร้อมรับฟังและให้กำลังใจด้วยความเข้าใจ</p>
            </div>

            <div className="bg-white/5 p-6 rounded-2xl border border-white/5 hover:border-soulis-500/30 transition group">
                <div className="bg-yellow-500/20 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-yellow-300 group-hover:scale-110 transition-transform">
                    <Sparkles />
                </div>
                <h3 className="text-white font-bold mb-2">พลังบวก</h3>
                <p className="text-sm text-gray-400">สร้างสังคมแห่งการแบ่งปันความรู้สึกดีๆ ให้แก่กัน</p>
            </div>
        </div>

        <div className="mt-12 text-center border-t border-white/10 pt-8">
            <p className="text-gray-400 text-sm leading-relaxed max-w-xl mx-auto mb-6">
                Soulis เกิดขึ้นจากความตั้งใจที่อยากให้ทุกคนมีพื้นที่เล็กๆ ไว้พักใจ 
                ในวันที่โลกภายนอกอาจจะโหดร้าย เราหวังว่าที่นี่จะเป็นดวงดาวดวงน้อยๆ 
                ที่ช่วยโอบกอดคุณไว้นะคะ 💜
            </p>

            {/* ส่วนอีเมลติดต่อ (เพิ่มใหม่) */}
            <div className="inline-flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-full hover:bg-white/10 transition cursor-default">
                <Mail size={16} className="text-soulis-300"/>
                <span className="text-sm text-gray-300">ติดต่อเรา: <a href="mailto:soulis.web@gmail.com" className="text-white font-medium hover:text-soulis-300 transition hover:underline">soulis.web@gmail.com</a></span>
            </div>
        </div>

      </div>
    </div>
  );
}