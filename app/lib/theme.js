import { Appearance } from 'react-native';

export const spacing = (factor = 1) => factor * 8; // 8px grid system

export const radii = {
  sm: 6,
  md: 12,
  lg: 24,
};

export const useIsDarkMode = () => {
  return Appearance.getColorScheme() === 'dark';
};

export const useColors = () => {
  const isDark = useIsDarkMode();

  return {
    // Backgrounds
    bg: isDark ? '#000000' : '#FFFFFF',
    bgSecondary: isDark ? '#121212' : '#F2F2F7',
    bgGradient: isDark
      ? ['#0f0f0f', '#1a1a1a', '#222831']
      : ['#ffffff', '#f4f4f4', '#eaeaea'],

    // Text
    text: isDark ? '#EAEAEA' : '#1A1A1A',

    // Accent
    accent1: '#A18CFF', // purple gradient
    accent2: '#58D5F7', // blue gradient
  };
};
