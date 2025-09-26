import { useCallback, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const BUDGET_NOTIFICATIONS_STORAGE_KEY = '@hustleledger/settings/budgetNotificationsEnabled';

const isDev = typeof __DEV__ !== 'undefined' ? __DEV__ : process.env.NODE_ENV !== 'production';

function parseBoolean(value, defaultValue = true) {
  if (value === null || value === undefined) {
    return defaultValue;
  }

  if (typeof value === 'boolean') {
    return value;
  }

  if (typeof value === 'number') {
    return value !== 0;
  }

  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['true', '1', 'yes', 'on'].includes(normalized)) {
      return true;
    }
    if (['false', '0', 'no', 'off'].includes(normalized)) {
      return false;
    }
  }

  return defaultValue;
}

export async function getBudgetNotificationsEnabled(defaultValue = true) {
  try {
    const stored = await AsyncStorage.getItem(BUDGET_NOTIFICATIONS_STORAGE_KEY);
    if (stored === null || stored === undefined) {
      return defaultValue;
    }
    return parseBoolean(stored, defaultValue);
  } catch (error) {
    if (isDev) {
      console.warn('HustleLedger: failed to read budget notification preference', error);
    }
    return defaultValue;
  }
}

export async function setBudgetNotificationsEnabled(enabled) {
  try {
    await AsyncStorage.setItem(
      BUDGET_NOTIFICATIONS_STORAGE_KEY,
      enabled ? 'true' : 'false'
    );
  } catch (error) {
    if (isDev) {
      console.warn('HustleLedger: failed to persist budget notification preference', error);
    }
    throw error;
  }
}

export async function resetBudgetNotificationsPreference(defaultValue = true) {
  if (defaultValue) {
    await AsyncStorage.removeItem(BUDGET_NOTIFICATIONS_STORAGE_KEY);
    return;
  }
  await AsyncStorage.setItem(BUDGET_NOTIFICATIONS_STORAGE_KEY, 'false');
}

export function useBudgetNotificationSetting(defaultEnabled = true) {
  const [enabled, setEnabledState] = useState(defaultEnabled);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const enabledRef = useRef(defaultEnabled);

  useEffect(() => {
    let cancelled = false;

    const loadPreference = async () => {
      try {
        const value = await getBudgetNotificationsEnabled(defaultEnabled);
        if (!cancelled) {
          enabledRef.current = value;
          setEnabledState(value);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          if (isDev) {
            console.warn('HustleLedger: failed to load budget notification preference', err);
          }
          setError(err);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadPreference();

    return () => {
      cancelled = true;
    };
  }, [defaultEnabled]);

  useEffect(() => {
    enabledRef.current = enabled;
  }, [enabled]);

  const persist = useCallback(async (nextEnabled) => {
    const previous = enabledRef.current;
    setEnabledState(nextEnabled);

    try {
      await setBudgetNotificationsEnabled(nextEnabled);
      enabledRef.current = nextEnabled;
      setError(null);
      return true;
    } catch (err) {
      enabledRef.current = previous;
      setEnabledState(previous);
      if (isDev) {
        console.warn('HustleLedger: failed to save budget notification preference', err);
      }
      setError(err);
      return false;
    }
  }, []);

  const toggle = useCallback(() => {
    return persist(!enabledRef.current);
  }, [persist]);

  return {
    enabled,
    isLoading,
    error,
    setEnabled: persist,
    toggle,
  };
}
