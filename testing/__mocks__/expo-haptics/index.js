export const NotificationFeedbackType = {
  Success: 'success',
  Warning: 'warning',
  Error: 'error',
};

export async function notificationAsync(type) {
  return type;
}

export default {
  NotificationFeedbackType,
  notificationAsync,
};
