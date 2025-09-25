import assert from 'node:assert/strict';
import test from 'node:test';

import {
  __getScheduled,
  __resetMocks,
} from '../../../testing/__mocks__/expo-notifications.js';
import { scheduleReminderNotification, sendRecurringNotification } from '../notifications.js';

test('sendRecurringNotification composes readable alert text', async () => {
  __resetMocks();
  await sendRecurringNotification({ title: 'Rent', amount: 1200 }, new Date('2024-10-01T00:00:00Z'));
  const scheduled = __getScheduled();
  assert.equal(scheduled.length, 1);
  assert.equal(scheduled[0].content.title, 'Recurring Transaction Added');
  assert.equal(scheduled[0].content.body, 'Rent $1,200.00 added for Oct 1');
});

test('scheduleReminderNotification returns identifier for future events', async () => {
  __resetMocks();
  const id = await scheduleReminderNotification({
    title: 'Invoice',
    nextOccurrence: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    remindOneDayBefore: true,
  });
  assert.match(id ?? '', /^mock-/);
});
