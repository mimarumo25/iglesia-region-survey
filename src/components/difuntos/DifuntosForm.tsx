/**
 * Formulario de Filtros para Difuntos - Sistema MIA
 * 
 * Componente que muestra todos los filtros disponibles para la consulta
 * de difuntos según el endpoint API
 * 
 * Filtros disponibles:
 * - Parentesco (select con opciones del catálogo)
 * - Municipio (base para otros filtros)
 * - Parroquia, Sector, Corregimiento, Centro Poblado (dependientes del municipio)
 * - Rango de fechas (fecha_inicio y fecha_fin)
 * 
 * @version 2.0
 * @author Sistema MIA
 */

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Autocomplete } from "@/components/ui/autocomplete";
import ModernDatePicker from "@/components/ui/modern-date-picker";
import { Search, RotateCcw } from "lucide-react";

// Hooks
import { useConfigurationData } from "@/hooks/useConfigurationData";
import { useMunicipioDependentCorregimientos } from "@/hooks/useMunicipioDependentCorregimientos";
import { useMunicipioDependentCentrosPoblados } from "@/hooks/useMunicipioDependentCentrosPoblados";
import { DifuntosFilters, DifuntosFormProps } from "@/types/difuntos";
import { AutocompleteOption } from "@/components/ui/autocomplete";

// Esquema de validación para el formulario
const difuntosFilterSchema = z.object({
  parentesco: z.string().optional(),
  fecha_inicio: z.date().optional().nullable(),
  fecha_fin: z.date().optional().nullable(),
  sector: z.string().optional(),
  municipio: z.string().optional(),
  parroquia: z.string().optional(),
  corregimiento: z.string().optional(),
  centro_poblado: z.string().optional(),
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
      municipio: "",
      parroquia: "",
      sector: "",
      corregimiento: "",
      centro_poblado: "",
      fecha_inicio: null,
      fecha_fin: null,
    }
  });

  // Observar el municipio seleccionado para filtros dependientes
  const selectedMunicipio = form.watch("municipio");

  // Hooks dependientes del municipio
  const { corregimientoOptions, isLoading: corregimientosLoading } = useMunicipioDependentCorregimientos(
    selectedMunicipio || null
  );
  
  const { centroPobladoOptions, isLoading: centrosPobladosLoading } = useMunicipioDependentCentrosPoblados(
    selectedMunicipio || null
  );

  // Filtrar parroquias por municipio
  const filteredParroquiaOptions = useMemo((): AutocompleteOption[] => {
    if (!selectedMunicipio || selectedMunicipio === '') {
      return configData.parroquiaOptions;
    }
    
    // Aquí deberías filtrar las parroquias por municipio
    // Por ahora retornamos todas, pero idealmente el API debería retornar este filtro
    return configData.parroquiaOptions;
  }, [selectedMunicipio, configData.parroquiaOptions]);

  // Filtrar sectores por municipio
  const filteredSectorOptions = useMemo((): AutocompleteOption[] => {
    if (!selectedMunicipio || selectedMunicipio === '') {
      return configData.sectorOptions;
    }
    
    // Aquí deberías filtrar los sectores por municipio
    // Por ahora retornamos todos, pero idealmente el API debería retornar este filtro
    return configData.sectorOptions;
  }, [selectedMunicipio, configData.sectorOptions]);

  // Limpiar campos dependientes cuando cambia el municipio
  useEffect(() => {
    if (selectedMunicipio) {
      form.setValue("parroquia", "");
      form.setValue("sector", "");
      form.setValue("corregimiento", "");
      form.setValue("centro_poblado", "");
    }
  }, [selectedMunicipio, form]);

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
    
    if (data.corregimiento && data.corregimiento !== '__ALL__' && data.corregimiento !== '') {
      filters.id_corregimiento = data.corregimiento;
    }
    
    if (data.centro_poblado && data.centro_poblado !== '__ALL__' && data.centro_poblado !== '') {
      filters.id_centro_poblado = data.centro_poblado;
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
      municipio: "",
      parroquia: "",
      sector: "",
      corregimiento: "",
      centro_poblado: "",
      fecha_inicio: null,
      fecha_fin: null,
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
      <CardContent className="p-2 sm:p-4">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3 sm:space-y-4">
            
            {/* Primera fila: Parentesco, Municipio y Parroquia */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Parentesco */}
              <FormField
                control={form.control}
                name="parentesco"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Parentesco</FormLabel>
                    <FormControl>
                      <Select 
                        value={field.value} 
                        onValueChange={field.onChange}
                        disabled={isLoading}
                      >
                        <SelectTrigger className="w-full h-9">
                          <SelectValue 
                            placeholder="Seleccionar parentesco"
                          />
                        </SelectTrigger>
                        <SelectContent className="max-w-[calc(100vw-2rem)]">
                          <SelectItem value="__EMPTY__">-- Seleccionar --</SelectItem>
                          <SelectItem value="__ALL__">Todos</SelectItem>
                          {configData.parentescosOptions.map((item) => (
                            <SelectItem 
                              key={item.value} 
                              value={item.value}
                            >
                              {item.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Municipio - Base para filtros dependientes */}
              <FormField
                control={form.control}
                name="municipio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Municipio *</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={configData.municipioOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder="Seleccionar municipio..."
                        disabled={isLoading}
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Parroquia */}
              <FormField
                control={form.control}
                name="parroquia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Parroquia</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={filteredParroquiaOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={selectedMunicipio ? "Seleccionar parroquia..." : "Primero municipio"}
                        disabled={isLoading || !selectedMunicipio}
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Segunda fila: Sector, Corregimiento y Centro Poblado */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Sector */}
              <FormField
                control={form.control}
                name="sector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Sector</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={filteredSectorOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={selectedMunicipio ? "Seleccionar sector..." : "Primero municipio"}
                        disabled={isLoading || !selectedMunicipio}
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Corregimiento */}
              <FormField
                control={form.control}
                name="corregimiento"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Corregimiento</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={corregimientoOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={selectedMunicipio ? "Seleccionar..." : "Primero municipio"}
                        disabled={isLoading || !selectedMunicipio || corregimientosLoading}
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Centro Poblado */}
              <FormField
                control={form.control}
                name="centro_poblado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Centro Poblado</FormLabel>
                    <FormControl>
                      <Autocomplete
                        options={centroPobladoOptions}
                        value={field.value}
                        onValueChange={field.onChange}
                        placeholder={selectedMunicipio ? "Seleccionar..." : "Primero municipio"}
                        disabled={isLoading || !selectedMunicipio || centrosPobladosLoading}
                        className="text-xs sm:text-sm"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>

            {/* Tercera fila: Fechas */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {/* Fecha Inicio */}
              <FormField
                control={form.control}
                name="fecha_inicio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Fecha Desde</FormLabel>
                    <FormControl>
                      <ModernDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fecha inicio"
                        disabled={isLoading}
                        className="w-full text-xs sm:text-sm"
                        title="Fecha de Fallecimiento (Desde)"
                        description="Elija una fecha de fallecimiento inicial"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />

              {/* Fecha Fin */}
              <FormField
                control={form.control}
                name="fecha_fin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs sm:text-sm">Fecha Hasta</FormLabel>
                    <FormControl>
                      <ModernDatePicker
                        value={field.value}
                        onChange={field.onChange}
                        placeholder="Fecha fin"
                        disabled={isLoading}
                        className="w-full text-xs sm:text-sm"
                        title="Fecha de Fallecimiento (Hasta)"
                        description="Elija una fecha de fallecimiento final"
                      />
                    </FormControl>
                    <FormMessage className="text-xs" />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default DifuntosForm;