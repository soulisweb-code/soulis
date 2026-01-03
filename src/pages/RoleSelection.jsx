import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserCircle, Loader2, AlertCircle, LogOut } from 'lucide-react';
import { supabase } from '../supabaseClient';
import { Helmet } from 'react-helmet-async';

export default function RoleSelection() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState('กำลังยืนยันตัวตน...');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      // 1. ลองดึง Session ปัจจุบันก่อน
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.error("Session Error:", error);
        if(mounted) setErrorMsg("เกิดข้อผิดพลาดของ Session: " + error.message);
        setLoading(false);
        return;
      }

      if (session?.user) {
        if(mounted) setStatusMsg("เข้าสู่ระบบสำเร็จ กำลังตรวจสอบข้อมูล...");
        await checkAndCreateProfile(session.user);
        if(mounted) setLoading(false);
      } else {
        // ถ้ายังไม่มี Session ให้รอ Listener ทำงาน (เผื่อกำลัง Redirect มา)
        console.log("No session yet, waiting for auth state change...");
      }
    };

    // 2. ดักจับ Event เมื่อ Google ส่งข้อมูลกลับมา
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log("Auth Event:", event);
      
      if (event === 'SIGNED_IN' && session?.user) {
        if(mounted) setStatusMsg("ยืนยันตัวตนเรียบร้อย กำลังสร้างข้อมูล...");
        await checkAndCreateProfile(session.user);
        if(mounted) setLoading(false);
      } 
      else if (event === 'SIGNED_OUT') {
        // ไม่ต้องทำอะไร ปล่อยให้ User กดปุ่มกลับเอง ถ้าต้องการ
        if(mounted) setLoading(false);
      }
    });

    initAuth();

    return () => {
      mounted = false;
      authListener.subscription.unsubscribe();
    };
  }, []);

  const checkAndCreateProfile = async (user) => {
    try {
        // 1. เช็คว่ามี Profile หรือยัง
        const { data: profile, error: fetchError } = await supabase
            .from('profiles')
            .select('id')
            .eq('id', user.id)
            .maybeSingle();

        if (fetchError) {
             console.error("Fetch Profile Error:", fetchError);
             // ไม่ซีเรียส อาจจะแค่เน็ตหลุด หรือ RLS บล็อก Select
        }

        // 2. ถ้าไม่มี Profile -> สร้างใหม่
        if (!profile) {
            console.log("Creating new profile for:", user.email);
            
            const googleName = user.user_metadata?.full_name;
            const displayName = googleName || user.email?.split('@')[0] || 'Soulis User';

            // 🔥 ใส่ email ลงไปด้วย เผื่อ DB บังคับ (เปิดบรรทัด email)
            const { error: insertError } = await supabase.from('profiles').insert({
                id: user.id,
                username: displayName,
                email: user.email, 
                role: 'user',
                is_banned: false
            });

            if (insertError) {
                console.error("INSERT FAILED:", insertError);
                // 🔥 โชว์ Error ให้เห็นชัดๆ บนหน้าจอ
                setErrorMsg(`สร้าง User ไม่ได้: ${insertError.message} (Code: ${insertError.code})`);
            } else {
                console.log("✅ Profile created successfully");
            }
        }
    } catch (err) {
        console.error("Unexpected Error:", err);
        setErrorMsg("เกิดข้อผิดพลาดที่ไม่คาดคิด: " + err.message);
    }
  };

  const chooseRole = async (role) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    sessionStorage.clear();
    const token = `session_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    sessionStorage.setItem('soulis_session', token);

    const storageKey = `soulis_seen_${user.id}_${role}`;
    const hasSeenInstruction = localStorage.getItem(storageKey);

    if (hasSeenInstruction) {
        navigate('/waiting', { state: { myRole: role, token: token } });
    } else {
        navigate('/instruction', { state: { myRole: role, token: token, uid: user.id } });
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  }

  // 🔥 หน้าจอ Loading / Error (ไม่ดีดกลับเองแล้ว)
  if (loading || errorMsg) {
      return (
        <div className="h-screen w-full flex flex-col items-center justify-center bg-soulis-900 text-white gap-6 p-6 text-center font-sans">
            {errorMsg ? (
                <div className="bg-red-500/10 border border-red-500/50 p-8 rounded-3xl max-w-md shadow-2xl animate-bounce-in">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4"/>
                    <h2 className="text-xl font-bold text-red-200 mb-2">เกิดข้อผิดพลาด</h2>
                    <p className="text-red-200/80 mb-6 font-mono text-sm break-words">{errorMsg}</p>
                    <div className="flex gap-3 justify-center">
                        <button onClick={() => window.location.reload()} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded-xl transition">ลองใหม่</button>
                        <button onClick={handleLogout} className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-xl font-bold transition">กลับหน้าหลัก</button>
                    </div>
                </div>
            ) : (
                <>
                    <Loader2 size={48} className="animate-spin text-soulis-400" />
                    <div>
                        <h2 className="text-2xl font-bold animate-pulse">{statusMsg}</h2>
                        <p className="text-soulis-300 text-sm mt-2 opacity-70">กำลังเชื่อมต่อกับฐานข้อมูล...</p>
                    </div>
                </>
            )}
        </div>
      );
  }

  return (
    <div className="h-[100dvh] w-full overflow-y-auto overflow-x-hidden bg-transparent font-sans relative safe-pb">
      <Helmet>
        <title>เลือกบทบาท - Soulis</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="min-h-full flex flex-col items-center justify-center p-6 pt-24 pb-32">
        
        {/* Background */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-soulis-800 via-soulis-900 to-black opacity-80 pointer-events-none -z-10"></div>
        
        {/* Profile Button */}
        <div className="absolute top-6 right-6 z-20">
           <button onClick={() => navigate('/profile')} className="flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-5 py-3 rounded-full backdrop-blur-md border border-white/10 transition-all hover:border-white/30 shadow-lg shadow-soulis-900/50 group">
            <div className="w-8 h-8 bg-gradient-to-tr from-soulis-500 to-pink-500 rounded-full flex items-center justify-center"><UserCircle size={20} /></div>
            <span className="font-medium group-hover:text-soulis-300">โปรไฟล์</span>
          </button>
        </div>

        {/* Title */}
        <div className="relative z-10 text-center space-y-4 mb-12 mt-4">
            <h2 className="text-4xl md:text-6xl font-bold text-white drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] tracking-tight">
              วันนี้ <span className="text-transparent bg-clip-text bg-gradient-to-r from-soulis-300 to-soulis-accent">ใจของคุณ</span> เป็นแบบไหน?
            </h2>
            <p className="text-soulis-200/80 text-lg font-light">เลือกบทบาทที่คุณต้องการเป็นในตอนนี้...</p>
        </div>
        
        {/* Cards */}
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