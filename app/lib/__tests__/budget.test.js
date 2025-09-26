import assert from 'node:assert/strict';
import test from 'node:test';

import {
  BUDGET_THRESHOLDS,
  calculatePercentUsed,
  getPeriodKey,
  resetBudgetThresholds,
  updateBudgetWithTransaction,
} from '../budget.js';

const MOCK_HAPTICS = {
  NotificationFeedbackType: {
    Warning: 'warning',
    Error: 'error',
    Success: 'success',
  },
  notificationAsync: async (type) => {
    MOCK_HAPTICS.calls.push(type);
  },
  calls: [],
};

const MOCK_NOTIFICATIONS = {
  scheduleNotificationAsync: async (payload) => {
    MOCK_NOTIFICATIONS.calls.push(payload);
  },
  calls: [],
};

const resetMocks = () => {
  MOCK_HAPTICS.calls = [];
  MOCK_NOTIFICATIONS.calls = [];
};

test('calculatePercentUsed returns a stable percentage', () => {
  assert.equal(calculatePercentUsed(0, 0), 0);
  assert.equal(calculatePercentUsed(50, 200), 25);
  assert.equal(calculatePercentUsed(150, 200), 75);
});

test('updateBudgetWithTransaction recomputes totals and triggers thresholds once', async () => {
  resetMocks();
  const baseBudget = {
    name: 'Dining',
    limit: 200,
    spent: 60,
    percentUsed: 30,
  };

  const updated = await updateBudgetWithTransaction({
    budget: baseBudget,
    transaction: { amount: 60, type: 'expense' },
    notificationsEnabled: true,
    hapticsModule: MOCK_HAPTICS,
    notificationsModule: MOCK_NOTIFICATIONS,
    now: new Date('2024-09-01T12:00:00Z'),
  });

  assert.equal(updated.spent, 120);
  assert.equal(updated.percentUsed, 60);
  assert.deepEqual(updated.alerts.triggered, [50]);
  assert.equal(MOCK_HAPTICS.calls.length, 1);
  assert.equal(MOCK_NOTIFICATIONS.calls.length, 1);

  resetMocks();
  const afterSecond = await updateBudgetWithTransaction({
    budget: updated,
    transaction: { amount: 40, type: 'expense' },
    notificationsEnabled: true,
    hapticsModule: MOCK_HAPTICS,
    notificationsModule: MOCK_NOTIFICATIONS,
    now: new Date('2024-09-02T12:00:00Z'),
  });

  assert.equal(afterSecond.spent, 160);
  assert.equal(afterSecond.percentUsed, 80);
  assert.deepEqual(afterSecond.alerts.triggered, [50, 80]);
  assert.equal(MOCK_HAPTICS.calls.length, 1);
  assert.equal(MOCK_NOTIFICATIONS.calls.length, 1);

  resetMocks();
  const noNewThreshold = await updateBudgetWithTransaction({
    budget: afterSecond,
    transaction: { amount: 5, type: 'expense' },
    notificationsEnabled: true,
    hapticsModule: MOCK_HAPTICS,
    notificationsModule: MOCK_NOTIFICATIONS,
    now: new Date('2024-09-03T12:00:00Z'),
  });

  assert.equal(noNewThreshold.spent, 165);
  assert.equal(MOCK_HAPTICS.calls.length, 0);
  assert.equal(MOCK_NOTIFICATIONS.calls.length, 0);
  assert.deepEqual(noNewThreshold.alerts.triggered, [50, 80]);
});

test('crossing multiple thresholds fires each notification once', async () => {
  resetMocks();
  const baseBudget = {
    name: 'Groceries',
    limit: 100,
    spent: 20,
    percentUsed: 20,
  };

  const updated = await updateBudgetWithTransaction({
    budget: baseBudget,
    transaction: { amount: 100, type: 'expense' },
    notificationsEnabled: true,
    hapticsModule: MOCK_HAPTICS,
    notificationsModule: MOCK_NOTIFICATIONS,
    now: new Date('2024-10-01T12:00:00Z'),
  });

  assert.equal(updated.spent, 120);
  assert.equal(updated.percentUsed, 120);
  assert.deepEqual(updated.alerts.triggered, BUDGET_THRESHOLDS);
  assert.equal(MOCK_HAPTICS.calls.length, BUDGET_THRESHOLDS.length);
  assert.equal(MOCK_NOTIFICATIONS.calls.length, BUDGET_THRESHOLDS.length);
});

test('notifications can be disabled for updates', async () => {
  resetMocks();
  const baseBudget = {
    name: 'Travel',
    limit: 500,
    spent: 200,
    percentUsed: 40,
  };

  const updated = await updateBudgetWithTransaction({
    budget: baseBudget,
    transaction: { amount: 150, type: 'expense' },
    notificationsEnabled: false,
    hapticsModule: MOCK_HAPTICS,
    notificationsModule: MOCK_NOTIFICATIONS,
    now: new Date('2024-09-05T12:00:00Z'),
  });

  assert.equal(updated.percentUsed, 70);
  assert.deepEqual(updated.alerts.triggered, [50]);
  assert.equal(MOCK_HAPTICS.calls.length, 0);
  assert.equal(MOCK_NOTIFICATIONS.calls.length, 0);
});

test('editing a transaction adjusts the spent amount correctly', async () => {
  resetMocks();
  const baseBudget = {
    name: 'Dining',
    limit: 300,
    spent: 200,
    percentUsed: 66.67,
    alerts: {
      periodKey: getPeriodKey(new Date('2024-08-01T00:00:00Z')),
      triggered: [50, 80],
    },
  };

  const updated = await updateBudgetWithTransaction({
    budget: baseBudget,
    transaction: { amount: 90, type: 'expense' },
    previousTransaction: { amount: 120, type: 'expense' },
    notificationsEnabled: true,
    hapticsModule: MOCK_HAPTICS,
    notificationsModule: MOCK_NOTIFICATIONS,
    now: new Date('2024-08-15T12:00:00Z'),
  });

  assert.equal(updated.spent, 170);
  assert.equal(Math.round(updated.percentUsed), 57);
  assert.deepEqual(updated.alerts.triggered, [50, 80]);
});

test('resetBudgetThresholds clears threshold history for the current period', () => {
  const budget = {
    name: 'Wellness',
    limit: 150,
    alerts: {
      periodKey: '2024-08',
      triggered: [50, 80],
    },
  };

  const reset = resetBudgetThresholds(budget, new Date('2024-09-02T12:00:00Z'));
  assert.equal(reset.alerts.triggered.length, 0);
  assert.equal(reset.alerts.periodKey, getPeriodKey(new Date('2024-09-02T12:00:00Z')));
});
