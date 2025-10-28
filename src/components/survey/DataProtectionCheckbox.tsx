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
    <div className="space-y-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950 dark:to-indigo-950 border border-blue-200 dark:border-blue-800 rounded-lg">
      <div className="flex items-start space-x-3">
        <Checkbox
          id="autorizacion_datos"
          checked={checked}
          onCheckedChange={(value) => onCheckedChange(value as boolean)}
          className="mt-1"
          disabled={!hasAcceptedTerms}
        />
        <label
          htmlFor="autorizacion_datos"
          className={`text-sm font-medium leading-relaxed flex-1 ${
            hasAcceptedTerms ? "cursor-pointer" : "cursor-not-allowed opacity-60"
          }`}
        >
          Autorizo el tratamiento de mis datos personales para vincularme a la parroquia y recibir notificaciones de interés{" "}
          <span className="text-destructive">*</span>
        </label>
      </div>

      <div className="flex items-center gap-2 ml-7">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onOpenModal}
          className="gap-2 text-blue-600 border-blue-300 hover:bg-blue-50 dark:text-blue-400 dark:border-blue-600 dark:hover:bg-blue-900/30"
        >
          <FileText className="w-4 h-4" />
          Ver términos de protección de datos
        </Button>
      </div>

      {!hasAcceptedTerms && (
        <p className="text-xs text-amber-700 dark:text-amber-400 ml-7 font-medium">
          ⚠️ Debes leer y aceptar los términos de protección de datos antes de marcar esta casilla
        </p>
      )}

      {hasAcceptedTerms && (
        <p className="text-xs text-green-700 dark:text-green-400 ml-7 font-medium">
          ✅ Términos de protección aceptados
        </p>
      )}
    </div>
  );
};

export default DataProtectionCheckbox;
