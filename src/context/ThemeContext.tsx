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
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [customColors, setCustomColors] = useState<Partial<ThemeColors>>({});

  useEffect(() => {
    // Cargar tema guardado del localStorage
    const savedTheme = localStorage.getItem('parish-theme');
    const savedDarkMode = localStorage.getItem('parish-dark-mode') === 'true';
    const savedCustomColors = localStorage.getItem('parish-custom-colors');

    if (savedTheme && themePresets.find(preset => preset.name === savedTheme)) {
      setCurrentTheme(savedTheme);
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
