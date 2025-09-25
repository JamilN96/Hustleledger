import { useMemo, useState } from 'react';
import { View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Chip } from 'react-native-paper';
import * as Haptics from 'expo-haptics';
import { VictoryPie, VictoryChart, VictoryBar, VictoryAxis, VictoryGroup } from 'victory-native';
import GlassCard from '../components/GlassCard';
import AnimatedNumber from '../components/AnimatedNumber';
import { spacing, useColors } from '../lib/theme';
import { useTransactions } from '../lib/transactions';

const screenWidth = Dimensions.get('window').width;

const startOfWeek = (date) => {
  const copy = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = copy.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setUTCDate(copy.getUTCDate() + diff);
  return copy;
};

const formatWeekLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

const formatMonthLabel = (date) =>
  date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

const useMonthlyData = (transactions) => {
  const now = new Date();
  const month = now.getMonth();
  const year = now.getFullYear();
  return transactions.filter((txn) => {
    const date = new Date(txn.date);
    return date.getMonth() === month && date.getFullYear() === year;
  });
};

const buildBarData = (transactions, mode) => {
  const groups = new Map();
  transactions.forEach((txn) => {
    const date = new Date(txn.date);
    if (Number.isNaN(date.getTime())) return;
    const keyDate = mode === 'weekly' ? startOfWeek(date) : new Date(date.getFullYear(), date.getMonth(), 1);
    const key = keyDate.toISOString();
    const label = mode === 'weekly' ? `${formatWeekLabel(keyDate)}` : formatMonthLabel(keyDate);
    const bucket = groups.get(key) || { label, date: keyDate, income: 0, expenses: 0 };
    const value = Number(txn.amount) || 0;
    if (txn.type === 'income') {
      bucket.income += value;
    } else {
      bucket.expenses += value;
    }
    groups.set(key, bucket);
  });

  return Array.from(groups.values()).sort((a, b) => a.date - b.date);
};

export default function Analytics() {
  const colors = useColors();
  const { transactions, categories } = useTransactions();
  const [mode, setMode] = useState('monthly');

  const monthlyTransactions = useMonthlyData(transactions);

  const categoryPalette = useMemo(() => {
    const base = colors.chartPalette || [];
    const fallback = ['#6366F1', '#22D3EE', '#FB7185', '#FACC15', '#F97316'];
    return base.length ? base : fallback;
  }, [colors.chartPalette]);

  const expenseByCategory = useMemo(() => {
    const map = new Map();
    monthlyTransactions.forEach((txn) => {
      if (txn.type !== 'expense') return;
      const key = txn.category || 'Other';
      const current = map.get(key) || 0;
      map.set(key, current + (Number(txn.amount) || 0));
    });
    return Array.from(map.entries())
      .map(([name, value], index) => ({
        x: name,
        y: value,
        color:
          categories.find((category) => category.name === name)?.color ||
          categoryPalette[index % categoryPalette.length],
      }))
      .filter((item) => item.y > 0);
  }, [monthlyTransactions, categories, categoryPalette]);

  const barData = useMemo(() => buildBarData(transactions, mode), [transactions, mode]);

  const monthlyIncome = useMemo(
    () => monthlyTransactions.filter((txn) => txn.type === 'income').reduce((acc, txn) => acc + (Number(txn.amount) || 0), 0),
    [monthlyTransactions],
  );
  const monthlyExpenses = useMemo(
    () => monthlyTransactions.filter((txn) => txn.type !== 'income').reduce((acc, txn) => acc + (Number(txn.amount) || 0), 0),
    [monthlyTransactions],
  );

  const topCategory = useMemo(() => {
    if (!expenseByCategory.length) return null;
    return expenseByCategory.reduce((prev, current) => (current.y > prev.y ? current : prev));
  }, [expenseByCategory]);

  const savingsRate = monthlyIncome > 0 ? (monthlyIncome - monthlyExpenses) / monthlyIncome : 0;

  const handleModeChange = async (value) => {
    setMode(value);
    await Haptics.selectionAsync();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}>
        <View style={{ marginBottom: spacing(2.5) }}>
          <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Analytics</Text>
          <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 20 }}>
            Watch your spending patterns, track income momentum, and celebrate the savings rate climbing higher each month.
          </Text>
        </View>

        <GlassCard accessibilityLabel="Insights summary" style={{ marginBottom: spacing(2) }}>
          <Text style={{ color: colors.subtext, fontWeight: '600' }}>Monthly recap</Text>
          <View style={{ flexDirection: 'row', marginTop: spacing(1.75), gap: spacing(2) }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Top spending category</Text>
              <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginTop: spacing(0.5) }}>
                {topCategory?.x || 'No expenses yet'}
              </Text>
              {topCategory ? (
                <AnimatedNumber
                  value={topCategory.y}
                  style={{ color: colors.danger, fontSize: 22, fontWeight: '700', marginTop: spacing(0.5) }}
                />
              ) : null}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.muted, fontSize: 12 }}>Monthly savings rate</Text>
              <AnimatedNumber
                value={Math.max(savingsRate * 100, 0)}
                formatter={(value) => `${Math.round(value)}%`}
                style={{ color: colors.accent3, fontSize: 28, fontWeight: '800', marginTop: spacing(0.5) }}
              />
              <Text style={{ color: colors.subtext, marginTop: spacing(0.5), lineHeight: 18 }}>
                Based on {monthlyIncome.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })}
                {' '}income and {monthlyExpenses.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })} in
                expenses this month.
              </Text>
            </View>
          </View>
        </GlassCard>

        <GlassCard accessibilityLabel="Expenses by category chart" style={{ marginBottom: spacing(2) }}>
          <Text style={{ color: colors.subtext, fontWeight: '600', marginBottom: spacing(1) }}>
            Expenses by category
          </Text>
          <View style={{ alignItems: 'center' }}>
            <VictoryPie
              data={expenseByCategory}
              colorScale={expenseByCategory.map((entry) => entry.color)}
              width={screenWidth - spacing(4)}
              height={screenWidth - spacing(6)}
              padAngle={1.5}
              innerRadius={70}
              animate={{ duration: 800 }}
              events={[
                {
                  target: 'data',
                  eventHandlers: {
                    onPressIn: () => {
                      Haptics.selectionAsync();
                      return [];
                    },
                  },
                },
              ]}
              labels={({ datum }) => `${datum.x}\n${datum.y.toFixed(0)}`}
              style={{
                labels: {
                  fill: colors.text,
                  fontWeight: '600',
                  fontSize: 12,
                },
              }}
            />
          </View>
        </GlassCard>

        <GlassCard accessibilityLabel="Income versus expenses chart" style={{ marginBottom: spacing(2) }}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: colors.subtext, fontWeight: '600' }}>Income vs expenses</Text>
            <View style={{ flexDirection: 'row', gap: spacing(1) }}>
              {['weekly', 'monthly'].map((value) => (
                <Chip
                  key={value}
                  selected={mode === value}
                  onPress={() => handleModeChange(value)}
                  accessibilityRole="button"
                  accessibilityLabel={`View ${value} totals`}
                  style={{
                    backgroundColor: mode === value ? `${colors.accent2}22` : 'transparent',
                    borderColor: mode === value ? colors.accent2 : colors.divider,
                  }}
                  textStyle={{ color: mode === value ? colors.accent2 : colors.subtext }}
                  mode="outlined"
                >
                  {value === 'weekly' ? 'Weekly' : 'Monthly'}
                </Chip>
              ))}
            </View>
          </View>

          <VictoryChart
            height={280}
            padding={{ top: 32, bottom: 54, left: 52, right: 18 }}
            domainPadding={{ x: 36, y: 12 }}
          >
            <VictoryAxis
              style={{
                axis: { stroke: 'transparent' },
                tickLabels: { fill: colors.subtext, fontSize: 12, angle: -30, padding: 20 },
                grid: { stroke: `${colors.divider}`, strokeDasharray: '3,4' },
              }}
            />
            <VictoryAxis
              dependentAxis
              style={{
                axis: { stroke: 'transparent' },
                tickLabels: { fill: colors.subtext, fontSize: 12 },
                grid: { stroke: `${colors.divider}`, strokeDasharray: '3,4' },
              }}
            />
            <VictoryGroup offset={28}>
              <VictoryBar
                data={barData}
                x="label"
                y="income"
                barWidth={18}
                cornerRadius={{ top: 6, bottom: 0 }}
                style={{ data: { fill: colors.accent3 } }}
                animate={{ duration: 650 }}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: () => {
                        Haptics.selectionAsync();
                        return [];
                      },
                    },
                  },
                ]}
              />
              <VictoryBar
                data={barData}
                x="label"
                y="expenses"
                barWidth={18}
                cornerRadius={{ top: 6, bottom: 0 }}
                style={{ data: { fill: colors.accent4 } }}
                animate={{ duration: 650 }}
                events={[
                  {
                    target: 'data',
                    eventHandlers: {
                      onPressIn: () => {
                        Haptics.selectionAsync();
                        return [];
                      },
                    },
                  },
                ]}
              />
            </VictoryGroup>
          </VictoryChart>
        </GlassCard>
      </ScrollView>
    </SafeAreaView>
  );
}
