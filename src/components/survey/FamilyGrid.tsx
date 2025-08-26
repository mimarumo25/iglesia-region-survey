import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ModernDatePicker from "@/components/ui/modern-date-picker";
import AutocompleteWithLoading from "@/components/ui/autocomplete-with-loading";
import { Plus, Trash2, AlertCircle, CalendarIcon, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { cn } from "@/lib/utils";
import { FamilyMember } from "@/types/survey";

// Estilos estandarizados para FamilyGrid con soporte de tema oscuro
const FAMILY_GRID_STYLES = {
  dialogContent: "max-w-6xl max-h-[90vh] overflow-y-auto bg-card border-2 border-border rounded-2xl shadow-2xl dark:bg-card dark:border-border",
  formItem: "space-y-2 p-4 bg-card/50 rounded-xl border border-border shadow-sm dark:bg-card/50 dark:border-border",
  formLabel: "text-foreground font-bold text-sm dark:text-foreground",
  input: "bg-input border-2 border-input-border text-foreground font-semibold rounded-xl focus:bg-accent focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all duration-200 h-12 dark:bg-input dark:border-input-border dark:text-foreground dark:focus:bg-accent dark:focus:border-primary",
  dialogHeader: "p-6 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-2xl border-b border-border dark:border-border",
  dialogFooter: "p-6 bg-muted/30 rounded-b-2xl border-t border-border dark:bg-muted/30 dark:border-border",
  checkbox: "h-5 w-5 accent-primary scale-110 rounded-md",
  checkboxLabel: "text-foreground font-semibold cursor-pointer select-none dark:text-foreground",
  checkboxContainer: "flex items-center space-x-3 p-4 bg-card/50 rounded-xl border border-border shadow-sm dark:bg-card/50 dark:border-border",
  sectionContainer: "p-6 bg-success/5 rounded-xl border border-success/20 dark:bg-success/5 dark:border-success/20",
  gridContainer: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-muted/20 rounded-xl dark:bg-muted/20",
  tableCard: "border-border bg-card dark:bg-card dark:border-border",
  tableHeader: "bg-muted/50 dark:bg-muted/50"
} as const;

interface FamilyGridProps {
  familyMembers: FamilyMember[];
  setFamilyMembers: React.Dispatch<React.SetStateAction<FamilyMember[]>>;
}

// Esquema de validación con Zod
const familyMemberSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  fechaNacimiento: z.date().optional().nullable(),
  tipoIdentificacion: z.string().optional(),
  numeroIdentificacion: z.string().optional(),
  sexo: z.string().optional(),
  situacionCivil: z.string().optional(),
  parentesco: z.string().optional(),
  talla: z.object({
    camisa: z.string().optional(),
    pantalon: z.string().optional(),
    calzado: z.string().optional(),
  }),
  estudio: z.string().optional(),
  comunidadCultural: z.string().optional(),
  telefono: z.string().optional(),
  enQueEresLider: z.string().optional(),
  habilidadDestreza: z.string().optional(),
  correoElectronico: z.string().email("Email inválido").optional().or(z.literal("")),
  enfermedad: z.string().optional(),
  necesidadesEnfermo: z.string().optional(),
  solicitudComunionCasa: z.boolean().optional(),
  profesionMotivoFechaCelebrar: z.object({
    profesion: z.string().optional(),
    motivo: z.string().optional(),
    dia: z.string().optional(),
    mes: z.string().optional(),
  }).optional(),
});

type FamilyMemberFormData = z.infer<typeof familyMemberSchema>;

const FamilyGrid = ({ familyMembers, setFamilyMembers }: FamilyGridProps) => {
  const [showFamilyDialog, setShowFamilyDialog] = useState(false);
  const [editingFamilyMember, setEditingFamilyMember] = useState<FamilyMember | null>(null);
  const { toast } = useToast();
  
  // Hook para cargar datos de configuración dinámicos
  const configurationData = useConfigurationData();

  // Función helper para migrar fechas del formato anterior
  const migrateDateFormat = (member: any): FamilyMember => {
    if (member.fechaNacimiento && typeof member.fechaNacimiento === 'object' && 'dia' in member.fechaNacimiento) {
      // Formato anterior: { dia: string, mes: string, año: string }
      const { dia, mes, año } = member.fechaNacimiento;
      if (dia && mes && año) {
        const date = new Date(parseInt(año), parseInt(mes) - 1, parseInt(dia));
        return { ...member, fechaNacimiento: date };
      } else {
        return { ...member, fechaNacimiento: null };
      }
    }
    return member;
  };

  // Configuración de React Hook Form
  const form = useForm<FamilyMemberFormData>({
    resolver: zodResolver(familyMemberSchema),
    defaultValues: {
      nombres: '',
      fechaNacimiento: new Date(), // Fecha actual por defecto
      tipoIdentificacion: '',
      numeroIdentificacion: '',
      sexo: '',
      situacionCivil: '',
      parentesco: '',
      talla: { camisa: '', pantalon: '', calzado: '' },
      estudio: '',
      comunidadCultural: '',
      telefono: '',
      enQueEresLider: '',
      habilidadDestreza: '',
      correoElectronico: '',
      enfermedad: '',
      necesidadesEnfermo: '',
      solicitudComunionCasa: false,
      profesionMotivoFechaCelebrar: { profesion: '', motivo: '', dia: '', mes: '' }
    }
  });

  const resetForm = () => {
    setEditingFamilyMember(null);
    form.reset();
    setShowFamilyDialog(false);
  };

  const onSubmit = (data: FamilyMemberFormData) => {
    if (editingFamilyMember) {
      setFamilyMembers(prev => prev.map(m => 
        m.id === editingFamilyMember.id ? { ...data, id: m.id } as FamilyMember : m
      ));
      toast({ 
        title: "Miembro actualizado", 
        description: "Datos actualizados correctamente.",
        duration: 3000
      });
    } else {
      setFamilyMembers(prev => [...prev, { 
        ...data, 
        id: Date.now().toString() 
      } as FamilyMember]);
      toast({ 
        title: "Miembro agregado", 
        description: "Nuevo miembro agregado a la familia.",
        duration: 3000
      });
    }
    resetForm();
  };

  const handleEdit = (member: FamilyMember) => {
    const migratedMember = migrateDateFormat(member);
    setEditingFamilyMember(migratedMember);
    form.reset(migratedMember);
    setShowFamilyDialog(true);
  };

  const handleDelete = (id: string) => {
    setFamilyMembers(prev => prev.filter(m => m.id !== id));
    toast({ 
      title: "Miembro eliminado", 
      description: "El miembro ha sido eliminado.",
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      {/* Indicador de carga de servicios */}
      {configurationData.isAnyLoading && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-amber-800">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium">Cargando datos para el formulario...</span>
              <div className="flex items-center gap-2 text-xs">
                {configurationData.tiposIdentificacionLoading && <span className="bg-amber-200 px-2 py-1 rounded">Tipos ID</span>}
                {configurationData.sexosLoading && <span className="bg-amber-200 px-2 py-1 rounded">Sexos</span>}
                {configurationData.parentescosLoading && <span className="bg-amber-200 px-2 py-1 rounded">Parentescos</span>}
                {configurationData.situacionesCivilesLoading && <span className="bg-amber-200 px-2 py-1 rounded">Estado Civil</span>}
                {configurationData.estudiosLoading && <span className="bg-amber-200 px-2 py-1 rounded">Estudios</span>}
                {configurationData.profesionesLoading && <span className="bg-amber-200 px-2 py-1 rounded">Profesiones</span>}
                {configurationData.enfermedadesLoading && <span className="bg-amber-200 px-2 py-1 rounded">Enfermedades</span>}
                {configurationData.comunidadesCulturalesLoading && <span className="bg-amber-200 px-2 py-1 rounded">Comunidades</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-foreground dark:text-foreground">Integrantes de la Familia</h3>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground">Agregue la información de cada miembro del hogar</p>
        </div>
        
        <Dialog open={showFamilyDialog} onOpenChange={setShowFamilyDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetForm()} 
              className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2.5"
            >
              <Plus className="w-4 h-4" />
              Agregar Miembro
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-300 rounded-2xl shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-t-2xl border-b border-border dark:border-border p-6">
              <DialogTitle className="text-xl font-bold text-foreground dark:text-foreground flex items-center gap-2">
                <Plus className="w-5 h-5 text-primary" />
                {editingFamilyMember ? 'Editar Miembro Familiar' : 'Agregar Miembro Familiar'}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground dark:text-muted-foreground mt-2">
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
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200"
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
                          <ModernDatePicker
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
                            options={configurationData.situacionesCivilesOptions}
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
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
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

                  {/* Teléfono */}
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Teléfono</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Ej: 300-123-4567"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* En qué eres líder */}
                  <FormField
                    control={form.control}
                    name="enQueEresLider"
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">¿En qué eres líder?</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Describe tu liderazgo"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Habilidad o Destreza */}
                  <FormField
                    control={form.control}
                    name="habilidadDestreza"
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Habilidad o Destreza</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Describe tus habilidades"
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
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            type="email"
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="correo@ejemplo.com"
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

                  {/* Necesidades del Enfermo */}
                  <FormField
                    control={form.control}
                    name="necesidadesEnfermo"
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                        <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Necesidades del Enfermo</FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                            placeholder="Describe necesidades especiales"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Sección de Tallas */}
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h4 className="text-lg font-bold text-foreground dark:text-foreground mb-4 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center">T</span>
                    Información de Tallas
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Talla Camisa */}
                    <FormField
                      control={form.control}
                      name="talla.camisa"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                          <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Camisa/Blusa</FormLabel>
                          <FormControl>
                            <AutocompleteWithLoading
                              options={configurationData.tallasOptions.filter(t => t.value.includes('camisa'))}
                              value={field.value || ''}
                              onValueChange={field.onChange}
                              placeholder="Seleccionar talla de camisa..."
                              isLoading={configurationData.tallasLoading}
                              error={configurationData.tallasError}
                              emptyText="No hay tallas de camisa disponibles"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Talla Pantalón */}
                    <FormField
                      control={form.control}
                      name="talla.pantalon"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                          <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Pantalón</FormLabel>
                          <FormControl>
                            <AutocompleteWithLoading
                              options={configurationData.tallasOptions.filter(t => t.value.includes('pantalon'))}
                              value={field.value || ''}
                              onValueChange={field.onChange}
                              placeholder="Seleccionar talla de pantalón..."
                              isLoading={configurationData.tallasLoading}
                              error={configurationData.tallasError}
                              emptyText="No hay tallas de pantalón disponibles"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Talla Calzado */}
                    <FormField
                      control={form.control}
                      name="talla.calzado"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                          <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Calzado</FormLabel>
                          <FormControl>
                            <AutocompleteWithLoading
                              options={configurationData.tallasOptions.filter(t => t.value.includes('calzado'))}
                              value={field.value || ''}
                              onValueChange={field.onChange}
                              placeholder="Seleccionar talla de calzado..."
                              isLoading={configurationData.tallasLoading}
                              error={configurationData.tallasError}
                              emptyText="No hay tallas de calzado disponibles"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Sección de Profesión y Celebraciones */}
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-200">
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

                    {/* Motivo */}
                    <FormField
                      control={form.control}
                      name="profesionMotivoFechaCelebrar.motivo"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                          <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Motivo de Celebración</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                              placeholder="Cumpleaños, aniversario, etc."
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Día */}
                    <FormField
                      control={form.control}
                      name="profesionMotivoFechaCelebrar.dia"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                          <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Día</FormLabel>
                          <FormControl>
                            <Input 
                              {...field} 
                              className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                              placeholder="1-31"
                              maxLength={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Mes */}
                    <FormField
                      control={form.control}
                      name="profesionMotivoFechaCelebrar.mes"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-card/50 rounded-xl border border-border dark:bg-card/50 dark:border-border shadow-sm">
                          <FormLabel className="text-foreground dark:text-foreground font-bold text-sm">Mes</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger className="bg-gray-100 border-2 border-gray-400 text-gray-900 rounded-xl focus:bg-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200">
                                <SelectValue placeholder="Seleccionar mes..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-2 border-gray-300">
                              <SelectItem value="1" className="rounded-lg">Enero</SelectItem>
                              <SelectItem value="2" className="rounded-lg">Febrero</SelectItem>
                              <SelectItem value="3" className="rounded-lg">Marzo</SelectItem>
                              <SelectItem value="4" className="rounded-lg">Abril</SelectItem>
                              <SelectItem value="5" className="rounded-lg">Mayo</SelectItem>
                              <SelectItem value="6" className="rounded-lg">Junio</SelectItem>
                              <SelectItem value="7" className="rounded-lg">Julio</SelectItem>
                              <SelectItem value="8" className="rounded-lg">Agosto</SelectItem>
                              <SelectItem value="9" className="rounded-lg">Septiembre</SelectItem>
                              <SelectItem value="10" className="rounded-lg">Octubre</SelectItem>
                              <SelectItem value="11" className="rounded-lg">Noviembre</SelectItem>
                              <SelectItem value="12" className="rounded-lg">Diciembre</SelectItem>
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
                
                <DialogFooter className="p-6 bg-muted/30 rounded-b-2xl border-t border-border dark:bg-muted/30 dark:border-border">
                  <Button 
                    type="button"
                    variant="outline" 
                    onClick={resetForm} 
                    className="rounded-xl border-2 border-border hover:border-border hover:bg-muted/20 dark:bg-muted/20 transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-primary hover:bg-primary/90 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting 
                      ? 'Guardando...' 
                      : editingFamilyMember ? 'Actualizar' : 'Agregar'
                    }
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de miembros familiares */}
      {familyMembers.length > 0 ? (
        <div className="border-2 border-gray-400 rounded-2xl overflow-hidden shadow-lg bg-white">
          <Table>
            <TableHeader className="bg-gradient-to-r from-blue-100 to-purple-100">
              <TableRow className="border-b-2 border-gray-300">
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Nombres</TableHead>
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Fecha Nac.</TableHead>
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Tipo ID</TableHead>
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Sexo</TableHead>
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Parentesco</TableHead>
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Estado Civil</TableHead>
                <TableHead className="font-bold text-gray-900 p-4 text-sm">Estudio</TableHead>
                <TableHead className="font-bold text-gray-900 text-center p-4 text-sm">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {familyMembers.map((member, index) => (
                <TableRow 
                  key={member.id} 
                  className={`hover:bg-blue-50 transition-colors duration-200 border-b border-gray-200 ${
                    index % 2 === 0 ? 'bg-muted/20 dark:bg-muted/20' : 'bg-white'
                  }`}
                >
                  <TableCell className="font-medium p-4 text-foreground dark:text-foreground">{member.nombres}</TableCell>
                  <TableCell className="p-4 text-gray-700 text-sm">
                    {member.fechaNacimiento 
                      ? format(member.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                      : 'No especificado'
                    }
                  </TableCell>
                  <TableCell className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                      {member.tipoIdentificacion || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                      member.sexo === 'Hombre' 
                        ? 'bg-blue-100 text-blue-800 border-blue-300' 
                        : 'bg-pink-100 text-pink-800 border-pink-300'
                    }`}>
                      {member.sexo || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="p-4 text-gray-700 text-sm">{member.parentesco || 'No especificado'}</TableCell>
                  <TableCell className="p-4 text-gray-700 text-sm">{member.situacionCivil || 'No especificado'}</TableCell>
                  <TableCell className="p-4">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300">
                      {member.estudio || 'N/A'}
                    </span>
                  </TableCell>
                  <TableCell className="p-4">
                    <div className="flex gap-2 justify-center">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(member)}
                        className="hover:bg-blue-50 hover:border-blue-300 rounded-xl border-2 transition-all duration-200"
                      >
                        Editar
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(member.id)}
                        className="hover:bg-red-600 rounded-xl transition-all duration-200"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <Card className="border-dashed border-2 border-border dark:border-border rounded-2xl">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500 mb-4 font-medium">No hay miembros familiares agregados</p>
            <Button 
              variant="outline" 
              onClick={() => setShowFamilyDialog(true)}
              className="flex items-center gap-2 border-2 border-gray-300 hover:border-blue-400 rounded-xl transition-all duration-200"
            >
              <Plus className="w-4 h-4" />
              Agregar primer miembro
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default FamilyGrid;
