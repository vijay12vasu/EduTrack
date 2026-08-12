import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AchievementProvider } from './context/AchievementContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AchievementProvider>
      <App />
    </AchievementProvider>
  </StrictMode>,
)