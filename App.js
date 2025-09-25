import 'react-native-gesture-handler';
import 'react-native-reanimated';
import * as React from 'react';
import { StatusBar, View, Appearance } from 'react-native';
import { Provider as PaperProvider, MD3LightTheme as DefaultTheme } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

try { require('./app/config.local'); } catch (e) {}

import { useColors, radii } from './app/lib/theme';
import SignIn from './app/screens/SignIn';
import SignUp from './app/screens/SignUp';
import AppLock from './app/screens/AppLock';
import RootTabs from './app/navigation/RootTabs';
import LinkBank from './app/screens/LinkBank';

const Stack = createNativeStackNavigator();

export default function App() {
  const colors = useColors();
  const theme = {
    ...DefaultTheme,
    roundness: radii.md,
    colors: {
      ...DefaultTheme.colors,
      primary: colors.accent1,
      onSurface: colors.text,
      surface: 'transparent',
      background: colors.bg,
    },
  };

  React.useEffect(() => {
    const sub = Appearance.addChangeListener(() => {
      // trigger re-render on scheme change
    });
    return () => sub.remove();
  }, []);

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <StatusBar barStyle={Appearance.getColorScheme() === 'dark' ? 'light-content' : 'dark-content'} />
        <View style={{ flex: 1, backgroundColor: colors.bg }}>
          <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false, animation: 'fade_from_bottom' }}>
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="SignUp" component={SignUp} />
              <Stack.Screen name="AppLock" component={AppLock} />
              <Stack.Screen name="RootTabs" component={RootTabs} />
              <Stack.Screen name="LinkBank" component={LinkBank} />
            </Stack.Navigator>
          </NavigationContainer>
        </View>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
