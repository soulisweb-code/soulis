import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import { ShieldCheck, Lock, ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem('soulis_admin_role');
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
      if (authError) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

      const { data: profile, error: profileError } = await supabase.from('profiles').select('role').eq('id', authData.user.id).single();
      if (profileError) throw profileError;

      if (profile.role === 'admin') {
        sessionStorage.setItem('soulis_admin_role', 'true'); 
        navigate('/admin-dashboard', { replace: true });
      } else {
        await supabase.auth.signOut();
        alert("⛔ คุณไม่มีสิทธิ์เข้าถึงส่วนนี้!");
      }
    } catch (error) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-soulis-900 font-sans">
      
      {/* ✅ ส่วน SEO: ป้องกัน Google เข้าถึงหน้า Login แอดมิน */}
      <Helmet>
        <title>Admin Login - Soulis Restricted Area</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-red-900/20 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-purple-900/20 rounded-full blur-[120px] animate-float-slow delay-1000"></div>
      
      <div className="bg-soulis-800/80 backdrop-blur-xl border border-red-500/30 p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-4">
            <div className="bg-red-500/10 p-5 rounded-full border border-red-500/30 shadow-[0_0_30px_rgba(239,68,68,0.2)] animate-float">
                <ShieldCheck size={48} className="text-red-500" />
            </div>
            <div className="text-center">
                <h1 className="text-2xl font-bold text-white tracking-widest uppercase">Admin Portal 🔒</h1>
                <p className="text-red-300/70 text-xs mt-1">พื้นที่เฉพาะเจ้าหน้าที่เท่านั้น</p>
            </div>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-5 mt-2">
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block font-semibold">Admin Email</label>
            <input type="email" className="w-full bg-black/40 border border-gray-600/50 text-white p-3 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition placeholder-gray-600" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="text-gray-400 text-xs uppercase tracking-wider mb-2 block font-semibold">Password</label>
            <div className="relative">
                <Lock className="absolute left-3 top-3.5 text-gray-500" size={18}/>
                <input type="password" className="w-full bg-black/40 border border-gray-600/50 text-white p-3 pl-10 rounded-xl focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition placeholder-gray-600" value={password} onChange={e => setPassword(e.target.value)} required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-red-700 to-red-600 hover:from-red-600 hover:to-red-500 text-white py-3.5 rounded-xl font-bold transition shadow-lg shadow-red-900/40 mt-2 flex items-center justify-center gap-2">
            {loading ? 'Checking...' : 'ACCESS CONTROL'}
            {!loading && <ArrowRight size={18} />}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-white/5">
            <button onClick={() => navigate('/')} className="text-gray-500 hover:text-white text-sm transition">← กลับหน้าหลัก</button>
        </div>
      </div>
    </div>
  );
}