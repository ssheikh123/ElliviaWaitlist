import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { LangProvider } from './i18n/lang.tsx'
import PrivacyPage from './PrivacyPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LangProvider page="privacy">
      <PrivacyPage />
    </LangProvider>
  </StrictMode>,
)
