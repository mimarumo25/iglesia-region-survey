import * as React from "react"
import { Check, ChevronsUpDown, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Loader2 } from "lucide-react"

export interface MultiSelectOption {
  id: number | string;
  nombre: string;
  [key: string]: any; // Permitir propiedades adicionales
}

interface MultiSelectWithChipsProps {
  options: MultiSelectOption[];
  value: MultiSelectOption[];
  onChange: (value: MultiSelectOption[]) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  isLoading?: boolean;
  error?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente de selección múltiple con chips visuales
 * Permite seleccionar múltiples opciones de una lista y las muestra como chips
 * 
 * @example
 * ```tsx
 * const [selectedHabilidades, setSelectedHabilidades] = useState<MultiSelectOption[]>([]);
 * 
 * <MultiSelectWithChips
 *   options={habilidades}
 *   value={selectedHabilidades}
 *   onChange={setSelectedHabilidades}
 *   placeholder="Seleccionar habilidades..."
 *   searchPlaceholder="Buscar habilidad..."
 *   emptyText="No se encontraron habilidades"
 * />
 * ```
 */
export const MultiSelectWithChips = ({
  options,
  value,
  onChange,
  placeholder = "Seleccionar opciones...",
  searchPlaceholder = "Buscar...",
  emptyText = "No se encontraron opciones",
  isLoading = false,
  error,
  disabled = false,
  className,
}: MultiSelectWithChipsProps) => {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")

  // Función para verificar si una opción está seleccionada
  const isSelected = (option: MultiSelectOption) => {
    return value.some(item => item.id === option.id)
  }

  // Función para agregar o quitar una opción
  const toggleOption = (option: MultiSelectOption) => {
    console.log('🔘 toggleOption llamado:', { option, currentValue: value });
    
    if (isSelected(option)) {
      // Remover opción
      const newValue = value.filter(item => item.id !== option.id);
      console.log('➖ Removiendo opción. Nuevo valor:', newValue);
      onChange(newValue);
    } else {
      // Agregar opción
      const newValue = [...value, option];
      console.log('➕ Agregando opción. Nuevo valor:', newValue);
      onChange(newValue);
    }
  }

  // Función para remover una opción específica
  const removeOption = (optionId: number | string) => {
    console.log('🗑️ removeOption llamado:', { optionId, currentValue: value });
    const newValue = value.filter(item => item.id !== optionId);
    console.log('🗑️ Nuevo valor después de remover:', newValue);
    onChange(newValue);
  }

  // Función para limpiar todas las selecciones
  const clearAll = () => {
    onChange([])
  }

  // Filtrar opciones según búsqueda
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options;
    
    const searchLower = searchValue.toLowerCase();
    return options.filter(option => 
      option.nombre.toLowerCase().includes(searchLower)
    );
  }, [options, searchValue]);

  return (
    <div className={cn("space-y-2", className)}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            disabled={disabled || isLoading}
            className={cn(
              "w-full justify-between",
              error && "border-destructive focus-visible:ring-destructive",
              !value.length && "text-muted-foreground"
            )}
          >
            <span className="truncate">
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Cargando...
                </span>
              ) : value.length > 0 ? (
                `${value.length} seleccionado${value.length > 1 ? 's' : ''}`
              ) : (
                placeholder
              )}
            </span>
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput 
              placeholder={searchPlaceholder} 
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList>
              <CommandEmpty>{emptyText}</CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((option) => (
                  <CommandItem
                    key={option.id}
                    value={option.nombre}
                    onSelect={() => toggleOption(option)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected(option) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    {option.nombre}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      {/* Chips de opciones seleccionadas */}
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 p-3 bg-muted/50 rounded-lg border border-border">
          {value.map((option) => (
            <Badge
              key={option.id}
              variant="secondary"
              className="gap-1 pr-1 text-sm font-medium hover:bg-secondary/80 transition-colors"
            >
              <span>{option.nombre}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-auto p-0.5 hover:bg-destructive/20 rounded-full ml-1"
                onClick={(e) => {
                  e.preventDefault();
                  removeOption(option.id);
                }}
              >
                <X className="h-3 w-3" />
                <span className="sr-only">Remover {option.nombre}</span>
              </Button>
            </Badge>
          ))}
          
          {value.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto px-2 py-1 text-xs text-muted-foreground hover:text-destructive"
              onClick={clearAll}
            >
              Limpiar todo
            </Button>
          )}
        </div>
      )}

      {/* Mensaje de error */}
      {error && (
        <p className="text-sm text-destructive font-medium">{error}</p>
      )}
    </div>
  )
}
