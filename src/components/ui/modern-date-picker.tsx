import { useState, useEffect } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, ChevronDown, Calendar as CalendarViewIcon, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  title?: string;
  description?: string;
}

const ModernDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Seleccionar fecha",
  disabled = false,
  className = "",
  title = "Seleccionar fecha",
  description = "Elija una fecha"
}: ModernDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'calendar' | 'selectors'>('calendar');
  const [calendarMonth, setCalendarMonth] = useState<Date>(value || new Date());
  
  // Estados para los selectores individuales
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedDay, setSelectedDay] = useState<string>('');

  // Generar años desde 1900 hasta el año actual
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  
  // Meses en español
  const months = [
    { value: '0', label: 'Enero' },
    { value: '1', label: 'Febrero' },
    { value: '2', label: 'Marzo' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Mayo' },
    { value: '5', label: 'Junio' },
    { value: '6', label: 'Julio' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Septiembre' },
    { value: '9', label: 'Octubre' },
    { value: '10', label: 'Noviembre' },
    { value: '11', label: 'Diciembre' }
  ];

  // Generar días según el mes y año seleccionados
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const days = selectedYear && selectedMonth ? 
    Array.from({ length: getDaysInMonth(parseInt(selectedYear), parseInt(selectedMonth)) }, (_, i) => i + 1) : 
    Array.from({ length: 31 }, (_, i) => i + 1);

  // Actualizar selectores cuando cambia el valor externo
  useEffect(() => {
    if (value && value instanceof Date && !isNaN(value.getTime())) {
      setSelectedYear(value.getFullYear().toString());
      setSelectedMonth(value.getMonth().toString());
      setSelectedDay(value.getDate().toString());
      setCalendarMonth(value);
    } else {
      setSelectedYear('');
      setSelectedMonth('');
      setSelectedDay('');
    }
  }, [value]);

  // Crear fecha desde selectores
  const createDateFromSelectors = () => {
    if (selectedYear && selectedMonth && selectedDay) {
      const newDate = new Date(parseInt(selectedYear), parseInt(selectedMonth), parseInt(selectedDay));
      // Verificar que la fecha es válida
      if (newDate.getFullYear() == parseInt(selectedYear) && 
          newDate.getMonth() == parseInt(selectedMonth) && 
          newDate.getDate() == parseInt(selectedDay)) {
        return newDate;
      }
    }
    return null;
  };

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  const handleSelectorChange = () => {
    const newDate = createDateFromSelectors();
    if (newDate) {
      onChange(newDate);
    }
  };

  const handleYearChange = (year: string) => {
    setSelectedYear(year);
    // Si tenemos mes y día, crear la fecha inmediatamente
    setTimeout(() => {
      const newDate = createDateFromSelectors();
      if (newDate && selectedMonth && selectedDay) {
        onChange(newDate);
      }
    }, 0);
  };

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // Si el día actual es mayor que los días del nuevo mes, ajustarlo
    if (selectedDay && selectedYear) {
      const daysInNewMonth = getDaysInMonth(parseInt(selectedYear), parseInt(month));
      if (parseInt(selectedDay) > daysInNewMonth) {
        setSelectedDay(daysInNewMonth.toString());
      }
    }
    setTimeout(() => {
      const newDate = createDateFromSelectors();
      if (newDate && selectedYear && selectedDay) {
        onChange(newDate);
      }
    }, 0);
  };

  const handleDayChange = (day: string) => {
    setSelectedDay(day);
    setTimeout(() => {
      const newDate = createDateFromSelectors();
      if (newDate && selectedYear && selectedMonth) {
        onChange(newDate);
      }
    }, 0);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal bg-gray-100 border-2 border-gray-400 text-gray-900 rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200 min-h-[2.5rem] h-auto py-2 px-2 sm:px-3",
            !(value && value instanceof Date && !isNaN(value.getTime())) && "text-gray-500",
            className
          )}
        >
          <div className="flex items-center flex-1 min-w-0">
            <CalendarIcon className="mr-1.5 sm:mr-2 h-4 w-4 text-gray-600 flex-shrink-0" />
            <span className="flex-1 break-words leading-tight text-sm sm:text-base">
              {value && value instanceof Date && !isNaN(value.getTime()) ? format(value, "PPP", { locale: es }) : placeholder}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-600 opacity-50 flex-shrink-0 ml-1 sm:ml-2" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white border-2 border-gray-300 rounded-xl shadow-2xl" 
        align="start"
        sideOffset={4}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-t-xl border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold text-gray-800 text-sm">{title}</h4>
              <p className="text-xs text-gray-600">{description}</p>
            </div>
            <div className="flex gap-1">
              <Button
                variant={viewMode === 'calendar' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('calendar')}
                className="h-7 w-7 p-0"
              >
                <CalendarViewIcon className="h-3 w-3" />
              </Button>
              <Button
                variant={viewMode === 'selectors' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setViewMode('selectors')}
                className="h-7 w-7 p-0"
              >
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>

        <div className="p-3">
          {viewMode === 'calendar' ? (
            <div className="space-y-3">
              {/* Controles rápidos de navegación */}
              <div className="flex gap-2 items-center justify-center bg-gradient-to-r from-blue-50 to-purple-50 p-2 rounded-lg border border-blue-200">
                <div className="flex-1">
                  <Select 
                    value={calendarMonth.getFullYear().toString()} 
                    onValueChange={(year) => {
                      const newMonth = new Date(calendarMonth);
                      newMonth.setFullYear(parseInt(year));
                      setCalendarMonth(newMonth);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="max-h-[250px]">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-xs">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select 
                    value={calendarMonth.getMonth().toString()} 
                    onValueChange={(month) => {
                      const newMonth = new Date(calendarMonth);
                      newMonth.setMonth(parseInt(month));
                      setCalendarMonth(newMonth);
                    }}
                  >
                    <SelectTrigger className="h-8 text-xs font-medium">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value} className="text-xs">
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Calendario */}
              <Calendar
                mode="single"
                selected={value && value instanceof Date && !isNaN(value.getTime()) ? value : undefined}
                onSelect={handleDateSelect}
                month={calendarMonth}
                onMonthChange={setCalendarMonth}
                disabled={(date) =>
                  date > new Date() || date < new Date("1900-01-01")
                }
                initialFocus
                locale={es}
                className="rounded-lg"
                classNames={{
                  months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
                  month: "space-y-4",
                  caption: "flex justify-center pt-2 pb-2 relative items-center min-h-[40px]",
                  caption_label: "text-sm font-bold text-gray-800 mx-auto px-8",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-7 w-7 bg-white border border-gray-300 rounded-md opacity-80 hover:opacity-100 hover:bg-blue-50 transition-all duration-200 z-10",
                  nav_button_previous: "absolute left-2 top-1/2 transform -translate-y-1/2",
                  nav_button_next: "absolute right-2 top-1/2 transform -translate-y-1/2",
                  table: "w-full border-collapse space-y-1",
                  head_row: "flex w-full mb-2",
                  head_cell: "text-gray-600 rounded-md w-9 font-medium text-[0.8rem] text-center flex-1",
                  row: "flex w-full mt-1",
                  cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-blue-50 rounded-md transition-colors duration-200 cursor-pointer flex-1",
                  day: "h-8 w-8 p-0 font-normal hover:bg-blue-100 rounded-md transition-all duration-200 flex items-center justify-center w-full",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-md font-semibold",
                  day_today: "bg-orange-100 text-orange-800 font-bold border border-orange-300 rounded-md",
                  day_outside: "text-gray-400 opacity-50",
                  day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
                  day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
                  day_hidden: "invisible",
                }}
              />
            </div>
          ) : (
            <div className="space-y-4 min-w-[300px]">
              <div className="text-center text-sm font-medium text-gray-700 mb-3">
                Seleccionar Año, Mes y Día
              </div>
              
              <div className="grid grid-cols-3 gap-3">
                {/* Selector de Año */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Año</label>
                  <Select value={selectedYear} onValueChange={handleYearChange}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Año" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()} className="text-xs">
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de Mes */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Mes</label>
                  <Select value={selectedMonth} onValueChange={handleMonthChange}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Mes" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value} className="text-xs">
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Selector de Día */}
                <div className="space-y-2">
                  <label className="text-xs font-medium text-gray-600">Día</label>
                  <Select value={selectedDay} onValueChange={handleDayChange}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Día" />
                    </SelectTrigger>
                    <SelectContent className="max-h-[200px]">
                      {days.map((day) => (
                        <SelectItem key={day} value={day.toString()} className="text-xs">
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Mostrar fecha seleccionada */}
              {selectedYear && selectedMonth && selectedDay && (
                <div className="text-center p-2 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm font-medium text-blue-800">
                    {(() => {
                      const date = createDateFromSelectors();
                      return date ? `Fecha seleccionada: ${format(date, "PPP", { locale: es })}` : 'Fecha inválida';
                    })()}
                  </p>
                </div>
              )}

              {/* Ayuda visual */}
              <div className="text-center text-xs text-gray-500">
                💡 Use esta vista para fechas de nacimiento lejanas en el tiempo
              </div>
            </div>
          )}
        </div>
        
        <div className="bg-gray-50 p-3 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              const today = new Date();
              setSelectedYear(today.getFullYear().toString());
              setSelectedMonth(today.getMonth().toString());
              setSelectedDay(today.getDate().toString());
              handleDateSelect(today);
            }}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setSelectedYear('');
              setSelectedMonth('');
              setSelectedDay('');
              handleDateSelect(undefined);
            }}
            className="text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg text-xs"
          >
            Limpiar
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ModernDatePicker;
