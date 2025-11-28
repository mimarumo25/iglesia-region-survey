import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface DataProtectionCheckboxProps {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  onOpenModal: () => void;
  hasAcceptedTerms: boolean;
}

const DataProtectionCheckbox = ({
  checked,
  onCheckedChange,
  onOpenModal,
  hasAcceptedTerms,
}: DataProtectionCheckboxProps) => {
  return (
    <div className="space-y-3 sm:space-y-4 p-3 sm:p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border-2 border-blue-200 dark:border-blue-800 rounded-xl">
      {/* Contenedor principal del checkbox con área táctil mejorada */}
      <div 
        className={`flex items-center gap-3 sm:gap-4 p-3 sm:p-4 min-h-[56px] sm:min-h-[60px] rounded-xl border-2 transition-all duration-200 touch-manipulation ${
          hasAcceptedTerms 
            ? "bg-white dark:bg-slate-900 border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer active:scale-[0.99]" 
            : "bg-slate-100 dark:bg-slate-800 border-slate-300 dark:border-slate-600 cursor-not-allowed opacity-70"
        }`}
        onClick={() => hasAcceptedTerms && onCheckedChange(!checked)}
      >
        <Checkbox
          id="autorizacion_datos"
          checked={checked}
          onCheckedChange={(value) => hasAcceptedTerms && onCheckedChange(value as boolean)}
          className="h-5 w-5 sm:h-6 sm:w-6 shrink-0"
          disabled={!hasAcceptedTerms}
        />
        <label
          htmlFor="autorizacion_datos"
          className={`text-sm sm:text-base font-semibold leading-snug flex-1 ${
            hasAcceptedTerms ? "cursor-pointer text-foreground" : "cursor-not-allowed text-muted-foreground"
          }`}
        >
          Autorizo el tratamiento de mis datos personales para vincularme a la parroquia y recibir notificaciones de interés{" "}
          <span className="text-destructive">*</span>
        </label>
      </div>

      {/* Botón para ver términos - más grande en móvil */}
      <div className="flex items-center justify-center sm:justify-start">
        <Button
          type="button"
          variant="outline"
          size="default"
          onClick={onOpenModal}
          className="gap-2 w-full sm:w-auto h-11 sm:h-10 text-sm font-semibold text-blue-600 border-2 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30 rounded-xl touch-manipulation"
        >
          <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
          Ver términos de protección de datos
        </Button>
      </div>

      {/* Mensajes de estado con mejor visibilidad en móvil */}
      {!hasAcceptedTerms && (
        <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
          <span className="text-lg leading-none">⚠️</span>
          <p className="text-xs sm:text-sm text-amber-800 dark:text-amber-300 font-medium leading-snug">
            Debes leer y aceptar los términos de protección de datos antes de marcar esta casilla
          </p>
        </div>
      )}

      {hasAcceptedTerms && (
        <div className="flex items-start gap-2 p-2.5 sm:p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg">
          <span className="text-lg leading-none">✅</span>
          <p className="text-xs sm:text-sm text-green-800 dark:text-green-300 font-medium leading-snug">
            Términos de protección aceptados
          </p>
        </div>
      )}
    </div>
  );
};

export default DataProtectionCheckbox;
