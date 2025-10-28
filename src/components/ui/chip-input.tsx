import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChipInputProps {
  value?: string[]
  onChange?: (chips: string[]) => void
  placeholder?: string
  className?: string
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void
  disabled?: boolean
}

/**
 * Componente ChipInput - Permite crear chips de texto escribiendo y presionando Enter
 * 
 * @example
 * const [chips, setChips] = useState<string[]>([])
 * <ChipInput 
 *   value={chips}
 *   onChange={setChips}
 *   placeholder="Escribe y presiona Enter para agregar..."
 * />
 */
export const ChipInput = ({
  value = [],
  onChange,
  placeholder = 'Escribe y presiona Enter...',
  className,
  onKeyDown: externalOnKeyDown,
  disabled = false,
}: ChipInputProps) => {
  const [inputValue, setInputValue] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // Asegurar que value siempre sea un array válido
  const normalizedValue = Array.isArray(value) ? value : []

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Ejecutar handler externo primero si existe
    if (externalOnKeyDown) {
      externalOnKeyDown(e)
    }

    // Si el evento fue prevenido, no continuar
    if (e.defaultPrevented) return

    if (e.key === 'Enter') {
      e.preventDefault()
      
      const trimmedValue = inputValue.trim()
      
      // Validar que no esté vacío y no sea duplicado
      if (trimmedValue && !normalizedValue.includes(trimmedValue)) {
        onChange?.([...normalizedValue, trimmedValue])
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && inputValue === '' && normalizedValue.length > 0) {
      // Eliminar el último chip al presionar Backspace con input vacío
      e.preventDefault()
      onChange?.(normalizedValue.slice(0, -1))
    }
  }

  const removeChip = (index: number) => {
    onChange?.(normalizedValue.filter((_, i) => i !== index))
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  return (
    <div className="w-full space-y-2">
      {/* Input y Chips Container */}
      <div className={cn(
        'w-full flex flex-wrap gap-2 p-3 rounded-lg border-2 border-input-border bg-input focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:focus-within:border-primary',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}>
        {/* Chips */}
        {normalizedValue.map((chip, index) => (
          <div
            key={index}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/30 dark:border-primary/40 text-sm font-medium text-foreground dark:text-foreground"
          >
            <span className="truncate max-w-xs">{chip}</span>
            <button
              type="button"
              onClick={() => removeChip(index)}
              disabled={disabled}
              className="inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-primary/20 dark:hover:bg-primary/30 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Eliminar ${chip}`}
            >
              <X className="w-3 h-3" />
            </button>
          </div>
        ))}

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder={normalizedValue.length === 0 ? placeholder : ''}
          disabled={disabled}
          className={cn(
            'flex-1 min-w-[150px] bg-transparent outline-none text-foreground dark:text-foreground placeholder-muted-foreground dark:placeholder-muted-foreground',
            disabled && 'cursor-not-allowed'
          )}
        />
      </div>

      {/* Legend / Leyenda de Funcionamiento */}
      <div className="text-xs text-muted-foreground dark:text-muted-foreground space-y-1">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded border border-border bg-muted font-semibold text-foreground">↵ Enter</kbd>
          <span>Presiona para agregar un chip</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded border border-border bg-muted font-semibold text-foreground">✕</kbd>
          <span>Haz clic para eliminar un chip</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 rounded border border-border bg-muted font-semibold text-foreground">⌫ Backspace</kbd>
          <span>Presiona en campo vacío para eliminar el último chip</span>
        </div>
      </div>
    </div>
  )
}
