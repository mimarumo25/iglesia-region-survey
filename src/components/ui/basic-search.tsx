import React, { useState, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

interface BasicSearchProps {
  className?: string;
  placeholder?: string;
}

/**
 * Búsqueda básica funcional para diagnóstico
 */
export const BasicSearch: React.FC<BasicSearchProps> = ({
  className = '',
  placeholder = 'Buscar...'
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Datos de ejemplo para probar
  const sampleData = [
    { id: '1', title: 'Sector La Esperanza', type: 'sector', description: 'Sector principal' },
    { id: '2', title: 'Usuario Admin', type: 'usuario', description: 'Administrador del sistema' },
    { id: '3', title: 'Municipios', type: 'configuracion', description: 'Configuración de municipios' },
    { id: '4', title: 'Parroquias', type: 'configuracion', description: 'Gestión de parroquias' },
  ];

  // Filtrar resultados simples
  const results = query.length >= 2 
    ? sampleData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setIsOpen(value.length >= 2);
  };

  const handleClear = () => {
    setQuery('');
    setIsOpen(false);
  };

  const handleResultClick = (result: any) => {
    console.log('Resultado seleccionado:', result);
    setIsOpen(false);
    // Aquí iría la navegación
  };

  // Cerrar al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.search-container')) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  return (
    <div className={`search-container relative ${className}`}>
      {/* Input de búsqueda */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={handleInputChange}
          className="pl-12 pr-10 py-3 text-sm rounded-xl border-border/30 bg-background/80 backdrop-blur-sm hover:border-primary/30 focus:border-primary transition-all duration-300"
        />
        
        {/* Botón para limpiar */}
        {query && (
          <button
            onClick={handleClear}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 hover:bg-gray-100 rounded"
          >
            <X className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Resultados */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 mt-1 z-50 shadow-lg">
          <CardContent className="p-0">
            {results.length > 0 ? (
              <div className="max-h-96 overflow-y-auto">
                {results.map((result) => (
                  <div
                    key={result.id}
                    onClick={() => handleResultClick(result)}
                    className="flex items-center gap-3 p-3 hover:bg-muted/50 cursor-pointer border-b last:border-b-0"
                  >
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Search className="w-4 h-4 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{result.title}</h4>
                      <p className="text-xs text-muted-foreground">{result.description}</p>
                    </div>
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">
                      {result.type}
                    </span>
                  </div>
                ))}
              </div>
            ) : query.length >= 2 ? (
              <div className="p-4 text-center text-sm text-muted-foreground">
                No se encontraron resultados
              </div>
            ) : null}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
