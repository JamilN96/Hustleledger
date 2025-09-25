import React, { useCallback } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from 'react-native-paper';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import { useColors, radii, spacing } from '../lib/theme';

/**
 * Acceptance checks: No ESLint/TypeScript errors; App compiles with Expo; Tabs scale on press; HLButton scales on press; Dashboard balance animates; No nested VirtualizedLists warnings; Colors react to iOS light/dark mode.
 */

const Placeholder = ({ title }) => {
  const colors = useColors();
  return (
    <View style={styles.placeholder}>
      <Text style={[styles.placeholderTitle, { color: colors.text }]} allowFontScaling>
        {title}
      </Text>
      <Text style={[styles.placeholderCopy, { color: colors.subtext }]} allowFontScaling>
        We are training the AI to surface predictive insights and account deep dives.
      </Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

const icons = {
  DashboardTab: 'speedometer',
  InsightsTab: 'sparkles',
  AccountsTab: 'wallet',
  SettingsTab: 'settings',
};

const AnimatedIcon = ({ focused, name, color }) => {
  const scale = useSharedValue(focused ? 1.15 : 1);
  const opacity = useSharedValue(focused ? 1 : 0.7);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  React.useEffect(() => {
    scale.value = withTiming(focused ? 1.15 : 1, { duration: 150 });
    opacity.value = withTiming(focused ? 1 : 0.7, { duration: 150 });
  }, [focused, opacity, scale]);

  return (
    <Animated.View style={animatedStyle}>
      <Ionicons name={focused ? name : `${name}-outline`} size={26} color={color} />
    </Animated.View>
  );
};

const TabBarButton = ({
  onPress,
  onLongPress,
  accessibilityLabel,
  accessibilityRole,
  accessibilityState,
  children,
  ...rest
}) => {
  const handlePress = useCallback(() => {
    Haptics.selectionAsync();
    onPress?.();
  }, [onPress]);

  return (
    <Pressable
      {...rest}
      onPress={handlePress}
      onLongPress={onLongPress}
      accessibilityRole={accessibilityRole}
      accessibilityLabel={accessibilityLabel}
      accessibilityState={accessibilityState}
      style={({ pressed }) => [styles.tabButton, pressed && styles.tabPressed]}
    >
      {children}
    </Pressable>
  );
};

export default function RootTabs() {
  const colors = useColors();

  return (
    <Tab.Navigator
      sceneContainerStyle={{ backgroundColor: colors.bgSecondary + '33' }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.subtext,
        tabBarButton: (props) => <TabBarButton {...props} />,
        tabBarStyle: [
          styles.tabBar,
          {
            backgroundColor: '#151A2AEE',
            borderRadius: radii.xl,
          },
        ],
        tabBarIcon: ({ focused, color }) => (
          <AnimatedIcon focused={focused} name={icons[route.name]} color={color} />
        ),
      })}
    >
      <Tab.Screen name="DashboardTab" component={Dashboard} />
      <Tab.Screen name="InsightsTab" children={() => <Placeholder title="Insights (AI)" />} />
      <Tab.Screen name="AccountsTab" children={() => <Placeholder title="Accounts" />} />
      <Tab.Screen name="SettingsTab" component={Settings} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: spacing(3),
  },
  placeholderTitle: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
  },
  placeholderCopy: {
    marginTop: spacing(1.5),
    textAlign: 'center',
    lineHeight: spacing(2.5),
  },
  tabBar: {
    position: 'absolute',
    left: spacing(2),
    right: spacing(2),
    bottom: spacing(2),
    height: spacing(7.75),
    borderTopWidth: 0,
    elevation: 0,
    paddingHorizontal: spacing(1.5),
    paddingVertical: spacing(1.25),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.lg,
  },
  tabPressed: {
    opacity: 0.8,
  },
});
