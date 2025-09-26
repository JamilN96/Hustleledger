// App.js
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useEffect } from 'react';
import { StatusBar, View, Appearance } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  Provider as PaperProvider,
  MD3LightTheme as DefaultTheme,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
<<<<<<< HEAD

try {
  require('./app/config.local');
} catch {
  // Optional local overrides for development only
}

=======
>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
import { useColors, radii } from './app/lib/theme';

import SignIn from './app/screens/SignIn';
import SignUp from './app/screens/SignUp';
import AppLock from './app/screens/AppLock';
import RootTabs from './app/navigation/RootTabs';
import LinkBank from './app/screens/LinkBank';
import ForgotPassword from './app/screens/ForgotPassword';

<<<<<<< HEAD
=======
// Optional local overrides for development only (silently ignored if missing)
try {
  require('./app/config.local');
} catch {
  // no-op
}

>>>>>>> d3018ae8 (feat(ui): tech-styled glass card with futuristic input fields)
const Stack = createNativeStackNavigator();

export default function App() {
  const colors = useColors();

  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // noop; forces re-render when system theme changes
    });
    return () => sub.remove();
  }, []);

  const gradient = colors.bgGradient ?? [colors.bg, colors.bgSecondary ?? colors.bg];
  const containerTint = colors.bgSecondary ?? colors.bg;

  const theme = {
    ...DefaultTheme,
    roundness: radii.md,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.accent1,
      onSurface: colors.text,
      surface: colors.card ?? 'transparent',
      background: colors.bg ?? DefaultTheme.colors.background,
    },
  };

  const barStyle = Appearance.getColorScheme() === 'dark' ? 'light-content' : 'dark-content';

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
            style={{ flex: 1, backgroundColor: `${containerTint}AA` }}
            accessibilityRole="summary"
            accessibilityLabel="Premium neon backdrop"
          >
            <NavigationContainer>
              <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="AppLock" component={AppLock} />
                <Stack.Screen name="RootTabs" component={RootTabs} />
                <Stack.Screen name="LinkBank" component={LinkBank} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
              </Stack.Navigator>
            </NavigationContainer>
          </View>
        </LinearGradient>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
