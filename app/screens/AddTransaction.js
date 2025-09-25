import React from 'react';
import { ScrollView, View, Switch, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, TextInput, HelperText, SegmentedButtons } from 'react-native-paper';
import { format, isValid } from 'date-fns';

import HLButton from '../components/HLButton';
import GlassCard from '../components/GlassCard';
import { useColors, spacing } from '../lib/theme';
import { useTransactions } from '../context/TransactionsContext';
import { calculateNextDate } from '../lib/recurrence';

const recurrenceOptions = [
  { label: 'Daily', value: 'daily' },
  { label: 'Weekly', value: 'weekly' },
  { label: 'Biweekly', value: 'biweekly' },
  { label: 'Monthly', value: 'monthly' },
  { label: 'Yearly', value: 'yearly' },
  { label: 'Custom', value: 'custom' },
];

function parseDate(value) {
  if (!value) {
    return null;
  }
  const normalized = value.includes('T') ? value : `${value}T00:00:00`;
  const parsed = new Date(normalized);
  return isValid(parsed) ? parsed : null;
}

export default function AddTransaction({ navigation, route }) {
  const colors = useColors();
  const {
    addTransaction,
    updateTransaction,
    getTransactionById,
  } = useTransactions();

  const transactionId = route?.params?.transactionId ?? null;
  const editingTemplate = transactionId ? getTransactionById(transactionId) : null;
  const isEditing = Boolean(editingTemplate);

  const [title, setTitle] = React.useState(editingTemplate?.title ?? '');
  const [amount, setAmount] = React.useState(
    editingTemplate?.amount != null ? String(editingTemplate.amount) : '',
  );
  const [category, setCategory] = React.useState(editingTemplate?.category ?? '');
  const [dateInput, setDateInput] = React.useState(
    editingTemplate?.date ? format(new Date(editingTemplate.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'),
  );
  const [isRecurring, setIsRecurring] = React.useState(editingTemplate?.isRecurring ?? false);
  const [recurrence, setRecurrence] = React.useState(editingTemplate?.recurrence ?? 'monthly');
  const [customInterval, setCustomInterval] = React.useState(
    editingTemplate?.recurrenceMeta?.intervalDays ? String(editingTemplate.recurrenceMeta.intervalDays) : '7',
  );
  const [endDate, setEndDate] = React.useState(
    editingTemplate?.endDate ? format(new Date(editingTemplate.endDate), 'yyyy-MM-dd') : '',
  );
  const [remind, setRemind] = React.useState(editingTemplate?.remindOneDayBefore ?? false);
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (!editingTemplate) {
      return;
    }
    setTitle(editingTemplate.title ?? '');
    setAmount(editingTemplate.amount != null ? String(editingTemplate.amount) : '');
    setCategory(editingTemplate.category ?? '');
    setDateInput(editingTemplate.date ? format(new Date(editingTemplate.date), 'yyyy-MM-dd') : format(new Date(), 'yyyy-MM-dd'));
    setIsRecurring(editingTemplate.isRecurring ?? false);
    setRecurrence(editingTemplate.recurrence ?? 'monthly');
    setCustomInterval(
      editingTemplate.recurrenceMeta?.intervalDays ? String(editingTemplate.recurrenceMeta.intervalDays) : '7',
    );
    setEndDate(editingTemplate.endDate ? format(new Date(editingTemplate.endDate), 'yyyy-MM-dd') : '');
    setRemind(editingTemplate.remindOneDayBefore ?? false);
  }, [editingTemplate]);

  const handleSubmit = React.useCallback(async () => {
    setError('');
    if (!title.trim()) {
      setError('Please enter a title.');
      return;
    }
    const numericAmount = Number.parseFloat(amount);
    if (!Number.isFinite(numericAmount)) {
      setError('Amount must be a number.');
      return;
    }

    const parsedDate = parseDate(dateInput);
    if (!parsedDate) {
      setError('Enter a valid date in YYYY-MM-DD format.');
      return;
    }

    const end = endDate ? parseDate(endDate) : null;
    if (end && parsedDate > end) {
      setError('End date must be after the transaction date.');
      return;
    }

    const baseTransaction = {
      title: title.trim(),
      amount: numericAmount,
      category: category.trim(),
      date: parsedDate.toISOString(),
      isRecurring,
      recurrence,
      recurrenceMeta: recurrence === 'custom' ? { intervalDays: Number.parseInt(customInterval, 10) || 1 } : undefined,
      endDate: end ? end.toISOString() : null,
      remindOneDayBefore: remind,
    };

    if (isRecurring && recurrence === 'custom' && (!customInterval || Number.parseInt(customInterval, 10) < 1)) {
      setError('Custom interval must be at least 1 day.');
      return;
    }

    try {
      if (isEditing && editingTemplate) {
        const updates = {
          ...baseTransaction,
        };
        if (isRecurring) {
          const next = calculateNextDate(parsedDate, recurrence, baseTransaction.recurrenceMeta);
          updates.nextOccurrence = next ? next.toISOString() : null;
        } else {
          updates.nextOccurrence = null;
        }
        await updateTransaction(editingTemplate.id, updates);
      } else {
        await addTransaction(baseTransaction);
      }
      navigation.goBack();
    } catch (submitError) {
      if (__DEV__) {
        console.warn('Failed to save transaction', submitError);
      }
      Alert.alert('Save Failed', 'Unable to save transaction. Please try again.');
    }
  }, [
    title,
    amount,
    category,
    dateInput,
    isRecurring,
    recurrence,
    customInterval,
    endDate,
    remind,
    isEditing,
    editingTemplate,
    addTransaction,
    updateTransaction,
    navigation,
  ]);

  const recurrenceDisplayDate = React.useMemo(() => {
    if (!isRecurring) {
      return 'Not recurring';
    }
    const parsed = parseDate(dateInput);
    if (!parsed) {
      return 'Next occurrence unknown';
    }
    const next = calculateNextDate(parsed, recurrence, recurrence === 'custom' ? { intervalDays: Number.parseInt(customInterval, 10) || 1 } : undefined);
    if (!next) {
      return 'Next occurrence unknown';
    }
    return `Next on ${format(next, 'MMM d, yyyy')}`;
  }, [customInterval, dateInput, isRecurring, recurrence]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(4) }}
        accessibilityLabel={isEditing ? 'Edit recurring transaction' : 'Add new transaction'}
      >
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: spacing(2) }}>
          {isEditing ? 'Edit Transaction' : 'Add Transaction'}
        </Text>

        <GlassCard style={{ padding: spacing(2), marginBottom: spacing(2) }}>
          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            accessibilityLabel="Transaction title"
            autoCapitalize="words"
            style={{ marginBottom: spacing(1.5) }}
          />
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            accessibilityLabel="Transaction amount"
            style={{ marginBottom: spacing(1.5) }}
          />
          <TextInput
            label="Category"
            value={category}
            onChangeText={setCategory}
            accessibilityLabel="Transaction category"
            style={{ marginBottom: spacing(1.5) }}
          />
          <TextInput
            label="Date (YYYY-MM-DD)"
            value={dateInput}
            onChangeText={setDateInput}
            accessibilityLabel="Transaction date"
            style={{ marginBottom: spacing(1.5) }}
          />

          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginVertical: spacing(1) }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>Make Recurring</Text>
            <Switch
              value={isRecurring}
              onValueChange={setIsRecurring}
              accessibilityLabel="Toggle recurring transaction"
              thumbColor={isRecurring ? colors.accent1 : undefined}
            />
          </View>

          {isRecurring && (
            <View accessible accessibilityLabel="Recurring options">
              <SegmentedButtons
                value={recurrence}
                onValueChange={setRecurrence}
                buttons={recurrenceOptions.map((option) => ({
                  ...option,
                  label: option.label,
                }))}
                style={{ marginBottom: spacing(1.5) }}
              />

              {recurrence === 'custom' && (
                <TextInput
                  label="Custom interval (days)"
                  value={customInterval}
                  onChangeText={setCustomInterval}
                  keyboardType="number-pad"
                  accessibilityLabel="Custom recurrence interval in days"
                  style={{ marginBottom: spacing(1.5) }}
                />
              )}

              <TextInput
                label="End date (optional)"
                value={endDate}
                onChangeText={setEndDate}
                placeholder="YYYY-MM-DD"
                accessibilityLabel="Recurring end date"
                style={{ marginBottom: spacing(1.5) }}
              />

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: spacing(1.5) }}>
                <Text style={{ color: colors.text, fontWeight: '600' }}>Remind me 1 day before</Text>
                <Switch
                  value={remind}
                  onValueChange={setRemind}
                  accessibilityLabel="Toggle reminder one day before"
                  thumbColor={remind ? colors.accent2 : undefined}
                />
              </View>

              <Text style={{ color: colors.subtext, marginBottom: spacing(1) }}>{recurrenceDisplayDate}</Text>
            </View>
          )}

          {!!error && <HelperText type="error" visible>{error}</HelperText>}

          <HLButton
            title={isEditing ? 'Save Changes' : 'Add Transaction'}
            onPress={handleSubmit}
            accessibilityRole="button"
            accessibilityLabel={isEditing ? 'Save transaction changes' : 'Add transaction'}
            style={{ marginTop: spacing(2) }}
          />
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
