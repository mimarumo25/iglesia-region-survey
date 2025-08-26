import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface SimpleSearchProps {
  className?: string;
  placeholder?: string;
}

/**
 * Versión simplificada de búsqueda para diagnóstico
 */
export const SimpleSearch: React.FC<SimpleSearchProps> = ({
  className = '',
  placeholder = 'Buscar...'
}) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    console.log('Búsqueda:', e.target.value);
  };

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={handleInputChange}
        className="pl-12 pr-4 py-3 text-sm rounded-xl border-border/30 bg-background/80 backdrop-blur-sm hover:border-primary/30 focus:border-primary transition-all duration-300"
      />
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 p-2 bg-white border rounded shadow-lg z-50">
          <p className="text-sm text-gray-600">Buscando: {query}</p>
        </div>
      )}
    </div>
  );
};
