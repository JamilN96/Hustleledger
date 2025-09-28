import { Appearance } from 'react-native';

export const spacing = (factor = 1) => factor * 8; // 8px grid system

export const radii = {
  sm: 6,
  md: 12,
  lg: 24,
  xl: 36,
};

export const useIsDarkMode = () => {
  return Appearance.getColorScheme() === 'dark';
};

export const useColors = () => {
  const isDark = useIsDarkMode();

  const shared = {
    accent1: '#A18CFF',
    accent2: '#58D5F7',
    success: '#3DD598',
  };

  if (isDark) {
    return {
      ...shared,
      bg: '#02030A',
      bgSecondary: '#0B0F23',
      bgGradient: ['#040510', '#10133a', '#1e1b3d'],
      text: '#F7F9FF',
      subtext: 'rgba(231, 236, 255, 0.76)',
      card: 'rgba(12, 16, 48, 0.55)',
      cardBorder: 'rgba(130, 115, 255, 0.36)',
      cardOutline: 'rgba(255, 255, 255, 0.08)',
      danger: '#FF6F91',
    };
  }

  return {
    ...shared,
    // Backgrounds
    bg: '#FFFFFF',
    background: '#f8f9ff',
    bgSecondary: '#F2F2F7',
    bgGradient: ['#ffffff', '#f4f4f4', '#eaeaea'],

    // Text
    text: '#1A1A1A',
    subtext: 'rgba(38, 44, 64, 0.72)',
    danger: '#FF6B6B',

    // Surfaces
    card: 'rgba(255, 255, 255, 0.78)',
    cardBorder: 'rgba(88, 213, 247, 0.2)',
    cardOutline: 'rgba(161, 140, 255, 0.16)',
    inputBackground: 'rgba(255, 255, 255, 0.88)',
  };
};
