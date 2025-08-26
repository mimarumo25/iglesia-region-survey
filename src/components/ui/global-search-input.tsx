import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Sparkles, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useGlobalSearchContext } from '@/context/GlobalSearchContext';
import { GlobalSearchResults } from '@/components/ui/global-search-results';

interface GlobalSearchInputProps {
  className?: string;
  placeholder?: string;
}

/**
 * Componente de entrada de búsqueda global
 * Incluye el input y el dropdown de resultados
 */
export const GlobalSearchInput: React.FC<GlobalSearchInputProps> = ({
  className = '',
  placeholder = 'Buscar familias, sectores...'
}) => {
  const navigate = useNavigate();
  const {
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
  } = useGlobalSearchContext();

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Manejar click fuera para cerrar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, setIsOpen]);

  // Manejar teclas
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Ctrl/Cmd + K para enfocar búsqueda
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      
      // Enter para ir al primer resultado
      if (event.key === 'Enter' && isOpen && combinedResults.length > 0) {
        event.preventDefault();
        const firstResult = combinedResults[0];
        if (firstResult) {
          // Usar navigate en lugar de window.location
          navigate(firstResult.path);
          setIsOpen(false);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, combinedResults, setIsOpen, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleInputFocus = () => {
    if (query.length >= 2) {
      setIsOpen(true);
    }
  };

  const handleClear = () => {
    clearSearch();
    inputRef.current?.focus();
  };

  const handleSelectResult = (result: any) => {
    setIsOpen(false);
    // La navegación se maneja en el componente de resultados
  };

  return (
    <div ref={containerRef} className={`relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground transition-colors duration-300" />
        <Input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          className="pl-12 pr-12 py-3 parish-input text-sm rounded-xl border-border/30 bg-background/80 backdrop-blur-sm hover:border-primary/30 focus:border-primary transition-all duration-300 hover-lift"
        />
        
        {/* Iconos del lado derecho */}
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 w-6 p-0 hover:bg-destructive/10"
            >
              <X className="w-3 h-3" />
            </Button>
          )}
          {!query && (
            <Sparkles className="w-4 h-4 text-muted-foreground/50" />
          )}
        </div>
      </div>

      {/* Resultados de búsqueda */}
      {isOpen && (
        <GlobalSearchResults
          results={results}
          combinedResults={combinedResults}
          query={query}
          isSearching={isSearching}
          hasResults={hasResults}
          totalResults={totalResults}
          onClose={() => setIsOpen(false)}
          onSelectResult={handleSelectResult}
          className="w-full min-w-[400px]"
        />
      )}

      {/* Indicador de atajos de teclado */}
      {!isOpen && !query && (
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
          <kbd className="hidden sm:inline-block px-2 py-1 text-xs bg-muted/50 rounded border text-muted-foreground">
            Ctrl+K
          </kbd>
        </div>
      )}
    </div>
  );
};
