import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuthContext } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { ProfileService, ProfileUpdateRequest, ProfilePreferencesRequest, ChangePasswordRequest } from "@/services/profile";
import { User } from "@/types/auth";
import { 
  Loader2, 
  User as UserIcon, 
  Mail, 
  Phone, 
  Calendar, 
  MapPin, 
  Building2, 
  Lock, 
  Upload, 
  Settings, 
  Bell, 
  FileText, 
  Globe, 
  Clock, 
  Palette, 
  Eye, 
  Save,
  Camera,
  Edit3,
  Shield,
  Star
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ProfilePage = () => {
  const { user } = useAuthContext();
  const { currentTheme, themePresets } = useTheme();
  
  // Estados locales para manejar los datos sin React Query
  const [profile, setProfile] = useState<User | null>(null);
  const [preferences, setPreferences] = useState<ProfilePreferencesRequest>({
    emailNotifications: true,
    pushNotifications: true,
    reportNotifications: true,
    language: "es",
    timezone: "America/Bogota",
    theme: "light",
    compactView: false,
    showProfilePicture: true,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Obtener el tema actual para el diseño
  const getCurrentThemeColors = () => {
    const theme = themePresets.find(t => t.name === currentTheme) || themePresets[0];
    return theme.colors;
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    const loadProfileData = async () => {
      try {
        setIsLoading(true);
        
        // Usar principalmente los datos del contexto de autenticación
        if (user) {
          setProfile(user);
          console.log('✅ Datos del usuario cargados desde el contexto:', user);
        } else {
          console.warn('⚠️  No hay datos de usuario en el contexto');
        }

        // Intentar cargar datos adicionales del perfil como fallback
        try {
          const profileData = await ProfileService.getProfile();
          setProfile(profileData);
          console.log('✅ Datos del perfil cargados desde ProfileService:', profileData);
        } catch (error) {
          console.warn('ℹ️  No se pudo cargar perfil desde ProfileService, usando datos del contexto');
          // Esto es normal, simplemente usamos los datos del contexto
        }

        // Cargar preferencias
        try {
          const preferencesData = await ProfileService.getPreferences();
          setPreferences(preferencesData);
          console.log('✅ Preferencias cargadas:', preferencesData);
        } catch (error) {
          console.warn('ℹ️  Usando preferencias por defecto');
        }

      } catch (error) {
        console.error('❌ Error crítico al cargar datos del perfil:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos del perfil.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [user]);

  // Estados de formularios
  const [profileFormData, setProfileFormData] = useState<ProfileUpdateRequest>({
    firstName: "",
    lastName: "",
    secondName: "",
    secondLastName: "",
    phone: "",
    bio: "",
    birthDate: "",
    sector: "",
    address: "",
    emergencyContact: "",
    emergencyPhone: "",
  });

  const [preferencesFormData, setPreferencesFormData] = useState<ProfilePreferencesRequest>({
    emailNotifications: true,
    pushNotifications: true,
    reportNotifications: true,
    language: "es",
    timezone: "America/Bogota",
    theme: "light",
    compactView: false,
    showProfilePicture: true,
  });

  const [passwordFormData, setPasswordFormData] = useState<ChangePasswordRequest>({
    currentPassword: "",
    newPassword: "",
  });

  // Efecto para actualizar los datos del formulario cuando cambie el perfil
  useEffect(() => {
    if (profile) {
      setProfileFormData({
        firstName: profile.firstName || "",
        lastName: profile.lastName || "",
        secondName: profile.secondName || "",
        secondLastName: profile.secondLastName || "",
        phone: profile.phone || "",
        bio: profile.bio || "",
        birthDate: profile.birthDate ? new Date(profile.birthDate).toISOString().split("T")[0] : "",
        sector: profile.sector || "",
        address: profile.address || "",
        emergencyContact: profile.emergencyContact || "",
        emergencyPhone: profile.emergencyPhone || "",
      });
    }
  }, [profile]);

  // Efecto para actualizar las preferencias del formulario
  useEffect(() => {
    setPreferencesFormData(preferences);
  }, [preferences]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      const updatedProfile = await ProfileService.updateProfile(profileFormData);
      setProfile(updatedProfile);
      toast({
        title: "Perfil actualizado",
        description: "Los datos de su perfil se han guardado correctamente.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron guardar los cambios del perfil.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsUpdating(true);
      await ProfileService.updatePreferences(preferencesFormData);
      toast({
        title: "Preferencias guardadas",
        description: "Sus preferencias se han actualizado correctamente.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error al actualizar preferencias:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron guardar las preferencias.",
        variant: "destructive"
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.newPassword === passwordFormData.currentPassword) {
      toast({
        title: "Error",
        description: "La nueva contraseña debe ser diferente a la actual.",
        variant: "destructive",
      });
      return;
    }
    try {
      setIsChangingPassword(true);
      await ProfileService.changePassword(passwordFormData);
      setPasswordFormData({ currentPassword: "", newPassword: "" });
      toast({
        title: "Contraseña actualizada",
        description: "Su contraseña se ha cambiado exitosamente.",
        variant: "default"
      });
    } catch (error: any) {
      console.error('Error al cambiar contraseña:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo cambiar la contraseña. Verifique su contraseña actual.",
        variant: "destructive"
      });
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleProfilePictureUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Error",
          description: "El archivo debe ser una imagen.",
          variant: "destructive"
        });
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB
        toast({
          title: "Error",
          description: "La imagen debe ser menor a 5MB.",
          variant: "destructive"
        });
        return;
      }
      
      try {
        setIsUpdating(true);
        const newImageUrl = await ProfileService.uploadProfilePicture(file);
        // Actualizar el estado local con la nueva URL de imagen
        if (profile) {
          setProfile({ ...profile, profilePictureUrl: newImageUrl });
        }
        toast({
          title: "Foto actualizada",
          description: "Su foto de perfil se ha actualizado correctamente.",
          variant: "default"
        });
      } catch (error: any) {
        console.error('Error al subir foto:', error);
        toast({
          title: "Error",
          description: error.message || "No se pudo subir la foto de perfil.",
          variant: "destructive"
        });
      } finally {
        setIsUpdating(false);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <span className="ml-2 text-muted-foreground">Cargando perfil...</span>
      </div>
    );
  }

  // Si no hay usuario disponible, mostrar mensaje de error
  if (!profile && !user) {
    return (
      <div className="container mx-auto p-6 max-w-7xl bg-gradient-subtle min-h-screen">
        <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
          <UserIcon className="w-8 h-8" /> Mi Perfil
        </h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="text-center">
              <UserIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-red-700 mb-2">
                No se pudieron cargar los datos del perfil
              </h2>
              <p className="text-red-600 mb-4">
                Por favor, intente cerrar sesión e iniciar sesión nuevamente.
              </p>
              <Button 
                onClick={() => window.location.href = '/login'} 
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-50"
              >
                Ir al Login
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header Superior Profesional */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/85 shadow-2xl">
        {/* Patrón de fondo decorativo */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-4 left-4 w-32 h-32 bg-primary-foreground/10 rounded-full blur-3xl" />
          <div className="absolute top-12 right-8 w-24 h-24 bg-primary-foreground/5 rounded-full blur-2xl" />
          <div className="absolute bottom-4 left-1/3 w-40 h-40 bg-primary-foreground/5 rounded-full blur-3xl" />
        </div>
        
        <div className="relative container mx-auto px-6 py-12 max-w-7xl">
          <div className="flex flex-col items-center text-center">
            {/* Avatar Central con Arco del Tema */}
            <div className="relative mb-6 group">
              {/* Arco decorativo alrededor del avatar */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary-foreground/20 via-primary-foreground/10 to-primary-foreground/20 blur-lg group-hover:blur-xl transition-all duration-300" />
              <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary-foreground/30 to-primary-foreground/10 animate-pulse" />
              
              <div className="relative">
                <Avatar className="w-32 h-32 border-4 border-primary-foreground/20 shadow-2xl ring-2 ring-primary-foreground/10 ring-offset-2 ring-offset-primary/50">
                  <AvatarImage 
                    src={profile?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile?.firstName || '') + ' ' + (profile?.lastName || ''))}&background=ffffff&color=1e40af&bold=true&size=256`}
                    alt="Avatar del usuario" 
                    className="object-cover"
                  />
                  <AvatarFallback className="bg-gradient-to-br from-primary-foreground to-primary-foreground/80 text-primary text-2xl font-bold">
                    {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Botón de edición de foto */}
                <Label 
                  htmlFor="profile-picture-upload" 
                  className="absolute bottom-2 right-2 bg-primary-foreground text-primary p-3 rounded-full cursor-pointer hover:scale-110 hover:bg-primary-foreground/90 transition-all duration-300 shadow-xl border-2 border-primary/20 group"
                >
                  <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <Input
                    id="profile-picture-upload"
                    type="file"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                    disabled={isUpdating}
                    accept="image/*"
                  />
                </Label>
              </div>
            </div>

            {/* Información del Usuario */}
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-primary-foreground mb-2 tracking-tight">
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className="text-primary-foreground/80 text-lg font-medium mb-1">
                {profile?.email}
              </p>
              <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm px-4 py-2 rounded-full">
                <Shield className="w-4 h-4 text-primary-foreground/80" />
                <span className="text-primary-foreground/90 font-medium capitalize">
                  {profile?.role === 'admin' ? 'Administrador' : profile?.role}
                </span>
              </div>
            </div>

            {/* Botones de Acción */}
            <div className="flex gap-4">
              <Button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                variant="secondary"
                size="lg"
                className="bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm font-medium"
              >
                <Edit3 className="w-4 h-4 mr-2" />
                {isEditingProfile ? 'Cancelar Edición' : 'Editar Perfil'}
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm"
              >
                <Settings className="w-4 h-4 mr-2" />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="container mx-auto p-6 max-w-7xl -mt-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-3">
          
          {/* Columna Principal - Información Personal */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Card de Información Personal */}
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <UserIcon className="w-5 h-5 text-primary" />
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-primary" />
                          Primer Nombre
                        </Label>
                        <Input 
                          id="firstName" 
                          value={profileFormData.firstName} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium flex items-center gap-2">
                          <UserIcon className="w-4 h-4 text-primary" />
                          Primer Apellido
                        </Label>
                        <Input 
                          id="lastName" 
                          value={profileFormData.lastName} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondName" className="text-sm font-medium">Segundo Nombre</Label>
                        <Input 
                          id="secondName" 
                          value={profileFormData.secondName} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, secondName: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondLastName" className="text-sm font-medium">Segundo Apellido</Label>
                        <Input 
                          id="secondLastName" 
                          value={profileFormData.secondLastName} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, secondLastName: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium flex items-center gap-2">
                          <Phone className="w-4 h-4 text-primary" />
                          Teléfono
                        </Label>
                        <Input 
                          id="phone" 
                          value={profileFormData.phone} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                          <Mail className="w-4 h-4 text-primary" />
                          Email
                        </Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={profile?.email || ""} 
                          disabled 
                          className="h-11 bg-muted/50 border-2 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="birthDate" className="text-sm font-medium flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          Fecha de Nacimiento
                        </Label>
                        <Input 
                          id="birthDate" 
                          type="date" 
                          value={profileFormData.birthDate} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, birthDate: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sector" className="text-sm font-medium flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-primary" />
                          Sector
                        </Label>
                        <Input 
                          id="sector" 
                          value={profileFormData.sector} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, sector: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-sm font-medium flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-primary" />
                          Dirección
                        </Label>
                        <Input 
                          id="address" 
                          value={profileFormData.address} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })} 
                          disabled={isUpdating}
                          className="h-11 border-2 focus:border-primary/50 rounded-lg"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact" className="text-sm font-medium">Contacto de Emergencia</Label>
                          <Input 
                            id="emergencyContact" 
                            value={profileFormData.emergencyContact} 
                            onChange={(e) => setProfileFormData({ ...profileFormData, emergencyContact: e.target.value })} 
                            disabled={isUpdating}
                            className="h-11 border-2 focus:border-primary/50 rounded-lg"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone" className="text-sm font-medium">Teléfono de Emergencia</Label>
                          <Input 
                            id="emergencyPhone" 
                            value={profileFormData.emergencyPhone} 
                            onChange={(e) => setProfileFormData({ ...profileFormData, emergencyPhone: e.target.value })} 
                            disabled={isUpdating}
                            className="h-11 border-2 focus:border-primary/50 rounded-lg"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="bio" className="text-sm font-medium flex items-center gap-2">
                          <FileText className="w-4 h-4 text-primary" />
                          Biografía
                        </Label>
                        <Textarea 
                          id="bio" 
                          value={profileFormData.bio} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })} 
                          disabled={isUpdating}
                          className="min-h-[100px] border-2 focus:border-primary/50 rounded-lg resize-none"
                          placeholder="Cuéntanos un poco sobre ti..."
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isUpdating}
                        className="font-medium"
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isUpdating}
                        className="bg-primary hover:bg-primary/90 font-medium"
                      >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Vista de solo lectura
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                        <p className="text-lg font-semibold">{profile?.firstName} {profile?.secondName} {profile?.lastName} {profile?.secondLastName}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                        <p className="text-lg">{profile?.phone || 'No especificado'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Sector</p>
                        <p className="text-lg">{profile?.sector || 'No especificado'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Fecha de Nacimiento</p>
                        <p className="text-lg">{profile?.birthDate ? new Date(profile.birthDate).toLocaleDateString('es-ES') : 'No especificada'}</p>
                      </div>
                    </div>
                    
                    {profile?.address && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                        <p className="text-lg">{profile.address}</p>
                      </div>
                    )}
                    
                    {profile?.bio && (
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Biografía</p>
                        <p className="text-base leading-relaxed">{profile.bio}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Columna Lateral - Preferencias y Seguridad */}
          <div className="space-y-6">
            
            {/* Card de Preferencias */}
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-secondary/5 to-transparent border-b border-border/50">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-secondary/10 rounded-lg">
                    <Settings className="w-5 h-5 text-secondary" />
                  </div>
                  Preferencias
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="emailNotifications" className="text-sm font-medium">Notificaciones por Email</Label>
                        <p className="text-xs text-muted-foreground">Recibir actualizaciones por correo</p>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={preferencesFormData.emailNotifications} 
                        onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, emailNotifications: checked })} 
                        disabled={isUpdating} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="pushNotifications" className="text-sm font-medium">Notificaciones Push</Label>
                        <p className="text-xs text-muted-foreground">Alertas en tiempo real</p>
                      </div>
                      <Switch 
                        id="pushNotifications" 
                        checked={preferencesFormData.pushNotifications} 
                        onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, pushNotifications: checked })} 
                        disabled={isUpdating} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="reportNotifications" className="text-sm font-medium">Reportes</Label>
                        <p className="text-xs text-muted-foreground">Notificaciones de reportes</p>
                      </div>
                      <Switch 
                        id="reportNotifications" 
                        checked={preferencesFormData.reportNotifications} 
                        onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, reportNotifications: checked })} 
                        disabled={isUpdating} 
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className="w-full bg-secondary hover:bg-secondary/90"
                    >
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar Preferencias
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Card de Seguridad */}
            <Card className="shadow-xl border-0 bg-card/95 backdrop-blur-sm hover:shadow-2xl transition-all duration-300">
              <CardHeader className="bg-gradient-to-r from-destructive/5 to-transparent border-b border-border/50">
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-destructive/10 rounded-lg">
                    <Lock className="w-5 h-5 text-destructive" />
                  </div>
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6">
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">Contraseña Actual</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={passwordFormData.currentPassword} 
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })} 
                      disabled={isChangingPassword}
                      className="h-11 border-2 focus:border-destructive/50 rounded-lg"
                      placeholder="••••••••"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newPassword" className="text-sm font-medium">Nueva Contraseña</Label>
                    <Input 
                      id="newPassword" 
                      type="password" 
                      value={passwordFormData.newPassword} 
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })} 
                      disabled={isChangingPassword}
                      className="h-11 border-2 focus:border-destructive/50 rounded-lg"
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isChangingPassword}
                    className="w-full bg-destructive hover:bg-destructive/90"
                  >
                    {isChangingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    <Lock className="mr-2 h-4 w-4" />
                    Cambiar Contraseña
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;