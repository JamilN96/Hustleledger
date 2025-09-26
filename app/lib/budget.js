import { getBudgetNotificationsEnabled } from './settings/budgetNotifications.js';

export const BUDGET_THRESHOLDS = [50, 80, 100];

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

export function calculatePercentUsed(spent = 0, limit = 0) {
  const safeSpent = Number.isFinite(spent) && spent > 0 ? spent : 0;
  const safeLimit = Number.isFinite(limit) && limit > 0 ? limit : 0;

  if (safeLimit === 0) {
    return 0;
  }

  const percent = (safeSpent / safeLimit) * 100;
  return Math.round(percent * 100) / 100;
}

function toNumberList(values = []) {
  return Array.from(
    new Set(
      values
        .map((value) => Number(value))
        .filter((value) => Number.isFinite(value))
    )
  ).sort((a, b) => a - b);
}

function getISOWeek(date) {
  const tmp = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = tmp.getUTCDay() || 7;
  tmp.setUTCDate(tmp.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(tmp.getUTCFullYear(), 0, 1));
  const weekNo = Math.ceil(((tmp - yearStart) / MS_PER_DAY + 1) / 7);
  return { year: tmp.getUTCFullYear(), week: weekNo };
}

export function getPeriodKey(dateInput, cadence = 'monthly') {
  const date = new Date(dateInput ?? Date.now());
  if (Number.isNaN(date.valueOf())) {
    return 'invalid';
  }
  date.setHours(0, 0, 0, 0);

  switch (cadence) {
    case 'daily': {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${date.getFullYear()}-${month}-${day}`;
    }
    case 'weekly': {
      const { year, week } = getISOWeek(date);
      return `${year}-W${String(week).padStart(2, '0')}`;
    }
    case 'monthly':
    default: {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      return `${date.getFullYear()}-${month}`;
    }
  }
}

function getPeriodStartDate(dateInput, cadence = 'monthly') {
  const date = new Date(dateInput ?? Date.now());
  if (Number.isNaN(date.valueOf())) {
    return new Date();
  }
  date.setHours(0, 0, 0, 0);

  switch (cadence) {
    case 'daily':
      return date;
    case 'weekly': {
      const day = date.getDay() || 7; // ISO Monday start
      const diff = day - 1;
      date.setDate(date.getDate() - diff);
      return date;
    }
    case 'monthly':
    default:
      date.setDate(1);
      return date;
  }
}

function ensureAlertState(budget, periodKey) {
  if (budget?.alerts?.periodKey === periodKey) {
    return {
      periodKey,
      triggered: toNumberList(budget.alerts.triggered),
    };
  }

  if (budget?.triggeredThresholds?.periodKey === periodKey) {
    return {
      periodKey,
      triggered: toNumberList(budget.triggeredThresholds.values ?? budget.triggeredThresholds.triggered),
    };
  }

  return {
    periodKey,
    triggered: [],
  };
}

function extractExpenseAmount(transaction) {
  if (!transaction) {
    return 0;
  }

  const rawAmount = Number(transaction.amount);
  const amount = Number.isFinite(rawAmount) ? Math.abs(rawAmount) : 0;

  const normalized = (value) => String(value ?? '').toLowerCase();

  const type = normalized(transaction.type ?? transaction.categoryType);
  if (type === 'income' || type === 'credit') {
    return 0;
  }
  if (type === 'expense' || type === 'debit') {
    return amount;
  }

  if (typeof transaction.isExpense === 'boolean') {
    return transaction.isExpense ? amount : 0;
  }

  const direction = normalized(transaction.direction ?? transaction.flow ?? transaction.kind);
  if (direction === 'income' || direction === 'credit' || direction === 'incoming' || direction === 'in') {
    return 0;
  }
  if (direction === 'expense' || direction === 'debit' || direction === 'outgoing' || direction === 'out') {
    return amount;
  }

  if (Number.isFinite(rawAmount) && rawAmount < 0) {
    return Math.abs(rawAmount);
  }

  return amount;
}

function getNewlyCrossedThresholds(prevPercent, nextPercent, triggered, thresholds = BUDGET_THRESHOLDS) {
  const seen = new Set((triggered ?? []).map((value) => Number(value)));
  const ordered = [...thresholds].sort((a, b) => a - b);

  return ordered.filter((threshold) => {
    const numeric = Number(threshold);
    if (!Number.isFinite(numeric)) {
      return false;
    }
    if (seen.has(numeric)) {
      return false;
    }
    return prevPercent < numeric && nextPercent >= numeric;
  });
}

let cachedHaptics;
async function loadHaptics() {
  if (cachedHaptics !== undefined) {
    return cachedHaptics;
  }
  try {
    cachedHaptics = await import('expo-haptics');
  } catch (error) {
    if (isDev) {
      console.warn('HustleLedger: unable to load expo-haptics', error);
    }
    cachedHaptics = null;
  }
  return cachedHaptics;
}

let cachedNotifications;
async function loadNotifications() {
  if (cachedNotifications !== undefined) {
    return cachedNotifications;
  }
  try {
    cachedNotifications = await import('expo-notifications');
  } catch (error) {
    if (isDev) {
      console.warn('HustleLedger: unable to load expo-notifications', error);
    }
    cachedNotifications = null;
  }
  return cachedNotifications;
}

async function triggerHaptic(threshold, hapticsModule) {
  if (!hapticsModule || typeof hapticsModule.notificationAsync !== 'function') {
    return;
  }
  const feedback = hapticsModule.NotificationFeedbackType ?? {};
  const type = threshold >= 100
    ? feedback.Error ?? feedback.Warning ?? feedback.Success ?? 'error'
    : feedback.Warning ?? feedback.Success ?? 'warning';
  try {
    await hapticsModule.notificationAsync(type);
  } catch (error) {
    if (isDev) {
      console.warn('HustleLedger: budget haptic feedback failed', error);
    }
  }
}

function buildNotificationContent(budget, threshold, percentUsed) {
  const name = budget?.name ?? 'budget';
  const rounded = Math.round(percentUsed);

  const title = `${name} budget alert`;
  const body = threshold >= 100
    ? `You've exceeded your ${name} budget. ${rounded}% spent.`
    : `You've crossed ${threshold}% of your ${name} budget (${rounded}% spent).`;

  return { title, body };
}

async function triggerNotification(threshold, budget, percentUsed, notificationsModule) {
  if (!notificationsModule || typeof notificationsModule.scheduleNotificationAsync !== 'function') {
    return;
  }

  const { title, body } = buildNotificationContent(budget, threshold, percentUsed);

  try {
    await notificationsModule.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
      },
      trigger: null,
    });
  } catch (error) {
    if (isDev) {
      console.warn('HustleLedger: budget notification scheduling failed', error);
    }
  }
}

async function dispatchAlerts(thresholds, budget, percentUsed, hapticsModule, notificationsModule) {
  for (const threshold of thresholds) {
    await triggerHaptic(threshold, hapticsModule);
    await triggerNotification(threshold, budget, percentUsed, notificationsModule);
  }
}

export async function updateBudgetWithTransaction({
  budget,
  transaction,
  previousTransaction = null,
  notificationsEnabled,
  hapticsModule,
  notificationsModule,
  now = new Date(),
  thresholds = BUDGET_THRESHOLDS,
} = {}) {
  if (!budget) {
    throw new TypeError('updateBudgetWithTransaction requires a budget');
  }

  const safeLimit = Number.isFinite(budget.limit) && budget.limit > 0 ? Number(budget.limit) : 0;
  const safeSpent = Number.isFinite(budget.spent) && budget.spent >= 0 ? Number(budget.spent) : 0;
  const previousPercent =
    Number.isFinite(budget.percentUsed) && typeof budget.percentUsed === 'number'
      ? Number(budget.percentUsed)
      : calculatePercentUsed(safeSpent, safeLimit);

  const expenseAmount = extractExpenseAmount(transaction);
  const previousExpenseAmount = extractExpenseAmount(previousTransaction);
  const delta = expenseAmount - previousExpenseAmount;

  const nextSpent = Math.max(0, safeSpent + delta);
  const nextPercent = calculatePercentUsed(nextSpent, safeLimit);

  const cadence = budget.period ?? budget.cadence ?? 'monthly';
  const periodKey = getPeriodKey(now, cadence);
  const alertState = ensureAlertState(budget, periodKey);
  const newlyCrossed = getNewlyCrossedThresholds(previousPercent, nextPercent, alertState.triggered, thresholds);

  const triggered = toNumberList([...alertState.triggered, ...newlyCrossed]);
  const periodStart = getPeriodStartDate(now, cadence).toISOString();
  const lastUpdatedAt = new Date(now ?? Date.now());
  const normalizedUpdatedAt = Number.isNaN(lastUpdatedAt.valueOf())
    ? new Date().toISOString()
    : lastUpdatedAt.toISOString();

  let shouldNotify = notificationsEnabled;
  if (typeof shouldNotify !== 'boolean') {
    shouldNotify = await getBudgetNotificationsEnabled();
  }

  if (shouldNotify && newlyCrossed.length > 0) {
    const loadedHaptics = hapticsModule ?? (await loadHaptics());
    const loadedNotifications = notificationsModule ?? (await loadNotifications());
    await dispatchAlerts(newlyCrossed, budget, nextPercent, loadedHaptics, loadedNotifications);
  }

  return {
    ...budget,
    spent: nextSpent,
    percentUsed: nextPercent,
    periodStart,
    alerts: {
      periodKey,
      triggered,
    },
    lastUpdatedAt: normalizedUpdatedAt,
  };
}

export function resetBudgetThresholds(budget, now = new Date()) {
  if (!budget) {
    throw new TypeError('resetBudgetThresholds requires a budget');
  }
  const cadence = budget.period ?? budget.cadence ?? 'monthly';
  const periodKey = getPeriodKey(now, cadence);
  return {
    ...budget,
    alerts: {
      periodKey,
      triggered: [],
    },
    periodStart: getPeriodStartDate(now, cadence).toISOString(),
  };
}
