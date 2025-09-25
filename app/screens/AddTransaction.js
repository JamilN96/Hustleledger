import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Text, HelperText, Button, Menu, SegmentedButtons } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';
import { useTransactions } from '../lib/transactions';

const CATEGORY_OPTIONS = [
  'Side Hustle',
  'Dining',
  'Transportation',
  'Housing',
  'Savings',
  'Investments',
  'Wellness',
  'Other',
];

export default function AddTransaction({ navigation }) {
  const colors = useColors();
  const { addTransaction } = useTransactions();
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(CATEGORY_OPTIONS[0]);
  const [type, setType] = useState('income');
  const [menuVisible, setMenuVisible] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setError('');
    const trimmedTitle = title.trim();
    const numericAmount = Number.parseFloat(amount);

    if (!trimmedTitle) {
      setError('A title keeps the transaction recognizable.');
      return;
    }

    if (Number.isNaN(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    setSubmitting(true);
    try {
      await addTransaction({
        title: trimmedTitle,
        amount: numericAmount,
        category,
        type,
        date: new Date().toISOString(),
      });
      navigation.goBack();
    } catch (error) {
      if (__DEV__) {
        console.warn('Failed to save transaction', error);
      }
      setError('We could not save your transaction. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ marginBottom: spacing(2) }}>
            <Text
              variant="labelLarge"
              style={{
                color: colors.accent3,
                alignSelf: 'flex-start',
                backgroundColor: colors.accent3 + '14',
                borderRadius: radii.lg,
                paddingHorizontal: spacing(1.5),
                paddingVertical: spacing(0.5),
                fontWeight: '600',
              }}
              accessibilityRole="text"
            >
              Cashflow log
            </Text>
            <Text
              variant="headlineMedium"
              style={{ color: colors.text, fontWeight: '800', marginTop: spacing(1.5) }}
              accessibilityRole="header"
            >
              Add a transaction
            </Text>
            <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 20 }}>
              Track wins and expenses the moment they land. HustleLedger updates your dashboard instantly.
            </Text>
          </View>

          <GlassCard accessibilityLabel="Add a new transaction" accessibilityRole="form">
            <TextInput
              label="Title"
              value={title}
              onChangeText={setTitle}
              autoCapitalize="words"
              style={{ marginBottom: spacing(1.5), backgroundColor: 'transparent' }}
              mode="flat"
              theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
              accessibilityLabel="Transaction title"
            />

            <TextInput
              label="Amount"
              value={amount}
              onChangeText={setAmount}
              keyboardType={Platform.select({ ios: 'decimal-pad', default: 'numeric' })}
              style={{ marginBottom: spacing(1.5), backgroundColor: 'transparent' }}
              mode="flat"
              theme={{ colors: { onSurfaceVariant: colors.subtext, primary: colors.accent1 } }}
              accessibilityLabel="Transaction amount"
            />

            <View style={{ marginBottom: spacing(1.5) }}>
              <Menu
                visible={menuVisible}
                onDismiss={() => setMenuVisible(false)}
                anchorPosition="bottom"
                contentStyle={{ backgroundColor: colors.menuBackground, borderRadius: radii.md }}
                anchor={
                  <Button
                    mode="outlined"
                    onPress={() => setMenuVisible(true)}
                    textColor={colors.text}
                    style={{
                      borderColor: colors.cardBorder,
                      borderRadius: radii.lg,
                    }}
                    accessibilityLabel="Choose a category"
                  >
                    {category}
                  </Button>
                }
              >
                {CATEGORY_OPTIONS.map((option) => (
                  <Menu.Item
                    key={option}
                    title={option}
                    onPress={() => {
                      setCategory(option);
                      setMenuVisible(false);
                    }}
                    titleStyle={{ color: colors.text }}
                    accessibilityLabel={`Select ${option}`}
                  />
                ))}
              </Menu>
            </View>

            <SegmentedButtons
              value={type}
              onValueChange={setType}
              buttons={[
                {
                  value: 'income',
                  label: 'Income',
                  accessibilityLabel: 'Income transaction',
                },
                {
                  value: 'expense',
                  label: 'Expense',
                  accessibilityLabel: 'Expense transaction',
                },
              ]}
              density="regular"
              style={{ marginBottom: spacing(1.5) }}
              theme={{ colors: { secondaryContainer: colors.segmentBackground, onSecondaryContainer: colors.text } }}
            />

            {!!error && (
              <HelperText type="error" visible accessibilityRole="alert">
                {error}
              </HelperText>
            )}

            <HLButton
              title={submitting ? 'Saving…' : 'Save transaction'}
              onPress={handleSubmit}
              disabled={submitting}
              accessibilityLabel="Save transaction"
            />
          </GlassCard>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}
