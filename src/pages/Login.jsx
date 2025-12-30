import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { Sparkles, X, Shield, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);

  // ฟังก์ชันเริ่มกระบวนการ (เปิด Modal ก่อน)
  const handleStartLogin = () => {
    setShowPolicyModal(true);
  };

  // ฟังก์ชัน Login จริง (เรียกเมื่อกดปุ่มยอมรับใน Modal)
  const performGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/select-role',
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        },
      }
    });
    if (error) {
      alert(error.message);
      setLoading(false);
    }
  };

  return (
    // 🔥 Layout Fix: ใช้ h-full + overflow-y-auto เพื่อให้เลื่อนได้ในมือถือ
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-transparent font-sans relative safe-pb">

      {/* ✅ ส่วน SEO: หน้าแรกสำคัญที่สุด! */}
      <Helmet>
        <title>Soulis - พื้นที่ปลอดภัยสำหรับใจคุณ (ไม่ระบุตัวตน)</title>
        <meta
          name="description"
          content="เข้าสู่ระบบ Soulis เว็บไซต์ระบายความในใจและหาเพื่อนรับฟังแบบไม่ระบุตัวตน ปลอดภัย เป็นกันเอง และใช้งานฟรี"
        />
        <link rel="canonical" href="https://soulis.in.th/" />

        {/* Open Graph สำหรับเวลาแชร์ลง Facebook/Line */}
        <meta property="og:title" content="Soulis - พื้นที่ปลอดภัยสำหรับใจคุณ" />
        <meta property="og:description" content="มาคุยกันนะ... ที่นี่มีคนพร้อมรับฟังคุณเสมอ 💜" />
        <meta property="og:url" content="https://soulis.in.th/" />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Container กลางจอ */}
      <div className="min-h-full w-full flex items-center justify-center p-4 py-10">

        {/* Background Decor */}
        <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-soulis-500/20 rounded-full blur-[120px] animate-float-slow pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-soulis-accent/10 rounded-full blur-[120px] animate-float-slow delay-1000 pointer-events-none"></div>

        {/* Main Card */}
        <div className="bg-soulis-800/60 backdrop-blur-xl border border-white/10 p-8 md:p-12 rounded-[2rem] shadow-2xl w-full max-w-md relative z-10 flex flex-col items-center gap-8 mb-10 text-center animate-float">

          {/* Logo Section */}
          <div>
            <div className="w-20 h-20 bg-gradient-to-tr from-soulis-500 to-purple-500 rounded-3xl rotate-3 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-purple-500/30">
              <Sparkles className="text-white w-10 h-10 animate-pulse" />
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-white via-soulis-200 to-soulis-400 bg-clip-text text-transparent drop-shadow-sm mb-2">
              Soulis
            </h1>
            <p className="text-soulis-300 text-sm font-light tracking-wider">
              พื้นที่ปลอดภัยของใจดวงน้อย 💜
            </p>
          </div>

          {/* Divider สวยๆ */}
          <div className="w-full border-t border-white/5 relative">
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-soulis-800/80 px-3 text-xs text-gray-500">
              เริ่มต้นใช้งาน
            </span>
          </div>

          {/* 🔥 Google Button */}
          <button
            onClick={handleStartLogin}
            disabled={loading}
            className="w-full group relative bg-white hover:bg-gray-50 text-gray-900 py-4 rounded-2xl font-bold flex items-center justify-center gap-3 transition-all transform active:scale-95 shadow-xl hover:shadow-2xl hover:shadow-white/10 overflow-hidden"
          >
            {loading ? (
              <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-gray-900 rounded-full"></div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                <span className="text-lg">เข้าสู่ระบบด้วย Google</span>
                <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-gray-900 group-hover:translate-x-1 transition-all" />
              </>
            )}
          </button>

          {/* Footer Text (ลิงก์กดได้แล้ว!) */}
          <p className="text-xs text-gray-500 mt-2">
            การเข้าสู่ระบบถือว่าท่านยอมรับ <br />
            <span
              onClick={handleStartLogin}
              className="text-soulis-400 underline cursor-pointer hover:text-white transition"
            >
              ข้อตกลงการใช้งาน
            </span>
            {' '}และ{' '}
            <span
              onClick={handleStartLogin}
              className="text-soulis-400 underline cursor-pointer hover:text-white transition"
            >
              นโยบายความเป็นส่วนตัว
            </span>
          </p>

        </div>
      </div>

      {/* 🔥 Policy Modal (เด้งขึ้นมาก่อน Login) */}
      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-soulis-800 border border-soulis-500/30 text-white w-full max-w-lg rounded-3xl shadow-2xl p-8 relative flex flex-col gap-4">

            {/* Modal Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-soulis-500/20 rounded-lg text-soulis-300">
                  <Shield size={24} />
                </div>
                <h3 className="text-xl font-bold text-white">ข้อตกลงก่อนเข้าใช้งาน</h3>
              </div>
              <button onClick={() => setShowPolicyModal(false)} className="text-gray-400 hover:text-white transition bg-white/5 p-2 rounded-full hover:bg-white/10"><X size={20} /></button>
            </div>

            {/* Modal Content */}
            <div className="text-sm text-gray-300 space-y-4 leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5 max-h-[40vh] overflow-y-auto custom-scrollbar">
              <p>ยินดีต้อนรับสู่ <strong>Soulis</strong> พื้นที่ปลอดภัยสำหรับการระบายและรับฟัง</p>
              <ul className="list-disc pl-5 space-y-2 text-gray-400">
                <li>เราเก็บข้อมูล <strong>ชื่อผู้ใช้ (Google Name)</strong> และ <strong>อีเมล</strong> เพื่อการยืนยันตัวตนเท่านั้น</li>
                <li>ข้อมูลการสนทนาเป็นแบบกึ่งนิรนาม (Semi-Anonymous)</li>
                <li><span className="text-red-400 font-bold">ห้าม</span> ใช้ถ้อยคำหยาบคาย คุกคาม หรือชักชวนไปในทางที่ผิดกฎหมาย</li>
                <li>หากทำผิดกฎ บัญชีอาจถูกระงับถาวรทันที</li>
              </ul>
              <p className="text-center text-soulis-300 italic pt-2">"ช่วยกันรักษาพื้นที่นี้ ให้เป็นเซฟโซนของทุกคนนะคะ"</p>
            </div>

            {/* Action Buttons */}
            <div className="grid gap-3 pt-2">
              <button
                onClick={performGoogleLogin}
                className="w-full bg-gradient-to-r from-soulis-600 to-soulis-500 hover:from-soulis-500 hover:to-soulis-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-soulis-900/50 transform transition active:scale-95 flex justify-center items-center gap-2"
              >
                ยอมรับและดำเนินการต่อ <ArrowRight size={18} />
              </button>
              <button
                onClick={() => setShowPolicyModal(false)}
                className="text-gray-500 text-sm hover:text-gray-300 transition"
              >
                ยกเลิก
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}