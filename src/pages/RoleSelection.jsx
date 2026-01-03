import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Loader2 } from 'lucide-react'; // เพิ่ม Icon Loader
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true); // 🔥 เพิ่มสถานะ Loading

  useEffect(() => {
    // 🔥 ใช้ onAuthStateChange แทน getUser เพื่อความชัวร์หลัง Redirect
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      
      if (session?.user) {
        setUserId(session.user.id);
        await checkAndCreateProfile(session.user);
        setLoading(false); // โหลดเสร็จแล้ว ปล่อยให้เข้าใช้งาน
      } else if (event === 'SIGNED_OUT' || !session) {
        // ถ้าไม่มี Session จริงๆ ค่อยดีดกลับ
        // แต่เราจะหน่วงเวลาเล็กน้อยเพื่อให้แน่ใจว่าไม่ใช่แค่เน็ตช้า
        setTimeout(() => {
            // เช็คอีกที
            supabase.auth.getSession().then(({ data }) => {
                if (!data.session) navigate('/');
            });
        }, 500);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // ฟังก์ชันแยกสำหรับสร้าง Profile (เพื่อให้ Code อ่านง่าย)
  const checkAndCreateProfile = async (user) => {
    try {
        // 1. ลองดึงข้อมูล Profile
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle(); // ใช้ maybeSingle เพื่อไม่ให้ error แดง

        // 2. ถ้าไม่มี Profile -> สร้างใหม่ทันที
        if (!profile) {
            console.log("Creating new profile...");
            
            // ดึงชื่อจาก Google Metadata
            const googleName = user.user_metadata?.full_name;
            const emailName = user.email?.split('@')[0];
            const displayName = googleName || emailName || 'Unknown Soul';

            const { error: insertError } = await supabase.from('profiles').insert({
                id: user.id,
                username: displayName,
                // email: user.email, // ⚠️ เปิดบรรทัดนี้ถ้า Database มี column email
                role: 'user',
                is_banned: false
            });

            if (insertError) {
                console.error("Failed to create profile:", insertError.message);
                // ⚠️ ถ้าขึ้น Error ตรงนี้ แปลว่าลืมตั้งค่า RLS Policy ใน Supabase (ดูวิธีแก้ด้านล่าง)
            } else {
                console.log("✅ Profile created:", displayName);
            }
        }
    } catch (err) {
        console.error("Error checking profile:", err);
    }
  };

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

  // 🔥 แสดงหน้า Loading ก่อน เพื่อกันการกระพริบหรือ Redirect ผิดพลาด
  if (loading) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-soulis-900 text-white gap-4">
            <Loader2 size={48} className="animate-spin text-soulis-400" />
            <p className="animate-pulse text-soulis-200">กำลังเชื่อมต่อกับจิตวิญญาณของคุณ...</p>
        </div>
      );
  }

  return (
    // 🔥 แก้ไข Layout หลัก: ให้เลื่อนได้ และมีความสูงเต็มจอ
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-transparent font-sans relative safe-pb">
      
      <Helmet>
        <title>เลือกบทบาท - Soulis คุณอยากระบายหรือรับฟัง?</title>
        <meta name="robots" content="noindex" />
      </Helmet>

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