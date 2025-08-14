import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Parroquia, ParroquiaCreate, ParroquiaUpdate } from '@/types/parroquias';
import { Church, Loader2 } from 'lucide-react';

// Esquema de validación
const parroquiaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(100, 'El nombre no puede exceder 100 caracteres'),
  direccion: z.string().optional().or(z.literal('')),
  telefono: z.string().optional().or(z.literal('')),
  email: z.string().email('Email inválido').optional().or(z.literal('')),
  id_municipio: z.string().min(1, 'Debe seleccionar un municipio'),
});

type ParroquiaFormData = z.infer<typeof parroquiaSchema>;

interface ParroquiaFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ParroquiaCreate | ParroquiaUpdate) => void;
  parroquia?: Parroquia | null;
  loading?: boolean;
  mode?: 'create' | 'edit';
  municipios?: Array<{ id_municipio: string; nombre_municipio: string }>;
}

export const ParroquiaForm: React.FC<ParroquiaFormProps> = ({
  open,
  onOpenChange,
  onSubmit,
  parroquia,
  loading = false,
  mode = 'create',
  municipios = [],
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<ParroquiaFormData>({
    resolver: zodResolver(parroquiaSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      telefono: '',
      email: '',
      id_municipio: '',
    },
  });

  // Efecto para cargar datos del parroquia en modo edición
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && parroquia) {
        form.reset({
          nombre: parroquia.nombre || '',
          direccion: parroquia.direccion || '',
          telefono: parroquia.telefono || '',
          email: parroquia.email || '',
          id_municipio: parroquia.id_municipio || '',
        });
      } else {
        form.reset({
          nombre: '',
          direccion: '',
          telefono: '',
          email: '',
          id_municipio: '',
        });
      }
    }
  }, [open, mode, parroquia, form]);

  const handleSubmit = async (data: ParroquiaFormData) => {
    setIsSubmitting(true);
    try {
      const submitData = {
        nombre: data.nombre.trim(),
        direccion: data.direccion?.trim() || undefined,
        telefono: data.telefono?.trim() || undefined,
        email: data.email?.trim() || undefined,
        id_municipio: data.id_municipio,
      };

      await onSubmit(submitData);
      onOpenChange(false);
      form.reset();
    } catch (error) {
      console.error('Error al enviar formulario:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    onOpenChange(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Church className="w-5 h-5 text-primary" />
            {mode === 'create' ? 'Nueva Parroquia' : 'Editar Parroquia'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Completa los datos para crear una nueva parroquia'
              : 'Modifica los datos de la parroquia'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nombre */}
              <FormField
                control={form.control}
                name="nombre"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Nombre de la Parroquia</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: Parroquia San Juan"
                        {...field}
                        disabled={loading || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Dirección */}
              <FormField
                control={form.control}
                name="direccion"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Ej: Calle 10 # 20-30, Barrio Centro"
                        rows={2}
                        {...field}
                        disabled={loading || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Teléfono */}
              <FormField
                control={form.control}
                name="telefono"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ej: +57 300 123 4567"
                        {...field}
                        disabled={loading || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Ej: contacto@parroquia.com"
                        {...field}
                        disabled={loading || isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Municipio */}
              <FormField
                control={form.control}
                name="id_municipio"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Municipio</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value)}
                      value={field.value}
                      disabled={loading || isSubmitting}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un municipio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {municipios.map((municipio) => (
                          <SelectItem 
                            key={municipio.id_municipio} 
                            value={municipio.id_municipio}
                          >
                            {municipio.nombre_municipio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={loading || isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={loading || isSubmitting}
              >
                {(loading || isSubmitting) && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {mode === 'create' ? 'Crear Parroquia' : 'Guardar Cambios'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ParroquiaForm;
