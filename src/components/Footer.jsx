import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';

export default function Footer() {
  const location = useLocation();
  
  if (location.pathname.startsWith('/chat') || 
      location.pathname.startsWith('/admin') || 
      location.pathname.startsWith('/instruction') ||
      location.pathname.startsWith('/waiting')) {
    return null;
  }

  return (
    <footer className="fixed bottom-4 left-0 w-full flex justify-center z-40 pointer-events-none">
      {/* 🔥 แก้ไขบรรทัดนี้: เพิ่ม whitespace-nowrap และลด gap ในมือถือ */}
      <div className="bg-black/20 backdrop-blur-md border border-white/5 px-4 py-2 md:px-6 rounded-full flex items-center gap-3 md:gap-6 text-xs text-soulis-300 pointer-events-auto shadow-lg hover:bg-black/40 transition-all whitespace-nowrap max-w-[95%] overflow-x-auto custom-scrollbar-hidden">
        
        <Link to="/support" className="hover:text-yellow-400 transition flex items-center gap-1 font-bold text-yellow-500/80 hover:underline decoration-yellow-500 shrink-0">
            <Heart size={10} className="fill-current"/> สนับสนุน
        </Link>
        
        <span className="text-white/10">|</span>

        <Link to="/about" className="hover:text-white transition hover:underline decoration-soulis-500 shrink-0">เกี่ยวกับเรา</Link>
        
        <span className="text-white/10">|</span>
        
        <Link to="/privacy-policy" className="hover:text-white transition hover:underline decoration-soulis-500 shrink-0">นโยบาย</Link>
        
        <span className="text-white/10">|</span>
        
        <span className="opacity-50 shrink-0">© {new Date().getFullYear()} Soulis</span>
      </div>
    </footer>
  );
}