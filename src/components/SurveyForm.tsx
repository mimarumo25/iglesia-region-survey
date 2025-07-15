import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, FileDown } from "lucide-react";
import SurveyHeader from "./survey/SurveyHeader";
import FormField from "./survey/FormField";
import FamilyGrid from "./survey/FamilyGrid";
import SurveyControls from "./survey/SurveyControls";
import { FamilyMember, FormField as FormFieldType, FormStage } from "@/types/survey";

// Definición de las etapas del formulario basado en la encuesta parroquial
const formStages: FormStage[] = [
  {
    id: 1,
    title: "Información General",
    description: "Datos básicos del hogar y ubicación",
    fields: [
      { id: "parroquia", label: "Parroquia", type: "select", required: true, options: [
        "San Juan Bautista", "Nuestra Señora del Carmen", "Sagrado Corazón", "San José", "Otra"
      ]},
      { id: "municipio", label: "Municipio", type: "text", required: true },
      { id: "fecha", label: "Fecha", type: "date", required: true },
      { id: "apellido_familiar", label: "Apellido Familiar", type: "text", required: true },
      { id: "sector", label: "Sector", type: "select", required: true, options: [
        "La Esperanza", "San José", "Cristo Rey", "Divino Niño", "La Paz", "San Antonio", "Otro"
      ]},
      { id: "vereda", label: "Vereda", type: "text", required: false },
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
      { id: "tipo_vivienda", label: "Tipo de Vivienda", type: "select", required: true, options: [
        "Arrendada", "Propia", "A crédito", "Invasión", "Prestada", "No aplica"
      ]},
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
      { id: "acueducto_epm", label: "Acueducto EPM", type: "boolean", required: false },
      { id: "acueducto_veredal", label: "Acueducto Veredal", type: "boolean", required: false },
      { id: "acueducto_aljibe", label: "Aljibe", type: "boolean", required: false },
      { id: "acueducto_gravedad", label: "Gravedad", type: "boolean", required: false },
      { id: "aguas_alcantarillado", label: "Alcantarillado", type: "boolean", required: false },
      { id: "aguas_pozo_septico", label: "Pozo Séptico", type: "boolean", required: false },
      { id: "aguas_aire_libre", label: "Aguas Residuales - Al aire libre", type: "boolean", required: false }
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
    fields: [
      { id: "difuntos_nombres_1", label: "Difunto 1 - Nombres y Apellidos", type: "text", required: false },
      { id: "difuntos_fecha_aniversario_1", label: "Difunto 1 - Fecha de Aniversario", type: "date", required: false },
      { id: "difuntos_nombres_2", label: "Difunto 2 - Nombres y Apellidos", type: "text", required: false },
      { id: "difuntos_fecha_aniversario_2", label: "Difunto 2 - Fecha de Aniversario", type: "date", required: false },
      { id: "difuntos_nombres_3", label: "Difunto 3 - Nombres y Apellidos", type: "text", required: false },
      { id: "difuntos_fecha_aniversario_3", label: "Difunto 3 - Fecha de Aniversario", type: "date", required: false },
      { id: "padres_difuntos_padre", label: "¿Era Padre?", type: "boolean", required: false },
      { id: "padres_difuntos_madre", label: "¿Era Madre?", type: "boolean", required: false }
    ]
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentStageData = formStages.find(stage => stage.id === currentStage);
  const progress = (currentStage / formStages.length) * 100;

  // Auto-guardado cuando cambia la etapa
  useEffect(() => {
    if (Object.keys(formData).length > 0 || familyMembers.length > 0) {
      localStorage.setItem('parish-survey-draft', JSON.stringify({
        stage: currentStage,
        data: formData,
        familyMembers: familyMembers,
        timestamp: new Date().toISOString()
      }));
    }
  }, [currentStage, formData, familyMembers]);

  // Cargar borrador al iniciar
  useEffect(() => {
    const draft = localStorage.getItem('parish-survey-draft');
    if (draft) {
      const { stage, data, familyMembers: savedFamilyMembers } = JSON.parse(draft);
      setCurrentStage(stage);
      setFormData(data);
      if (savedFamilyMembers) {
        setFamilyMembers(savedFamilyMembers);
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
        timestamp: new Date().toISOString(),
        completed: true
      };

      // Aquí puedes agregar la lógica para enviar a tu API
      console.log('Datos de la encuesta:', surveyData);
      
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
          ) : (
            currentStageData.fields?.map((field) => (
              <div key={field.id} className="p-4 bg-gray-50 rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-200">
                <FormField 
                  field={field}
                  value={formData[field.id]}
                  onChange={handleFieldChange}
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
      />
    </div>
  );
};

export default SurveyForm;