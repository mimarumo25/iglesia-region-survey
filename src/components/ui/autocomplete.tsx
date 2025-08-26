import * as React from "react"
import { Check, ChevronsUpDown, Search, X } from "lucide-react"
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

export interface AutocompleteOption {
  value: string
  label: string
  description?: string
  category?: string
  popular?: boolean
  disabled?: boolean
}

interface AutocompleteProps {
  options: AutocompleteOption[]
  value?: string
  onValueChange: (value: string) => void
  placeholder?: string
  emptyText?: string
  searchPlaceholder?: string
  disabled?: boolean
  className?: string
  loading?: boolean
}

export function Autocomplete({
  options,
  value,
  onValueChange,
  placeholder = "Seleccionar opción...",
  emptyText = "No se encontraron opciones.",
  searchPlaceholder = "Buscar...",
  disabled = false,
  className,
  loading = false,
}: AutocompleteProps) {
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

  // Filtrar opciones basado en la búsqueda
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return options
    return options.filter(option => 
      option.label.toLowerCase().includes(searchValue.toLowerCase())
    )
  }, [options, searchValue])

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
            <span className="truncate text-left">
              {selectedOption ? selectedOption.label : placeholder}
            </span>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {selectedOption && !disabled && (
              <button
                type="button"
                onClick={clearSelection}
                className="p-1 rounded-md hover:bg-gray-300 transition-colors duration-150"
                aria-label="Limpiar selección"
              >
                <X className="w-3 h-3 text-gray-600" />
              </button>
            )}
            <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0 bg-white border-2 border-gray-300 rounded-xl shadow-lg" 
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
          <CommandList className="max-h-60 overflow-auto">
            <CommandEmpty className="py-6 text-center text-sm text-gray-500">
              <div className="flex flex-col items-center gap-2">
                <Search className="w-8 h-8 text-gray-300" />
                <span>{emptyText}</span>
              </div>
            </CommandEmpty>
            <CommandGroup>
              {filteredOptions.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label}
                  onSelect={() => {
                    const newValue = value === option.value ? "" : option.value
                    onValueChange(newValue)
                    setOpen(false)
                    setSearchValue("")
                  }}
                  className="cursor-pointer hover:bg-blue-50 px-3 py-3 text-gray-800 rounded-lg transition-colors duration-150 mx-1 my-0.5 flex items-center gap-3"
                >
                  <Check
                    className={cn(
                      "h-4 w-4 flex-shrink-0",
                      value === option.value ? "opacity-100 text-blue-600" : "opacity-0"
                    )}
                  />
                  <span className="flex-1 text-sm font-medium truncate">{option.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
