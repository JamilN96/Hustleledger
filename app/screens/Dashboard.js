import { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Chip } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import ProgressRing from '../components/ProgressRing';
import AIChat from '../components/AIChat';
import AnimatedNumber from '../components/AnimatedNumber';
import TransactionList from '../components/TransactionList';
import { useTransactions } from '../lib/transactions';
import { useColors, spacing, radii } from '../lib/theme';

export default function Dashboard({ navigation }) {
  const colors = useColors();
  const { transactions, loading, deleteTransaction } = useTransactions();

  const { incomeTotal, expenseTotal, netBalance, savingsGoal, savedAmount, progress } = useMemo(() => {
    const aggregates = transactions.reduce(
      (acc, transaction) => {
        if (transaction.type === 'income') {
          acc.income += transaction.amount;
        } else {
          acc.expense += transaction.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 },
    );

    const net = aggregates.income - aggregates.expense;
    const goal = Math.max(aggregates.income * 0.5, 500);
    const saved = Math.max(net, 0);
    const pct = goal > 0 ? Math.min(saved / goal, 1) : 0;

    return {
      incomeTotal: aggregates.income,
      expenseTotal: aggregates.expense,
      netBalance: net,
      savingsGoal: goal,
      savedAmount: saved,
      progress: pct,
    };
  }, [transactions]);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: spacing(3) }}>
          <Chip
            mode="outlined"
            style={{
              alignSelf: 'flex-start',
              backgroundColor: colors.accent3 + '21',
              borderColor: colors.accent3,
              borderRadius: radii.lg,
            }}
            textStyle={{ color: colors.accent3, fontWeight: '600' }}
          >
            Daily Pulse
          </Chip>
          <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', marginTop: spacing(1.5) }}>
            September mission control
          </Text>
          <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 20 }}>
            Your cash runway, savings velocity, and AI nudges update live across every linked account.
          </Text>
        </View>

        <GlassCard style={{ marginBottom: spacing(2) }} accessibilityLabel="Cashflow summary">
          <LinearGradient
            colors={[colors.accent1 + '2E', colors.accent2 + '2E']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: radii.lg,
              padding: spacing(2),
            }}
          >
            <View style={{ flexDirection: 'row', gap: spacing(2) }}>
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                <ProgressRing size={120} stroke={12} progress={progress} />
                <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: spacing(1) }}>
                  {Math.round(progress * 100)}% toward goal (${savingsGoal.toFixed(0)})
                </Text>
              </View>
              <View style={{ flex: 1, justifyContent: 'center' }}>
                <Text style={{ color: colors.subtext, marginBottom: spacing(1) }}>Command balance</Text>
                <AnimatedNumber
                  value={netBalance}
                  precision={2}
                  style={{ color: colors.text, fontSize: 34, fontWeight: '800' }}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: spacing(2),
                    justifyContent: 'space-between',
                    gap: spacing(1),
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.subtext, marginBottom: 4 }}>Income</Text>
                    <AnimatedNumber
                      value={incomeTotal}
                      precision={2}
                      style={{ color: colors.success, fontSize: 20, fontWeight: '700' }}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.subtext, marginBottom: 4 }}>Expenses</Text>
                    <AnimatedNumber
                      value={expenseTotal}
                      precision={2}
                      style={{ color: colors.danger, fontSize: 20, fontWeight: '700' }}
                    />
                  </View>
                </View>
                <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
                  {savedAmount > 0
                    ? `Projected runway: ${Math.max(Math.round(savedAmount / 50), 1)} days · Keep the flywheel turning.`
                    : 'Log a few income hits to kickstart your runway insights.'}
                </Text>
                <HLButton
                  title="Add transaction"
                  style={{ marginTop: spacing(2) }}
                  onPress={() => navigation.navigate('AddTransaction')}
                  accessibilityLabel="Add a new transaction"
                />
              </View>
            </View>
          </LinearGradient>
        </GlassCard>

        <GlassCard
          style={{ marginBottom: spacing(2) }}
          accessibilityLabel="Automation status"
        >
          <Text style={{ color: colors.subtext, fontWeight: '600' }}>Automation</Text>
          <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}>
            Rituals humming
          </Text>
          <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
            AI allocates surplus income across rainy day, tax vault, and reinvestment envelopes.
          </Text>
        </GlassCard>

        <GlassCard
          style={{ marginBottom: spacing(2) }}
          accessibilityLabel="Credit health insights"
        >
          <Text style={{ color: colors.subtext, fontWeight: '600' }}>Credit pulse</Text>
          <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}>
            782 · Stable
          </Text>
          <Text style={{ color: colors.success, marginTop: spacing(1), fontWeight: '600' }}>
            +12 pts this month
          </Text>
          <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
            Utilization trimmed to 18% after AI auto-pay.
          </Text>
        </GlassCard>

        <TransactionList
          transactions={transactions}
          loading={loading}
          onDelete={deleteTransaction}
          style={{ marginBottom: spacing(2) }}
        />

        <AIChat />
      </ScrollView>
    </SafeAreaView>
  );
}
