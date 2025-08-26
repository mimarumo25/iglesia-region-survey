import React from 'react';
import { useNavigate } from 'react-router-dom';
import type { SearchResultItem as SearchResult, SearchResults } from '@/services/globalSearch';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  MapPin,
  User,
  Users,
  FileText,
  BarChart3,
  Settings,
  Search,
  X,
  ArrowRight
} from 'lucide-react';

interface GlobalSearchResultsProps {
  results: SearchResults;
  combinedResults: SearchResult[];
  query: string;
  isSearching: boolean;
  hasResults: boolean;
  totalResults: number;
  onClose: () => void;
  onSelectResult: (result: SearchResult) => void;
  className?: string;
}

const iconMap = {
  MapPin,
  User,
  Users,
  FileText,
  BarChart3,
  Settings,
  Search
};

const categoryConfig = {
  familias: {
    title: 'Familias',
    icon: Users,
    color: 'bg-purple-100 text-purple-800'
  },
  sectores: {
    title: 'Sectores',
    icon: MapPin,
    color: 'bg-blue-100 text-blue-800'
  },
  usuarios: {
    title: 'Usuarios',
    icon: User,
    color: 'bg-green-100 text-green-800'
  },
  encuestas: {
    title: 'Encuestas',
    icon: FileText,
    color: 'bg-orange-100 text-orange-800'
  },
  reportes: {
    title: 'Reportes',
    icon: BarChart3,
    color: 'bg-red-100 text-red-800'
  },
  configuracion: {
    title: 'Configuración',
    icon: Settings,
    color: 'bg-gray-100 text-gray-800'
  }
};

/**
 * Componente que renderiza un item de resultado individual
 */
const SearchResultItemComponent: React.FC<{
  result: SearchResult;
  onClick: () => void;
}> = ({ result, onClick }) => {
  const IconComponent = iconMap[result.icon as keyof typeof iconMap] || Search;
  const categoryInfo = categoryConfig[result.type];

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer rounded-lg transition-colors group"
    >
      {/* Ícono */}
      <div className="flex-shrink-0 w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <IconComponent className="w-5 h-5 text-primary" />
      </div>
      
      {/* Contenido */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-medium text-foreground truncate">
            {result.title}
          </h4>
          <Badge variant="secondary" className={`text-xs ${categoryInfo?.color} shrink-0`}>
            {categoryInfo?.title}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground truncate">
          {result.subtitle}
        </p>
        {result.description && (
          <p className="text-xs text-muted-foreground truncate mt-1">
            {result.description}
          </p>
        )}
        
        {/* Campos coincidentes */}
        {result.matchFields.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {result.matchFields.map((field, index) => (
              <span
                key={index}
                className="text-xs bg-primary/10 text-primary px-1.5 py-0.5 rounded"
              >
                {field}
              </span>
            ))}
          </div>
        )}
      </div>
      
      {/* Flecha */}
      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
    </div>
  );
};

/**
 * Componente que renderiza una categoría de resultados
 */
const SearchCategory: React.FC<{
  title: string;
  results: SearchResult[];
  icon: React.ComponentType<any>;
  onSelectResult: (result: SearchResult) => void;
}> = ({ title, results, icon: Icon, onSelectResult }) => {
  if (results.length === 0) return null;

  return (
    <div>
      <div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <h3 className="font-medium text-sm text-foreground">
          {title}
        </h3>
        <Badge variant="outline" className="ml-auto text-xs">
          {results.length}
        </Badge>
      </div>
      <div className="space-y-1">
        {results.map((result) => (
          <SearchResultItemComponent
            key={result.id}
            result={result}
            onClick={() => onSelectResult(result)}
          />
        ))}
      </div>
    </div>
  );
};

/**
 * Componente principal de resultados de búsqueda global
 */
export const GlobalSearchResults: React.FC<GlobalSearchResultsProps> = ({
  results,
  combinedResults,
  query,
  isSearching,
  hasResults,
  totalResults,
  onClose,
  onSelectResult,
  className = ''
}) => {
  const navigate = useNavigate();

  const handleSelectResult = (result: SearchResult) => {
    onSelectResult(result);
    navigate(result.path);
  };

  // Estado de carga
  if (isSearching) {
    return (
      <Card className={`absolute top-full left-0 right-0 mt-1 z-50 ${className}`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-center gap-3">
            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-sm text-muted-foreground">Buscando...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sin resultados
  if (!hasResults && query.length > 0) {
    return (
      <Card className={`absolute top-full left-0 right-0 mt-1 z-50 ${className}`}>
        <CardContent className="p-4">
          <div className="text-center">
            <Search className="w-8 h-8 text-muted-foreground/50 mx-auto mb-2" />
            <p className="text-sm text-muted-foreground mb-1">
              No se encontraron resultados
            </p>
            <p className="text-xs text-muted-foreground/70">
              Intenta con otros términos de búsqueda
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // No mostrar nada si no hay query
  if (!query.length) {
    return null;
  }

  return (
    <Card className={`absolute top-full left-0 right-0 mt-1 z-50 shadow-lg border ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-muted-foreground" />
          <span className="font-medium text-sm text-foreground">
            Resultados para "{query}"
          </span>
          <Badge variant="outline" className="text-xs">
            {totalResults}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Resultados */}
      <ScrollArea className="max-h-96">
        <div className="divide-y">
          {/* Mostrar por categorías */}
          <SearchCategory
            title="Sectores"
            results={results.sectores}
            icon={MapPin}
            onSelectResult={handleSelectResult}
          />
          <SearchCategory
            title="Usuarios"
            results={results.usuarios}
            icon={User}
            onSelectResult={handleSelectResult}
          />
          <SearchCategory
            title="Configuración"
            results={results.configuracion}
            icon={Settings}
            onSelectResult={handleSelectResult}
          />
          <SearchCategory
            title="Familias"
            results={results.familias}
            icon={Users}
            onSelectResult={handleSelectResult}
          />
          <SearchCategory
            title="Encuestas"
            results={results.encuestas}
            icon={FileText}
            onSelectResult={handleSelectResult}
          />
          <SearchCategory
            title="Reportes"
            results={results.reportes}
            icon={BarChart3}
            onSelectResult={handleSelectResult}
          />
        </div>
      </ScrollArea>

      {/* Footer con más opciones */}
      {totalResults > 0 && (
        <div className="p-3 border-t bg-muted/20">
          <p className="text-xs text-center text-muted-foreground">
            Presiona <kbd className="px-1 py-0.5 bg-background rounded text-xs">↵</kbd> para ir al primer resultado
          </p>
        </div>
      )}
    </Card>
  );
};

export default GlobalSearchResults;
