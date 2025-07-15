import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Handler global para errores de extensiones del navegador
window.addEventListener('error', (event) => {
  // Filtrar errores que provienen de scripts de extensiones
  if (event.filename && (
    event.filename.includes('extension://') || 
    event.filename.includes('contentScript.js') ||
    event.filename.includes('content-script') ||
    event.message.includes('reading \'sentence\'')
  )) {
    console.warn('Error de extensión del navegador filtrado:', event.message);
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
    console.warn('Promise rejection de extensión filtrada:', event.reason.message);
    event.preventDefault();
    return true;
  }
});

createRoot(document.getElementById("root")!).render(<App />);
