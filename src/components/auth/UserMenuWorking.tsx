import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Settings } from "lucide-react";
import { useAuthContext } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

/**
 * Componente de menú de usuario con dropdown manual que funciona correctamente
 */
export const UserMenuWorking: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuthContext();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Obtener iniciales del usuario con validación
  const getInitials = (firstName?: string, lastName?: string): string => {
    const first = firstName?.charAt(0) || '';
    const last = lastName?.charAt(0) || '';
    
    if (!first && !last) {
      // Si no hay nombres, usar iniciales del email
      const emailPrefix = user?.email?.split('@')[0] || 'U';
      return emailPrefix.substring(0, 2).toUpperCase();
    }
    
    return `${first}${last}`.toUpperCase();
  };

  // Obtener el nombre completo del usuario
  const getFullName = (): string => {
    const parts = [
      user?.firstName,
      user?.secondName,
      user?.lastName,
      user?.secondLastName
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(' ') : (user?.email || '');
  };

  // Mapear el rol a un formato más amigable para mostrar
  const getRoleDisplayName = (role: string): string => {
    const roleMap: { [key: string]: string } = {
      'admin': 'Administrador',
      'user': 'Usuario',
      'manager': 'Gestor',
      'supervisor': 'Supervisor'
    };
    
    return roleMap[role.toLowerCase()] || role;
  };

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
  };

  const handleProfileClick = () => {
    console.log('🔍 UserMenuWorking: Navegando al perfil...');
    setIsOpen(false);
    try {
      navigate('/profile');
      console.log('✅ UserMenuWorking: Navegación al perfil iniciada');
    } catch (error) {
      console.error('❌ UserMenuWorking: Error al navegar al perfil:', error);
    }
  };

  const handleSettingsClick = () => {
    setIsOpen(false);
    navigate('/settings');
  };

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Debug en desarrollo
  if (import.meta.env.DEV) {
    console.log('🔍 UserMenuWorking Debug:', { 
      user, 
      hasUser: !!user, 
      isAuthenticated,
      skipAuth: import.meta.env.VITE_SKIP_AUTH 
    });
  }

  // Si no hay usuario y no estamos en modo skip auth, no mostrar nada
  if (!user && import.meta.env.VITE_SKIP_AUTH !== 'true') {
    return null;
  }

  // En modo desarrollo con skip auth, mostrar indicador si no hay usuario
  if (!user && import.meta.env.VITE_SKIP_AUTH === 'true') {
    return (
      <Button variant="ghost" className="relative h-10 w-10 rounded-full bg-orange-100 border border-orange-300">
        <span className="text-orange-600 text-xs font-bold" title="No User - Dev Mode">
          NU
        </span>
      </Button>
    );
  }

  // Si llegamos aquí, tenemos un usuario válido
  console.log('🔍 UserMenuWorking: Renderizando con usuario válido:', user.firstName, user.lastName);

  const fullName = getFullName();

  return (
    <div className="relative" ref={dropdownRef} style={{ pointerEvents: 'auto' }}>
      <Button 
        variant="ghost" 
        className="relative h-10 w-10 rounded-full hover:bg-primary/10 transition-all duration-300 hover:scale-105 focus:ring-2 focus:ring-primary/20"
        style={{ pointerEvents: 'auto' }}
        title={`Menú de ${fullName}`}
        onClick={() => {
          console.log('🔍 UserMenuWorking: Button onClick disparado');
          setIsOpen(!isOpen);
        }}
      >
        <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-sm">
          <AvatarImage 
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=0066cc&color=ffffff&bold=true`}
            alt={fullName}
            className="object-cover"
          />
          <AvatarFallback className="bg-gradient-to-br from-primary to-primary/80 text-white font-semibold text-sm">
            {getInitials(user.firstName, user.lastName)}
          </AvatarFallback>
        </Avatar>
      </Button>
      
      {/* Dropdown Content */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-popover border border-border rounded-md shadow-lg z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          {/* User Info Header */}
          <div className="px-3 py-2 border-b border-border">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none text-foreground">
                {fullName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
              <p className="text-xs leading-none text-muted-foreground capitalize">
                Rol: {getRoleDisplayName(user.role)}
              </p>
              {user.roles && user.roles.length > 1 && (
                <p className="text-xs leading-none text-muted-foreground/70">
                  Roles adicionales: {user.roles.slice(1).join(', ')}
                </p>
              )}
            </div>
          </div>
          
          {/* Menu Items */}
          <div className="p-1">
            <button 
              className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
              onClick={handleProfileClick}
            >
              <User className="mr-2 h-4 w-4" />
              <span>Mi Perfil</span>
            </button>
            
            <button 
              className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-accent hover:text-accent-foreground cursor-pointer transition-colors"
              onClick={handleSettingsClick}
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Configuración</span>
            </button>

            {/* Sección de Preferencias temporalmente oculta */}
            
            <div className="border-t border-border my-1" />
            
            <button 
              className="flex items-center w-full px-2 py-1.5 text-sm rounded-sm hover:bg-destructive/10 hover:text-destructive cursor-pointer transition-colors text-red-600"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenuWorking;
