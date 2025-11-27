import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Search } from 'lucide-react';

export default function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const myRole = location.state?.myRole;
  const [status, setStatus] = useState('กำลังตรวจสอบ...');
  const isRunning = useRef(false);

  useEffect(() => {
    const sessionKey = sessionStorage.getItem('soulis_session');
    if (!sessionKey || !myRole) {
        navigate('/select-role', { replace: true });
        return;
    }

    if (isRunning.current) return;
    isRunning.current = true;

    let queueId = null;
    let channel = null;

    const startMatching = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/', { replace: true });

      await supabase.from('queue').delete().eq('user_id', user.id);

      setStatus('กำลังค้นหาเพื่อนคู่คิด...');
      const lookingFor = myRole === 'talker' ? 'listener' : 'talker';

      const { data: potentialMatch } = await supabase
        .from('queue')
        .select('*')
        .eq('my_role', lookingFor)
        .neq('user_id', user.id)
        .order('created_at', { ascending: true })
        .limit(1)
        .single();

      if (potentialMatch) {
        setStatus('เจอเพื่อนแล้ว! กำลังตรวจสอบ...');
        
        const { data: isBusy } = await supabase.from('matches').select('id').or(`talker_id.eq.${potentialMatch.user_id},listener_id.eq.${potentialMatch.user_id}`).eq('is_active', true).maybeSingle();

        if (isBusy) {
            await supabase.from('queue').delete().eq('id', potentialMatch.id);
            setTimeout(() => { isRunning.current = false; startMatching(); }, 1000);
            return;
        }

        const { data: match, error } = await supabase.from('matches').insert([{ 
              talker_id: myRole === 'talker' ? user.id : potentialMatch.user_id,
              listener_id: myRole === 'listener' ? user.id : potentialMatch.user_id,
              is_active: true
          }]).select().single();

        if (error) { isRunning.current = false; startMatching(); return; }

        await supabase.from('queue').delete().eq('id', potentialMatch.id);
        navigate(`/chat/${match.id}`, { replace: true });

      } else {
        setStatus('ยังไม่มีใครว่าง... กำลังสร้างคิวรอ...');
        const { data: myQueue } = await supabase.from('queue').insert([{ user_id: user.id, my_role: myRole, looking_for_role: lookingFor }]).select().single();
        if (myQueue) queueId = myQueue.id;
        setStatus('รอเพื่อนอีกฝั่งสักครู่...');

        channel = supabase.channel('waiting-room').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, (payload) => {
             if (payload.new.is_active === true && (payload.new.talker_id === user.id || payload.new.listener_id === user.id)) {
               if (queueId) supabase.from('queue').delete().eq('id', queueId);
               navigate(`/chat/${payload.new.id}`, { replace: true });
             }
          }).subscribe();
      }
    };

    const randomDelay = Math.floor(Math.random() * 1000) + 500;
    setTimeout(() => { startMatching(); }, randomDelay);

    return () => {
      if (channel) supabase.removeChannel(channel);
      if (queueId) supabase.from('queue').delete().eq('id', queueId);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Nebula Effect */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-soulis-500/20 rounded-full blur-[120px] animate-pulse"></div>
      
      <div className="z-10 text-center space-y-8 bg-white/5 backdrop-blur-xl p-12 rounded-[2rem] border border-white/10 shadow-2xl w-full max-w-md animate-float">
        <div className="relative inline-block">
            <div className="w-24 h-24 border-4 border-soulis-500/50 border-t-soulis-300 rounded-full animate-spin"></div>
            <div className="absolute inset-0 flex items-center justify-center"><Search className="text-white w-8 h-8 animate-pulse" /></div>
        </div>
        <div>
            <h2 className="text-3xl font-bold text-white mb-3 drop-shadow-lg">{status}</h2>
            <p className="text-soulis-200 text-sm">ระบบกำลังค้นหาคู่ที่ดีที่สุดให้คุณ...<br/>ท่ามกลางดวงดาวนับล้าน ⭐</p>
        </div>
      </div>
    </div>
  );
}