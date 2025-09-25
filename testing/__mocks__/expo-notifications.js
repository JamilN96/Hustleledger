const scheduled = [];

export const AndroidImportance = { DEFAULT: 'default' };
export const IosAuthorizationStatus = { PROVISIONAL: 'provisional' };

export function setNotificationHandler() {}

export async function setNotificationChannelAsync() {
  return true;
}

export async function getPermissionsAsync() {
  return { granted: true, ios: { status: 'granted' } };
}

export async function requestPermissionsAsync() {
  return { granted: true, ios: { status: 'granted' } };
}

export async function scheduleNotificationAsync(payload) {
  scheduled.push(payload);
  return `mock-${scheduled.length}`;
}

export async function cancelScheduledNotificationAsync(identifier) {
  return identifier;
}

export function __getScheduled() {
  return scheduled;
}

export function __resetMocks() {
  scheduled.length = 0;
}
