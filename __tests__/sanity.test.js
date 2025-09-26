const { describe, it } = require('node:test');
const assert = require('node:assert/strict');

describe('sanity check', () => {
  it('confirms the test runner works', () => {
    assert.equal(true, true);
  });
});
