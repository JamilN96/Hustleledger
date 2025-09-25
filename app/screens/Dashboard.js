import React, { useMemo } from 'react';
import { View, FlatList, Text as RNText } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { useSharedValue, withTiming, useAnimatedProps } from 'react-native-reanimated';
import { Text, Chip } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import ProgressRing from '../components/ProgressRing';
import Row from '../components/Row';
import AIChat from '../components/AIChat';
import { useColors, spacing, radii } from '../lib/theme';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

const AnimatedBalanceText = Animated.createAnimatedComponent(RNText);

const defaultFormat = (n) => {
  'worklet';
  const sign = n < 0 ? '-' : '';
  const absolute = Math.abs(n);
  const integer = Math.floor(absolute);
  const decimals = Math.round((absolute - integer) * 100);
  const integerString = `${integer}`;
  let formattedInteger = '';
  for (let i = 0; i < integerString.length; i += 1) {
    const index = integerString.length - 1 - i;
    formattedInteger = `${integerString[index]}${formattedInteger}`;
    if ((i + 1) % 3 === 0 && index !== 0) {
      formattedInteger = `,${formattedInteger}`;
    }
  }
  const decimalsString = `${decimals}`.padStart(2, '0');
  return `${sign}$${formattedInteger}.${decimalsString}`;
};

const AnimatedNumber = ({ value, duration = 800, format = defaultFormat, style, accessibilityLabel }) => {
  const animatedValue = useSharedValue(0);

  React.useEffect(() => {
    animatedValue.value = withTiming(value, { duration });
  }, [animatedValue, duration, value]);

  const animatedProps = useAnimatedProps(() => ({
    text: format(animatedValue.value),
  }));

  return (
    <AnimatedBalanceText
      animatedProps={animatedProps}
      style={style}
      allowFontScaling
      accessibilityRole="text"
      accessibilityLabel={accessibilityLabel ?? format(value)}
    />
  );
};

export default function Dashboard({ navigation }) {
  const colors = useColors();

  const savingsGoal = 800;
  const saved = 520;
  const progress = saved / savingsGoal;
  const balance = 1650;

  const sections = useMemo(
    () => [
      { id: 'hero' },
      { id: 'insights' },
      { id: 'activity' },
      { id: 'chat' },
    ],
    [],
  );

  const transactions = useMemo(
    () => [
      { id: 1, title: 'Uber Eats', subtitle: 'Dining', amount: '24.90', negative: true },
      { id: 2, title: 'Deposit: DoorDash', subtitle: 'Side Hustle', amount: '118.00', negative: false },
      { id: 3, title: 'Shell Gas', subtitle: 'Auto', amount: '42.30', negative: true },
    ],
    [],
  );

  const renderItem = React.useCallback(
    ({ item }) => {
      switch (item.id) {
        case 'hero':
          return (
            <View style={{ gap: spacing(2.5) }}>
              <View>
                <Chip
                  mode="outlined"
                  style={{
                    alignSelf: 'flex-start',
                    backgroundColor: 'rgba(82, 255, 197, 0.12)',
                    borderColor: colors.success,
                    borderRadius: radii.lg,
                  }}
                  textStyle={{ color: colors.success, fontWeight: '600' }}
                >
                  Daily Pulse
                </Chip>
                <Text style={{ color: colors.text, fontSize: 30, fontWeight: '800', marginTop: spacing(1.5) }}>
                  September mission control
                </Text>
                <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: spacing(2.5) }}>
                  Your cash runway, savings velocity, and AI nudges update live across every linked account.
                </Text>
              </View>

              <GlassCard accessibilityLabel="Current balance summary">
                <LinearGradient
                  colors={[colors.accent1 + '26', colors.accent2 + '26']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={{ borderRadius: radii.lg, padding: spacing(2), flexDirection: 'row', gap: spacing(2) }}
                >
                  <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                    <ProgressRing size={spacing(15)} stroke={spacing(1.5)} progress={progress} />
                    <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: spacing(1) }}>
                      65% toward goal
                    </Text>
                  </View>
                  <View style={{ flex: 1, justifyContent: 'center' }}>
                    <Text style={{ color: colors.subtext, marginBottom: spacing(0.5) }}>Command balance</Text>
                    <AnimatedNumber
                      value={balance}
                      style={{ color: colors.text, fontSize: 34, fontWeight: '800' }}
                      accessibilityLabel={`Current balance ${defaultFormat(balance)}`}
                    />
                    <Text style={{ color: colors.success, marginTop: spacing(1), fontWeight: '600' }}>
                      +${saved} toward savings
                    </Text>
                    <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: spacing(2.25) }}>
                      Projected runway: 34 days · Next autopilot transfer hits tomorrow morning.
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
            </View>
          );
        case 'insights':
          return (
            <View style={{ flexDirection: 'row', gap: spacing(2) }}>
              <GlassCard style={{ flex: 1 }} accessibilityLabel="Savings automation status">
                <Text style={{ color: colors.subtext, fontWeight: '600' }}>Automation</Text>
                <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}>
                  4 active rituals
                </Text>
                <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: spacing(2.25) }}>
                  AI allocates $180/week across rainy day, tax vault, and gear upgrades.
                </Text>
              </GlassCard>

              <GlassCard style={{ flex: 1 }} accessibilityLabel="Credit health insights">
                <Text style={{ color: colors.subtext, fontWeight: '600' }}>Credit pulse</Text>
                <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}>
                  782 · Stable
                </Text>
                <Text style={{ color: colors.success, marginTop: spacing(1), fontWeight: '600' }}>
                  +12 pts this month
                </Text>
                <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: spacing(2.25) }}>
                  Utilization trimmed to 18% after AI auto-pay.
                </Text>
              </GlassCard>
            </View>
          );
        case 'activity':
          return (
            <GlassCard accessibilityLabel="Recent activity">
              <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>
                Recent activity
              </Text>
              {transactions.map((txn) => (
                <Row
                  key={txn.id}
                  title={txn.title}
                  subtitle={txn.subtitle}
                  amount={txn.amount}
                  negative={txn.negative}
                />
              ))}
            </GlassCard>
          );
        case 'chat':
          return <AIChat />;
        default:
          return null;
      }
    },
    [balance, colors.accent1, colors.accent2, colors.subtext, colors.success, colors.text, navigation, progress, saved, transactions],
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <FlatList
        data={sections}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={{ height: spacing(2) }} />}
        ListFooterComponent={<View style={{ height: spacing(6) }} />}
        initialNumToRender={12}
        windowSize={10}
        removeClippedSubviews
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: spacing(2), paddingTop: spacing(2) }}
        style={{ flex: 1 }}
      />
    </SafeAreaView>
  );
}
