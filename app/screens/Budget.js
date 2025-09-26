import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Button, Menu, Switch, Text, TextInput } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';
import {
  BUDGET_PERIODS,
  DEFAULT_THRESHOLDS,
  createBudgetModel,
  loadBudgets,
  saveBudgets,
} from '../lib/storage/budgets';

const CATEGORY_OPTIONS = [
  { id: 'housing', label: 'Housing & Utilities' },
  { id: 'transportation', label: 'Transportation' },
  { id: 'groceries', label: 'Groceries & Dining' },
  { id: 'personal', label: 'Personal & Wellness' },
  { id: 'entertainment', label: 'Entertainment' },
  { id: 'savings', label: 'Savings Goals' },
];

const INITIAL_FORM = {
  categoryId: CATEGORY_OPTIONS[0].id,
  amount: '',
  period: BUDGET_PERIODS.MONTHLY,
  rollover: false,
  thresholdsInput: DEFAULT_THRESHOLDS.join(', '),
};

export default function Budget() {
  const colors = useColors();
  const [form, setForm] = useState(() => ({ ...INITIAL_FORM }));
  const [menuVisible, setMenuVisible] = useState(false);
  const [budgets, setBudgets] = useState([]);
  const [selectedBudgetId, setSelectedBudgetId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    (async () => {
      const stored = await loadBudgets();
      if (isMounted) {
        setBudgets(stored);
        setLoading(false);
      }
    })();
    return () => {
      isMounted = false;
    };
  }, []);

  const selectedCategory = useMemo(
    () => CATEGORY_OPTIONS.find((option) => option.id === form.categoryId) ?? CATEGORY_OPTIONS[0],
    [form.categoryId],
  );

  const handleChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const parseThresholds = useCallback(() => {
    const entries = form.thresholdsInput
      .split(',')
      .map((segment) => Number(segment.trim()))
      .filter((value) => Number.isFinite(value));
    return entries.length > 0 ? entries : [...DEFAULT_THRESHOLDS];
  }, [form.thresholdsInput]);

  const resetForm = useCallback(() => {
    setForm(() => ({ ...INITIAL_FORM }));
    setSelectedBudgetId(null);
  }, []);

  const handleSubmit = useCallback(async () => {
    const amountValue = Number(form.amount);
    if (!Number.isFinite(amountValue) || amountValue <= 0) {
      Alert.alert('Invalid amount', 'Enter a positive budget amount to continue.');
      return;
    }

    const thresholds = parseThresholds();
    const nextBudget = createBudgetModel({
      id: selectedBudgetId ?? undefined,
      categoryId: form.categoryId,
      amount: amountValue,
      period: form.period,
      rollover: form.rollover,
      alerts: { thresholds },
    });

    const nextBudgets = budgets.some((item) => item.id === nextBudget.id)
      ? budgets.map((item) => (item.id === nextBudget.id ? nextBudget : item))
      : [...budgets, nextBudget];

    const saved = await saveBudgets(nextBudgets);
    if (!saved) {
      Alert.alert('Save failed', 'We were unable to save this budget. Please try again.');
      return;
    }

    setBudgets(nextBudgets);
    resetForm();
    Alert.alert('Budget saved', 'Your budget has been saved successfully.');
  }, [budgets, form.amount, form.categoryId, form.period, form.rollover, parseThresholds, resetForm, selectedBudgetId]);

  const handleSelectBudget = useCallback(
    (budget) => {
      setSelectedBudgetId(budget.id);
      setForm({
        categoryId: budget.categoryId,
        amount: String(budget.amount || ''),
        period: budget.period || BUDGET_PERIODS.MONTHLY,
        rollover: Boolean(budget.rollover),
        thresholdsInput: (budget.alerts?.thresholds ?? DEFAULT_THRESHOLDS).join(', '),
      });
    },
    [],
  );

  const renderBudget = useCallback(
    ({ item }) => {
      const category = CATEGORY_OPTIONS.find((option) => option.id === item.categoryId);
      return (
        <Pressable
          onPress={() => handleSelectBudget(item)}
          style={{ marginBottom: spacing(1.5) }}
          accessibilityRole="button"
          accessibilityLabel={`Edit ${category?.label ?? 'budget'} budget`}
        >
          <GlassCard accessibilityLabel={`${category?.label ?? 'Budget'} amount ${item.amount}`}>
            <Text style={{ color: colors.subtext, fontSize: 12, fontWeight: '600' }}>
              {category?.label ?? 'Budget'}
            </Text>
            <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', marginTop: spacing(0.5) }}>
              ${item.amount.toFixed(2)}
            </Text>
            <Text style={{ color: colors.subtext, marginTop: spacing(0.5) }}>
              {item.period === BUDGET_PERIODS.MONTHLY ? 'Monthly' : item.period} ·
              {` Rollover ${item.rollover ? 'on' : 'off'}`}
            </Text>
          </GlassCard>
        </Pressable>
      );
    },
    [colors.subtext, colors.text, handleSelectBudget],
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: spacing(4) }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginBottom: spacing(3) }}>
          <Text style={[styles.overline, { color: colors.accent1 }]}>Spending guardrails</Text>
          <Text style={[styles.title, { color: colors.text }]}>Budgets</Text>
          <Text style={[styles.subtitle, { color: colors.subtext }]}>
            Define monthly guardrails for your categories. We’ll add automation and AI alerts soon.
          </Text>
        </View>

        <GlassCard
          style={{ marginBottom: spacing(3) }}
          accessibilityLabel="Add or edit a budget"
          accessibilityRole="form"
        >
          <Text style={[styles.formTitle, { color: colors.text }]}>Add budget</Text>

          <Text style={[styles.label, { color: colors.subtext }]}>Category</Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor=
              {(
                <Button
                  mode="contained-tonal"
                  onPress={() => setMenuVisible(true)}
                  accessibilityLabel="Choose a budget category"
                  accessibilityRole="button"
                  style={{
                    borderRadius: radii.md,
                    backgroundColor: colors.card,
                  }}
                  textColor={colors.text}
                  contentStyle={{ justifyContent: 'space-between' }}
                  icon="chevron-down"
                >
                  {selectedCategory.label}
                </Button>
              )}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <Menu.Item
                key={option.id}
                onPress={() => {
                  handleChange('categoryId', option.id);
                  setMenuVisible(false);
                }}
                title={option.label}
              />
            ))}
          </Menu>

          <Text style={[styles.label, { color: colors.subtext, marginTop: spacing(2) }]}>Amount</Text>
          <TextInput
            mode="outlined"
            value={form.amount}
            onChangeText={(value) => handleChange('amount', value)}
            keyboardType="decimal-pad"
            accessibilityLabel="Budget amount"
            style={styles.input}
            inputMode="decimal"
          />

          <Text style={[styles.label, { color: colors.subtext, marginTop: spacing(2) }]}>Period</Text>
          <Button mode="outlined" disabled>
            Monthly (more periods soon)
          </Button>

          <View style={styles.switchRow}>
            <Text style={[styles.label, { color: colors.subtext }]}>Enable rollover</Text>
            <Switch
              accessibilityRole="switch"
              accessibilityLabel="Toggle rollover"
              value={form.rollover}
              onValueChange={(value) => handleChange('rollover', value)}
            />
          </View>

          <Text style={[styles.label, { color: colors.subtext, marginTop: spacing(2) }]}>Alerts</Text>
          <TextInput
            mode="outlined"
            value={form.thresholdsInput}
            onChangeText={(value) => handleChange('thresholdsInput', value)}
            accessibilityLabel="Alert thresholds"
            style={styles.input}
            right={<TextInput.Affix text="%" />}
          />

          <HLButton
            title={selectedBudgetId ? 'Update budget' : 'Save budget'}
            onPress={handleSubmit}
            style={{ marginTop: spacing(3) }}
            accessibilityLabel="Save budget"
            accessibilityRole="button"
          />
          {selectedBudgetId ? (
            <Button
              mode="text"
              onPress={resetForm}
              accessibilityLabel="Cancel editing"
              style={{ marginTop: spacing(1) }}
            >
              Cancel editing
            </Button>
          ) : null}
        </GlassCard>

        <Text style={[styles.sectionTitle, { color: colors.text }]}>Budgets overview</Text>
        {loading ? (
          <Text style={{ color: colors.subtext, marginTop: spacing(1) }}>Loading budgets…</Text>
        ) : budgets.length === 0 ? (
          <Text style={{ color: colors.subtext, marginTop: spacing(1) }}>
            No budgets yet. Start by creating one above to track your spending guardrails.
          </Text>
        ) : (
          <FlatList
            data={budgets}
            renderItem={renderBudget}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={{ marginTop: spacing(1.5) }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: spacing(2),
    paddingTop: spacing(2),
  },
  overline: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    marginTop: spacing(0.5),
  },
  subtitle: {
    marginTop: spacing(1),
    lineHeight: 20,
  },
  formTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: spacing(2),
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
  },
  input: {
    backgroundColor: 'transparent',
  },
  switchRow: {
    marginTop: spacing(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
});
