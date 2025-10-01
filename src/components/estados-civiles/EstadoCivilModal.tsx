import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
    }
  });



  // Cargar datos del estado civil a editar
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && estadoCivil) {
        reset({
          nombre: estadoCivil.nombre,
          descripcion: estadoCivil.descripcion,
        });
      } else {
        reset({
          nombre: '',
          descripcion: '',
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
