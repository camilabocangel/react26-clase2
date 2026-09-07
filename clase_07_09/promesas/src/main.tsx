import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Promesas from './promesas.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Promesas />
  </StrictMode>,
)