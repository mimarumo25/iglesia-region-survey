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
import { Switch } from "@/components/ui/switch";
import { Loader2, Users } from "lucide-react";
import { Parentesco, ParentescoCreate, ParentescoUpdate } from "@/types/parentescos";

interface ParentescoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ParentescoCreate | ParentescoUpdate) => Promise<boolean>;
  parentesco?: Parentesco | null;
  mode: 'create' | 'edit';
  isLoading?: boolean;
}

export const ParentescoModal: React.FC<ParentescoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  parentesco,
  mode,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    activo: true,
  });

  const [errors, setErrors] = useState({
    nombre: '',
    descripcion: '',
  });

  // Resetear formulario cuando cambia el modo o el parentesco
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && parentesco) {
        setFormData({
          nombre: parentesco.nombre || '',
          descripcion: parentesco.descripcion || '',
          activo: parentesco.activo !== undefined ? parentesco.activo : true,
        });
      } else {
        setFormData({
          nombre: '',
          descripcion: '',
          activo: true,
        });
      }
      setErrors({ nombre: '', descripcion: '' });
    }
  }, [isOpen, mode, parentesco]);

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
      activo: formData.activo,
    });

    if (success) {
      onClose();
    }
  };

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpiar error cuando el usuario empiece a escribir
    if (field !== 'activo' && errors[field as keyof typeof errors]) {
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
            <Users className="w-5 h-5 text-purple-600" />
            {mode === 'create' ? 'Crear Parentesco' : 'Editar Parentesco'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Crea un nuevo tipo de parentesco en el sistema'
              : 'Modifica los datos del parentesco'
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
              placeholder="Ej: Padre, Madre, Hijo, Hermano"
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
              placeholder="Ej: Padre biológico o adoptivo"
              rows={3}
              disabled={isLoading}
              className={errors.descripcion ? 'border-red-500' : ''}
            />
            {errors.descripcion && (
              <p className="text-sm text-red-600">{errors.descripcion}</p>
            )}
          </div>

          {/* Campo Activo */}
          <div className="flex items-center space-x-2">
            <Switch
              id="activo"
              checked={formData.activo}
              onCheckedChange={(checked) => handleInputChange('activo', checked)}
              disabled={isLoading}
            />
            <Label htmlFor="activo" className="text-sm font-medium">
              Activo
            </Label>
            <span className="text-sm text-gray-500">
              {formData.activo ? '(Disponible para seleccionar)' : '(No disponible)'}
            </span>
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
