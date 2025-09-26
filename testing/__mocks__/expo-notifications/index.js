let counter = 0;

export async function scheduleNotificationAsync({ content, trigger }) {
  counter += 1;
  return {
    id: `mock-notification-${counter}`,
    content,
    trigger,
  };
}

export async function cancelAllScheduledNotificationsAsync() {
  counter = 0;
}

export async function requestPermissionsAsync() {
  return { status: 'granted', granted: true };
}

export default {
  scheduleNotificationAsync,
  cancelAllScheduledNotificationsAsync,
  requestPermissionsAsync,
};
