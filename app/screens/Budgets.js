import { useMemo } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import { spacing, radii, useColors } from '../lib/theme';

const budgetPlans = [
  {
    id: 'dining',
    category: 'Dining Out',
    amount: 420,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
  },
  {
    id: 'transport',
    category: 'Transportation',
    amount: 260,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
  },
  {
    id: 'side-hustle',
    category: 'Side Hustle Reinvestments',
    amount: 340,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
  },
  {
    id: 'wellness',
    category: 'Wellness & Fitness',
    amount: 180,
    startDate: '2025-09-01',
    endDate: '2025-09-30',
  },
];

const expenses = [
  { id: '1', categoryId: 'dining', amount: 48.5, date: '2025-09-02' },
  { id: '2', categoryId: 'dining', amount: 36.2, date: '2025-09-04' },
  { id: '3', categoryId: 'dining', amount: 92.1, date: '2025-09-12' },
  { id: '4', categoryId: 'dining', amount: 58.4, date: '2025-09-18' },
  { id: '5', categoryId: 'transport', amount: 42.0, date: '2025-09-03' },
  { id: '6', categoryId: 'transport', amount: 33.5, date: '2025-09-07' },
  { id: '7', categoryId: 'transport', amount: 29.25, date: '2025-09-15' },
  { id: '8', categoryId: 'transport', amount: 18.9, date: '2025-09-21' },
  { id: '9', categoryId: 'side-hustle', amount: 124.0, date: '2025-09-05' },
  { id: '10', categoryId: 'side-hustle', amount: 88.75, date: '2025-09-11' },
  { id: '11', categoryId: 'side-hustle', amount: 146.3, date: '2025-09-22' },
  { id: '12', categoryId: 'wellness', amount: 52.0, date: '2025-09-03' },
  { id: '13', categoryId: 'wellness', amount: 38.5, date: '2025-09-09' },
  { id: '14', categoryId: 'wellness', amount: 27.25, date: '2025-09-16' },
  { id: '15', categoryId: 'wellness', amount: 26.75, date: '2025-09-19' },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const isWithinPeriod = (date, start, end) => {
  const current = new Date(date);
  return current >= new Date(start) && current <= new Date(end);
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

const getProgressColor = (percent, palette) => {
  if (percent > 100) {
    return palette.danger;
  }
  if (percent >= 80) {
    return palette.warning;
  }
  return palette.success;
};

export default function Budgets() {
  const colors = useColors();
  const palette = {
    subtext: colors.subtext ?? colors.text,
    success: colors.success ?? colors.accent2 ?? '#4CAF50',
    danger: colors.danger ?? '#FF6B6B',
    track: (colors.bgSecondary ?? colors.bg ?? '#FFFFFF') + '33',
    warning: '#F5C453',
  };

  const summaries = useMemo(() => {
    return budgetPlans.map((budget) => {
      const spent = expenses
        .filter(
          (expense) =>
            expense.categoryId === budget.id &&
            isWithinPeriod(expense.date, budget.startDate, budget.endDate),
        )
        .reduce((total, expense) => total + expense.amount, 0);

      const roundedSpent = Math.round(spent * 100) / 100;
      const available = Math.round((budget.amount - roundedSpent) * 100) / 100;
      const percentUsed = budget.amount === 0 ? 0 : (roundedSpent / budget.amount) * 100;

      return {
        ...budget,
        spent: roundedSpent,
        available,
        percentUsed,
      };
    });
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={{ padding: spacing(2), paddingBottom: spacing(6) }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={{ color: palette.subtext, fontWeight: '600' }}>Spending radar</Text>
        <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', marginTop: spacing(0.5) }}>
          Budgets
        </Text>
        <Text style={{ color: palette.subtext, marginTop: spacing(1), lineHeight: 20 }}>
          Track category burn against your mission plan. HustleLedger surfaces overspends before they derail your runway.
        </Text>

        <View style={{ marginTop: spacing(3), gap: spacing(2) }}>
          {summaries.map((summary) => {
            const progressColor = getProgressColor(summary.percentUsed, palette);
            const progressWidth = clamp(summary.percentUsed, 0, 100);
            const availableLabel = summary.available >= 0 ? 'Available' : 'Over';

            return (
              <GlassCard
                key={summary.id}
                accessibilityLabel={`${summary.category} budget. Planned ${currency.format(summary.amount)}. Spent ${currency.format(summary.spent)}. ${availableLabel} ${currency.format(Math.abs(summary.available))}. ${Math.round(summary.percentUsed)} percent used.`}
              >
                <Text style={{ color: palette.subtext, fontSize: 13, letterSpacing: 0.5 }}>
                  {summary.startDate} – {summary.endDate}
                </Text>
                <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginTop: spacing(0.5) }}>
                  {summary.category}
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: spacing(1.5),
                  }}
                >
                  <View>
                    <Text style={{ color: palette.subtext, fontSize: 12 }}>Planned</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', marginTop: 4 }}>
                      {currency.format(summary.amount)}
                    </Text>
                  </View>
                  <View>
                    <Text style={{ color: palette.subtext, fontSize: 12 }}>Spent</Text>
                    <Text style={{ color: colors.text, fontWeight: '700', marginTop: 4 }}>
                      {currency.format(summary.spent)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ color: palette.subtext, fontSize: 12 }}>{availableLabel}</Text>
                    <Text
                      style={{
                        color: summary.available >= 0 ? palette.success : palette.danger,
                        fontWeight: '700',
                        marginTop: 4,
                      }}
                    >
                      {currency.format(Math.abs(summary.available))}
                    </Text>
                  </View>
                </View>

                <View
                  accessible
                  accessibilityRole="progressbar"
                  accessibilityLabel={`${Math.round(summary.percentUsed)} percent of ${summary.category} budget used`}
                  style={{
                    marginTop: spacing(2),
                    backgroundColor: palette.track,
                    height: 12,
                    borderRadius: radii.lg,
                    overflow: 'hidden',
                  }}
                >
                  <View
                    style={{
                      width: `${progressWidth}%`,
                      backgroundColor: progressColor,
                      height: '100%',
                      borderRadius: radii.lg,
                    }}
                  />
                </View>

                <Text style={{ color: palette.subtext, marginTop: spacing(1) }}>
                  {Math.round(summary.percentUsed)}% used
                </Text>
              </GlassCard>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
