import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useHierarchicalConfiguration } from '@/hooks/useHierarchicalConfiguration';
import { AutocompleteWithLoading } from '@/components/ui/autocomplete-with-loading';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';

interface HierarchicalSurveyFormProps {
  onSubmit?: (data: any) => void;
  initialData?: any;
}

interface FormData {
  municipio: string;
  parroquia: string;
  sector: string;
  vereda: string;
  // Otros campos de la encuesta
  direccion: string;
  observaciones: string;
}

export const HierarchicalSurveyForm: React.FC<HierarchicalSurveyFormProps> = ({ 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState<FormData>({
    municipio: '',
    parroquia: '',
    sector: '',
    vereda: '',
    direccion: '',
    observaciones: '',
    ...initialData
  });

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

  // Sincronizar selección de municipio con form data
  useEffect(() => {
    setSelectedMunicipio(formData.municipio);
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

  const handleFieldChange = (field: keyof FormData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.municipio && formData.direccion;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nueva Encuesta - Formulario Jerárquico</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Sección de Ubicación Geográfica */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Ubicación Geográfica</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Municipio */}
              <div>
                <Label htmlFor="municipio">Municipio *</Label>
                <AutocompleteWithLoading
                  options={municipiosOptions}
                  value={formData.municipio}
                  onValueChange={handleFieldChange('municipio')}
                  placeholder="Selecciona un municipio..."
                  isLoading={isLoadingMunicipios}
                  disabled={isLoadingMunicipios}
                  emptyText="No se encontraron municipios"
                />
              </div>

              {/* Parroquia */}
              <div>
                <Label htmlFor="parroquia">Parroquia</Label>
                <AutocompleteWithLoading
                  options={parroquiasOptions}
                  value={formData.parroquia}
                  onValueChange={handleFieldChange('parroquia')}
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
                <Label htmlFor="sector">Sector</Label>
                <AutocompleteWithLoading
                  options={sectoresOptions}
                  value={formData.sector}
                  onValueChange={handleFieldChange('sector')}
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
                <Label htmlFor="vereda">Vereda</Label>
                <AutocompleteWithLoading
                  options={veredasOptions}
                  value={formData.vereda}
                  onValueChange={handleFieldChange('vereda')}
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
          </div>

          <Separator />

          {/* Información Adicional */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Información Adicional</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => handleFieldChange('direccion')(e.target.value)}
                  placeholder="Ingresa la dirección completa..."
                  required
                />
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones</Label>
                <Input
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => handleFieldChange('observaciones')(e.target.value)}
                  placeholder="Observaciones adicionales..."
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Botones de acción */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({
                municipio: '',
                parroquia: '',
                sector: '',
                vereda: '',
                direccion: '',
                observaciones: '',
              })}
            >
              Limpiar Formulario
            </Button>
            <Button
              type="submit"
              disabled={!isFormValid}
            >
              Guardar Encuesta
            </Button>
          </div>

        </form>
      </CardContent>
    </Card>
  );
};

export default HierarchicalSurveyForm;
