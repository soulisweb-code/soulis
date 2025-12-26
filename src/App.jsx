import { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BanEnforcer from './components/BanEnforcer';
import Footer from './components/Footer';

// Lazy Load Pages
const Login = lazy(() => import('./pages/Login'));
const RoleSelection = lazy(() => import('./pages/RoleSelection'));
const WaitingRoom = lazy(() => import('./pages/WaitingRoom'));
const Chat = lazy(() => import('./pages/Chat'));
const Profile = lazy(() => import('./pages/Profile'));
const ThankYouListener = lazy(() => import('./pages/ThankYouListener'));
const ThankYouTalker = lazy(() => import('./pages/ThankYouTalker'));
const Instruction = lazy(() => import('./pages/Instruction'));
const AdminLogin = lazy(() => import('./pages/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
const About = lazy(() => import('./pages/About'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Support = lazy(() => import('./pages/Support'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Loading Screen Component
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-screen text-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-soulis-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-soulis-300 text-sm animate-pulse">Loading...</p>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      {/* ยามเฝ้าประตู (เช็คคนโดนแบน) */}
      <BanEnforcer />

      <Suspense fallback={<PageLoader />}>
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

          {/* 404 Not Found */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>

      {/* Footer Menu (จะซ่อนตัวเองอัตโนมัติในหน้าแชท/Admin) */}
      <Footer />

    </BrowserRouter>
  );
}

export default App;