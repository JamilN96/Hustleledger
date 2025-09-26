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
<<<<<<< HEAD
    ...shared,
    bg: '#FFFFFF',
    bgSecondary: '#F2F2F7',
    bgGradient: ['#f4f7ff', '#e6ecff', '#dce4ff'],
    text: '#151B38',
    subtext: 'rgba(22, 30, 62, 0.72)',
    card: 'rgba(255, 255, 255, 0.88)',
    cardBorder: 'rgba(130, 115, 255, 0.24)',
    cardOutline: 'rgba(161, 140, 255, 0.16)',
    danger: '#D93F6E',
=======
    // Backgrounds
    bg: isDark ? '#000000' : '#FFFFFF',
    background: isDark ? '#05060b' : '#f8f9ff',
    bgSecondary: isDark ? '#121212' : '#F2F2F7',
    bgGradient: isDark
      ? ['#0f0f0f', '#1a1a1a', '#222831']
      : ['#ffffff', '#f4f4f4', '#eaeaea'],

    // Text
    text: isDark ? '#EAEAEA' : '#1A1A1A',
    subtext: isDark ? 'rgba(234, 234, 234, 0.7)' : 'rgba(38, 44, 64, 0.72)',
    danger: '#FF6B6B',

    // Accent
    accent1: '#A18CFF', // purple gradient
    accent2: '#58D5F7', // blue gradient

    // Surfaces
    card: isDark ? 'rgba(9, 14, 31, 0.68)' : 'rgba(255, 255, 255, 0.78)',
    cardBorder: isDark ? 'rgba(88, 213, 247, 0.35)' : 'rgba(88, 213, 247, 0.2)',
    cardOutline: isDark ? 'rgba(161, 140, 255, 0.4)' : 'rgba(161, 140, 255, 0.16)',
    inputBackground: isDark ? 'rgba(9, 14, 29, 0.6)' : 'rgba(255, 255, 255, 0.88)',
>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
  };
};
