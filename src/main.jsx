import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from 'react-helmet-async'
// 1. ✅ นำเข้า SpeedInsights (เพิ่มบรรทัดนี้)
import { SpeedInsights } from "@vercel/speed-insights/react"

import ErrorBoundary from './components/ErrorBoundary'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <App />
        {/* 2. ✅ วาง Component ไว้ตรงนี้ (วางคู่กับ App ใน HelmetProvider ได้เลย) */}
        <SpeedInsights />
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>,
)