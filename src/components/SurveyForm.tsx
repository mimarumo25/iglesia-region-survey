import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, FileDown, Loader2, Send } from "lucide-react";
import SurveyHeader from "./survey/SurveyHeader";
import StandardFormField from "./survey/StandardFormField";
import FamilyGrid from "./survey/FamilyGrid";
import DeceasedGrid from "./survey/DeceasedGrid";
import SurveyControls from "./survey/SurveyControls";
import { FamilyMember, DeceasedFamilyMember, FormStage } from "@/types/survey";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { getAutocompleteOptions, getLoadingState, getErrorState } from "@/utils/formFieldHelpers";
import { transformFormDataToSurveySession, saveSurveyToLocalStorage } from "@/utils/sessionDataTransformer";
import { SurveySubmissionService } from "@/services/surveySubmission";
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
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([]);
  const [deceasedMembers, setDeceasedMembers] = useState<DeceasedFamilyMember[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
      
      // **ENVÍO AL SERVIDOR USANDO LA NUEVA ESTRUCTURA**
      const response = await SurveySubmissionService.submitSurvey(structuredSurveyData);
      
      if (response.success) {
        
        // Limpiar todos los borradores tras envío exitoso
        SurveySubmissionService.clearStorageAfterSubmission();
        
        toast({
          title: "✅ Encuesta enviada al servidor",
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

  // Función adicional para enviar desde localStorage
  const handleSubmitFromStorage = async () => {
    setIsSubmitting(true);
    
    try {
      const response = await SurveySubmissionService.submitSurveyFromStorage('parish-survey-completed');
      
      if (response.success) {
        // El storage ya fue limpiado automáticamente por submitSurveyFromStorage
        toast({
          title: "✅ Datos enviados",
          description: response.message || "Los datos almacenados se enviaron correctamente.",
          variant: "default"
        });
        
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      } else {
        toast({
          title: "❌ Error en el envío",
          description: response.message || "No se pudieron enviar los datos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "❌ Error inesperado", 
        description: "Problema al procesar los datos almacenados.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExportData = () => {
    const surveyData = {
      informacionGeneral: formData,
      familyMembers: familyMembers,
      deceasedMembers: deceasedMembers,
      timestamp: new Date().toISOString(),
      exported: true
    };

    const dataStr = JSON.stringify(surveyData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `encuesta-parroquial-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Datos exportados",
      description: "Los datos se han descargado en formato JSON",
    });
  };

  if (!currentStageData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 bg-background dark:bg-background min-h-screen">
      {/* Header con progreso usando componente refactorizado */}
      <SurveyHeader 
        title="Caracterización Poblacional"
        description={`Etapa ${currentStage} de ${formStages.length}: ${currentStageData.title}`}
        progress={progress}
        currentStage={currentStage}
        formStages={formStages}
      />

      {/* Indicador de carga de servicios */}
      {configurationData.isAnyLoading && (
        <Card className="mb-6 border-warning/20 bg-warning/10 dark:bg-warning/10 dark:border-warning/20">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-warning-foreground">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium">Cargando datos de configuración...</span>
              <div className="flex items-center gap-2 text-xs">
                {configurationData.sectoresLoading && <span className="bg-warning/20 text-warning-foreground px-2 py-1 rounded">Sectores</span>}
                {configurationData.parroquiasLoading && <span className="bg-warning/20 text-warning-foreground px-2 py-1 rounded">Parroquias</span>}
                {configurationData.municipiosLoading && <span className="bg-warning/20 text-warning-foreground px-2 py-1 rounded">Municipios</span>}
                {configurationData.tiposViviendaLoading && <span className="bg-warning/20 text-warning-foreground px-2 py-1 rounded">Tipos de Vivienda</span>}
                {configurationData.disposicionBasuraLoading && <span className="bg-warning/20 text-warning-foreground px-2 py-1 rounded">Disposición de Basura</span>}
                {configurationData.aguasResidualesLoading && <span className="bg-warning/20 text-warning-foreground px-2 py-1 rounded">Aguas Residuales</span>}
              </div>
            </div>
          </CardContent>
        </Card>
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
        onExport={handleExportData}
        onSubmitFromStorage={handleSubmitFromStorage}
      />

      {/* Storage debugger component was removed during cleanup */}
    </div>
  );
};

export default SurveyForm;