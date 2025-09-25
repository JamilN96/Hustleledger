import React from 'react';
import { Alert, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import { format } from 'date-fns';

import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing } from '../lib/theme';
import { useTransactions } from '../context/TransactionsContext';

export default function TransactionDetail({ navigation, route }) {
  const colors = useColors();
  const { getTransactionById, deleteTransaction, formatRecurrenceLabel } = useTransactions();
  const transactionId = route?.params?.transactionId ?? route?.params?.id;
  const transaction = transactionId ? getTransactionById(transactionId) : null;

  const template = React.useMemo(() => {
    if (!transaction) {
      return null;
    }
    if (transaction.isRecurringTemplate) {
      return transaction;
    }
    if (transaction.recurringParentId) {
      return getTransactionById(transaction.recurringParentId);
    }
    return transaction.isRecurring ? transaction : null;
  }, [getTransactionById, transaction]);

  const handleEditRecurrence = React.useCallback(() => {
    if (template) {
      navigation.navigate('AddTransaction', { transactionId: template.id });
      return;
    }
    if (transaction) {
      navigation.navigate('AddTransaction', { transactionId: transaction.id });
    }
  }, [navigation, template, transaction]);

  const handleDelete = React.useCallback(() => {
    if (!transaction) {
      return;
    }

    if (transaction.isRecurring && template) {
      Alert.alert('Delete Transaction', 'Would you like to remove only this occurrence or the entire series?', [
        {
          text: 'Delete this one',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transaction.id, 'single');
            navigation.goBack();
          },
        },
        {
          text: 'Delete series',
          style: 'default',
          onPress: async () => {
            await deleteTransaction(template.id, 'series');
            navigation.goBack();
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]);
      return;
    }

    Alert.alert('Delete Transaction', 'Are you sure you want to delete this transaction?', [
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteTransaction(transaction.id, 'single');
          navigation.goBack();
        },
      },
      { text: 'Cancel', style: 'cancel' },
    ]);
  }, [deleteTransaction, navigation, template, transaction]);

  if (!transaction) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: colors.subtext }}>Transaction not found.</Text>
      </SafeAreaView>
    );
  }

  const amountFormatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  });
  const formattedAmount = amountFormatter.format(transaction.amount ?? 0);
  const formattedDate = transaction.date ? format(new Date(transaction.date), 'MMM d, yyyy') : 'No date';
  const nextOccurrence = template?.nextOccurrence
    ? format(new Date(template.nextOccurrence), 'MMM d, yyyy')
    : 'Not scheduled';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: spacing(2) }}>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800', marginBottom: spacing(2) }}>
          Transaction Details
        </Text>

        <GlassCard style={{ padding: spacing(2), marginBottom: spacing(2) }}>
          <Text style={{ color: colors.text, fontSize: 20, fontWeight: '700', marginBottom: spacing(1) }}>
            {transaction.title}
          </Text>
          <Text style={{ color: colors.subtext, marginBottom: spacing(1) }}>{transaction.category || 'Uncategorized'}</Text>
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing(1) }}>{formattedAmount}</Text>
          <Text style={{ color: colors.subtext, marginBottom: spacing(2) }}>Date: {formattedDate}</Text>

          {transaction.isRecurring && template && (
            <View style={{ marginBottom: spacing(2) }}>
              <Text style={{ color: colors.text, fontWeight: '700' }}>Recurrence</Text>
              <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>{formatRecurrenceLabel(template)}</Text>
              <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>Next occurrence: {nextOccurrence}</Text>
              {template.endDate && (
                <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>
                  Ends: {format(new Date(template.endDate), 'MMM d, yyyy')}
                </Text>
              )}
            </View>
          )}

          <HLButton
            title={transaction.isRecurring ? 'Edit Recurrence' : 'Edit Transaction'}
            onPress={handleEditRecurrence}
            accessibilityRole="button"
            accessibilityLabel={transaction.isRecurring ? 'Edit recurrence' : 'Edit transaction'}
            style={{ marginBottom: spacing(1.5) }}
          />
          <HLButton
            title="Delete"
            onPress={handleDelete}
            accessibilityRole="button"
            accessibilityLabel="Delete transaction"
            variant="danger"
          />
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}
