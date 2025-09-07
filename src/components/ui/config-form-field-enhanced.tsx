/**
 * Componente ConfigFormField mejorado con validación especializada
 * 
 * Extiende el ConfigFormField original para soportar validación en tiempo real
 * para campos de teléfono y email con el contexto colombiano.
 */

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { PhoneInput } from '@/components/ui/phone-input';
import { EmailInput } from '@/components/ui/email-input';

export interface ConfigFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'textarea' | 'autocomplete' | 'phone' | 'email';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  // Props específicas para autocomplete
  options?: AutocompleteOption[];
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  disabled?: boolean;
  // Props específicas para validación
  showValidation?: boolean;
  formatOnBlur?: boolean;
}

export const ConfigFormFieldWithValidation: React.FC<ConfigFormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  rows = 3,
  options = [],
  searchPlaceholder,
  emptyText,
  loading = false,
  disabled = false,
  showValidation = true,
  formatOnBlur = true,
}) => {
  const renderField = () => {
    switch (type) {
      case 'textarea':
        return (
          <Textarea
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className="border-input-border focus:ring-primary focus:border-primary transition-smooth"
            style={{ borderRadius: '12px' }}
            rows={rows}
          />
        );

      case 'autocomplete':
        return (
          <Autocomplete
            options={options}
            value={value}
            onValueChange={onChange}
            placeholder={placeholder}
            searchPlaceholder={searchPlaceholder}
            emptyText={emptyText}
            loading={loading}
            disabled={disabled}
            className="w-full"
          />
        );

      case 'phone':
        return (
          <PhoneInput
            id={id}
            label="" // El label ya se renderiza arriba
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            showValidation={showValidation}
            formatOnBlur={formatOnBlur}
            required={required}
            disabled={disabled}
            className="border-input-border focus:ring-primary focus:border-primary transition-smooth h-12"
            style={{ borderRadius: '12px' }}
          />
        );

      case 'email':
        return (
          <EmailInput
            id={id}
            label="" // El label ya se renderiza arriba
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            showValidation={showValidation}
            required={required}
            disabled={disabled}
            className="border-input-border focus:ring-primary focus:border-primary transition-smooth h-12"
            style={{ borderRadius: '12px' }}
          />
        );

      default:
        return (
          <Input
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            required={required}
            disabled={disabled}
            className="border-input-border focus:ring-primary focus:border-primary transition-smooth h-12"
            style={{ borderRadius: '12px' }}
          />
        );
    }
  };

  return (
    <div className="space-y-3">
      {/* Solo renderizar el label si no es phone o email (ya lo manejan internamente) */}
      {type !== 'phone' && type !== 'email' && (
        <Label htmlFor={id} className="text-foreground font-medium">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      {renderField()}
    </div>
  );
};
