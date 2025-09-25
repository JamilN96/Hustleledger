import { Appearance } from 'react-native';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

export const spacing = (factor = 1) => factor * 8;

export const radii = {
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const useIsDarkMode = () => Appearance.getColorScheme() === 'dark';

const lightPalette = {
  background: '#F5F7FB',
  card: '#FFFFFF',
  text: '#0F1220',
  subtext: '#6B7280',
  primary: '#8B5CF6',
  success: '#22C55E',
  danger: '#EF4444',
  bgGradient: ['#F7FAFF', '#EEF2FF'],
  bgSecondary: '#FFFFFF',
  cardOutline: 'rgba(255, 255, 255, 0.68)',
  cardBorder: 'rgba(15, 18, 32, 0.08)',
  accent2: '#58D5F7',
};

const darkPalette = {
  background: '#0B0D14',
  card: '#141826',
  text: '#E8EAEE',
  subtext: '#9CA3AF',
  primary: '#8B5CF6',
  success: '#34D399',
  danger: '#F87171',
  bgGradient: ['#0B0D14', '#151A2A'],
  bgSecondary: '#0B0D14',
  cardOutline: 'rgba(139, 92, 246, 0.32)',
  cardBorder: 'rgba(255, 255, 255, 0.08)',
  accent2: '#58D5F7',
};

export const useColors = () => {
  const isDark = useIsDarkMode();
  const palette = isDark ? darkPalette : lightPalette;

  const colors = {
    ...palette,
    bg: palette.background,
    background: palette.background,
    primary: palette.primary,
    success: palette.success,
    danger: palette.danger,
    text: palette.text,
    subtext: palette.subtext,
    card: palette.card,
    bgSecondary: palette.bgSecondary,
    bgGradient: palette.bgGradient,
  };

  return {
    ...colors,
    accent1: palette.primary,
    accent2: palette.accent2,
    accent3: palette.success,
  };
};
