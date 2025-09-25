import { Appearance } from 'react-native';

const dark = {
  bg: '#050510',
  bgSecondary: '#0F1432',
  card: 'rgba(26, 28, 54, 0.72)',
  cardBorder: 'rgba(111, 230, 255, 0.22)',
  cardOutline: 'rgba(124, 92, 255, 0.18)',
  text: '#F5F6FF',
  subtext: '#A1A6C8',
  accent1: '#A889FF',
  accent2: '#64E7FE',
  accent3: '#2CFFB5',
  success: '#5CFFBD',
  danger: '#FF7A93',
  bgGradient: ['#050510', '#0F1432', '#050510'],
  cardGradient: ['rgba(168, 137, 255, 0.18)', 'rgba(100, 231, 254, 0.12)'],
};
const light = {
  bg: '#F6F6FF',
  bgSecondary: '#FFFFFF',
  card: 'rgba(255, 255, 255, 0.86)',
  cardBorder: 'rgba(100, 231, 254, 0.28)',
  cardOutline: 'rgba(124, 92, 255, 0.25)',
  text: '#141326',
  subtext: '#5B5B76',
  accent1: '#6A4BFF',
  accent2: '#00BEE7',
  accent3: '#00D58F',
  success: '#00B46F',
  danger: '#F04D7F',
  bgGradient: ['#ECECFF', '#F9FAFF', '#ECECFF'],
  cardGradient: ['rgba(106, 75, 255, 0.12)', 'rgba(0, 190, 231, 0.08)'],
};

const resolveColors = () => {
  const scheme = Appearance.getColorScheme() || 'dark';
  return scheme === 'dark' ? dark : light;
};
