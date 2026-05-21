import React from 'react';
import { Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Collapsible } from '@/components/ui/collapsible';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type FeatureItem = { label: string; done?: boolean };

const CUSTOMER_FEATURES: FeatureItem[] = [
  { label: 'User Registration / Login — email, phone, social auth' },
  { label: 'Location-Based Search — find nearby restaurants' },
  { label: 'Restaurant Discovery — browse by cuisine, rating, price, availability' },
  { label: 'Real-Time Table Availability — view available slots' },
  { label: 'Online Table Booking — select date, time, party size' },
  { label: 'Waitlist Management — join waitlist when fully booked' },
  { label: 'Special Requests — dietary restrictions, seating preferences' },
  { label: 'QR Menu — contactless digital menu scanning' },
  { label: 'In-App Payments — pay for reservations, pre-orders, deposits' },
  { label: 'Booking History — past and upcoming reservations' },
  { label: 'Push Notifications — booking confirmations, reminders, offers' },
  { label: 'Loyalty & Rewards — points, cashback, exclusive offers' },
  { label: 'Ratings & Reviews — rate dining experience' },
];

const MANAGER_FEATURES: FeatureItem[] = [
  { label: 'Dashboard — overview of today\'s bookings, occupancy, revenue' },
  { label: 'Reservation Management — view, confirm, modify, cancel bookings' },
  { label: 'Table Management — configure table layout, capacity, sections' },
  { label: 'Waitlist Management — manage waitlisted guests' },
  { label: 'QR Menu Builder — create and update digital menus' },
  { label: 'Booking Rules — set hours, availability, blackout dates' },
  { label: 'Staff Management — add staff, assign roles' },
  { label: 'Offers & Promotions — create discounts, special events' },
  { label: 'Customer Insights — guest profiles, preferences, visit history' },
  { label: 'Notifications — SMS/email to guests' },
];

const FUTURE_FEATURES: FeatureItem[] = [
  { label: 'AI-powered table optimization' },
  { label: 'Integration with POS systems' },
  { label: 'Delivery / takeout ordering' },
  { label: 'Event booking (private dining, parties)' },
  { label: 'Gift cards and vouchers' },
  { label: 'Referral program' },
];

function FeatureList({ items }: { items: FeatureItem[] }) {
  return (
    <View style={styles.featureList}>
      {items.map((item) => (
        <View key={item.label} style={styles.featureItem}>
          <ThemedText type="small" themeColor="textSecondary" style={styles.bullet}>•</ThemedText>
          <ThemedText type="small" style={styles.featureItemText}>{item.label}</ThemedText>
        </View>
      ))}
    </View>
  );
}

export default function FeaturesScreen() {
  const safeAreaInsets = useSafeAreaInsets();
  const theme = useTheme();

  const contentPlatformStyle = Platform.select({
    android: {
      paddingTop: safeAreaInsets.top + Spacing.four,
      paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.four,
    },
    ios: {
      paddingBottom: safeAreaInsets.bottom + BottomTabInset + Spacing.four,
    },
    web: {
      paddingTop: Spacing.six,
      paddingBottom: Spacing.four,
    },
  });

  return (
    <ScrollView
      style={[styles.scrollView, { backgroundColor: theme.background }]}
      contentInset={{
        top: safeAreaInsets.top,
        bottom: safeAreaInsets.bottom + BottomTabInset + Spacing.three,
      }}
      contentContainerStyle={[styles.contentContainer, contentPlatformStyle]}>
      <ThemedView style={styles.container}>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="subtitle">App Features</ThemedText>
          <ThemedText style={styles.centerText} themeColor="textSecondary">
            Everything built into Order Up
          </ThemedText>
        </ThemedView>

        <ThemedView style={styles.sectionsWrapper}>
          <Collapsible title="📱 Customer App">
            <FeatureList items={CUSTOMER_FEATURES} />
          </Collapsible>

          <Collapsible title="🍽️ Restaurant Manager">
            <FeatureList items={MANAGER_FEATURES} />
          </Collapsible>

          <Collapsible title="🔮 Coming Soon">
            <FeatureList items={FUTURE_FEATURES} />
          </Collapsible>
        </ThemedView>
      </ThemedView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  container: {
    maxWidth: MaxContentWidth,
    flexGrow: 1,
  },
  titleContainer: {
    gap: Spacing.three,
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
  },
  centerText: {
    textAlign: 'center',
  },
  sectionsWrapper: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.four,
  },
  featureList: {
    gap: Spacing.two,
  },
  featureItem: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'flex-start',
  },
  bullet: {
    lineHeight: 22,
  },
  featureItemText: {
    flex: 1,
  },
});
