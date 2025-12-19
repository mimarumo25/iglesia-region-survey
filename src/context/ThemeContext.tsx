import React, { createContext, useContext, useEffect, useState } from 'react';

export interface ThemeColors {
  primary: string;
  primaryForeground: string;
  primaryLight: string;
  primaryDark: string;
  primaryHover: string;
  secondary: string;
  secondaryForeground: string;
  secondaryLight: string;
  secondaryHover: string;
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  border: string;
  input: string;
  inputBorder: string;
  ring: string;
  destructive: string;
  destructiveForeground: string;
  success: string;
  successForeground: string;
  warning: string;
  warningForeground: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
}

export interface ThemePreset {
  name: string;
  displayName: string;
  description: string;
  colors: ThemeColors;
}

// Temas predefinidos
export const themePresets: ThemePreset[] = [
  {
    name: 'mia',
    displayName: 'MIA Oficial',
    description: 'Tema oficial MIA con verde y azul del logo',
    colors: {
      primary: '142 76% 36%', // Verde MIA principal
      primaryForeground: '0 0% 98%',
      primaryLight: '142 76% 46%', // Verde más claro
      primaryDark: '142 76% 26%', // Verde más oscuro
      primaryHover: '142 76% 41%', // Verde hover
      secondary: '197 71% 52%', // Azul complementario
      secondaryForeground: '0 0% 98%',
      secondaryLight: '197 71% 62%', // Azul más claro
      secondaryHover: '197 71% 57%', // Azul hover
      background: '0 0% 96%', // Fondo muy claro para contraste
      foreground: '0 0% 3.9%',
      card: '0 0% 98%', // Cards casi blancos
      cardForeground: '0 0% 3.9%',
      muted: '0 0% 92%',
      mutedForeground: '215.4 16.3% 35%',
      accent: '0 0% 94%',
      accentForeground: '0 0% 3.9%',
      border: '214.3 31.8% 91.4%',
      input: '0 0% 96%', // Input con fondo muy claro
      inputBorder: '142 20% 85%', // Borde sutil verde
      ring: '142 76% 36%', // Ring verde MIA
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%', // Verde MIA para success
      successForeground: '0 0% 98%',
      warning: '38 92% 50%',
      warningForeground: '0 0% 98%',
      sidebarBackground: '142 76% 26%', // Verde MIA oscuro
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '142 76% 20%', // Verde MIA más oscuro
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '142 76% 36%', // Verde MIA principal
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '142 76% 22%', // Verde MIA borde
      sidebarRing: '142 76% 36%', // Verde MIA ring
    }
  },
  {
    name: 'teal-mia',
    displayName: 'Verde Teal MIA',
    description: 'Tema basado en el verde-azulado del logo MIA oficial',
    colors: {
      primary: '180 59% 32%', // Verde teal del logo #1B7071 ligeramente ajustado
      primaryForeground: '0 0% 98%',
      primaryLight: '180 59% 42%',
      primaryDark: '180 59% 22%',
      primaryHover: '180 59% 37%',
      secondary: '43 67% 53%', // Dorado del logo #D4AF37
      secondaryForeground: '0 0% 20%',
      secondaryLight: '43 67% 63%',
      secondaryHover: '43 67% 58%',
      background: '0 0% 98%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '180 10% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '180 15% 94%',
      accentForeground: '0 0% 3.9%',
      border: '180 20% 88%',
      input: '0 0% 100%',
      inputBorder: '180 20% 85%',
      ring: '180 59% 32%',
      destructive: '0 75% 45%', // Rojo oscuro inspirado en el logo
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '43 67% 53%',
      warningForeground: '0 0% 20%',
      sidebarBackground: '180 59% 27%', // Verde teal oscuro del logo
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '180 59% 20%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '180 59% 37%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '180 59% 22%',
      sidebarRing: '180 59% 37%',
    }
  },
  {
    name: 'default',
    displayName: 'Azul Católico',
    description: 'Tema tradicional con azul católico y dorado litúrgico',
    colors: {
      primary: '213 100% 45%',
      primaryForeground: '0 0% 98%',
      primaryLight: '213 100% 55%',
      primaryDark: '213 100% 35%',
      primaryHover: '213 100% 50%',
      secondary: '32 100% 50%',
      secondaryForeground: '0 0% 98%',
      secondaryLight: '32 100% 60%',
      secondaryHover: '32 100% 55%',
      background: '0 0% 98%', // Fondo blanco/muy claro para mejor legibilidad
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '210 40% 98%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '0 0% 3.9%',
      border: '214.3 31.8% 91.4%',
      input: '0 0% 100%',
      inputBorder: '214.3 31.8% 91.4%',
      ring: '213 94% 35%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '38 92% 50%',
      warningForeground: '0 0% 98%',
      sidebarBackground: '213 94% 35%',
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '213 94% 25%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '213 94% 45%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '213 94% 30%',
      sidebarRing: '213 94% 45%',
    }
  },
  {
    name: 'emerald',
    displayName: 'Verde Esperanza',
    description: 'Tema con verde esperanza y dorado cálido',
    colors: {
      primary: '158 64% 52%',
      primaryForeground: '0 0% 98%',
      primaryLight: '158 64% 62%',
      primaryDark: '158 64% 42%',
      primaryHover: '158 64% 57%',
      secondary: '45 93% 47%',
      secondaryForeground: '0 0% 98%',
      secondaryLight: '45 93% 57%',
      secondaryHover: '45 93% 52%',
      background: '0 0% 98%', // Fondo blanco/muy claro para mejor legibilidad
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '210 40% 98%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '0 0% 3.9%',
      border: '214.3 31.8% 91.4%',
      input: '0 0% 100%',
      inputBorder: '214.3 31.8% 91.4%',
      ring: '158 64% 52%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '38 92% 50%',
      warningForeground: '0 0% 98%',
      sidebarBackground: '158 64% 42%',
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '158 64% 32%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '158 64% 52%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '158 64% 37%',
      sidebarRing: '158 64% 52%',
    }
  },
  {
    name: 'purple',
    displayName: 'Púrpura Litúrgico',
    description: 'Tema con púrpura litúrgico y dorado real',
    colors: {
      primary: '271 81% 56%',
      primaryForeground: '0 0% 98%',
      primaryLight: '271 81% 66%',
      primaryDark: '271 81% 46%',
      primaryHover: '271 81% 61%',
      secondary: '43 74% 66%',
      secondaryForeground: '0 0% 98%',
      secondaryLight: '43 74% 76%',
      secondaryHover: '43 74% 71%',
      background: '0 0% 98%', // Fondo blanco/muy claro para mejor legibilidad
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '210 40% 98%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '0 0% 3.9%',
      border: '214.3 31.8% 91.4%',
      input: '0 0% 100%',
      inputBorder: '214.3 31.8% 91.4%',
      ring: '271 81% 56%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '38 92% 50%',
      warningForeground: '0 0% 98%',
      sidebarBackground: '271 81% 46%',
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '271 81% 36%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '271 81% 56%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '271 81% 41%',
      sidebarRing: '271 81% 56%',
    }
  },
  {
    name: 'rose',
    displayName: 'Rosa Gaudete',
    description: 'Tema con rosa litúrgico y dorado suave',
    colors: {
      primary: '330 81% 60%',
      primaryForeground: '0 0% 98%',
      primaryLight: '330 81% 70%',
      primaryDark: '330 81% 50%',
      primaryHover: '330 81% 65%',
      secondary: '48 96% 53%',
      secondaryForeground: '0 0% 98%',
      secondaryLight: '48 96% 63%',
      secondaryHover: '48 96% 58%',
      background: '0 0% 98%', // Fondo blanco/muy claro para mejor legibilidad
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '210 40% 98%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '0 0% 3.9%',
      border: '214.3 31.8% 91.4%',
      input: '0 0% 100%',
      inputBorder: '214.3 31.8% 91.4%',
      ring: '330 81% 60%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '38 92% 50%',
      warningForeground: '0 0% 98%',
      sidebarBackground: '330 81% 50%',
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '330 81% 40%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '330 81% 60%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '330 81% 45%',
      sidebarRing: '330 81% 60%',
    }
  },
  {
    name: 'golden',
    displayName: 'Dorado Bizantino',
    description: 'Tema basado en el dorado del logo (#D4AF37)',
    colors: {
      primary: '43 67% 53%', // Dorado del logo #D4AF37
      primaryForeground: '0 0% 20%',
      primaryLight: '43 67% 63%',
      primaryDark: '43 67% 43%',
      primaryHover: '43 67% 58%',
      secondary: '0 0% 10%', // Negro para contraste con dorado
      secondaryForeground: '43 67% 53%',
      secondaryLight: '0 0% 20%',
      secondaryHover: '0 0% 15%',
      background: '0 0% 98%',
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '43 20% 96%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '43 30% 94%',
      accentForeground: '0 0% 3.9%',
      border: '43 30% 88%',
      input: '0 0% 100%',
      inputBorder: '43 30% 85%',
      ring: '43 67% 53%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '43 67% 53%',
      warningForeground: '0 0% 20%',
      sidebarBackground: '43 67% 43%', // Dorado oscuro
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '43 67% 38%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '43 67% 53%',
      sidebarAccentForeground: '0 0% 20%',
      sidebarBorder: '43 67% 48%',
      sidebarRing: '43 67% 53%',
    }
  },
  {
    name: 'burgundy',
    displayName: 'Borgoña Tradicional',
    description: 'Tema con borgoña tradicional y dorado antiguo',
    colors: {
      primary: '0 50% 40%',
      primaryForeground: '0 0% 98%',
      primaryLight: '0 50% 50%',
      primaryDark: '0 50% 30%',
      primaryHover: '0 50% 45%',
      secondary: '41 50% 45%',
      secondaryForeground: '0 0% 98%',
      secondaryLight: '41 50% 55%',
      secondaryHover: '41 50% 50%',
      background: '0 0% 98%', // Fondo blanco/muy claro para mejor legibilidad
      foreground: '0 0% 3.9%',
      card: '0 0% 100%',
      cardForeground: '0 0% 3.9%',
      muted: '210 40% 98%',
      mutedForeground: '215.4 16.3% 46.9%',
      accent: '210 40% 96%',
      accentForeground: '0 0% 3.9%',
      border: '214.3 31.8% 91.4%',
      input: '0 0% 100%',
      inputBorder: '214.3 31.8% 91.4%',
      ring: '0 50% 40%',
      destructive: '0 84.2% 60.2%',
      destructiveForeground: '0 0% 98%',
      success: '142 76% 36%',
      successForeground: '0 0% 98%',
      warning: '38 92% 50%',
      warningForeground: '0 0% 98%',
      sidebarBackground: '0 50% 30%',
      sidebarForeground: '0 0% 98%',
      sidebarPrimary: '0 50% 20%',
      sidebarPrimaryForeground: '0 0% 98%',
      sidebarAccent: '0 50% 40%',
      sidebarAccentForeground: '0 0% 98%',
      sidebarBorder: '0 50% 25%',
      sidebarRing: '0 50% 40%',
    }
  },
];

interface ThemeContextType {
  currentTheme: string;
  setTheme: (theme: string) => void;
  themePresets: ThemePreset[];
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  customColors: Partial<ThemeColors>;
  setCustomColors: (colors: Partial<ThemeColors>) => void;
  applyCustomColors: () => void;
  resetToPreset: (presetName: string) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('mia'); // Tema MIA como predeterminado
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState<Partial<ThemeColors>>({});

  useEffect(() => {
    // Cargar tema guardado del localStorage
    const savedTheme = localStorage.getItem('parish-theme');
    const savedDarkMode = localStorage.getItem('parish-dark-mode') === 'true';
    const savedCustomColors = localStorage.getItem('parish-custom-colors');

    if (savedTheme && themePresets.find(preset => preset.name === savedTheme)) {
      setCurrentTheme(savedTheme);
    } else {
      // Si no hay tema guardado, usar MIA como predeterminado
      setCurrentTheme('mia');
      localStorage.setItem('parish-theme', 'mia');
    }
    setIsDarkMode(savedDarkMode);
    if (savedCustomColors) {
      try {
        setCustomColors(JSON.parse(savedCustomColors));
      } catch (error) {
        console.error('Error parsing saved custom colors:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Aplicar tema y modo oscuro al documento
    const root = document.documentElement;
    
    // Aplicar/quitar clase dark
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }

    // Aplicar colores del tema
    applyThemeColors();
  }, [currentTheme, isDarkMode, customColors]);

  const applyThemeColors = () => {
    const preset = themePresets.find(p => p.name === currentTheme);
    if (!preset) return;

    const root = document.documentElement;
    const colorsToApply = { ...preset.colors, ...customColors };

    // Aplicar cada color como variable CSS
    Object.entries(colorsToApply).forEach(([key, value]) => {
      const cssVariableName = key.replace(/([A-Z])/g, '-$1').toLowerCase();
      root.style.setProperty(`--${cssVariableName}`, value);
    });
  };

  const setTheme = (theme: string) => {
    setCurrentTheme(theme);
    localStorage.setItem('parish-theme', theme);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('parish-dark-mode', newDarkMode.toString());
  };

  const setCustomColorsAndSave = (colors: Partial<ThemeColors>) => {
    setCustomColors(colors);
    localStorage.setItem('parish-custom-colors', JSON.stringify(colors));
  };

  const applyCustomColors = () => {
    applyThemeColors();
  };

  const resetToPreset = (presetName: string) => {
    setCustomColors({});
    setTheme(presetName);
    localStorage.removeItem('parish-custom-colors');
  };

  const value: ThemeContextType = {
    currentTheme,
    setTheme,
    themePresets,
    isDarkMode,
    toggleDarkMode,
    customColors,
    setCustomColors: setCustomColorsAndSave,
    applyCustomColors,
    resetToPreset,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
