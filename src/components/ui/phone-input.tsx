/**
 * Componente de Input Validado para Teléfono
 * 
 * Input especializado que valida números de teléfono colombianos en tiempo real
 * y proporciona feedback visual inmediato al usuario.
 */

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { isValidColombianPhone, formatColombianPhone, VALIDATION_MESSAGES } from "@/utils/validationHelpers";
import { CheckCircle, AlertCircle, Phone } from "lucide-react";

interface PhoneInputProps extends Omit<React.ComponentProps<typeof Input>, 'onChange'> {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  showValidation?: boolean;
  formatOnBlur?: boolean;
  required?: boolean;
}

export const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(({
  label = "Teléfono",
  value,
  onChange,
  showValidation = true,
  formatOnBlur = true,
  required = false,
  className,
  ...props
}, ref) => {
  const [touched, setTouched] = useState(false);
  const [focused, setFocused] = useState(false);
  
  // Estado de validación
  const isEmpty = !value || value.trim() === '';
  const isValid = isEmpty ? !required : isValidColombianPhone(value);
  const showError = touched && !focused && !isEmpty && !isValid;
  const showSuccess = touched && !focused && !isEmpty && isValid;
  
  // Determinar el estado visual
  const inputState = showError ? 'error' : showSuccess ? 'success' : 'default';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    
    // Permitir solo números, espacios, guiones y paréntesis
    const filtered = newValue.replace(/[^\d\s\-()]/g, '');
    
    onChange(filtered);
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched(true);
    setFocused(false);
    
    // Formatear el número si está habilitado y es válido
    if (formatOnBlur && value && isValidColombianPhone(value)) {
      const formatted = formatColombianPhone(value);
      if (formatted !== value) {
        onChange(formatted);
      }
    }
    
    // Llamar onBlur original si existe
    props.onBlur?.(e);
  };

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    setFocused(true);
    props.onFocus?.(e);
  };

  const getHelperText = () => {
    if (showError) {
      return VALIDATION_MESSAGES.phone.invalid;
    }
    if (showSuccess) {
      return "Número de teléfono válido";
    }
    if (focused || (!touched && isEmpty)) {
      return "Ejemplo: 300-123-4567 o 123-4567";
    }
    return "";
  };

  const getIcon = () => {
    if (showError) return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (showSuccess) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <Phone className="w-4 h-4 text-muted-foreground" />;
  };

  return (
    <div className="space-y-2">
      {label && (
        <Label htmlFor={props.id} className="text-sm font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      
      <div className="relative">
        <Input
          {...props}
          ref={ref}
          type="tel"
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          onFocus={handleFocus}
          className={cn(
            "pl-10 pr-10",
            {
              "border-red-500 focus:border-red-500 focus:ring-red-500": inputState === 'error',
              "border-green-500 focus:border-green-500 focus:ring-green-500": inputState === 'success',
            },
            className
          )}
          placeholder="300-123-4567"
        />
        
        {/* Ícono izquierdo */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
          <Phone className="w-4 h-4 text-muted-foreground" />
        </div>
        
        {/* Ícono derecho de validación */}
        {showValidation && touched && !focused && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {getIcon()}
          </div>
        )}
      </div>
      
      {/* Mensaje de ayuda/error */}
      {showValidation && getHelperText() && (
        <p className={cn(
          "text-xs",
          {
            "text-red-500": showError,
            "text-green-600": showSuccess,
            "text-muted-foreground": !showError && !showSuccess,
          }
        )}>
          {getHelperText()}
        </p>
      )}
    </div>
  );
});

PhoneInput.displayName = "PhoneInput";
