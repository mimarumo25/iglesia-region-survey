import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ParishButton } from "@/components/ui/parish-button";
import { ParishInput } from "@/components/ui/parish-input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Save, X, MapPin, FileText, Building } from "lucide-react";
import { CreateMunicipioRequest, UpdateMunicipioRequest, Municipio } from '@/services/municipios';

interface Departamento {
  id_departamento: string;
  nombre: string;
  codigo_dane: string;
}

interface MunicipioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (municipio: CreateMunicipioRequest | UpdateMunicipioRequest) => Promise<boolean>;
  municipio?: Municipio | null;
  mode: 'create' | 'edit';
  isLoading: boolean;
  departamentos: Departamento[];
}

export const MunicipioModal: React.FC<MunicipioModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  municipio,
  mode,
  isLoading,
  departamentos
}) => {
  const [formData, setFormData] = useState({
    nombre_municipio: '',
    codigo_dane: '',
    id_departamento: ''
  });

  const [errors, setErrors] = useState({
    nombre_municipio: '',
    codigo_dane: '',
    id_departamento: ''
  });

  // Resetear formulario cuando cambie el municipio o el modo
  useEffect(() => {
    if (mode === 'edit' && municipio) {
      setFormData({
        nombre_municipio: municipio.nombre_municipio,
        codigo_dane: municipio.codigo_dane,
        id_departamento: municipio.id_departamento
      });
    } else {
      setFormData({
        nombre_municipio: '',
        codigo_dane: '',
        id_departamento: ''
      });
    }
    
    // Limpiar errores
    setErrors({
      nombre_municipio: '',
      codigo_dane: '',
      id_departamento: ''
    });
  }, [municipio, mode, isOpen]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Limpiar error del campo específico
    if (errors[field as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors = {
      nombre_municipio: '',
      codigo_dane: '',
      id_departamento: ''
    };

    // Validar nombre del municipio
    if (!formData.nombre_municipio.trim()) {
      newErrors.nombre_municipio = 'El nombre del municipio es requerido';
    } else if (formData.nombre_municipio.trim().length < 2) {
      newErrors.nombre_municipio = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar código DANE
    if (!formData.codigo_dane.trim()) {
      newErrors.codigo_dane = 'El código DANE es requerido';
    } else if (!/^\d{5}$/.test(formData.codigo_dane)) {
      newErrors.codigo_dane = 'El código DANE debe tener exactamente 5 dígitos';
    }

    // Validar departamento
    if (!formData.id_departamento) {
      newErrors.id_departamento = 'Debe seleccionar un departamento';
    }

    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error !== '');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const municipioData = {
      nombre_municipio: formData.nombre_municipio.trim(),
      codigo_dane: formData.codigo_dane.trim(),
      id_departamento: parseInt(formData.id_departamento)
    };

    const success = await onSubmit(municipioData);
    
    if (success) {
      handleClose();
    }
  };

  const handleClose = () => {
    setFormData({
      nombre_municipio: '',
      codigo_dane: '',
      id_departamento: ''
    });
    setErrors({
      nombre_municipio: '',
      codigo_dane: '',
      id_departamento: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-blue-600" />
            {mode === 'create' ? 'Crear Municipio' : 'Editar Municipio'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create' 
              ? 'Complete la información para crear un nuevo municipio.'
              : 'Modifique la información del municipio seleccionado.'
            }
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            {/* Nombre del municipio */}
            <div className="space-y-2">
              <Label htmlFor="nombre_municipio">
                Nombre del Municipio <span className="text-red-500">*</span>
              </Label>
              <ParishInput
                id="nombre_municipio"
                value={formData.nombre_municipio}
                onChange={(e) => handleInputChange('nombre_municipio', e.target.value)}
                placeholder="Ej: Medellín, Bogotá D.C."
                disabled={isLoading}
                icon={Building}
              />
              {errors.nombre_municipio && (
                <p className="text-sm text-red-500">{errors.nombre_municipio}</p>
              )}
            </div>

            {/* Código DANE */}
            <div className="space-y-2">
              <Label htmlFor="codigo_dane">
                Código DANE <span className="text-red-500">*</span>
              </Label>
              <ParishInput
                id="codigo_dane"
                value={formData.codigo_dane}
                onChange={(e) => handleInputChange('codigo_dane', e.target.value)}
                placeholder="Ej: 05001, 11001"
                disabled={isLoading}
                maxLength={5}
                icon={FileText}
              />
              {errors.codigo_dane && (
                <p className="text-sm text-red-500">{errors.codigo_dane}</p>
              )}
              <p className="text-xs text-gray-500">
                Código de 5 dígitos asignado por el DANE
              </p>
            </div>

            {/* Departamento */}
            <div className="space-y-2">
              <Label htmlFor="id_departamento">
                Departamento <span className="text-red-500">*</span>
              </Label>
              <Select
                value={formData.id_departamento}
                onValueChange={(value) => handleInputChange('id_departamento', value)}
                disabled={isLoading}
              >
                <SelectTrigger className={errors.id_departamento ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Seleccione un departamento" />
                </SelectTrigger>
                <SelectContent>
                  {departamentos.map((dept) => (
                    <SelectItem key={dept.id_departamento} value={dept.id_departamento}>
                      {dept.nombre} ({dept.codigo_dane})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.id_departamento && (
                <p className="text-sm text-red-500">{errors.id_departamento}</p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2">
            <ParishButton
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </ParishButton>
            
            <ParishButton
              type="submit"
              disabled={isLoading}
              icon={isLoading ? Loader2 : Save}
              className={isLoading ? "animate-spin" : ""}
            >
              {isLoading 
                ? (mode === 'create' ? 'Creando...' : 'Guardando...')
                : (mode === 'create' ? 'Crear Municipio' : 'Guardar Cambios')
              }
            </ParishButton>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MunicipioModal;
