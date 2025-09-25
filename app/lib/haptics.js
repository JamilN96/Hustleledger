import * as Haptics from 'expo-haptics';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

export const tapHaptic = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

export const successHaptic = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

export const errorHaptic = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
