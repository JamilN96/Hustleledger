import React from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Text, Chip } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import ProgressRing from '../components/ProgressRing';
import Row from '../components/Row';
import AIChat from '../components/AIChat';
import AnimatedNumber from '../components/AnimatedNumber';  // 👈 add this
import { useColors, spacing, radii } from '../lib/theme';

export default function Dashboard({ navigation }) {
  const colors = useColors();

  // Example values (we'll replace with real data later)
  const savingsGoal = 800;
  const saved = 520;
  const progress = saved / savingsGoal;
  const balance = 1650; // 👈 this will animate

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
              <Text style={{ color: colors.subtext, textAlign: 'center', marginTop: spacing(1) }}>65% toward goal</Text>
            </View>
            <View style={{ flex: 1, justifyContent: 'center' }}>
              <Text style={{ color: colors.subtext, marginBottom: 4 }}>Command balance</Text>
              <AnimatedNumber
                value={balance}
                style={{ color: colors.text, fontSize: 34, fontWeight: '800' }}
              />
              <Text style={{ color: colors.success, marginTop: spacing(1), fontWeight: '600' }}>+${saved} toward savings
              </Text>
              <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
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

        <View style={{ flexDirection: 'row', gap: spacing(2), marginBottom: spacing(2) }}>
          <GlassCard
            style={{ flex: 1 }}
            accessibilityLabel="Savings automation status"
          >
            <Text style={{ color: colors.subtext, fontWeight: '600' }}>Automation</Text>
            <Text style={{ color: colors.text, fontSize: 26, fontWeight: '800', marginTop: spacing(0.5) }}>
              4 active rituals
            </Text>
            <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
              AI allocates $180/week across rainy day, tax vault, and gear upgrades.
            </Text>
          </GlassCard>

          <GlassCard
            style={{ flex: 1 }}
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
        </View>

        <GlassCard style={{ marginBottom: spacing(2) }} accessibilityLabel="Recent activity">
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>Recent activity</Text>
          <Row title="Uber Eats" subtitle="Dining" amount="24.90" negative />
          <Row title="Deposit: DoorDash" subtitle="Side Hustle" amount="118.00" />
          <Row title="Shell Gas" subtitle="Auto" amount="42.30" negative />
        </GlassCard>

        <AIChat />
      </ScrollView>
    </SafeAreaView>
  );
}
