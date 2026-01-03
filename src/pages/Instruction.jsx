import { useLocation, useNavigate } from 'react-router-dom';
import { Shield, Heart, AlertCircle, CheckCircle, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Instruction() {
  const location = useLocation();
  const navigate = useNavigate();
  // รับ uid มาด้วย
  const { myRole, token, uid } = location.state || {}; 

  const content = {
    talker: {
      title: "คู่มือสำหรับผู้ระบาย 🗣️",
      desc: "พื้นที่นี้ปลอดภัยสำหรับคุณ ระบายได้เต็มที่เลยนะ",
      do: [
        "เล่าเรื่องราวความไม่สบายใจได้เต็มที่",
        "เป็นตัวของตัวเอง ไม่ต้องกลัวใครตัดสิน",
        "ให้เกียรติผู้รับฟัง"
      ],
      dont: [
        "ห้ามให้ข้อมูลส่วนตัว (เบอร์โทร, ไลน์, ที่อยู่)",
        "ห้ามยืมเงิน หรือชักชวนไปทำเรื่องผิดกฎหมาย",
        "ห้ามใช้ถ้อยคำรุนแรงเกินขอบเขต"
      ],
      color: "rose"
    },
    listener: {
      title: "คู่มือสำหรับผู้รับฟัง 👂",
      desc: "ขอบคุณที่เป็นพลังบวกให้โลกใบนี้นะ",
      do: [
        "รับฟังด้วยใจ เปิดกว้าง ไม่ตัดสิน",
        "ให้กำลังใจ และอยู่เป็นเพื่อน",
        "เก็บความลับของคู่สนทนา"
      ],
      dont: [
        "ห้ามถามข้อมูลส่วนตัว หรือนัดเจอนอกรอบ",
        "ห้ามตัดสิน หรือสั่งสอน (เน้นรับฟัง)",
        "ห้ามใช้คำพูดทำร้ายจิตใจ"
      ],
      color: "emerald"
    }
  };

  const info = myRole === 'talker' ? content.talker : content.listener;
  const btnColor = myRole === 'talker' ? 'bg-rose-600 hover:bg-rose-500' : 'bg-emerald-600 hover:bg-emerald-500';

  const handleUnderstand = () => {
    // บันทึกแบบระบุตัวตน (soulis_seen_ไอดีคน_บทบาท)
    if (uid) {
        localStorage.setItem(`soulis_seen_${uid}_${myRole}`, 'true');
    }

    navigate('/waiting', { 
      state: { myRole, token }, 
      replace: true 
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* ✅ ส่วน SEO: ปรับ Title เป็น How-to style */}
      <Helmet>
        <title>วิธีระบายความเครียดและเป็นผู้รับฟังที่ดี - คู่มือ Soulis</title>
        <meta 
          name="description" 
          content="อ่านคู่มือการเป็นผู้รับฟังที่ดี (Listener) และข้อควรระวังในการระบายความในใจ (Talker) บน Soulis เพื่อสร้างพื้นที่ปลอดภัยทางใจร่วมกัน" 
        />
        <link rel="canonical" href="https://soulis.in.th/instruction" />
        
        {/* Social Media Tags */}
        <meta property="og:title" content="วิธีระบายความเครียดและเป็นผู้รับฟังที่ดี - Soulis" />
        <meta property="og:description" content="อ่านคู่มือและกติกาการใช้งาน Soulis เพื่อพื้นที่ปลอดภัย" />
        <meta property="og:url" content="https://soulis.in.th/instruction" />
      </Helmet>

      <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-soulis-700/20 rounded-full blur-[100px] animate-float"></div>
      
      <div className="bg-white/5 backdrop-blur-xl border border-white/20 p-8 md:p-10 rounded-[2rem] shadow-2xl w-full max-w-2xl relative z-10 animate-float">
        
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3 drop-shadow-md">
          {myRole === 'talker' ? <Shield size={36} className="text-rose-400" /> : <Heart size={36} className="text-emerald-400" />}
          {info.title}
        </h1>
        <p className="text-soulis-200 mb-8">{info.desc}</p>

        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-green-500/10 border border-green-500/20 p-6 rounded-2xl">
            <h3 className="text-green-400 font-bold mb-4 flex items-center gap-2"><CheckCircle size={20}/> สิ่งที่ควรทำ</h3>
            <ul className="space-y-3">
              {info.do.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-green-500 rounded-full"></span> {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-2xl">
            <h3 className="text-red-400 font-bold mb-4 flex items-center gap-2"><AlertCircle size={20}/> สิ่งที่ไม่ควรทำ</h3>
            <ul className="space-y-3">
              {info.dont.map((item, i) => (
                <li key={i} className="text-gray-300 text-sm flex items-start gap-2">
                  <span className="mt-1.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span> {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <button 
          onClick={handleUnderstand}
          className={`w-full ${btnColor} text-white py-4 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition transform hover:scale-105`}>
          เข้าใจแล้ว เริ่มใช้งานเลย <ArrowRight size={20} />
        </button>

      </div>
    </div>
  );
}