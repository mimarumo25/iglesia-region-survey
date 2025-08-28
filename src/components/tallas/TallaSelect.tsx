/**
 * Componente de Selección de Tallas
 * 
 * @description Componente reutilizable que proporciona un selector optimizado
 * para tallas de vestimenta con soporte para select nativo y combobox con
 * funcionalidad de búsqueda/autocomplete.
 * 
 * @author Sistema MIA - Módulo de Tallas
 * @version 1.0.0
 */

import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown, Search, Shirt } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import { useTallas, useTallasSearch } from '@/hooks/useTallas';
import { TallaSelectProps, TipoTalla } from '@/types/tallas';

/**
 * Iconos para cada tipo de talla
 */
const ICONOS_TALLA = {
  camisa: Shirt,
  pantalon: Shirt, // Se puede cambiar por un icono específico de pantalón
  calzado: Shirt, // Se puede cambiar por un icono específico de zapato
} as const;

/**
 * Etiquetas legibles para cada tipo de talla
 */
const ETIQUETAS_TALLA = {
  camisa: 'Camisa/Blusa',
  pantalon: 'Pantalón',
  calzado: 'Calzado',
} as const;

/**
 * Componente principal de selección de tallas
 */
export const TallaSelect: React.FC<TallaSelectProps> = ({
  value,
  onChange,
  tipo,
  placeholder,
  disabled = false,
  className,
  variant = 'select'
}) => {
  const { getTallasPorTipo, getTallaNombre } = useTallas();
  const tallas = useMemo(() => getTallasPorTipo(tipo), [getTallasPorTipo, tipo]);
  
  const placeholderText = placeholder || `Seleccione talla de ${ETIQUETAS_TALLA[tipo].toLowerCase()}`;

  // Renderizar como Select nativo para mejor UX en dispositivos móviles
  if (variant === 'select') {
    return (
      <Select
        value={value}
        onValueChange={onChange}
        disabled={disabled}
      >
        <SelectTrigger className={cn("w-full", className)}>
          <SelectValue placeholder={placeholderText} />
        </SelectTrigger>
        <SelectContent className="max-h-[200px]">
          {tallas.map((talla) => (
            <SelectItem key={talla.id} value={talla.id}>
              <div className="flex items-center gap-2">
                <span className="font-medium">{talla.nombre}</span>
                {talla.descripcion && (
                  <span className="text-xs text-muted-foreground">
                    ({talla.descripcion})
                  </span>
                )}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }

  // Renderizar como Combobox para funcionalidad avanzada
  return (
    <TallaCombobox
      value={value}
      onChange={onChange}
      tipo={tipo}
      placeholder={placeholderText}
      disabled={disabled}
      className={className}
    />
  );
};

/**
 * Componente Combobox para selección avanzada con búsqueda
 */
const TallaCombobox: React.FC<Omit<TallaSelectProps, 'variant'>> = ({
  value,
  onChange,
  tipo,
  placeholder = '',
  disabled = false,
  className
}) => {
  const [open, setOpen] = useState(false);
  const { getTallasPorTipo, getTallaNombre } = useTallas();
  const { searchTallas } = useTallasSearch();
  const [searchQuery, setSearchQuery] = useState('');

  const tallas = useMemo(() => getTallasPorTipo(tipo), [getTallasPorTipo, tipo]);
  
  const filteredTallas = useMemo(() => {
    if (!searchQuery) return tallas;
    return searchTallas(searchQuery, tipo);
  }, [searchQuery, tallas, searchTallas, tipo]);

  const selectedTallaNombre = value ? getTallaNombre(tipo, value) : '';
  const IconoTalla = ICONOS_TALLA[tipo];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between",
            !value && "text-muted-foreground",
            className
          )}
          disabled={disabled}
        >
          <div className="flex items-center gap-2">
            <IconoTalla className="w-4 h-4" />
            {value ? (
              <span className="font-medium">{selectedTallaNombre}</span>
            ) : (
              placeholder
            )}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
        <Command>
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput
              placeholder={`Buscar talla de ${ETIQUETAS_TALLA[tipo].toLowerCase()}...`}
              className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <CommandList>
            <CommandEmpty>
              No se encontraron tallas que coincidan con "{searchQuery}".
            </CommandEmpty>
            <CommandGroup>
              {filteredTallas.map((talla) => (
                <CommandItem
                  key={talla.id}
                  value={talla.id}
                  onSelect={() => {
                    onChange(talla.id === value ? "" : talla.id);
                    setOpen(false);
                    setSearchQuery('');
                  }}
                  className="flex items-center gap-2"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === talla.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{talla.nombre}</span>
                    {talla.descripcion && (
                      <span className="text-xs text-muted-foreground">
                        {talla.descripcion}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

/**
 * Componente de grupo de tallas (para formularios completos)
 */
interface TallasGroupProps {
  values: {
    talla_camisa: string;
    talla_pantalon: string;
    talla_zapato: string;
  };
  onChange: (field: string, value: string) => void;
  disabled?: boolean;
  variant?: 'select' | 'combobox';
  className?: string;
}

export const TallasGroup: React.FC<TallasGroupProps> = ({
  values,
  onChange,
  disabled = false,
  variant = 'select',
  className
}) => {
  return (
    <div className={cn("space-y-4", className)}>
      {/* Talla de Camisa/Blusa */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Talla de Camisa/Blusa
        </label>
        <TallaSelect
          tipo="camisa"
          value={values.talla_camisa}
          onChange={(value) => onChange('talla_camisa', value)}
          disabled={disabled}
          variant={variant}
        />
      </div>

      {/* Talla de Pantalón */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Talla de Pantalón
        </label>
        <TallaSelect
          tipo="pantalon"
          value={values.talla_pantalon}
          onChange={(value) => onChange('talla_pantalon', value)}
          disabled={disabled}
          variant={variant}
        />
      </div>

      {/* Talla de Calzado */}
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          Talla de Calzado
        </label>
        <TallaSelect
          tipo="calzado"
          value={values.talla_zapato}
          onChange={(value) => onChange('talla_zapato', value)}
          disabled={disabled}
          variant={variant}
        />
      </div>
    </div>
  );
};

export default TallaSelect;
