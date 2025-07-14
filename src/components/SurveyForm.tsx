import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, ChevronRight, Save, FileDown } from "lucide-react";

// Definición de las etapas del formulario basado en el Excel
const formStages = [
  {
    id: 1,
    title: "Datos Personales",
    description: "Información básica del encuestado",
    fields: [
      { id: "nombres", label: "Nombres", type: "text", required: true },
      { id: "apellidos", label: "Apellidos", type: "text", required: true },
      { id: "cedula", label: "Cédula", type: "text", required: true },
      { id: "edad", label: "Edad", type: "number", required: true },
      { id: "telefono", label: "Teléfono", type: "text", required: false },
      { id: "estado_civil", label: "Estado Civil", type: "select", required: true, options: [
        "Soltero/a", "Casado/a", "Unión libre", "Viudo/a", "Divorciado/a"
      ]}
    ]
  },
  {
    id: 2,
    title: "Ubicación y Vivienda",
    description: "Información sobre la vivienda y ubicación",
    fields: [
      { id: "direccion", label: "Dirección", type: "text", required: true },
      { id: "sector", label: "Sector", type: "select", required: true, options: [
        "La Esperanza", "San José", "Cristo Rey", "Divino Niño", "La Paz", "San Antonio"
      ]},
      { id: "tipo_vivienda", label: "Tipo de Vivienda", type: "select", required: true, options: [
        "Casa propia", "Casa arrendada", "Casa familiar", "Apartamento", "Otro"
      ]},
      { id: "servicios_publicos", label: "Servicios Públicos", type: "checkbox", required: false, options: [
        "Agua", "Luz", "Gas", "Internet", "Alcantarillado", "Recolección de basuras"
      ]}
    ]
  },
  {
    id: 3,
    title: "Información Familiar",
    description: "Composición del núcleo familiar",
    fields: [
      { id: "num_personas", label: "Número de personas en el hogar", type: "number", required: true },
      { id: "num_menores", label: "Número de menores de edad", type: "number", required: false },
      { id: "jefe_hogar", label: "Jefe del hogar", type: "text", required: true },
      { id: "ocupacion_jefe", label: "Ocupación del jefe del hogar", type: "text", required: false }
    ]
  },
  {
    id: 4,
    title: "Actividades Parroquiales",
    description: "Participación en la vida parroquial",
    fields: [
      { id: "frecuencia_misa", label: "Frecuencia de asistencia a misa", type: "select", required: true, options: [
        "Todos los días", "Una vez por semana", "Ocasionalmente", "Nunca"
      ]},
      { id: "grupos_parroquiales", label: "Grupos parroquiales en los que participa", type: "checkbox", required: false, options: [
        "Coro", "Catequesis", "Grupos de oración", "Pastoral social", "Juventud", "Ninguno"
      ]},
      { id: "sacramentos_pendientes", label: "Sacramentos pendientes", type: "checkbox", required: false, options: [
        "Bautismo", "Primera comunión", "Confirmación", "Matrimonio", "Ninguno"
      ]}
    ]
  },
  {
    id: 5,
    title: "Necesidades y Observaciones",
    description: "Necesidades específicas y comentarios adicionales",
    fields: [
      { id: "necesidades_especiales", label: "Necesidades especiales de la familia", type: "checkbox", required: false, options: [
        "Apoyo económico", "Atención médica", "Educación", "Vivienda", "Alimentación", "Ninguna"
      ]},
      { id: "observaciones", label: "Observaciones adicionales", type: "textarea", required: false }
    ]
  }
];

const SurveyForm = () => {
  const [currentStage, setCurrentStage] = useState(1);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const currentStageData = formStages.find(stage => stage.id === currentStage);
  const progress = (currentStage / formStages.length) * 100;

  // Auto-guardado cuando cambia la etapa
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      localStorage.setItem('parish-survey-draft', JSON.stringify({
        stage: currentStage,
        data: formData,
        timestamp: new Date().toISOString()
      }));
    }
  }, [currentStage, formData]);

  // Cargar borrador al iniciar
  useEffect(() => {
    const draft = localStorage.getItem('parish-survey-draft');
    if (draft) {
      const { stage, data } = JSON.parse(draft);
      setCurrentStage(stage);
      setFormData(data);
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
    setIsSubmitting(true);
    
    // Simulación de envío - aquí iría la llamada a la API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Limpiar borrador
    localStorage.removeItem('parish-survey-draft');
    
    toast({
      title: "Encuesta completada",
      description: "La encuesta ha sido enviada exitosamente.",
      variant: "default"
    });

    // Redirigir al dashboard o mostrar página de confirmación
    setIsSubmitting(false);
  };

  const renderField = (field: any) => {
    const value = formData[field.id] || '';

    switch (field.type) {
      case 'text':
      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="parish-input"
              required={field.required}
            />
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select value={value} onValueChange={(val) => handleFieldChange(field.id, val)}>
              <SelectTrigger className="parish-input">
                <SelectValue placeholder="Seleccionar..." />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option: string) => (
                  <SelectItem key={option} value={option}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        );

      case 'checkbox':
        const selectedValues = Array.isArray(value) ? value : [];
        return (
          <div key={field.id} className="space-y-3">
            <Label>{field.label}</Label>
            <div className="grid grid-cols-1 gap-3">
              {field.options?.map((option: string) => (
                <div key={option} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option}`}
                    checked={selectedValues.includes(option)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        handleFieldChange(field.id, [...selectedValues, option]);
                      } else {
                        handleFieldChange(field.id, selectedValues.filter((v: string) => v !== option));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option}`} className="text-sm font-normal">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <textarea
              id={field.id}
              value={value}
              onChange={(e) => handleFieldChange(field.id, e.target.value)}
              className="parish-input min-h-24 resize-y"
              rows={4}
            />
          </div>
        );

      default:
        return null;
    }
  };

  if (!currentStageData) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 lg:px-8 py-6 lg:py-8">
      {/* Header con progreso */}
      <Card className="parish-card mb-6 lg:mb-8 fade-in">
        <CardHeader className="p-4 lg:p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
            <div className="slide-in-left min-w-0 flex-1">
              <CardTitle className="text-xl lg:text-2xl bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Caracterización Poblacional
              </CardTitle>
              <CardDescription className="text-sm lg:text-lg mt-1">
                Etapa {currentStage} de {formStages.length}: {currentStageData.title}
              </CardDescription>
            </div>
            <div className="text-sm font-medium scale-in flex-shrink-0 bg-muted px-3 py-1 rounded-full">
              {Math.round(progress)}% completado
            </div>
          </div>
          <div className="relative">
            <Progress 
              value={progress} 
              className="parish-progress-bar h-3 bg-muted/50 overflow-hidden rounded-full"
            />
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary via-primary-light to-secondary rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardHeader>
      </Card>

      {/* Formulario actual */}
      <Card className="parish-card slide-up">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-primary-foreground font-bold">
              {currentStage}
            </div>
            {currentStageData.title}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStageData.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {currentStageData.fields.map((field, index) => (
            <div key={field.id} className="fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
              {renderField(field)}
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mt-6 lg:mt-8 fade-in">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStage === 1}
          className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1" />
          Anterior
        </Button>

        <div className="flex flex-col sm:flex-row gap-3 lg:gap-4 order-first sm:order-last">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Progreso guardado",
                description: "Su progreso ha sido guardado automáticamente.",
              });
            }}
            className="flex items-center gap-2 transition-all duration-300 hover:scale-105 hover:shadow-md hover:bg-muted/80"
          >
            <Save className="w-4 h-4 transition-transform duration-300 hover:rotate-12" />
            Guardar borrador
          </Button>

          {currentStage === formStages.length ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="parish-button-primary flex items-center gap-2 glow-pulse"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <FileDown className="w-4 h-4 transition-transform duration-300 hover:translate-y-1" />
                  Finalizar encuesta
                </>
              )}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="parish-button-primary flex items-center gap-2 group"
            >
              Siguiente
              <ChevronRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;