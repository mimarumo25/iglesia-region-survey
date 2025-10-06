/**
 * 📋 Lista de Familias en Acordeón - Sistema MIA
 * 
 * Componente contenedor que renderiza todas las familias en formato de acordeón,
 * mostrando estadísticas generales y permitiendo expandir cada familia individualmente
 * 
 * @module components/familias/FamiliasAccordionList
 */

import React from 'react';
import { Accordion } from '@/components/ui/accordion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  Home,
  Heart,
  BarChart3,
  MapPin
} from 'lucide-react';
import type { FamiliaConsolidada } from '@/types/familias';
import FamiliaAccordionItem from './FamiliaAccordionItem';
import { getEstadisticasFamilias } from '@/services/familias';

interface FamiliasAccordionListProps {
  familias: FamiliaConsolidada[];
  isLoading?: boolean;
}

const FamiliasAccordionList: React.FC<FamiliasAccordionListProps> = ({ 
  familias, 
  isLoading = false 
}) => {
  // Calcular estadísticas
  const estadisticas = getEstadisticasFamilias(familias);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
        <p className="text-sm text-muted-foreground">Cargando familias...</p>
      </div>
    );
  }

  if (!familias || familias.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Users className="h-16 w-16 text-muted-foreground/40 mb-4" />
        <h3 className="text-lg font-semibold mb-2">No se encontraron familias</h3>
        <p className="text-sm text-muted-foreground max-w-md">
          No hay familias que coincidan con los filtros seleccionados. 
          Intenta ajustar los criterios de búsqueda.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estadísticas generales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-primary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Familias</p>
                <p className="text-2xl font-bold">{estadisticas.totalFamilias}</p>
              </div>
              <Home className="h-8 w-8 text-primary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Miembros</p>
                <p className="text-2xl font-bold">{estadisticas.totalMiembros}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-secondary/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Promedio por Familia</p>
                <p className="text-2xl font-bold">{estadisticas.promedioMiembrosPorFamilia}</p>
              </div>
              <BarChart3 className="h-8 w-8 text-secondary/60" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-500/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Difuntos</p>
                <p className="text-2xl font-bold">{estadisticas.totalDifuntos}</p>
              </div>
              <Heart className="h-8 w-8 text-red-500/60" />
            </div>
          </CardContent>
        </Card>
      </div>

      
      {/* Lista de familias en acordeón */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Listado de Familias
          </CardTitle>
          <CardDescription>
            Haz clic en cada familia para ver los detalles completos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {familias.map((familia, index) => (
              <FamiliaAccordionItem
                key={familia.id_familia}
                familia={familia}
                index={index}
              />
            ))}
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
};

export default FamiliasAccordionList;
