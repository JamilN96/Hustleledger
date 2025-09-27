// App.js
import 'react-native-gesture-handler';
import 'react-native-reanimated';

import { useEffect, useState } from 'react';
import { Appearance, StatusBar, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import {
  MD3LightTheme as DefaultTheme,
  Provider as PaperProvider,
} from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';

import { useColors, radii } from './app/lib/theme';
import { auth } from './app/lib/firebase';

import SignIn from './app/screens/SignIn';
import SignUp from './app/screens/SignUp';
import AppLock from './app/screens/AppLock';
import RootTabs from './app/navigation/RootTabs';
import LinkBank from './app/screens/LinkBank';
import ForgotPassword from './app/screens/ForgotPassword';

// Optional local overrides for development only (silently ignored if missing)
try {
  require('./app/config.local');
} catch {
  // no-op
}

const Stack = createNativeStackNavigator();

export default function App() {
  const colors = useColors();
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setAuthChecked(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // noop; forces re-render when system theme changes
    });

    return () => sub.remove();
  }, []);

  if (!authChecked) {
    return null;
  }

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
  const initialRouteName = currentUser ? 'AppLock' : 'SignIn';

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
            <NavigationContainer key={currentUser ? 'auth' : 'guest'}>
              <Stack.Navigator
                screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}
                initialRouteName={initialRouteName}
              >
                <Stack.Screen name="SignIn" component={SignIn} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
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
