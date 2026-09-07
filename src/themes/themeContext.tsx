import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { Theme } from '../types';
import { DEFAULT_THEME, PRESET_THEMES } from './presets';
import { audio } from '../services/audioManager';

interface ThemeContextType {
  theme: Theme;
  currentTheme: Theme;
  setTheme: (theme: Theme) => void;
  setThemeById: (themeId: string) => void;
  availableThemes: Theme[];
  addCustomTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode; initialTheme?: Theme }> = ({
  children,
  initialTheme = DEFAULT_THEME
}) => {
  const [availableThemes, setAvailableThemes] = useState<Theme[]>(() => {
    try {
      const stored = localStorage.getItem('redgiant_custom_themes');
      if (stored) {
        const parsed = JSON.parse(stored);
        return [...PRESET_THEMES, ...parsed];
      }
    } catch {}
    return PRESET_THEMES;
  });

  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    try {
      const savedThemeId = localStorage.getItem('redgiant_active_theme_id');
      if (savedThemeId) {
        const found = availableThemes.find((t) => t.identity.id === savedThemeId);
        if (found) return found;
      }
    } catch {}
    return initialTheme;
  });

  // Inject CSS variables into the document root whenever currentTheme changes
  useEffect(() => {
    const root = document.documentElement;
    const { colors, typography } = currentTheme;

    root.style.setProperty('--theme-primary', colors.primary);
    root.style.setProperty('--theme-secondary', colors.secondary);
    root.style.setProperty('--theme-accent', colors.accent);
    root.style.setProperty('--theme-bg', colors.background);
    root.style.setProperty('--theme-surface', colors.surface);
    root.style.setProperty('--theme-card', colors.card);
    root.style.setProperty('--theme-text', colors.textPrimary);
    root.style.setProperty('--theme-text-muted', colors.textSecondary);
    root.style.setProperty('--theme-border', colors.border);
    root.style.setProperty('--theme-glow', colors.glow);

    // Also update audio manager pack
    if (currentTheme.assets.soundPack) {
      audio.setSoundPack(currentTheme.assets.soundPack);
    }

    try {
      localStorage.setItem('redgiant_active_theme_id', currentTheme.identity.id);
    } catch {}
  }, [currentTheme]);

  const setTheme = (theme: Theme) => {
    setCurrentTheme(theme);
  };

  const setThemeById = (themeId: string) => {
    const found = availableThemes.find((t) => t.identity.id === themeId);
    if (found) {
      setCurrentTheme(found);
    }
  };

  const addCustomTheme = (theme: Theme) => {
    setAvailableThemes((prev) => {
      const filtered = prev.filter((t) => t.identity.id !== theme.identity.id);
      const updated = [...filtered, theme];
      try {
        const customOnly = updated.filter((t) => !t.identity.isTemplate);
        localStorage.setItem('redgiant_custom_themes', JSON.stringify(customOnly));
      } catch {}
      return updated;
    });
    setCurrentTheme(theme);
  };

  const value = useMemo(
    () => ({
      theme: currentTheme,
      currentTheme,
      setTheme,
      setThemeById,
      availableThemes,
      addCustomTheme
    }),
    [currentTheme, availableThemes]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
