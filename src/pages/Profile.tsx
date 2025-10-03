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
  Camera,
  Edit3,
  Shield,
  Star,
  Save
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";

const ProfilePage = () => {
  const { user } = useAuthContext();
  const { currentTheme, themePresets } = useTheme();
  const isMobile = useIsMobile();
  
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
        } else {
          // No hay datos de usuario en el contexto
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
      {/* Header Superior Profesional - Optimizado para móvil */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-primary/85 shadow-2xl">
        {/* Patrón de fondo decorativo - Reducido en móvil */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />
        <div className="absolute top-0 left-0 w-full h-full">
          <div className={cn(
            "absolute top-4 left-4 bg-primary-foreground/10 rounded-full blur-3xl",
            isMobile ? "w-20 h-20" : "w-32 h-32"
          )} />
          <div className={cn(
            "absolute top-12 right-8 bg-primary-foreground/5 rounded-full blur-2xl",
            isMobile ? "w-16 h-16" : "w-24 h-24"
          )} />
          <div className={cn(
            "absolute bottom-4 left-1/3 bg-primary-foreground/5 rounded-full blur-3xl",
            isMobile ? "w-24 h-24" : "w-40 h-40"
          )} />
        </div>
        
        <div className={cn(
          "relative container mx-auto max-w-7xl",
          isMobile ? "px-4 py-8" : "px-6 py-12"
        )}>
          <div className="flex flex-col items-center text-center">
            {/* Avatar Central con Arco del Tema - Adaptativo */}
            <div className={cn(
              "relative group",
              isMobile ? "mb-4" : "mb-6"
            )}>
              {/* Arco decorativo alrededor del avatar */}
              <div className={cn(
                "absolute rounded-full bg-gradient-to-r from-primary-foreground/20 via-primary-foreground/10 to-primary-foreground/20 blur-lg group-hover:blur-xl transition-all duration-300",
                isMobile ? "-inset-3" : "-inset-4"
              )} />
              <div className={cn(
                "absolute rounded-full bg-gradient-to-r from-primary-foreground/30 to-primary-foreground/10 animate-pulse",
                isMobile ? "-inset-1.5" : "-inset-2"
              )} />
              
              <div className="relative">
                <Avatar className={cn(
                  "border-4 border-primary-foreground/20 shadow-2xl ring-2 ring-primary-foreground/10 ring-offset-2 ring-offset-primary/50",
                  isMobile ? "w-24 h-24" : "w-32 h-32"
                )}>
                  <AvatarImage 
                    src={profile?.profilePictureUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent((profile?.firstName || '') + ' ' + (profile?.lastName || ''))}&background=ffffff&color=1e40af&bold=true&size=256`}
                    alt="Avatar del usuario" 
                    className="object-cover"
                  />
                  <AvatarFallback className={cn(
                    "bg-gradient-to-br from-primary-foreground to-primary-foreground/80 text-primary font-bold",
                    isMobile ? "text-xl" : "text-2xl"
                  )}>
                    {profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                
                {/* Botón de edición de foto - Más pequeño en móvil */}
                <Label 
                  htmlFor="profile-picture-upload" 
                  className={cn(
                    "absolute bg-primary-foreground text-primary rounded-full cursor-pointer hover:scale-110 hover:bg-primary-foreground/90 transition-all duration-300 shadow-xl border-2 border-primary/20 group",
                    isMobile ? "bottom-1 right-1 p-2" : "bottom-2 right-2 p-3"
                  )}
                >
                  <Camera className={cn(
                    "group-hover:scale-110 transition-transform",
                    isMobile ? "w-3 h-3" : "w-4 h-4"
                  )} />
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

            {/* Información del Usuario - Adaptativa para móvil */}
            <div className={cn(
              "text-center",
              isMobile ? "mb-6" : "mb-8"
            )}>
              <h1 className={cn(
                "font-bold text-primary-foreground mb-2 tracking-tight",
                isMobile ? "text-2xl" : "text-4xl"
              )}>
                {profile?.firstName} {profile?.lastName}
              </h1>
              <p className={cn(
                "text-primary-foreground/80 font-medium mb-1",
                isMobile ? "text-base" : "text-lg"
              )}>
                {profile?.email}
              </p>
              <div className={cn(
                "inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full",
                isMobile ? "px-3 py-1.5" : "px-4 py-2"
              )}>
                <Shield className={cn(
                  "text-primary-foreground/80",
                  isMobile ? "w-3 h-3" : "w-4 h-4"
                )} />
                <span className={cn(
                  "text-primary-foreground/90 font-medium capitalize",
                  isMobile ? "text-sm" : ""
                )}>
                  {profile?.role === 'admin' ? 'Administrador' : profile?.role}
                </span>
              </div>
            </div>

            {/* Botones de Acción - Stack vertical en móvil */}
            <div className={cn(
              "gap-4",
              isMobile ? "flex flex-col w-full max-w-sm" : "flex"
            )}>
              <Button 
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                variant="secondary"
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm font-medium",
                  isMobile && "w-full min-h-[44px] active:scale-[0.98] transition-transform"
                )}
              >
                <Edit3 className={cn(
                  "mr-2",
                  isMobile ? "w-4 h-4" : "w-4 h-4"
                )} />
                {isEditingProfile ? 'Cancelar Edición' : 'Editar Perfil'}
              </Button>
              <Button 
                variant="secondary"
                size={isMobile ? "default" : "lg"}
                className={cn(
                  "bg-primary-foreground/20 hover:bg-primary-foreground/30 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm font-medium",
                  isMobile && "w-full min-h-[44px] active:scale-[0.98] transition-transform"
                )}
              >
              </Button>
              <Button 
                variant="secondary"
                size="lg"
                className="bg-primary-foreground/10 hover:bg-primary-foreground/20 text-primary-foreground border border-primary-foreground/20 backdrop-blur-sm"
              >
                <Settings className={cn(
                  "mr-2",
                  isMobile ? "w-4 h-4" : "w-4 h-4"
                )} />
                Configuración
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal - Layout responsive */}
      <div className={cn(
        "container mx-auto relative z-10 -mt-8",
        isMobile ? "px-4" : "px-6 max-w-7xl"
      )}>
        <div className={cn(
          isMobile ? "space-y-4" : "grid gap-8 lg:grid-cols-3"
        )}>
          
          {/* Columna Principal - Información Personal */}
          <div className={cn(
            isMobile ? "space-y-4" : "lg:col-span-2 space-y-6"
          )}>
            
            {/* Card de Información Personal - Adaptativa */}
            <Card className={cn(
              "border-0 backdrop-blur-sm transition-all duration-300",
              isMobile 
                ? "shadow-lg bg-card/95 hover:shadow-xl" 
                : "shadow-xl bg-card/95 hover:shadow-2xl"
            )}>
              <CardHeader className={cn(
                "bg-gradient-to-r from-primary/5 to-transparent border-b border-border/50",
                isMobile ? "px-4 py-3" : ""
              )}>
                <CardTitle className={cn(
                  "flex items-center gap-3",
                  isMobile ? "text-lg" : "text-xl"
                )}>
                  <div className={cn(
                    "bg-primary/10 rounded-lg",
                    isMobile ? "p-1.5" : "p-2"
                  )}>
                    <UserIcon className={cn(
                      "text-primary",
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    )} />
                  </div>
                  Información Personal
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                isMobile ? "px-4 py-4" : "pt-6"
              )}>
                {isEditingProfile ? (
                  <form onSubmit={handleProfileSubmit} className={cn(
                    isMobile ? "space-y-4" : "space-y-6"
                  )}>
                    <div className={cn(
                      isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"
                    )}>
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondName" className="text-sm font-medium">Segundo Nombre</Label>
                        <Input 
                          id="secondName" 
                          value={profileFormData.secondName} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, secondName: e.target.value })} 
                          disabled={isUpdating}
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="secondLastName" className="text-sm font-medium">Segundo Apellido</Label>
                        <Input 
                          id="secondLastName" 
                          value={profileFormData.secondLastName} 
                          onChange={(e) => setProfileFormData({ ...profileFormData, secondLastName: e.target.value })} 
                          disabled={isUpdating}
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg",
                            isMobile ? "h-12 text-base" : "h-11"
                          )}
                        />
                      </div>
                      
                      <div className={cn(
                        isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"
                      )}>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyContact" className="text-sm font-medium">Contacto de Emergencia</Label>
                          <Input 
                            id="emergencyContact" 
                            value={profileFormData.emergencyContact} 
                            onChange={(e) => setProfileFormData({ ...profileFormData, emergencyContact: e.target.value })} 
                            disabled={isUpdating}
                            className={cn(
                              "border-2 focus:border-primary/50 rounded-lg",
                              isMobile ? "h-12 text-base" : "h-11"
                            )}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="emergencyPhone" className="text-sm font-medium">Teléfono de Emergencia</Label>
                          <Input 
                            id="emergencyPhone" 
                            value={profileFormData.emergencyPhone} 
                            onChange={(e) => setProfileFormData({ ...profileFormData, emergencyPhone: e.target.value })} 
                            disabled={isUpdating}
                            className={cn(
                              "border-2 focus:border-primary/50 rounded-lg",
                              isMobile ? "h-12 text-base" : "h-11"
                            )}
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
                          className={cn(
                            "border-2 focus:border-primary/50 rounded-lg resize-none",
                            isMobile ? "min-h-[120px] text-base" : "min-h-[100px]"
                          )}
                          placeholder="Cuéntanos un poco sobre ti..."
                        />
                      </div>
                    </div>
                    
                    <div className={cn(
                      "pt-4 border-t border-border/50",
                      isMobile ? "flex flex-col gap-3" : "flex justify-end gap-3"
                    )}>
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={() => setIsEditingProfile(false)}
                        disabled={isUpdating}
                        className={cn(
                          "font-medium",
                          isMobile && "w-full min-h-[44px] order-2"
                        )}
                      >
                        Cancelar
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isUpdating}
                        className={cn(
                          "bg-primary hover:bg-primary/90 font-medium",
                          isMobile && "w-full min-h-[44px] order-1"
                        )}
                      >
                        {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        <Save className="mr-2 h-4 w-4" />
                        Guardar Cambios
                      </Button>
                    </div>
                  </form>
                ) : (
                  // Vista de solo lectura - Optimizada para móvil
                  <div className={cn(
                    isMobile ? "space-y-4" : "space-y-6"
                  )}>
                    <div className={cn(
                      isMobile ? "space-y-4" : "grid grid-cols-1 md:grid-cols-2 gap-6"
                    )}>
                      <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">Nombre Completo</p>
                        <p className={cn(
                          "font-semibold",
                          isMobile ? "text-base" : "text-lg"
                        )}>
                          {profile?.firstName} {profile?.secondName} {profile?.lastName} {profile?.secondLastName}
                        </p>
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

          {/* Columna Lateral - Preferencias y Seguridad - Mobile responsive */}
          <div className={cn(
            isMobile ? "space-y-4" : "space-y-6"
          )}>
            
            {/* Card de Preferencias - Optimizada */}
            <Card className={cn(
              "border-0 backdrop-blur-sm transition-all duration-300",
              isMobile 
                ? "shadow-lg bg-card/95 hover:shadow-xl" 
                : "shadow-xl bg-card/95 hover:shadow-2xl"
            )}>
              <CardHeader className={cn(
                "bg-gradient-to-r from-secondary/5 to-transparent border-b border-border/50",
                isMobile ? "px-4 py-3" : ""
              )}>
                <CardTitle className={cn(
                  "flex items-center gap-3",
                  isMobile ? "text-lg" : ""
                )}>
                  <div className={cn(
                    "bg-secondary/10 rounded-lg",
                    isMobile ? "p-1.5" : "p-2"
                  )}>
                    <Settings className={cn(
                      "text-secondary",
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    )} />
                  </div>
                  Preferencias
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                isMobile ? "px-4 py-4" : "pt-6"
              )}>
                <form onSubmit={handlePreferencesSubmit} className="space-y-4">
                  <div className="space-y-4">
                    <div className={cn(
                      "flex items-center justify-between",
                      isMobile && "py-1"
                    )}>
                      <div className="space-y-0.5 flex-1 pr-4">
                        <Label htmlFor="emailNotifications" className={cn(
                          "font-medium",
                          isMobile ? "text-sm" : "text-sm"
                        )}>
                          Notificaciones por Email
                        </Label>
                        <p className={cn(
                          "text-muted-foreground",
                          isMobile ? "text-xs" : "text-xs"
                        )}>
                          Recibir actualizaciones por correo
                        </p>
                      </div>
                      <Switch 
                        id="emailNotifications" 
                        checked={preferencesFormData.emailNotifications} 
                        onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, emailNotifications: checked })} 
                        disabled={isUpdating}
                        className={cn(
                          isMobile && "scale-110"
                        )}
                      />
                    </div>
                    
                    <div className={cn(
                      "flex items-center justify-between",
                      isMobile && "py-1"
                    )}>
                      <div className="space-y-0.5 flex-1 pr-4">
                        <Label htmlFor="pushNotifications" className="text-sm font-medium">Notificaciones Push</Label>
                        <p className="text-xs text-muted-foreground">Alertas en tiempo real</p>
                      </div>
                      <Switch 
                        id="pushNotifications" 
                        checked={preferencesFormData.pushNotifications} 
                        onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, pushNotifications: checked })} 
                        disabled={isUpdating}
                        className={cn(
                          isMobile && "scale-110"
                        )}
                      />
                    </div>
                    
                    <div className={cn(
                      "flex items-center justify-between",
                      isMobile && "py-1"
                    )}>
                      <div className="space-y-0.5 flex-1 pr-4">
                        <Label htmlFor="reportNotifications" className="text-sm font-medium">Reportes</Label>
                        <p className="text-xs text-muted-foreground">Notificaciones de reportes</p>
                      </div>
                      <Switch 
                        id="reportNotifications" 
                        checked={preferencesFormData.reportNotifications} 
                        onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, reportNotifications: checked })} 
                        disabled={isUpdating}
                        className={cn(
                          isMobile && "scale-110"
                        )}
                      />
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t border-border/50">
                    <Button 
                      type="submit" 
                      disabled={isUpdating}
                      className={cn(
                        "w-full bg-secondary hover:bg-secondary/90",
                        isMobile && "min-h-[44px] text-base font-medium"
                      )}
                    >
                      {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Guardar Preferencias
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Card de Seguridad - Optimizada para móvil */}
            <Card className={cn(
              "border-0 backdrop-blur-sm transition-all duration-300",
              isMobile 
                ? "shadow-lg bg-card/95 hover:shadow-xl" 
                : "shadow-xl bg-card/95 hover:shadow-2xl"
            )}>
              <CardHeader className={cn(
                "bg-gradient-to-r from-destructive/5 to-transparent border-b border-border/50",
                isMobile ? "px-4 py-3" : ""
              )}>
                <CardTitle className={cn(
                  "flex items-center gap-3",
                  isMobile ? "text-lg" : ""
                )}>
                  <div className={cn(
                    "bg-destructive/10 rounded-lg",
                    isMobile ? "p-1.5" : "p-2"
                  )}>
                    <Lock className={cn(
                      "text-destructive",
                      isMobile ? "w-4 h-4" : "w-5 h-5"
                    )} />
                  </div>
                  Seguridad
                </CardTitle>
              </CardHeader>
              <CardContent className={cn(
                isMobile ? "px-4 py-4" : "pt-6"
              )}>
                <form onSubmit={handlePasswordSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword" className="text-sm font-medium">Contraseña Actual</Label>
                    <Input 
                      id="currentPassword" 
                      type="password" 
                      value={passwordFormData.currentPassword} 
                      onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })} 
                      disabled={isChangingPassword}
                      className={cn(
                        "border-2 focus:border-destructive/50 rounded-lg",
                        isMobile ? "h-12 text-base" : "h-11"
                      )}
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
                      className={cn(
                        "border-2 focus:border-destructive/50 rounded-lg",
                        isMobile ? "h-12 text-base" : "h-11"
                      )}
                      placeholder="••••••••"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={isChangingPassword}
                    className={cn(
                      "w-full bg-destructive hover:bg-destructive/90",
                      isMobile && "min-h-[44px] text-base font-medium"
                    )}
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