/**
 * Utilidades para el manejo de diálogos
 * Funciones reutilizables para mejorar la consistencia y evitar duplicación de código
 */

import { useState, useCallback } from 'react';

/**
 * Hook personalizado para manejar el estado de diálogos modales
 * Proporciona funciones reutilizables para abrir, cerrar y toggle de diálogos
 * 
 * @param initialState - Estado inicial del diálogo (abierto/cerrado)
 * @returns Objeto con el estado del diálogo y funciones para controlarlo
 */
export function useDialogState(initialState: boolean = false) {
  const [isOpen, setIsOpen] = useState(initialState);

  const openDialog = useCallback(() => setIsOpen(true), []);
  const closeDialog = useCallback(() => setIsOpen(false), []);
  const toggleDialog = useCallback(() => setIsOpen(prev => !prev), []);
  const setDialogState = useCallback((state: boolean) => setIsOpen(state), []);

  return {
    isOpen,
    openDialog,
    closeDialog,
    toggleDialog,
    setDialogState
  };
}

/**
 * Configuración estándar para diálogos modales
 * Proporciona clases CSS y propiedades consistentes para todos los diálogos
 */
export const DIALOG_CONFIG = {
  content: {
    className: "w-[calc(100%-1rem)] sm:w-full max-w-5xl max-h-[90vh] overflow-y-auto overflow-x-hidden bg-card border-2 border-border rounded-2xl shadow-2xl dark:bg-card dark:border-border"
  },
  header: {
    className: "bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-2xl border-b border-border dark:border-border p-4 sm:p-6"
  },
  title: {
    className: "text-lg sm:text-xl font-bold text-foreground dark:text-foreground flex items-center gap-2"
  },
  description: {
    className: "text-sm sm:text-base text-muted-foreground dark:text-muted-foreground mt-2"
  },
  footer: {
    className: "p-4 sm:p-6 bg-muted/30 rounded-b-2xl border-t border-border dark:bg-muted/30 dark:border-border"
  }
} as const;

/**
 * Propiedades comunes para botones de diálogo
 * Evita duplicación de código en las propiedades de botones
 */
export const DIALOG_BUTTONS = {
  primary: {
    className: "bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
  },
  secondary: {
    className: "rounded-xl border-2 border-border hover:border-border hover:bg-muted/20 dark:bg-muted/20 transition-all duration-200"
  },
  trigger: {
    className: "flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2.5"
  }
} as const;

/**
 * Tipos de estados de formulario para diálogos
 */
export type DialogFormMode = 'create' | 'edit';

/**
 * Hook para manejar el modo de formulario en diálogos (crear/editar)
 * 
 * @param initialMode - Modo inicial del formulario
 * @returns Objeto con el modo actual y funciones para cambiarlo
 */
export function useDialogFormMode(initialMode: DialogFormMode = 'create') {
  const [mode, setMode] = useState<DialogFormMode>(initialMode);

  const setCreateMode = useCallback(() => setMode('create'), []);
  const setEditMode = useCallback(() => setMode('edit'), []);
  const toggleMode = useCallback(() => {
    setMode(prev => prev === 'create' ? 'edit' : 'create');
  }, []);

  const isCreateMode = mode === 'create';
  const isEditMode = mode === 'edit';

  return {
    mode,
    setCreateMode,
    setEditMode,
    toggleMode,
    isCreateMode,
    isEditMode,
    setMode
  };
}

/**
 * Utilidad para generar títulos de diálogo dinámicamente
 * 
 * @param entityName - Nombre de la entidad (ej: "Miembro Familiar")
 * @param mode - Modo del formulario (crear/editar)
 * @returns Título formateado para el diálogo
 */
export function generateDialogTitle(entityName: string, mode: DialogFormMode): string {
  return mode === 'create' ? `Agregar ${entityName}` : `Editar ${entityName}`;
}

/**
 * Utilidad para generar texto de botones dinámicamente
 * 
 * @param mode - Modo del formulario (crear/editar)
 * @param isSubmitting - Estado de envío del formulario
 * @returns Texto del botón de acción
 */
export function generateButtonText(mode: DialogFormMode, isSubmitting: boolean = false): string {
  if (isSubmitting) {
    return 'Guardando...';
  }
  return mode === 'create' ? 'Agregar' : 'Actualizar';
}
