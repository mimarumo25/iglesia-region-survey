/**
 * Página de demostración del sistema de tallas
 * 
 * @description Componente de demostración que muestra cómo usar el sistema
 * completo de tallas, incluyendo formularios, validación y diferentes variantes
 * de componentes.
 * 
 * @author Sistema MIA - Módulo de Tallas
 * @version 1.0.0
 */

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';

// Importar componentes de tallas
import { 
  TallaSelect, 
  TallasGroup,
  useTallas,
  useTallasValidation,
  TallasFormData
} from '@/components/tallas';

/**
 * Componente principal de demostración
 */
const TallasDemoPage: React.FC = () => {
  const { toast } = useToast();
  const { tallasData, getTallaNombre } = useTallas();
  const { validateTallasForm, getTallasDisplay } = useTallasValidation();

  // Estado para los formularios de demostración
  const [tallasSelect, setTallasSelect] = useState({
    talla_camisa: '',
    talla_pantalon: '',
    talla_zapato: ''
  });

  // Configurar react-hook-form
  const { 
    control, 
    handleSubmit, 
    watch,
    formState: { errors },
    setValue,
    getValues
  } = useForm<TallasFormData>({
    defaultValues: {
      talla_camisa: '',
      talla_pantalon: '',
      talla_zapato: ''
    }
  });

  const watchedValues = watch();

  // Handlers
  const handleSelectChange = (field: keyof typeof tallasSelect, value: string) => {
    setTallasSelect(prev => ({ ...prev, [field]: value }));
  };

  const handleFormSubmit = (data: TallasFormData) => {
    const validationErrors = validateTallasForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      toast({
        title: "Error de validación",
        description: "Por favor corrige los errores en el formulario.",
        variant: "destructive"
      });
      return;
    }

    const displayNames = getTallasDisplay(data);
    
    toast({
      title: "✅ Formulario enviado",
      description: `Tallas seleccionadas: Camisa: ${displayNames.camisa}, Pantalón: ${displayNames.pantalon}, Calzado: ${displayNames.zapato}`,
    });

    console.log('Datos del formulario:', data);
  };

  const handleReset = () => {
    setTallasSelect({
      talla_camisa: '',
      talla_pantalon: '',
      talla_zapato: ''
    });
    setValue('talla_camisa', '');
    setValue('talla_pantalon', '');
    setValue('talla_zapato', '');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold text-primary">Sistema de Tallas</h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Demostración del sistema modular de tallas para Colombia con datos predefinidos
          y componentes reutilizables.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Columna izquierda - Componentes individuales */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                🧥 Componentes Individuales
              </CardTitle>
              <CardDescription>
                Selecciona tallas usando componentes individuales con diferentes variantes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Select nativo para camisa */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Talla de Camisa (Select)</label>
                <TallaSelect
                  tipo="camisa"
                  value={tallasSelect.talla_camisa}
                  onChange={(value) => handleSelectChange('talla_camisa', value)}
                  variant="select"
                  placeholder="Selecciona talla de camisa"
                />
                {tallasSelect.talla_camisa && (
                  <p className="text-xs text-muted-foreground">
                    Seleccionado: {getTallaNombre('camisa', tallasSelect.talla_camisa)}
                  </p>
                )}
              </div>

              {/* Combobox para pantalón */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Talla de Pantalón (Combobox)</label>
                <TallaSelect
                  tipo="pantalon"
                  value={tallasSelect.talla_pantalon}
                  onChange={(value) => handleSelectChange('talla_pantalon', value)}
                  variant="combobox"
                  placeholder="Busca y selecciona talla de pantalón"
                />
                {tallasSelect.talla_pantalon && (
                  <p className="text-xs text-muted-foreground">
                    Seleccionado: {getTallaNombre('pantalon', tallasSelect.talla_pantalon)}
                  </p>
                )}
              </div>

              {/* Select para calzado */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Talla de Calzado (Select)</label>
                <TallaSelect
                  tipo="calzado"
                  value={tallasSelect.talla_zapato}
                  onChange={(value) => handleSelectChange('talla_zapato', value)}
                  variant="select"
                  placeholder="Selecciona talla de calzado"
                />
                {tallasSelect.talla_zapato && (
                  <p className="text-xs text-muted-foreground">
                    Seleccionado: {getTallaNombre('calzado', tallasSelect.talla_zapato)}
                  </p>
                )}
              </div>

              <Button onClick={handleReset} variant="outline" className="w-full">
                Limpiar Selección
              </Button>
            </CardContent>
          </Card>

          {/* Estadísticas de datos */}
          <Card>
            <CardHeader>
              <CardTitle>📊 Estadísticas de Datos</CardTitle>
              <CardDescription>
                Información sobre las tallas disponibles en el sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{tallasData.camisas.length}</p>
                  <p className="text-sm text-muted-foreground">Tallas de Camisa</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{tallasData.pantalones.length}</p>
                  <p className="text-sm text-muted-foreground">Tallas de Pantalón</p>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold text-primary">{tallasData.calzado.length}</p>
                  <p className="text-sm text-muted-foreground">Tallas de Calzado</p>
                </div>
              </div>

              <Separator />

              {/* Ejemplos de tallas más comunes */}
              <div className="space-y-3">
                <h4 className="font-medium">Tallas más comunes:</h4>
                <div className="space-y-2">
                  <div>
                    <span className="text-sm font-medium">Camisas: </span>
                    {['S', 'M', 'L', 'XL', '12', '14'].map(talla => (
                      <Badge key={talla} variant="secondary" className="mr-1 mb-1 text-xs">
                        {talla}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <span className="text-sm font-medium">Pantalones: </span>
                    {['30', '32', '34', '36', 'M', 'L'].map(talla => (
                      <Badge key={talla} variant="secondary" className="mr-1 mb-1 text-xs">
                        {talla}
                      </Badge>
                    ))}
                  </div>
                  <div>
                    <span className="text-sm font-medium">Calzado: </span>
                    {['37', '38', '39', '40', '41', '42'].map(talla => (
                      <Badge key={talla} variant="secondary" className="mr-1 mb-1 text-xs">
                        {talla}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Columna derecha - Formulario completo */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                📝 Formulario Completo con React Hook Form
              </CardTitle>
              <CardDescription>
                Ejemplo de formulario integrado con validación y manejo de errores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                {/* Grupo de tallas usando Controller */}
                <div className="space-y-4">
                  <Controller
                    name="talla_camisa"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Talla de Camisa/Blusa *</label>
                        <TallaSelect
                          tipo="camisa"
                          value={field.value}
                          onChange={field.onChange}
                          variant="combobox"
                        />
                        {errors.talla_camisa && (
                          <p className="text-xs text-red-500">{errors.talla_camisa.message}</p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="talla_pantalon"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Talla de Pantalón *</label>
                        <TallaSelect
                          tipo="pantalon"
                          value={field.value}
                          onChange={field.onChange}
                          variant="select"
                        />
                        {errors.talla_pantalon && (
                          <p className="text-xs text-red-500">{errors.talla_pantalon.message}</p>
                        )}
                      </div>
                    )}
                  />

                  <Controller
                    name="talla_zapato"
                    control={control}
                    render={({ field }) => (
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Talla de Calzado *</label>
                        <TallaSelect
                          tipo="calzado"
                          value={field.value}
                          onChange={field.onChange}
                          variant="combobox"
                        />
                        {errors.talla_zapato && (
                          <p className="text-xs text-red-500">{errors.talla_zapato.message}</p>
                        )}
                      </div>
                    )}
                  />
                </div>

                <Separator />

                {/* Vista previa de selección */}
                {(watchedValues.talla_camisa || watchedValues.talla_pantalon || watchedValues.talla_zapato) && (
                  <div className="p-4 bg-muted rounded-lg space-y-2">
                    <h4 className="font-medium">Vista previa:</h4>
                    {watchedValues.talla_camisa && (
                      <p className="text-sm">
                        <span className="font-medium">Camisa:</span> {getTallaNombre('camisa', watchedValues.talla_camisa)}
                      </p>
                    )}
                    {watchedValues.talla_pantalon && (
                      <p className="text-sm">
                        <span className="font-medium">Pantalón:</span> {getTallaNombre('pantalon', watchedValues.talla_pantalon)}
                      </p>
                    )}
                    {watchedValues.talla_zapato && (
                      <p className="text-sm">
                        <span className="font-medium">Calzado:</span> {getTallaNombre('calzado', watchedValues.talla_zapato)}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Enviar Formulario
                  </Button>
                  <Button type="button" variant="outline" onClick={() => {
                    setValue('talla_camisa', '');
                    setValue('talla_pantalon', '');
                    setValue('talla_zapato', '');
                  }}>
                    Limpiar
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Alternativa usando TallasGroup */}
          <Card>
            <CardHeader>
              <CardTitle>🎯 Componente TallasGroup</CardTitle>
              <CardDescription>
                Componente todo-en-uno para formularios rápidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TallasGroup
                values={tallasSelect}
                onChange={handleSelectChange}
                variant="select"
              />
              <Button 
                className="w-full mt-4" 
                onClick={() => console.log('TallasGroup values:', tallasSelect)}
              >
                Mostrar Valores en Consola
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TallasDemoPage;
