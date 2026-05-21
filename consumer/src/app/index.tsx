import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function WelcomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <ThemedView
      type="background"
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom },
      ]}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText type="default" style={styles.brandName}>
            Order Up{' '}
            <SymbolView
              name={{ ios: 'info.circle', android: 'info', web: 'info' }}
              size={16}
              tintColor={theme.text}
            />
          </ThemedText>
        </View>

        <View style={styles.middleSection}>
          <ThemedText type="title" style={styles.heading}>
            Shaping Dining{'\n'}Traditions
          </ThemedText>

          <View style={styles.mascotContainer}>
            <Image
              source={require('@/assets/images/mascot.png')}
              style={styles.mascot}
              contentFit="contain"
            />
          </View>
        </View>

        <Pressable
          style={[
            styles.getStartedButton,
            { backgroundColor: theme.primary },
          ]}>
          <SymbolView
            name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
            size={20}
            tintColor="#FFFFFF"
          />
          <ThemedText type="default" style={styles.buttonText}>
            Get Started
          </ThemedText>
          <SymbolView
            name={{ ios: 'chevron.right', android: 'arrow_forward', web: 'arrow_forward' }}
            size={20}
            tintColor="#FFFFFF"
          />
        </Pressable>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
    paddingTop: Spacing.four,
  },
  brandName: {
    fontWeight: '600',
  },
  middleSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.five,
  },
  heading: {
    textAlign: 'center',
    fontWeight: '700',
  },
  mascotContainer: {
    width: 280,
    height: 280,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mascot: {
    width: '100%',
    height: '100%',
  },
  getStartedButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginBottom: Spacing.five,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
