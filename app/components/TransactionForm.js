import { useMemo, useState } from 'react';
import { View } from 'react-native';
import { Text, TextInput, Chip } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import GlassCard from './GlassCard';
import HLButton from './HLButton';
import CategoryPicker from './CategoryPicker';
import { spacing, useColors } from '../lib/theme';
import { useTransactions } from '../lib/transactions';

const TYPE_OPTIONS = [
  { id: 'expense', label: 'Expense' },
  { id: 'income', label: 'Income' },
];

export default function TransactionForm() {
  const colors = useColors();
  const { categories, addTransaction, addCustomCategory, loadingCategories } = useTransactions();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('Food');
  const [type, setType] = useState('expense');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const isValid = useMemo(() => Number(amount) > 0 && title.trim().length > 0, [amount, title]);

  const handleSubmit = async () => {
    if (!isValid || submitting) return;
    setSubmitting(true);
    try {
      await addTransaction({ title, amount: Number(amount), category, type, notes });
      await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setTitle('');
      setAmount('');
      setNotes('');
      setType('expense');
    } finally {
      setSubmitting(false);
    }
  };

  const handleTypeChange = async (nextType) => {
    await Haptics.selectionAsync();
    setType(nextType);
  };

  return (
    <GlassCard
      style={{ marginBottom: spacing(2) }}
      accessibilityLabel="Quick add transaction"
      accessibilityRole="form"
    >
      <Text style={{ color: colors.text, fontWeight: '700', fontSize: 18, marginBottom: spacing(1.5) }}>
        Log a transaction
      </Text>

      <TextInput
        label="Description"
        value={title}
        onChangeText={setTitle}
        placeholder="Coffee with client"
        mode="outlined"
        theme={{ colors: { primary: colors.accent2, onSurfaceVariant: colors.subtext } }}
        style={{ marginBottom: spacing(1.5) }}
        accessibilityLabel="Transaction description"
      />

      <View style={{ flexDirection: 'row', gap: spacing(1.5), marginBottom: spacing(1.5) }}>
        <View style={{ flex: 1 }}>
          <TextInput
            label="Amount"
            value={amount}
            onChangeText={setAmount}
            keyboardType="decimal-pad"
            mode="outlined"
            placeholder="0.00"
            theme={{ colors: { primary: colors.accent2, onSurfaceVariant: colors.subtext } }}
            accessibilityLabel="Transaction amount"
          />
        </View>
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <CategoryPicker
            value={category}
            categories={categories}
            onValueChange={setCategory}
            onAddCategory={addCustomCategory}
            label={loadingCategories ? 'Category (loading…)' : 'Category'}
          />
        </View>
      </View>

      <View style={{ flexDirection: 'row', gap: spacing(1), marginBottom: spacing(1.5) }}>
        {TYPE_OPTIONS.map((option) => (
          <Chip
            key={option.id}
            selected={type === option.id}
            onPress={() => handleTypeChange(option.id)}
            mode="outlined"
            accessibilityRole="button"
            accessibilityLabel={`Mark as ${option.label}`}
            style={{
              borderColor: type === option.id ? colors.accent2 : colors.divider,
              backgroundColor: type === option.id ? `${colors.accent2}26` : 'transparent',
            }}
            textStyle={{ color: type === option.id ? colors.accent2 : colors.subtext, fontWeight: '600' }}
          >
            {option.label}
          </Chip>
        ))}
      </View>

      <TextInput
        label="Notes"
        value={notes}
        onChangeText={setNotes}
        placeholder="Optional details"
        mode="outlined"
        multiline
        numberOfLines={2}
        theme={{ colors: { primary: colors.accent2, onSurfaceVariant: colors.subtext } }}
        style={{ marginBottom: spacing(1.75) }}
        accessibilityLabel="Notes"
      />

      <HLButton
        title={submitting ? 'Saving…' : 'Add transaction'}
        onPress={handleSubmit}
        disabled={!isValid || submitting}
        accessibilityLabel="Add transaction"
      />
    </GlassCard>
  );
}
