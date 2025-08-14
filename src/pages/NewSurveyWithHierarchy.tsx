import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AutocompleteWithLoading } from "@/components/ui/autocomplete-with-loading";
import { useNavigate } from "react-router-dom";
import { FileText, MapPin, Save, ArrowLeft, Loader2 } from "lucide-react";
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { useHierarchicalConfiguration } from "@/hooks/useHierarchicalConfiguration";
import { useToast } from "@/hooks/use-toast";

const NewSurveyWithHierarchy = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    municipio: "",
    parroquia: "",
    sector: "",
    vereda: "",
    fecha: new Date().toISOString().split('T')[0],
    apellido_familiar: "",
    direccion: "",
    telefono: "",
    numero_contrato_epm: "",
    tipo_vivienda: "",
    observaciones: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Hooks de configuración
  const configurationData = useConfigurationData();
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
        parroquia: "",
        sector: "",
        vereda: ""
      }));
    }
  }, [selectedMunicipio, formData.municipio]);

  const handleInputChange = (field: string) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Simular envío de datos
      
      // Aquí iría la lógica real de envío
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Éxito",
        description: "Encuesta creada correctamente",
      });

      // Redirigir o limpiar formulario
      navigate("/surveys");
    } catch (error) {
      console.error("Error al crear encuesta:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la encuesta",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.municipio && formData.apellido_familiar && formData.direccion;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Button variant="outline" onClick={() => navigate("/surveys")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Nueva Encuesta Familiar</h1>
            <p className="text-gray-600">Completa los datos siguiendo el orden: Municipio → Ubicación → Información Familiar</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-blue-600" />
          <Badge variant="outline">Borrador</Badge>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Indicador de Progreso */}
        <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Progreso del Formulario</h3>
              <Badge variant={isFormValid ? "default" : "secondary"}>
                {isFormValid ? "Listo para enviar" : "En progreso"}
              </Badge>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  formData.municipio ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>1</div>
                <span className={`text-sm ${formData.municipio ? 'text-green-700 font-medium' : 'text-gray-500'}`}>
                  Municipio {formData.municipio ? '✓' : ''}
                </span>
              </div>
              
              <div className={`h-px flex-1 ${formData.municipio ? 'bg-green-300' : 'bg-gray-200'}`}></div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  formData.direccion ? 'bg-green-500 text-white' : formData.municipio ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>2</div>
                <span className={`text-sm ${formData.direccion ? 'text-green-700 font-medium' : formData.municipio ? 'text-blue-600' : 'text-gray-500'}`}>
                  Ubicación {formData.direccion ? '✓' : ''}
                </span>
              </div>
              
              <div className={`h-px flex-1 ${formData.direccion ? 'bg-green-300' : formData.municipio ? 'bg-blue-300' : 'bg-gray-200'}`}></div>
              
              <div className="flex items-center space-x-2">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                  formData.apellido_familiar ? 'bg-green-500 text-white' : formData.direccion ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'
                }`}>3</div>
                <span className={`text-sm ${formData.apellido_familiar ? 'text-green-700 font-medium' : formData.direccion ? 'text-blue-600' : 'text-gray-500'}`}>
                  Información {formData.apellido_familiar ? '✓' : ''}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
        {/* Sección Principal - Municipio */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-blue-600" />
              <CardTitle>1. Selección de Municipio</CardTitle>
            </div>
            <CardDescription>
              Primero selecciona el municipio donde se realizará la encuesta. Esto habilitará los demás campos geográficos.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-w-md">
              <Label htmlFor="municipio">Municipio *</Label>
              <AutocompleteWithLoading
                options={municipiosOptions}
                value={formData.municipio}
                onValueChange={handleInputChange("municipio")}
                placeholder="Selecciona un municipio..."
                isLoading={isLoadingMunicipios}
                disabled={isLoadingMunicipios}
                emptyText="No se encontraron municipios"
              />
              {selectedMunicipio && (
                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-800">
                    ✓ Municipio seleccionado: <strong>{municipiosOptions.find(m => m.value === selectedMunicipio)?.label}</strong>
                  </p>
                  <p className="text-xs text-green-600 mt-1">
                    Ahora puedes seleccionar parroquia, sector y vereda para este municipio.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Sección de Ubicación Específica */}
        <Card className={!selectedMunicipio ? "opacity-50" : ""}>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-green-600" />
              <CardTitle>2. Ubicación Específica</CardTitle>
            </div>
            <CardDescription>
              {!selectedMunicipio 
                ? "Selecciona un municipio primero para habilitar estos campos" 
                : "Completa la ubicación específica dentro del municipio seleccionado"
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Parroquia */}
              <div>
                <Label htmlFor="parroquia">
                  Parroquia
                  {!selectedMunicipio && <span className="text-sm text-gray-500 ml-2">(Requiere municipio)</span>}
                </Label>
                <AutocompleteWithLoading
                  options={parroquiasOptions}
                  value={formData.parroquia}
                  onValueChange={handleInputChange("parroquia")}
                  placeholder={
                    !selectedMunicipio 
                      ? "Primero selecciona un municipio" 
                      : "Selecciona una parroquia..."
                  }
                  isLoading={isLoadingParroquias}
                  disabled={!selectedMunicipio || isLoadingParroquias}
                  emptyText={
                    !selectedMunicipio 
                      ? "Selecciona un municipio primero" 
                      : "No hay parroquias disponibles para este municipio"
                  }
                />
              </div>

              {/* Sector */}
              <div>
                <Label htmlFor="sector">
                  Sector
                  {!selectedMunicipio && <span className="text-sm text-gray-500 ml-2">(Requiere municipio)</span>}
                </Label>
                <AutocompleteWithLoading
                  options={sectoresOptions}
                  value={formData.sector}
                  onValueChange={handleInputChange("sector")}
                  placeholder={
                    !selectedMunicipio 
                      ? "Primero selecciona un municipio" 
                      : "Selecciona un sector..."
                  }
                  isLoading={isLoadingSectores}
                  disabled={!selectedMunicipio || isLoadingSectores}
                  emptyText={
                    !selectedMunicipio 
                      ? "Selecciona un municipio primero" 
                      : "No hay sectores disponibles"
                  }
                />
              </div>

              {/* Vereda */}
              <div>
                <Label htmlFor="vereda">
                  Vereda
                  {!selectedMunicipio && <span className="text-sm text-gray-500 ml-2">(Requiere municipio)</span>}
                </Label>
                <AutocompleteWithLoading
                  options={veredasOptions}
                  value={formData.vereda}
                  onValueChange={handleInputChange("vereda")}
                  placeholder={
                    !selectedMunicipio 
                      ? "Primero selecciona un municipio" 
                      : "Selecciona una vereda..."
                  }
                  isLoading={isLoadingVeredas}
                  disabled={!selectedMunicipio || isLoadingVeredas}
                  emptyText={
                    !selectedMunicipio 
                      ? "Selecciona un municipio primero" 
                      : "No hay veredas disponibles para este municipio"
                  }
                />
              </div>
            </div>

            {/* Dirección */}
            <div>
              <Label htmlFor="direccion">Dirección Completa *</Label>
              <Input
                id="direccion"
                value={formData.direccion}
                onChange={(e) => handleInputChange("direccion")(e.target.value)}
                placeholder={selectedMunicipio ? "Ingresa la dirección específica..." : "Selecciona un municipio primero"}
                disabled={!selectedMunicipio}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Información de la Familia */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-purple-600" />
              <CardTitle>3. Información de la Familia</CardTitle>
            </div>
            <CardDescription>Datos básicos de la familia para la encuesta</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fecha">Fecha de la Encuesta *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleInputChange("fecha")(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="apellido_familiar">Apellido Familiar *</Label>
                <Input
                  id="apellido_familiar"
                  value={formData.apellido_familiar}
                  onChange={(e) => handleInputChange("apellido_familiar")(e.target.value)}
                  placeholder="Apellido principal de la familia..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono de Contacto</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => handleInputChange("telefono")(e.target.value)}
                  placeholder="Número de teléfono de contacto..."
                />
              </div>

              <div>
                <Label htmlFor="tipo_vivienda">Tipo de Vivienda</Label>
                <AutocompleteWithLoading
                  options={configurationData?.tipoViviendaOptions || []}
                  value={formData.tipo_vivienda}
                  onValueChange={handleInputChange("tipo_vivienda")}
                  placeholder="Selecciona tipo de vivienda..."
                  isLoading={configurationData?.tiposViviendaLoading || false}
                  disabled={configurationData?.tiposViviendaLoading || false}
                  emptyText="No hay tipos de vivienda disponibles"
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="numero_contrato_epm">Número de Contrato EPM</Label>
                <Input
                  id="numero_contrato_epm"
                  value={formData.numero_contrato_epm}
                  onChange={(e) => handleInputChange("numero_contrato_epm")(e.target.value)}
                  placeholder="Número de contrato de servicios públicos EPM..."
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleInputChange("observaciones")(e.target.value)}
                  placeholder="Observaciones adicionales sobre la familia o la encuesta..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Botones de acción */}
        <div className="flex justify-end space-x-4 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/surveys")}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={!isFormValid || isSubmitting}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Guardando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Guardar Encuesta
              </>
            )}
          </Button>
        </div>
      </form>

    </div>
  );
};

export default NewSurveyWithHierarchy;
