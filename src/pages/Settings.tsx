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
    <div className="container mx-auto p-3 sm:p-6 max-w-7xl">
      {/* Header optimizado para móvil */}
      <div className="flex flex-col gap-4 mb-4 sm:mb-6">
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center justify-center sm:justify-start gap-3">
            <Settings className="w-6 h-6 sm:w-8 sm:h-8 text-gray-600" />
            Configuración del Sistema
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-2">Personaliza y configura el sistema MIA</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full">
          <Button variant="outline" onClick={handleBackup} className="w-full sm:w-auto">
            <Download className="w-4 h-4 mr-2" />
            Crear Backup
          </Button>
          <Button onClick={handleSave} className="w-full sm:w-auto">
            <Save className="w-4 h-4 mr-2" />
            Guardar Cambios
          </Button>
        </div>
      </div>

      {/* Tabs de configuración optimizados para móvil */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4 sm:space-y-6">
        <TabsList className="grid w-full grid-cols-3 sm:grid-cols-3 lg:grid-cols-6 h-auto min-h-[60px] sm:min-h-[50px]">
          <TabsTrigger value="general" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-full">
            <Globe className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">General</span>
          </TabsTrigger>
          <TabsTrigger value="system" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-full">
            <Database className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">Sistema</span>
          </TabsTrigger>
          <TabsTrigger value="email" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-full">
            <Mail className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">Email</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-full">
            <Shield className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">Seguridad</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-full">
            <Bell className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">Alertas</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm h-full">
            <Palette className="w-4 h-4 sm:w-4 sm:h-4 shrink-0" />
            <span className="text-xs sm:text-sm font-medium text-center">Tema</span>
          </TabsTrigger>
        </TabsList>

        {/* Tab de Configuración General */}
        <TabsContent value="general">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Globe className="w-5 h-5 text-blue-600" />
                Configuración General
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Configuración básica del sistema
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="siteName" className="text-sm sm:text-base">Nombre del Sistema</Label>
                  <Input
                    id="siteName"
                    value={settings.siteName}
                    onChange={(e) => handleSettingChange("siteName", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="language" className="text-sm sm:text-base">Idioma</Label>
                  <Select value={settings.language} onValueChange={(value) => handleSettingChange("language", value)}>
                    <SelectTrigger className="h-10 sm:h-11">
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

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="siteDescription" className="text-sm sm:text-base">Descripción</Label>
                  <Input
                    id="siteDescription"
                    value={settings.siteDescription}
                    onChange={(e) => handleSettingChange("siteDescription", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="timezone" className="text-sm sm:text-base">Zona Horaria</Label>
                  <Select value={settings.timezone} onValueChange={(value) => handleSettingChange("timezone", value)}>
                    <SelectTrigger className="h-10 sm:h-11">
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
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Database className="w-5 h-5 text-blue-600" />
                Configuración del Sistema
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Gestiona los catálogos y opciones del sistema MIA
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {filteredSystemOptions.map((option) => (
                  <Card 
                    key={option.title}
                    className="cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 border-2 hover:border-primary/50"
                    onClick={() => navigate(option.url)}
                  >
                    <CardHeader className="p-3 sm:pb-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-primary/10 rounded-lg shrink-0">
                          <option.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <CardTitle className="text-sm sm:text-base leading-tight">{option.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm leading-tight mt-1">
                            {option.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              
              {filteredSystemOptions.length === 0 && (
                <div className="text-center py-8 sm:py-12">
                  <Shield className="w-10 h-10 sm:w-12 sm:h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-base sm:text-lg font-semibold mb-2">Sin permisos de configuración</h3>
                  <p className="text-sm sm:text-base text-muted-foreground px-4">
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
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Mail className="w-5 h-5 text-green-600" />
                Configuración de Email
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Configuración del servidor de correo electrónico
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="emailHost" className="text-sm sm:text-base">Servidor SMTP</Label>
                  <Input
                    id="emailHost"
                    value={settings.emailHost}
                    onChange={(e) => handleSettingChange("emailHost", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="emailPort" className="text-sm sm:text-base">Puerto</Label>
                  <Input
                    id="emailPort"
                    value={settings.emailPort}
                    onChange={(e) => handleSettingChange("emailPort", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailUser" className="text-sm sm:text-base">Usuario</Label>
                  <Input
                    id="emailUser"
                    type="email"
                    value={settings.emailUser}
                    onChange={(e) => handleSettingChange("emailUser", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailFromName" className="text-sm sm:text-base">Nombre del Remitente</Label>
                  <Input
                    id="emailFromName"
                    value={settings.emailFromName}
                    onChange={(e) => handleSettingChange("emailFromName", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>

                <div className="sm:col-span-2 space-y-2">
                  <Label htmlFor="emailPassword" className="text-sm sm:text-base">Contraseña</Label>
                  <Input
                    id="emailPassword"
                    type="password"
                    value={settings.emailPassword}
                    onChange={(e) => handleSettingChange("emailPassword", e.target.value)}
                    placeholder="••••••••"
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab de Configuración de Seguridad */}
        <TabsContent value="security">
          <Card>
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Shield className="w-5 h-5 text-red-600" />
                Configuración de Seguridad
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Configuración de seguridad y acceso
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout" className="text-sm sm:text-base">Tiempo de Sesión (minutos)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    value={settings.sessionTimeout}
                    onChange={(e) => handleSettingChange("sessionTimeout", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="passwordMinLength" className="text-sm sm:text-base">Longitud mínima de contraseña</Label>
                  <Input
                    id="passwordMinLength"
                    type="number"
                    value={settings.passwordMinLength}
                    onChange={(e) => handleSettingChange("passwordMinLength", e.target.value)}
                    className="h-10 sm:h-11"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="requireTwoFactor" className="text-sm sm:text-base">Autenticación de Dos Factores</Label>
                    <p className="text-xs sm:text-sm text-gray-500">Requerir 2FA para todos los usuarios</p>
                  </div>
                  <Switch
                    id="requireTwoFactor"
                    checked={settings.requireTwoFactor}
                    onCheckedChange={(checked) => handleSettingChange("requireTwoFactor", checked)}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="allowGuestAccess" className="text-sm sm:text-base">Acceso de Invitados</Label>
                    <p className="text-xs sm:text-sm text-gray-500">Permitir acceso limitado sin autenticación</p>
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
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Bell className="w-5 h-5 text-yellow-600" />
                Configuración de Notificaciones
              </CardTitle>
              <CardDescription className="text-sm sm:text-base">
                Configurar preferencias de notificaciones
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Label htmlFor="emailNotifications" className="text-sm sm:text-base">Notificaciones por Email</Label>
                <Switch
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) => handleSettingChange("emailNotifications", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Label htmlFor="smsNotifications" className="text-sm sm:text-base">Notificaciones por SMS</Label>
                <Switch
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) => handleSettingChange("smsNotifications", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Label htmlFor="pushNotifications" className="text-sm sm:text-base">Notificaciones Push</Label>
                <Switch
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onCheckedChange={(checked) => handleSettingChange("pushNotifications", checked)}
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <Label htmlFor="reportNotifications" className="text-sm sm:text-base">Notificaciones de Reportes</Label>
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
