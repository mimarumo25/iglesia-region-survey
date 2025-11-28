/**
 * Componente Modal para Agregar/Editar Miembros Difuntos
 * 
 * Este componente presenta un formulario completo para capturar información
 * de familiares difuntos, incluyendo validaciones y manejo de errores.
 * 
 * Características:
 * - Formulario completo con todos los campos necesarios
 * - Validación en tiempo real con mensajes de error
 * - Soporte para modo edición y creación
 * - Integración con datos de configuración (sexo, parentesco)
 * - Diseño responsive y accesible
 * - Theming oscuro/claro
 * - UX optimizada con indicadores visuales
 * 
 * Arquitectura:
 * - Componente puramente presentacional
 * - Props bien definidas para máxima reutilización
 * - Integración con React Hook Form
 * - Uso de shadcn/ui components
 * - ErrorBoundary para manejo de errores
 */

import React from "react";
import { UseFormReturn } from "react-hook-form";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import EnhancedBirthDatePicker from "@/components/ui/enhanced-birth-date-picker";
import { AutocompleteWithLoading } from "@/components/ui/autocomplete-with-loading";
import { Plus, AlertCircle, Heart, Users } from "lucide-react";
import { DeceasedFamilyMember, ConfigurationItem } from "@/types/survey";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { useAutocompleteConfiguration } from "@/hooks/useAutocompleteConfiguration";
import { DeceasedMemberFormData } from "@/hooks/useDeceasedGrid";
import ErrorBoundary from "@/components/ui/error-boundary";
import { 
  DIALOG_CONFIG, 
  DIALOG_BUTTONS, 
  generateDialogTitle, 
  generateButtonText,
  DialogFormMode 
} from "@/utils/dialog-helpers";

interface DeceasedMemberDialogProps {
  form: UseFormReturn<DeceasedMemberFormData>;
  onSubmit: (data: DeceasedMemberFormData) => void;
  onCancel: () => void;
  editingMember: DeceasedFamilyMember | null;
}

/**
 * Diálogo para agregar/editar miembros difuntos
 * 
 * @param props - Props del componente
 * @returns JSX.Element
 * 
 * @example
 * ```tsx
 * <DeceasedMemberDialog
 *   isOpen={showDeceasedDialog}
 *   onOpenChange={setShowDeceasedDialog}
 *   form={form}
 *   onSubmit={onSubmit}
 *   onCancel={resetForm}
 *   editingMember={editingDeceasedMember}
 * />
 * ```
 */
const DeceasedMemberDialog: React.FC<DeceasedMemberDialogProps> = ({
  form,
  onSubmit,
  onCancel,
  editingMember
}) => {
  // Hook para datos de configuración
  const configurationData = useConfigurationData();
  
  // Determinar el modo del formulario basado en si hay un miembro siendo editado
  const formMode: DialogFormMode = editingMember ? 'edit' : 'create';
  const dialogTitle = generateDialogTitle('Miembro Difunto', formMode);
  const buttonText = generateButtonText(formMode, form.formState.isSubmitting);

  return (
    <DialogContent className={DIALOG_CONFIG.content.className}>
        {/* Header del diálogo */}
        <DialogHeader className={DIALOG_CONFIG.header.className}>
          <DialogTitle className={DIALOG_CONFIG.title.className}>
            <Plus className="w-5 h-5 text-primary" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className={DIALOG_CONFIG.description.className}>
            Complete los campos requeridos. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>

        {/* Formulario */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 sm:space-y-6 overflow-x-hidden px-1 sm:px-0">
            {/* SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL */}
            <div className="p-3 sm:p-6 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-200 dark:border-red-800">
              <h4 className="text-base sm:text-lg font-bold text-foreground dark:text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 shrink-0" />
                <span className="leading-tight">Información Básica del Difunto</span>
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Datos principales del familiar fallecido
              </p>
              <div className="space-y-3 sm:space-y-4 overflow-hidden">
                {/* Nombres */}
                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-3 sm:p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm overflow-hidden">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                        Nombres y Apellidos *
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          className="bg-input border-2 border-input-border text-foreground dark:bg-input dark:border-input-border dark:text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 hover:bg-accent hover:border-input-border transition-all duration-200 w-full"
                          placeholder="Ingrese nombres y apellidos completos"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs font-medium" />
                    </FormItem>
                  )}
                />

                {/* Fecha de Fallecimiento */}
                <FormField
                  control={form.control}
                  name="fechaFallecimiento"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-3 sm:p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm overflow-hidden">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                        <Heart className="w-4 h-4 text-red-500" />
                        Fecha de Fallecimiento
                      </FormLabel>
                      <FormControl>
                        <EnhancedBirthDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de fallecimiento"
                          title="Fecha de Fallecimiento"
                          description="Elija una fecha de fallecimiento"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 2: INFORMACIÓN DEMOGRÁFICA */}
            <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="text-base sm:text-lg font-bold text-foreground dark:text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500 shrink-0" />
                <span className="leading-tight">Información Demográfica</span>
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Información sobre sexo y parentesco familiar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 overflow-hidden">
                {/* Sexo */}
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => {
                    const { autocompleteProps } = useAutocompleteConfiguration({
                      options: configurationData.sexoOptions,
                      isLoading: configurationData.sexosLoading,
                      error: configurationData.sexosError,
                      value: field.value as ConfigurationItem | null,
                      onChange: field.onChange,
                    });

                    return (
                      <FormItem className="space-y-2 p-3 sm:p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm overflow-hidden">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                          <Users className="w-4 h-4 text-blue-500" />
                          Sexo
                        </FormLabel>
                        <FormControl>
                          <ErrorBoundary>
                            <AutocompleteWithLoading
                              {...autocompleteProps}
                              placeholder="Seleccionar sexo"
                              emptyText="No se encontraron sexos"
                              searchPlaceholder="Buscar sexo..."
                              errorText="Error al cargar sexos"
                            />
                          </ErrorBoundary>
                        </FormControl>
                        <FormMessage className="text-destructive text-xs font-medium" />
                      </FormItem>
                    );
                  }}
                />

                {/* Parentesco */}
                <FormField
                  control={form.control}
                  name="parentesco"
                  render={({ field }) => {
                    const { autocompleteProps } = useAutocompleteConfiguration({
                      options: configurationData.parentescosOptions,
                      isLoading: configurationData.parentescosLoading,
                      error: configurationData.parentescosError,
                      value: field.value as ConfigurationItem | null,
                      onChange: field.onChange,
                    });

                    return (
                      <FormItem className="space-y-2 p-3 sm:p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm overflow-hidden">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                          <Users className="w-4 h-4 text-green-500" />
                          Parentesco
                        </FormLabel>
                        <FormControl>
                          <ErrorBoundary>
                            <AutocompleteWithLoading
                              {...autocompleteProps}
                              placeholder="Seleccionar parentesco"
                              emptyText="No se encontraron parentescos"
                              searchPlaceholder="Buscar parentesco..."
                              errorText="Error al cargar parentescos"
                            />
                          </ErrorBoundary>
                        </FormControl>
                        <FormMessage className="text-destructive text-xs font-medium" />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>

            {/* SECCIÓN 3: INFORMACIÓN MÉDICA */}
            <div className="p-3 sm:p-6 bg-yellow-50 dark:bg-yellow-900/10 rounded-xl border border-yellow-200 dark:border-yellow-800">
              <h4 className="text-base sm:text-lg font-bold text-foreground dark:text-foreground mb-3 sm:mb-4 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-600 shrink-0" />
                <span className="leading-tight">Causa de Fallecimiento</span>
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                Información médica sobre el fallecimiento
              </p>
              {/* Causa de Fallecimiento */}
              <FormField
                control={form.control}
                name="causaFallecimiento"
                render={({ field }) => (
                  <FormItem className="space-y-2 p-3 sm:p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm overflow-hidden">
                    <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                      Causa de Fallecimiento *
                      <AlertCircle className="w-3 h-3 text-destructive" />
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        className="bg-input border-2 border-input-border text-foreground dark:bg-input dark:border-input-border dark:text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 hover:bg-accent hover:border-input-border transition-all duration-200 min-h-[80px] w-full"
                        placeholder="Describa la causa de fallecimiento"
                      />
                    </FormControl>
                    <FormMessage className="text-destructive text-xs font-medium" />
                  </FormItem>
                )}
              />
            </div>

            {/* Footer con botones de acción */}
            <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onCancel}
                className="w-full sm:w-auto order-2 sm:order-1 touch-manipulation"
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="w-full sm:w-auto order-1 sm:order-2 touch-manipulation"
                disabled={form.formState.isSubmitting}
              >
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
  );
};

export default DeceasedMemberDialog;
