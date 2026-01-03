import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const checkUserAndProfile = async () => {
      // 1. เช็ค User จาก Auth
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        navigate('/'); // ถ้าไม่ได้ Login ดีดกลับหน้าแรก
        return;
      }
      
      setUserId(user.id);

      // 2. เช็คว่ามีข้อมูลในตาราง profiles หรือยัง?
      // ใช้ maybeSingle() เพื่อไม่ให้ error แดงถ้าหาไม่เจอ (จะ return null แทน)
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      // 3. ถ้าหาไม่เจอ (Profile เป็น null) แปลว่ายังไม่ได้สร้าง -> ให้สร้างใหม่เลย (Manual Sync)
      if (!profile) {
        console.log("Profile not found, creating new one...");
        
        // ดึงชื่อจาก Google หรือ Email
        const googleName = user.user_metadata?.full_name;
        const emailName = user.email?.split('@')[0];
        const displayName = googleName || emailName || 'Unknown User';

        // สร้าง Profile ใหม่
        const { error: insertError } = await supabase.from('profiles').insert({
            id: user.id,
            username: displayName,
            // email: user.email, // ⚠️ บรรทัดนี้เปิดใช้เฉพาะถ้าในตาราง profiles มี column 'email'
            role: 'user',
            is_banned: false,
        });

        if (insertError) {
            console.error("Error creating profile:", insertError.message);
        } else {
            console.log("✅ Profile created successfully!");
        }
      }
    };

    checkUserAndProfile();
  }, [navigate]);

  const chooseRole = async (role) => {
    if (!userId) return;

    sessionStorage.clear();
    const token = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('soulis_session', token);

    const storageKey = `soulis_seen_${userId}_${role}`;
    const hasSeenInstruction = localStorage.getItem(storageKey);

    if (hasSeenInstruction) {
        navigate('/waiting', { state: { myRole: role, token: token } });
    } else {
        navigate('/instruction', { state: { myRole: role, token: token, uid: userId } });
    }
  };

  return (
    // 🔥 แก้ไข Layout หลัก: ให้เลื่อนได้ และมีความสูงเต็มจอ
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-transparent font-sans relative safe-pb">
      
      {/* ✅ ส่วน SEO: เปลี่ยนชื่อ Title ตามบริบทการใช้งาน */}
      <Helmet>
        <title>เลือกบทบาท - Soulis คุณอยากระบายหรือรับฟัง?</title>
        <meta name="robots" content="noindex" /> {/* หน้านี้เป็นหน้าภายในที่ต้องล็อกอิน ไม่จำเป็นต้องให้ Google เก็บข้อมูล */}
      </Helmet>

      {/* 🔥 จุดสำคัญที่แก้: 
          - pt-24: เว้นขอบบนเยอะๆ ไม่ให้ข้อความไปชนปุ่ม Profile หรือขอบจอ
          - pb-32: เว้นขอบล่างเยอะๆ ไม่ให้ปุ่ม Listener โดน Footer บัง
      */}
      <div className="min-h-full flex flex-col items-center justify-center p-6 pt-24 pb-32">

        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-soulis-800 via-soulis-900 to-black opacity-80 pointer-events-none -z-10"></div>
        
        <div className="absolute top-6 right-6 z-20">
           <button onClick={() => navigate('/profile')} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full backdrop-blur-md border border-white/10 transition-all hover:border-white/30 shadow-lg shadow-soulis-900/50 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-soulis-500 to-pink-500 rounded-full flex items-center justify-center"><UserCircle size={20} /></div>
            <span className="font-medium group-hover:text-soulis-300">โปรไฟล์</span>
          </button>
        </div>

        <div className="relative z-10 text-center space-y-4 mb-12 mt-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
              วันนี้ <span className="text-transparent bg-clip-text bg-gradient-to-r from-soulis-300 to-soulis-accent">ใจของคุณ</span> เป็นแบบไหน?
            </h2>
            <p className="text-soulis-200/80 text-lg font-light">เลือกบทบาทที่คุณต้องการเป็นในตอนนี้...</p>
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row gap-8 w-full max-w-4xl px-4">
          <button onClick={() => chooseRole('talker')} 
            className="flex-1 group relative overflow-hidden rounded-[2.5rem] p-[1px] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(244,63,94,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500 via-purple-500 to-orange-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full bg-[#1a0b2e]/90 backdrop-blur-xl rounded-[2.4rem] p-10 flex flex-col items-center justify-center text-center group-hover:bg-[#1a0b2e]/80 transition-colors border border-white/5">
                <div className="bg-rose-500/20 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-rose-500/50">
                    <span className="text-6xl drop-shadow-lg">🗣️</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-rose-300 transition-colors">ผู้ระบาย</h3>
                <p className="text-gray-400 group-hover:text-gray-200">ฉันมีเรื่องไม่สบายใจ<br/>อยากเล่าให้ใครสักคนฟัง</p>
            </div>
          </button>

          <button onClick={() => chooseRole('listener')} 
            className="flex-1 group relative overflow-hidden rounded-[2.5rem] p-[1px] transition-all duration-500 hover:scale-105 hover:shadow-[0_0_50px_rgba(16,185,129,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 opacity-70 group-hover:opacity-100 transition-opacity"></div>
            <div className="relative h-full bg-[#1a0b2e]/90 backdrop-blur-xl rounded-[2.4rem] p-10 flex flex-col items-center justify-center text-center group-hover:bg-[#1a0b2e]/80 transition-colors border border-white/5">
                <div className="bg-emerald-500/20 p-6 rounded-full mb-6 group-hover:scale-110 transition-transform duration-500 ring-1 ring-emerald-500/50">
                    <span className="text-6xl drop-shadow-lg">👂</span>
                </div>
                <h3 className="text-3xl font-bold text-white mb-2 group-hover:text-emerald-300 transition-colors">ผู้รับฟัง</h3>
                <p className="text-gray-400 group-hover:text-gray-200">ฉันพร้อมรับฟัง<br/>และเป็นกำลังใจให้เพื่อนมนุษย์</p>
            </div>
          </button>
        </div>

      </div>
    </div>
  );
}