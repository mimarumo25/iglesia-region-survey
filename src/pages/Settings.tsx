import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import {
  Settings,
  Save,
  Database,
  Mail,
  Bell,
  Shield,
  Users,
  FileText,
  Globe,
  Palette,
  Download,
  Upload,
  Trash2,
  RefreshCw
} from "lucide-react";

const SettingsPage = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    // Configuración General
    siteName: "Sistema Parroquial",
    siteDescription: "Sistema de caracterización familiar",
    timezone: "America/Bogota",
    language: "es",
    
    // Configuración de Email
    emailHost: "smtp.gmail.com",
    emailPort: "587",
    emailUser: "sistema@parroquia.com",
    emailPassword: "",
    emailFromName: "Sistema Parroquial",
    
    // Configuración de Notificaciones
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    reportNotifications: true,
    
    // Configuración de Seguridad
    sessionTimeout: "30",
    passwordMinLength: "8",
    requireTwoFactor: false,
    allowGuestAccess: false,
    
    // Configuración de Backup
    autoBackup: true,
    backupFrequency: "daily",
    backupRetention: "30",
    
    // Configuración de Interfaz
    theme: "light",
    primaryColor: "blue",
    showWelcomeMessage: true,
    compactView: false
  });

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    // Lógica para guardar configuración
    console.log("Guardando configuración:", settings);
    // Mostrar mensaje de éxito
  };

  const handleBackup = () => {
    // Lógica para crear backup
    console.log("Creando backup...");
  };

  const handleRestore = () => {
    // Lógica para restaurar backup
    console.log("Restaurando backup...");
  };

  const themes = [
    { value: "light", label: "Claro" },
    { value: "dark", label: "Oscuro" },
    { value: "auto", label: "Automático" }
  ];

  const colors = [
    { value: "blue", label: "Azul", color: "bg-blue-500" },
    { value: "green", label: "Verde", color: "bg-green-500" },
    { value: "purple", label: "Morado", color: "bg-purple-500" },
    { value: "orange", label: "Naranja", color: "bg-orange-500" },
    { value: "red", label: "Rojo", color: "bg-red-500" }
  ];

  const languages = [
    { value: "es", label: "Español" },
    { value: "en", label: "English" }
  ];

  const timezones = [
    { value: "America/Bogota", label: "América/Bogotá (GMT-5)" },
    { value: "America/Mexico_City", label: "América/Ciudad de México (GMT-6)" },
    { value: "America/New_York", label: "América/Nueva York (GMT-5)" }
  ];

  const backupFrequencies = [
    { value: "daily", label: "Diario" },
    { value: "weekly", label: "Semanal" },
    { value: "monthly", label: "Mensual" }
  ];

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-gray-600" />
            Configuración del Sistema
          </h1>
          <p className="text-gray-600">Personaliza y configura el sistema parroquial</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleBackup}>
            <Download className="w-4 h-4 mr-2" />
            Crear Backup
          </Button>
          <Button onClick={handleSave}>
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Configuración General */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-600" />
                Configuración General
              </CardTitle>
              <CardDescription>
                Configuración básica del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName">Nombre del Sistema</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="siteDescription">Descripción</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Email */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-green-600" />
                Configuración de Email
              </CardTitle>
              <CardDescription>
                Configuración del servidor de correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailHost">Servidor SMTP</Label>
                  <Input
                    id="emailHost"
                    value={settings.emailHost}
                    onChange={(e) => handleSettingChange("emailHost", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailPort">Puerto</Label>
                  <Input
                    id="emailPort"
                    value={settings.emailPort}
                    onChange={(e) => handleSettingChange("emailPort", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailUser">Usuario</Label>
                  <Input
                    id="emailUser"
                    type="email"
                    value={settings.emailUser}
                    onChange={(e) => handleSettingChange("emailUser", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFromName">Nombre del Remitente</Label>
                  <Input
                    id="emailFromName"
                    value={settings.emailFromName}
                    onChange={(e) => handleSettingChange("emailFromName", e.target.value)}
                  />
                </div>

                <div className="md:col-span-2 space-y-2">
                  <Label htmlFor="emailPassword">Contraseña</Label>
                  <Input
                    id="emailPassword"
                    type="password"
                    value={settings.emailPassword}
                    onChange={(e) => handleSettingChange("emailPassword", e.target.value)}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configuración de Seguridad */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-red-600" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription>
                Configuración de seguridad y acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength">Longitud mínima de contraseña</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange("passwordMinLength", e.target.value)}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="requireTwoFactor">Autenticación de Dos Factores</Label>
                    <p className="text-sm text-gray-500">Requerir 2FA para todos los usuarios</p>
                  </div>
                  <Switch
                    id="requireTwoFactor"
                    checked={settings.requireTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange("requireTwoFactor", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="allowGuestAccess">Acceso de Invitados</Label>
                    <p className="text-sm text-gray-500">Permitir acceso limitado sin autenticación</p>
                  </div>
                  <Switch
                    id="allowGuestAccess"
                    checked={settings.allowGuestAccess}
                    onCheckedChange={(checked) => handleSettingChange("allowGuestAccess", checked)}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Configuración Lateral */}
        <div className="space-y-6">
          {/* Notificaciones */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Notificaciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Email</Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">SMS</Label>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Push</Label>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reportNotifications">Reportes</Label>
                <Switch
                  id="reportNotifications"
                  checked={settings.reportNotifications}
                  onCheckedChange={(checked) => handleSettingChange("reportNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Apariencia */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-purple-600" />
                Apariencia
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Tema</Label>
                <Select value={settings.theme} onValueChange={(value) => handleSettingChange("theme", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {themes.map((theme) => (
                      <SelectItem key={theme.value} value={theme.value}>
                        {theme.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Color Principal</Label>
                <div className="grid grid-cols-3 gap-2">
                  {colors.map((color) => (
                    <Button
                      key={color.value}
                      variant={settings.primaryColor === color.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleSettingChange("primaryColor", color.value)}
                      className="flex items-center gap-2"
                    >
                      <div className={`w-3 h-3 rounded-full ${color.color}`}></div>
                      {color.label}
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <Label htmlFor="showWelcomeMessage">Mensaje de Bienvenida</Label>
                <Switch
                  id="showWelcomeMessage"
                  checked={settings.showWelcomeMessage}
                  onCheckedChange={(checked) => handleSettingChange("showWelcomeMessage", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="compactView">Vista Compacta</Label>
                <Switch
                  id="compactView"
                  checked={settings.compactView}
                  onCheckedChange={(checked) => handleSettingChange("compactView", checked)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Backup y Restauración */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-orange-600" />
                Backup y Restauración
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="autoBackup">Backup Automático</Label>
                <Switch
                  id="autoBackup"
                  checked={settings.autoBackup}
                  onCheckedChange={(checked) => handleSettingChange("autoBackup", checked)}
                />
              </div>

              <div className="space-y-2">
                <Label>Frecuencia</Label>
                <Select 
                  value={settings.backupFrequency} 
                  onValueChange={(value) => handleSettingChange("backupFrequency", value)}
                  disabled={!settings.autoBackup}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {backupFrequencies.map((freq) => (
                      <SelectItem key={freq.value} value={freq.value}>
                        {freq.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="backupRetention">Retención (días)</Label>
                <Input
                  id="backupRetention"
                  type="number"
                  value={settings.backupRetention}
                  onChange={(e) => handleSettingChange("backupRetention", e.target.value)}
                  disabled={!settings.autoBackup}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Button variant="outline" onClick={handleRestore} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  Restaurar Backup
                </Button>
                <Button variant="outline" onClick={handleBackup} className="w-full">
                  <Download className="w-4 h-4 mr-2" />
                  Crear Backup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
