import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { captureReferral } from './lib/referral.ts'

// Record the first-touch ?ref= before anything else (anchors never change it).
captureReferral()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
