import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useColors, spacing } from '../lib/theme';

export default function Row({ title, subtitle, amount, negative }) {
  const colors = useColors();
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing(1.25),
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.06)',
    }}>
      <View>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
        {!!subtitle && <Text style={{ color: colors.subtext, marginTop: 2 }}>{subtitle}</Text>}
      </View>
      <Text style={{ color: negative ? colors.danger : colors.success, fontWeight: '700' }}>
        {negative ? '-' : '+'}${amount}
      </Text>
    </View>
  );
}
