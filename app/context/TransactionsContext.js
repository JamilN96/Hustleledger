import React from 'react';
import { AppState } from 'react-native';
import { differenceInHours, formatISO, parseISO } from 'date-fns';

import {
  cancelScheduledNotification,
  configureNotifications,
  scheduleReminderNotification,
  sendRecurringNotification,
} from '../lib/notifications';
import {
  calculateNextDate,
  formatRecurrenceLabel,
  generateOccurrencesUntil,
} from '../lib/recurrence';
import { getItem, setItem } from '../lib/storage';

const TRANSACTIONS_KEY = 'ledger:transactions';
const SETTINGS_KEY = 'settings:recurringNotifications';
const SCHEDULER_KEY = 'scheduler:lastRun';

const TransactionsContext = React.createContext({
  isReady: false,
  transactions: [],
  addTransaction: () => {},
  updateTransaction: () => {},
  deleteTransaction: () => {},
  recurringNotificationsEnabled: true,
  toggleRecurringNotifications: () => {},
  getTransactionById: () => undefined,
  formatRecurrenceLabel: () => 'Not recurring',
  processRecurringTransactions: () => {},
});

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function normalizeTransaction(input) {
  return {
    ...input,
    id: input.id ?? createId(),
    createdAt: input.createdAt ?? formatISO(new Date()),
    updatedAt: formatISO(new Date()),
  };
}

function TransactionsProvider({ children }) {
  const [rawTransactions, setRawTransactions] = React.useState([]);
  const [isReady, setIsReady] = React.useState(false);
  const [recurringNotificationsEnabled, setRecurringNotificationsEnabled] = React.useState(true);
  const lastRunRef = React.useRef(null);
  const appState = React.useRef(AppState.currentState);

  const visibleTransactions = React.useMemo(
    () => rawTransactions.filter((item) => !item.isRecurringTemplate),
    [rawTransactions],
  );

  const getTransactionById = React.useCallback(
    (id) => rawTransactions.find((tx) => tx.id === id),
    [rawTransactions],
  );

  const persistTransactions = React.useCallback(async (transactions) => {
    setRawTransactions(transactions);
    await setItem(TRANSACTIONS_KEY, transactions);
  }, []);

  const loadInitialData = React.useCallback(async () => {
    const [storedTransactions, notificationPref, schedulerState] = await Promise.all([
      getItem(TRANSACTIONS_KEY, []),
      getItem(SETTINGS_KEY, true),
      getItem(SCHEDULER_KEY, null),
    ]);
    setRawTransactions(Array.isArray(storedTransactions) ? storedTransactions : []);
    setRecurringNotificationsEnabled(notificationPref !== false);
    lastRunRef.current = schedulerState?.lastRun ?? null;
    setIsReady(true);
  }, []);

  const toggleRecurringNotifications = React.useCallback(async () => {
    const nextValue = !recurringNotificationsEnabled;
    setRecurringNotificationsEnabled(nextValue);
    await setItem(SETTINGS_KEY, nextValue);
    if (nextValue) {
      await configureNotifications();
      const templates = rawTransactions.filter(
        (item) => item.isRecurringTemplate && item.remindOneDayBefore && item.nextOccurrence,
      );
      if (templates.length > 0) {
        const withReminders = await Promise.all(
          rawTransactions.map(async (item) => {
            if (item.isRecurringTemplate && item.remindOneDayBefore && item.nextOccurrence) {
              const identifier = await scheduleReminderNotification(item);
              return { ...item, reminderNotificationId: identifier };
            }
            return item;
          }),
        );
        await persistTransactions(withReminders);
      }
    } else {
      const templates = rawTransactions.filter((item) => item.isRecurringTemplate);
      await Promise.all(templates.map((item) => cancelScheduledNotification(item.reminderNotificationId)));
      const cleared = rawTransactions.map((item) =>
        item.isRecurringTemplate ? { ...item, reminderNotificationId: null } : item,
      );
      await persistTransactions(cleared);
    }
  }, [persistTransactions, rawTransactions, recurringNotificationsEnabled]);

  const addTransaction = React.useCallback(
    async (transaction) => {
      const base = normalizeTransaction(transaction);
      let updatedList = [...rawTransactions];
      const now = formatISO(new Date());

      if (base.isRecurring) {
        const templateId = createId();
        const template = {
          ...base,
          id: templateId,
          isRecurringTemplate: true,
        recurringParentId: null,
        createdAt: now,
        updatedAt: now,
      };

      const meta = base.recurrence === 'custom' ? { intervalDays: base.recurrenceMeta?.intervalDays ?? 1 } : base.recurrenceMeta;
      template.recurrenceMeta = meta;
      const nextDate = calculateNextDate(base.date ?? new Date(), base.recurrence, meta);
      template.nextOccurrence = nextDate ? formatISO(nextDate) : null;

      if (template.remindOneDayBefore && template.nextOccurrence && recurringNotificationsEnabled) {
        const reminderId = await scheduleReminderNotification(template);
        template.reminderNotificationId = reminderId;
      }

        updatedList = [...updatedList, template];

        const instance = {
          ...base,
          id: createId(),
          isRecurringTemplate: false,
          recurringParentId: templateId,
          nextOccurrence: null,
          createdAt: now,
          updatedAt: now,
        };

        updatedList = [...updatedList, instance];
      } else {
        updatedList = [...updatedList, base];
      }

      updatedList.sort((a, b) => {
        const left = a.date ? new Date(a.date) : new Date(a.createdAt ?? 0);
        const right = b.date ? new Date(b.date) : new Date(b.createdAt ?? 0);
        return right - left;
      });

      await persistTransactions(updatedList);
      return true;
    },
    [persistTransactions, rawTransactions, recurringNotificationsEnabled],
  );

  const updateTransaction = React.useCallback(
    async (id, updates) => {
      const transaction = getTransactionById(id);
      if (!transaction) {
        return false;
      }

      let reminderId = transaction.reminderNotificationId;
      const merged = {
        ...transaction,
        ...updates,
        updatedAt: formatISO(new Date()),
        reminderNotificationId: reminderId,
      };

      const nextTransactions = rawTransactions.map((item) => (item.id === id ? merged : item));
      await persistTransactions(nextTransactions);

      if (merged.isRecurringTemplate) {
        if (merged.remindOneDayBefore && recurringNotificationsEnabled) {
          await cancelScheduledNotification(reminderId);
          const scheduledId = await scheduleReminderNotification(merged);
          await persistTransactions(
            nextTransactions.map((item) =>
              item.id === merged.id ? { ...item, reminderNotificationId: scheduledId } : item,
            ),
          );
        } else if ('remindOneDayBefore' in updates && !updates.remindOneDayBefore) {
          await cancelScheduledNotification(reminderId);
          await persistTransactions(
            nextTransactions.map((item) =>
              item.id === merged.id ? { ...item, reminderNotificationId: null } : item,
            ),
          );
        } else if (!recurringNotificationsEnabled) {
          await cancelScheduledNotification(reminderId);
          await persistTransactions(
            nextTransactions.map((item) =>
              item.id === merged.id ? { ...item, reminderNotificationId: null } : item,
            ),
          );
        }
      }

      return true;
    },
    [getTransactionById, persistTransactions, rawTransactions, recurringNotificationsEnabled],
  );

  const deleteTransaction = React.useCallback(
    async (id, mode = 'single') => {
      const transaction = getTransactionById(id);
      if (!transaction) {
        return false;
      }

      let filtered = rawTransactions.filter((item) => item.id !== id);

      if (mode === 'series') {
        const parentId = transaction.isRecurringTemplate
          ? transaction.id
          : transaction.recurringParentId;
        filtered = filtered.filter(
          (item) =>
            item.id !== parentId &&
            item.recurringParentId !== parentId,
        );
      }

      if (transaction.isRecurringTemplate || mode === 'series') {
        const templateId = transaction.isRecurringTemplate
          ? transaction.id
          : transaction.recurringParentId;
        const template = rawTransactions.find((item) => item.id === templateId);
        if (template) {
          await cancelScheduledNotification(template.reminderNotificationId);
        }
      }

      await persistTransactions(filtered);
      return true;
    },
    [getTransactionById, persistTransactions, rawTransactions],
  );

  const processRecurringTransactions = React.useCallback(
    async (reason = 'manual') => {
      const templates = rawTransactions.filter((item) => item.isRecurringTemplate && item.isRecurring);
      if (templates.length === 0) {
        await setItem(SCHEDULER_KEY, { lastRun: formatISO(new Date()) });
        lastRunRef.current = formatISO(new Date());
        return;
      }

      let transactions = [...rawTransactions];
      const newInstances = [];
      for (const template of templates) {
        const { occurrences, nextOccurrence } = generateOccurrencesUntil(template, new Date());
        if (!occurrences.length && !nextOccurrence) {
          const updatedTemplate = {
            ...template,
            nextOccurrence: null,
            updatedAt: formatISO(new Date()),
          };
          transactions = transactions.map((item) =>
            item.id === template.id ? updatedTemplate : item,
          );
          continue;
        }

        for (const occurrence of occurrences) {
          const instance = {
            ...template,
            id: createId(),
            date: formatISO(occurrence),
            createdAt: formatISO(new Date()),
            updatedAt: formatISO(new Date()),
            isRecurringTemplate: false,
            recurringParentId: template.id,
            nextOccurrence: null,
          };
          newInstances.push(instance);
          transactions.push(instance);
          if (recurringNotificationsEnabled) {
            await sendRecurringNotification(instance, occurrence);
          }
        }

        const updatedTemplate = {
          ...template,
          nextOccurrence: nextOccurrence ? formatISO(nextOccurrence) : null,
          updatedAt: formatISO(new Date()),
        };

        if (updatedTemplate.remindOneDayBefore && recurringNotificationsEnabled) {
          await cancelScheduledNotification(updatedTemplate.reminderNotificationId);
          const reminderId = await scheduleReminderNotification(updatedTemplate);
          updatedTemplate.reminderNotificationId = reminderId;
        } else if (!recurringNotificationsEnabled) {
          await cancelScheduledNotification(updatedTemplate.reminderNotificationId);
          updatedTemplate.reminderNotificationId = null;
        }

        transactions = transactions.map((item) =>
          item.id === template.id ? updatedTemplate : item,
        );
      }

      if (newInstances.length > 0 || reason !== 'manual') {
        transactions.sort((a, b) => {
          const left = a.date ? parseISO(a.date) : new Date(a.createdAt ?? 0);
          const right = b.date ? parseISO(b.date) : new Date(b.createdAt ?? 0);
          return right - left;
        });
      }

      await persistTransactions(transactions);
      const stamp = formatISO(new Date());
      await setItem(SCHEDULER_KEY, { lastRun: stamp });
      lastRunRef.current = stamp;
    },
    [persistTransactions, rawTransactions, recurringNotificationsEnabled],
  );

  React.useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  React.useEffect(() => {
    if (!isReady) {
      return;
    }
    if (recurringNotificationsEnabled) {
      configureNotifications();
    }
    processRecurringTransactions('startup');
    const interval = globalThis.setInterval
      ? globalThis.setInterval(() => {
          processRecurringTransactions('interval');
        }, 24 * 60 * 60 * 1000)
      : null;

    const subscription = AppState.addEventListener('change', (state) => {
      const prev = appState.current;
      appState.current = state;
      if (prev?.match(/inactive|background/) && state === 'active') {
        if (!lastRunRef.current) {
          processRecurringTransactions('resume');
          return;
        }
        const diff = differenceInHours(new Date(), new Date(lastRunRef.current));
        if (diff >= 24) {
          processRecurringTransactions('resume');
        }
      }
    });

    return () => {
      if (interval && globalThis.clearInterval) {
        globalThis.clearInterval(interval);
      }
      subscription.remove();
    };
  }, [isReady, processRecurringTransactions, recurringNotificationsEnabled]);

  const value = React.useMemo(
    () => ({
      isReady,
      transactions: visibleTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      recurringNotificationsEnabled,
      toggleRecurringNotifications,
      getTransactionById,
      formatRecurrenceLabel,
      processRecurringTransactions,
    }),
    [
      isReady,
      visibleTransactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      recurringNotificationsEnabled,
      toggleRecurringNotifications,
      getTransactionById,
      processRecurringTransactions,
    ],
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

function useTransactions() {
  return React.useContext(TransactionsContext);
}

export { TransactionsProvider, useTransactions };
