import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Autocomplete, AutocompleteOption } from '@/components/ui/autocomplete';
import { Loader2, LucideIcon, Plus } from 'lucide-react';

// Tipos para los diferentes tipos de modal
export type ConfigModalType = 'create' | 'edit' | 'delete';

// Props para el modal de configuración
export interface ConfigModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: ConfigModalType;
  title: string;
  description: string;
  icon: LucideIcon;
  loading?: boolean;
  onSubmit?: (e: React.FormEvent) => void;
  onConfirm?: () => void;
  entityName?: string; // Para el modal de eliminar
  children?: React.ReactNode;
  submitText?: string;
  cancelText?: string;
}

// Componente principal del modal de configuración
export const ConfigModal: React.FC<ConfigModalProps> = ({
  open,
  onOpenChange,
  type,
  title,
  description,
  icon: Icon,
  loading = false,
  onSubmit,
  onConfirm,
  entityName,
  children,
  submitText,
  cancelText = 'Cancelar',
}) => {
  // Colores según el tipo de modal
  const getModalColors = () => {
    switch (type) {
      case 'create':
        return {
          gradient: 'bg-primary/10 text-primary',
          titleGradient: 'text-foreground',
          submitClass: 'bg-primary hover:bg-primary/90',
        };
      case 'edit':
        return {
          gradient: 'bg-primary/10 text-primary',
          titleGradient: 'text-foreground',
          submitClass: 'bg-primary hover:bg-primary/90',
        };
      case 'delete':
        return {
          gradient: 'bg-destructive/10',
          titleGradient: 'text-destructive',
          submitClass: 'bg-destructive hover:bg-destructive/90',
        };
      default:
        return {
          gradient: 'bg-primary/10 text-primary',
          titleGradient: 'text-foreground',
          submitClass: 'bg-primary hover:bg-primary/90',
        };
    }
  };

  const colors = getModalColors();

  // Modal de eliminación (AlertDialog)
  if (type === 'delete') {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent 
          className="w-[95vw] max-w-md border-destructive/20 shadow-2xl"
        >
          <AlertDialogHeader className="pb-4 text-center sm:pb-5">
            <div 
              className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${colors.gradient} sm:mb-4 sm:h-14 sm:w-14`}
            >
              <Icon className="h-6 w-6 text-destructive sm:h-7 sm:w-7" />
            </div>
            <AlertDialogTitle className={`text-xl font-bold sm:text-2xl ${colors.titleGradient}`}>
              {title}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
              {description}
              {entityName && (
                <span className="font-semibold text-destructive"> "{entityName}"</span>
              )}
              {' del sistema.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 pt-4 sm:pt-5">
            <AlertDialogCancel 
              className="w-full px-4 sm:w-auto sm:px-6"
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={`w-full px-4 shadow-sm sm:w-auto sm:px-6 ${colors.submitClass}`}
              disabled={loading}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Icon className="w-4 h-4 mr-2" />
              {submitText || 'Eliminar'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  // Modal de creación/edición (Dialog)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-h-[92vh] w-[95vw] overflow-y-auto sm:max-w-2xl sm:w-full"
      >
        <DialogHeader className="pb-4 text-center sm:pb-5">
          <div 
            className={`mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl ${colors.gradient} sm:mb-4 sm:h-14 sm:w-14`}
          >
            <Icon className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
          </div>
          <DialogTitle className={`text-xl font-bold sm:text-2xl ${colors.titleGradient}`}>
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div className="max-h-[60vh] space-y-4 overflow-y-auto px-1 py-2 sm:space-y-5 sm:px-2 sm:py-3 professional-table-scroll">
            {children}
          </div>
          
          <DialogFooter className="gap-2 pt-4 sm:pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full px-4 sm:w-auto sm:px-6"
            >
              {cancelText}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className={`w-full px-4 shadow-sm sm:w-auto sm:px-6 ${colors.submitClass}`}
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              <Icon className="w-4 h-4 mr-2" />
              {submitText || (type === 'create' ? 'Crear' : 'Guardar Cambios')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

// Componente para campos de formulario consistentes
export interface ConfigFormFieldProps {
  id: string;
  label: string;
  type?: 'text' | 'textarea' | 'autocomplete';
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  rows?: number;
  // Props específicas para autocomplete
  options?: AutocompleteOption[];
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  disabled?: boolean;
}

export const ConfigFormField: React.FC<ConfigFormFieldProps> = ({
  id,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  required = false,
  rows = 3,
  options = [],
  searchPlaceholder,
  emptyText,
  loading = false,
  disabled = false,
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor={id} className="text-foreground font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      {type === 'textarea' ? (
        <Textarea
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="rounded-xl border-input focus:border-primary focus:ring-primary/25"
          rows={rows}
        />
      ) : type === 'autocomplete' ? (
        <Autocomplete
          options={options}
          value={value}
          onValueChange={onChange}
          placeholder={placeholder}
          searchPlaceholder={searchPlaceholder}
          emptyText={emptyText}
          loading={loading}
          disabled={disabled}
          className="w-full"
        />
      ) : (
        <Input
          id={id}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="h-11 rounded-xl border-input focus:border-primary focus:ring-primary/25"
        />
      )}
    </div>
  );
};

export interface CatalogFormFieldDefinition {
  id: string;
  label: string;
  type?: 'text' | 'textarea' | 'autocomplete';
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: AutocompleteOption[];
  searchPlaceholder?: string;
  emptyText?: string;
  loading?: boolean;
  disabled?: boolean;
}

export interface CatalogFormModalProps<TCreated> {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  fields: CatalogFormFieldDefinition[];
  initialValues?: Record<string, string>;
  icon?: LucideIcon;
  submitText?: string;
  onSubmit: (values: Record<string, string>) => Promise<TCreated>;
  onCreated?: (created: TCreated) => void;
}

/**
 * Formulario declarativo para catálogos.
 * Usa el mismo ConfigModal de las pantallas de Configuración y permite
 * abrirlo sobre encuestas sin duplicar estructura, estilos ni validaciones.
 */
export const CatalogFormModal = <TCreated,>({
  open,
  onOpenChange,
  title,
  description,
  fields,
  initialValues = {},
  icon = Plus,
  submitText = 'Crear',
  onSubmit,
  onCreated,
}: CatalogFormModalProps<TCreated>) => {
  const [values, setValues] = React.useState<Record<string, string>>(initialValues);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!open) return;
    setValues({
      ...Object.fromEntries(fields.map((field) => [field.id, ''])),
      ...initialValues,
    });
    setError('');
  }, [fields, initialValues, open]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const missingField = fields.find((field) => field.required && !values[field.id]?.trim());
    if (missingField) {
      setError(`El campo ${missingField.label} es obligatorio`);
      return;
    }

    setLoading(true);
    setError('');
    try {
      const normalizedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [key, value.trim()])
      );
      const created = await onSubmit(normalizedValues);
      onCreated?.(created);
      onOpenChange(false);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'No se pudo guardar el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ConfigModal
      open={open}
      onOpenChange={onOpenChange}
      type="create"
      title={title}
      description={description}
      icon={icon}
      loading={loading}
      onSubmit={handleSubmit}
      submitText={submitText}
    >
      {fields.map((field) => (
        <ConfigFormField
          key={field.id}
          {...field}
          value={values[field.id] || ''}
          onChange={(value) => setValues((current) => ({ ...current, [field.id]: value }))}
        />
      ))}
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </ConfigModal>
  );
};

// Hook personalizado para manejar modales de configuración
export const useConfigModal = () => {
  const [showCreateDialog, setShowCreateDialog] = React.useState(false);
  const [showEditDialog, setShowEditDialog] = React.useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);

  const openCreateDialog = () => setShowCreateDialog(true);
  const closeCreateDialog = () => setShowCreateDialog(false);
  
  const openEditDialog = () => setShowEditDialog(true);
  const closeEditDialog = () => setShowEditDialog(false);
  
  const openDeleteDialog = () => setShowDeleteDialog(true);
  const closeDeleteDialog = () => setShowDeleteDialog(false);

  return {
    // Estados
    showCreateDialog,
    showEditDialog,
    showDeleteDialog,
    
    // Funciones para abrir
    openCreateDialog,
    openEditDialog,
    openDeleteDialog,
    
    // Funciones para cerrar
    closeCreateDialog,
    closeEditDialog,
    closeDeleteDialog,
    
    // Funciones para cambiar estado
    setShowCreateDialog,
    setShowEditDialog,
    setShowDeleteDialog,
  };
};


