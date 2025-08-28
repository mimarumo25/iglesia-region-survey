import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ThemeCustomizer from "@/components/ThemeCustomizer";
import { usePermissions } from "@/hooks/usePermissions";
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
  RefreshCw,
  MapPin,
  Heart,
  Droplets,
  Home,
  Shirt
} from "lucide-react";

interface SettingsPageProps {
  initialTab?: string;
}

const SettingsPage = ({ initialTab }: SettingsPageProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { canManageUsers } = usePermissions();
  
  // Determinar el tab activo basado en la URL
  const getActiveTabFromPath = () => {
    const path = location.pathname;
    // Solo permitir tabs válidos para configuración general
    if (path === '/settings') return initialTab || 'general';
    return 'general'; // Por defecto mostrar general si no coincide
  };

  const [activeTab, setActiveTab] = useState(getActiveTabFromPath());

  useEffect(() => {
    setActiveTab(getActiveTabFromPath());
  }, [location.pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    // Solo navegar dentro de settings para tabs válidos
    if (['general', 'email', 'security', 'notifications', 'appearance', 'system'].includes(value)) {
      navigate('/settings');
    }
  };

  // Definir las opciones del sistema con permisos
  const systemConfigOptions = [
    {
      title: "Parroquias",
      url: "/settings/parroquias",
      icon: MapPin,
      description: "Gestión de parroquias",
      requiredRoles: ["admin"]
    },
    {
      title: "Enfermedades",
      url: "/settings/enfermedades",
      icon: Heart,
      description: "Catálogo de enfermedades",
      requiredRoles: ["admin"]
    },
    {
      title: "Veredas",
      url: "/settings/veredas",
      icon: MapPin,
      description: "Gestión de veredas",
      requiredRoles: ["admin"]
    },
    {
      title: "Municipios",
      url: "/settings/municipios",
      icon: MapPin,
      description: "Gestión de municipios",
      requiredRoles: ["admin"]
    },
    {
      title: "Aguas Residuales",
      url: "/settings/aguas-residuales",
      icon: Droplets,
      description: "Tipos de sistemas de aguas residuales",
      requiredRoles: ["admin"]
    },
    {
      title: "Tipos de Vivienda",
      url: "/settings/tipos-vivienda",
      icon: Home,
      description: "Tipos de vivienda disponibles",
      requiredRoles: ["admin"]
    },
    {
      title: "Parentescos",
      url: "/settings/parentescos",
      icon: Users,
      description: "Tipos de relación familiar",
      requiredRoles: ["admin"]
    },
    {
      title: "Estados Civiles",
      url: "/settings/estados-civiles",
      icon: Heart,
      description: "Tipos de estado civil",
      requiredRoles: ["admin"]
    },
    {
      title: "Disposición de Basura",
      url: "/settings/disposicion-basura",
      icon: Trash2,
      description: "Tipos de disposición de basura",
      requiredRoles: ["admin"]
    },
    {
      title: "Sexos",
      url: "/settings/sexos",
      icon: Users,
      description: "Catálogo de sexos",
      requiredRoles: ["admin"]
    },
    {
      title: "Comunidades Culturales",
      url: "/settings/comunidades-culturales",
      icon: Users,
      description: "Comunidades étnicas y culturales",
      requiredRoles: ["admin"]
    },
    {
      title: "Estudios",
      url: "/settings/estudios",
      icon: Users,
      description: "Niveles de estudio",
      requiredRoles: ["admin"]
    },
    {
      title: "Departamentos",
      url: "/settings/departamentos",
      icon: MapPin,
      description: "Departamentos del país",
      requiredRoles: ["admin"]
    },
    {
      title: "Profesiones",
      url: "/settings/profesiones",
      icon: Users,
      description: "Catálogo de profesiones",
      requiredRoles: ["admin"]
    },
    {
      title: "Catálogo Sectores",
      url: "/settings/sectores-config",
      icon: MapPin,
      description: "Catálogo de sectores del sistema",
      requiredRoles: ["admin"]
    },
  ];

  // Filtrar opciones según permisos
  const filteredSystemOptions = systemConfigOptions.filter(option => {
    if (!option.requiredRoles) return true;
    return canManageUsers; // Por simplicidad, usar el mismo permiso de admin
  });
  const [settings, setSettings] = useState({
    // Configuración General
    siteName: "MIA",
    siteDescription: "Sistema de caracterización familiar",
    timezone: "America/Bogota",
    language: "es",
    
    // Configuración de Email
    emailHost: "smtp.gmail.com",
    emailPort: "587",
    emailUser: "sistema@parroquia.com",
    emailPassword: "",
    emailFromName: "MIA System",
    
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
    // Mostrar mensaje de éxito
  };

  const handleBackup = () => {
    // Lógica para crear backup
  };

  const handleRestore = () => {
    // Lógica para restaurar backup
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
    <div className="container mx-auto p-6 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Settings className="w-8 h-8 text-gray-600" />
            Configuración del Sistema
          </h1>
          <p className="text-gray-600">Personaliza y configura el sistema MIA</p>
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

      {/* Tabs de configuración */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-6">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="system" className="flex items-center gap-2">
            <Database className="w-4 h-4" />
            Sistema
          </TabsTrigger>
          <TabsTrigger value="email" className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            Email
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Seguridad
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Apariencia
          </TabsTrigger>
        </TabsList>

        {/* Tab de Configuración General */}
        <TabsContent value="general">
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
        </TabsContent>

        {/* Tab de Configuración del Sistema */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription>
                Gestiona los catálogos y opciones del sistema MIA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredSystemOptions.map((option) => (
                  <Card 
                    key={option.title}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
                    onClick={() => navigate(option.url)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg">
                          <option.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-base">{option.title}</CardTitle>
                          <CardDescription className="text-sm">
                            {option.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              
              {filteredSystemOptions.length === 0 && (
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Sin permisos de configuración</h3>
                  <p className="text-muted-foreground">
                    No tienes permisos para acceder a las opciones de configuración del sistema.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Configuración de Email */}
        <TabsContent value="email">
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
        </TabsContent>

        {/* Tab de Configuración de Seguridad */}
        <TabsContent value="security">
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
        </TabsContent>

        {/* Tab de Notificaciones */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-yellow-600" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription>
                Configurar preferencias de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="smsNotifications">Notificaciones por SMS</Label>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="pushNotifications">Notificaciones Push</Label>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="reportNotifications">Notificaciones de Reportes</Label>
                <Switch
                  id="reportNotifications"
                  checked={settings.reportNotifications}
                  onCheckedChange={(checked) => handleSettingChange("reportNotifications", checked)}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Apariencia */}
        <TabsContent value="appearance">
          <ThemeCustomizer />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SettingsPage;
