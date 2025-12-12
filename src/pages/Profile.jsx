import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, LogOut, Save, ChevronLeft, Star, Edit3 } from 'lucide-react';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState('0.0');
  const [newName, setNewName] = useState('');
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const navigate = useNavigate();

  const maskEmail = (email) => { if (!email) return ''; const [name, domain] = email.split('@'); return `${name.substring(0, 3)}******@${domain}`; };

  useEffect(() => {
    const getData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/');
      setUser(user);
      const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(profileData);
      setNewName(profileData?.username || '');
      const { data: reviewsData } = await supabase.from('reviews').select('*').eq('target_user_id', user.id).order('created_at', { ascending: false });
      setReviews(reviewsData || []);
      if (reviewsData && reviewsData.length > 0) {
        const total = reviewsData.reduce((sum, r) => sum + r.rating, 0);
        const avg = (total / reviewsData.length).toFixed(1);
        setAverageRating(avg);
      } else { setAverageRating('New'); }
      setLoading(false);
    };
    getData();
  }, [navigate]);

  const handleUpdateProfile = async () => { if (!newName.trim()) return alert("ชื่อห้ามว่างนะ!"); await supabase.from('profiles').update({ username: newName }).eq('id', user.id); alert('✅ อัปเดตชื่อเรียบร้อย!'); };
  const handleChangePassword = async () => { if (newPassword.length < 6) return alert("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร"); const { error } = await supabase.auth.updateUser({ password: newPassword }); if (error) alert(`เกิดข้อผิดพลาด: ${error.message}`); else { alert('✅ เปลี่ยนรหัสผ่านสำเร็จ!'); setIsEditingPassword(false); setNewPassword(''); } };
  const handleLogout = async () => { if (confirm("จะออกจากระบบจริงๆ หรือ?")) { await supabase.auth.signOut(); navigate('/'); } };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-white">กำลังโหลดข้อมูล...</div>;

  return (
    <div className="min-h-full flex flex-col items-center justify-center p-6 pt-24 pb-32">
       <div className="w-full max-w-2xl relative z-10 space-y-6">
        <button onClick={() => navigate('/select-role')} className="text-soulis-300 hover:text-white flex items-center gap-2 mb-4 transition"><ChevronLeft /> กลับหน้าหลัก</button>

        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-2xl animate-float">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-8">
                <div className="w-24 h-24 bg-gradient-to-br from-soulis-500 to-soulis-700 rounded-full flex items-center justify-center shadow-lg border-4 border-white/10">
                    <User size={48} className="text-white" />
                </div>
                <div className="text-center md:text-left flex-1">
                    <h1 className="text-3xl font-bold text-white mb-2">โปรไฟล์ของฉัน</h1>
                    <div className="flex items-center justify-center md:justify-start gap-4">
                        <span className="text-soulis-200 text-sm bg-white/10 px-3 py-1 rounded-full border border-white/5">{user?.role === 'authenticated' ? 'สมาชิกทั่วไป' : 'Guest'}</span>
                        <div className="flex items-center gap-2 bg-yellow-500/10 px-3 py-1 rounded-full border border-yellow-500/20">
                           <Star className="fill-yellow-400 text-yellow-400" size={20} />
                           <span className="text-yellow-400 font-bold text-lg">{averageRating}</span>
                           <span className="text-yellow-600/70 text-xs">({reviews.length} รีวิว)</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-soulis-300 text-sm flex items-center gap-2"><Edit3 size={14}/> ชื่อที่แสดง (Username)</label>
                    <div className="flex gap-2">
                        <input value={newName} onChange={(e) => setNewName(e.target.value)} className="flex-1 bg-black/30 border border-soulis-700/50 text-white p-3 rounded-xl focus:outline-none focus:border-soulis-500 transition" />
                        <button onClick={handleUpdateProfile} className="bg-soulis-600 hover:bg-soulis-500 text-white px-4 rounded-xl transition"><Save size={20} /></button>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-soulis-300 text-sm flex items-center gap-2"><Mail size={14}/> อีเมล (Email)</label>
                    <div className="w-full bg-black/40 border border-transparent text-gray-400 p-3 rounded-xl cursor-not-allowed select-none font-mono">{maskEmail(user?.email)}</div>
                </div>
                <div className="pt-4 border-t border-white/5">
                    {!isEditingPassword ? (
                        <button onClick={() => setIsEditingPassword(true)} className="text-soulis-400 hover:text-white text-sm flex items-center gap-2 transition"><Lock size={16} /> ต้องการเปลี่ยนรหัสผ่าน?</button>
                    ) : (
                        <div className="bg-black/20 p-4 rounded-xl border border-soulis-500/30 animate-fade-in">
                            <label className="text-white text-sm mb-2 block">ตั้งรหัสผ่านใหม่</label>
                            <div className="flex gap-2">
                                <input type="password" placeholder="รหัสใหม่ (6+ ตัวอักษร)" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="flex-1 bg-black/20 border border-soulis-500/30 text-white p-2 rounded-lg focus:outline-none focus:border-soulis-500" />
                                <button onClick={handleChangePassword} className="bg-green-600 hover:bg-green-500 text-white px-4 rounded-lg text-sm font-bold">บันทึก</button>
                                <button onClick={() => setIsEditingPassword(false)} className="text-gray-400 hover:text-white px-2 text-sm">ยกเลิก</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>

        <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-3xl p-6 md:p-8 shadow-xl">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">📝 ความประทับใจจากเพื่อนๆ <span className="text-xs bg-soulis-500 px-2 py-0.5 rounded-full text-white">{reviews.length}</span></h3>
            {reviews.length === 0 ? (
                <div className="text-center py-10 text-gray-500 border-2 border-dashed border-gray-700 rounded-2xl"><p>ยังไม่มีรีวิว... ลองไปคุยกับเพื่อนใหม่ดูสิ!</p></div>
            ) : (
                <div className="grid gap-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                    {reviews.map((review) => (
                        <div key={review.id} className="bg-black/20 p-4 rounded-xl border border-white/5 hover:border-soulis-500/30 transition">
                            <div className="flex items-center gap-1 mb-2">
                                {[...Array(10)].map((_, i) => (<Star key={i} size={14} className={i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-700'} />))}
                                <span className="text-xs text-gray-500 ml-2">{new Date(review.created_at).toLocaleDateString('th-TH')}</span>
                            </div>
                            <p className="text-gray-200 text-sm italic">"{review.comment || 'ไม่ได้ระบุข้อความ'}"</p>
                        </div>
                    ))}
                </div>
            )}
        </div>

        <button onClick={handleLogout} className="w-full border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 py-3 rounded-xl flex items-center justify-center gap-2 transition font-bold"><LogOut size={20} /> ออกจากระบบ</button>
      </div>
    </div>
  );
}