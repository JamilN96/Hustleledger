import { Image, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import HLButton from '../components/HLButton';
import { useColors, spacing, useIsDarkMode } from '../lib/theme';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();

  const headingColor = colors.text;
  const taglineColor = colors.subtext;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.bg }}>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: spacing(3),
            paddingTop: spacing(6),
            paddingBottom: spacing(4),
            gap: spacing(3),
          }}
        >
          <Image
            source={require('../../assets/logo.png')}
            resizeMode="contain"
            style={{ width: spacing(10), height: spacing(10) }}
            accessibilityRole="image"
            accessibilityLabel="HustleLedger logo"
          />

          <View style={{ alignItems: 'center', gap: spacing(1.5) }}>
            <Text
              style={{
                color: headingColor,
                fontSize: 34,
                fontWeight: '800',
                textAlign: 'center',
              }}
              allowFontScaling
              accessibilityRole="header"
            >
              Command your hustle
            </Text>
            <Text
              style={{
                color: taglineColor,
                textAlign: 'center',
                fontSize: 16,
                lineHeight: 24,
                maxWidth: 320,
              }}
              allowFontScaling
            >
              Sync every revenue stream, automate cash flow rituals, and let the AI brief you on what moves next.
            </Text>
          </View>

          <View style={{ width: '100%', gap: spacing(2), marginTop: spacing(4) }}>
            <HLButton
              title="Launch command deck"
              onPress={() => navigation.navigate('SignIn')}
              accessibilityLabel="Launch HustleLedger command deck"
            />
            <HLButton
              title="Create access credentials"
              onPress={() => navigation.navigate('SignUp')}
              accessibilityLabel="Create HustleLedger access credentials"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
