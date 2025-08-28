import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar, ChevronLeft, ChevronRight, CalendarDays, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface EnhancedBirthDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

const EnhancedBirthDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Seleccionar fecha de nacimiento",
  disabled = false,
  className = "",
  title = "Fecha de Nacimiento",
  description = "Selecciona día, mes y año"
}: EnhancedBirthDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState(
    value ? value.getFullYear() : new Date().getFullYear()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    value ? value.getMonth() : new Date().getMonth()
  );

  // Generar años (desde 1900 hasta año actual)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => 1900 + i).reverse();

  // Generar meses en español
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onChange(date);
      setIsOpen(false);
    }
  };

  const handleClear = () => {
    onChange(null);
    setIsOpen(false);
  };

  const handleToday = () => {
    const today = new Date();
    onChange(today);
    setSelectedYear(today.getFullYear());
    setSelectedMonth(today.getMonth());
    setIsOpen(false);
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(parseInt(year));
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(parseInt(month));
  };

  // Fecha para mostrar en el DayPicker
  const displayMonth = new Date(selectedYear, selectedMonth);

  return (
    <div className={cn("w-full", className)}>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal h-12 px-4 border-2 rounded-xl",
              "bg-white hover:bg-gray-50 border-gray-300 hover:border-blue-400",
              "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
              "transition-all duration-200 ease-in-out",
              !value && "text-muted-foreground",
              disabled && "opacity-50 cursor-not-allowed"
            )}
            disabled={disabled}
          >
            <div className="flex items-center space-x-3 w-full">
              <Calendar className="h-5 w-5 text-blue-500" />
              <span className="flex-1 text-sm">
                {value ? format(value, "dd 'de' MMMM 'de' yyyy", { locale: es }) : placeholder}
              </span>
            </div>
          </Button>
        </PopoverTrigger>

        <PopoverContent className="w-auto p-0 bg-white rounded-2xl shadow-2xl border-2 border-gray-200 enhanced-date-picker-popover z-index-fix" align="start" style={{ zIndex: 99999 }}>
          {/* Header del calendario */}
          <div className="enhanced-date-picker-header bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-2xl border-b border-gray-200">
            <div className="flex items-center justify-center mb-3">
              <div>
                <h4 className="font-semibold text-gray-800 text-base flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  {title}
                </h4>
                <p className="text-xs text-gray-600">{description}</p>
              </div>
            </div>

            {/* Navegación rápida por año y mes */}
            <div className="quick-nav-selects flex gap-2 px-4 pb-4">
              <div className="flex-1">
                <select
                  value={selectedYear.toString()}
                  onChange={(e) => handleYearChange(e.target.value)}
                  className="h-9 w-full bg-white border border-gray-300 rounded-md text-xs px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {years.map((year) => (
                    <option key={year} value={year.toString()}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex-1">
                <select
                  value={selectedMonth.toString()}
                  onChange={(e) => handleMonthChange(e.target.value)}
                  className="h-9 w-full bg-white border border-gray-300 rounded-md text-xs px-2 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index.toString()}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Contenido principal */}
          <div className="p-4">
            <DayPicker
                mode="single"
                selected={value || undefined}
                onSelect={handleDateSelect}
                month={displayMonth}
                onMonthChange={(month) => {
                  setSelectedYear(month.getFullYear());
                  setSelectedMonth(month.getMonth());
                }}
                locale={es}
                showOutsideDays={true}
                fromYear={1900}
                toYear={currentYear}
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-2 pb-2 relative items-center gap-1 min-h-[40px]",
                  caption_label: "text-sm font-medium text-gray-800 mx-auto px-8",
                  nav: "space-x-1 flex items-center",
                  nav_button: cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium z-10",
                    "h-8 w-8 bg-transparent border border-gray-300 hover:bg-gray-100 hover:text-gray-900",
                    "disabled:pointer-events-none disabled:opacity-50"
                  ),
                  nav_button_previous: "absolute left-2 top-1/2 transform -translate-y-1/2",
                  nav_button_next: "absolute right-2 top-1/2 transform -translate-y-1/2",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full mb-2",
                  head_cell: "text-muted-foreground rounded-md w-9 font-normal text-xs text-center flex-1",
                  row: "flex w-full mt-1",
                  cell: cn(
                    "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 flex-1",
                    "h-9 w-9 rounded-lg hover:bg-blue-50"
                  ),
                  day: cn(
                    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-normal",
                    "h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-900 transition-colors cursor-pointer"
                  ),
                  day_range_end: "day-range-end",
                  day_selected: cn(
                    "bg-blue-500 text-white hover:bg-blue-600 hover:text-white",
                    "focus:bg-blue-500 focus:text-white font-semibold"
                  ),
                  day_today: "bg-orange-100 text-orange-800 font-semibold border border-orange-300",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-400 opacity-50 cursor-not-allowed",
                  day_hidden: "invisible",
                }}
                components={{
                  IconLeft: ({ ...props }) => <ChevronLeft className="h-4 w-4" />,
                  IconRight: ({ ...props }) => <ChevronRight className="h-4 w-4" />,
                }}
              />
          </div>

          {/* Footer con acciones */}
          <div className="date-picker-actions bg-gray-50 rounded-b-2xl border-t border-gray-200">
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleToday}
                className="text-xs h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex-no-shrink"
              >
                <Calendar className="h-3 w-3 mr-1" />
                Hoy
              </Button>
              {value && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  className="text-xs h-8 px-3 text-red-600 hover:text-red-700 hover:bg-red-50 flex-no-shrink"
                >
                  <X className="h-3 w-3 mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
            
            {value && (
              <div className="text-xs text-gray-600 bg-white px-2 py-1 rounded border">
                {format(value, "dd/MM/yyyy")}
              </div>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default EnhancedBirthDatePicker;
