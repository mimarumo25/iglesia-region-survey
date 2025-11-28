import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ResponsiveTable } from "@/components/ui/responsive-table";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { FamilyMember } from "@/types/survey";
import { Badge } from "@/components/ui/badge";
import './FamilyMemberTable.module.css';

interface FamilyMemberTableProps {
  familyMembers: FamilyMember[];
  onEdit: (member: FamilyMember) => void;
  onDelete: (id: string) => void;
  onAddFirst: () => void;
}

/**
 * Componente para mostrar la tabla de miembros familiares con funcionalidad de edición y eliminación
 * Totalmente responsive que se adapta a móviles y desktop
 */
const FamilyMemberTable = ({ familyMembers, onEdit, onDelete, onAddFirst }: FamilyMemberTableProps) => {
  // Helper para obtener el texto de display de ConfigurationItem
  const getDisplayText = (item: any, fallback = 'No especificado'): string => {
    if (typeof item === 'object' && item && item.nombre) {
      return item.nombre;
    }
    return typeof item === 'string' && item ? item : fallback;
  };

  if (familyMembers.length === 0) {
    return (
      <Card className="border-dashed border-2 border-border dark:border-border rounded-2xl">
        <CardContent className="flex flex-col items-center justify-center py-6 sm:py-8 px-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-3 sm:mb-4">
            <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
          </div>
          <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-3 sm:mb-4 font-medium text-center">
            No hay miembros familiares agregados
          </p>
          <Button 
            variant="outline" 
            onClick={onAddFirst}
            className="flex items-center gap-2 w-full sm:w-auto h-11 sm:h-10 border-2 border-gray-300 hover:border-blue-400 rounded-xl transition-all duration-200 touch-manipulation"
          >
            <Plus className="w-4 h-4" />
            Agregar primer miembro
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="border-2 border-gray-400 dark:border-gray-600 rounded-2xl overflow-hidden shadow-lg bg-white dark:bg-card">
      <ResponsiveTable
        data={familyMembers}
        columns={[
          {
            key: 'nombres',
            label: 'Nombres',
            priority: 'high',
            render: (value) => (
              <span className="font-medium text-foreground dark:text-foreground">
                {value}
              </span>
            ),
          },
          {
            key: 'fechaNacimiento',
            label: 'Fecha Nac.',
            priority: 'medium',
            hideOnMobile: true,
            render: (value) => (
              <span className="text-gray-700 dark:text-muted-foreground text-sm">
                {value 
                  ? format(value, "dd/MM/yyyy", { locale: es })
                  : 'No especificado'
                }
              </span>
            ),
          },
          {
            key: 'tipoIdentificacion',
            label: 'Tipo ID',
            priority: 'low',
            hideOnMobile: true,
            render: (value) => (
              <Badge variant="outline" className="text-xs bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-600">
                {getDisplayText(value, 'N/A')}
              </Badge>
            ),
          },
          {
            key: 'sexo',
            label: 'Sexo',
            priority: 'medium',
            render: (value) => (
              <Badge 
                variant="outline" 
                className={`text-xs border ${
                  getDisplayText(value) === 'Hombre' 
                    ? 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-600' 
                    : 'bg-pink-100 text-pink-800 border-pink-300 dark:bg-pink-900/20 dark:text-pink-400 dark:border-pink-600'
                }`}
              >
                {getDisplayText(value, 'N/A')}
              </Badge>
            ),
          },
          {
            key: 'parentesco',
            label: 'Parentesco',
            priority: 'high',
            render: (value) => (
              <span className="text-gray-700 dark:text-muted-foreground text-sm">
                {getDisplayText(value)}
              </span>
            ),
          },
          {
            key: 'situacionCivil',
            label: 'Estado Civil',
            priority: 'low',
            hideOnMobile: true,
            render: (value) => (
              <span className="text-gray-700 dark:text-muted-foreground text-sm">
                {getDisplayText(value)}
              </span>
            ),
          },
          {
            key: 'estudio',
            label: 'Estudio',
            priority: 'low',
            hideOnMobile: true,
            render: (value) => (
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-600">
                {getDisplayText(value, 'N/A')}
              </Badge>
            ),
          },
        ]}
        actions={[
          {
            label: 'Editar',
            icon: <Edit2 className="w-4 h-4" />,
            onClick: onEdit,
            variant: 'outline',
            primary: true,
          },
          {
            label: 'Eliminar',
            icon: <Trash2 className="w-4 h-4" />,
            onClick: (member) => onDelete(member.id),
            variant: 'destructive',
            primary: false,
          },
        ]}
        itemKey="id"
        className="familyMemberTableContainer"
      />
    </div>
  );
};

export default FamilyMemberTable;
