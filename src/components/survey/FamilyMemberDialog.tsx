import { UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import EnhancedBirthDatePicker from "@/components/ui/enhanced-birth-date-picker";
import AutocompleteWithLoading from "@/components/ui/autocomplete-with-loading";
import { Plus, AlertCircle, Shirt } from "lucide-react";
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
// Importar componentes de tallas
import { TallaSelect } from "@/components/tallas";

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
  
  // Determinar el modo del formulario basado en si hay un miembro siendo editado
  const formMode: DialogFormMode = editingMember ? 'edit' : 'create';
  const dialogTitle = generateDialogTitle('Miembro Familiar', formMode);
  const buttonText = generateButtonText(formMode, form.formState.isSubmitting);

  return (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/20 dark:bg-muted/20 rounded-xl">
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
                        className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        placeholder="Ingrese nombres y apellidos completos"
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

              {/* Tipo de Identificación */}
              <FormField
                control={form.control}
                name="tipoIdentificacion"
                render={({ field }) => (
                  <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                    <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Tipo de Identificación</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Número de Identificación */}
              <FormField
                control={form.control}
                name="numeroIdentificacion"
                render={({ field }) => (
                  <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                    <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Número de Identificación</FormLabel>
                    <FormControl>
                      <Input 
                        {...field} 
                        className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                        placeholder="Ingrese número de identificación"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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

              {/* Resto de campos básicos */}
              {[
                { name: 'telefono' as const, label: 'Teléfono', placeholder: 'Ej: 300-123-4567' },
                { name: 'enQueEresLider' as const, label: '¿En qué eres líder?', placeholder: 'Describe tu liderazgo' },
                { name: 'habilidadDestreza' as const, label: 'Habilidad o Destreza', placeholder: 'Describe tus habilidades' },
                { name: 'correoElectronico' as const, label: 'Correo Electrónico', placeholder: 'correo@ejemplo.com', type: 'email' },
                { name: 'necesidadesEnfermo' as const, label: 'Necesidades del Enfermo', placeholder: 'Describe necesidades especiales' },
              ].map(({ name, label, placeholder, type = 'text' }) => (
                <FormField
                  key={name}
                  control={form.control}
                  name={name}
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">{label}</FormLabel>
                      <FormControl>
                        <Input 
                          {...field} 
                          type={type}
                          className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                          placeholder={placeholder}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}

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

              {/* Enfermedad */}
              <FormField
                control={form.control}
                name="enfermedad"
                render={({ field }) => (
                  <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                    <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Enfermedad</FormLabel>
                    <FormControl>
                      <AutocompleteWithLoading
                        options={configurationData.enfermedadesOptions}
                        value={field.value || ''}
                        onValueChange={field.onChange}
                        placeholder="Seleccionar enfermedad..."
                        isLoading={configurationData.enfermedadesLoading}
                        error={configurationData.enfermedadesError}
                        emptyText="No hay opciones de enfermedades disponibles"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Sección de Tallas - Componentes modernos con datos predefinidos */}
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

            {/* Sección de Profesión y Celebraciones */}
            <div className="p-6 bg-purple-50 dark:bg-purple-900/10 rounded-xl border border-purple-200 dark:border-purple-800">
              <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-purple-600 text-white text-xs flex items-center justify-center">P</span>
                Profesión y Fechas a Celebrar
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

                {/* Motivo, Día y Mes */}
                {[
                  { name: 'profesionMotivoFechaCelebrar.motivo' as const, label: 'Motivo de Celebración', placeholder: 'Cumpleaños, aniversario, etc.' },
                  { name: 'profesionMotivoFechaCelebrar.dia' as const, label: 'Día', placeholder: '1-31', maxLength: 2 },
                ].map(({ name, label, placeholder, maxLength }) => (
                  <FormField
                    key={name}
                    control={form.control}
                    name={name}
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">{label}</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground"
                            placeholder={placeholder}
                            maxLength={maxLength}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                ))}

                {/* Mes */}
                <FormField
                  control={form.control}
                  name="profesionMotivoFechaCelebrar.mes"
                  render={({ field }) => (
                    <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                      <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Mes</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger className="bg-input border-2 border-input-border text-foreground rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 dark:bg-input dark:border-input-border dark:text-foreground">
                            <SelectValue placeholder="Seleccionar mes..." />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="rounded-xl border-2 border-border dark:border-border">
                          {[
                            { value: "1", label: "Enero" }, { value: "2", label: "Febrero" }, { value: "3", label: "Marzo" },
                            { value: "4", label: "Abril" }, { value: "5", label: "Mayo" }, { value: "6", label: "Junio" },
                            { value: "7", label: "Julio" }, { value: "8", label: "Agosto" }, { value: "9", label: "Septiembre" },
                            { value: "10", label: "Octubre" }, { value: "11", label: "Noviembre" }, { value: "12", label: "Diciembre" }
                          ].map(({ value, label }) => (
                            <SelectItem key={value} value={value} className="rounded-lg">
                              {label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Solicitud de Comunión en Casa */}
            <div className="p-6 bg-success/5 dark:bg-success/5 rounded-xl border border-success/20 dark:border-success/20">
              <FormField
                control={form.control}
                name="solicitudComunionCasa"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-3 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
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
            
            <DialogFooter className={DIALOG_CONFIG.footer.className}>
              <Button 
                type="button"
                variant="outline" 
                onClick={onCancel} 
                className={DIALOG_BUTTONS.secondary.className}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className={DIALOG_BUTTONS.primary.className}
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

export default FamilyMemberDialog;
