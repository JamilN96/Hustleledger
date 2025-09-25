const MOCK_URL = new URL('./__mocks__/react-native/index.js', import.meta.url).href;
const NOTIFICATIONS_URL = new URL('./__mocks__/expo-notifications.js', import.meta.url).href;

export async function resolve(specifier, context, defaultResolve) {
  if (specifier === 'react-native') {
    return { url: MOCK_URL, shortCircuit: true };
  }
  if (specifier === 'expo-notifications') {
    return { url: NOTIFICATIONS_URL, shortCircuit: true };
  }
  return defaultResolve(specifier, context, defaultResolve);
}
