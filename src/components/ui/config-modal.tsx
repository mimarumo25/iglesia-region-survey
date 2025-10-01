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
import { Loader2, LucideIcon } from 'lucide-react';

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
          gradient: 'bg-gradient-primary',
          titleGradient: 'bg-gradient-primary bg-clip-text text-transparent',
          submitClass: 'bg-gradient-primary hover:bg-gradient-hover',
        };
      case 'edit':
        return {
          gradient: 'bg-gradient-secondary',
          titleGradient: 'bg-gradient-secondary bg-clip-text text-transparent',
          submitClass: 'bg-gradient-secondary hover:bg-gradient-hover',
        };
      case 'delete':
        return {
          gradient: 'bg-destructive/10',
          titleGradient: 'text-destructive',
          submitClass: 'bg-destructive hover:bg-destructive/90',
        };
      default:
        return {
          gradient: 'bg-gradient-primary',
          titleGradient: 'bg-gradient-primary bg-clip-text text-transparent',
          submitClass: 'bg-gradient-primary hover:bg-gradient-hover',
        };
    }
  };

  const colors = getModalColors();

  // Modal de eliminación (AlertDialog)
  if (type === 'delete') {
    return (
      <AlertDialog open={open} onOpenChange={onOpenChange}>
        <AlertDialogContent 
          className="shadow-glow border-destructive/20 w-[95vw] max-w-md mx-2 sm:mx-auto"
          style={{ borderRadius: '12px' }}
        >
          <AlertDialogHeader className="text-center pb-4 sm:pb-6">
            <div 
              className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 ${colors.gradient} flex items-center justify-center mb-3 sm:mb-4`}
              style={{ borderRadius: '12px' }}
            >
              <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-destructive animate-pulse" />
            </div>
            <AlertDialogTitle className={`text-xl sm:text-2xl font-bold ${colors.titleGradient}`}>
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
          <AlertDialogFooter className="flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <AlertDialogCancel 
              className="w-full sm:w-auto border-input-border hover:bg-muted transition-smooth px-4 sm:px-6"
              style={{ borderRadius: '12px' }}
            >
              {cancelText}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={onConfirm}
              className={`w-full sm:w-auto ${colors.submitClass} transition-smooth shadow-md hover:shadow-hover px-4 sm:px-6`}
              style={{ borderRadius: '12px' }}
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
        className="sm:max-w-2xl max-h-[95vh] w-[95vw] sm:w-full overflow-y-auto mx-2 sm:mx-auto"
        style={{ borderRadius: '12px', boxShadow: '0 0 25px hsl(var(--primary) / 0.3)' }}
      >
        <DialogHeader className="text-center pb-4 sm:pb-6">
          <div 
            className={`mx-auto w-12 h-12 sm:w-16 sm:h-16 ${colors.gradient} flex items-center justify-center mb-3 sm:mb-4`}
            style={{ borderRadius: '12px' }}
          >
            <Icon className="w-6 h-6 sm:w-8 sm:h-8 text-white animate-pulse-glow" />
          </div>
          <DialogTitle className={`text-xl sm:text-2xl font-bold ${colors.titleGradient}`}>
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base text-muted-foreground px-2">
            {description}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={onSubmit} className="space-y-4 sm:space-y-6">
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4 px-1 sm:px-2 max-h-[60vh] overflow-y-auto">
            {children}
          </div>
          
          <DialogFooter className="flex-col sm:flex-row gap-3 pt-4 sm:pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full sm:w-auto border-input-border hover:bg-muted transition-smooth px-4 sm:px-6"
              style={{ borderRadius: '12px' }}
            >
              {cancelText}
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className={`w-full sm:w-auto ${colors.submitClass} transition-smooth shadow-md hover:shadow-hover px-4 sm:px-6`}
              style={{ borderRadius: '12px' }}
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
          className="border-input-border focus:ring-primary focus:border-primary transition-smooth"
          style={{ borderRadius: '12px' }}
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
          className="border-input-border focus:ring-primary focus:border-primary transition-smooth h-12"
          style={{ borderRadius: '12px' }}
        />
      )}
    </div>
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
