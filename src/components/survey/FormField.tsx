import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import ModernDatePicker from "@/components/ui/modern-date-picker";

interface FormFieldProps {
  field: any;
  value: any;
  onChange: (fieldId: string, value: any) => void;
}

const FormField = ({ field, value, onChange }: FormFieldProps) => {
  // Clases de alto contraste con bordes redondeados usando Tailwind CSS
  const highContrastClasses = {
    label: "text-gray-800 font-bold text-sm mb-2 block",
    input: "bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold shadow-inner rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200",
    selectTrigger: "bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold shadow-inner rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200",
    textarea: "bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold shadow-inner rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 min-h-24 resize-y transition-all duration-200",
    checkboxContainer: "flex items-center space-x-3 p-4 bg-gray-100 border-2 border-gray-300 rounded-xl hover:bg-gray-200 hover:border-gray-400 transition-all duration-200",
    checkbox: "h-5 w-5 accent-blue-600 scale-110 rounded-md",
    checkboxLabel: "text-gray-800 font-semibold cursor-pointer select-none"
  };

  switch (field.type) {
    case 'text':
    case 'number':
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={highContrastClasses.label}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Input
            id={field.id}
            type={field.type}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={highContrastClasses.input}
            required={field.required}
            placeholder={`Ingrese ${field.label.toLowerCase()}`}
          />
        </div>
      );

    case 'date':
      // Manejar conversión de string a Date para compatibility con formData legacy
      const dateValue = value instanceof Date ? value : 
                       (typeof value === 'string' && value ? new Date(value) : 
                       field.id === 'fecha' ? new Date() : null); // Default fecha principal a hoy
      
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={highContrastClasses.label}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <ModernDatePicker
            value={dateValue}
            onChange={(date) => onChange(field.id, date)}
            placeholder={`Seleccionar ${field.label.toLowerCase()}`}
            className="w-full"
          />
        </div>
      );

    case 'select':
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={highContrastClasses.label}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Select onValueChange={(val) => onChange(field.id, val)} value={value || ''}>
            <SelectTrigger id={field.id} className={highContrastClasses.selectTrigger}>
              <SelectValue placeholder={`Seleccionar ${field.label.toLowerCase()}...`} />
            </SelectTrigger>
            <SelectContent className="bg-white border-2 border-gray-300 rounded-xl shadow-lg">
              {field.options?.map((option: string) => (
                <SelectItem key={option} value={option} className="hover:bg-blue-50 px-3 py-2 text-gray-800 rounded-lg">
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      );

    case 'boolean':
      return (
        <div key={field.id} className={highContrastClasses.checkboxContainer}>
          <Checkbox
            id={field.id}
            checked={value === true}
            onCheckedChange={(checked) => onChange(field.id, checked)}
            className={highContrastClasses.checkbox}
          />
          <Label htmlFor={field.id} className={highContrastClasses.checkboxLabel}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
        </div>
      );

    case 'checkbox':
      const selectedValues = Array.isArray(value) ? value : [];
      return (
        <div key={field.id} className="space-y-3">
          <Label className={highContrastClasses.label}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <div className="grid grid-cols-1 gap-3">
            {field.options?.map((option: string) => (
              <div key={option} className={highContrastClasses.checkboxContainer}>
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
                  className={highContrastClasses.checkbox}
                />
                <Label htmlFor={`${field.id}-${option}`} className={highContrastClasses.checkboxLabel}>
                  {option}
                </Label>
              </div>
            ))}
          </div>
        </div>
      );

    case 'textarea':
      return (
        <div key={field.id} className="space-y-2">
          <Label htmlFor={field.id} className={highContrastClasses.label}>
            {field.label} {field.required && <span className="text-red-500">*</span>}
          </Label>
          <Textarea
            id={field.id}
            value={value || ''}
            onChange={(e) => onChange(field.id, e.target.value)}
            className={highContrastClasses.textarea}
            rows={4}
            placeholder={`Escriba ${field.label.toLowerCase()}`}
          />
        </div>
      );

    default:
      return null;
  }
};

export default FormField;
