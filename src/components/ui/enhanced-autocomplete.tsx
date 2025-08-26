import * as React from "react"
import { Check, ChevronsUpDown, Search, X, Star } from "lucide-react"
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

export interface AutocompleteOption {
  value: string
  label: string
  description?: string
  category?: string
  popular?: boolean
  disabled?: boolean
}

interface EnhancedAutocompleteProps {
  options: AutocompleteOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  loading?: boolean
  multiple?: boolean
  showCategories?: boolean
  showDescriptions?: boolean
  allowClear?: boolean
  maxHeight?: string
}

export function EnhancedAutocomplete({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar opción...",
  emptyText = "No se encontraron opciones.",
  searchPlaceholder = "Buscar...",
  disabled = false,
  className,
  loading = false,
  multiple = false,
  showCategories = false,
  showDescriptions = true,
  allowClear = true,
  maxHeight = "300px",
}: EnhancedAutocompleteProps) {
  const [open, setOpen] = React.useState(false)
  const [searchValue, setSearchValue] = React.useState("")
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0)

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  const selectedOption = options.find((option) => option.value === value)

  // Función para limpiar la selección
  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onValueChange("")
    setSearchValue("")
  }

  // Filtrar y agrupar opciones basado en la búsqueda
  const filteredAndGroupedOptions = React.useMemo(() => {
    let filtered = options.filter(option => 
      option.label.toLowerCase().includes(searchValue.toLowerCase()) ||
      (option.description && option.description.toLowerCase().includes(searchValue.toLowerCase()))
    )

    if (showCategories) {
      const grouped = filtered.reduce((acc, option) => {
        const category = option.category || 'Sin categoría'
        if (!acc[category]) {
          acc[category] = []
        }
        acc[category].push(option)
        return acc
      }, {} as Record<string, AutocompleteOption[]>)

      return Object.entries(grouped).map(([category, options]) => ({
        category,
        options: options.sort((a, b) => {
          // Primero las populares, luego alfabéticamente
          if (a.popular && !b.popular) return -1
          if (!a.popular && b.popular) return 1
          return a.label.localeCompare(b.label)
        })
      }))
    }

    return [{
      category: '',
      options: filtered.sort((a, b) => {
        if (a.popular && !b.popular) return -1
        if (!a.popular && b.popular) return 1
        return a.label.localeCompare(b.label)
      })
    }]
  }, [options, searchValue, showCategories])

  const renderOption = (option: AutocompleteOption) => (
    <CommandItem
      key={option.value}
      value={`${option.label} ${option.description || ''}`}
      disabled={option.disabled}
      onSelect={() => {
        if (option.disabled) return
        const newValue = value === option.value ? "" : option.value
        onValueChange(newValue)
        setOpen(false)
        setSearchValue("")
      }}
      className={cn(
        "cursor-pointer hover:bg-blue-50 px-3 py-3 text-gray-800 rounded-lg transition-all duration-150 mx-1 my-0.5 flex items-center gap-3 min-h-[44px]",
        option.disabled && "opacity-50 cursor-not-allowed hover:bg-transparent",
        value === option.value && "bg-blue-100 border border-blue-200"
      )}
    >
      <Check
        className={cn(
          "h-4 w-4 flex-shrink-0",
          value === option.value ? "opacity-100 text-blue-600" : "opacity-0"
        )}
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className={cn(
            "text-sm font-medium truncate",
            option.disabled ? "text-gray-400" : "text-gray-900"
          )}>
            {option.label}
          </span>
          {option.popular && (
            <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
          )}
        </div>
        
        {showDescriptions && option.description && (
          <p className={cn(
            "text-xs mt-1 truncate",
            option.disabled ? "text-gray-300" : "text-gray-500"
          )}>
            {option.description}
          </p>
        )}
      </div>
    </CommandItem>
  )

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold shadow-inner rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200",
            !selectedOption && "text-gray-500",
            disabled && "opacity-50 cursor-not-allowed",
            className
          )}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Search className="w-4 h-4 flex-shrink-0 text-gray-600" />
            <div className="flex-1 text-left min-w-0">
              {selectedOption ? (
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="truncate font-medium">
                      {selectedOption.label}
                    </span>
                    {selectedOption.popular && (
                      <Star className="w-3 h-3 text-yellow-500 fill-current flex-shrink-0" />
                    )}
                  </div>
                  {selectedOption.description && showDescriptions && (
                    <p className="text-xs text-gray-500 truncate">
                      {selectedOption.description}
                    </p>
                  )}
                </div>
              ) : (
                <span className="text-gray-500 font-normal">{placeholder}</span>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-1 flex-shrink-0">
            {selectedOption && !disabled && allowClear && (
              <div
                role="button"
                tabIndex={0}
                onClick={clearSelection}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    clearSelection(e as any);
                  }
                }}
                className="p-1 rounded-md hover:bg-gray-300 transition-colors duration-150"
                aria-label="Limpiar selección"
              >
                <X className="w-3 h-3 text-gray-600" />
              </div>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      
      <PopoverContent 
        className="p-0 bg-white border-2 border-gray-300 rounded-xl shadow-xl" 
        align="start" 
        side="bottom"
        style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : 'var(--radix-popover-trigger-width)' }}
        sideOffset={4}
      >
        <Command className="rounded-xl border-0 shadow-lg">
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="h-12 border-0 focus:ring-0 bg-gray-50 text-gray-900 font-medium placeholder:text-gray-500"
            value={searchValue}
            onValueChange={setSearchValue}
          />
          
          <CommandList className="overflow-auto" style={{ maxHeight }}>
            <CommandEmpty className="py-8 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center gap-3">
                <Search className="w-12 h-12 text-gray-300" />
                <div>
                  <p className="font-medium">{emptyText}</p>
                  {searchValue && (
                    <p className="text-xs text-gray-400 mt-1">
                      No se encontraron resultados para "{searchValue}"
                    </p>
                  )}
                </div>
              </div>
            </CommandEmpty>
            
            {filteredAndGroupedOptions.map(({ category, options }) => (
              <CommandGroup key={category}>
                {showCategories && category && options.length > 0 && (
                  <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider bg-gray-50 sticky top-0 z-10">
                    {category}
                  </div>
                )}
                {options.map(renderOption)}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
