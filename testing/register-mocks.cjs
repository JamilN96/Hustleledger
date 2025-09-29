const Module = require('module');
const path = require('node:path');

const originalLoad = Module._load;
const mockDirectory = path.resolve(__dirname, '__mocks__');
const reactNativeEntry = path.join(mockDirectory, 'react-native', 'index.js');

Module._load = function patchedLoad(request, parent, isMain) {
  if (request === 'react-native') {
    return originalLoad(reactNativeEntry, parent, isMain);
  }

  return originalLoad.apply(this, arguments);
};
