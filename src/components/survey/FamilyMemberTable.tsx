import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { FamilyMember } from "@/types/survey";
import './FamilyMemberTable.module.css';

interface FamilyMemberTableProps {
  familyMembers: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onAddFirst: () => void;
}

/**
 * Componente para mostrar la tabla de miembros familiares con funcionalidad de edición y eliminación
 * Separado del componente principal para mejor legibilidad y reutilización
 */
const FamilyMemberTable = ({ familyMembers, onEdit, onDelete, onAddFirst }: FamilyMemberTableProps) => {
  // Helper para obtener el texto de display de ConfigurationItem
  const getDisplayText = (item: any, fallback = 'No especificado'): string => {
    if (typeof item === 'object' && item && item.nombre) {
      return item.nombre;
    }
    return typeof item === 'string' && item ? item : fallback;
  };

  // Add click handler to ensure interactivity
  const handleTableInteraction = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  if (familyMembers.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border dark:border-border rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500 mb-4 font-medium">No hay miembros familiares agregados</p>
          <Button 
            variant="outline" 
            onClick={onAddFirst}
            className="flex items-center gap-2 border-2 border-gray-300 hover:border-blue-400 rounded-xl transition-all duration-200"
          >
            <Plus className="w-4 h-4" />
            Agregar primer miembro
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div 
      className="familyMemberTableContainer border-2 border-gray-400 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-card relative z-10"
      onClick={handleTableInteraction}
      onMouseDown={(e) => e.stopPropagation()}
      onMouseUp={(e) => e.stopPropagation()}
      style={{ 
        pointerEvents: 'auto', 
        position: 'relative', 
        zIndex: 50,
        isolation: 'isolate'
      }}
    >
      <div className="overflow-x-auto">
        <Table className="familyMemberTable relative">
          <TableHeader className="bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 sticky top-0 z-20">
            <TableRow className="border-b-2 border-gray-300 dark:border-border">
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Nombres</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Fecha Nac.</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Tipo ID</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Sexo</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Parentesco</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Estado Civil</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground p-4 text-sm">Estudio</TableHead>
              <TableHead className="font-bold text-gray-900 dark:text-foreground text-center p-4 text-sm">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="relative">
            {familyMembers.map((member, index) => {
              // Asegurar clave única y validar datos del miembro
              const safeKey = member?.id ? `member-${member.id}` : `member-index-${index}`;
              
              // Verificación de seguridad: saltar si el miembro es inválido
              if (!member || !member.nombres) {
                console.warn(`⚠️ Miembro inválido encontrado en índice ${index}:`, member);
                return null;
              }
              
              return (
                <TableRow 
                  key={safeKey}
                  className={`tableRow hover:bg-blue-50 dark:hover:bg-muted/50 transition-colors duration-200 border-b border-gray-200 dark:border-border cursor-pointer relative ${
                    index % 2 === 0 ? 'bg-muted/20 dark:bg-muted/20' : 'bg-white dark:bg-card'
                  }`}
                  style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
                >
                  <TableCell className="font-medium p-4 text-foreground dark:text-foreground">
                {member.nombres}
              </TableCell>
              <TableCell className="p-4 text-gray-700 dark:text-muted-foreground text-sm">
                {member.fechaNacimiento 
                  ? format(member.fechaNacimiento, "dd/MM/yyyy", { locale: es })
                  : 'No especificado'
                }
              </TableCell>
              <TableCell className="p-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-600">
                  {getDisplayText(member.tipoIdentificacion, 'N/A')}
                </span>
              </TableCell>
              <TableCell className="p-4">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border ${
                  getDisplayText(member.sexo) === 'Hombre' 
                    ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-600' 
                    : 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-600'
                }`}>
                  {getDisplayText(member.sexo, 'N/A')}
                </span>
              </TableCell>
              <TableCell className="p-4 text-gray-700 dark:text-muted-foreground text-sm">
                {getDisplayText(member.parentesco)}
              </TableCell>
              <TableCell className="p-4 text-gray-700 dark:text-muted-foreground text-sm">
                {getDisplayText(member.situacionCivil)}
              </TableCell>
              <TableCell className="p-4">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-800 border border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600">
                  {getDisplayText(member.estudio, 'N/A')}
                </span>
              </TableCell>
              <TableCell className="p-4">
                <div className="actionButtons flex gap-2 justify-center" style={{ pointerEvents: 'auto', position: 'relative', zIndex: 10 }}>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(member);
                    }}
                    className="hover:bg-blue-50 hover:border-blue-300 rounded-xl border-2 transition-all duration-200 dark:hover:bg-blue-900/20 dark:hover:border-blue-600 relative z-20"
                    style={{ pointerEvents: 'auto' }}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(member.id);
                    }}
                    className="hover:bg-red-600 rounded-xl transition-all duration-200 relative z-20"
                    style={{ pointerEvents: 'auto' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default FamilyMemberTable;
