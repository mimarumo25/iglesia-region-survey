import React, { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Importar interceptor de axios para configurar automáticamente las peticiones
import '@/interceptors/axios'

// Create a client
const queryClient = new QueryClient()

// Handler global para errores de extensiones del navegador
window.addEventListener('error', (event) => {
  // Filtrar errores que provienen de scripts de extensiones
  if (event.filename && (
    event.filename.includes('extension://') || 
    event.filename.includes('contentScript.js') ||
    event.filename.includes('content-script') ||
    event.message.includes('reading \'sentence\'')
  )) {
    event.preventDefault();
    return true;
  }
});

// Handler para promesas rechazadas (como el error de contentScript)
window.addEventListener('unhandledrejection', (event) => {
  if (event.reason && event.reason.message && (
    event.reason.message.includes('contentScript') ||
    event.reason.message.includes('reading \'sentence\'') ||
    event.reason.stack?.includes('extension://')
  )) {
    event.preventDefault();
    return true;
  }
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
