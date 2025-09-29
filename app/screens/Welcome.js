import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HLButton from '../components/HLButton';
import { useColors, useIsDarkMode, spacing } from '../lib/theme';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: colors.bg,
        paddingHorizontal: spacing(3),
        paddingVertical: spacing(4),
        justifyContent: 'space-between',
      }}
    >
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={{ alignItems: 'center', marginTop: spacing(6) }}>
        <Text
          style={{
            color: colors.text,
            fontSize: 36,
            fontWeight: '700',
            textAlign: 'center',
          }}
          allowFontScaling
        >
          HustleLedger
        </Text>
        <Text
          style={{
            color: colors.subtext,
            fontSize: 16,
            lineHeight: 22,
            marginTop: spacing(1.5),
            textAlign: 'center',
          }}
          allowFontScaling
        >
          Orchestrate your cash flow. Automate savings. Keep every hustle aligned.
        </Text>
      </View>

      <View style={{ marginBottom: spacing(4) }}>
        <HLButton
          title="Sign In"
          onPress={() => navigation.navigate('SignIn')}
          accessibilityLabel="Sign in to HustleLedger"
        />
        <HLButton
          title="Create account"
          onPress={() => navigation.navigate('SignUp')}
          accessibilityLabel="Create a new HustleLedger account"
          style={{ marginTop: spacing(2) }}
        />
      </View>
    </SafeAreaView>
  );
}
