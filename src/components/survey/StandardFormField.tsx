import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { AutocompleteWithLoading } from "@/components/ui/autocomplete-with-loading";
import { AutocompleteOption } from "@/components/ui/autocomplete";
import ModernDatePicker from "@/components/ui/modern-date-picker";
import CurrentDateDisplay from "@/components/ui/current-date-display";
import ServiceErrorDisplay from "@/components/ui/service-error-display";
import { FormField as FormFieldType } from "@/types/survey";
import { Loader2 } from "lucide-react";
import { trimString, trimValue } from "@/utils/stringTrimHelpers";

interface StandardFormFieldProps {
  field: FormFieldType;
  value: any;
  onChange: (fieldId: string, value: any) => void;
  autocompleteOptions?: AutocompleteOption[];
  isLoading?: boolean;
  error?: any;
}

// Componente para manejar textos largos con "Ver más"
const ExpandableLabel = ({ text, limit = 80 }: { text: string, limit?: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (!text || text.length <= limit) return <span>{text}</span>;
  
  return (
    <span>
      {isExpanded ? text : `${text.substring(0, limit)}...`}
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setIsExpanded(!isExpanded);
        }}
        className="ml-1 text-primary font-bold hover:underline text-xs inline-block"
      >
        {isExpanded ? "Ver menos" : "Ver más"}
      </button>
    </span>
  );
};

// Clases estandarizadas para todos los componentes del formulario con soporte para tema oscuro
const STANDARD_STYLES = {
  label: "text-foreground font-bold text-xs sm:text-sm mb-1 sm:mb-1.5 block dark:text-foreground leading-tight",
  input: "bg-input border-2 border-input-border text-foreground text-sm font-semibold shadow-inner rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 hover:bg-accent hover:border-input-border transition-all duration-200 h-9 sm:h-10 leading-tight dark:bg-input dark:border-input-border dark:text-foreground dark:focus:bg-accent dark:focus:border-primary",
  textarea: "bg-input border-2 border-input-border text-foreground text-sm font-semibold shadow-inner rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 hover:bg-accent hover:border-input-border min-h-20 resize-y transition-all duration-200 leading-tight dark:bg-input dark:border-input-border dark:text-foreground dark:focus:bg-accent dark:focus:border-primary",
  // Contenedor de checkbox mejorado para móvil: área táctil más grande (min-height 48px), mejor espaciado
  checkboxContainer: "flex items-center gap-3 sm:gap-4 p-3 sm:p-4 min-h-[52px] sm:min-h-[56px] bg-muted border-2 border-border rounded-xl hover:bg-accent hover:border-primary/30 active:bg-accent active:scale-[0.99] transition-all duration-200 dark:bg-muted dark:border-border dark:hover:bg-accent cursor-pointer touch-manipulation",
  // Checkbox más grande para móvil con mejor área de toque
  checkbox: "h-5 w-5 sm:h-5 sm:w-5 accent-primary rounded-md shrink-0",
  // Label de checkbox con tamaño legible en móvil
  checkboxLabel: "text-foreground text-sm sm:text-sm font-semibold cursor-pointer select-none leading-snug flex-1 dark:text-foreground",
  fieldContainer: "space-y-1 sm:space-y-1.5",
  // Grid de múltiples checkboxes con mejor espaciado en móvil
  multipleCheckboxGrid: "grid grid-cols-1 gap-2 sm:gap-3",
  loadingContainer: "flex items-center justify-center p-2 sm:p-4 bg-muted rounded-xl dark:bg-muted",
  errorContainer: "flex items-center justify-center p-2 sm:p-4 bg-destructive/10 border-2 border-destructive/20 rounded-xl dark:bg-destructive/10 dark:border-destructive/20"
} as const;

const StandardFormField = ({ 
  field, 
  value, 
  onChange, 
  autocompleteOptions = [], 
  isLoading = false, 
  error = null 
}: StandardFormFieldProps) => {
  
  const renderLabel = () => (
    <Label 
      htmlFor={field.id} 
      className={STANDARD_STYLES.label}
      data-testid={`label-${field.id}`}
    >
      <ExpandableLabel text={field.label} /> {field.required && <span className="text-destructive">*</span>}
    </Label>
  );

  switch (field.type) {
    case 'text':
    case 'number':
      return (
        <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
          {renderLabel()}
          <Input
            id={field.id}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            onBlur={(e) => onChange(field.id, trimString(e.target.value))}
            className={STANDARD_STYLES.input}
            required={field.required}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
            data-testid={`input-${field.id}`}
            name={field.id}
          />
        </div>
      );

    case 'date':
      const dateValue = value instanceof Date ? value : 
                       (typeof value === 'string' && value ? new Date(value) : 
                       field.id === 'fecha' ? new Date() : null);
      
      // Si es el campo 'fecha' principal, mostrar fecha actual deshabilitada
      if (field.id === 'fecha') {
        return (
          <div className={STANDARD_STYLES.fieldContainer} data-testid="field-group-fecha">
            {renderLabel()}
            <CurrentDateDisplay
              value={dateValue}
              placeholder="Fecha de registro de la encuesta"
              className="w-full"
              data-testid="date-display-fecha"
            />
          </div>
        );
      }
      
      // Para otros campos de fecha, usar el picker normal
      return (
        <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
          {renderLabel()}
          <ModernDatePicker
            value={dateValue}
            onChange={(date) => onChange(field.id, date)}
            placeholder={field.placeholder || `Seleccionar ${field.label.toLowerCase()}`}
            className="w-full"
            data-testid={`date-picker-${field.id}`}
          />
        </div>
      );

    case 'autocomplete':
      return (
        <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
          {renderLabel()}
          <AutocompleteWithLoading
            options={autocompleteOptions}
            value={value || ''}
            onValueChange={(val) => onChange(field.id, trimString(val))}
            placeholder={field.placeholder || `Seleccionar ${field.label.toLowerCase()}...`}
            mobilePlaceholder="Seleccionar..."
            emptyText={field.emptyText || `No hay ${field.label.toLowerCase()} disponibles`}
            searchPlaceholder={field.searchPlaceholder || `Buscar ${field.label.toLowerCase()}...`}
            isLoading={isLoading}
            error={error}
            errorText={field.errorText || `Error al cargar ${field.label.toLowerCase()}`}
            enhanced={true}
            showDescriptions={true}
            showCategories={false}
            allowClear={true}
            data-testid={`autocomplete-${field.id}`}
          />
        </div>
      );

    case 'boolean':
      return (
        <div className={STANDARD_STYLES.checkboxContainer} data-testid={`field-group-${field.id}`}>
          <Checkbox
            id={field.id}
            checked={value === true}
            onCheckedChange={(checked) => onChange(field.id, checked)}
            className={STANDARD_STYLES.checkbox}
            data-testid={`checkbox-${field.id}`}
          />
          <Label 
            htmlFor={field.id} 
            className={STANDARD_STYLES.checkboxLabel}
            data-testid={`label-${field.id}`}
          >
            <ExpandableLabel text={field.label} limit={120} /> {field.required && <span className="text-destructive">*</span>}
          </Label>
        </div>
      );

    case 'checkbox':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
          <Label className={STANDARD_STYLES.label} data-testid={`label-${field.id}`}>
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <div className={STANDARD_STYLES.multipleCheckboxGrid}>
            {field.options?.map((option: string) => (
              <div key={option} className={STANDARD_STYLES.checkboxContainer} data-testid={`checkbox-option-${field.id}-${option.toLowerCase().replace(/\s+/g, '-')}`}>
                <Checkbox
                  id={`${field.id}-${option}`}
                  checked={selectedValues.includes(option)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange(field.id, [...selectedValues, option]);
                    } else {
                      onChange(field.id, selectedValues.filter((v: string) => v !== option));
                    }
                  }}
                  className={STANDARD_STYLES.checkbox}
                  data-testid={`checkbox-${field.id}-${option.toLowerCase().replace(/\s+/g, '-')}`}
                />
                <Label 
                  htmlFor={`${field.id}-${option}`} 
                  className={STANDARD_STYLES.checkboxLabel}
                  data-testid={`label-${field.id}-${option.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <ExpandableLabel text={option} />
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'multiple-checkbox':
      /**
       * NUEVA ESTRUCTURA DINÁMICA:
       * - El value es un array de IDs seleccionados (ej: ['1', '3', '5'])
       * - Al cambiar, pasamos el nuevo array de IDs seleccionados
       * - El componente padre (SurveyForm) se encarga de convertir a DynamicSelectionMap
       */
      const selectedAutoValues = Array.isArray(value) ? value : [];
      
      // 🔍 DEBUG: Log para monitorear valores de multiple-checkbox
      if (field.id === 'disposicion_basura') {
        console.log(`🗑️ [${field.id}]`, {
          value: value,
          selectedValues: selectedAutoValues,
          availableOptions: autocompleteOptions?.length,
          firstOption: autocompleteOptions?.[0],
          matchingOptions: autocompleteOptions?.filter(opt => selectedAutoValues.includes(opt.value))
        });
      }
      
      if (isLoading) {
        return (
          <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
            {renderLabel()}
            <div className={STANDARD_STYLES.loadingContainer} data-testid={`loading-${field.id}`}>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-muted-foreground font-medium">Cargando opciones de {field.label.toLowerCase()}...</span>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
            {renderLabel()}
            <ServiceErrorDisplay
              error={error}
              serviceName={field.label.toLowerCase()}
              inline={true}
              size="sm"
              className="p-3 bg-destructive/5 rounded-lg border border-destructive/20"
              data-testid={`error-${field.id}`}
            />
          </div>
        );
      }

      return (
        <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
          {renderLabel()}
          <div className={STANDARD_STYLES.multipleCheckboxGrid}>
            {autocompleteOptions?.map((option: AutocompleteOption) => (
              <div 
                key={option.value} 
                className={STANDARD_STYLES.checkboxContainer}
                data-testid={`checkbox-option-${field.id}-${option.value}`}
              >
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={selectedAutoValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    // Trabajar con array de IDs seleccionados
                    if (checked) {
                      // Agregar ID seleccionado
                      onChange(field.id, [...selectedAutoValues, option.value]);
                    } else {
                      // Remover ID deseleccionado
                      onChange(field.id, selectedAutoValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  className={STANDARD_STYLES.checkbox}
                  data-testid={`checkbox-${field.id}-${option.value}`}
                />
                <Label 
                  htmlFor={`${field.id}-${option.value}`} 
                  className={STANDARD_STYLES.checkboxLabel}
                  data-testid={`label-${field.id}-${option.value}`}
                >
                  <ExpandableLabel text={option.label} />
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div className={STANDARD_STYLES.fieldContainer} data-testid={`field-group-${field.id}`}>
          {renderLabel()}
          <Textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => {
              // Para textarea: NO aplicar trim, preservar espacios y saltos de línea
              // Solo pasar el valor tal como está
              onChange(field.id, e.target.value);
            }}
            className={STANDARD_STYLES.textarea}
            rows={4}
            placeholder={field.placeholder || `Escriba ${field.label.toLowerCase()}`}
            data-testid={`textarea-${field.id}`}
            name={field.id}
          />
        </div>
      );

    default:
      return null;
  }
};

export default StandardFormField;
