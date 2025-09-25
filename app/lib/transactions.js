import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@hustleledger:customCategories';

const defaultCategories = [
  { id: 'food', name: 'Food', color: '#FF9F1C' },
  { id: 'bills', name: 'Bills', color: '#4F46E5' },
  { id: 'travel', name: 'Travel', color: '#0EA5E9' },
  { id: 'income', name: 'Income', color: '#14B8A6' },
  { id: 'other', name: 'Other', color: '#64748B' },
];

const seedTransactions = [
  {
    id: 'txn-1',
    title: 'Uber Eats',
    amount: 24.9,
    type: 'expense',
    category: 'Food',
    date: '2024-09-03T13:45:00.000Z',
    account: 'Visa Rewards',
  },
  {
    id: 'txn-2',
    title: 'Rent transfer',
    amount: 1250,
    type: 'expense',
    category: 'Bills',
    date: '2024-09-01T17:05:00.000Z',
    account: 'Chase Checking',
  },
  {
    id: 'txn-3',
    title: 'DoorDash payout',
    amount: 410,
    type: 'income',
    category: 'Income',
    date: '2024-09-02T08:10:00.000Z',
    account: 'Side Hustle',
  },
  {
    id: 'txn-4',
    title: 'Shell Gas',
    amount: 42.3,
    type: 'expense',
    category: 'Travel',
    date: '2024-09-05T22:15:00.000Z',
    account: 'Amex Platinum',
  },
  {
    id: 'txn-5',
    title: 'Freelance invoice',
    amount: 950,
    type: 'income',
    category: 'Income',
    date: '2024-08-27T10:00:00.000Z',
    account: 'Stripe',
  },
  {
    id: 'txn-6',
    title: 'Groceries: Trader Joes',
    amount: 82.75,
    type: 'expense',
    category: 'Food',
    date: '2024-08-30T19:25:00.000Z',
    account: 'Visa Rewards',
  },
  {
    id: 'txn-7',
    title: 'Flight to NYC',
    amount: 284.2,
    type: 'expense',
    category: 'Travel',
    date: '2024-08-18T14:50:00.000Z',
    account: 'Amex Platinum',
  },
  {
    id: 'txn-8',
    title: 'Coworking stipend',
    amount: 180,
    type: 'income',
    category: 'Income',
    date: '2024-08-15T12:00:00.000Z',
    account: 'Employer',
  },
];

const TransactionsContext = createContext(undefined);

const normaliseCategory = (name) => name.trim();

const ensureUniqueName = (categories, name) =>
  categories.some((entry) => entry.name.toLowerCase() === name.toLowerCase());

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState(seedTransactions);
  const [customCategories, setCustomCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      try {
        const stored = await AsyncStorage.getItem(STORAGE_KEY);
        if (stored && isMounted) {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setCustomCategories(
              parsed
                .filter((item) => item && item.name)
                .map((item, index) => ({
                  id: item.id || `custom-${index}`,
                  name: item.name,
                  color: item.color || defaultCategories[index % defaultCategories.length].color,
                })),
            );
          }
        }
      } catch (error) {
        console.warn('Unable to load categories from storage', error);
      } finally {
        if (isMounted) {
          setLoadingCategories(false);
        }
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const categories = useMemo(
    () => [...defaultCategories, ...customCategories],
    [customCategories],
  );

  const persistCategories = useCallback(async (items) => {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(items.map(({ id, name, color }) => ({ id, name, color }))),
      );
    } catch (error) {
      console.warn('Unable to persist categories', error);
    }
  }, []);

  const addCustomCategory = useCallback(
    async (rawName) => {
      const name = normaliseCategory(rawName);
      if (!name) return undefined;
      if (ensureUniqueName(categories, name)) {
        return categories.find((entry) => entry.name.toLowerCase() === name.toLowerCase());
      }

      const colorIndex = (customCategories.length + defaultCategories.length) % defaultCategories.length;
      const newCategory = {
        id: `custom-${Date.now()}`,
        name,
        color: defaultCategories[colorIndex]?.color || '#7C3AED',
      };
      const nextCategories = [...customCategories, newCategory];
      setCustomCategories(nextCategories);
      await persistCategories(nextCategories);
      return newCategory;
    },
    [categories, customCategories, persistCategories],
  );

  const addTransaction = useCallback((payload) => {
    setTransactions((prev) => {
      const next = [
        {
          id: `txn-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          title: payload.title?.trim() || 'Untitled transaction',
          amount: Number(payload.amount) || 0,
          type: payload.type === 'income' ? 'income' : 'expense',
          category: payload.category || 'Other',
          date: payload.date ? new Date(payload.date).toISOString() : new Date().toISOString(),
          account: payload.account || 'Manual entry',
          notes: payload.notes?.trim() || '',
        },
        ...prev,
      ];
      return next;
    });
  }, []);

  const totals = useMemo(() => {
    return transactions.reduce(
      (acc, txn) => {
        const amount = Number(txn.amount) || 0;
        if (txn.type === 'income') {
          acc.income += amount;
        } else {
          acc.expenses += amount;
        }
        acc.balance = acc.income - acc.expenses;
        return acc;
      },
      { income: 0, expenses: 0, balance: 0 },
    );
  }, [transactions]);

  const value = useMemo(
    () => ({
      transactions,
      categories,
      addTransaction,
      addCustomCategory,
      totals,
      loadingCategories,
    }),
    [transactions, categories, addTransaction, addCustomCategory, totals, loadingCategories],
  );

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>;
}

export const useTransactions = () => {
  const context = useContext(TransactionsContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionsProvider');
  }
  return context;
};
