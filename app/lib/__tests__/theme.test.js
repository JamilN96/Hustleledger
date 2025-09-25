import assert from 'node:assert/strict';
import test from 'node:test';

import { spacing, useColors, useIsDarkMode } from '../theme.js';

test('spacing scales based on an 8px rhythm', () => {
  assert.equal(spacing(), 8);
  assert.equal(spacing(0), 0);
  assert.equal(spacing(2.5), 20);
});

test('theme helpers fall back to the mocked dark scheme', () => {
  assert.equal(useIsDarkMode(), true);
  const palette = useColors();
  assert.ok(typeof palette.bg === 'string' && palette.bg.length > 0);
  assert.ok(typeof palette.text === 'string' && palette.text.length > 0);
});
