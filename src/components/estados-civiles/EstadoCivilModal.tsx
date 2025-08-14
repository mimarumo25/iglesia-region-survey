import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Heart, Loader2 } from "lucide-react";
import { EstadoCivil, CreateEstadoCivilRequest, UpdateEstadoCivilRequest } from "@/types/estados-civiles";

// Esquema de validación
const estadoCivilSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z.string().min(1, "La descripción es requerida").max(500, "La descripción no puede exceder 500 caracteres"),
  codigo: z.string().min(1, "El código es requerido").max(10, "El código no puede exceder 10 caracteres").regex(/^[A-Z0-9]+$/, "El código solo puede contener letras mayúsculas y números"),
  orden: z.number().min(1, "El orden debe ser mayor a 0").max(999, "El orden no puede ser mayor a 999"),
  activo: z.boolean(),
});

type EstadoCivilFormData = z.infer<typeof estadoCivilSchema>;

interface EstadoCivilModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateEstadoCivilRequest | UpdateEstadoCivilRequest) => Promise<void>;
  estadoCivil: EstadoCivil | null;
  mode: 'create' | 'edit';
}

export const EstadoCivilModal: React.FC<EstadoCivilModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  estadoCivil,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting }
  } = useForm<EstadoCivilFormData>({
    resolver: zodResolver(estadoCivilSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      codigo: '',
      orden: 1,
      activo: true,
    }
  });

  // Observar el valor del switch
  const activoValue = watch('activo');

  // Cargar datos del estado civil a editar
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && estadoCivil) {
        reset({
          nombre: estadoCivil.nombre,
          descripcion: estadoCivil.descripcion,
          codigo: estadoCivil.codigo,
          orden: estadoCivil.orden,
          activo: estadoCivil.activo,
        });
      } else {
        reset({
          nombre: '',
          descripcion: '',
          codigo: '',
          orden: 1,
          activo: true,
        });
      }
    }
  }, [isOpen, mode, estadoCivil, reset]);

  const handleFormSubmit = async (data: EstadoCivilFormData) => {
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // El error ya se maneja en el hook, no necesitamos hacer nada aquí
    }
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-pink-700">
            <Heart className="w-5 h-5" />
            {mode === 'create' ? 'Crear Estado Civil' : 'Editar Estado Civil'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crea un nuevo estado civil en el sistema' 
              : 'Modifica la información del estado civil'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Nombre */}
            <div className="space-y-2">
              <Label htmlFor="nombre">
                Nombre <span className="text-red-500">*</span>
              </Label>
              <Input
                id="nombre"
                placeholder="ej. Soltero(a)"
                {...register('nombre')}
                className={errors.nombre ? 'border-red-500' : ''}
              />
              {errors.nombre && (
                <p className="text-sm text-red-500">{errors.nombre.message}</p>
              )}
            </div>

            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="codigo">
                Código <span className="text-red-500">*</span>
              </Label>
              <Input
                id="codigo"
                placeholder="ej. SOL"
                maxLength={10}
                style={{ textTransform: 'uppercase' }}
                {...register('codigo', {
                  onChange: (e) => {
                    e.target.value = e.target.value.toUpperCase();
                  }
                })}
                className={errors.codigo ? 'border-red-500' : ''}
              />
              {errors.codigo && (
                <p className="text-sm text-red-500">{errors.codigo.message}</p>
              )}
            </div>
          </div>

          {/* Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              placeholder="ej. Persona que no ha contraído matrimonio"
              rows={3}
              maxLength={500}
              {...register('descripcion')}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-500">{errors.descripcion.message}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Orden */}
            <div className="space-y-2">
              <Label htmlFor="orden">
                Orden <span className="text-red-500">*</span>
              </Label>
              <Input
                id="orden"
                type="number"
                min="1"
                max="999"
                placeholder="1"
                {...register('orden', { valueAsNumber: true })}
                className={errors.orden ? 'border-red-500' : ''}
              />
              {errors.orden && (
                <p className="text-sm text-red-500">{errors.orden.message}</p>
              )}
            </div>

            {/* Estado Activo */}
            <div className="space-y-2">
              <Label htmlFor="activo">Estado</Label>
              <div className="flex items-center space-x-2 pt-2">
                <Switch
                  id="activo"
                  checked={activoValue}
                  onCheckedChange={(checked) => setValue('activo', checked)}
                  className="data-[state=checked]:bg-pink-600"
                />
                <div className="grid gap-1.5 leading-none">
                  <Label htmlFor="activo" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {activoValue ? 'Activo' : 'Inactivo'}
                  </Label>
                  <p className="text-xs text-muted-foreground">
                    {activoValue ? '(Disponible para seleccionar)' : '(No disponible para seleccionar)'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-pink-600 hover:bg-pink-700"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Creando...' : 'Actualizando...'}
                </>
              ) : (
                mode === 'create' ? 'Crear' : 'Actualizar'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
