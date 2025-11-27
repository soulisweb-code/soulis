import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import RoleSelection from './pages/RoleSelection';
import WaitingRoom from './pages/WaitingRoom';
import Chat from './pages/Chat';
import Profile from './pages/Profile';
import ThankYouListener from './pages/ThankYouListener';
import ThankYouTalker from './pages/ThankYouTalker';
import Instruction from './pages/Instruction';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import About from './pages/About';
import PrivacyPolicy from './pages/PrivacyPolicy';
import BanEnforcer from './components/BanEnforcer';
import Footer from './components/Footer';
import Support from './pages/Support';

function App() {
  return (
    <BrowserRouter>
      {/* Layer ดวงดาว (Galaxy Background) */}
      <div className="stars"></div>
      <div className="stars2"></div>
      
      {/* ยามเฝ้าประตู (เช็คคนโดนแบน) */}
      <BanEnforcer /> 

      <Routes>
        {/* User Routes */}
        <Route path="/" element={<Login />} />
        <Route path="/select-role" element={<RoleSelection />} />
        <Route path="/instruction" element={<Instruction />} />
        <Route path="/waiting" element={<WaitingRoom />} />
        <Route path="/chat/:matchId" element={<Chat />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/thank-you-listener" element={<ThankYouListener />} />
        <Route path="/thank-you-talker" element={<ThankYouTalker />} />
        
        {/* Info Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        
        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/support" element={<Support />} />
      </Routes>

      {/* Footer Menu (จะซ่อนตัวเองอัตโนมัติในหน้าแชท/Admin) */}
      <Footer />
      
    </BrowserRouter>
  );
}

export default App;