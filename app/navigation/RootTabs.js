import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Dashboard from '../screens/Dashboard';
import Settings from '../screens/Settings';
import GlassTabBar from '../components/GlassTabBar';
import { useColors } from '../lib/theme';

// simple placeholder for Insights & Accounts
import { View } from 'react-native';
import { Text } from 'react-native-paper';
const Placeholder = ({ title }) => {
  const colors = useColors();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
      <Text style={{ color: colors.text, fontSize: 22, fontWeight: '700', textAlign: 'center' }}>{title}</Text>
      <Text style={{ color: colors.subtext, marginTop: 12, textAlign: 'center', lineHeight: 20 }}>
        We are training the AI to surface predictive insights and account deep dives.
      </Text>
    </View>
  );
};

const Tab = createBottomTabNavigator();

export default function RootTabs() {
  const colors = useColors();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <GlassTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: colors.bgSecondary + '33' }}
    >
      <Tab.Screen name="DashboardTab" component={Dashboard} />
      <Tab.Screen name="InsightsTab"  children={() => <Placeholder title="Insights (AI)" />} />
      <Tab.Screen name="AccountsTab"  children={() => <Placeholder title="Accounts" />} />
      <Tab.Screen name="SettingsTab"  component={Settings} />
    </Tab.Navigator>
  );
}
