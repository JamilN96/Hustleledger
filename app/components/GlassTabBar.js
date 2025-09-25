import React from 'react';
import { View, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { colors, radii, spacing } from '../lib/theme';

export default function GlassTabBar({ state, descriptors, navigation }) {
  return (
    <BlurView intensity={30} tint="dark" style={{
      position: 'absolute', left: 16, right: 16, bottom: 20,
      borderRadius: radii.xl, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.06)'
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
            <Pressable key={route.key} onPress={onPress} style={{ flex: 1, alignItems: 'center' }}>
              <Ionicons
                name={isFocused ? icon : `${icon}-outline`}
                size={24}
                color={isFocused ? colors.accent2 : colors.subtext}
              />
            </Pressable>
          );
        })}
      </View>
    </BlurView>
  );
}
