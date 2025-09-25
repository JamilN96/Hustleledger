import React from 'react';
import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { colors, spacing } from '../lib/theme';

export default function Row({ title, subtitle, amount, negative }) {
  return (
    <View style={{
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing(1.25),
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
