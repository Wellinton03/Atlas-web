import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Movements from './pages/Movements/Movements'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Movements />
  </StrictMode>,
)
