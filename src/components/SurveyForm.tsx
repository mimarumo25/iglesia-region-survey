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
    <div className="parish-container parish-section max-w-4xl mx-auto">
      {/* Header con progreso */}
      <Card className="parish-card mb-8">
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="text-2xl">Caracterización Poblacional</CardTitle>
              <CardDescription>
                Etapa {currentStage} de {formStages.length}: {currentStageData.title}
              </CardDescription>
            </div>
            <div className="text-sm text-muted-foreground">
              {Math.round(progress)}% completado
            </div>
          </div>
          <Progress value={progress} className="parish-progress-bar" />
        </CardHeader>
      </Card>

      {/* Formulario actual */}
      <Card className="parish-card">
        <CardHeader>
          <CardTitle>{currentStageData.title}</CardTitle>
          <CardDescription>{currentStageData.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {currentStageData.fields.map(renderField)}
        </CardContent>
      </Card>

      {/* Navegación */}
      <div className="flex justify-between items-center mt-8">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStage === 1}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </Button>

        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={() => {
              toast({
                title: "Progreso guardado",
                description: "Su progreso ha sido guardado automáticamente.",
              });
            }}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar borrador
          </Button>

          {currentStage === formStages.length ? (
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="parish-button-primary flex items-center gap-2"
            >
              {isSubmitting ? "Enviando..." : "Finalizar encuesta"}
            </Button>
          ) : (
            <Button
              onClick={handleNext}
              className="parish-button-primary flex items-center gap-2"
            >
              Siguiente
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SurveyForm;