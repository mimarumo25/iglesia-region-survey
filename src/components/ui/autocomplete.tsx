import * as React from "react"
import { Check, ChevronsUpDown, Search } from "lucide-react"
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
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const [triggerWidth, setTriggerWidth] = React.useState<number>(0)

  React.useEffect(() => {
    if (triggerRef.current) {
      setTriggerWidth(triggerRef.current.offsetWidth)
    }
  }, [open])

  const selectedOption = options.find((option) => option.value === value)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={triggerRef}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between h-12 rounded-xl border-input-border focus:ring-primary",
            !selectedOption && "text-muted-foreground",
            className
          )}
          disabled={disabled || loading}
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4" />
            {selectedOption ? selectedOption.label : placeholder}
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="p-0" 
        align="start" 
        side="bottom"
        style={{ width: triggerWidth > 0 ? `${triggerWidth}px` : 'var(--radix-popover-trigger-width)' }}
        sideOffset={4}
      >
        <Command className="rounded-xl">
          <CommandInput 
            placeholder={searchPlaceholder} 
            className="h-12 border-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty className="py-6 text-center text-sm text-muted-foreground">
              {emptyText}
            </CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option.value}
                  value={option.label} // Usar label para la búsqueda en lugar del value
                  onSelect={(currentValue) => {
                    // Encontrar la opción por label y devolver su value
                    const selectedOption = options.find(opt => opt.label.toLowerCase() === currentValue.toLowerCase())
                    const valueToSet = selectedOption ? selectedOption.value : ""
                    onValueChange(valueToSet === value ? "" : valueToSet)
                    setOpen(false)
                  }}
                  className="cursor-pointer hover:bg-primary/5"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === option.value ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {option.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
