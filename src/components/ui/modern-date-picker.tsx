import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModernDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

const ModernDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Seleccionar fecha",
  disabled = false,
  className = ""
}: ModernDatePickerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleDateSelect = (date: Date | undefined) => {
    onChange(date);
    setIsOpen(false);
  };

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          disabled={disabled}
          className={cn(
            "w-full justify-between text-left font-normal bg-gray-100 border-2 border-gray-400 text-gray-900 rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200 h-11",
            !value && "text-gray-500",
            className
          )}
        >
          <div className="flex items-center">
            <CalendarIcon className="mr-3 h-4 w-4 text-gray-600" />
            <span className="flex-1">
              {value ? format(value, "PPP", { locale: es }) : placeholder}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-600 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-auto p-0 bg-white border-2 border-gray-300 rounded-xl shadow-2xl" 
        align="start"
        sideOffset={4}
      >
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-t-xl border-b border-gray-200">
          <h4 className="font-semibold text-gray-800 text-sm">Seleccionar fecha</h4>
          <p className="text-xs text-gray-600">Elija una fecha del calendario</p>
        </div>
        <div className="p-3">
          <Calendar
            mode="single"
            selected={value || undefined}
            onSelect={handleDateSelect}
            disabled={(date) =>
              date > new Date() || date < new Date("1900-01-01")
            }
            initialFocus
            locale={es}
            defaultMonth={value || new Date()}
            className="rounded-lg"
            classNames={{
              months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-bold text-gray-800",
              nav: "space-x-1 flex items-center",
              nav_button: "h-7 w-7 bg-white border border-gray-300 rounded-md opacity-80 hover:opacity-100 hover:bg-blue-50 transition-all duration-200",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex",
              head_cell: "text-gray-600 rounded-md w-9 font-medium text-[0.8rem]",
              row: "flex w-full mt-2",
              cell: "h-9 w-9 text-center text-sm p-0 relative hover:bg-blue-50 rounded-md transition-colors duration-200 cursor-pointer",
              day: "h-8 w-8 p-0 font-normal hover:bg-blue-100 rounded-md transition-all duration-200 flex items-center justify-center",
              day_selected: "bg-blue-600 text-white hover:bg-blue-700 rounded-md shadow-md font-semibold",
              day_today: "bg-orange-100 text-orange-800 font-bold border border-orange-300 rounded-md",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-300 opacity-30 cursor-not-allowed",
              day_range_middle: "aria-selected:bg-accent aria-selected:text-accent-foreground",
              day_hidden: "invisible",
            }}
          />
        </div>
        <div className="bg-gray-50 p-3 rounded-b-xl border-t border-gray-200 flex justify-between items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateSelect(new Date())}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg text-xs"
          >
            Hoy
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDateSelect(undefined)}
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
