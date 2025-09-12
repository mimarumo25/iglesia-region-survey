import React, { useState, useMemo, useCallback } from 'react';
import { Search, X, MapPin, User, Settings, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

// Base de funcionalidades optimizada (solo las más importantes)
const coreFunctionalities = [
  { id: 'dashboard', title: 'Dashboard', route: '/dashboard', icon: Home, keywords: ['inicio', 'principal', 'home'] },
  { id: 'surveys', title: 'Encuestas', route: '/surveys', icon: Settings, keywords: ['encuestas', 'formularios'] },
  { id: 'families', title: 'Familias', route: '/families', icon: User, keywords: ['familias', 'hogares'] },
  { id: 'sectors', title: 'Sectores', route: '/sectors', icon: MapPin, keywords: ['sectores', 'zonas'] },
  { id: 'users', title: 'Usuarios', route: '/users', icon: User, keywords: ['usuarios', 'personas'] },
  { id: 'settings', title: 'Configuración', route: '/settings', icon: Settings, keywords: ['configuración', 'ajustes'] },
];

interface FastSearchProps {
  className?: string;
  placeholder?: string;
}

/**
 * Buscador optimizado para rendimiento máximo
 * - Sin debounce para respuesta inmediata
 * - Búsqueda solo en funcionalidades core
 * - Mínimas operaciones en tiempo real
 */
export const FastSearch: React.FC<FastSearchProps> = ({
  className = '',
  placeholder = 'Búsqueda rápida...'
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Búsqueda optimizada sin operaciones pesadas
  const results = useMemo(() => {
    if (!query) return [];
    
    const searchTerm = query.toLowerCase();
    const matches: any[] = [];
    
    // Búsqueda simple y directa
    for (const func of coreFunctionalities) {
      const titleMatch = func.title.toLowerCase().includes(searchTerm);
      const keywordMatch = func.keywords.some(k => k.includes(searchTerm));
      
      if (titleMatch || keywordMatch) {
        matches.push({
          ...func,
          relevance: titleMatch ? 10 : 5
        });
        
        if (matches.length >= 6) break; // Limitar a 6 resultados máximo
      }
    }
    
    return matches.sort((a, b) => b.relevance - a.relevance);
  }, [query]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length > 0);
  }, []);

  const handleResultClick = useCallback((route: string) => {
    navigate(route);
    setQuery('');
    setIsOpen(false);
  }, [navigate]);

  const handleClear = useCallback(() => {
    setQuery('');
    setIsOpen(false);
  }, []);

  return (
    <div className={cn("relative w-full", className)}>
      {/* Input optimizado */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-10 pr-10 py-2 text-sm rounded-lg border-border/50 bg-background/95 hover:border-primary/50 focus:border-primary focus:ring-1 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-muted rounded-full"
          >
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        )}
      </div>

      {/* Resultados */}
      {isOpen && results.length > 0 && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0">
            {results.map((result) => {
              const IconComponent = result.icon;
              return (
                <div
                  key={result.id}
                  onClick={() => handleResultClick(result.route)}
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <IconComponent className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium text-foreground">{result.title}</span>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    Ir
                  </Badge>
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
