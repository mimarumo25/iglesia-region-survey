import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    hmr: {
      // Configurar HMR para evitar recargas innecesarias
      overlay: false, // Deshabilitar overlay de errores que puede causar recargas
    },
    watch: {
      // Optimizar el watching de archivos
      ignored: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
      usePolling: false, // Usar eventos del sistema de archivos en lugar de polling
    },
    proxy: {
      '/api': {
        target: 'http://206.62.139.100:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [
    react(), // Configuración por defecto es la más estable
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
        },
      },
    },
  },
  // Configuración optimizada para desarrollo
  esbuild: {
    // Configurar esbuild para mejor estabilidad
    logOverride: { 
      'this-is-undefined-in-esm': 'silent' 
    }
  },
  // Configuración para SPA - redirigir todas las rutas al index.html
  preview: {
    host: "::",
    port: 8080,
  },
}));
