import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/hooks/useProfile";
import { ProfileUpdateRequest, ProfilePreferencesRequest, ChangePasswordRequest } from "@/services/profile";
import { User } from "@/types/auth";
import { Loader2, User as UserIcon, Mail, Phone, Calendar, MapPin, Building2, Lock, Upload, Settings, Bell, FileText, Globe, Clock, Palette, Eye, Save } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const ProfilePage = () => {
  const profileHook = useProfile();

  // Queries
  const { data: profile, isLoading: isProfileLoading, refetch: refetchProfile } = profileHook.useProfileQuery();
  const { data: preferences, isLoading: isPreferencesLoading, refetch: refetchPreferences } = profileHook.usePreferencesQuery();

  // Mutations
  const updateProfileMutation = profileHook.useUpdateProfileMutation();
  const updatePreferencesMutation = profileHook.useUpdatePreferencesMutation();
  const changePasswordMutation = profileHook.useChangePasswordMutation();
  const uploadProfilePictureMutation = profileHook.useUploadProfilePictureMutation();

  const isLoading = isProfileLoading || isPreferencesLoading;
  const isUpdating = updateProfileMutation.isPending || updatePreferencesMutation.isPending || uploadProfilePictureMutation.isPending;
  const isChangingPassword = changePasswordMutation.isPending;

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

  useEffect(() => {
    if (preferences) {
      setPreferencesFormData(preferences);
    }
  }, [preferences]);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updateProfileMutation.mutate(profileFormData);
  };

  const handlePreferencesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    updatePreferencesMutation.mutate(preferencesFormData);
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordFormData.newPassword !== passwordFormData.currentPassword) {
      toast({
        title: "Error",
        description: "La nueva contraseña no puede ser igual a la actual.",
        variant: "destructive",
      });
      return;
    }
    changePasswordMutation.mutate(passwordFormData, {
      onSuccess: () => {
        setPasswordFormData({ currentPassword: "", newPassword: "" });
      },
    });
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
      uploadProfilePictureMutation.mutate(file);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-10 h-10 text-primary" />
        <span className="ml-2 text-muted-foreground">Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-7xl bg-gradient-subtle min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-primary flex items-center gap-3">
        <UserIcon className="w-8 h-8" /> Mi Perfil
      </h1>

      {/* Sección de Información Personal */}
      <Card className="mb-6 shadow-card hover:shadow-hover">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <UserIcon className="w-5 h-5" /> Información Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
            <div className="relative">
              <Avatar className="w-24 h-24 border-2 border-primary shadow-md">
                <AvatarImage src={profile?.profilePictureUrl || "/placeholder-avatar.png"} alt="Avatar" />
                <AvatarFallback>{profile?.firstName?.charAt(0)}{profile?.lastName?.charAt(0)}</AvatarFallback>
              </Avatar>
              <Label htmlFor="profile-picture-upload" className="absolute bottom-0 right-0 bg-primary text-primary-foreground p-2 rounded-full cursor-pointer hover:bg-primary/90">
                <Upload className="w-4 h-4" />
                <Input
                  id="profile-picture-upload"
                  type="file"
                  className="hidden"
                  onChange={handleProfilePictureUpload}
                  disabled={isUpdating}
                />
              </Label>
            </div>
            <div className="flex-1">
              <p className="text-2xl font-bold text-foreground">{profile?.firstName} {profile?.lastName}</p>
              <p className="text-muted-foreground">{profile?.email}</p>
              <p className="text-muted-foreground">{profile?.role}</p>
            </div>
          </div>

          <form onSubmit={handleProfileSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Primer Nombre</Label>
              <Input id="firstName" value={profileFormData.firstName} onChange={(e) => setProfileFormData({ ...profileFormData, firstName: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Primer Apellido</Label>
              <Input id="lastName" value={profileFormData.lastName} onChange={(e) => setProfileFormData({ ...profileFormData, lastName: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondName">Segundo Nombre</Label>
              <Input id="secondName" value={profileFormData.secondName} onChange={(e) => setProfileFormData({ ...profileFormData, secondName: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="secondLastName">Segundo Apellido</Label>
              <Input id="secondLastName" value={profileFormData.secondLastName} onChange={(e) => setProfileFormData({ ...profileFormData, secondLastName: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <Input id="phone" value={profileFormData.phone} onChange={(e) => setProfileFormData({ ...profileFormData, phone: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={profile?.email || ""} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="birthDate">Fecha de Nacimiento</Label>
              <Input id="birthDate" type="date" value={profileFormData.birthDate} onChange={(e) => setProfileFormData({ ...profileFormData, birthDate: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sector">Sector</Label>
              <Input id="sector" value={profileFormData.sector} onChange={(e) => setProfileFormData({ ...profileFormData, sector: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Dirección</Label>
              <Input id="address" value={profileFormData.address} onChange={(e) => setProfileFormData({ ...profileFormData, address: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Contacto de Emergencia</Label>
              <Input id="emergencyContact" value={profileFormData.emergencyContact} onChange={(e) => setProfileFormData({ ...profileFormData, emergencyContact: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyPhone">Teléfono de Emergencia</Label>
              <Input id="emergencyPhone" value={profileFormData.emergencyPhone} onChange={(e) => setProfileFormData({ ...profileFormData, emergencyPhone: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio">Biografía</Label>
              <Textarea id="bio" value={profileFormData.bio} onChange={(e) => setProfileFormData({ ...profileFormData, bio: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4" />}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sección de Preferencias */}
      <Card className="mb-6 shadow-card hover:shadow-hover">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Settings className="w-5 h-5" /> Preferencias
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePreferencesSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between md:col-span-2">
              <Label htmlFor="emailNotifications">Notificaciones por Email</Label>
              <Switch id="emailNotifications" checked={preferencesFormData.emailNotifications} onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, emailNotifications: checked })} disabled={isUpdating} />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <Label htmlFor="pushNotifications">Notificaciones Push</Label>
              <Switch id="pushNotifications" checked={preferencesFormData.pushNotifications} onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, pushNotifications: checked })} disabled={isUpdating} />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <Label htmlFor="reportNotifications">Notificaciones de Reportes</Label>
              <Switch id="reportNotifications" checked={preferencesFormData.reportNotifications} onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, reportNotifications: checked })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="language">Idioma</Label>
              <Input id="language" value={preferencesFormData.language} onChange={(e) => setPreferencesFormData({ ...preferencesFormData, language: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="timezone">Zona Horaria</Label>
              <Input id="timezone" value={preferencesFormData.timezone} onChange={(e) => setPreferencesFormData({ ...preferencesFormData, timezone: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Input id="theme" value={preferencesFormData.theme} onChange={(e) => setPreferencesFormData({ ...preferencesFormData, theme: e.target.value })} disabled={isUpdating} />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <Label htmlFor="compactView">Vista Compacta</Label>
              <Switch id="compactView" checked={preferencesFormData.compactView} onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, compactView: checked })} disabled={isUpdating} />
            </div>
            <div className="flex items-center justify-between md:col-span-2">
              <Label htmlFor="showProfilePicture">Mostrar Foto de Perfil</Label>
              <Switch id="showProfilePicture" checked={preferencesFormData.showProfilePicture} onCheckedChange={(checked) => setPreferencesFormData({ ...preferencesFormData, showProfilePicture: checked })} disabled={isUpdating} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isUpdating}>
                {isUpdating && <Loader2 className="mr-2 h-4 w-4" />}
                Guardar Preferencias
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Sección de Seguridad */}
      <Card className="shadow-card hover:shadow-hover">
        <CardHeader className="bg-gradient-subtle">
          <CardTitle className="flex items-center gap-2 text-foreground">
            <Lock className="w-5 h-5" /> Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handlePasswordSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña Actual</Label>
              <Input id="currentPassword" type="password" value={passwordFormData.currentPassword} onChange={(e) => setPasswordFormData({ ...passwordFormData, currentPassword: e.target.value })} disabled={isChangingPassword} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva Contraseña</Label>
              <Input id="newPassword" type="password" value={passwordFormData.newPassword} onChange={(e) => setPasswordFormData({ ...passwordFormData, newPassword: e.target.value })} disabled={isChangingPassword} />
            </div>
            <div className="md:col-span-2 flex justify-end">
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword && <Loader2 className="mr-2 h-4 w-4" />}
                Cambiar Contraseña
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;