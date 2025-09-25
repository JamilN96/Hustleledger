import { View } from 'react-native';
import { Text } from 'react-native-paper';
import { useColors, spacing } from '../lib/theme';

const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch {
    return '';
  }
};

export default function Row({
  title,
  subtitle,
  amount,
  negative,
  category,
  categoryColor,
  date,
  type,
}) {
  const colors = useColors();
  const isExpense = type ? type === 'expense' : !!negative;
  const resolvedCategory = category || subtitle;
  const formattedDate = formatDate(date);
  const sign = isExpense ? '-' : '+';

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing(1.25),
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
      }}
      accessibilityRole="summary"
      accessibilityLabel={`${title} ${sign}$${Number(amount).toFixed(2)}`}
    >
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontWeight: '600' }}>{title}</Text>
        <View style={{ flexDirection: 'row', gap: spacing(0.5), marginTop: 4 }}>
          {resolvedCategory && (
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(0.5) }}>
              {categoryColor && (
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: categoryColor,
                  }}
                />
              )}
              <Text style={{ color: colors.subtext, fontSize: 12 }}>{resolvedCategory}</Text>
            </View>
          )}
          {formattedDate ? <Text style={{ color: colors.muted, fontSize: 12 }}>• {formattedDate}</Text> : null}
        </View>
      </View>
      <Text
        style={{
          color: isExpense ? colors.danger : colors.success,
          fontWeight: '700',
        }}
      >
        {`${sign}$${Number(amount).toFixed(2)}`}
      </Text>
    </View>
  );
}
