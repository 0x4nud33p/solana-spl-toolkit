import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { UrlProvider } from './context/UrlContext.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <UrlProvider>
    <BrowserRouter>
    <App />
    </BrowserRouter>
    </UrlProvider>
  </StrictMode>,
)
