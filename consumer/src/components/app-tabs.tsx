import { NativeTabs } from 'expo-router/unstable-native-tabs';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
    <NativeTabs
      backgroundColor={colors.background}
      indicatorColor={colors.backgroundElement}
      labelStyle={{ selected: { color: colors.text } }}>
      <NativeTabs.Trigger name="index">
        <NativeTabs.Trigger.Label>Home</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Slot>
          <SymbolView
            name="house"
            size={24}
            tintColor={colors.text}
          />
        </NativeTabs.Trigger.Slot>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="explore">
        <NativeTabs.Trigger.Label>Features</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Slot>
          <SymbolView
            name="globe"
            size={24}
            tintColor={colors.text}
          />
        </NativeTabs.Trigger.Slot>
      </NativeTabs.Trigger>

      <NativeTabs.Trigger name="home">
        <NativeTabs.Trigger.Label>Explore</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Slot>
          <SymbolView
            name="magnifyingglass"
            size={24}
            tintColor={colors.text}
          />
        </NativeTabs.Trigger.Slot>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
