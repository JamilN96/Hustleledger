import { Appearance } from 'react-native';

export const spacing = (factor = 1) => factor * 8; // 8px grid system

export const radii = {
  sm: 6,
  md: 12,
  lg: 24,
  xl: 28,
};

export const useIsDarkMode = () => Appearance.getColorScheme() === 'dark';

const palette = {
  accent1: '#A18CFF',
  accent2: '#58D5F7',
  accent3: '#52FFC5',
  accent4: '#FF9F1C',
  accent5: '#FF6B9A',
};

const buildShared = () => ({
  accent1: palette.accent1,
  accent2: palette.accent2,
  accent3: palette.accent3,
  accent4: palette.accent4,
  accent5: palette.accent5,
  primary: palette.accent2,
  success: '#52FFC5',
  danger: '#FF6B6B',
  warning: '#FFD166',
});

export const useColors = () => {
  const isDark = useIsDarkMode();

  if (isDark) {
    return {
      ...buildShared(true),
      bg: '#050607',
      background: '#050607',
      bgSecondary: '#11131A',
      bgGradient: ['#050607', '#0B1018', '#131D2B'],
      text: '#F7F9FB',
      subtext: 'rgba(247, 249, 251, 0.68)',
      muted: 'rgba(247, 249, 251, 0.32)',
      card: 'rgba(17, 22, 33, 0.78)',
      cardOutline: 'rgba(140, 247, 255, 0.35)',
      cardBorder: 'rgba(7, 10, 18, 0.78)',
      divider: 'rgba(255,255,255,0.08)',
      shadow: 'rgba(6, 13, 28, 0.8)',
      chartPalette: [
        '#58D5F7',
        '#A18CFF',
        '#FF9F1C',
        '#FF6B9A',
        '#52FFC5',
        '#F4F1BB',
      ],
    };
  }

  return {
    ...buildShared(false),
    bg: '#F7F9FB',
    background: '#F7F9FB',
    bgSecondary: '#E9EDF5',
    bgGradient: ['#FFFFFF', '#F0F4FF', '#E1E8FF'],
    text: '#1B1F32',
    subtext: 'rgba(27, 31, 50, 0.62)',
    muted: 'rgba(27, 31, 50, 0.35)',
    card: 'rgba(255, 255, 255, 0.78)',
    cardOutline: 'rgba(88, 213, 247, 0.3)',
    cardBorder: 'rgba(216, 230, 255, 0.9)',
    divider: 'rgba(27,31,50,0.06)',
    shadow: 'rgba(17, 30, 61, 0.16)',
    chartPalette: [
      '#4F46E5',
      '#0EA5E9',
      '#F97316',
      '#EC4899',
      '#14B8A6',
      '#64748B',
    ],
  };
};
