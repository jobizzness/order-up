import React from 'react';
import { Pressable, StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

interface CategoryPillProps {
  label: string;
  isActive?: boolean;
  onPress?: () => void;
}

export function CategoryPill({ label, isActive = false, onPress }: CategoryPillProps) {
  const theme = useTheme();

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: isActive ? theme.primary : theme.surface,
        },
      ]}>
      <ThemedText
        type="small"
        style={{
          color: isActive ? '#FFFFFF' : theme.text,
          fontWeight: '600',
        }}>
        {label}
      </ThemedText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    marginRight: 12,
  },
});
