import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import ListaPublicaciones from './ListaPublicaciones.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ListaPublicaciones />
  </StrictMode>,
)
