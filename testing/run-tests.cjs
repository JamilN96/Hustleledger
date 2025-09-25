#!/usr/bin/env node
const { spawn } = require('node:child_process');
const path = require('node:path');

const passthroughArgs = process.argv
  .slice(2)
  .filter((arg) => !arg.startsWith('--watch'));

const loaderPath = path.resolve(__dirname, 'react-native-loader.mjs');

const child = spawn(process.execPath, ['--test', '--loader', loaderPath, ...passthroughArgs], {
  stdio: 'inherit',
  env: process.env,
});

child.on('exit', (code) => process.exit(code ?? 0));
child.on('error', (error) => {
  console.error(error);
  process.exit(1);
});
