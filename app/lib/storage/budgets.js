import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@hustleledger:budgets';
export const BUDGET_PERIODS = {
  MONTHLY: 'monthly',
};
export const DEFAULT_THRESHOLDS = [50, 80, 100];

const normalizeThresholds = (thresholds) => {
  if (!Array.isArray(thresholds)) {
    return [...DEFAULT_THRESHOLDS];
  }
  const cleaned = thresholds
    .map((value) => Number(value))
    .filter((value) => Number.isFinite(value))
    .map((value) => Math.min(Math.max(value, 0), 100));

  return cleaned.length > 0 ? cleaned : [...DEFAULT_THRESHOLDS];
};

export const createBudgetModel = ({
  id,
  categoryId,
  amount,
  period = BUDGET_PERIODS.MONTHLY,
  rollover = false,
  alerts,
}) => {
  const normalizedAlerts = alerts && typeof alerts === 'object' ? alerts : {};

  return {
    id: id ?? (typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}`),
    categoryId,
    amount: Number(amount) || 0,
    period,
    rollover: Boolean(rollover),
    alerts: {
      thresholds: normalizeThresholds(normalizedAlerts.thresholds),
    },
  };
};

export const parseBudgets = (raw) => {
  if (!Array.isArray(raw)) {
    return [];
  }

  return raw
    .map((budget) => {
      if (!budget || typeof budget !== 'object') {
        return null;
      }

      const { id, categoryId, amount, period, rollover, alerts } = budget;
      if (!categoryId) {
        return null;
      }

      return createBudgetModel({ id, categoryId, amount, period, rollover, alerts });
    })
    .filter(Boolean);
};

export const loadBudgets = async () => {
  try {
    const stored = await AsyncStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return [];
    }
    const parsed = JSON.parse(stored);
    return parseBudgets(parsed);
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to load budgets', error);
    }
    return [];
  }
};

export const saveBudgets = async (budgets) => {
  try {
    const payload = JSON.stringify(parseBudgets(budgets));
    await AsyncStorage.setItem(STORAGE_KEY, payload);
    return true;
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to save budgets', error);
    }
    return false;
  }
};

export const upsertBudget = async (budget) => {
  const model = createBudgetModel(budget);
  const existing = await loadBudgets();
  const index = existing.findIndex((item) => item.id === model.id);
  const next = index >= 0 ? [...existing.slice(0, index), model, ...existing.slice(index + 1)] : [...existing, model];
  const saved = await saveBudgets(next);
  return saved ? next : existing;
};
