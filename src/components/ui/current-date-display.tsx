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
        "w-full flex items-center justify-between text-left font-normal bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 text-gray-700 rounded-xl px-4 py-3 h-12 cursor-not-allowed select-none shadow-inner",
        className
      )}
      title="Fecha actual del sistema - No se puede modificar"
    >
      <div className="flex items-center flex-1 min-w-0">
        <CalendarIcon className="mr-3 h-4 w-4 text-blue-600 flex-shrink-0" />
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-gray-800 truncate">
              {format(displayDate, "PPP", { locale: es })}
            </span>
            {showTime && (
              <span className="text-xs text-gray-600 bg-white px-2 py-1 rounded-md border flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {format(displayDate, "HH:mm")}
              </span>
            )}
          </div>
          <span className="text-xs text-blue-600 truncate font-medium">
            {placeholder}
          </span>
        </div>
      </div>
      
      {/* Indicador visual de que está deshabilitado */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="flex items-center gap-1 bg-white px-2 py-1 rounded-md border border-blue-200 shadow-sm">
          <Lock className="w-3 h-3 text-blue-500" />
          <span className="text-xs text-blue-600 font-semibold">Bloqueado</span>
        </div>
      </div>
    </div>
  );
};

export default CurrentDateDisplay;
