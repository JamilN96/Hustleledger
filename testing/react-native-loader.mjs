const MOCK_MAP = new Map(
  Object.entries({
    'react-native': './__mocks__/react-native/index.js',
    'expo-haptics': './__mocks__/expo-haptics/index.js',
    'expo-notifications': './__mocks__/expo-notifications/index.js',
    '@react-native-async-storage/async-storage':
      './__mocks__/@react-native-async-storage/async-storage/index.js',
  })
);

export async function resolve(specifier, context, defaultResolve) {
  if (MOCK_MAP.has(specifier)) {
    const mockPath = MOCK_MAP.get(specifier);
    return { url: new URL(mockPath, import.meta.url).href, shortCircuit: true };
  }
  return defaultResolve(specifier, context, defaultResolve);
}
