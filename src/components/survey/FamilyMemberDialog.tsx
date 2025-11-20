import { UseFormReturn, useFieldArray } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";
import EnhancedBirthDatePicker from "@/components/ui/enhanced-birth-date-picker";
import AutocompleteWithLoading from "@/components/ui/autocomplete-with-loading";
import { PhoneInput } from "@/components/ui/phone-input";
import { EmailInput } from "@/components/ui/email-input";
import { Plus, AlertCircle, Shirt, Lightbulb, Wrench, Trash2 } from "lucide-react";
import { FamilyMemberFormData } from "@/hooks/useFamilyGrid";
import { FamilyMember } from "@/types/survey";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { 
  DIALOG_CONFIG, 
  DIALOG_BUTTONS, 
  generateDialogTitle, 
  generateButtonText,
  DialogFormMode 
} from "@/utils/dialog-helpers";
import { useEffect, useRef } from "react";
import { trimString } from "@/utils/stringTrimHelpers";
// Importar componentes de tallas
import { TallaSelect } from "@/components/tallas";
// Importar hooks simplificados de habilidades y destrezas
import { useHabilidadesFormulario } from "@/hooks/useHabilidadesFormulario";
import { useDestrezasFormulario } from "@/hooks/useDestrezasFormulario";
// Importar componente de selección múltiple
import { MultiSelectWithChips } from "@/components/ui/multi-select-chips";
// Importar componente de chip input
import { ChipInput } from "@/components/ui/chip-input";

const MONTH_OPTIONS = [
  { value: "1", label: "Enero" },
  { value: "2", label: "Febrero" },
  { value: "3", label: "Marzo" },
  { value: "4", label: "Abril" },
  { value: "5", label: "Mayo" },
  { value: "6", label: "Junio" },
  { value: "7", label: "Julio" },
  { value: "8", label: "Agosto" },
  { value: "9", label: "Septiembre" },
  { value: "10", label: "Octubre" },
  { value: "11", label: "Noviembre" },
  { value: "12", label: "Diciembre" },
];

const createCelebracionId = (): string => {
  const uuid = globalThis.crypto?.randomUUID?.();
  return uuid ?? `celebracion-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
};

interface FamilyMemberDialogProps {
  form: UseFormReturn<FamilyMemberFormData>;
  onSubmit: (data: FamilyMemberFormData) => void;
  onCancel: () => void;
  editingMember: FamilyMember | null;
}

/**
 * Componente de diálogo para agregar/editar miembros familiares
 * Refactorizado para usar utilidades reutilizables y mejores prácticas
 * 
 * Características:
 * - Uso de utilidades para evitar duplicación de código
 * - Configuración centralizada de estilos
 * - Separación de lógica de presentación
 */
const FamilyMemberDialog = ({ 
  form, 
  onSubmit, 
  onCancel, 
  editingMember 
}: FamilyMemberDialogProps) => {
  const configurationData = useConfigurationData();
  const isMountedRef = useRef(true);
  
  // Cargar habilidades y destrezas activas desde la API usando hooks simplificados
  const { habilidades, isLoading: habilidadesLoading, error: habilidadesError } = useHabilidadesFormulario();
  const { destrezas, isLoading: destrezasLoading, error: destrezasError } = useDestrezasFormulario();
  const {
    fields: celebracionFields,
    append: appendCelebracion,
    remove: removeCelebracion,
  } = useFieldArray({
    control: form.control,
    name: "profesionMotivoFechaCelebrar.celebraciones",
  });

  const handleAddCelebracion = () => {
    appendCelebracion({
      id: createCelebracionId(),
      motivo: "",
      dia: "",
      mes: "",
    });
  };

  useEffect(() => {
    celebracionFields.forEach((celebracion, index) => {
      const currentId = form.getValues(`profesionMotivoFechaCelebrar.celebraciones.${index}.id`);
      if (!currentId) {
        form.setValue(
          `profesionMotivoFechaCelebrar.celebraciones.${index}.id`,
          celebracion.id ?? createCelebracionId(),
          { shouldDirty: false, shouldTouch: false }
        );
      }
    });
  }, [celebracionFields, form]);
  
  // Cleanup al desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  // Función segura para cerrar el diálogo
  const safeOnCancel = () => {
    if (isMountedRef.current) {
      try {
        onCancel();
      } catch (error) {
        console.error('Error al cerrar diálogo:', error);
      }
    }
  };
  
  // Determinar el modo del formulario basado en si hay un miembro siendo editado
  const formMode: DialogFormMode = editingMember ? 'edit' : 'create';
  const dialogTitle = generateDialogTitle('Miembro Familiar', formMode);
  const buttonText = generateButtonText(formMode, form.formState.isSubmitting);

  return (
    <ErrorBoundary
      fallback={
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-red-600">Error en el Formulario</DialogTitle>
            <DialogDescription>
              Hubo un problema al cargar el formulario de miembro familiar. 
            </DialogDescription>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-gray-600 mb-4">
              Por favor, cierre este diálogo y vuelva a intentarlo.
            </p>
            <Button onClick={safeOnCancel} variant="outline">
              Cerrar
            </Button>
          </div>
        </DialogContent>
      }
      onError={(error, errorInfo) => {
        console.error('Error en FamilyMemberDialog:', error);
        console.error('ErrorInfo:', errorInfo);
        
        // Logging específico para errores de Portal/DOM
        if (error.message?.includes('removeChild') || error.message?.includes('Portal') || error.message?.includes('NotFoundError')) {
          // Portal/DOM manipulation error - attempting recovery
          
          // Ejecutar onCancel de forma inmediata y segura sin setTimeout
          try {
            // Usar requestAnimationFrame para asegurar que se ejecute en el próximo ciclo de renderizado
            requestAnimationFrame(() => {
              if (isMountedRef.current) {
                try {
                  safeOnCancel();
                } catch (e) {
                  console.error('Error al cerrar diálogo:', e);
                  // Como último recurso, intentar limpiar el estado del formulario
                  try {
                    form.reset();
                  } catch (resetError) {
                    console.error('Error al resetear formulario:', resetError);
                  }
                }
              }
            });
          } catch (e) {
            console.error('Error en recovery del diálogo:', e);
          }
        }
      }}
    >
      <DialogContent className={DIALOG_CONFIG.content.className}>
        <DialogHeader className={DIALOG_CONFIG.header.className}>
          <DialogTitle className={DIALOG_CONFIG.title.className}>
            <Plus className="w-5 h-5 text-primary" />
            {dialogTitle}
          </DialogTitle>
          <DialogDescription className={DIALOG_CONFIG.description.className}>
            Complete los campos requeridos. Los campos marcados con * son obligatorios.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* SECCIÓN 1: INFORMACIÓN BÁSICA PERSONAL */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">1</span>
                Información Básica Personal
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Datos identificativos principales del miembro familiar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Nombres */}
                <FormField
                  control={form.control}
                  name="nombres"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                        Nombres y Apellidos *
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={(e) => field.onChange(trimString(e.target.value))}
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                          placeholder="Ingrese nombres y apellidos completos"
                          data-testid="family-member-nombres-input"
                          id="family-member-nombres"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs font-medium" />
                    </FormItem>
                  )}
                />

                {/* Fecha de Nacimiento */}
                <FormField
                  control={form.control}
                  name="fechaNacimiento"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Fecha de Nacimiento</FormLabel>
                      <FormControl>
                        <EnhancedBirthDatePicker
                          value={field.value}
                          onChange={field.onChange}
                          placeholder="Seleccionar fecha de nacimiento"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs font-medium" />
                    </FormItem>
                  )}
                />

                {/* Número de Identificación */}
                <FormField
                  control={form.control}
                  name="numeroIdentificacion"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                        Número de Identificación *
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      </FormLabel>
                      <FormControl>
                        <Input 
                          {...field}
                          value={field.value || ''}
                          onChange={(e) => field.onChange(e.target.value)}
                          onBlur={(e) => field.onChange(trimString(e.target.value))}
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                          placeholder="Ingrese número de identificación"
                          data-testid="family-member-numero-identificacion-input"
                          id="family-member-numero-identificacion"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs font-medium" />
                    </FormItem>
                  )}
                />

                {/* Tipo de Identificación */}
                <FormField
                  control={form.control}
                  name="tipoIdentificacion"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-1">
                        Tipo de Identificación *
                        <AlertCircle className="w-3 h-3 text-destructive" />
                      </FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.tiposIdentificacionOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar tipo de identificación..."
                          isLoading={configurationData.tiposIdentificacionLoading}
                          error={configurationData.tiposIdentificacionError}
                          emptyText="No hay tipos de identificación disponibles"
                        />
                      </FormControl>
                      <FormMessage className="text-destructive text-xs font-medium" />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 2: INFORMACIÓN DE CONTACTO */}
            <div className="p-6 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-200 dark:border-green-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-green-600 text-white text-xs flex items-center justify-center">2</span>
                Información de Contacto
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Datos de contacto y comunicación
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Teléfono */}
                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormControl>
                        <PhoneInput
                          label="Teléfono"
                          value={field.value || ''}
                          onChange={field.onChange}
                          showValidation={true}
                          formatOnBlur={true}
                          placeholder="Ej: 300-123-4567"
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Correo Electrónico */}
                <FormField
                  control={form.control}
                  name="correoElectronico"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormControl>
                        <EmailInput
                          label="Correo Electrónico"
                          value={field.value || ''}
                          onChange={field.onChange}
                          showValidation={true}
                          placeholder="correo@ejemplo.com"
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 3: INFORMACIÓN DEMOGRÁFICA */}
            <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">3</span>
                Información Demográfica
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Información sobre sexo, parentesco y estado civil
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Sexo */}
                <FormField
                  control={form.control}
                  name="sexo"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Sexo</FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.sexoOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar sexo..."
                          isLoading={configurationData.sexosLoading}
                          error={configurationData.sexosError}
                          emptyText="No hay opciones de sexo disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Parentesco */}
                <FormField
                  control={form.control}
                  name="parentesco"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Parentesco</FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.parentescosOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar parentesco..."
                          isLoading={configurationData.parentescosLoading}
                          error={configurationData.parentescosError}
                          emptyText="No hay opciones de parentesco disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Situación Civil */}
                <FormField
                  control={form.control}
                  name="situacionCivil"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Situación Civil</FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.estadoCivilOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar estado civil..."
                          isLoading={configurationData.situacionesCivilesLoading}
                          error={configurationData.situacionesCivilesError}
                          emptyText="No hay opciones de estado civil disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 4: INFORMACIÓN EDUCATIVA Y PROFESIONAL */}
            <div className="p-6 bg-orange-50 dark:bg-orange-900/10 rounded-xl border border-orange-200 dark:border-orange-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-orange-600 text-white text-xs flex items-center justify-center">4</span>
                Información Educativa y Profesional
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Nivel de estudios y profesión
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Estudio */}
                <FormField
                  control={form.control}
                  name="estudio"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Nivel de Estudios</FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.estudiosOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar nivel de estudios..."
                          isLoading={configurationData.estudiosLoading}
                          error={configurationData.estudiosError}
                          emptyText="No hay opciones de estudios disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Profesión */}
                <FormField
                  control={form.control}
                  name="profesionMotivoFechaCelebrar.profesion"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Profesión</FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.profesionesOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar profesión..."
                          isLoading={configurationData.profesionesLoading}
                          error={configurationData.profesionesError}
                          emptyText="No hay opciones de profesiones disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 5: INFORMACIÓN CULTURAL Y DE SALUD */}
            <div className="p-6 bg-indigo-50 dark:bg-indigo-900/10 rounded-xl border border-indigo-200 dark:border-indigo-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs flex items-center justify-center">5</span>
                Información Cultural y de Salud
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Comunidad cultural, enfermedades y necesidades especiales
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Comunidad Cultural */}
                <FormField
                  control={form.control}
                  name="comunidadCultural"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Comunidad Cultural</FormLabel>
                      <FormControl>
                        <AutocompleteWithLoading
                          options={configurationData.comunidadesCulturalesOptions}
                          value={field.value || ''}
                          onValueChange={field.onChange}
                          placeholder="Seleccionar comunidad cultural..."
                          isLoading={configurationData.comunidadesCulturalesLoading}
                          error={configurationData.comunidadesCulturalesError}
                          emptyText="No hay opciones de comunidades culturales disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Enfermedades */}
                <FormField
                  control={form.control}
                  name="enfermedades"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Enfermedades</FormLabel>
                      <FormControl>
                        <MultiSelectWithChips
                          options={configurationData.enfermedadesOptions.map(opt => ({
                            id: opt.value,
                            nombre: opt.label,
                          }))}
                          value={
                            (field.value || []).map(e => ({
                              id: e.id || '',
                              nombre: e.nombre || '',
                            })) as Array<{ id: string; nombre: string }>
                          }
                          onChange={(selectedEnfermedades) => {
                            field.onChange(
                              selectedEnfermedades.map(e => ({
                                id: e.id,
                                nombre: e.nombre,
                              }))
                            );
                          }}
                          placeholder="Seleccionar enfermedades..."
                          emptyText="No hay opciones de enfermedades disponibles"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Necesidades del Enfermo */}
                <FormField
                  control={form.control}
                  name="necesidadesEnfermo"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Necesidades del Enfermo</FormLabel>
                      <FormControl>
                        <ChipInput
                          value={Array.isArray(field.value) ? field.value : []}
                          onChange={field.onChange}
                          placeholder="Escribe una necesidad y presiona Enter..."
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus-within:bg-accent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Solicitud de Comunión en Casa */}
                <FormField
                  control={form.control}
                  name="solicitudComunionCasa"
                  render={({ field }) => (
                    <FormItem className="md:col-span-2 flex items-center space-x-3 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormControl>
                        <input
                          type="checkbox"
                          checked={field.value}
                          onChange={field.onChange}
                          className="h-5 w-5 accent-primary scale-110 rounded-md"
                        />
                      </FormControl>
                      <FormLabel className="text-foreground dark:text-foreground font-semibold cursor-pointer select-none">
                        ¿Solicita Comunión en Casa?
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 6: INFORMACIÓN DE TALLAS */}
            <div className="p-6 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-200 dark:border-blue-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <Shirt className="w-5 h-5 text-blue-600" />
                Información de Tallas
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona las tallas más comunes utilizadas en Colombia
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Talla de Camisa/Blusa */}
                <FormField
                  control={form.control}
                  name="talla.camisa"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">
                        Camisa/Blusa
                      </FormLabel>
                      <FormControl>
                        <TallaSelect
                          tipo="camisa"
                          value={field.value || ''}
                          onChange={field.onChange}
                          variant="combobox"
                          placeholder="Seleccionar talla..."
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Talla de Pantalón */}
                <FormField
                  control={form.control}
                  name="talla.pantalon"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">
                        Pantalón
                      </FormLabel>
                      <FormControl>
                        <TallaSelect
                          tipo="pantalon"
                          value={field.value || ''}
                          onChange={field.onChange}
                          variant="select"
                          placeholder="Seleccionar talla..."
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Talla de Calzado */}
                <FormField
                  control={form.control}
                  name="talla.calzado"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">
                        Calzado
                      </FormLabel>
                      <FormControl>
                        <TallaSelect
                          tipo="calzado"
                          value={field.value || ''}
                          onChange={field.onChange}
                          variant="combobox"
                          placeholder="Seleccionar talla..."
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 7: INFORMACIÓN DE CELEBRACIONES */}
            <div className="p-6 bg-pink-50 dark:bg-pink-900/10 rounded-xl border border-pink-200 dark:border-pink-800">
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-2 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-pink-600 text-white text-xs flex items-center justify-center">7</span>
                    Fechas a Celebrar
                  </h4>
                  <p className="text-sm text-muted-foreground">
                    Información sobre celebraciones especiales (cumpleaños, aniversarios, etc.)
                  </p>
                </div>
                <Button
                  type="button"
                  variant="default"
                  size="lg"
                  onClick={handleAddCelebracion}
                  className="flex items-center gap-2 bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:from-primary/90 hover:to-blue-600/90"
                >
                  <Plus className="h-4 w-4" />
                  Agregar fecha
                </Button>
              </div>

              {celebracionFields.length === 0 ? (
                <div className="mt-4 rounded-xl border border-border bg-card/50 px-4 py-6 text-sm text-muted-foreground shadow-sm">
                  No hay celebraciones registradas. Usa “Agregar fecha” para añadir la primera.
                </div>
              ) : (
                <div className="mt-4 space-y-4">
                  {celebracionFields.map((celebracion, index) => (
                    <div
                      key={celebracion.id ?? `celebracion-${index}`}
                      className="space-y-4 rounded-xl border border-border bg-card/50 p-4 shadow-sm dark:bg-card/50"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-foreground">
                          Celebración {index + 1}
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeCelebracion(index)}
                          aria-label={`Eliminar celebración ${index + 1}`}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>

                      <FormField
                        control={form.control}
                        name={`profesionMotivoFechaCelebrar.celebraciones.${index}.id` as const}
                        render={({ field }) => (
                          <input
                            type="hidden"
                            {...field}
                            value={field.value ?? celebracion.id ?? ""}
                          />
                        )}
                      />

                      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                        <FormField
                          control={form.control}
                          name={`profesionMotivoFechaCelebrar.celebraciones.${index}.motivo` as const}
                          render={({ field }) => (
                            <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                              <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">
                                Motivo de Celebración
                              </FormLabel>
                              <FormControl>
                                <Input
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="Cumpleaños, aniversario, etc."
                                  className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`profesionMotivoFechaCelebrar.celebraciones.${index}.dia` as const}
                          render={({ field }) => (
                            <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                              <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Día</FormLabel>
                              <FormControl>
                                <Input
                                  value={field.value ?? ""}
                                  onChange={field.onChange}
                                  placeholder="1-31"
                                  maxLength={2}
                                  inputMode="numeric"
                                  className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`profesionMotivoFechaCelebrar.celebraciones.${index}.mes` as const}
                          render={({ field }) => {
                            const selectedValue = field.value && field.value !== "" ? field.value : undefined;
                            return (
                              <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                                <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Mes</FormLabel>
                                <Select onValueChange={field.onChange} value={selectedValue}>
                                  <FormControl>
                                    <SelectTrigger className="bg-input border-2 border-input-border text-foreground rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground">
                                      <SelectValue placeholder="Seleccionar mes..." />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent className="rounded-xl border-2 border-border dark:border-border">
                                    {MONTH_OPTIONS.map(({ value, label }) => (
                                      <SelectItem key={value} value={value} className="rounded-lg">
                                        {label}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            );
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* SECCIÓN 8: INFORMACIÓN DE SERVICIOS Y LIDERAZGO */}
            <div className="p-6 bg-teal-50 dark:bg-teal-900/10 rounded-xl border border-teal-200 dark:border-teal-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-teal-600 text-white text-xs flex items-center justify-center">8</span>
                Información de Servicios y Liderazgo
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Liderazgo y servicios religiosos
              </p>
              <div className="grid grid-cols-1 gap-4">
                {/* En qué eres líder */}
                <FormField
                  control={form.control}
                  name="enQueEresLider"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">¿En qué eres líder?</FormLabel>
                      <FormControl>
                        <ChipInput
                          value={Array.isArray(field.value) ? field.value : []}
                          onChange={field.onChange}
                          placeholder="Escribe un área de liderazgo y presiona Enter..."
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus-within:bg-accent focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* SECCIÓN 9: HABILIDADES Y DESTREZAS (NUEVA) */}
            <div className="p-6 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-200 dark:border-amber-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-amber-600" />
                Habilidades y Destrezas
              </h4>
              <p className="text-sm text-muted-foreground mb-4">
                Selecciona las habilidades profesionales y destrezas técnicas del miembro familiar
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Habilidades */}
                <FormField
                  control={form.control}
                  name="habilidades"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-2">
                        <Lightbulb className="w-4 h-4 text-amber-500" />
                        Habilidades Profesionales
                      </FormLabel>
                      <FormControl>
                        <MultiSelectWithChips
                          options={habilidades}
                          value={(field.value || []) as Array<{ id: number; nombre: string; nivel?: string }>}
                          onChange={(selected) => {
                            field.onChange(selected);
                          }}
                          placeholder="Seleccionar habilidades..."
                          searchPlaceholder="Buscar habilidad..."
                          emptyText="No se encontraron habilidades"
                          isLoading={habilidadesLoading}
                          error={habilidadesError}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Destrezas */}
                <FormField
                  control={form.control}
                  name="destrezas"
                  render={({ field, fieldState }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm flex items-center gap-2">
                        <Wrench className="w-4 h-4 text-teal-500" />
                        Destrezas Técnicas
                      </FormLabel>
                      <FormControl>
                        <MultiSelectWithChips
                          options={destrezas}
                          value={(field.value || []) as Array<{ id: number; nombre: string }>}
                          onChange={(selected) => {
                            field.onChange(selected);
                          }}
                          placeholder="Seleccionar destrezas..."
                          searchPlaceholder="Buscar destreza..."
                          emptyText="No se encontraron destrezas"
                          isLoading={destrezasLoading}
                          error={destrezasError}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            
            <DialogFooter className={DIALOG_CONFIG.footer.className}>
              <Button 
                type="button"
                variant="outline" 
                onClick={safeOnCancel} 
                className={DIALOG_BUTTONS.secondary.className}
                data-testid="family-member-cancel-button"
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className={DIALOG_BUTTONS.primary.className}
                disabled={form.formState.isSubmitting}
                data-testid="family-member-submit-button"
                id="family-member-submit-button"
              >
                {buttonText}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </ErrorBoundary>
  );
};

export default FamilyMemberDialog;
