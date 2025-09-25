import {
  addDays,
  addMonths,
  addWeeks,
  addYears,
  isAfter,
  isBefore,
  isEqual,
  parseISO,
  startOfDay,
} from 'date-fns';

const RECURRENCE_TYPES = ['daily', 'weekly', 'biweekly', 'monthly', 'yearly', 'custom'];

function ensureDate(value) {
  if (!value) {
    return null;
  }
  if (value instanceof Date) {
    return value;
  }
  try {
    return parseISO(value);
  } catch (error) {
    if (__DEV__) {
      console.warn('Failed to parse date', value, error);
    }
    return null;
  }
}

function calculateNextDate(fromDate, recurrence, meta = {}) {
  if (!fromDate || !recurrence) {
    return null;
  }
  const base = ensureDate(fromDate);
  if (!base) {
    return null;
  }

  switch (recurrence) {
    case 'daily':
      return addDays(base, 1);
    case 'weekly':
      return addWeeks(base, 1);
    case 'biweekly':
      return addWeeks(base, 2);
    case 'monthly':
      return addMonths(base, 1);
    case 'yearly':
      return addYears(base, 1);
    case 'custom': {
      const interval = Number.isFinite(meta.intervalDays) ? meta.intervalDays : meta.intervalDays ? Number(meta.intervalDays) : 1;
      const safeInterval = Number.isFinite(interval) && interval > 0 ? interval : 1;
      return addDays(base, safeInterval);
    }
    default:
      return null;
  }
}

function formatRecurrenceLabel(transaction) {
  if (!transaction?.isRecurring) {
    return 'Not recurring';
  }
  const { recurrence, recurrenceMeta } = transaction;
  switch (recurrence) {
    case 'daily':
      return 'Repeats daily';
    case 'weekly':
      return 'Repeats weekly';
    case 'biweekly':
      return 'Repeats every 2 weeks';
    case 'monthly':
      return 'Repeats monthly';
    case 'yearly':
      return 'Repeats yearly';
    case 'custom': {
      const interval = recurrenceMeta?.intervalDays ?? 1;
      if (interval === 1) {
        return 'Repeats every day';
      }
      return `Repeats every ${interval} days`;
    }
    default:
      return 'Recurring';
  }
}

function isRecurrenceFinished(transaction, referenceDate = new Date()) {
  if (!transaction?.isRecurring) {
    return true;
  }
  if (!transaction.endDate) {
    return false;
  }
  const limit = ensureDate(transaction.endDate);
  if (!limit) {
    return false;
  }
  return isBefore(limit, startOfDay(referenceDate));
}

function generateOccurrencesUntil(transaction, referenceDate = new Date()) {
  if (!transaction?.isRecurring || !transaction.nextOccurrence) {
    return { occurrences: [], nextOccurrence: null };
  }

  const limit = startOfDay(referenceDate);
  let next = ensureDate(transaction.nextOccurrence);
  const end = transaction.endDate ? ensureDate(transaction.endDate) : null;
  const occurrences = [];

  while (next && (isBefore(next, limit) || isEqual(next, limit))) {
    if (end && isAfter(next, end)) {
      break;
    }
    occurrences.push(next);
    const candidate = calculateNextDate(next, transaction.recurrence, transaction.recurrenceMeta);
    if (!candidate) {
      next = null;
      break;
    }
    if (end && isAfter(candidate, end)) {
      next = null;
      break;
    }
    next = candidate;
  }

  const nextOccurrence = next && (!end || !isAfter(next, end)) ? next : null;

  return { occurrences, nextOccurrence };
}

export { RECURRENCE_TYPES, calculateNextDate, formatRecurrenceLabel, generateOccurrencesUntil, isRecurrenceFinished };
