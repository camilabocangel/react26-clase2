import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import SpaceInvaders from './SpaceInvaders'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <SpaceInvaders />
  </StrictMode>,
)