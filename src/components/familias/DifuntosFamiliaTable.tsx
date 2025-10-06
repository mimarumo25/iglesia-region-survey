/**
 * 🕊️ Tabla de Difuntos de Familia - Sistema MIA
 * 
 * Componente que muestra todos los difuntos registrados de una familia
 * en formato de tabla responsive con información de fallecimiento
 * 
 * @module components/familias/DifuntosFamiliaTable
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { 
  User, 
  Calendar, 
  Heart,
  Users
} from 'lucide-react';
import type { DifuntoFamilia } from '@/types/familias';

interface DifuntosFamiliaTableProps {
  difuntos: DifuntoFamilia[];
}

/**
 * Formatea una fecha ISO a formato legible
 */
const formatearFecha = (fecha: string): string => {
  try {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return fecha;
  }
};

/**
 * Calcula el tiempo transcurrido desde el fallecimiento
 */
const calcularTiempoTranscurrido = (fechaFallecimiento: string): string => {
  try {
    const hoy = new Date();
    const fallecimiento = new Date(fechaFallecimiento);
    const diferencia = hoy.getTime() - fallecimiento.getTime();
    const años = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 365));
    
    if (años === 0) {
      const meses = Math.floor(diferencia / (1000 * 60 * 60 * 24 * 30));
      return `Hace ${meses} ${meses === 1 ? 'mes' : 'meses'}`;
    }
    
    return `Hace ${años} ${años === 1 ? 'año' : 'años'}`;
  } catch {
    return '';
  }
};

const DifuntosFamiliaTable: React.FC<DifuntosFamiliaTableProps> = ({ difuntos }) => {
  if (!difuntos || difuntos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <Users className="h-12 w-12 text-muted-foreground/40 mb-3" />
        <p className="text-sm text-muted-foreground">
          No hay difuntos registrados en esta familia
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Vista de tabla para pantallas grandes */}
      <div className="hidden lg:block overflow-x-auto rounded-md border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="p-3 text-left text-sm font-semibold">Nombre del Difunto</th>
              <th className="p-3 text-left text-sm font-semibold">Fecha de Fallecimiento</th>
              <th className="p-3 text-left text-sm font-semibold">Sexo</th>
              <th className="p-3 text-left text-sm font-semibold">Parentesco</th>
              <th className="p-3 text-left text-sm font-semibold">Causa de Fallecimiento</th>
            </tr>
          </thead>
          <tbody>
            {difuntos.map((difunto, index) => (
              <tr 
                key={`difunto-${index}`}
                className="border-t hover:bg-muted/50 transition-colors"
              >
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold">{difunto.nombre_difunto}</span>
                  </div>
                </td>
                <td className="p-3">
                  <div className="flex flex-col">
                    <span className="text-sm">{formatearFecha(difunto.fecha_fallecimiento)}</span>
                    <span className="text-xs text-muted-foreground">
                      {calcularTiempoTranscurrido(difunto.fecha_fallecimiento)}
                    </span>
                  </div>
                </td>
                <td className="p-3 text-sm">{difunto.sexo}</td>
                <td className="p-3">
                  <Badge variant="outline">{difunto.parentesco}</Badge>
                </td>
                <td className="p-3">
                  <div className="flex items-start gap-1">
                    <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                    <span className="text-sm">{difunto.causa_fallecimiento}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Vista de cards para pantallas pequeñas y medianas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {difuntos.map((difunto, index) => (
          <Card 
            key={`difunto-${index}`}
            className="hover:shadow-md transition-shadow border-muted-foreground/20"
          >
            <CardContent className="p-4 space-y-3">
              {/* Header del difunto */}
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <h4 className="font-semibold text-sm">{difunto.nombre_difunto}</h4>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {difunto.parentesco}
                  </Badge>
                </div>
              </div>

              {/* Información básica */}
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Fecha de Fallecimiento
                    </div>
                    <div className="text-sm">{formatearFecha(difunto.fecha_fallecimiento)}</div>
                    <div className="text-xs text-muted-foreground">
                      {calcularTiempoTranscurrido(difunto.fecha_fallecimiento)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-medium text-muted-foreground">Sexo:</span>
                  <span>{difunto.sexo}</span>
                </div>

                <div className="flex items-start gap-2 pt-2 border-t">
                  <Heart className="h-4 w-4 text-red-500 mt-0.5" />
                  <div className="flex-1">
                    <div className="text-xs font-medium text-muted-foreground">
                      Causa de Fallecimiento
                    </div>
                    <div className="text-sm text-red-600">{difunto.causa_fallecimiento}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DifuntosFamiliaTable;
