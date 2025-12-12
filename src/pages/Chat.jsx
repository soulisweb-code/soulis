import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Send, Star, User, AlertTriangle, LogOut, Flag, X } from 'lucide-react';

export default function Chat() {
  const { matchId } = useParams();
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [userId, setUserId] = useState('');
  const [partnerId, setPartnerId] = useState('');
  const [isTalker, setIsTalker] = useState(false);
  const [partnerRole, setPartnerRole] = useState('');
  const [partnerRating, setPartnerRating] = useState(null);
  
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false); 
  const [reportReason, setReportReason] = useState('');
  const [showRating, setShowRating] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const messagesEndRef = useRef(null);

  const isFinished = useRef(false);
  const intervalRef = useRef(null);
  const channelRef = useRef(null);

  const scrollToBottom = () => { 
    // ดีเลย์นิดนึงเพื่อให้คีย์บอร์ดดันขึ้นมาก่อนแล้วค่อยเลื่อน
    setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const killSystem = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (channelRef.current) supabase.removeChannel(channelRef.current);
  };

  const finalExit = (talkerMode) => {
    if (isFinished.current) return;
    isFinished.current = true; 
    killSystem();
    sessionStorage.removeItem('soulis_session');
    setShowConfirmEnd(false);
    if (talkerMode) setShowRating(true); 
    else navigate('/thank-you-listener', { replace: true });
  };

  const fetchMessages = async () => {
    if (isFinished.current) return;
    const { data: msgs } = await supabase.from('messages').select('*').eq('match_id', matchId).order('created_at', { ascending: true });
    if (msgs) setMessages(msgs.filter(m => m.content !== '###END###'));
  };

  useEffect(() => {
    const sessionKey = sessionStorage.getItem('soulis_session');
    if (!sessionKey) { navigate('/select-role', { replace: true }); return; }

    isFinished.current = false;

    const setupChat = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/');
      setUserId(user.id);

      const { data: match } = await supabase.from('matches').select('*').eq('id', matchId).single();
      if (!match || match.is_active === false) {
        const tempIsTalker = match ? (match.talker_id === user.id) : false;
        sessionStorage.removeItem('soulis_session');
        alert('การสนทนานี้จบลงแล้วครับ');
        navigate('/select-role', { replace: true });
        return;
      }

      const userIsTalker = match.talker_id === user.id;
      setIsTalker(userIsTalker);
      setPartnerId(userIsTalker ? match.listener_id : match.talker_id);
      setPartnerRole(userIsTalker ? 'ผู้รับฟัง' : 'ผู้ระบาย');

      if (userIsTalker) { 
        const { data: reviews } = await supabase.from('reviews').select('rating').eq('target_user_id', match.listener_id);
        if (reviews && reviews.length > 0) {
          const avg = (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1);
          setPartnerRating(avg);
        } else { setPartnerRating('New'); }
      }

      await fetchMessages();
      scrollToBottom();

      channelRef.current = supabase.channel(`room-${matchId}`)
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `match_id=eq.${matchId}` }, (payload) => {
           if (payload.new.content === '###END###') finalExit(userIsTalker);
           else if (payload.new.sender_id !== user.id) fetchMessages();
        })
        .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'matches', filter: `id=eq.${matchId}` }, (payload) => {
           if (payload.new.is_active === false) finalExit(userIsTalker);
        }).subscribe();

      intervalRef.current = setInterval(async () => {
          if (isFinished.current) return;
          const { data } = await supabase.from('matches').select('is_active').eq('id', matchId).single();
          if (!data || data.is_active === false) finalExit(userIsTalker); 
          else fetchMessages();
      }, 3000);
    };

    setupChat();
    return () => { killSystem(); };
  }, [matchId, navigate]);

  useEffect(() => { if(!isFinished.current) scrollToBottom(); }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || isFinished.current) return;
    const content = newMessage;
    setNewMessage('');
    setMessages(prev => [...prev, { id: Date.now(), sender_id: userId, content, created_at: new Date().toISOString() }]);
    await supabase.from('messages').insert([{ match_id: matchId, sender_id: userId, content }]);
    fetchMessages();
    // สั่ง scroll อีกรอบหลังส่ง
    setTimeout(scrollToBottom, 50);
  };

  const confirmEndChat = async () => {
    await supabase.from('messages').insert([{ match_id: matchId, sender_id: userId, content: '###END###' }]);
    await supabase.from('matches').update({ is_active: false }).eq('id', matchId);
    finalExit(isTalker);
  };

  const handleSubmitReport = async () => {
    if (!reportReason) return alert("กรุณาเลือกเหตุผล");
    if (!confirm("ยืนยันการรายงาน?")) return;
    const { error } = await supabase.from('reports').insert({ reporter_id: userId, reported_id: partnerId, reason: reportReason, chat_evidence: messages, status: 'pending' });
    if (error) return alert("Error: " + error.message);
    alert("ได้รับรายงานแล้ว");
    confirmEndChat(); 
  };

  const submitReview = async () => {
    if (!comment.trim()) return alert("กรุณาเขียนความประทับใจหน่อยนะครับ");
    await supabase.from('reviews').insert({ reviewer_id: userId, target_user_id: partnerId, rating, comment });
    navigate('/thank-you-talker', { replace: true });
  };

  // ... (ส่วน Modal เหมือนเดิม ไม่ต้องแก้) ...
  if (showReportModal) return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
        <div className="bg-soulis-800 border border-soulis-600 p-6 rounded-2xl w-full max-w-sm animate-float">
          <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2"><Flag className="text-red-500" /> รายงานผู้ใช้</h3>
            <button onClick={() => setShowReportModal(false)} className="text-gray-400 hover:text-white"><X /></button>
          </div>
          <div className="space-y-2 mb-6">
            {['ใช้ถ้อยคำหยาบคาย', 'คุกคามทางเพศ', 'หลอกลวง', 'ก่อกวน', 'อื่นๆ'].map((r) => (
              <button key={r} onClick={() => setReportReason(r)} className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition ${reportReason === r ? 'bg-red-600 text-white' : 'bg-white/5 text-gray-300 hover:bg-white/10'}`}>{r}</button>
            ))}
          </div>
          <button onClick={handleSubmitReport} disabled={!reportReason} className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 rounded-lg font-bold transition">ส่งรายงาน</button>
        </div>
      </div>
  );

  if (showRating) return (
      <div className="min-h-screen flex items-center justify-center bg-soulis-900 p-4 relative z-50">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl w-full max-w-md text-center animate-float">
          <h2 className="text-2xl font-bold text-white mb-4">จบการสนทนาแล้ว</h2>
          <div className="flex justify-center gap-2 mb-6">
            {[...Array(10)].map((_, i) => (
              <Star key={i} className={`cursor-pointer w-8 h-8 transition hover:scale-110 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} onClick={() => setRating(i + 1)} />
            ))}
          </div>
          <p className="text-white mb-4 font-bold text-xl">{rating} / 10</p>
          <textarea className="w-full bg-black/30 text-white border border-white/10 rounded-xl p-4 mb-4 focus:border-soulis-500 outline-none" placeholder="เขียนความประทับใจ (ห้ามเว้นว่าง)..." value={comment} onChange={(e) => setComment(e.target.value)} />
          <button onClick={submitReview} className="w-full bg-soulis-600 hover:bg-soulis-500 text-white py-3 rounded-xl font-bold shadow-lg transition">ส่งรีวิว</button>
        </div>
      </div>
  );

  // 🔥🔥🔥 ส่วนสำคัญ: แก้ไข Layout ให้รองรับคีย์บอร์ดมือถือ 🔥🔥🔥
  return (
    // เปลี่ยน h-screen เป็น h-[100dvh] (Dynamic Height)
    <div className="flex flex-col h-[100dvh] bg-soulis-900 relative overflow-hidden">
      
      {/* Header (Fixed Height) */}
      <header className="bg-soulis-900/80 backdrop-blur-md p-4 shadow flex justify-between items-center z-10 border-b border-white/5 flex-none">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-soulis-500 to-soulis-700 rounded-full flex items-center justify-center shadow-md"><User className="text-white w-5 h-5" /></div>
            <div>
                <h1 className="font-bold text-white text-base flex items-center gap-2">คุยกับ {partnerRole} {isTalker && partnerRating && <span className="bg-yellow-500/20 text-yellow-300 text-xs px-2 py-0.5 rounded-full border border-yellow-500/30">⭐ {partnerRating}</span>}</h1>
                <span className="flex h-2 w-2 relative"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span>
            </div>
        </div>
        <div className="flex gap-2">
            <button onClick={() => setShowReportModal(true)} className="bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-400 p-2.5 rounded-full transition"><Flag size={18} /></button>
            <button onClick={() => setShowConfirmEnd(true)} className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-full flex items-center gap-2 text-sm font-bold transition border border-red-500/20"><LogOut size={16} /> <span className="hidden md:inline">จบแชท</span></button>
        </div>
      </header>

      {/* Chat Area (Flexible Height) */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar min-h-0">
        {messages.map((msg, index) => {
            const isMe = msg.sender_id === userId;
            const isSeq = index > 0 && messages[index - 1].sender_id === msg.sender_id;
            return (
              <div key={msg.id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'} ${isSeq ? 'mt-1' : 'mt-4'}`}>
                  <div className={`px-5 py-3 text-sm md:text-base leading-relaxed shadow-sm break-words max-w-[80%] ${
                    isMe ? 'bg-gradient-to-r from-soulis-600 to-soulis-500 text-white rounded-2xl rounded-tr-sm' 
                         : 'bg-white/10 backdrop-blur-sm text-gray-100 border border-white/10 rounded-2xl rounded-tl-sm'
                  }`}>
                    {msg.content}
                  </div>
              </div>
            );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input (Fixed at bottom but inside Flex flow) */}
      <form onSubmit={sendMessage} className="p-4 bg-soulis-900/90 backdrop-blur-md flex gap-3 border-t border-white/5 flex-none safe-area-bottom">
        <input 
            type="text" 
            value={newMessage} 
            onChange={(e) => setNewMessage(e.target.value)} 
            onFocus={scrollToBottom} // แตะปุ๊บ เลื่อนจอให้
            className="flex-1 bg-white/5 text-white placeholder-gray-400 border border-white/10 rounded-full px-6 py-3 focus:outline-none focus:bg-white/10 focus:border-soulis-500 transition" 
            placeholder="พิมพ์ข้อความ..." 
        />
        <button type="submit" disabled={!newMessage.trim()} className="bg-soulis-500 hover:bg-soulis-400 text-white p-3 rounded-full transition shadow-lg shadow-soulis-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"><Send size={20}/></button>
      </form>

      {/* Confirm Modal (เหมือนเดิม) */}
      {showConfirmEnd && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-soulis-800 border border-soulis-600 p-6 rounded-2xl w-full max-w-sm text-center animate-float">
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-white mb-4">ต้องการจบสนทนา?</h3>
                <div className="flex gap-3">
                    <button onClick={() => setShowConfirmEnd(false)} className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 rounded-lg font-bold transition">ยกเลิก</button>
                    <button onClick={confirmEndChat} className="flex-1 bg-red-600 hover:bg-red-500 text-white py-2 rounded-lg font-bold shadow-lg transition">ยืนยัน</button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}