import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

export default function BanEnforcer() {
  const navigate = useNavigate();

  useEffect(() => {
    const checkBanStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_banned')
        .eq('id', user.id)
        .single();

      if (profile && profile.is_banned) {
        await performBan();
      }
    };

    const performBan = async () => {
      alert('⛔ บัญชีของคุณถูกระงับการใช้งานโดยผู้ดูแลระบบ');
      await supabase.auth.signOut();
      sessionStorage.clear(); 
      localStorage.clear(); 
      window.location.href = '/';
    };

    checkBanStatus();

    const channel = supabase.channel('ban-enforcer')
      .on('postgres_changes', 
        { event: 'UPDATE', schema: 'public', table: 'profiles' }, 
        async (payload) => {
          const { data: { user } } = await supabase.auth.getUser();
          if (user && payload.new.id === user.id && payload.new.is_banned === true) {
            performBan();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [navigate]);

  return null;
}