import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './serpiente.css'
import Serpiente from './serpiente.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Serpiente />
  </StrictMode>,
)
