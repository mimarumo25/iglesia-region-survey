import React from 'react';
import EnhancedBirthDatePicker from './enhanced-birth-date-picker';

interface EnhancedDeathDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * Componente de selección de fecha de fallecimiento
 * Basado en EnhancedBirthDatePicker pero con textos específicos para fallecimiento
 */
const EnhancedDeathDatePicker: React.FC<EnhancedDeathDatePickerProps> = ({
  placeholder = "Seleccionar fecha de fallecimiento",
  ...props
}) => {
  return (
    <EnhancedBirthDatePicker
      {...props}
      placeholder={placeholder}
    />
  );
};

export default EnhancedDeathDatePicker;
