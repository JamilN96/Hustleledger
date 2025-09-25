import { Pressable, View } from 'react-native';
import { Text } from 'react-native-paper';
import { useColors, spacing } from '../lib/theme';

export default function Row({
  title,
  subtitle,
  amount,
  negative,
  icon,
  onPress,
  accessibilityLabel,
}) {
  const colors = useColors();
  const formatter = new Intl.NumberFormat(undefined, {
    style: 'currency',
    currency: 'USD',
  });
  const numericAmount = typeof amount === 'number' ? amount : Number.parseFloat(amount ?? 0);
  const formattedAmount = formatter.format(Number.isFinite(numericAmount) ? numericAmount : 0);

  const baseStyle = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing(1.25),
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  };

  const content = (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(0.75) }}>
        {!!icon && (
          <Text accessible={false} accessibilityLabel={undefined}>
            {icon}
          </Text>
        )}
        <View>
          <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
          {!!subtitle && <Text style={{ color: colors.subtext, marginTop: 2 }}>{subtitle}</Text>}
        </View>
      </View>
      <Text style={{ color: negative ? '#FF7A7A' : '#7CFFB2', fontWeight: '700' }}>
        {negative ? '-' : '+'}
        {formattedAmount}
      </Text>
    </>
  );

  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        accessibilityRole="button"
        accessibilityLabel={accessibilityLabel || title}
        style={({ pressed }) => ({ ...baseStyle, opacity: pressed ? 0.8 : 1 })}
      >
        {content}
      </Pressable>
    );
  }

  return <View style={baseStyle}>{content}</View>;
}
