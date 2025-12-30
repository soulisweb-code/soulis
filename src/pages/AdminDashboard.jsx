import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { LogOut, Trash2, AlertTriangle, Eye, Ban, CheckCircle, X, Users, Edit3, Save, Search, Heart } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function AdminDashboard() {
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('reports');
  const [loading, setLoading] = useState(true);
  
  const [reports, setReports] = useState([]);
  const [users, setUsers] = useState([]); 
  const [stats, setStats] = useState({ users: 0, matches: 0 });
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [editingUser, setEditingUser] = useState(null); 
  const [searchTerm, setSearchTerm] = useState(''); 
  const [editFormData, setEditFormData] = useState({ username: '', role: 'user' });

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = '/admin'; return; }

      const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

      if (profile?.role !== 'admin') {
        alert("⛔ Access Denied!");
        window.location.href = '/';
        return;
      }
      setLoading(false);
      fetchData();
    };
    checkAdmin();
  }, []);

  const fetchData = async () => {
    try {
        const { data: reportsData } = await supabase.from('reports').select('*').order('created_at', { ascending: false });
        const { data: profilesData } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
        
        setUsers(profilesData || []);
        const profilesMap = {};
        profilesData?.forEach(p => { profilesMap[p.id] = p });

        const mergedReports = reportsData?.map(r => ({
            ...r,
            reporter: profilesMap[r.reporter_id] || { username: 'Unknown' },
            reported: profilesMap[r.reported_id] || { username: 'Unknown', is_banned: false }
        })) || [];

        setReports(mergedReports);
        const { count: matchCount } = await supabase.from('matches').select('*', { count: 'exact', head: true });
        setStats({ users: profilesData?.length || 0, matches: matchCount || 0 });
    } catch (error) { console.error(error); }
  };

  const handleBanFromReport = async (userId, reportId) => {
    if (!window.confirm("ยืนยันแบนถาวร?")) return;
    await supabase.from('profiles').update({ is_banned: true }).eq('id', userId);
    await supabase.from('reports').update({ status: 'banned' }).eq('id', reportId);
    fetchData();
    setSelectedReport(null);
  };

  const handleDismiss = async (reportId) => {
    await supabase.from('reports').update({ status: 'dismissed' }).eq('id', reportId);
    fetchData();
    setSelectedReport(null);
  };

  // 🔥 ฟังก์ชันลบ Report (เพิ่มใหม่)
  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("⚠️ ต้องการลบรายงานนี้ทิ้งถาวรใช่หรือไม่?")) return;
    const { error } = await supabase.from('reports').delete().eq('id', reportId);
    if (error) alert("Error: " + error.message);
    else {
        fetchData();
        setSelectedReport(null); // ปิด Modal ถ้าเปิดอยู่
    }
  };

  const handleCleanSystem = async () => {
    if (!window.confirm("ยืนยันล้างห้องขยะ?")) return;
    const { error } = await supabase.from('matches').delete().or('is_active.eq.false');
    if (error) alert("Error: " + error.message);
    else alert("🧹 สะอาดเอี่ยม!");
    fetchData();
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setEditFormData({ username: user.username, role: user.role });
  };

  const handleSaveUser = async () => {
    if (!editFormData.username.trim()) return alert("ชื่อห้ามว่าง");
    const { error } = await supabase.from('profiles').update({ username: editFormData.username, role: editFormData.role }).eq('id', editingUser.id);
    if (error) alert("Error: " + error.message);
    else { alert("✅ บันทึกเรียบร้อย"); setEditingUser(null); fetchData(); }
  };

  const handleToggleBan = async (user) => {
    if (!confirm(`ต้องการ "${user.is_banned ? "ปลดแบน" : "แบน"}" ${user.username}?`)) return;
    await supabase.from('profiles').update({ is_banned: !user.is_banned }).eq('id', user.id);
    fetchData();
  };

  const handleDeleteUser = async (user) => {
    const confirmDelete = window.prompt(`พิมพ์ "delete" เพื่อยืนยันการลบผู้ใช้ ${user.username} (ลบถาวรทั้งบัญชีและข้อมูล)`);
    if (confirmDelete !== 'delete') return;

    try {
        const { error } = await supabase.rpc('delete_user_complete', { 
            _target_uid: user.id 
        });

        if (error) throw error;

        alert(`🗑️ ลบผู้ใช้ ${user.username} ออกจากระบบถาวรเรียบร้อยแล้ว!`);
        fetchData();
    } catch (error) {
        console.error("Delete Error:", error);
        alert("เกิดข้อผิดพลาดในการลบ: " + error.message);
    }
  };

  const handleLogout = async () => {
    sessionStorage.removeItem('soulis_admin_role');
    await supabase.auth.signOut();
    window.location.href = '/admin';
  };

  const filteredUsers = users.filter(u => u.username?.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) return <div className="min-h-screen flex items-center justify-center bg-soulis-900 text-white font-sans">Checking Access...</div>;

  return (
    // 🔥 แก้ตรงนี้: เปลี่ยน min-h-screen เป็น h-screen เพื่อล็อคความสูงจอ และ overflow-hidden ที่ตัวแม่
    <div className="h-screen w-full font-sans text-white flex relative overflow-hidden bg-soulis-900">
      
      {/* ✅ ส่วน SEO: ป้องกัน Google เข้าถึงหน้า Admin */}
      <Helmet>
        <title>Admin Dashboard - Soulis Management System</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Background Effect */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-soulis-700/20 rounded-full blur-[100px] pointer-events-none"></div>
      
      {/* Sidebar - Fix height to full */}
      <div className="w-64 bg-soulis-800/50 backdrop-blur-xl border-r border-white/10 p-6 flex flex-col justify-between z-20 shrink-0 h-full">
        <div>
            <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 tracking-wider">SOULIS ADMIN</h1>
            <nav className="space-y-2">
                <button onClick={() => setActiveTab('reports')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'reports' ? 'bg-purple-600/80 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}><AlertTriangle size={20}/> รายงาน ({reports.filter(r => r.status === 'pending').length})</button>
                <button onClick={() => setActiveTab('users')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'users' ? 'bg-purple-600/80 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}><Users size={20}/> สมาชิก ({users.length})</button>
                <button onClick={() => setActiveTab('system')} className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all ${activeTab === 'system' ? 'bg-purple-600/80 text-white shadow-lg' : 'text-gray-400 hover:bg-white/10'}`}><Trash2 size={20}/> ระบบ</button>
            </nav>
        </div>

        <div className="space-y-2">
            <button onClick={() => navigate('/select-role')} className="w-full flex items-center gap-2 text-yellow-300 hover:text-yellow-200 transition px-3 py-2 rounded-lg hover:bg-white/5 bg-yellow-500/10 border border-yellow-500/20">
                <Heart size={18}/> พักใจ (เลือกบทบาท)
            </button>

            <button onClick={handleLogout} className="w-full flex items-center gap-2 text-gray-400 hover:text-red-400 transition px-3 py-2 rounded-lg hover:bg-white/5">
                <LogOut size={18}/> ออกจากระบบ
            </button>
        </div>
      </div>

      {/* 🔥 Main Content Area - ใช้ flex-1 และ overflow-y-auto เพื่อให้ scrollbar ขึ้นเฉพาะตรงนี้ */}
      <div className="flex-1 h-full overflow-y-auto relative z-10 custom-scrollbar p-8">
        
        {/* --- Tab: Reports --- */}
        {activeTab === 'reports' && (
            <div className="animate-float">
                <h2 className="text-3xl font-bold mb-6 text-white">รายการแจ้งปัญหา</h2>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-purple-300 uppercase text-xs tracking-wider font-semibold border-b border-white/5">
                            <tr>
                                <th className="p-4">วันที่</th>
                                <th className="p-4">คู่กรณี</th>
                                <th className="p-4">ข้อหา</th>
                                <th className="p-4">สถานะ</th>
                                <th className="p-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 text-gray-400">{new Date(report.created_at).toLocaleDateString()}</td>
                                    <td className="p-4"><div className="flex flex-col"><span className="text-blue-400">ผู้แจ้ง: {report.reporter.username}</span><span className="text-red-400">ผู้ถูกแจ้ง: {report.reported.username} {report.reported.is_banned && '(BANNED)'}</span></div></td>
                                    <td className="p-4 text-gray-300">{report.reason}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded-md text-xs font-bold border ${report.status === 'pending' ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30' : report.status === 'banned' ? 'bg-red-500/10 text-red-300 border-red-500/30' : 'bg-green-500/10 text-green-300 border-green-500/30'}`}>{report.status.toUpperCase()}</span></td>
                                    <td className="p-4 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => setSelectedReport(report)} className="bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg flex items-center gap-1 transition">
                                                <Eye size={14}/> ตรวจสอบ
                                            </button>
                                            <button onClick={() => handleDeleteReport(report.id)} className="bg-red-500/10 hover:bg-red-500/30 text-red-400 p-1.5 rounded-lg transition" title="ลบรายงาน">
                                                <Trash2 size={16}/>
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {reports.length === 0 && <div className="p-12 text-center text-gray-400 flex flex-col items-center"><CheckCircle size={48} className="mb-4 text-green-500/50"/>ไม่มีรายงานใหม่</div>}
                </div>
            </div>
        )}

        {/* --- Tab: Users --- */}
        {activeTab === 'users' && (
            <div className="animate-float">
                <div className="flex justify-between items-center mb-6"><h2 className="text-3xl font-bold text-white">จัดการสมาชิก</h2><div className="relative"><Search className="absolute left-3 top-2.5 text-gray-400" size={18}/><input type="text" placeholder="ค้นหา..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-white focus:outline-none focus:border-purple-500 transition w-64"/></div></div>
                <div className="bg-white/5 backdrop-blur-md rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
                    <table className="w-full text-left">
                        <thead className="bg-black/20 text-purple-300 uppercase text-xs tracking-wider font-semibold border-b border-white/5">
                            <tr><th className="p-4">User</th><th className="p-4">Role</th><th className="p-4">Status</th><th className="p-4 text-right">Action</th></tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 text-sm">
                            {filteredUsers.map((user) => (
                                <tr key={user.id} className="hover:bg-white/5 transition-colors">
                                    <td className="p-4 font-medium text-white">{user.username}</td>
                                    <td className="p-4"><span className={`px-2 py-1 rounded text-xs font-bold border ${user.role === 'admin' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50' : 'bg-gray-700/50 text-gray-400 border-gray-600'}`}>{user.role.toUpperCase()}</span></td>
                                    <td className="p-4">{user.is_banned ? <span className="text-red-400 flex items-center gap-1"><Ban size={14}/> BANNED</span> : <span className="text-green-400 flex items-center gap-1"><CheckCircle size={14}/> Active</span>}</td>
                                    <td className="p-4 text-right flex justify-end gap-2">
                                        <button onClick={() => handleEditClick(user)} className="bg-blue-600/20 hover:bg-blue-600/40 text-blue-400 p-2 rounded-lg transition" title="แก้ไข"><Edit3 size={16}/></button>
                                        <button onClick={() => handleToggleBan(user)} className={`p-2 rounded-lg transition ${user.is_banned ? 'bg-green-600/20 hover:bg-green-600/40 text-green-400' : 'bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-400'}`} title={user.is_banned ? "ปลดแบน" : "แบน"}><Ban size={16}/></button>
                                        {user.role !== 'admin' && (
                                            <button onClick={() => handleDeleteUser(user)} className="bg-red-600/20 hover:bg-red-600/40 text-red-400 p-2 rounded-lg transition" title="ลบถาวร">
                                                <Trash2 size={16}/>
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {/* Spacer to ensure last item isn't cut off */}
                <div className="h-20"></div>
            </div>
        )}

        {/* --- Tab: System --- */}
        {activeTab === 'system' && (
            <div className="animate-float">
                <h2 className="text-3xl font-bold mb-6 text-white">ภาพรวมระบบ</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10"><h3 className="text-purple-300 text-xs uppercase tracking-wider font-bold mb-2">สมาชิก</h3><p className="text-4xl font-extrabold text-white">{stats.users}</p></div>
                    <div className="bg-white/5 p-6 rounded-2xl border border-white/10"><h3 className="text-purple-300 text-xs uppercase tracking-wider font-bold mb-2">ห้องสนทนา</h3><p className="text-4xl font-extrabold text-white">{stats.matches}</p></div>
                </div>
                <div className="bg-red-900/20 p-8 rounded-2xl border border-red-500/30"><h3 className="text-xl font-bold mb-4 text-red-400 flex items-center gap-2"><AlertTriangle size={24}/> Danger Zone</h3><button onClick={handleCleanSystem} className="bg-red-600 hover:bg-red-500 text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition"><Trash2 size={20}/> ล้างข้อมูลขยะ</button></div>
            </div>
        )}
      </div>

      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="bg-soulis-800 border border-white/10 rounded-2xl w-full max-w-2xl max-h-[80vh] flex flex-col overflow-hidden">
                <div className="p-4 border-b border-white/10 flex justify-between items-center bg-black/20"><h3 className="font-bold text-lg text-white">หลักฐานการแชท</h3><button onClick={() => setSelectedReport(null)} className="text-gray-400 hover:text-white"><X/></button></div>
                <div className="flex-1 overflow-y-auto p-6 bg-black/40 space-y-3 custom-scrollbar">
                    {selectedReport.chat_evidence?.map((msg, i) => (<div key={i} className={`p-2 rounded max-w-[80%] ${msg.sender_id === selectedReport.reporter_id ? 'ml-auto bg-blue-600 text-white' : 'bg-white/10 border border-white/10 text-gray-200'}`}>{msg.content}</div>))}
                </div>
                <div className="p-4 border-t border-white/10 bg-black/20 flex justify-end gap-3">
                    <button onClick={() => handleDismiss(selectedReport.id)} className="px-4 py-2 text-gray-300 border border-white/10 rounded-lg">ยกฟ้อง</button>
                    <button onClick={() => handleBanFromReport(selectedReport.reported_id, selectedReport.id)} className="px-4 py-2 bg-red-600 text-white rounded-lg">แบนถาวร</button>
                    <button onClick={() => handleDeleteReport(selectedReport.id)} className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white rounded-lg flex items-center gap-2"><Trash2 size={16}/> ลบรายงาน</button>
                </div>
            </div>
        </div>
      )}

      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="bg-soulis-800 border border-purple-500/30 p-6 rounded-2xl w-full max-w-sm animate-float">
                <h3 className="text-xl font-bold mb-4 text-white">แก้ไขข้อมูล</h3>
                <input className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white mb-4" value={editFormData.username} onChange={e => setEditFormData({...editFormData, username: e.target.value})} />
                <select className="w-full bg-black/30 border border-white/10 rounded-lg p-2 text-white mb-6" value={editFormData.role} onChange={e => setEditFormData({...editFormData, role: e.target.value})}><option value="user">User</option><option value="admin">Admin</option></select>
                <div className="flex gap-3"><button onClick={() => setEditingUser(null)} className="flex-1 py-2 rounded-lg bg-gray-700 text-gray-300">ยกเลิก</button><button onClick={handleSaveUser} className="flex-1 py-2 rounded-lg bg-purple-600 text-white">บันทึก</button></div>
            </div>
        </div>
      )}
    </div>
  );
}