import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { transform } from 'sucrase';

const MOCK_URL = new URL('./__mocks__/react-native/index.js', import.meta.url).href;

export async function resolve(specifier, context, defaultResolve) {
  if (specifier === 'react-native') {
    return { url: MOCK_URL, shortCircuit: true };
  }
  try {
    return await defaultResolve(specifier, context, defaultResolve);
  } catch (error) {
    if (specifier.startsWith('.') && !specifier.endsWith('.js')) {
      return defaultResolve(`${specifier}.js`, context, defaultResolve);
    }
    throw error;
  }
}

export async function load(url, context, defaultLoad) {
  if (url.startsWith('file://') && url.includes('/app/')) {
    const filename = fileURLToPath(url);
    const source = await readFile(filename, 'utf8');

    if (/\.js$/.test(filename)) {
      const { code } = transform(source, { transforms: ['jsx'], jsxRuntime: 'automatic' });
      return { format: 'module', source: code, shortCircuit: true }; 
    }
  }

  return defaultLoad(url, context, defaultLoad);
}
