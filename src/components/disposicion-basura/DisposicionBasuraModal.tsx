import React, { useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Trash2, Loader2 } from "lucide-react";
import { DisposicionBasura, CreateDisposicionBasuraRequest, UpdateDisposicionBasuraRequest } from "@/types/disposicion-basura";

// Esquema de validación
const disposicionBasuraSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido").max(100, "El nombre no puede exceder 100 caracteres"),
  descripcion: z.string().min(1, "La descripción es requerida").max(500, "La descripción no puede exceder 500 caracteres"),
});

type DisposicionBasuraFormData = z.infer<typeof disposicionBasuraSchema>;

interface DisposicionBasuraModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDisposicionBasuraRequest | UpdateDisposicionBasuraRequest) => Promise<void>;
  disposicionBasura: DisposicionBasura | null;
  mode: 'create' | 'edit';
}

export const DisposicionBasuraModal: React.FC<DisposicionBasuraModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  disposicionBasura,
  mode,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<DisposicionBasuraFormData>({
    resolver: zodResolver(disposicionBasuraSchema),
    defaultValues: {
      nombre: '',
      descripcion: '',
    }
  });

  // Cargar datos del tipo de disposición a editar
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && disposicionBasura) {
        reset({
          nombre: disposicionBasura.nombre,
          descripcion: disposicionBasura.descripcion,
        });
      } else {
        reset({
          nombre: '',
          descripcion: '',
        });
      }
    }
  }, [isOpen, mode, disposicionBasura, reset]);

  const handleFormSubmit = async (data: DisposicionBasuraFormData) => {
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
          <DialogTitle className="flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            {mode === 'create' ? 'Crear Tipo de Disposición' : 'Editar Tipo de Disposición'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crea un nuevo tipo de disposición de basura en el sistema' 
              : 'Modifica la información del tipo de disposición de basura'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              placeholder="ej. Recolección Pública"
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
              placeholder="ej. Servicio de recolección municipal"
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
