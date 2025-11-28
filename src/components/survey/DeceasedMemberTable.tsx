/**
 * Componente de Tabla para Mostrar Miembros Difuntos
 * 
 * Este componente maneja la visualización de la lista de familiares difuntos
 * con funcionalidades de edición y eliminación. También incluye un estado
 * vacío cuando no hay difuntos registrados.
 * 
 * Características:
 * - Tabla responsive con información de difuntos
 * - Vista de tarjetas en móvil
 * - Acciones de editar y eliminar por fila
 * - Estado vacío con call-to-action
 * - Formateo de fechas localizado
 * - Design tokens para theming
 * - Badges para categorización visual
 * - Optimizado para dispositivos móviles
 * 
 * Arquitectura:
 * - Componente presentacional puro
 * - Props tipadas para máxima seguridad
 * - Separación clara de responsabilidades
 * - Reutilizable en diferentes contextos
 * - Integrado con sistema de design tokens
 */

import React from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Edit, Trash2, Calendar, User, Heart, Users } from "lucide-react";
import { DeceasedFamilyMember } from "@/types/survey";

interface DeceasedMemberTableProps {
  deceasedMembers: DeceasedFamilyMember[];
  onEdit: (member: DeceasedFamilyMember) => void;
  onDelete: (id: string) => void;
  onAddFirst: () => void;
}

/**
 * Tarjeta móvil para mostrar un miembro difunto
 */
const DeceasedMobileCard: React.FC<{
  member: DeceasedFamilyMember;
  onEdit: () => void;
  onDelete: () => void;
}> = ({ member, onEdit, onDelete }) => (
  <div className="p-4 bg-card rounded-xl border border-border shadow-sm space-y-3">
    {/* Header con nombre y acciones */}
    <div className="flex items-start justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0 flex-1">
        <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center shrink-0">
          <Heart className="w-5 h-5 text-red-600 dark:text-red-400" />
        </div>
        <div className="min-w-0 flex-1">
          <h4 className="font-semibold text-foreground truncate text-sm">
            {member.nombres}
          </h4>
          <p className="text-xs text-muted-foreground">
            {member.fechaFallecimiento 
              ? format(member.fechaFallecimiento, "dd MMM yyyy", { locale: es })
              : 'Fecha no especificada'
            }
          </p>
        </div>
      </div>
      
      {/* Botones de acción */}
      <div className="flex items-center gap-1 shrink-0">
        <Button
          variant="ghost"
          size="sm"
          onClick={onEdit}
          className="h-9 w-9 p-0 hover:bg-blue-100 dark:hover:bg-blue-900/30 touch-manipulation"
          aria-label="Editar difunto"
        >
          <Edit className="w-4 h-4 text-blue-600 dark:text-blue-400" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="h-9 w-9 p-0 hover:bg-red-100 dark:hover:bg-red-900/30 touch-manipulation"
          aria-label="Eliminar difunto"
        >
          <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
        </Button>
      </div>
    </div>

    {/* Información en grid */}
    <div className="grid grid-cols-2 gap-2 text-sm">
      {/* Sexo */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
        <User className="w-4 h-4 text-blue-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Sexo</p>
          <p className="font-medium text-foreground truncate text-xs">
            {member.sexo?.nombre || 'No especificado'}
          </p>
        </div>
      </div>

      {/* Parentesco */}
      <div className="flex items-center gap-2 p-2 bg-muted/50 rounded-lg">
        <Users className="w-4 h-4 text-green-500 shrink-0" />
        <div className="min-w-0">
          <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Parentesco</p>
          <p className="font-medium text-foreground truncate text-xs">
            {member.parentesco?.nombre || 'No especificado'}
          </p>
        </div>
      </div>
    </div>

    {/* Causa de fallecimiento */}
    {member.causaFallecimiento && (
      <div className="p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
        <p className="text-[10px] text-muted-foreground uppercase tracking-wide mb-1">Causa</p>
        <p className="text-xs text-foreground line-clamp-2">
          {member.causaFallecimiento}
        </p>
      </div>
    )}
  </div>
);

/**
 * Tabla para mostrar y gestionar miembros difuntos
 * 
 * @param props - Props del componente
 * @returns JSX.Element
 */
const DeceasedMemberTable: React.FC<DeceasedMemberTableProps> = ({
  deceasedMembers,
  onEdit,
  onDelete,
  onAddFirst
}) => {

  // Si no hay difuntos, mostrar estado vacío
  if (deceasedMembers.length === 0) {
    return (
      <Card className="shadow-lg border-border rounded-xl bg-card dark:bg-card dark:border-border">
        <CardContent className="p-6 sm:p-8 text-center">
          <div className="text-muted-foreground mb-4">
            <Calendar className="w-10 h-10 sm:w-12 sm:h-12 mx-auto opacity-50" />
          </div>
          <h4 className="text-base sm:text-lg font-semibold text-muted-foreground dark:text-muted-foreground mb-2">
            No hay difuntos registrados
          </h4>
          <p className="text-sm text-muted-foreground dark:text-muted-foreground mb-6 max-w-md mx-auto">
            Registre información sobre familiares difuntos con detalles del fallecimiento y parentesco.
          </p>
          <Button 
            onClick={onAddFirst}
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2 touch-manipulation"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Difunto
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-lg border-border rounded-xl bg-card dark:bg-card dark:border-border overflow-hidden">
      <CardContent className="p-0">
        {/* Vista móvil: Tarjetas */}
        <div className="md:hidden p-3 space-y-3">
          {deceasedMembers.map((member) => (
            <DeceasedMobileCard
              key={member.id}
              member={member}
              onEdit={() => onEdit(member)}
              onDelete={() => onDelete(member.id)}
            />
          ))}
        </div>

        {/* Vista desktop: Tabla */}
        <div className="hidden md:block overflow-x-auto">
          <Table>
            {/* Header de la tabla */}
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-primary/10 to-secondary/10 border-b-2 border-border dark:border-border">
                <TableHead className="text-foreground dark:text-foreground font-bold text-sm py-4 px-6">
                  Nombres y Apellidos
                </TableHead>
                <TableHead className="text-foreground dark:text-foreground font-bold text-sm py-4 px-6">
                  Fecha Fallecimiento
                </TableHead>
                <TableHead className="text-foreground dark:text-foreground font-bold text-sm py-4 px-6">
                  Sexo
                </TableHead>
                <TableHead className="text-foreground dark:text-foreground font-bold text-sm py-4 px-6">
                  Parentesco
                </TableHead>
                <TableHead className="text-foreground dark:text-foreground font-bold text-sm py-4 px-6">
                  Causa Fallecimiento
                </TableHead>
                <TableHead className="text-foreground dark:text-foreground font-bold text-sm py-4 px-6 text-center">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>

            {/* Cuerpo de la tabla */}
            <TableBody>
              {deceasedMembers.map((member) => (
                <TableRow 
                  key={member.id} 
                  className="hover:bg-muted/50 border-b border-border dark:hover:bg-muted/50 dark:border-border transition-colors duration-200"
                >
                  {/* Nombres */}
                  <TableCell className="py-4 px-6 font-medium text-foreground dark:text-foreground">
                    {member.nombres}
                  </TableCell>
                  
                  {/* Fecha de fallecimiento */}
                  <TableCell className="py-4 px-6 text-muted-foreground dark:text-muted-foreground">
                    {member.fechaFallecimiento 
                      ? format(member.fechaFallecimiento, "dd 'de' MMMM, yyyy", { locale: es })
                      : 'No especificada'
                    }
                  </TableCell>
                  
                  {/* Sexo */}
                  <TableCell className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                      {member.sexo?.nombre || 'No especificado'}
                    </span>
                  </TableCell>
                  
                  {/* Parentesco */}
                  <TableCell className="py-4 px-6">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                      {member.parentesco?.nombre || 'No especificado'}
                    </span>
                  </TableCell>
                  
                  {/* Causa de fallecimiento */}
                  <TableCell className="py-4 px-6 max-w-[200px]">
                    <div 
                      className="truncate text-muted-foreground dark:text-muted-foreground" 
                      title={member.causaFallecimiento}
                    >
                      {member.causaFallecimiento || 'No especificada'}
                    </div>
                  </TableCell>
                  
                  {/* Acciones */}
                  <TableCell className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center gap-2">
                      {/* Botón Editar */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(member)}
                        className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 dark:bg-blue-900/30 dark:border-blue-700 dark:text-blue-300 dark:hover:bg-blue-900/50 rounded-lg shadow-sm transition-all duration-200 p-2"
                        title="Editar difunto"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      
                      {/* Botón Eliminar */}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDelete(member.id)}
                        className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 dark:bg-red-900/30 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/50 rounded-lg shadow-sm transition-all duration-200 p-2"
                        title="Eliminar difunto"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default DeceasedMemberTable;
