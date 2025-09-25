import { Appearance } from 'react-native';

const dark = {
  bg: '#0B0B0F',
  card: 'rgba(255,255,255,0.06)',
  text: '#EDEDF2',
  subtext: '#A3A3B2',
  accent1: '#B69CFF',
  accent2: '#6FE6FF',
  success: '#6BFFB8',
  danger: '#FF6B88',
};
const light = {
  bg: '#F5F5F8',
  card: 'rgba(0,0,0,0.06)',
  text: '#101016',
  subtext: '#57576A',
  accent1: '#7C5CFF',
  accent2: '#00B7FF',
  success: '#0FBF65',
  danger: '#E03A56',
};

export const radii = { xl: 28, lg: 20, md: 14 };
export const spacing = (n = 1) => 8 * n;

export const useColors = () => {
  const scheme = Appearance.getColorScheme() || 'dark';
  return scheme === 'dark' ? dark : light;
};
