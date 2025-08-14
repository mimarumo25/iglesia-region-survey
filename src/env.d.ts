/// <reference types="vite/client" />

// Tipado de variables de entorno para TypeScript
interface ImportMetaEnv {
  readonly VITE_BASE_URL_SERVICES: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
