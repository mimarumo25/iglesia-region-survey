import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSkeleton, SurveyFormSkeleton } from "@/components/ui/loading-skeleton";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Trash2, X, ArrowLeft } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import SurveyHeader from "./survey/SurveyHeader";
import StandardFormField from "./survey/StandardFormField";
import FamilyGrid from "./survey/FamilyGrid";
import DeceasedGrid from "./survey/DeceasedGrid";
import SurveyControls from "./survey/SurveyControls";
import FormDataLoadingError from "./survey/FormDataLoadingError";
import { FamilyMember, DeceasedFamilyMember, FormStage } from "@/types/survey";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { getAutocompleteOptions, getLoadingState, getErrorState } from "@/utils/formFieldHelpers";
import { transformFormDataToSurveySession, saveSurveyToLocalStorage } from "@/utils/sessionDataTransformer";
import { SurveySubmissionService } from "@/services/surveySubmission";
import { encuestasService } from "@/services/encuestas";
// Removed storage debugger import - component was cleaned up

// Definición de las etapas del formulario basado en la encuesta parroquial
const formStages: FormStage[] = [
  {
    id: 1,
    title: "Información General",
    description: "Datos básicos del hogar y ubicación",
    fields: [
      { id: "municipio", label: "Municipio", type: "autocomplete", required: true, configKey: "municipioOptions" },
      { id: "parroquia", label: "Parroquia", type: "autocomplete", required: true, configKey: "parroquiaOptions" },
      { id: "fecha", label: "Fecha", type: "date", required: true },
      { id: "apellido_familiar", label: "Apellido Familiar", type: "text", required: true },
      { id: "vereda", label: "Vereda", type: "autocomplete", required: false, configKey: "veredaOptions" },
      { id: "sector", label: "Sector", type: "autocomplete", required: true, configKey: "sectorOptions" },
      { id: "direccion", label: "Dirección", type: "text", required: true },
      { id: "telefono", label: "Teléfono", type: "text", required: false },
      { id: "numero_contrato_epm", label: "Número Contrato EPM", type: "text", required: false }
    ]
  },
  {
    id: 2,
    title: "Información de Vivienda y Basuras",
    description: "Características de la vivienda y manejo de basuras",
    fields: [
      { id: "tipo_vivienda", label: "Tipo de Vivienda", type: "autocomplete", required: true, configKey: "tipoViviendaOptions" },
      { id: "disposicion_basura", label: "Tipos de Disposición de Basura", type: "multiple-checkbox", required: false, configKey: "disposicionBasuraOptions" }
    ]
  },
  {
    id: 3,
    title: "Acueducto y Aguas Residuales",
    description: "Servicios de agua y saneamiento - Selecciona las opciones que apliquen",
    fields: [
      { id: "sistema_acueducto", label: "Sistema de Acueducto", type: "autocomplete", required: false, configKey: "sistemasAcueductoOptions" },
      { id: "aguas_residuales", label: "Tipos de Aguas Residuales", type: "multiple-checkbox", required: false, configKey: "aguasResidualesOptions" }
    ]
  },
  {
    id: 4,
    title: "Información Familiar",
    description: "Integrantes del núcleo familiar con información completa",
    type: "family_grid"
  },
  {
    id: 5,
    title: "Difuntos de la Familia",
    description: "Información sobre familiares difuntos y fechas de aniversario",
    type: "deceased_grid"
  },
  {
    id: 6,
    title: "Observaciones y Consentimiento",
    description: "Observaciones finales y autorización de datos",
    fields: [
      { id: "sustento_familia", label: "Sustento de la Familia", type: "textarea", required: false },
      { id: "observaciones_encuestador", label: "Observaciones del Encuestador", type: "textarea", required: false },
      { id: "autorizacion_datos", label: "Autorizo el tratamiento de mis datos personales para vincularme a la parroquia y recibir notificaciones de interés", type: "boolean", required: true }
    ]
  }
];

const SurveyForm = () => {
  const navigate = useNavigate();
  const { id: surveyId } = useParams<{ id: string }>(); // Detectar ID de la URL para modo edición
  
  // DEBUG: Verificar que el componente se está renderizando
  console.log('🔍 SurveyForm montado - ID de URL:', surveyId);
  
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [deceasedMembers, setDeceasedMembers] = useState<DeceasedFamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false); // Indica si estamos editando
  const [isLoadingEncuesta, setIsLoadingEncuesta] = useState(false); // Loading de carga de encuesta
  const { toast } = useToast();

  // Hook para cargar datos de configuración
  const configurationData = useConfigurationData();

  const currentStageData = formStages.find(stage => stage.id === currentStage);
  const progress = (currentStage / formStages.length) * 100;

  // Auto-guardado cuando cambia la etapa (solo nueva estructura)
  useEffect(() => {
    if (Object.keys(formData).length > 0 || familyMembers.length > 0 || deceasedMembers.length > 0) {
      // Crear estructura de borrador con datos organizados
      const draftStructuredData = transformFormDataToSurveySession(
        formData,
        familyMembers,
        deceasedMembers,
        configurationData
      );
      
      // Actualizar metadata del borrador
      draftStructuredData.metadata.completed = false;
      draftStructuredData.metadata.currentStage = currentStage;
      
      // Guardar borrador solo con nueva estructura
      saveSurveyToLocalStorage(draftStructuredData, 'parish-survey-draft');
    }
  }, [currentStage, formData, familyMembers, deceasedMembers, configurationData]);

  // Cargar borrador al iniciar (nueva estructura)
  useEffect(() => {
    const draft = localStorage.getItem('parish-survey-draft');
    if (draft) {
      try {
        const draftData = JSON.parse(draft);
        
        // Verificar si es la nueva estructura (tiene metadata y versión)
        if (draftData.metadata && draftData.informacionGeneral) {
          // Nueva estructura SurveySessionData
          setCurrentStage(draftData.metadata.currentStage || 1);
          
          // Convertir la estructura nueva de vuelta al formato del formulario actual
          const legacyFormData: Record<string, any> = {
            municipio: draftData.informacionGeneral.municipio?.id || '',
            parroquia: draftData.informacionGeneral.parroquia?.id || '',
            sector: draftData.informacionGeneral.sector?.id || '',
            vereda: draftData.informacionGeneral.vereda?.id || '',
            fecha: draftData.informacionGeneral.fecha,
            apellido_familiar: draftData.informacionGeneral.apellido_familiar,
            direccion: draftData.informacionGeneral.direccion,
            telefono: draftData.informacionGeneral.telefono,
            numero_contrato_epm: draftData.informacionGeneral.numero_contrato_epm,
            tipo_vivienda: draftData.vivienda.tipo_vivienda?.id || '',
            basuras_recolector: draftData.vivienda.disposicion_basuras.recolector,
            basuras_quemada: draftData.vivienda.disposicion_basuras.quemada,
            basuras_enterrada: draftData.vivienda.disposicion_basuras.enterrada,
            basuras_recicla: draftData.vivienda.disposicion_basuras.recicla,
            basuras_aire_libre: draftData.vivienda.disposicion_basuras.aire_libre,
            basuras_no_aplica: draftData.vivienda.disposicion_basuras.no_aplica,
            sistema_acueducto: draftData.servicios_agua.sistema_acueducto?.id || '',
            aguas_residuales: draftData.servicios_agua.aguas_residuales?.id || '',
            pozo_septico: draftData.servicios_agua.pozo_septico,
            letrina: draftData.servicios_agua.letrina,
            campo_abierto: draftData.servicios_agua.campo_abierto,
            sustento_familia: draftData.observaciones.sustento_familia,
            observaciones_encuestador: draftData.observaciones.observaciones_encuestador,
            autorizacion_datos: draftData.observaciones.autorizacion_datos,
          };
          
          setFormData(legacyFormData);
          setFamilyMembers(draftData.familyMembers || []);
          setDeceasedMembers(draftData.deceasedMembers || []);
        } else {
          // Estructura legacy (por compatibilidad temporal)
          const { stage, data, familyMembers: savedFamilyMembers, deceasedMembers: savedDeceasedMembers } = draftData;
          setCurrentStage(stage);
          setFormData(data);
          if (savedFamilyMembers) {
            setFamilyMembers(savedFamilyMembers);
          }
          if (savedDeceasedMembers) {
            setDeceasedMembers(savedDeceasedMembers);
          }
        }

        toast({
          title: "Borrador recuperado",
          description: "Se ha recuperado un borrador guardado anteriormente.",
        });
      } catch (error) {
        console.error('Error al cargar borrador:', error);
        // Si hay error, limpiar el borrador corrupto
        localStorage.removeItem('parish-survey-draft');
      }
    }
  }, []);

  // Cargar encuesta existente si estamos en modo edición
  useEffect(() => {
    const loadEncuestaForEdit = async () => {
      if (!surveyId) {
        setIsEditMode(false);
        return;
      }

      setIsEditMode(true);
      setIsLoadingEncuesta(true);

      try {
        console.log(`📝 Cargando encuesta ${surveyId} para editar...`);
        const response = await encuestasService.getEncuestaById(surveyId);
        
        if (!response.data) {
          throw new Error('No se encontraron datos de la encuesta');
        }

        const encuesta = response.data;
        console.log('✅ Encuesta cargada:', encuesta);

        // TODO: Transformar los datos de la API al formato del formulario
        // Por ahora, mostrar un toast indicando que la funcionalidad está en desarrollo
        toast({
          title: "⚠️ Funcionalidad en desarrollo",
          description: `Encuesta ${surveyId} cargada. La edición completa se implementará próximamente.`,
          variant: "default"
        });

        // Mapear datos de la API al formData local
        // Esta transformación dependerá del formato exacto de la API
        // setFormData({ ... })
        // setFamilyMembers(encuesta.miembros_familia || [])
        // setDeceasedMembers(encuesta.deceasedMembers || [])

      } catch (error: any) {
        console.error('❌ Error al cargar encuesta para editar:', error);
        toast({
          title: "Error al cargar encuesta",
          description: error.message || "No se pudo cargar la encuesta para editar",
          variant: "destructive"
        });
        
        // Redirigir al listado si no se puede cargar
        setTimeout(() => navigate('/surveys'), 2000);
      } finally {
        setIsLoadingEncuesta(false);
      }
    };

    loadEncuestaForEdit();
  }, [surveyId]); // Solo ejecutar cuando cambia surveyId

  // Asegurar que el campo 'fecha' siempre tenga la fecha actual
  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      fecha: new Date()
    }));
  }, []);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  // Función para limpiar borrador del localStorage
  const handleClearDraft = () => {
    try {
      // Limpiar borrador del localStorage
      localStorage.removeItem('parish-survey-draft');
      
      // Resetear estado del formulario
      setFormData({});
      setFamilyMembers([]);
      setDeceasedMembers([]);
      setCurrentStage(1);
      
      // Establecer fecha actual nuevamente
      setTimeout(() => {
        setFormData(prev => ({
          ...prev,
          fecha: new Date()
        }));
      }, 0);

      toast({
        title: "✅ Borrador eliminado",
        description: "El borrador ha sido eliminado completamente del almacenamiento local.",
        variant: "default"
      });

      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Error al limpiar borrador:', error);
      toast({
        title: "❌ Error",
        description: "No se pudo eliminar el borrador del almacenamiento local.",
        variant: "destructive"
      });
    }
  };

  // Función para cancelar la edición y regresar al listado
  const handleCancelEdit = () => {
    toast({
      title: "Edición cancelada",
      description: "Los cambios no guardados se han descartado.",
      variant: "default"
    });
    
    // Redirigir al listado de encuestas
    navigate('/surveys');
  };

  const handleNext = () => {
    // Validar campos requeridos de la etapa actual
    if (currentStageData?.fields) {
      const requiredFields = currentStageData.fields.filter(field => field.required);
      const missingFields = requiredFields.filter(field => {
        const value = formData[field.id];
        // Validación mejorada para manejar strings, dates y otros tipos
        if (field.type === 'date') {
          return !value || (!(value instanceof Date) && (!value || value.toString().trim() === ''));
        }
        return !value || (typeof value === 'string' && value.trim() === '');
      });

      if (missingFields.length > 0) {
        toast({
          title: "Campos requeridos",
          description: `Por favor complete: ${missingFields.map(f => f.label).join(', ')}`,
          variant: "destructive"
        });
        return;
      }
    }

    // Validar etapa de información familiar
    if (currentStage === 4 && familyMembers.length === 0) {
      toast({
        title: "Información familiar requerida",
        description: "Debe agregar al menos un miembro de la familia",
        variant: "destructive"
      });
      return;
    }

    if (currentStage < formStages.length) {
      setCurrentStage(currentStage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Transformar datos del formulario actual a estructura organizada por sesiones
      const structuredSurveyData = transformFormDataToSurveySession(
        formData,
        familyMembers,
        deceasedMembers,
        configurationData
      );

      // Marcar como completado
      structuredSurveyData.metadata.completed = true;
      structuredSurveyData.metadata.currentStage = formStages.length;

      // Guardar con nueva estructura en localStorage antes del envío
      saveSurveyToLocalStorage(structuredSurveyData, 'parish-survey-completed');
      
      // **DECIDIR SI CREAR O ACTUALIZAR SEGÚN EL MODO**
      let response;
      if (isEditMode && surveyId) {
        // Modo edición - actualizar encuesta existente
        console.log('📝 Actualizando encuesta existente:', surveyId);
        response = await SurveySubmissionService.updateSurvey(surveyId, structuredSurveyData);
      } else {
        // Modo creación - crear nueva encuesta
        console.log('📝 Creando nueva encuesta');
        response = await SurveySubmissionService.submitSurvey(structuredSurveyData);
      }
      
      if (response.success) {
        
        // Limpiar todos los borradores tras envío exitoso
        SurveySubmissionService.clearStorageAfterSubmission();
        
        toast({
          title: isEditMode ? "✅ Encuesta actualizada" : "✅ Encuesta enviada al servidor",
          description: `${response.message} ${response.surveyId ? `(ID: ${response.surveyId})` : ''}`,
          variant: "default"
        });

        // Redirigir al dashboard después de un momento
        setTimeout(() => {
          navigate('/dashboard');
        }, 3000);
        
      } else {
        console.error('❌ Error en el envío:', response);
        
        toast({
          title: "❌ Error al enviar al servidor",
          description: response.message + " - Los datos se guardaron localmente.",
          variant: "destructive"
        });
      }
      
    } catch (error) {
      console.error('❌ Error inesperado durante el envío:', error);
      toast({
        title: "❌ Error inesperado",
        description: "Hubo un problema durante el envío. Los datos se guardaron localmente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!currentStageData) return null;

  // Mostrar skeleton completo mientras cargan los datos de configuración o la encuesta para editar
  if (configurationData.isAnyLoading || isLoadingEncuesta) {
    return <SurveyFormSkeleton />;
  }

  // Mostrar errores críticos que impiden el uso del formulario
  if (configurationData.hasAnyError) {
    const hasCriticalErrors = !!(
      configurationData.municipiosError || 
      configurationData.parroquiasError || 
      configurationData.sectoresError
    );

    if (hasCriticalErrors) {
      return (
        <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 bg-background min-h-screen">
          <FormDataLoadingError 
            configurationData={configurationData}
            onRetryAll={() => window.location.reload()}
            criticalOnly={false}
          />
        </div>
      );
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 bg-background dark:bg-background min-h-screen">
      {/* Header con progreso usando componente refactorizado */}
      <SurveyHeader 
        title={isEditMode ? `Editar Encuesta #${surveyId}` : "Caracterización Poblacional"}
        description={`Etapa ${currentStage} de ${formStages.length}: ${currentStageData.title}`}
        progress={progress}
        currentStage={currentStage}
        formStages={formStages}
      />

      {/* Botón para limpiar borrador - Solo visible en modo creación */}
      {!isEditMode && (
        <div className="mb-6 flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground transition-all duration-200"
              >
                <Trash2 className="h-4 w-4" />
                Limpiar Borrador
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  ¿Eliminar borrador?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p className="font-semibold">Esta acción eliminará permanentemente:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Todos los datos ingresados en el formulario</li>
                    <li>Información de familia agregada</li>
                    <li>Información de difuntos agregada</li>
                    <li>El progreso actual de la encuesta</li>
                  </ul>
                  <p className="font-bold text-destructive mt-3">
                    ⚠️ Esta acción no se puede deshacer. El borrador no podrá ser recuperado.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleClearDraft}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Sí, eliminar borrador
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}

      {/* Botón para cancelar edición - Solo visible en modo edición */}
      {isEditMode && (
        <div className="mb-6 flex justify-between items-center">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="gap-2 border-muted-foreground text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
              >
                <X className="h-4 w-4" />
                Cancelar Edición
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="flex items-center gap-2">
                  <ArrowLeft className="h-5 w-5 text-muted-foreground" />
                  ¿Cancelar edición?
                </AlertDialogTitle>
                <AlertDialogDescription className="space-y-2">
                  <p className="font-semibold">Si cancelas la edición:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>Los cambios realizados se perderán</li>
                    <li>La encuesta mantendrá sus datos originales</li>
                    <li>Serás redirigido al listado de encuestas</li>
                  </ul>
                  <p className="font-bold text-amber-600 dark:text-amber-500 mt-3">
                    ⚠️ Los cambios no guardados se descartarán.
                  </p>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Continuar editando</AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleCancelEdit}
                  className="bg-muted text-muted-foreground hover:bg-muted/90"
                >
                  Sí, cancelar edición
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span className="font-medium">Editando encuesta #{surveyId}</span>
          </div>
        </div>
      )}

      {/* Mostrar advertencias para errores no críticos */}
      {configurationData.hasAnyError && (
        <FormDataLoadingError 
          configurationData={configurationData}
          onRetryAll={() => window.location.reload()}
          criticalOnly={false}
          className="mb-6"
        />
      )}

      {/* Formulario actual con Tailwind CSS compatible con tema oscuro */}
      <Card className="shadow-lg border-border rounded-xl bg-card dark:bg-card dark:border-border">
        <CardHeader className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-t-xl border-b border-border dark:border-border">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold text-lg shadow-lg">
              {currentStage}
            </div>
            <span className="text-2xl font-bold text-foreground dark:text-foreground">{currentStageData.title}</span>
          </CardTitle>
          <CardDescription className="text-base text-muted-foreground pl-14 font-medium dark:text-muted-foreground">
            {currentStageData.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {currentStageData.type === 'family_grid' ? (
            <FamilyGrid 
              familyMembers={familyMembers}
              setFamilyMembers={setFamilyMembers}
            />
          ) : currentStageData.type === 'deceased_grid' ? (
            <DeceasedGrid 
              deceasedMembers={deceasedMembers}
              setDeceasedMembers={setDeceasedMembers}
            />
          ) : (
            currentStageData.fields?.map((field) => (
              <div key={field.id} className="p-4 bg-muted/50 rounded-xl border border-border hover:border-ring hover:shadow-sm transition-all duration-200 dark:bg-muted/50 dark:border-border dark:hover:border-ring">
                <StandardFormField
                  field={field}
                  value={formData[field.id]}
                  onChange={handleFieldChange}
                  autocompleteOptions={getAutocompleteOptions(field, configurationData)}
                  isLoading={getLoadingState(field, configurationData)}
                  error={getErrorState(field, configurationData)}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {/* Controles de navegación */}
      <SurveyControls 
        currentStage={currentStage}
        totalStages={formStages.length}
        isSubmitting={isSubmitting}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
      />

      {/* Storage debugger component was removed during cleanup */}
    </div>
  );
};

export default SurveyForm;