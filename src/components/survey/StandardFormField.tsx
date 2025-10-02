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
    <Label htmlFor={field.id} className={STANDARD_STYLES.label}>
      {field.label} {field.required && <span className="text-destructive">*</span>}
    </Label>
  );

  switch (field.type) {
    case 'text':
    case 'number':
      return (
        <div className={STANDARD_STYLES.fieldContainer}>
          {renderLabel()}
          <Input
            id={field.id}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={STANDARD_STYLES.input}
            required={field.required}
            placeholder={field.placeholder || `Ingrese ${field.label.toLowerCase()}`}
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
          <div className={STANDARD_STYLES.fieldContainer}>
            {renderLabel()}
            <CurrentDateDisplay
              value={dateValue}
              placeholder="Fecha de registro de la encuesta"
              className="w-full"
            />
          </div>
        );
      }
      
      // Para otros campos de fecha, usar el picker normal
      return (
        <div className={STANDARD_STYLES.fieldContainer}>
          {renderLabel()}
          <ModernDatePicker
            value={dateValue}
            onChange={(date) => onChange(field.id, date)}
            placeholder={field.placeholder || `Seleccionar ${field.label.toLowerCase()}`}
            className="w-full"
          />
        </div>
      );

    case 'autocomplete':
      return (
        <div className={STANDARD_STYLES.fieldContainer}>
          {renderLabel()}
          <AutocompleteWithLoading
            options={autocompleteOptions}
            value={value || ''}
            onValueChange={(val) => onChange(field.id, val)}
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
          />
        </div>
      );

    case 'boolean':
      return (
        <div className={STANDARD_STYLES.checkboxContainer}>
          <Checkbox
            id={field.id}
            checked={value === true}
            onCheckedChange={(checked) => onChange(field.id, checked)}
            className={STANDARD_STYLES.checkbox}
          />
          <Label htmlFor={field.id} className={STANDARD_STYLES.checkboxLabel}>
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
        </div>
      );

    case 'checkbox':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div className={STANDARD_STYLES.fieldContainer}>
          <Label className={STANDARD_STYLES.label}>
            {field.label} {field.required && <span className="text-destructive">*</span>}
          </Label>
          <div className={STANDARD_STYLES.multipleCheckboxGrid}>
            {field.options?.map((option: string) => (
              <div key={option} className={STANDARD_STYLES.checkboxContainer}>
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
                />
                <Label htmlFor={`${field.id}-${option}`} className={STANDARD_STYLES.checkboxLabel}>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'multiple-checkbox':
      const selectedAutoValues = Array.isArray(value) ? value : [];
      
      if (isLoading) {
        return (
          <div className={STANDARD_STYLES.fieldContainer}>
            {renderLabel()}
            <div className={STANDARD_STYLES.loadingContainer}>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              <span className="text-muted-foreground font-medium">Cargando opciones de {field.label.toLowerCase()}...</span>
            </div>
          </div>
        );
      }

      if (error) {
        return (
          <div className={STANDARD_STYLES.fieldContainer}>
            {renderLabel()}
            <ServiceErrorDisplay
              error={error}
              serviceName={field.label.toLowerCase()}
              inline={true}
              size="sm"
              className="p-3 bg-destructive/5 rounded-lg border border-destructive/20"
            />
          </div>
        );
      }

      return (
        <div className={STANDARD_STYLES.fieldContainer}>
          {renderLabel()}
          <div className={STANDARD_STYLES.multipleCheckboxGrid}>
            {autocompleteOptions?.map((option: AutocompleteOption) => (
              <div key={option.value} className={STANDARD_STYLES.checkboxContainer}>
                <Checkbox
                  id={`${field.id}-${option.value}`}
                  checked={selectedAutoValues.includes(option.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      onChange(field.id, [...selectedAutoValues, option.value]);
                    } else {
                      onChange(field.id, selectedAutoValues.filter((v: string) => v !== option.value));
                    }
                  }}
                  className={STANDARD_STYLES.checkbox}
                />
                <Label htmlFor={`${field.id}-${option.value}`} className={STANDARD_STYLES.checkboxLabel}>
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div className={STANDARD_STYLES.fieldContainer}>
          {renderLabel()}
          <Textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={STANDARD_STYLES.textarea}
            rows={4}
            placeholder={field.placeholder || `Escriba ${field.label.toLowerCase()}`}
          />
        </div>
      );

    default:
      return null;
  }
};

export default StandardFormField;
