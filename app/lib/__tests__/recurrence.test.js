import assert from 'node:assert/strict';
import test from 'node:test';

import { calculateNextDate, generateOccurrencesUntil } from '../recurrence.js';

test('calculateNextDate advances daily, weekly, and monthly schedules', () => {
  const baseDate = new Date('2024-09-01T00:00:00Z');
  assert.equal(calculateNextDate(baseDate, 'daily')?.toISOString(), '2024-09-02T00:00:00.000Z');
  assert.equal(calculateNextDate(baseDate, 'weekly')?.toISOString(), '2024-09-08T00:00:00.000Z');
  assert.equal(calculateNextDate(baseDate, 'monthly')?.toISOString(), '2024-10-01T00:00:00.000Z');
});

test('generateOccurrencesUntil processes missed recurring dates', () => {
  const template = {
    isRecurring: true,
    recurrence: 'weekly',
    nextOccurrence: '2024-09-01T00:00:00.000Z',
    endDate: null,
    recurrenceMeta: {},
  };

  const { occurrences, nextOccurrence } = generateOccurrencesUntil(template, new Date('2024-09-29T00:00:00Z'));

  assert.equal(occurrences.length, 5);
  assert.equal(occurrences[0].toISOString(), '2024-09-01T00:00:00.000Z');
  assert.equal(occurrences[4].toISOString(), '2024-09-29T00:00:00.000Z');
  assert.equal(nextOccurrence?.toISOString(), '2024-10-06T00:00:00.000Z');
});
