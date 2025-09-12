import { useState, useEffect, useMemo } from 'react';
import { GlobalSearchService, SearchResults, SearchableData } from '@/services/globalSearch';

// Hook optimizado de debounce con delay más corto
const useDebounceValue = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // Si el valor está vacío, actualizar inmediatamente
    if (!value) {
      setDebouncedValue(value);
      return;
    }

    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export interface UseGlobalSearchOptions {
  maxResults?: number;
  debounceMs?: number;
  minQueryLength?: number;
}

export interface UseGlobalSearchReturn {
  query: string;
  setQuery: (query: string) => void;
  results: SearchResults;
  combinedResults: any[];
  isSearching: boolean;
  hasResults: boolean;
  totalResults: number;
  clearSearch: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

/**
 * Hook personalizado para búsqueda global
 * Maneja la lógica de búsqueda, debounce y estado
 */
export const useGlobalSearch = (
  data: SearchableData,
  options: UseGlobalSearchOptions = {}
): UseGlobalSearchReturn => {
  const {
    maxResults = 10,
    debounceMs = 150, // Reducido de 300 a 150ms
    minQueryLength = 1 // Reducido de 2 a 1
  } = options;

  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  // Debounce del query para evitar búsquedas innecesarias
  const debouncedQuery = useDebounceValue(query, debounceMs);

  // Realizar búsqueda cuando cambia el query debounced
  const results = useMemo(() => {
    if (!debouncedQuery || debouncedQuery.length < minQueryLength) {
      setIsSearching(false);
      return {
        familias: [],
        sectores: [],
        usuarios: [],
        encuestas: [],
        reportes: [],
        configuracion: []
      };
    }

    setIsSearching(true);
    
    try {
      const searchResults = GlobalSearchService.searchGlobal(debouncedQuery, data, maxResults);
      setIsSearching(false);
      return searchResults;
    } catch (error) {
      console.error('Error en búsqueda global:', error);
      setIsSearching(false);
      return {
        familias: [],
        sectores: [],
        usuarios: [],
        encuestas: [],
        reportes: [],
        configuracion: []
      };
    }
  }, [debouncedQuery, data, maxResults, minQueryLength]);

  // Resultados combinados y ordenados por relevancia
  const combinedResults = useMemo(() => {
    return GlobalSearchService.getCombinedResults(results);
  }, [results]);

  // Calcular estadísticas
  const totalResults = useMemo(() => {
    return Object.values(results).reduce((total, categoryResults) => total + categoryResults.length, 0);
  }, [results]);

  const hasResults = totalResults > 0;

  // Efectos
  useEffect(() => {
    // Abrir automáticamente cuando hay query y resultados
    if (query.length >= minQueryLength && !isSearching) {
      setIsOpen(true);
    } else if (query.length === 0) {
      setIsOpen(false);
    }
  }, [query, minQueryLength, isSearching]);

  // Funciones
  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
  };

  // Cerrar cuando se hace clic fuera (manejado por el componente padre)
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isOpen]);

  return {
    query,
    setQuery,
    results,
    combinedResults,
    isSearching,
    hasResults,
    totalResults,
    clearSearch,
    isOpen,
    setIsOpen
  };
};
