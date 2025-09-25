import { Appearance } from 'react-native';

export const spacing = (factor = 1) => factor * 8; // 8px grid system

export const radii = {
  sm: 6,
  md: 14,
  lg: 24,
  xl: 32,
};

export const useIsDarkMode = () => {
  return Appearance.getColorScheme() === 'dark';
};

export const useColors = () => {
  const isDark = useIsDarkMode();

  const shared = {
    accent1: '#9F8CFF',
    accent2: '#4CD1F6',
    accent3: '#59FBD2',
    accent4: '#F6E05E',
    success: '#4CD964',
    danger: '#FF5E7C',
  };

  if (isDark) {
    return {
      ...shared,
      bg: '#050507',
      bgSecondary: '#0B0D13',
      bgGradient: ['#070B17', '#080A12', '#101422'],
      card: 'rgba(12, 18, 32, 0.66)',
      cardBorder: 'rgba(151, 225, 255, 0.24)',
      cardOutline: 'rgba(86, 150, 255, 0.44)',
      divider: 'rgba(255,255,255,0.08)',
      shadow: 'rgba(18, 165, 255, 0.36)',
      text: '#F8FAFF',
      subtext: 'rgba(222, 233, 255, 0.78)',
      muted: 'rgba(222, 233, 255, 0.52)',
    };
  }

  return {
    ...shared,
    bg: '#F7F8FB',
    bgSecondary: '#FFFFFF',
    bgGradient: ['#F6F7FB', '#FFFFFF', '#EAF7FF'],
    card: 'rgba(255,255,255,0.78)',
    cardBorder: 'rgba(114, 182, 255, 0.35)',
    cardOutline: 'rgba(172, 226, 255, 0.62)',
    divider: 'rgba(15,23,42,0.08)',
    shadow: 'rgba(76, 209, 246, 0.26)',
    text: '#080B1A',
    subtext: 'rgba(8,11,26,0.68)',
    muted: 'rgba(8,11,26,0.46)',
  };
};
