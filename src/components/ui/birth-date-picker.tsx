import React from 'react';
import DatePicker from 'react-datepicker';
import { cn } from "@/lib/utils";
import "react-datepicker/dist/react-datepicker.css";
import "../../styles/datepicker.css";

interface BirthDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const BirthDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Seleccionar fecha de nacimiento",
  disabled = false,
  className = ""
}: BirthDatePickerProps) => {
  
  const handleDateChange = (date: Date | null) => {
    onChange(date || undefined);
  };

  return (
    <div className={cn("", className)}>
      <DatePicker
        selected={value}
        onChange={handleDateChange}
        placeholderText={placeholder}
        dateFormat="dd/MM/yyyy"
        showYearDropdown
        showMonthDropdown
        dropdownMode="select"
        yearDropdownItemNumber={100}
        maxDate={new Date()}
        disabled={disabled}
        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
      />
    </div>
  );
};

export default BirthDatePicker;
