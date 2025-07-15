import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Users,
  MapPin,
  Calendar,
  Save,
  Send,
  ArrowLeft,
  Plus,
  Home,
  Phone,
  Mail,
  User
} from "lucide-react";

const NewSurvey = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    sector: "",
    familyHead: "",
    address: "",
    phone: "",
    email: "",
    familySize: "",
    housingType: "",
    observations: ""
  });

  const sectors = [
    "La Esperanza",
    "San José",
    "Cristo Rey",
    "Divino Niño",
    "Santa María",
    "El Carmen"
  ];

  const housingTypes = [
    "Casa propia",
    "Casa arrendada",
    "Apartamento propio",
    "Apartamento arrendado",
    "Casa familiar",
    "Otro"
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Lógica para guardar la encuesta
    console.log("Datos de la encuesta:", formData);
    navigate("/surveys");
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="sm"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            Nueva Encuesta de Caracterización
          </h1>
          <p className="text-gray-600">Registro de nueva familia en el sistema parroquial</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-green-600" />
              Información General
            </CardTitle>
            <CardDescription>
              Datos básicos de ubicación y contacto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sector">Sector *</Label>
                <Select value={formData.sector} onValueChange={(value) => handleInputChange("sector", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="familyHead">Jefe de Familia *</Label>
                <Input
                  id="familyHead"
                  value={formData.familyHead}
                  onChange={(e) => handleInputChange("familyHead", e.target.value)}
                  placeholder="Nombre completo"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección *</Label>
                <Input
                  id="address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                  placeholder="Dirección completa"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="Número de contacto"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="correo@ejemplo.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="familySize">Número de Integrantes</Label>
                <Input
                  id="familySize"
                  type="number"
                  value={formData.familySize}
                  onChange={(e) => handleInputChange("familySize", e.target.value)}
                  placeholder="Ej: 4"
                  min="1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Información de Vivienda */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-orange-600" />
              Información de Vivienda
            </CardTitle>
            <CardDescription>
              Características de la vivienda familiar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="housingType">Tipo de Vivienda</Label>
              <Select value={formData.housingType} onValueChange={(value) => handleInputChange("housingType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar tipo de vivienda" />
                </SelectTrigger>
                <SelectContent>
                  {housingTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observations">Observaciones</Label>
              <Textarea
                id="observations"
                value={formData.observations}
                onChange={(e) => handleInputChange("observations", e.target.value)}
                placeholder="Observaciones adicionales sobre la familia o vivienda..."
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        {/* Botones de Acción */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/surveys")}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Borrador
          </Button>
          <Button
            type="submit"
            className="flex items-center gap-2"
          >
            <Send className="w-4 h-4" />
            Finalizar Encuesta
          </Button>
        </div>
      </form>
    </div>
  );
};

export default NewSurvey;
