import { useState } from 'react';
import { View, Pressable } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Text, TextInput, Portal, Modal, Divider } from 'react-native-paper';
import { useColors, spacing, radii } from '../lib/theme';
import HLButton from './HLButton';

export default function CategoryPicker({
  value,
  onValueChange,
  categories,
  onAddCategory,
  label = 'Category',
}) {
  const colors = useColors();
  const [visible, setVisible] = useState(false);
  const [customName, setCustomName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selected = categories?.find((entry) => entry.name === value);

  const openPicker = async () => {
    await Haptics.selectionAsync();
    setVisible(true);
  };

  const closePicker = () => {
    setVisible(false);
    setCustomName('');
  };

  const handleSelect = async (name) => {
    await Haptics.selectionAsync();
    onValueChange?.(name);
    closePicker();
  };

  const handleAddCategory = async () => {
    if (!customName.trim()) return;
    setSubmitting(true);
    try {
      const created = await onAddCategory?.(customName.trim());
      if (created?.name) {
        onValueChange?.(created.name);
        await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        closePicker();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View>
      <Pressable
        onPress={openPicker}
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${selected?.name || 'Select a category'}`}
        style={({ pressed }) => ({
          backgroundColor: pressed ? `${colors.cardBorder}40` : `${colors.cardBorder}2A`,
          borderRadius: radii.lg,
          paddingVertical: spacing(1.5),
          paddingHorizontal: spacing(1.75),
          borderWidth: 1,
          borderColor: colors.divider,
        })}
      >
        <Text style={{ color: colors.subtext, fontSize: 12, marginBottom: spacing(0.5) }}>{label}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1) }}>
          {selected?.color && (
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: selected.color,
              }}
            />
          )}
          <Text style={{ color: colors.text, fontWeight: '600' }}>
            {selected?.name || 'Select category'}
          </Text>
        </View>
      </Pressable>

      <Portal>
        <Modal
          visible={visible}
          onDismiss={closePicker}
          contentContainerStyle={{
            backgroundColor: colors.bgSecondary,
            marginHorizontal: spacing(1.5),
            padding: spacing(2),
            borderRadius: radii.xl,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 18, fontWeight: '700', marginBottom: spacing(1.5) }}>
            Pick a category
          </Text>
          <View style={{ maxHeight: 260 }}>
            {categories?.map((category, index) => (
              <View key={category.id || `${category.name}-${index}`}>
                <Pressable
                  onPress={() => handleSelect(category.name)}
                  style={({ pressed }) => ({
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: spacing(1.25),
                    opacity: pressed ? 0.8 : 1,
                  })}
                  accessibilityRole="button"
                  accessibilityLabel={`Select ${category.name}`}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: spacing(1.25) }}>
                    <View
                      style={{
                        width: 12,
                        height: 12,
                        borderRadius: 6,
                        backgroundColor: category.color,
                      }}
                    />
                    <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
                      {category.name}
                    </Text>
                  </View>
                  {value === category.name && (
                    <Text style={{ color: colors.accent3, fontWeight: '600' }}>Selected</Text>
                  )}
                </Pressable>
                {index < categories.length - 1 && <Divider style={{ opacity: 0.4 }} />}
              </View>
            ))}
          </View>

          <View style={{ marginTop: spacing(2) }}>
            <Text style={{ color: colors.subtext, fontSize: 13, marginBottom: spacing(1) }}>
              Need something else? Create a category.
            </Text>
            <TextInput
              value={customName}
              onChangeText={setCustomName}
              mode="outlined"
              placeholder="e.g. Wellness"
              returnKeyType="done"
              onSubmitEditing={handleAddCategory}
              theme={{ colors: { primary: colors.accent2, onSurfaceVariant: colors.subtext } }}
              accessibilityLabel="Custom category name"
              style={{ marginBottom: spacing(1.5) }}
            />
            <HLButton
              title={submitting ? 'Adding…' : 'Save custom category'}
              onPress={handleAddCategory}
              disabled={submitting || !customName.trim()}
              accessibilityLabel="Save custom category"
            />
          </View>
        </Modal>
      </Portal>
    </View>
  );
}
