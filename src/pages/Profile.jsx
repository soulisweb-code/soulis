import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { User, LogOut, ChevronLeft, Mail, Calendar, Shield, Edit3, Save, X, Star, MessageSquare, LayoutDashboard } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  
  // Data States
  const [profile, setProfile] = useState(null);
  const [email, setEmail] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // UI States
  const [isEditingName, setIsEditingName] = useState(false);
  const [newName, setNewName] = useState('');
  const [showReviewsModal, setShowReviewsModal] = useState(false);

  useEffect(() => {
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/'); return; }
    
    setEmail(user.email);

    const { data: profileData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    setProfile(profileData);
    setNewName(profileData?.username || '');

    const { data: reviewsData } = await supabase.from('reviews').select('*').eq('target_user_id', user.id).order('created_at', { ascending: false });
    setReviews(reviewsData || []);

    setLoading(false);
  };

  const handleUpdateName = async () => {
    if (!newName.trim()) return alert("ชื่อห้ามว่าง");
    const { error } = await supabase.from('profiles').update({ username: newName }).eq('id', profile.id);
    if (error) alert("Error: " + error.message);
    else {
      setProfile({ ...profile, username: newName });
      setIsEditingName(false);
    }
  };

  const handleLogout = async () => {
    sessionStorage.clear();
    localStorage.clear();
    await supabase.auth.signOut();
    window.location.href = '/';
  };

  if (loading) return <div className="h-full w-full flex items-center justify-center text-white bg-soulis-900">Loading...</div>;

  return (
    <div className="h-full w-full overflow-y-auto overflow-x-hidden font-sans relative bg-soulis-900">
      
      <div className="min-h-full flex flex-col items-center p-6 pt-24 pb-32">
        <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-soulis-800 via-soulis-900 to-black opacity-80 pointer-events-none -z-10"></div>
        
        <button onClick={() => navigate(-1)} className="absolute top-6 left-6 text-soulis-300 hover:text-white transition flex items-center gap-1 bg-white/5 px-3 py-2 rounded-full backdrop-blur-sm z-20">
            <ChevronLeft size={20}/> กลับ
        </button>

        {/* Avatar */}
        <div className="relative mb-6">
            <div className="w-32 h-32 bg-gradient-to-tr from-soulis-500 to-pink-500 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(168,85,247,0.4)] animate-float">
                <User size={64} className="text-white" />
            </div>
            <div className="absolute bottom-0 right-0 bg-white/10 p-2 rounded-full border border-white/20 backdrop-blur-md">
                <Shield size={20} className={profile?.role === 'admin' ? "text-red-400" : "text-green-400"} />
            </div>
        </div>

        {/* Username */}
        <div className="flex items-center gap-3 mb-2">
            {isEditingName ? (
                <div className="flex items-center gap-2 bg-white/10 rounded-full px-2 py-1">
                    <input className="bg-transparent border-none outline-none text-white text-xl font-bold w-40 text-center" autoFocus value={newName} onChange={e => setNewName(e.target.value)} />
                    <button onClick={handleUpdateName} className="p-1 bg-green-500/20 text-green-400 rounded-full hover:bg-green-500/40"><Save size={18}/></button>
                    <button onClick={() => { setIsEditingName(false); setNewName(profile.username); }} className="p-1 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500/40"><X size={18}/></button>
                </div>
            ) : (
                <>
                    <h1 className="text-3xl font-bold text-white">{profile?.username || 'Unknown'}</h1>
                    <button onClick={() => setIsEditingName(true)} className="text-soulis-400 hover:text-white transition"><Edit3 size={18}/></button>
                </>
            )}
        </div>

        <p className="text-soulis-300 text-sm mb-6 bg-white/5 px-4 py-1 rounded-full border border-white/5">
            {profile?.role === 'admin' ? '👑 Administrator' : '✨ Soulis Member'}
        </p>

        {/* ปุ่มพิเศษสำหรับ Admin */}
        {profile?.role === 'admin' && (
            <button 
                onClick={() => navigate('/admin-dashboard')} 
                className="mb-6 w-full max-w-md bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-3 rounded-2xl font-bold shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2 hover:scale-105 transition-transform"
            >
                <LayoutDashboard size={20} /> ไปที่ Admin Dashboard
            </button>
        )}

        {/* Info Cards */}
        <div className="w-full max-w-md space-y-3">
            
            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="bg-blue-500/20 p-3 rounded-full text-blue-300"><Mail size={20}/></div>
                <div className="flex-1 overflow-hidden">
                    <p className="text-xs text-gray-400 uppercase">อีเมล</p>
                    <p className="text-white truncate">{email}</p>
                </div>
            </div>

            <div className="bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4">
                <div className="bg-purple-500/20 p-3 rounded-full text-purple-300"><Calendar size={20}/></div>
                <div>
                    <p className="text-xs text-gray-400 uppercase">เข้าร่วมเมื่อ</p>
                    <p className="text-white">{new Date(profile?.created_at).toLocaleDateString('th-TH')}</p>
                </div>
            </div>

            <button onClick={() => setShowReviewsModal(true)} className="w-full bg-white/5 p-4 rounded-2xl border border-white/10 flex items-center gap-4 hover:bg-white/10 transition text-left group">
                <div className="bg-yellow-500/20 p-3 rounded-full text-yellow-300 group-hover:scale-110 transition"><Star size={20}/></div>
                <div className="flex-1">
                    <p className="text-xs text-gray-400 uppercase">รีวิวที่ได้รับ</p>
                    <p className="text-white font-bold">{reviews.length} ความคิดเห็น</p>
                </div>
                <ChevronLeft size={20} className="rotate-180 text-gray-500 group-hover:text-white transition" />
            </button>

        </div>

        <button onClick={handleLogout} className="mt-10 w-full max-w-md bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition active:scale-95">
            <LogOut size={20} /> ออกจากระบบ
        </button>

        <p className="mt-6 text-xs text-gray-600">User ID: {profile?.id}</p>
      </div>

      {showReviewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
            <div className="bg-soulis-800 border border-soulis-500/30 rounded-3xl w-full max-w-md h-[70vh] flex flex-col shadow-2xl relative overflow-hidden">
                <div className="p-5 border-b border-white/10 flex justify-between items-center bg-black/20">
                    <h3 className="font-bold text-xl text-white flex items-center gap-2"><MessageSquare className="text-yellow-400"/> รีวิวของคุณ</h3>
                    <button onClick={() => setShowReviewsModal(false)} className="p-2 hover:bg-white/10 rounded-full transition"><X className="text-white"/></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5 space-y-4 custom-scrollbar">
                    {reviews.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-500 gap-2">
                            <Star size={40} className="opacity-20"/>
                            <p>ยังไม่มีรีวิว</p>
                        </div>
                    ) : (
                        reviews.map((r, i) => (
                            <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between mb-2">
                                    <div className="flex gap-1">{[...Array(r.rating)].map((_,idx) => <Star key={idx} size={14} className="fill-yellow-400 text-yellow-400"/>)}</div>
                                    <span className="text-xs text-gray-500">{new Date(r.created_at).toLocaleDateString()}</span>
                                </div>
                                <p className="text-gray-200 text-sm">"{r.comment}"</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
      )}

    </div>
  );
}