import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import ModernDatePicker from "@/components/ui/modern-date-picker";
import { Plus, Trash2, AlertCircle, Edit, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { DeceasedFamilyMember } from "@/types/survey";

interface DeceasedGridProps {
  deceasedMembers: DeceasedFamilyMember[];
  setDeceasedMembers: React.Dispatch<React.SetStateAction<DeceasedFamilyMember[]>>;
}

// Esquema de validación con Zod
const deceasedMemberSchema = z.object({
  nombres: z.string().min(1, "El nombre es obligatorio").min(2, "El nombre debe tener al menos 2 caracteres"),
  fechaAniversario: z.date().optional().nullable(),
  eraPadre: z.boolean().optional(),
  eraMadre: z.boolean().optional(),
});

type DeceasedMemberFormData = z.infer<typeof deceasedMemberSchema>;

const DeceasedGrid = ({ deceasedMembers, setDeceasedMembers }: DeceasedGridProps) => {
  const [showDeceasedDialog, setShowDeceasedDialog] = useState(false);
  const [editingDeceasedMember, setEditingDeceasedMember] = useState<DeceasedFamilyMember | null>(null);
  const { toast } = useToast();

  // Configuración de React Hook Form
  const form = useForm<DeceasedMemberFormData>({
    resolver: zodResolver(deceasedMemberSchema),
    defaultValues: {
      nombres: '',
      fechaAniversario: null,
      eraPadre: false,
      eraMadre: false,
    }
  });

  const resetForm = () => {
    setEditingDeceasedMember(null);
    form.reset({
      nombres: '',
      fechaAniversario: null,
      eraPadre: false,
      eraMadre: false,
    });
    setShowDeceasedDialog(false);
  };

  const onSubmit = (data: DeceasedMemberFormData) => {
    if (editingDeceasedMember) {
      setDeceasedMembers(prev => prev.map(m => 
        m.id === editingDeceasedMember.id ? { ...data, id: m.id } as DeceasedFamilyMember : m
      ));
      toast({ 
        title: "Difunto actualizado", 
        description: "Datos actualizados correctamente.",
        duration: 3000
      });
    } else {
      setDeceasedMembers(prev => [...prev, { 
        ...data, 
        id: Date.now().toString() 
      } as DeceasedFamilyMember]);
      toast({ 
        title: "Difunto agregado", 
        description: "Nuevo difunto agregado a la lista.",
        duration: 3000
      });
    }
    resetForm();
  };

  const handleEdit = (member: DeceasedFamilyMember) => {
    setEditingDeceasedMember(member);
    form.reset(member);
    setShowDeceasedDialog(true);
  };

  const handleDelete = (id: string) => {
    setDeceasedMembers(prev => prev.filter(m => m.id !== id));
    toast({ 
      title: "Difunto eliminado", 
      description: "El difunto ha sido eliminado de la lista.",
      duration: 3000
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Difuntos de la Familia</h3>
          <p className="text-sm text-gray-600">Agregue información sobre familiares difuntos y fechas de aniversario</p>
        </div>
        
        <Dialog open={showDeceasedDialog} onOpenChange={setShowDeceasedDialog}>
          <DialogTrigger asChild>
            <Button 
              onClick={() => resetForm()} 
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2.5"
            >
              <Plus className="w-4 h-4" />
              Agregar Difunto
            </Button>
          </DialogTrigger>
          
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-2 border-gray-300 rounded-2xl shadow-2xl">
            <DialogHeader className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-t-2xl border-b border-gray-200 p-6">
              <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                {editingDeceasedMember ? 'Editar Familiar Difunto' : 'Agregar Familiar Difunto'}
              </DialogTitle>
              <DialogDescription className="text-gray-600 mt-2">
                Complete los campos requeridos. Los campos marcados con * son obligatorios.
              </DialogDescription>
            </DialogHeader>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-6 p-6 bg-gray-50 rounded-xl">
                  
                  {/* Nombres */}
                  <FormField
                    control={form.control}
                    name="nombres"
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FormLabel className="text-gray-800 font-bold text-sm flex items-center gap-1">
                          Nombres y Apellidos *
                          <AlertCircle className="w-3 h-3 text-red-500" />
                        </FormLabel>
                        <FormControl>
                          <Input 
                            {...field} 
                            className="bg-gray-100 border-2 border-gray-400 text-gray-900 font-semibold rounded-xl focus:bg-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 hover:bg-gray-200 hover:border-gray-500 transition-all duration-200"
                            placeholder="Ingrese nombres y apellidos completos"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  {/* Fecha de Aniversario */}
                  <FormField
                    control={form.control}
                    name="fechaAniversario"
                    render={({ field }) => (
                      <FormItem className="space-y-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                        <FormLabel className="text-gray-800 font-bold text-sm flex items-center gap-1">
                          <Calendar className="w-4 h-4 text-purple-600" />
                          Fecha de Aniversario
                        </FormLabel>
                        <FormControl>
                          <ModernDatePicker
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Seleccionar fecha de aniversario"
                          />
                        </FormControl>
                        <FormMessage className="text-red-600 text-xs font-medium" />
                      </FormItem>
                    )}
                  />

                  {/* Checkboxes para Padre/Madre */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="eraPadre"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-5 h-5 border-2 border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="text-gray-800 font-bold text-sm cursor-pointer">
                              ¿Era Padre?
                            </FormLabel>
                          </div>
                          <FormMessage className="text-red-600 text-xs font-medium" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="eraMadre"
                      render={({ field }) => (
                        <FormItem className="space-y-2 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                          <div className="flex items-center space-x-2">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                                className="w-5 h-5 border-2 border-purple-500 data-[state=checked]:bg-purple-600 data-[state=checked]:border-purple-600"
                              />
                            </FormControl>
                            <FormLabel className="text-gray-800 font-bold text-sm cursor-pointer">
                              ¿Era Madre?
                            </FormLabel>
                          </div>
                          <FormMessage className="text-red-600 text-xs font-medium" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <DialogFooter className="gap-2 p-6">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={resetForm}
                    className="px-6 py-2 border-2 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit"
                    className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200"
                  >
                    {editingDeceasedMember ? 'Actualizar' : 'Agregar'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabla de difuntos */}
      {deceasedMembers.length > 0 ? (
        <Card className="shadow-lg border-gray-200 rounded-xl bg-white overflow-hidden">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-purple-50 to-pink-50 border-b-2 border-gray-200">
                    <TableHead className="text-gray-800 font-bold text-sm py-4 px-6">Nombres y Apellidos</TableHead>
                    <TableHead className="text-gray-800 font-bold text-sm py-4 px-6">Fecha de Aniversario</TableHead>
                    <TableHead className="text-gray-800 font-bold text-sm py-4 px-6">Era Padre</TableHead>
                    <TableHead className="text-gray-800 font-bold text-sm py-4 px-6">Era Madre</TableHead>
                    <TableHead className="text-gray-800 font-bold text-sm py-4 px-6 text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {deceasedMembers.map((member) => (
                    <TableRow key={member.id} className="hover:bg-gray-50 border-b border-gray-100 transition-colors duration-200">
                      <TableCell className="py-4 px-6 font-medium text-gray-900">{member.nombres}</TableCell>
                      <TableCell className="py-4 px-6 text-gray-700">
                        {member.fechaAniversario ? format(member.fechaAniversario, "dd 'de' MMMM, yyyy", { locale: es }) : 'No especificada'}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          member.eraPadre 
                            ? "bg-blue-100 text-blue-800" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {member.eraPadre ? 'Sí' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <span className={cn(
                          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                          member.eraMadre 
                            ? "bg-pink-100 text-pink-800" 
                            : "bg-gray-100 text-gray-600"
                        )}>
                          {member.eraMadre ? 'Sí' : 'No'}
                        </span>
                      </TableCell>
                      <TableCell className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(member)}
                            className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 hover:border-blue-300 rounded-lg shadow-sm transition-all duration-200 p-2"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDelete(member.id)}
                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 hover:border-red-300 rounded-lg shadow-sm transition-all duration-200 p-2"
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
      ) : (
        <Card className="shadow-lg border-gray-200 rounded-xl bg-white">
          <CardContent className="p-8 text-center">
            <div className="text-gray-400 mb-4">
              <Calendar className="w-12 h-12 mx-auto" />
            </div>
            <h4 className="text-lg font-semibold text-gray-600 mb-2">No hay difuntos registrados</h4>
            <p className="text-gray-500 mb-4">Agregue información sobre familiares difuntos para recordar sus aniversarios.</p>
            <Button 
              onClick={() => {
                resetForm();
                setShowDeceasedDialog(true);
              }} 
              className="bg-purple-600 hover:bg-purple-700 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 px-6 py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Primer Difunto
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DeceasedGrid;
