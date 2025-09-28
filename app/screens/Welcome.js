import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

import HLButton from '../components/HLButton';
import { spacing, useColors, useIsDarkMode } from '../lib/theme';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <View
        style={{
          flex: 1,
          paddingHorizontal: spacing(3),
          paddingVertical: spacing(4),
          justifyContent: 'space-between',
        }}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text
            style={{
              color: colors.text,
              fontSize: 40,
              fontWeight: '800',
              letterSpacing: 0.5,
              textAlign: 'center',
            }}
            allowFontScaling
          >
            HustleLedger
          </Text>
          <Text
            style={{
              marginTop: spacing(1.5),
              color: colors.subtext,
              fontSize: 16,
              lineHeight: 22,
              textAlign: 'center',
            }}
            allowFontScaling
          >
            Track your hustle, secure your ledger.
          </Text>
        </View>

        <View style={{ paddingBottom: spacing(2) }}>
          <HLButton
            title="Sign In"
            onPress={() => navigation.navigate('SignIn')}
            accessibilityLabel="Sign in to your HustleLedger account"
          />

          <View style={{ height: spacing(1.5) }} />

          <HLButton
            title="Create Account"
            onPress={() => navigation.navigate('SignUp')}
            accessibilityLabel="Create a new HustleLedger account"
          />
        </View>
      </View>
    </SafeAreaView>
  );
}
