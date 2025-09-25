import { Appearance } from 'react-native';

export const spacing = (factor = 1) => factor * 8; // 8px grid system

export const radii = {
  sm: 6,
  md: 12,
  lg: 20,
  xl: 28,
};

export const useIsDarkMode = () => {
  return Appearance.getColorScheme() === 'dark';
};

const lightPalette = {
  bg: '#F5F7FB',
  bgSecondary: '#E7ECF5',
  background: '#F5F7FB',
  bgGradient: ['#f7f8fc', '#eef2fb', '#e3e7f5'],
  card: 'rgba(255,255,255,0.75)',
  cardBorder: 'rgba(255,255,255,0.55)',
  cardOutline: 'rgba(255,255,255,0.92)',
  divider: 'rgba(15,23,42,0.08)',
  text: '#101828',
  subtext: '#475467',
  accent1: '#A18CFF',
  accent2: '#58D5F7',
  accent3: '#52FFC5',
  success: '#12B76A',
  danger: '#F04438',
  menuBackground: 'rgba(255,255,255,0.95)',
  segmentBackground: 'rgba(15,23,42,0.08)',
  primary: '#A18CFF',
};

const darkPalette = {
  bg: '#050510',
  bgSecondary: '#10111F',
  background: '#050510',
  bgGradient: ['#03030a', '#09091a', '#111226'],
  card: 'rgba(15,15,25,0.78)',
  cardBorder: 'rgba(120,121,255,0.22)',
  cardOutline: 'rgba(255,255,255,0.08)',
  divider: 'rgba(255,255,255,0.08)',
  text: '#EEF2FF',
  subtext: '#B8C2EE',
  accent1: '#8C7CFF',
  accent2: '#4FC9F4',
  accent3: '#52FFC5',
  success: '#4ADE80',
  danger: '#F87171',
  menuBackground: 'rgba(21,22,36,0.96)',
  segmentBackground: 'rgba(255,255,255,0.08)',
  primary: '#8C7CFF',
};

export const useColors = () => {
  const isDark = useIsDarkMode();
  return isDark ? darkPalette : lightPalette;
};
