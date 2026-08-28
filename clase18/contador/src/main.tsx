import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import EjemploLlaves from './EjemploLlaves.tsx'
import Contador from './contador.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <EjemploLlaves />
    <Contador />
  </StrictMode>,
)
