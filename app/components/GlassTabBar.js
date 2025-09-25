import { View, Pressable, Text } from 'react-native';
import { BlurView } from 'expo-blur';
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
          const icon = route.name === 'DashboardTab' ? 'speedometer' :
                       route.name === 'InsightsTab'  ? 'sparkles'   :
                       route.name === 'AccountsTab'  ? 'wallet'     : 'settings';

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              accessibilityRole="button"
              accessibilityLabel={descriptors[route.key]?.options?.tabBarLabel || route.name}
              style={{ flex: 1, alignItems: 'center' }}
            >
              <Ionicons
                name={isFocused ? icon : `${icon}-outline`}
                size={24}
                color={isFocused ? colors.accent2 : colors.subtext}
              />
              <Text style={{ color: isFocused ? colors.accent2 : colors.subtext, fontSize: 10, marginTop: 4 }}>
                {descriptors[route.key]?.options?.tabBarLabel || route.name.replace('Tab', '')}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}
