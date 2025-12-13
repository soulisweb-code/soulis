import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async' // 🔥 เพิ่มบรรทัดนี้
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {/* 🔥 ครอบ App ด้วย HelmetProvider เพื่อให้ SEO ทำงาน */}
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </StrictMode>,
)