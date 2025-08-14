import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader2, Droplets } from "lucide-react";
import { AguaResidual, AguaResidualCreate, AguaResidualUpdate } from "@/types/aguas-residuales";

interface AguaResidualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AguaResidualCreate | AguaResidualUpdate) => Promise<boolean>;
  aguaResidual?: AguaResidual | null;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export const AguaResidualModal: React.FC<AguaResidualModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  aguaResidual,
  mode,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
  });

  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
  });

  // Resetear formulario cuando cambia el modo o el agua residual
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && aguaResidual) {
        setFormData({
          nombre: aguaResidual.nombre || '',
          descripcion: aguaResidual.descripcion || '',
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
        });
      }
      setErrors({ nombre: '', descripcion: '' });
    }
  }, [isOpen, mode, aguaResidual]);

  const validateForm = (): boolean => {
    const newErrors = {
      nombre: '',
      descripcion: '',
    };

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es requerido';
    } else if (formData.nombre.trim().length < 2) {
      newErrors.nombre = 'El nombre debe tener al menos 2 caracteres';
    } else if (formData.nombre.trim().length > 100) {
      newErrors.nombre = 'El nombre no puede exceder 100 caracteres';
    }

    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    } else if (formData.descripcion.trim().length < 5) {
      newErrors.descripcion = 'La descripción debe tener al menos 5 caracteres';
    } else if (formData.descripcion.trim().length > 500) {
      newErrors.descripcion = 'La descripción no puede exceder 500 caracteres';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const success = await onSubmit({
      nombre: formData.nombre.trim(),
      descripcion: formData.descripcion.trim(),
    });

    if (success) {
      onClose();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Droplets className="w-5 h-5 text-blue-600" />
            {mode === 'create' ? 'Crear Tipo de Agua Residual' : 'Editar Tipo de Agua Residual'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crea un nuevo tipo de agua residual en el sistema'
              : 'Modifica los datos del tipo de agua residual'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Campo Nombre */}
          <div className="space-y-2">
            <Label htmlFor="nombre">
              Nombre <span className="text-red-500">*</span>
            </Label>
            <Input
              id="nombre"
              type="text"
              value={formData.nombre}
              onChange={(e) => handleInputChange('nombre', e.target.value)}
              placeholder="Ej: Alcantarillado Público"
              disabled={isLoading}
              className={errors.nombre ? 'border-red-500' : ''}
            />
            {errors.nombre && (
              <p className="text-sm text-red-600">{errors.nombre}</p>
            )}
          </div>

          {/* Campo Descripción */}
          <div className="space-y-2">
            <Label htmlFor="descripcion">
              Descripción <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="descripcion"
              value={formData.descripcion}
              onChange={(e) => handleInputChange('descripcion', e.target.value)}
              placeholder="Ej: Sistema de alcantarillado municipal"
              rows={3}
              disabled={isLoading}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {mode === 'create' ? 'Creando...' : 'Actualizando...'}
                </>
              ) : (
                mode === 'create' ? 'Crear' : 'Actualizar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
