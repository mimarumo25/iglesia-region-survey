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
import { useHierarchicalConfiguration } from "@/hooks/useHierarchicalConfiguration";
import { AutocompleteWithLoading } from "@/components/ui/autocomplete-with-loading";

// Definición de las etapas del formulario con soporte jerárquico
const formStages: FormStage[] = [
  {
    id: 1,
    title: "Información General",
    description: "Datos básicos del hogar y ubicación",
    fields: [
      { id: "municipio", label: "Municipio", type: "hierarchical", required: true, configKey: "municipioOptions" },
      { id: "parroquia", label: "Parroquia", type: "hierarchical", required: false, configKey: "parroquiaOptions", dependsOn: "municipio" },
      { id: "sector", label: "Sector", type: "hierarchical", required: false, configKey: "sectorOptions", dependsOn: "municipio" },
      { id: "vereda", label: "Vereda", type: "hierarchical", required: false, configKey: "veredaOptions", dependsOn: "municipio" },
      { id: "fecha", label: "Fecha", type: "date", required: true },
      { id: "apellido_familiar", label: "Apellido Familiar", type: "text", required: true },
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
      { id: "basuras_recolector", label: "Basuras - Carro Recolector", type: "boolean", required: false },
      { id: "basuras_quemada", label: "Basuras - Quemada al aire", type: "boolean", required: false },
      { id: "basuras_enterrada", label: "Basuras - Enterrada", type: "boolean", required: false },
      { id: "basuras_recicla", label: "¿Recicla?", type: "boolean", required: false },
      { id: "basuras_aire_libre", label: "Basuras - Al aire libre", type: "boolean", required: false },
      { id: "basuras_no_aplica", label: "Basuras - No aplica", type: "boolean", required: false }
    ]
  },
  {
    id: 3,
    title: "Acueducto y Aguas Residuales",
    description: "Servicios de agua y saneamiento",
    fields: [
      { id: "acueducto", label: "Acueducto", type: "boolean", required: false },
      { id: "aguas_residuales", label: "Aguas Residuales", type: "autocomplete", required: false, configKey: "aguasResidualesOptions" },
      { id: "pozo_septico", label: "Pozo Séptico", type: "boolean", required: false },
      { id: "letrina", label: "Letrina", type: "boolean", required: false },
      { id: "campo_abierto", label: "Campo Abierto", type: "boolean", required: false }
    ]
  },
  {
    id: 4,
    title: "Miembros de la Familia",
    description: "Registro de los miembros del hogar",
    fields: []
  },
  {
    id: 5,
    title: "Fallecidos en la Familia",
    description: "Registro de fallecidos en la familia",
    fields: []
  }
];

interface SurveyFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
  mode?: 'create' | 'edit';
}

const SurveyFormWithHierarchy: React.FC<SurveyFormProps> = ({ 
  onSubmit, 
  initialData = {}, 
  mode = 'create' 
}) => {
  // Estados del formulario
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState(initialData);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>(initialData.family_members || []);
  const [deceasedMembers, setDeceasedMembers] = useState<DeceasedFamilyMember[]>(initialData.deceased_members || []);
  const [isLoading, setIsLoading] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { toast } = useToast();
  
  // Configuración jerárquica
  const {
    selectedMunicipio,
    setSelectedMunicipio,
    municipiosOptions,
    parroquiasOptions,
    sectoresOptions,
    veredasOptions,
    isLoadingMunicipios,
    isLoadingParroquias,
    isLoadingSectores,
    isLoadingVeredas,
  } = useHierarchicalConfiguration();

  // Configuración general (para otros campos)
  const { configurationData } = useConfigurationData();

  // Sincronizar selección de municipio
  useEffect(() => {
    if (formData.municipio) {
      setSelectedMunicipio(formData.municipio);
    }
  }, [formData.municipio, setSelectedMunicipio]);

  // Limpiar campos dependientes cuando cambia el municipio
  useEffect(() => {
    if (selectedMunicipio !== formData.municipio) {
      setFormData(prev => ({
        ...prev,
        parroquia: '',
        sector: '',
        vereda: ''
      }));
    }
  }, [selectedMunicipio, formData.municipio]);

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const renderHierarchicalField = (field: FormFieldType) => {
    const getOptionsAndLoading = () => {
      switch (field.configKey) {
        case 'municipioOptions':
          return { options: municipiosOptions, isLoading: isLoadingMunicipios };
        case 'parroquiaOptions':
          return { options: parroquiasOptions, isLoading: isLoadingParroquias };
        case 'sectorOptions':
          return { options: sectoresOptions, isLoading: isLoadingSectores };
        case 'veredaOptions':
          return { options: veredasOptions, isLoading: isLoadingVeredas };
        default:
          return { options: [], isLoading: false };
      }
    };

    const { options, isLoading } = getOptionsAndLoading();
    const isDependentField = field.dependsOn === 'municipio';
    const isDisabled = isDependentField && !selectedMunicipio;

    return (
      <div className="space-y-2" key={field.id}>
        <label className="text-sm font-medium">
          {field.label} {field.required && <span className="text-red-500">*</span>}
        </label>
        <AutocompleteWithLoading
          options={options}
          value={formData[field.id] || ''}
          onValueChange={(value) => handleFieldChange(field.id, value)}
          placeholder={
            isDisabled 
              ? "Primero selecciona un municipio" 
              : `Selecciona ${field.label.toLowerCase()}...`
          }
          isLoading={isLoading}
          disabled={isDisabled || isLoading}
          emptyText={
            isDisabled 
              ? "Selecciona un municipio primero" 
              : `No hay ${field.label.toLowerCase()}s disponibles`
          }
        />
      </div>
    );
  };

  const renderField = (field: FormFieldType) => {
    if (field.type === 'hierarchical') {
      return renderHierarchicalField(field);
    }

    if (field.type === 'autocomplete' && field.configKey) {
      return (
        <EnhancedFormField
          key={field.id}
          field={field}
          value={formData[field.id]}
          onChange={(value) => handleFieldChange(field.id, value)}
          configurationData={configurationData}
        />
      );
    }

    return (
      <FormField
        key={field.id}
        field={field}
        value={formData[field.id]}
        onChange={(value) => handleFieldChange(field.id, value)}
      />
    );
  };

  const getCurrentStageData = () => {
    return formStages.find(stage => stage.id === currentStage);
  };

  const handleNext = () => {
    if (currentStage < formStages.length) {
      setCurrentStage(currentStage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStage > 1) {
      setCurrentStage(currentStage - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        family_members: familyMembers,
        deceased_members: deceasedMembers,
        created_at: new Date().toISOString(),
        stage: 'completed'
      };

      if (onSubmit) {
        await onSubmit(submitData);
      }

      toast({
        title: "Éxito",
        description: "Encuesta guardada correctamente",
      });
    } catch (error) {
      console.error('Error al guardar:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar la encuesta",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const currentStageData = getCurrentStageData();

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <SurveyHeader 
        currentStage={currentStage}
        totalStages={formStages.length}
        stageTitle={currentStageData?.title || ""}
        stageDescription={currentStageData?.description || ""}
      />

      <Card>
        <CardHeader>
          <CardTitle>{currentStageData?.title}</CardTitle>
          <CardDescription>{currentStageData?.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Renderizar campos de la etapa actual */}
          {currentStageData?.fields && currentStageData.fields.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {currentStageData.fields.map(renderField)}
            </div>
          )}

          {/* Etapa de miembros de familia */}
          {currentStage === 4 && (
            <FamilyGrid
              familyMembers={familyMembers}
              onFamilyMembersChange={setFamilyMembers}
              configurationData={configurationData}
            />
          )}

          {/* Etapa de fallecidos */}
          {currentStage === 5 && (
            <DeceasedGrid
              deceasedMembers={deceasedMembers}
              onDeceasedMembersChange={setDeceasedMembers}
              configurationData={configurationData}
            />
          )}
        </CardContent>
      </Card>

      <SurveyControls
        currentStage={currentStage}
        totalStages={formStages.length}
        onPrevious={handlePrevious}
        onNext={handleNext}
        onSubmit={handleSubmit}
        isLoading={isLoading}
        canProceed={true} // Puedes agregar validación aquí
      />

    </div>
  );
};

export default SurveyFormWithHierarchy;
