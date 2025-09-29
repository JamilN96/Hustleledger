#!/usr/bin/env node
const { spawn } = require('node:child_process');
const path = require('node:path');

const passthroughArgs = process.argv
  .slice(2)
  .filter((arg) => !arg.startsWith('--watch'));

const loaderPath = path.resolve(__dirname, 'react-native-loader.mjs');

const mockPath = path.resolve(__dirname, '__mocks__');
const nodePath = process.env.NODE_PATH
  ? `${mockPath}${path.delimiter}${process.env.NODE_PATH}`
  : mockPath;

const registerPath = path.resolve(__dirname, 'register-mocks.cjs');

const child = spawn(process.execPath, ['--require', registerPath, '--test', '--loader', loaderPath, ...passthroughArgs], {
  stdio: 'inherit',
  env: { ...process.env, NODE_PATH: nodePath },
});

child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
