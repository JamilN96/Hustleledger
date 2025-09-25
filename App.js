import 'react-native-gesture-handler';
import 'react-native-reanimated';

import * as React from 'react';
import { StatusBar, View, Appearance } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

try {
  require('./app/config.local');
} catch {
  // Optional local overrides for development only
}

import { useColors, radii } from './app/lib/theme';

import SignIn from './app/screens/SignIn';
import SignUp from './app/screens/SignUp';
import AppLock from './app/screens/AppLock';
import RootTabs from './app/navigation/RootTabs';
import LinkBank from './app/screens/LinkBank';

const Stack = createNativeStackNavigator();

export default function App() {
  const colors = useColors();
  const gradient = colors.bgGradient ?? [colors.bg, colors.bgSecondary];
  const scrim = `${colors.bgSecondary}AA`;

  const theme = React.useMemo(
    () => ({
      ...DefaultTheme,
      roundness: radii.md,
      colors: {
        ...DefaultTheme.colors,
        primary: colors.primary,
        onSurface: colors.text,
        surface: colors.card,
        secondary: colors.accent2,
        background: colors.background,
        outline: colors.cardOutline,
      },
    }),
    [colors]
  );

  React.useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // trigger re-render so gradient + theme respond to system flips
    });
    return () => sub.remove();
  }, []);

  const barStyle = colors.isDark ? 'light-content' : 'dark-content';

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle={barStyle} backgroundColor="transparent" translucent />

        <LinearGradient
          colors={gradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <View
            style={{ flex: 1, backgroundColor: scrim }}
            accessibilityRole="summary"
            accessibilityLabel="Premium neon backdrop"
          >
            <NavigationContainer>
              <Stack.Navigator
                screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
              >
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="AppLock" component={AppLock} />
                <Stack.Screen name="RootTabs" component={RootTabs} />
                <Stack.Screen name="LinkBank" component={LinkBank} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </LinearGradient>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
