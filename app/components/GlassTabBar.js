import { View, Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useColors, radii, spacing } from '../lib/theme';

export default function GlassTabBar({ state, descriptors, navigation }) {
  const colors = useColors();
  return (
    <BlurView intensity={30} tint="dark" style={{
      position: 'absolute', left: 16, right: 16, bottom: 20,
      borderRadius: radii.xl, overflow: 'hidden', backgroundColor: colors.card,
    }}>
      <View style={{ flexDirection: 'row', paddingVertical: spacing(1) }}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
            if (!isFocused && !event.defaultPrevented) navigation.navigate(route.name);
          };
          const descriptor = descriptors[route.key]?.options || {};
          const icon = descriptor.tabBarIconName ||
            (route.name === 'DashboardTab'
              ? 'speedometer'
              : route.name === 'AnalyticsTab'
              ? 'stats-chart'
              : route.name === 'AccountsTab'
              ? 'wallet'
              : 'settings');
          const label = descriptor.tabBarLabel || route.name.replace('Tab', '');

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={descriptors[route.key]?.options?.tabBarLabel || route.name}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <View style={{ alignItems: 'center' }}>
                <View style={{
                  padding: spacing(0.5),
                  borderRadius: radii.lg,
                  backgroundColor: isFocused ? `${colors.accent2}1A` : 'transparent',
                }}>
                  {isFocused ? (
                    <LinearGradient
                      colors={[colors.accent1, colors.accent2]}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ borderRadius: radii.lg, padding: spacing(0.75) }}
                    >
                      <Ionicons name={icon} size={22} color="#050510" />
                    </LinearGradient>
                  ) : (
                    <Ionicons name={`${icon}-outline`} size={22} color={colors.subtext} />
                  )}
                </View>
                <Text style={{ color: isFocused ? colors.accent2 : colors.subtext, fontSize: 10, marginTop: 4 }}>
                  {label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}
