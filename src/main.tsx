import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Grid from './components/Grid/Grid'
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Grid />
  </StrictMode>,
)
