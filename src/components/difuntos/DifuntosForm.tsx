/**
 * Formulario de Filtros para Difuntos - Sistema MIA
 * 
 * Componente q    // Convertir fechas a string ISO si existen
    const filters: DifuntosFilters = {
      ...Object.fromEntries(
        Object.entries(data).filter(([key, value]) => {
          // Filtrar valores especiales y vacíos
          if (key === 'parentesco' && (value === '__ALL__' || value === '__EMPTY__' || value === '')) return false;
          return value !== "" && value !== null && value !== undefined;
        })
      ),
      fecha_inicio: data.fecha_inicio?.toISOString().split('T')[0],
      fecha_fin: data.fecha_fin?.toISOString().split('T')[0],
    };
    
    // Si el parentesco no es vacío ni "__ALL__" ni "__EMPTY__", incluirlo
    if (data.parentesco && data.parentesco !== '__ALL__' && data.parentesco !== '__EMPTY__' && data.parentesco !== '') {
      filters.parentesco = data.parentesco;
    }os los filtros disponibles para la consulta
 * de difuntos según el endpoint API
 * 
 * Filtros disponibles:
 * - Parentesco (select con opciones del catálogo)
 * - Rango de fechas (fecha_inicio y fecha_fin)
 * - Sector, Municipio, Parroquia (selects con autocompletado)
 * 
 * @version 1.0
 * @author Sistema MIA
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete } from "@/components/ui/autocomplete";
import ModernDatePicker from "@/components/ui/modern-date-picker";
import { Separator } from "@/components/ui/separator";
import { Calendar, Search, X, Filter, RotateCcw } from "lucide-react";

// Hooks
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { DifuntosFilters, DifuntosFormProps } from "@/types/difuntos";

// Esquema de validación para el formulario
const difuntosFilterSchema = z.object({
  parentesco: z.string().optional(),
  fecha_inicio: z.date().optional().nullable(),
  fecha_fin: z.date().optional().nullable(),
  sector: z.string().optional(),
  municipio: z.string().optional(),
  parroquia: z.string().optional(),
}).refine((data) => {
  // Validar que fecha_fin no sea anterior a fecha_inicio
  if (data.fecha_inicio && data.fecha_fin) {
    return data.fecha_fin >= data.fecha_inicio;
  }
  return true;
}, {
  message: "La fecha fin debe ser posterior a la fecha inicio",
  path: ["fecha_fin"]
});

type DifuntosFormData = z.infer<typeof difuntosFilterSchema>;

/**
 * Componente DifuntosForm - Formulario de filtros para consulta de difuntos
 */
export const DifuntosForm = ({ onSearch, isLoading, onClearFilters }: DifuntosFormProps) => {
  const [hasFilters, setHasFilters] = useState(false);
  
  // Configuración de datos para autocompletados
  const configData = useConfigurationData();
  
  // Configuración del formulario
  const form = useForm<DifuntosFormData>({
    resolver: zodResolver(difuntosFilterSchema),
    defaultValues: {
      parentesco: "__EMPTY__",
      fecha_inicio: null,
      fecha_fin: null,
      sector: "",
      municipio: "",
      parroquia: "",
    }
  });

  /**
   * Maneja el envío del formulario
   */
  const onSubmit = (data: DifuntosFormData) => {
    // Convertir fechas a string ISO si existen
    const filters: DifuntosFilters = {
      fecha_inicio: data.fecha_inicio?.toISOString().split('T')[0],
      fecha_fin: data.fecha_fin?.toISOString().split('T')[0],
    };
    
    // Mapear campos del formulario a parámetros de la API
    if (data.parentesco && data.parentesco !== '__ALL__' && data.parentesco !== '__EMPTY__' && data.parentesco !== '') {
      filters.id_parentesco = data.parentesco;
    }
    
    if (data.municipio && data.municipio !== '__ALL__' && data.municipio !== '') {
      filters.id_municipio = data.municipio;
    }
    
    if (data.parroquia && data.parroquia !== '__ALL__' && data.parroquia !== '') {
      filters.id_parroquia = data.parroquia;
    }
    
    if (data.sector && data.sector !== '__ALL__' && data.sector !== '') {
      filters.id_sector = data.sector;
    }
    
    // Filtrar campos vacíos
    const cleanFilters = Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => value !== "" && value !== null && value !== undefined)
    );
    
    setHasFilters(Object.keys(cleanFilters).length > 0);
    onSearch(cleanFilters);
  };

  /**
   * Limpia todos los filtros del formulario
   */
  const handleClearFilters = () => {
    form.reset({
      parentesco: "__EMPTY__",
      fecha_inicio: null,
      fecha_fin: null,
      sector: "",
      municipio: "",
      parroquia: "",
    });
    setHasFilters(false);
    onClearFilters();
  };

  /**
   * Verifica si hay filtros activos
   */
  const watchedValues = form.watch();
  const hasActiveFilters = Object.entries(watchedValues).some(([key, value]) => {
    // Considerar activos solo los filtros con valores reales
    if (key === 'parentesco' && (value === '__ALL__' || value === '__EMPTY__' || value === '')) return false;
    return value !== "" && value !== null && value !== undefined;
  });

  return (
    <Card className="mb-4">
      <CardContent className="p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            
            {/* Filtros compactos en una sola fila en desktop, stack en móvil */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Parentesco */}
              <FormField
                control={form.control}
                name="parentesco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Parentesco</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="h-9">
                          <SelectValue placeholder="Seleccionar parentesco" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="__EMPTY__">-- Seleccionar --</SelectItem>
                          <SelectItem value="__ALL__">Todos</SelectItem>
                          {configData.parentescosOptions.map((item) => (
                            <SelectItem key={item.value} value={item.label}>
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Inicio */}
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Desde</FormLabel>
                    <FormControl>
                      <ModernDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fecha inicio"
                        disabled={isLoading}
                        className="w-full h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Fecha Fin */}
              <FormField
                control={form.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Hasta</FormLabel>
                    <FormControl>
                      <ModernDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fecha fin"
                        disabled={isLoading}
                        className="w-full h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Municipio */}
              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Municipio</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={configData.municipioOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Municipio..."
                        disabled={isLoading}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Segunda fila de filtros */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {/* Parroquia */}
              <FormField
                control={form.control}
                name="parroquia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Parroquia</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={configData.parroquiaOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Parroquia..."
                        disabled={isLoading}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Sector */}
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs">Sector</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={configData.sectorOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Sector..."
                        disabled={isLoading}
                        className="h-9"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Espaciadores para mantener alineación */}
              <div className="hidden lg:block"></div>
              
              {/* Botones de Acción */}
              <div className="flex gap-2 justify-end">
                <Button
                  type="submit"
                  size="sm"
                  disabled={isLoading}
                  className="h-9"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin h-3 w-3 mr-2 border-2 border-current border-t-transparent rounded-full" />
                      Buscando...
                    </>
                  ) : (
                    <>
                      <Search className="h-3 w-3 mr-2" />
                      Buscar
                    </>
                  )}
                </Button>
                
                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearFilters}
                    disabled={isLoading}
                    className="h-9"
                  >
                    <RotateCcw className="h-3 w-3 mr-1" />
                    Limpiar
                  </Button>
                )}
              </div>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DifuntosForm;