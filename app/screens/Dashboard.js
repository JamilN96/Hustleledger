import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import ProgressRing from '../components/ProgressRing';
import Row from '../components/Row';
import AIChat from '../components/AIChat';
import AnimatedNumber from '../components/AnimatedNumber';  // 👈 add this
import { useColors, spacing } from '../lib/theme';

export default function Dashboard({ navigation }) {
  const colors = useColors();

  // Example values (we'll replace with real data later)
  const savingsGoal = 800;
  const saved = 520;
  const progress = saved / savingsGoal;
  const balance = 1650; // 👈 this will animate

  return (
    <View style={{ flex: 1, padding: spacing(2), paddingTop: spacing(5), backgroundColor: colors.bg }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '800', marginBottom: spacing(2) }}>
        September Overview
      </Text>

      {/* Top summary with animated balance */}
      <GlassCard style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(2) }}>
        <ProgressRing size={140} stroke={14} progress={progress} />
        <View style={{ flex: 1 }}>
          <Text style={{ color: colors.subtext, marginBottom: 4 }}>Current Balance</Text>
          <AnimatedNumber
            value={balance}
            style={{ color: colors.text, fontSize: 32, fontWeight: '800' }}
          />

          <View style={{ height: spacing(1.25) }} />

          <Text style={{ color: colors.subtext, marginBottom: 4 }}>Saved so far</Text>
          <Text style={{ color: colors.success, fontSize: 20, fontWeight: '700' }}>+${saved}</Text>

          <View style={{ height: spacing(1.5) }} />
          <HLButton title="Link Bank (Sandbox)" onPress={() => navigation.navigate('LinkBank')} />
        </View>
      </GlassCard>

      {/* Recent activity */}
      <GlassCard style={{ marginTop: spacing(2) }}>
        <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>Recent Activity</Text>
        <Row title="Uber Eats" subtitle="Dining" amount="24.90" negative />
        <Row title="Deposit: DoorDash" subtitle="Side Hustle" amount="118.00" />
        <Row title="Shell Gas" subtitle="Auto" amount="42.30" negative />
      </GlassCard>

      {/* AI Chat */}
      <AIChat />
    </View>
  );
}
