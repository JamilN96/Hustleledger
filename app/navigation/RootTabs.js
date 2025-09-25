import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import GlassTabBar from '../components/GlassTabBar';
import { colors } from '../lib/theme';

// simple placeholder for Insights & Accounts
import { View } from 'react-native';
import { Text } from 'react-native-paper';
const Placeholder = ({ title }) => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.bg }}>
    <Text style={{ color: colors.text }}>{title}</Text>
  </View>
);

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={(props) => <GlassTabBar {...props} />}>
      <Tab.Screen name="DashboardTab" component={Dashboard} />
      <Tab.Screen name="InsightsTab"  children={() => <Placeholder title="Insights (AI)" />} />
      <Tab.Screen name="AccountsTab"  children={() => <Placeholder title="Accounts" />} />
      <Tab.Screen name="SettingsTab"  component={Settings} />
    </Tab.Navigator>
  );
}
