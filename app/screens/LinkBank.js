import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, Chip } from 'react-native-paper';
import GlassCard from '../components/GlassCard';
import HLButton from '../components/HLButton';
import { useColors, spacing, radii } from '../lib/theme';

export default function LinkBank({ navigation }) {
  const colors = useColors();
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={{ flex: 1, padding: spacing(2) }}>
        <Chip
          mode="outlined"
          style={{
            alignSelf: 'flex-start',
            backgroundColor: 'rgba(255,255,255,0.08)',
            borderColor: colors.accent2,
            borderRadius: radii.lg,
            marginBottom: spacing(2),
          }}
          textStyle={{ color: colors.accent2, fontWeight: '600' }}
        >
          Secure connections
        </Chip>
        <Text style={{ color: colors.text, fontSize: 28, fontWeight: '800' }}>Link Bank</Text>
        <Text style={{ color: colors.subtext, marginTop: spacing(1), lineHeight: 18 }}>
          Connect your accounts through our encrypted Plaid integration to power real-time AI forecasting.
        </Text>

        <GlassCard style={{ marginTop: spacing(2) }} accessibilityLabel="Plaid bank linking placeholder">
          <Text style={{ color: colors.text, fontWeight: '700', marginBottom: spacing(1) }}>Coming soon</Text>
          <Text style={{ color: colors.subtext, marginBottom: spacing(2), lineHeight: 18 }}>
            We will add Plaid here later 👟💸. Expect instant account sync, categorization, and automated rituals.
          </Text>
          <HLButton
            title="Back to dashboard"
            onPress={() => navigation?.goBack?.()}
            accessibilityLabel="Back to dashboard"
          />
        </GlassCard>
      </View>
    </SafeAreaView>
  );
}
