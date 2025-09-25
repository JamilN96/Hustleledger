import { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Chip } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import ProgressRing from '../components/ProgressRing';
import Row from '../components/Row';
import AIChat from '../components/AIChat';
import AnimatedNumber from '../components/AnimatedNumber';
import TransactionForm from '../components/TransactionForm';
import { useColors, spacing, radii } from '../lib/theme';
import { useTransactions } from '../lib/transactions';

export default function Dashboard({ navigation }) {
  const colors = useColors();
  const { transactions, totals, categories } = useTransactions();

  const categoryColorMap = useMemo(() => {
    const map = new Map();
    categories.forEach((entry) => map.set(entry.name, entry.color));
    return map;
  }, [categories]);

  const currentMonth = useMemo(() => new Date(), []);

  const monthlyTransactions = useMemo(() => {
    const month = currentMonth.getMonth();
    const year = currentMonth.getFullYear();
    return transactions.filter((txn) => {
      const date = new Date(txn.date);
      return date.getMonth() === month && date.getFullYear() === year;
    });
  }, [transactions, currentMonth]);

  const monthlyTotals = useMemo(() => {
    return monthlyTransactions.reduce(
      (acc, txn) => {
        const value = Number(txn.amount) || 0;
        if (txn.type === 'income') {
          acc.income += value;
        } else {
          acc.expenses += value;
        }
        return acc;
      },
      { income: 0, expenses: 0 },
    );
  }, [monthlyTransactions]);

  const monthlySavings = monthlyTotals.income - monthlyTotals.expenses;
  const savingsGoal = 1200;
  const progress = savingsGoal > 0 ? Math.min(Math.max(monthlySavings / savingsGoal, 0), 1) : 0;

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 6);
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
              backgroundColor: 'rgba(82, 255, 197, 0.12)',
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

        {/* Top summary with animated balance */}
        <GlassCard style={{ marginBottom: spacing(2) }} accessibilityLabel="Current balance summary">
          <LinearGradient
            colors={[colors.accent1 + '26', colors.accent2 + '26']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ borderRadius: radii.lg, padding: spacing(2), flexDirection: 'row', gap: spacing(2) }}
          >
            <View style={{ justifyContent: 'center' }}>
              <ProgressRing size={120} stroke={12} progress={progress} />
              <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: spacing(1) }}>
                {(progress * 100).toFixed(0)}% toward goal
              </Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: colors.subtext, marginBottom: 4 }}>Command balance</Text>
              <AnimatedNumber
                value={totals.balance}
                style={{ color: colors.text, fontSize: 34, fontWeight: '800' }}
              />
              <Text style={{ color: colors.success, marginTop: spacing(1), fontWeight: '600' }}>
                <AnimatedNumber
                  value={monthlySavings}
                  formatter={(value) =>
                    (value || 0).toLocaleString('en-US', {
                      style: 'currency',
                      currency: 'USD',
                      maximumFractionDigits: 0,
                      signDisplay: 'always',
                    })
                  }
                  style={{ color: colors.success, fontWeight: '600', fontSize: 18 }}
                />{' '}
                toward savings this month
              </Text>
              <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
                Projected runway adjusts in real-time as we log your wins across every stream.
              </Text>
              <HLButton
                title="Link another bank"
                style={{ marginTop: spacing(2) }}
                onPress={() => navigation.navigate('LinkBank')}
                accessibilityLabel="Link a bank account"
              />
            </View>
          </LinearGradient>
        </GlassCard>

        <View style={{ flexDirection: 'row', gap: spacing(2), marginBottom: spacing(2) }}>
          <GlassCard
            style={{ flex: 1 }}
            accessibilityLabel="Cash flow overview"
          >
            <Text style={{ color: colors.subtext, fontWeight: '600' }}>Monthly cash flow</Text>
            <AnimatedNumber
              value={monthlyTotals.income}
              style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}
            />
            <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
              Income streams logged in September. Expenses currently at{' '}
              {(monthlyTotals.expenses || 0).toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                maximumFractionDigits: 0,
              })}
              .
            </Text>
          </GlassCard>

          <GlassCard
            style={{ flex: 1 }}
            accessibilityLabel="Automation rituals"
          >
            <Text style={{ color: colors.subtext, fontWeight: '600' }}>Automation rituals</Text>
            <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}>
              4 active routines
            </Text>
            <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
              Auto-sweep keeps 35% of each payout ready for taxes, gear upgrades, and flex funds.
            </Text>
          </GlassCard>
        </View>

        <TransactionForm />

        <GlassCard style={{ marginBottom: spacing(2) }} accessibilityLabel="Recent activity">
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>Recent activity</Text>
          {recentTransactions.map((txn) => (
            <Row
              key={txn.id}
              title={txn.title}
              category={txn.category}
              amount={txn.amount}
              type={txn.type}
              date={txn.date}
              categoryColor={categoryColorMap.get(txn.category)}
            />
          ))}
        </GlassCard>

        <AIChat />
      </ScrollView>
    </SafeAreaView>
  );
}
