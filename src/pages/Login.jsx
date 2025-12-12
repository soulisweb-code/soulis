import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Sparkles, X, CheckSquare, Square } from 'lucide-react';

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToPolicy, setAgreedToPolicy] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  
  // 🔥 เพิ่ม State ตัวนี้: เอาไว้จำว่า "เมื่อกี้เขากดปุ่ม Google ใช่ไหม?"
  const [isGoogleLogin, setIsGoogleLogin] = useState(false);
  
  const navigate = useNavigate();

  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isValidEmail(email)) throw new Error("รูปแบบอีเมลไม่ถูกต้อง");
      
      if (mode === 'register') {
        if (!agreedToPolicy) throw new Error("กรุณายอมรับนโยบายก่อนสมัคร");
        if (password.length < 6) throw new Error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
        if (password !== confirmPassword) throw new Error("รหัสผ่านไม่ตรงกัน");
        if (!username.trim()) throw new Error("กรุณาตั้งชื่อ Username");

        const { data: existingUser } = await supabase.from('profiles').select('username').eq('username', username).single();
        if (existingUser) throw new Error("ชื่อ Username นี้มีคนใช้แล้ว");

        const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { username } } });
        if (error) throw error;

        const { error: profileError } = await supabase.from('profiles').insert([{ id: data.user.id, username }]);
        if (profileError) console.error("Profile creation error:", profileError);

        alert('🎉 สมัครสำเร็จ! ยินดีต้อนรับสู่ Soulis');
        setMode('login');
      } 
      else if (mode === 'login') {
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");

        const { data: profile } = await supabase.from('profiles').select('is_banned, role').eq('id', authData.user.id).single();

        if (profile && profile.is_banned) {
          await supabase.auth.signOut(); 
          throw new Error("⛔ บัญชีถูกระงับการใช้งาน");
        }

        if (profile && profile.role === 'admin') {
            sessionStorage.setItem('soulis_admin_role', 'true');
            navigate('/admin-dashboard');
            return;
        }

        navigate('/select-role');
      }
      else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(email);
        if (error) throw error;
        alert('📧 ส่งลิงก์รีเซ็ตไปที่อีเมลแล้ว');
        setMode('login');
      }
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // ฟังก์ชัน Login จริงๆ (จะถูกเรียกหลังจากกดตกลงใน Modal)
  const performGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin + '/select-role' }
    });
    if (error) alert(error.message);
  };

  // 🔥 ฟังก์ชันเมื่อกดปุ่ม Google (แค่เปิด Modal ยังไม่ล็อกอิน)
  const handleGoogleClick = () => {
    setIsGoogleLogin(true); // จำไว้ว่าคนนี้กด Google
    setShowPolicyModal(true); // เปิด Modal
  };

  // 🔥 ฟังก์ชันเมื่อกดปุ่ม "รับทราบ" ใน Modal
  const handlePolicyAccept = () => {
    setShowPolicyModal(false);
    setAgreedToPolicy(true); // ติ๊กถูกให้อัตโนมัติ

    // ถ้าเมื่อกี้กด Google มา -> ให้เด้งไปหน้า Google เลย
    if (isGoogleLogin) {
        performGoogleLogin();
        setIsGoogleLogin(false); // Reset ค่า
    }
  };

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden bg-soulis-900 font-sans relative">
      <div className="min-h-full w-full flex items-center justify-center p-4 py-10">

        <div className="fixed top-[-10%] left-[-10%] w-[600px] h-[600px] bg-soulis-500/20 rounded-full blur-[120px] animate-float-slow pointer-events-none"></div>
        <div className="fixed bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-soulis-accent/10 rounded-full blur-[120px] animate-float-slow delay-1000 pointer-events-none"></div>

        <div className="bg-soulis-800/60 backdrop-blur-xl border border-white/10 p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md relative z-10 flex flex-col gap-6 mb-10">
          <div className="text-center">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-soulis-300 via-white to-soulis-accent bg-clip-text text-transparent flex items-center justify-center gap-2 drop-shadow-lg">
              Soulis <Sparkles className="text-yellow-400 animate-pulse" size={32} />
            </h1>
            <p className="text-soulis-300 text-sm font-light mt-2 tracking-wide">พื้นที่ปลอดภัยของใจดวงน้อย 💜</p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
             {mode === 'register' && (
                <div className="relative group">
                  <User className="absolute left-4 top-3.5 text-soulis-400 group-focus-within:text-soulis-accent transition" size={20} />
                  <input type="text" placeholder="Username" className="w-full bg-black/30 border border-soulis-700/50 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-soulis-500 transition" value={username} onChange={e => setUsername(e.target.value)} />
                </div>
              )}
              <div className="relative group">
                <Mail className="absolute left-4 top-3.5 text-soulis-400 group-focus-within:text-soulis-accent transition" size={20} />
                <input type="email" placeholder="Email Address" className="w-full bg-black/30 border border-soulis-700/50 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-soulis-500 transition" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              {mode !== 'forgot' && (
                <div className="relative group">
                  <Lock className="absolute left-4 top-3.5 text-soulis-400 group-focus-within:text-soulis-accent transition" size={20} />
                  <input type="password" placeholder="Password" className="w-full bg-black/30 border border-soulis-700/50 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-soulis-500 transition" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>
              )}
              {mode === 'register' && (
                <>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-3.5 text-soulis-400/70 transition" size={20} />
                    <input type="password" placeholder="Confirm Password" className="w-full bg-black/30 border border-soulis-700/50 text-white rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-soulis-500 transition" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />
                  </div>
                  <div className="flex items-center gap-2 text-sm text-soulis-300 ml-1 cursor-pointer" onClick={() => setAgreedToPolicy(!agreedToPolicy)}>
                     <button type="button" className="focus:outline-none">{agreedToPolicy ? <CheckSquare className="text-soulis-accent" size={20} /> : <Square className="text-soulis-500" size={20} />}</button>
                     <span>ฉันยอมรับ <span onClick={(e) => {e.stopPropagation(); setShowPolicyModal(true)}} className="text-white underline hover:text-soulis-accent font-bold">นโยบาย</span></span>
                  </div>
                </>
              )}
              <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-soulis-600 to-soulis-500 hover:from-soulis-500 hover:to-soulis-400 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-soulis-900/50 transform transition active:scale-95 flex justify-center items-center gap-2 mt-4 border border-white/10">
                {loading ? 'กำลังโหลด...' : mode === 'login' ? 'เข้าสู่ระบบ' : mode === 'register' ? 'สมัครสมาชิก' : 'ส่งลิงก์กู้คืน'}
                {!loading && <ArrowRight size={20} />}
              </button>
          </form>

          <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-white/10"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">หรือ</span>
              <div className="flex-grow border-t border-white/10"></div>
          </div>

          {/* 🔥 แก้ปุ่มนี้: เปลี่ยนจาก handleGoogleLogin เป็น handleGoogleClick */}
          <button onClick={handleGoogleClick} className="w-full bg-white text-gray-900 hover:bg-gray-100 py-3 rounded-xl font-bold flex items-center justify-center gap-3 transition transform active:scale-95 shadow-lg">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" /> เข้าสู่ระบบด้วย Google
          </button>

          <div className="text-center text-sm text-soulis-400 space-y-2 pt-2 border-t border-white/5">
            {mode === 'login' && (
              <>
                <p>ยังไม่มีบัญชี? <button onClick={() => setMode('register')} className="text-white hover:text-soulis-accent font-bold underline ml-1">สมัครเลย</button></p>
                <button onClick={() => setMode('forgot')} className="hover:text-white">ลืมรหัสผ่าน?</button>
              </>
            )}
            {mode === 'register' && <p>มีบัญชีแล้ว? <button onClick={() => setMode('login')} className="text-white hover:text-soulis-accent font-bold underline ml-1">เข้าสู่ระบบ</button></p>}
            {mode === 'forgot' && <button onClick={() => setMode('login')} className="text-white hover:text-soulis-accent">← กลับไปหน้าเข้าสู่ระบบ</button>}
          </div>

        </div>
      </div>

      {showPolicyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-soulis-800 border border-soulis-600 text-white w-full max-w-lg rounded-2xl shadow-2xl p-6 relative animate-float">
            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
              <h3 className="text-xl font-bold text-white">นโยบายความเป็นส่วนตัว</h3>
              <button onClick={() => setShowPolicyModal(false)}><X /></button>
            </div>
            <div className="text-sm text-gray-300 space-y-3 leading-relaxed">
                <p>1. ข้อมูลที่เราเก็บ: ชื่อผู้ใช้, อีเมล, รหัสผ่าน (เข้ารหัส)</p>
                <p>2. การใช้งาน: เพื่อจับคู่สนทนาเท่านั้น</p>
                <p>3. ความปลอดภัย: แชทเป็นแบบกึ่งนิรนาม</p>
                <p>4. กฎ: ห้ามหยาบคาย ห้ามคุกคาม</p>
                <p className="text-center text-soulis-accent pt-2">"เพราะเราแคร์ความรู้สึกของคุณ"</p>
            </div>
            {/* 🔥 แก้ปุ่มนี้: ให้เรียก handlePolicyAccept แทน */}
            <button onClick={handlePolicyAccept} className="w-full bg-soulis-600 hover:bg-soulis-500 mt-6 py-3 rounded-xl font-bold transition">
                {isGoogleLogin ? "ยอมรับและดำเนินการต่อด้วย Google" : "รับทราบ"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}