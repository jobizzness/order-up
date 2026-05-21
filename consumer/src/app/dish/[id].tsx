import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Button } from '@/components/ui/button';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const MOCK_DISH = {
  id: '1',
  name: 'Avocado Zest Grain Bowl',
  image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800',
  rating: 4.9,
  reviewCount: 128,
  price: 18,
  description:
    'Our signature Avocado Zest Grain Bowl is a symphony of textures and flavors. A base of warm, fluffy quinoa is layered with creamy Hass avocado slices, lemon-infused kale, and crunchy roasted chickpeas. Topped with a zesty citrus-tahini dressing that ties everything together for a refreshing, nutrient-dense meal.',
  calories: 450,
  protein: 14,
  host: {
    name: 'Chef Julian Vane',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
  },
};

export default function DishDetailScreen() {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const dish = MOCK_DISH;

  return (
    <ThemedView type="background" style={styles.container}>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: insets.bottom + Spacing.five,
        }}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image source={{ uri: dish.image }} style={styles.image} contentFit="cover" />

          {/* Back Button */}
          <TouchableOpacity style={[styles.backButton, { backgroundColor: theme.card }]}>
            <SymbolView
              name={{ ios: 'chevron.left', android: 'arrow_back', web: 'arrow_back' }}
              size={24}
              tintColor={theme.text}
            />
          </TouchableOpacity>

          {/* Favorite Button */}
          <TouchableOpacity style={[styles.favoriteButton, { backgroundColor: theme.card }]}>
            <SymbolView
              name={{ ios: 'heart', android: 'favorite_border', web: 'favorite_border' }}
              size={24}
              tintColor={theme.text}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={[styles.content, { backgroundColor: theme.card }]}>
          {/* Title Row */}
          <View style={styles.titleRow}>
            <ThemedText type="subtitle" style={styles.name}>
              {dish.name}
            </ThemedText>
            <View style={styles.priceContainer}>
              <ThemedText type="default" style={[styles.price, { color: theme.primary }]}>
                ${dish.price}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Average Price
              </ThemedText>
            </View>
          </View>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              size={16}
              tintColor="#FFB800"
            />
            <ThemedText type="default" style={styles.rating}>
              {dish.rating}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              ({dish.reviewCount} Reviews)
            </ThemedText>
          </View>

          {/* Tabs */}
          <View style={styles.tabs}>
            <Pressable style={[styles.tab, styles.activeTab, { backgroundColor: theme.primary }]}>
              <ThemedText type="small" style={styles.activeTabText}>
                Overview
              </ThemedText>
            </Pressable>
            <Pressable style={styles.tab}>
              <ThemedText type="small" themeColor="textSecondary">
                Details
              </ThemedText>
            </Pressable>
            <Pressable style={styles.tab}>
              <ThemedText type="small" themeColor="textSecondary">
                Reviews
              </ThemedText>
            </Pressable>
          </View>

          {/* Description */}
          <ThemedText type="smallBold" style={styles.sectionTitle}>
            Description
          </ThemedText>
          <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
            {dish.description}
          </ThemedText>

          {/* Nutrition */}
          <View style={styles.nutritionContainer}>
            <View style={[styles.nutritionBox, { backgroundColor: theme.surface }]}>
              <ThemedText type="small" themeColor="textSecondary">
                CALORIES
              </ThemedText>
              <ThemedText type="default" style={styles.nutritionValue}>
                {dish.calories} kcal
              </ThemedText>
            </View>
            <View style={[styles.nutritionBox, { backgroundColor: theme.surface }]}>
              <ThemedText type="small" themeColor="textSecondary">
                PROTEIN
              </ThemedText>
              <ThemedText type="default" style={styles.nutritionValue}>
                {dish.protein}g
              </ThemedText>
            </View>
          </View>

          {/* Host */}
          <View style={styles.hostContainer}>
            <Image source={{ uri: dish.host.avatar }} style={styles.hostAvatar} />
            <View style={styles.hostInfo}>
              <ThemedText type="small" themeColor="textSecondary">
                Host
              </ThemedText>
              <ThemedText type="smallBold">{dish.host.name}</ThemedText>
            </View>
            <TouchableOpacity style={styles.chatButton}>
              <SymbolView
                name={{ ios: 'message.fill', android: 'chat', web: 'chat' }}
                size={16}
                tintColor={theme.primary}
              />
              <ThemedText type="small" style={{ color: theme.primary }}>
                Chat
              </ThemedText>
            </TouchableOpacity>
          </View>

          {/* Add to Cart Button */}
          <Button
            title="Add to Cart"
            variant="primary"
            icon={
              <SymbolView
                name={{ ios: 'cart.fill', android: 'shopping_cart', web: 'shopping_cart' }}
                size={18}
                tintColor="#FFFFFF"
              />
            }
            onPress={() => { }}
          />
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 350,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteButton: {
    position: 'absolute',
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    marginTop: -30,
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 24,
  },
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    flex: 1,
    fontSize: 24,
    fontWeight: '700',
    marginRight: 12,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontWeight: '700',
    fontSize: 20,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  rating: {
    fontWeight: '600',
  },
  tabs: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  activeTab: {
    borderRadius: 20,
  },
  activeTabText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 8,
  },
  description: {
    lineHeight: 22,
  },
  nutritionContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  nutritionBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
  },
  nutritionValue: {
    marginTop: 4,
    fontWeight: '700',
  },
  hostContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    marginBottom: 20,
  },
  hostAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
  },
  hostInfo: {
    flex: 1,
    marginLeft: 12,
  },
  chatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
});
