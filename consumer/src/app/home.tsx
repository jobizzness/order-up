import { SymbolView } from 'expo-symbols';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { CategoryPill } from '@/components/ui/category-pill';
import { Dish, DishCard } from '@/components/ui/dish-card';
import { SearchBar } from '@/components/ui/search-bar';
import { BottomTabInset, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const CATEGORIES = ['All', 'Offers', 'French', 'European', 'Asian', 'Italian'];

const DISHES: Dish[] = [
  {
    id: '1',
    name: 'The Harvest Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600',
    rating: 4.8,
    reviewCount: 96,
    price: 22,
  },
  {
    id: '2',
    name: 'Mediterranean Delite',
    image: 'https://images.unsplash.com/photo-1574868235872-1663edcb4569?w=600',
    rating: 4.6,
    reviewCount: 64,
    price: 18,
  },
];

export default function HomeScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingTop: insets.top + Spacing.four,
          paddingBottom: insets.bottom + BottomTabInset + Spacing.four,
        }}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.locationContainer}>
            <View style={styles.avatar}>
              <SymbolView
                name={{ ios: 'person.fill', android: 'person', web: 'person' }}
                size={20}
                tintColor={theme.text}
              />
            </View>
            <View>
              <ThemedText type="small" themeColor="textSecondary">
                LOCATION
              </ThemedText>
              <View style={styles.locationRow}>
                <ThemedText type="default" style={styles.locationText}>
                  CA, Los Angeles
                </ThemedText>
                <SymbolView
                  name={{ ios: 'chevron.down', android: 'expand_more', web: 'expand_more' }}
                  size={16}
                  tintColor={theme.text}
                />
              </View>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <SymbolView
              name={{ ios: 'bell', android: 'notifications', web: 'notifications' }}
              size={24}
              tintColor={theme.text}
            />
            <View style={[styles.notificationBadge, { backgroundColor: theme.primary }]} />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <SearchBar
            value={searchQuery}
            onChangeText={setSearchQuery}
            onFilterPress={() => { }}
          />
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText type="smallBold">Category</ThemedText>
            <TouchableOpacity>
              <ThemedText type="small" themeColor="textSecondary">
                See All →
              </ThemedText>
            </TouchableOpacity>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}>
            {CATEGORIES.map((category) => (
              <CategoryPill
                key={category}
                label={category}
                isActive={selectedCategory === category}
                onPress={() => setSelectedCategory(category)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Featured Dishes */}
        <View style={styles.section}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.dishesContainer}>
            {DISHES.map((dish) => (
              <DishCard key={dish.id} dish={dish} />
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontWeight: '600',
  },
  notificationButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(128,128,128,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  searchContainer: {
    paddingHorizontal: Spacing.four,
    paddingBottom: Spacing.three,
  },
  section: {
    marginTop: Spacing.three,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    marginBottom: Spacing.two,
  },
  categoriesContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
  },
  dishesContainer: {
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.one,
  },
});
