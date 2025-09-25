import { Appearance } from 'react-native';

export const spacing = (factor = 1) => factor * 8; // 8px grid system

export const radii = {
  sm: 6,
  md: 12,
  lg: 24,
  xl: 32,
};

const lightPalette = {
  bg: '#F7F8FF',
  bgSecondary: '#E6EAFF',
  bgGradient: ['#FBFCFF', '#EFF2FF', '#E4E8FF'],
  background: '#FFFFFF',
  card: 'rgba(255,255,255,0.82)',
  cardOutline: 'rgba(127, 108, 255, 0.35)',
  cardBorder: 'rgba(79, 193, 249, 0.28)',
  text: '#141425',
  subtext: 'rgba(20, 20, 37, 0.68)',
  accent1: '#7F6CFF',
  accent2: '#4FC1F9',
  accent3: '#2AC6A4',
  success: '#2AC6A4',
  danger: '#FF5C7A',
  primary: '#7F6CFF',
};

const darkPalette = {
  bg: '#050510',
  bgSecondary: '#0C0C1F',
  bgGradient: ['#050510', '#09091B', '#10112A'],
  background: '#050510',
  card: 'rgba(12,12,28,0.78)',
  cardOutline: 'rgba(161, 140, 255, 0.34)',
  cardBorder: 'rgba(88, 213, 247, 0.32)',
  text: '#F7F7FF',
  subtext: 'rgba(247, 247, 255, 0.74)',
  accent1: '#A18CFF',
  accent2: '#58D5F7',
  accent3: '#52FFC5',
  success: '#52FFC5',
  danger: '#FF6B6B',
  primary: '#A18CFF',
};

export const useIsDarkMode = () => Appearance.getColorScheme() === 'dark';

export const useColors = () => {
  const isDark = useIsDarkMode();
  const palette = isDark ? darkPalette : lightPalette;
  return {
    ...palette,
    isDark,
    mode: isDark ? 'dark' : 'light',
  };
};
