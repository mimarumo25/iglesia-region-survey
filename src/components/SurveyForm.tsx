import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, FileDown, Loader2 } from "lucide-react";
import SurveyHeader from "./survey/SurveyHeader";
import FormField from "./survey/FormField";
import EnhancedFormField from "./survey/EnhancedFormField";
import FamilyGrid from "./survey/FamilyGrid";
import DeceasedGrid from "./survey/DeceasedGrid";
import SurveyControls from "./survey/SurveyControls";
import { FamilyMember, DeceasedFamilyMember, FormField as FormFieldType, FormStage } from "@/types/survey";
import { useConfigurationData } from "@/hooks/useConfigurationData";

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

  // Auto-guardado cuando cambia la etapa
  useEffect(() => {
    if (Object.keys(formData).length > 0 || familyMembers.length > 0 || deceasedMembers.length > 0) {
      localStorage.setItem('parish-survey-draft', JSON.stringify({
        stage: currentStage,
        data: formData,
        familyMembers: familyMembers,
        deceasedMembers: deceasedMembers,
        timestamp: new Date().toISOString()
      }));
    }
  }, [currentStage, formData, familyMembers, deceasedMembers]);

  // Cargar borrador al iniciar
  useEffect(() => {
    const draft = localStorage.getItem('parish-survey-draft');
    if (draft) {
      const { stage, data, familyMembers: savedFamilyMembers, deceasedMembers: savedDeceasedMembers } = JSON.parse(draft);
      setCurrentStage(stage);
      setFormData(data);
      if (savedFamilyMembers) {
        setFamilyMembers(savedFamilyMembers);
      }
      if (savedDeceasedMembers) {
        setDeceasedMembers(savedDeceasedMembers);
      }
      toast({
        title: "Borrador recuperado",
        description: "Se ha recuperado un borrador guardado anteriormente.",
      });
    }
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
      // Crear objeto con todos los datos de la encuesta
      const surveyData = {
        informacionGeneral: formData,
        familyMembers: familyMembers,
        deceasedMembers: deceasedMembers,
        timestamp: new Date().toISOString(),
        completed: true
      };

      // Aquí puedes agregar la lógica para enviar a tu API
      
      // Simular envío a servidor
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Limpiar borrador
      localStorage.removeItem('parish-survey-draft');
      
      toast({
        title: "Encuesta completada",
        description: "La encuesta ha sido enviada exitosamente.",
        variant: "default"
      });

      // Aquí puedes redirigir al dashboard o mostrar página de confirmación
      // window.location.href = '/dashboard';
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al enviar la encuesta. Inténtelo nuevamente.",
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
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8 bg-gray-50 min-h-screen">
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
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3 text-sm text-amber-800">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="font-medium">Cargando datos de configuración...</span>
              <div className="flex items-center gap-2 text-xs">
                {configurationData.sectoresLoading && <span className="bg-amber-200 px-2 py-1 rounded">Sectores</span>}
                {configurationData.parroquiasLoading && <span className="bg-amber-200 px-2 py-1 rounded">Parroquias</span>}
                {configurationData.municipiosLoading && <span className="bg-amber-200 px-2 py-1 rounded">Municipios</span>}
                {configurationData.tiposViviendaLoading && <span className="bg-amber-200 px-2 py-1 rounded">Tipos de Vivienda</span>}
                {configurationData.disposicionBasuraLoading && <span className="bg-amber-200 px-2 py-1 rounded">Disposición de Basura</span>}
                {configurationData.aguasResidualesLoading && <span className="bg-amber-200 px-2 py-1 rounded">Aguas Residuales</span>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Formulario actual con Tailwind CSS */}
      <Card className="shadow-lg border-gray-200 rounded-xl bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-xl border-b border-gray-200">
          <CardTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {currentStage}
            </div>
            <span className="text-2xl font-bold text-gray-800">{currentStageData.title}</span>
          </CardTitle>
          <CardDescription className="text-base text-gray-600 pl-14 font-medium">
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
            currentStageData.fields?.map((field) => {
              // Función helper para obtener las opciones de autocomplete
              const getAutocompleteOptions = (field: FormFieldType) => {
                if ((field.type !== 'autocomplete' && field.type !== 'multiple-checkbox') || !field.configKey) return [];
                
                // Mapear configKey a las opciones del hook de configuración
                switch (field.configKey) {
                  case 'sectorOptions':
                    return configurationData.sectorOptions;
                  case 'parroquiaOptions':
                    return configurationData.parroquiaOptions;
                  case 'municipioOptions':
                    return configurationData.municipioOptions;
                  case 'veredaOptions':
                    return configurationData.veredaOptions;
                  case 'tipoViviendaOptions':
                    return configurationData.tipoViviendaOptions;
                  case 'disposicionBasuraOptions':
                    return configurationData.disposicionBasuraOptions;
                  case 'aguasResidualesOptions':
                    return configurationData.aguasResidualesOptions;
                  case 'sistemasAcueductoOptions':
                    return configurationData.sistemasAcueductoOptions;
                  case 'estadoCivilOptions':
                    return configurationData.estadoCivilOptions;
                  case 'sexoOptions':
                    return configurationData.sexoOptions;
                  case 'userOptions':
                    return configurationData.userOptions;
                  default:
                    return [];
                }
              };

              // Función helper para obtener el estado de loading
              const getLoadingState = (field: FormFieldType) => {
                if ((field.type !== 'autocomplete' && field.type !== 'multiple-checkbox') || !field.configKey) return false;
                
                switch (field.configKey) {
                  case 'sectorOptions':
                    return configurationData.sectoresLoading;
                  case 'parroquiaOptions':
                    return configurationData.parroquiasLoading;
                  case 'municipioOptions':
                    return configurationData.municipiosLoading;
                  case 'veredaOptions':
                    return configurationData.veredasLoading;
                  case 'tipoViviendaOptions':
                    return configurationData.tiposViviendaLoading;
                  case 'disposicionBasuraOptions':
                    return configurationData.disposicionBasuraLoading;
                  case 'aguasResidualesOptions':
                    return configurationData.aguasResidualesLoading;
                  case 'sistemasAcueductoOptions':
                    return configurationData.sistemasAcueductoLoading;
                  case 'estadoCivilOptions':
                    return configurationData.estadosCivilesLoading;
                  case 'sexoOptions':
                    return configurationData.sexosLoading;
                  case 'userOptions':
                    return configurationData.usersLoading;
                  default:
                    return false;
                }
              };

              // Función helper para obtener el estado de error
              const getErrorState = (field: FormFieldType) => {
                if ((field.type !== 'autocomplete' && field.type !== 'multiple-checkbox') || !field.configKey) return null;
                
                switch (field.configKey) {
                  case 'sectorOptions':
                    return configurationData.sectoresError;
                  case 'parroquiaOptions':
                    return configurationData.parroquiasError;
                  case 'municipioOptions':
                    return configurationData.municipiosError;
                  case 'veredaOptions':
                    return configurationData.veredasError;
                  case 'tipoViviendaOptions':
                    return configurationData.tiposViviendaError;
                  case 'disposicionBasuraOptions':
                    return configurationData.disposicionBasuraError;
                  case 'aguasResidualesOptions':
                    return configurationData.aguasResidualesError;
                  case 'sistemasAcueductoOptions':
                    return configurationData.sistemasAcueductoError;
                  case 'estadoCivilOptions':
                    return configurationData.estadosCivilesError;
                  case 'sexoOptions':
                    return configurationData.sexosError;
                  case 'userOptions':
                    return configurationData.usersError;
                  default:
                    return null;
                }
              };

              return (
                <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                  {field.type === 'autocomplete' || field.type === 'multiple-checkbox' ? (
                    <EnhancedFormField
                      field={field}
                      value={formData[field.id]}
                      onChange={handleFieldChange}
                      autocompleteOptions={getAutocompleteOptions(field)}
                      isLoading={getLoadingState(field)}
                      error={getErrorState(field)}
                    />
                  ) : (
                    <FormField
                      field={field}
                      value={formData[field.id]}
                      onChange={handleFieldChange}
                    />
                  )}
                </div>
              );
            })
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
      />
    </div>
  );
};

export default SurveyForm;