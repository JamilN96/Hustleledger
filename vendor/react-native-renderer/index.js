/* eslint-env node */
'use strict';

const isProfiling = typeof global !== 'undefined' && global.__PROFILE__ === true;
const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

function loadRenderer() {
  if (isProfiling) {
    // React Native exposes a dedicated profiling build when profiling is enabled.
    return require('react-native/Libraries/Renderer/implementations/ReactNativeRenderer-profiling');
  }
  if (isDev) {
    return require('react-native/Libraries/Renderer/implementations/ReactNativeRenderer-dev');
  }
  return require('react-native/Libraries/Renderer/implementations/ReactNativeRenderer-prod');
}

module.exports = loadRenderer();
