import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@hustleledger/transactions';

const TransactionsContext = createContext(null);

const normalizeTransaction = (input) => {
  const safeAmount = Number.parseFloat(String(input?.amount ?? 0));
  const amount = Number.isNaN(safeAmount) ? 0 : safeAmount;
  const type = input?.type === 'income' ? 'income' : 'expense';
  const date = input?.date ? new Date(input.date).toISOString() : new Date().toISOString();

  return {
    id: String(input?.id ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`),
    title: String(input?.title ?? '').trim() || 'Untitled',
    amount,
    type,
    date,
    category: String(input?.category ?? '').trim() || 'General',
  };
};

export function TransactionsProvider({ children }) {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const isMountedRef = useRef(true);
  const transactionsRef = useRef([]);

  useEffect(() => {
    transactionsRef.current = transactions;
  }, [transactions]);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const persistTransactions = useCallback(async (next) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setError(null);
    } catch (err) {
      if (__DEV__) {
        console.warn('Failed to persist transactions', err);
      }
      setError('We could not save your transactions.');
      Alert.alert('Save failed', 'We could not store your transactions. Please try again.');
      throw err;
    }
  }, []);

  const loadTransactions = useCallback(async () => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!isMountedRef.current) {
        return;
      }
      if (raw) {
        try {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            const normalized = parsed.map((item) => normalizeTransaction(item));
            normalized.sort((a, b) => new Date(b.date) - new Date(a.date));
            transactionsRef.current = normalized;
            setTransactions(normalized);
          } else {
            transactionsRef.current = [];
            setTransactions([]);
          }
        } catch (parseError) {
          if (__DEV__) {
            console.warn('Invalid transactions payload in storage', parseError);
          }
          transactionsRef.current = [];
          setTransactions([]);
        }
      } else {
        transactionsRef.current = [];
        setTransactions([]);
      }
      setError(null);
    } catch (err) {
      if (__DEV__) {
        console.warn('Failed to load transactions', err);
      }
      setError('We could not load your transactions.');
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const addTransaction = useCallback(
    async ({ title, amount, category, type, date }) => {
      const transaction = normalizeTransaction({ title, amount, category, type, date });
      const previous = transactionsRef.current;
      const next = [transaction, ...previous];
      transactionsRef.current = next;
      setTransactions(next);
      try {
        await persistTransactions(next);
      } catch (err) {
        if (isMountedRef.current) {
          transactionsRef.current = previous;
          setTransactions(previous);
        }
        throw err;
      }
    },
    [persistTransactions],
  );

  const deleteTransaction = useCallback(
    async (id) => {
      const previous = transactionsRef.current;
      const next = previous.filter((item) => item.id !== id);
      transactionsRef.current = next;
      setTransactions(next);
      try {
        await persistTransactions(next);
      } catch (err) {
        if (isMountedRef.current) {
          transactionsRef.current = previous;
          setTransactions(previous);
        }
        throw err;
      }
    },
    [persistTransactions],
  );

  const value = useMemo(
    () => ({
      transactions,
      loading,
      error,
      addTransaction,
      deleteTransaction,
      refresh: loadTransactions,
    }),
    [transactions, loading, error, addTransaction, deleteTransaction, loadTransactions],
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
