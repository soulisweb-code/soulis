import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Shield, Lock, FileText } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function PrivacyPolicy() {
  const navigate = useNavigate();

  return (
    // 🔥 HERO FIX: fixed inset-0 + overflow-y-auto เพื่อให้เลื่อนได้ชัวร์
    <div className="fixed inset-0 z-10 bg-soulis-900 h-[100dvh] w-full overflow-y-auto overflow-x-hidden font-sans">
      
      {/* ✅ ส่วน SEO: เพิ่ม Helmet สำหรับหน้านโยบายความเป็นส่วนตัว */}
      <Helmet>
        <title>นโยบายความเป็นส่วนตัว - Soulis ความปลอดภัยของคุณคือสิ่งสำคัญ</title>
        <meta 
          name="description" 
          content="อ่านนโยบายความเป็นส่วนตัวของ Soulis ข้อมูลที่เราจัดเก็บ วิธีการใช้งานข้อมูล และมาตรฐานความปลอดภัย เพื่อความสบายใจในการใช้งานพื้นที่ระบายความในใจแห่งนี้" 
        />
        <link rel="canonical" href="https://soulis.vercel.app/privacy-policy" />
        
        {/* Social Media Tags */}
        <meta property="og:title" content="นโยบายความเป็นส่วนตัว - Soulis" />
        <meta property="og:description" content="เราให้ความสำคัญกับความเป็นส่วนตัวและความปลอดภัยของข้อมูลคุณ" />
        <meta property="og:url" content="https://soulis.vercel.app/privacy-policy" />
      </Helmet>

      {/* Wrapper: ใช้ min-h-full เพื่อยืดเนื้อหา และ pt/pb เพื่อกันขอบบนล่าง */}
      <div className="min-h-full w-full flex flex-col items-center justify-center p-6 pt-24 pb-32">

        {/* Background Elements */}
        <div className="fixed top-[-10%] left-1/2 transform -translate-x-1/2 w-[800px] h-[500px] bg-soulis-600/20 rounded-full blur-[120px] pointer-events-none -z-10"></div>

        {/* Main Card */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2rem] shadow-2xl w-full max-w-4xl relative z-20 flex flex-col h-[70vh] md:h-auto animate-float">
            
            {/* Header (Fixed height) */}
            <div className="flex justify-between items-center p-6 md:p-8 border-b border-white/10 bg-white/5 rounded-t-[2rem]">
                <div className="flex items-center gap-3">
                    <Shield className="text-soulis-400" size={32}/>
                    <h1 className="text-2xl md:text-3xl font-bold text-white">นโยบายความเป็นส่วนตัว</h1>
                </div>
                <button onClick={() => navigate('/select-role')} className="text-gray-400 hover:text-white p-2 rounded-full hover:bg-white/10 transition">
                    <ChevronLeft size={24}/>
                </button>
            </div>

            {/* เนื้อหา Scroll ได้ (ใช้ overflow-y-auto ในนี้อีกทีถ้าเนื้อหายาวจัด) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 space-y-8 text-gray-300">
                
                <section>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><FileText size={20} className="text-soulis-500"/> 1. ข้อมูลที่เราจัดเก็บ</h2>
                    <div className="text-sm leading-relaxed">
                        เพื่อให้ระบบทำงานได้ เราจำเป็นต้องเก็บข้อมูลบางส่วนของท่าน ได้แก่:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                            <li>ชื่อผู้ใช้ (Username) - สำหรับแสดงผลในระบบ</li>
                            <li>อีเมล (Email) - สำหรับยืนยันตัวตนและกู้คืนรหัสผ่าน</li>
                            <li>รหัสผ่าน (Password) - ถูกเข้ารหัสอย่างปลอดภัย (Encrypted)</li>
                        </ul>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2"><Lock size={20} className="text-soulis-500"/> 2. การใช้งานข้อมูล</h2>
                    <div className="text-sm leading-relaxed">
                        ข้อมูลของท่านจะถูกใช้งานภายในแพลตฟอร์ม Soulis เท่านั้น เพื่อ:
                        <ul className="list-disc pl-5 mt-2 space-y-1 text-gray-400">
                            <li>จับคู่สนทนาระหว่างผู้ระบายและผู้รับฟัง</li>
                            <li>บันทึกประวัติคะแนนรีวิวและความประทับใจ</li>
                            <li>ตรวจสอบและจัดการกรณีที่มีการรายงานพฤติกรรมไม่เหมาะสม</li>
                        </ul>
                        <br/>
                        <span className="text-red-400 font-bold">เราไม่มีนโยบายเปิดเผย หรือขายข้อมูลส่วนตัวของท่านให้แก่บุคคลภายนอก</span>
                    </div>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">3. ความปลอดภัยของการสนทนา</h2>
                    <p className="text-sm leading-relaxed">
                        การสนทนาใน Soulis เป็นแบบกึ่งนิรนาม (Semi-Anonymous) ระบบจะเก็บข้อมูลแชทไว้ในระยะเวลาหนึ่งเพื่อตรวจสอบความปลอดภัยและจัดการข้อร้องเรียน หากไม่มีการร้องเรียน ข้อมูลอาจถูกลบตามรอบการบำรุงรักษาระบบ
                    </p>
                </section>

                <section>
                    <h2 className="text-xl font-bold text-white mb-3">4. ข้อตกลงการใช้งาน</h2>
                    <p className="text-sm leading-relaxed p-4 bg-white/5 rounded-xl border border-white/5">
                        ผู้ใช้งานตกลงที่จะพูดคุยด้วยถ้อยคำสุภาพ ไม่ข่มขู่ คุกคาม หรือชักชวนไปในทางที่ผิดกฎหมาย หากทีมงานตรวจพบการกระทำดังกล่าว บัญชีของท่านอาจถูกระงับการใช้งานถาวรทันทีโดยไม่ต้องแจ้งให้ทราบล่วงหน้า
                    </p>
                </section>

            </div>
        </div>
      </div>
    </div>
  );
}