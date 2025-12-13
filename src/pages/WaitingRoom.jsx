import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { Search, Loader2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function WaitingRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const myRole = location.state?.myRole;
  const [status, setStatus] = useState('กำลังเชื่อมต่อระบบ...');
  
  // ใช้ Ref กันการรันซ้ำ
  const isRunning = useRef(false);
  const queueIdRef = useRef(null);
  const intervalRef = useRef(null);
  const channelRef = useRef(null);

  useEffect(() => {
    // 1. เช็ค Session และ Role
    const sessionKey = sessionStorage.getItem('soulis_session');
    if (!sessionKey || !myRole) {
        navigate('/select-role', { replace: true });
        return;
    }

    if (isRunning.current) return;
    isRunning.current = true;

    const initializeMatching = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return navigate('/', { replace: true });

      // 🔥 ล้างคิวเก่าของตัวเองทิ้งก่อน (กันบัคค้าง)
      await supabase.from('queue').delete().eq('user_id', user.id);

      setStatus('กำลังค้นหาเพื่อนคู่คิด...');
      const lookingFor = myRole === 'talker' ? 'listener' : 'talker';

      // 2. ลองค้นหาคนในคิวก่อน
      const { data: potentialMatch } = await supabase
        .from('queue')
        .select('*')
        .eq('my_role', lookingFor)
        .neq('user_id', user.id) // ไม่เอาตัวเอง
        .order('created_at', { ascending: true }) // เอาคนรอนานสุด
        .limit(1)
        .maybeSingle(); // ใช้ maybeSingle เพื่อกัน Error ถ้าไม่เจอ

      if (potentialMatch) {
        // --- เจอคนรออยู่! จับคู่เลย ---
        setStatus('เจอเพื่อนแล้ว! กำลังสร้างห้อง...');
        
        // เช็คว่าเขาว่างอยู่ไหม (กันชน)
        const { data: isBusy } = await supabase.from('matches')
            .select('id')
            .or(`talker_id.eq.${potentialMatch.user_id},listener_id.eq.${potentialMatch.user_id}`)
            .eq('is_active', true)
            .maybeSingle();

        if (isBusy) {
            // เขาไม่ว่างแล้ว (โดนคนอื่นตัดหน้า) -> เริ่มต้นใหม่
            await supabase.from('queue').delete().eq('id', potentialMatch.id); // ลบคิวผีทิ้ง
            setTimeout(initializeMatching, 1000);
            return;
        }

        // สร้างห้อง
        const { data: match, error } = await supabase.from('matches').insert([{ 
              talker_id: myRole === 'talker' ? user.id : potentialMatch.user_id,
              listener_id: myRole === 'listener' ? user.id : potentialMatch.user_id,
              is_active: true
          }]).select().single();

        if (error) { 
            // สร้างไม่ผ่าน (อาจจะชนกัน) -> เริ่มใหม่
            setTimeout(initializeMatching, 1000); 
            return; 
        }

        // ลบทั้งคู่จากคิว
        await supabase.from('queue').delete().eq('id', potentialMatch.id);
        navigate(`/chat/${match.id}`, { replace: true });

      } else {
        // --- ไม่เจอใครเลย -> เข้าคิวรอ ---
        setStatus('รอเพื่อนอีกฝั่งสักครู่...');
        
        const { data: myQueue } = await supabase.from('queue')
            .insert([{ user_id: user.id, my_role: myRole, looking_for_role: lookingFor }])
            .select()
            .single();
        
        if (myQueue) queueIdRef.current = myQueue.id;

        // 🔥 A. ตั้งรับ Realtime (วิธีหลัก)
        channelRef.current = supabase.channel('waiting-room')
          .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'matches' }, (payload) => {
             // ถ้ามีห้องใหม่เกิดขึ้น และมีชื่อเราอยู่ในนั้น
             if (payload.new.is_active === true && (payload.new.talker_id === user.id || payload.new.listener_id === user.id)) {
               goToChat(payload.new.id);
             }
          })
          .subscribe();

        // 🔥 B. ตั้งรับ Polling (วิธีกันเหนียว: เช็คทุก 3 วิ เผื่อ Realtime ไม่เด้ง)
        intervalRef.current = setInterval(async () => {
            const { data: myMatch } = await supabase.from('matches')
                .select('id')
                .or(`talker_id.eq.${user.id},listener_id.eq.${user.id}`)
                .eq('is_active', true)
                .maybeSingle();
            
            if (myMatch) {
                goToChat(myMatch.id);
            }
        }, 3000);
      }
    };

    const goToChat = async (matchId) => {
        if (queueIdRef.current) await supabase.from('queue').delete().eq('id', queueIdRef.current);
        navigate(`/chat/${matchId}`, { replace: true });
    };

    // หน่วงเวลานิดนึงเพื่อให้ UI สวยงาม
    setTimeout(initializeMatching, 500);

    return () => {
      if (channelRef.current) supabase.removeChannel(channelRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
      // ถ้ากดออก หรือเปลี่ยนหน้า ให้ลบตัวเองจากคิวด้วย
      if (queueIdRef.current) supabase.from('queue').delete().eq('id', queueIdRef.current);
    };
  }, []);

  return (
    <div className="h-full w-full fixed inset-0 bg-soulis-900 flex flex-col items-center justify-center p-4 text-white text-center font-sans overflow-hidden">
      
      {/* ✅ ส่วน SEO: เปลี่ยนชื่อ Title ให้ผู้ใช้รู้สถานะ และสั่ง noindex */}
      <Helmet>
        <title>{status === 'กำลังเชื่อมต่อระบบ...' ? 'กำลังเชื่อมต่อ... - Soulis' : 'กำลังค้นหาเพื่อน... - Soulis'}</title>
        <meta name="robots" content="noindex" />
      </Helmet>

      {/* Background */}
      <div className="absolute top-[-20%] left-[-20%] w-[500px] h-[500px] bg-soulis-700/30 rounded-full blur-[100px] animate-float"></div>
      <div className="absolute bottom-[-20%] right-[-20%] w-[500px] h-[500px] bg-soulis-accent/20 rounded-full blur-[100px] animate-float delay-1000"></div>

      <div className="z-10 text-center space-y-8 bg-white/5 backdrop-blur-xl p-12 rounded-[2rem] border border-white/10 shadow-2xl w-full max-w-md animate-float">
        <div className="relative inline-block">
            {/* Loading Animation */}
            <div className="relative">
                <div className="w-24 h-24 border-4 border-white/10 rounded-full"></div>
                <div className="absolute inset-0 w-24 h-24 border-4 border-t-soulis-400 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Search className="text-white w-8 h-8 animate-pulse" />
                </div>
            </div>
        </div>
        
        <div>
            <h2 className="text-2xl font-bold text-white mb-2 animate-pulse">{status}</h2>
            <p className="text-soulis-200 text-sm font-light">
                {myRole === 'talker' ? 'กำลังตามหาคนใจดี...' : 'กำลังรอคนที่มีเรื่องเล่า...'}
                <br/>ท่ามกลางดวงดาวนับล้าน ⭐
            </p>
        </div>

        <button onClick={() => navigate('/select-role')} className="text-gray-400 text-xs hover:text-white underline mt-4">
            ยกเลิกการค้นหา
        </button>
      </div>
    </div>
  );
}