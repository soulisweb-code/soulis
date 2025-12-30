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
      <div className="bg-black/20 backdrop-blur-md border border-white/5 px-6 py-2 rounded-full flex items-center gap-6 text-xs text-soulis-300 pointer-events-auto shadow-lg hover:bg-black/40 transition-all">
        {/* 🔥 เพิ่มปุ่มนี้ */}
        <Link to="/support" className="hover:text-yellow-400 transition flex items-center gap-1 font-bold text-yellow-500/80 hover:underline decoration-yellow-500">
            <Heart size={10} className="fill-current"/> สนับสนุน
        </Link><span className="text-white/10">|</span>

        <Link to="/about" className="hover:text-white transition hover:underline decoration-soulis-500">เกี่ยวกับเรา</Link>
        
        
        
        
        <span className="text-white/10">|</span>
        <Link to="/privacy-policy" className="hover:text-white transition hover:underline decoration-soulis-500">นโยบาย</Link>
        <span className="text-white/10">|</span>
        <span className="opacity-50">© 2024 - {new Date().getFullYear()} Soulis</span>
      </div>
    </footer>
  );
}