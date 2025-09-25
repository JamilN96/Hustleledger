import { useMemo, useRef } from 'react';
import { Alert, FlatList, View } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { Swipeable } from 'react-native-gesture-handler';
import * as Haptics from 'expo-haptics';
import GlassCard from './GlassCard';
import { useColors, spacing, radii } from '../lib/theme';

const formatCurrency = (value) => {
  return Number(value || 0).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};

const formatDate = (value) => {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return '';
  }
  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export default function TransactionList({ transactions = [], loading, onDelete, style }) {
  const colors = useColors();
  const swipeRefs = useRef({});

  const sorted = useMemo(() => {
    return [...transactions].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions]);

  const closeSwipe = (id) => {
    const ref = swipeRefs.current[id];
    ref?.close();
  };

  const confirmDelete = (item) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => {});
    Alert.alert(
      'Delete transaction',
      `Remove ${item.title}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => closeSwipe(item.id),
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await onDelete?.(item.id);
            } catch (error) {
              if (__DEV__) {
                console.warn('Failed to delete transaction', error);
              }
              Alert.alert('Delete failed', 'We could not remove that transaction. Please try again.');
            } finally {
              closeSwipe(item.id);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const renderRightActions = () => (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
      <View
        style={{
          backgroundColor: colors.danger,
          justifyContent: 'center',
          alignItems: 'center',
          paddingHorizontal: spacing(2),
          paddingVertical: spacing(1),
          borderRadius: radii.lg,
          marginVertical: spacing(0.5),
          marginRight: spacing(1),
          minWidth: spacing(9),
        }}
      >
        <Text style={{ color: '#fff', fontWeight: '700' }}>Delete</Text>
      </View>
    </View>
  );

  const renderItem = ({ item }) => {
    const amountColor = item.type === 'income' ? colors.success : colors.danger;
    const symbol = item.type === 'income' ? '+' : '-';
    return (
      <Swipeable
        ref={(ref) => {
          if (ref) {
            swipeRefs.current[item.id] = ref;
          } else {
            delete swipeRefs.current[item.id];
          }
        }}
        friction={2}
        rightThreshold={spacing(4)}
        overshootRight={false}
        renderRightActions={renderRightActions}
        onSwipeableOpen={(direction) => {
          if (direction === 'right') {
            confirmDelete(item);
          }
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingVertical: spacing(1.5),
            paddingHorizontal: spacing(1),
            borderBottomWidth: 1,
            borderBottomColor: colors.divider,
          }}
          accessible
          accessibilityRole="summary"
          accessibilityLabel={`${item.title}, ${formatCurrency(item.amount)} ${item.type}, ${formatDate(item.date)}`}
        >
          <View style={{ flex: 1, paddingRight: spacing(1) }}>
            <Text style={{ color: colors.text, fontWeight: '600' }}>{item.title}</Text>
            <Text style={{ color: colors.subtext, marginTop: 2 }}>
              {formatDate(item.date)} · {item.category}
            </Text>
          </View>
          <Text style={{ color: amountColor, fontWeight: '700' }}>
            {`${symbol}${formatCurrency(item.amount)}`}
          </Text>
        </View>
      </Swipeable>
    );
  };

  return (
    <GlassCard
      style={style}
      accessibilityLabel="Transaction history"
      accessibilityRole="summary"
    >
      <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>
        Recent transactions
      </Text>
      {loading ? (
        <View style={{ paddingVertical: spacing(3), alignItems: 'center' }}>
          <ActivityIndicator animating color={colors.accent1} accessibilityLabel="Loading transactions" />
        </View>
      ) : sorted.length === 0 ? (
        <Text style={{ color: colors.subtext }}>
          Add your first transaction to unlock personalized insights.
        </Text>
      ) : (
        <FlatList
          data={sorted}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          scrollEnabled={false}
          contentContainerStyle={{ paddingHorizontal: spacing(1) }}
        />
      )}
    </GlassCard>
  );
}
