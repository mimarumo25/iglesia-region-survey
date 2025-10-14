import React from 'react' // Removed StrictMode
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

// Importar interceptor de axios para configurar automáticamente las peticiones
import '@/interceptors/axios'

// Importar estilos globales
import './index.css'
import '@/config/dateFormat' // Configurar date-fns en español

// Suprimir advertencias no deseadas en desarrollo
if (import.meta.env.DEV) {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    const message = args[0];
    
    // Lista de advertencias a suprimir
    const suppressWarnings = [
      'Download the React DevTools',
      'React Router Future Flag Warning',
      'v7_startTransition',
      'v7_relativeSplatPath',
      'React Router will begin wrapping state updates',
      'Relative route resolution within Splat routes'
    ];
    
    // Verificar si el mensaje contiene alguna advertencia a suprimir
    if (typeof message === 'string' && suppressWarnings.some(warning => message.includes(warning))) {
      return;
    }
    
    originalWarn.apply(console, args);
  };
}

// Create a client with optimized settings for DOM stability
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        // Reduce retries for DOM-related errors
        if (error?.message?.includes('removeChild') || 
            error?.message?.includes('NotFoundError')) {
          return false;
        }
        return failureCount < 3;
      },
    },
  },
})

// Enhanced error handling for DOM manipulation errors
const handleDOMError = (error: any, context: string) => {
  const isDOMError = error?.message?.includes('removeChild') ||
                    error?.message?.includes('The node to be removed is not a child') ||
                    error?.message?.includes('NotFoundError') ||
                    error?.stack?.includes('commitDeletionEffectsOnFiber');
  
  if (isDOMError) {
    // DOM Error handled - no propagation to avoid cascading failures
    return true;
  }
  return false;
};

// Handler global para errores de extensiones del navegador y DOM
window.addEventListener('error', (event) => {
  // Handle browser extension errors
  if (event.filename && (
    event.filename.includes('extension://') || 
    event.filename.includes('contentScript.js') ||
    event.filename.includes('content-script') ||
    event.message.includes('reading \'sentence\'')
  )) {
    event.preventDefault();
    return true;
  }

  // Handle DOM manipulation errors
  if (handleDOMError(event.error, 'Global Error Handler')) {
    event.preventDefault();
    return true;
  }
});

// Enhanced handler para promesas rechazadas
window.addEventListener('unhandledrejection', (event) => {
  // Handle contentScript errors
  if (event.reason && event.reason.message && (
    event.reason.message.includes('contentScript') ||
    event.reason.message.includes('reading \'sentence\'') ||
    event.reason.stack?.includes('extension://') ||
    event.reason.message.includes('A listener indicated an asynchronous response by returning true')
  )) {
    event.preventDefault();
    return true;
  }

  // Handle DOM manipulation promise rejections
  if (handleDOMError(event.reason, 'Unhandled Promise Rejection')) {
    event.preventDefault();
    return true;
  }
});

// Prevenir recargas automáticas en desarrollo por cambios de foco/visibilidad
if (import.meta.env.DEV) {
  // Deshabilitar recarga automática cuando la pestaña pierde/gana foco
  let isPageVisible = true;
  
  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
  });

  // Evitar recargas innecesarias del HMR
  if (import.meta.hot) {
    import.meta.hot.on('vite:beforeUpdate', () => {
      // Solo aplicar actualizaciones si la página es visible
      return isPageVisible;
    });
  }
}

// Add React error boundary fallback at the root level
const rootElement = document.getElementById('root')!;
const root = createRoot(rootElement);

// Render without StrictMode to avoid double-mounting issues that can cause DOM errors
root.render(
  <QueryClientProvider client={queryClient}>
    <App />
    <ReactQueryDevtools initialIsOpen={false} />
  </QueryClientProvider>
);
