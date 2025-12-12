import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { User, LogOut, ChevronLeft, Mail, Calendar, Shield, Edit3 } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/');
        return;
      }
      setEmail(user.email);

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      setProfile(data);
      setLoading(false);
    };
    getProfile();
  }, [navigate]);

  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center text-white bg-soulis-900">Loading...</div>;

  return (
    // 🔥 แก้ไข Layout หลัก: h-full + overflow-y-auto เพื่อให้หน้านี้เลื่อนได้
    <div className="h-full w-full overflow-y-auto overflow-x-hidden font-sans relative bg-soulis-900">
      
      {/* Wrapper ชั้นใน: จัดกึ่งกลาง + เว้นขอบบนล่าง (pt-24, pb-32) ไม่ให้โดนบัง */}
      <div className="min-h-full flex flex-col items-center p-6 pt-24 pb-32">

        {/* Background Decor */}
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-soulis-800 via-soulis-900 to-black opacity-80 pointer-events-none -z-10"></div>
        
        {/* ปุ่มย้อนกลับ */}
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-soulis-300 hover:text-white transition flex items-center gap-1 bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm z-20">
            <ChevronLeft size={20}/> กลับ
        </button>

        {/* Avatar ใหญ่ๆ */}
        <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-tr from-soulis-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-float">
                <User size={64} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-md">
                <Shield size={20} className={profile?.role === 'admin' ? "text-red-400" : "text-green-400"} />
            </div>
        </div>

        {/* ชื่อ User */}
        <h1 className="text-3xl font-bold text-white mb-2">{profile?.username || 'Unknown'}</h1>
        <p className="text-soulis-300 text-sm mb-8 bg-white/5 px-4 py-1 rounded-full border border-white/5">
            {profile?.role === 'admin' ? '👑 Administrator' : '✨ Soulis Member'}
        </p>

        {/* การ์ดข้อมูล */}
        <div className="w-full max-w-md space-y-4">
            
            {/* อีเมล */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-300">
                    <Mail size={20}/>
                </div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-400 uppercase tracking-wider">อีเมล</p>
                    <p className="text-white truncate">{email}</p>
                </div>
            </div>

            {/* วันที่สมัคร */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition">
                <div className="bg-purple-500/20 p-3 rounded-full text-purple-300">
                    <Calendar size={20}/>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">เข้าร่วมเมื่อ</p>
                    <p className="text-white">{new Date(profile?.created_at).toLocaleDateString('th-TH')}</p>
                </div>
            </div>

            {/* สถานะบัญชี */}
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition">
                <div className={`${profile?.is_banned ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'} p-3 rounded-full`}>
                    <Shield size={20}/>
                </div>
                <div>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">สถานะบัญชี</p>
                    <p className={`${profile?.is_banned ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}`}>
                        {profile?.is_banned ? 'ถูกระงับการใช้งาน' : 'ปกติ (Active)'}
                    </p>
                </div>
            </div>

        </div>

        {/* ปุ่ม Logout */}
        <button 
            onClick={handleLogout}
            className="mt-10 w-full max-w-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95"
        >
            <LogOut size={20} /> ออกจากระบบ
        </button>

        <p className="mt-6 text-xs text-gray-600">User ID: {profile?.id}</p>

      </div>
    </div>
  );
}