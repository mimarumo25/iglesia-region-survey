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

// Clases estandarizadas para todos los componentes del formulario con soporte para tema oscuro
const STANDARD_STYLES = {
  label: "text-foreground font-bold text-sm mb-2 block dark:text-foreground",
  input: "bg-input border-2 border-input-border text-foreground font-semibold shadow-inner rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 hover:bg-accent hover:border-input-border transition-all duration-200 h-12 dark:bg-input dark:border-input-border dark:text-foreground dark:focus:bg-accent dark:focus:border-primary",
  textarea: "bg-input border-2 border-input-border text-foreground font-semibold shadow-inner rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 hover:bg-accent hover:border-input-border min-h-24 resize-y transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground dark:focus:bg-accent dark:focus:border-primary",
  checkboxContainer: "flex items-center space-x-3 p-4 bg-muted border-2 border-border rounded-xl hover:bg-accent hover:border-border transition-all duration-200 dark:bg-muted dark:border-border dark:hover:bg-accent",
  checkbox: "h-5 w-5 accent-primary scale-110 rounded-md",
  checkboxLabel: "text-foreground font-semibold cursor-pointer select-none dark:text-foreground",
  fieldContainer: "space-y-2",
  multipleCheckboxGrid: "grid grid-cols-1 gap-3",
  loadingContainer: "flex items-center justify-center p-4 bg-muted rounded-xl dark:bg-muted",
  errorContainer: "flex items-center justify-center p-4 bg-destructive/10 border-2 border-destructive/20 rounded-xl dark:bg-destructive/10 dark:border-destructive/20"
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
      {field.label} {field.required && <span className="text-destructive">*</span>}
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
            onChange={(e) => onChange(field.id, trimString(e.target.value))}
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
            {field.label} {field.required && <span className="text-destructive">*</span>}
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
                  {option}
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
                  {option.label}
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
