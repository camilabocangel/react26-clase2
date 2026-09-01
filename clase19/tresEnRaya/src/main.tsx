import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import TresEnRaya from './TresEnRaya.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <TresEnRaya/>
  </StrictMode>,
)
