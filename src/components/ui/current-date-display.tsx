import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CalendarIcon, Clock, Lock } from "lucide-react";
import { cn } from "@/lib/utils";

interface CurrentDateDisplayProps {
  value?: Date | null;
  placeholder?: string;
  className?: string;
  showTime?: boolean;
}

const CurrentDateDisplay = ({ 
  value, 
  placeholder = "Fecha de registro",
  className = "",
  showTime = true
}: CurrentDateDisplayProps) => {
  // Usar la fecha actual si no se proporciona un valor
  const displayDate = value || new Date();

  return (
    <div
      className={cn(
        "w-full flex items-center justify-between text-left font-normal bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-gray-700 rounded-xl px-3 py-2 min-h-[3rem] cursor-not-allowed select-none shadow-inner",
        className
      )}
      title="Fecha actual del sistema - No se puede modificar"
    >
      <div className="flex items-center flex-1 min-w-0">
        <CalendarIcon className="mr-2 sm:mr-3 h-4 w-4 text-blue-600 flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0 justify-center">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="text-xs sm:text-sm font-semibold text-gray-800">
              {format(displayDate, "PPP", { locale: es })}
            </span>
            {showTime && (
              <span className="text-[10px] sm:text-xs text-gray-600 bg-white px-1.5 py-0.5 rounded-md border hidden sm:flex items-center gap-1 whitespace-nowrap">
                <Clock className="w-3 h-3" />
                {format(displayDate, "HH:mm")}
              </span>
            )}
          </div>
          <span className="text-[10px] sm:text-xs text-blue-600 truncate font-medium hidden xs:block">
            {placeholder}
          </span>
        </div>
      </div>
      
      {/* Indicador visual de que está deshabilitado */}
      <div className="flex items-center gap-2 flex-shrink-0 ml-2">
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-blue-200 shadow-sm">
          <Lock className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600 font-semibold hidden sm:inline">Bloqueado</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentDateDisplay;
