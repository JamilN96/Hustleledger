// App.js
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
import { TransactionsProvider } from './app/lib/transactions';
import { useColors, radii } from './app/lib/theme';

import SignIn from './app/screens/SignIn';
import SignUp from './app/screens/SignUp';
import AppLock from './app/screens/AppLock';
import RootTabs from './app/navigation/RootTabs';
import LinkBank from './app/screens/LinkBank';

try {
  require('./app/config.local');
} catch {
  // Optional local overrides may not exist in all environments.
}

const Stack = createNativeStackNavigator();

export default function App() {
  const colors = useColors();

  // fallbacks so this file works with the simple theme as well
  const gradient = colors.bgGradient ?? [colors.background, colors.card];
  const bgSecondary = colors.bgSecondary ?? colors.background;

  const theme = {
    ...DefaultTheme,
    roundness: radii.md,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.primary,    // accent color from theme
      onSurface: colors.text,
      surface: 'transparent',
      background: colors.background,
    },
  };

  React.useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // noop; forces re-render when system theme changes
    });
    return () => sub.remove();
  }, []);

  const barStyle =
    Appearance.getColorScheme() === 'dark' ? 'light-content' : 'dark-content';

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
            style={{ flex: 1, backgroundColor: `${bgSecondary}AA` }}
            accessibilityRole="summary"
            accessibilityLabel="Premium neon backdrop"
          >
            <TransactionsProvider>
              <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
                  <Stack.Screen name="SignIn" component={SignIn} />
                  <Stack.Screen name="SignUp" component={SignUp} />
                  <Stack.Screen name="AppLock" component={AppLock} />
                  <Stack.Screen name="RootTabs" component={RootTabs} />
                  <Stack.Screen name="LinkBank" component={LinkBank} />
                </Stack.Navigator>
              </NavigationContainer>
            </TransactionsProvider>
          </View>
        </LinearGradient>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
