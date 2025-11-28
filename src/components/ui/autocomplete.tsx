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
import ErrorBoundary from "@/components/ui/error-boundary"
import { trimString, trimSearchValue } from "@/utils/stringTrimHelpers"

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
  mobilePlaceholder?: string
}

export function Autocomplete({
  options = [], // Default to empty array to prevent undefined errors
  value,
  onValueChange,
  placeholder = "Seleccionar opción...",
  emptyText = "No se encontraron opciones.",
  searchPlaceholder = "Buscar...",
  disabled = false,
  className,
  loading = false,
  mobilePlaceholder,
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

  // Manejar el scroll de la rueda del mouse

  // Defensive programming: ensure options is always an array
  const safeOptions = React.useMemo(() => {
    if (!options || !Array.isArray(options)) {
      console.warn('Autocomplete: options prop should be an array, received:', typeof options, options);
      return [];
    }
    return options;
  }, [options]);

  const selectedOption = safeOptions.find((option) => option.value === value)

  // Función para limpiar la selección
  const clearSelection = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    onValueChange("")
    setSearchValue("")
  }

  // Filtrar opciones basado en la búsqueda
  const filteredOptions = React.useMemo(() => {
    if (!searchValue) return safeOptions
    const trimmedSearch = trimSearchValue(searchValue).toLowerCase()
    return safeOptions.filter(option => 
      option.label && option.label.toLowerCase().includes(trimmedSearch)
    )
  }, [safeOptions, searchValue])

  const orderedOptions = React.useMemo(() => {
    if (!filteredOptions.length) {
      return filteredOptions
    }

    const [emptyOptions, regularOptions] = filteredOptions.reduce<[AutocompleteOption[], AutocompleteOption[]]>(
      (acc, option) => {
        const isEmptyValue =
          option.value === undefined ||
          option.value === null ||
          (typeof option.value === "string" && option.value.trim() === "")
        const normalizedOption = option
        if (isEmptyValue) {
          acc[0].push(normalizedOption)
        } else {
          acc[1].push(normalizedOption)
        }
        return acc
      },
      [[], []]
    )

    return [...emptyOptions, ...regularOptions]
  }, [filteredOptions])

  return (
    <ErrorBoundary>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            ref={triggerRef}
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between min-h-[2.5rem] h-auto py-2 bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold shadow-inner rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200",
              !selectedOption && "text-gray-500",
              disabled && "opacity-50 cursor-not-allowed",
              className
            )}
            disabled={disabled || loading}
          >
            <div className="flex items-center gap-2 flex-1 min-w-0 overflow-hidden">
              <Search className="w-4 h-4 flex-shrink-0 text-gray-600" />
              <span className="text-left break-words text-xs sm:text-sm leading-tight overflow-hidden">
                {selectedOption ? selectedOption.label : (
                  mobilePlaceholder ? (
                    <>
                      <span className="sm:hidden">{mobilePlaceholder}</span>
                      <span className="hidden sm:inline">{placeholder}</span>
                    </>
                  ) : placeholder
                )}
              </span>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0 ml-2">
              {selectedOption && !disabled && (
                <div
                  role="button"
                  tabIndex={0}
                  onClick={clearSelection}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      clearSelection(e as any)
                    }
                  }}
                  className="p-1 rounded-md hover:bg-gray-300 transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-200"
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
          className="p-0 bg-white border-2 border-gray-300 rounded-xl shadow-lg" 
          align="start" 
          side="bottom"
          style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : 'var(--radix-popover-trigger-width)' }}
          sideOffset={4}
        >
          <Command className="rounded-xl border-0 shadow-lg">
            <CommandInput 
              placeholder={searchPlaceholder} 
              className="h-10 sm:h-12 border-0 focus:ring-0 bg-gray-50 text-gray-900 text-xs sm:text-sm font-medium placeholder:text-gray-500"
              value={searchValue}
              onValueChange={setSearchValue}
            />
            <CommandList 
              className="max-h-60 overflow-auto overscroll-contain touch-pan-y"
              style={{ WebkitOverflowScrolling: 'touch' }}
            >
              <CommandEmpty className="py-6 text-center text-xs sm:text-sm text-gray-500">
                <div className="flex flex-col items-center gap-2">
                  <Search className="w-6 h-6 sm:w-8 sm:h-8 text-gray-300" />
                  <span>{emptyText}</span>
                </div>
              </CommandEmpty>
              <CommandGroup>
                {orderedOptions.map((option) => (
                  <CommandItem
                    key={option.value}
                    value={option.label}
                    onSelect={() => {
                      const trimmedValue = trimString(option.value)
                      const newValue = value === trimmedValue ? "" : trimmedValue
                      onValueChange(newValue)
                      setOpen(false)
                      setSearchValue("")
                    }}
                    className="cursor-pointer hover:bg-blue-50 px-2 sm:px-3 py-2 sm:py-3 text-gray-800 rounded-lg transition-colors duration-150 mx-1 my-0.5 flex items-start gap-2 sm:gap-3"
                  >
                    <Check
                      className={cn(
                        "h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5",
                        value === option.value ? "opacity-100 text-blue-600" : "opacity-0"
                      )}
                    />
                    <span className="flex-1 text-xs sm:text-sm font-medium break-words leading-tight">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </ErrorBoundary>
  )
}
