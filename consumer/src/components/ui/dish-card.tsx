import { Image } from 'expo-image';
import { SymbolView } from 'expo-symbols';
import React from 'react';
import { Pressable, StyleSheet, TouchableOpacity, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { useTheme } from '@/hooks/use-theme';

export interface Dish {
  id: string;
  name: string;
  image: string;
  rating: number;
  reviewCount: number;
  price: number;
  description?: string;
  calories?: number;
  protein?: number;
  host?: {
    name: string;
    avatar: string;
  };
}

interface DishCardProps {
  dish: Dish;
  onPress?: () => void;
  onFavoritePress?: () => void;
  isFavorite?: boolean;
  variant?: 'compact' | 'full';
}

export function DishCard({
  dish,
  onPress,
  onFavoritePress,
  isFavorite = false,
  variant = 'compact',
}: DishCardProps) {
  const theme = useTheme();

  if (variant === 'full') {
    return (
      <Pressable onPress={onPress} style={styles.fullContainer}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: dish.image }} style={styles.fullImage} contentFit="cover" />
          <TouchableOpacity
            onPress={onFavoritePress}
            style={[styles.favoriteButton, { backgroundColor: theme.card }]}>
            <SymbolView
              name={{
                ios: isFavorite ? 'heart.fill' : 'heart',
                android: isFavorite ? 'favorite' : 'favorite_border',
                web: isFavorite ? 'favorite' : 'favorite_border',
              }}
              size={20}
              tintColor={isFavorite ? '#E53935' : theme.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={[styles.contentContainer, { backgroundColor: theme.card }]}>
          <View style={styles.headerRow}>
            <ThemedText type="default" style={styles.name}>
              {dish.name}
            </ThemedText>
            <View style={styles.priceContainer}>
              <ThemedText type="smallBold" style={{ color: theme.primary }}>
                ${dish.price}
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary">
                Average Price
              </ThemedText>
            </View>
          </View>

          <View style={styles.ratingRow}>
            <SymbolView
              name={{ ios: 'star.fill', android: 'star', web: 'star' }}
              size={14}
              tintColor="#FFB800"
            />
            <ThemedText type="small" style={styles.ratingText}>
              {dish.rating}
            </ThemedText>
            <ThemedText type="small" themeColor="textSecondary">
              ({dish.reviewCount} Reviews)
            </ThemedText>
          </View>

          {dish.description && (
            <>
              <ThemedText type="smallBold" style={styles.sectionTitle}>
                Description
              </ThemedText>
              <ThemedText type="small" themeColor="textSecondary" style={styles.description}>
                {dish.description}
              </ThemedText>
            </>
          )}

          {(dish.calories || dish.protein) && (
            <View style={styles.nutritionContainer}>
              {dish.calories && (
                <View style={[styles.nutritionBox, { backgroundColor: theme.surface }]}>
                  <ThemedText type="small" themeColor="textSecondary">
                    CALORIES
                  </ThemedText>
                  <ThemedText type="default" style={styles.nutritionValue}>
                    {dish.calories} kcal
                  </ThemedText>
                </View>
              )}
              {dish.protein && (
                <View style={[styles.nutritionBox, { backgroundColor: theme.surface }]}>
                  <ThemedText type="small" themeColor="textSecondary">
                    PROTEIN
                  </ThemedText>
                  <ThemedText type="default" style={styles.nutritionValue}>
                    {dish.protein}g
                  </ThemedText>
                </View>
              )}
            </View>
          )}

          {dish.host && (
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
          )}
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} style={styles.compactContainer}>
      <Image source={{ uri: dish.image }} style={styles.compactImage} contentFit="cover" />
      <TouchableOpacity
        onPress={onFavoritePress}
        style={[styles.compactFavoriteButton, { backgroundColor: theme.card }]}>
        <SymbolView
          name={{
            ios: isFavorite ? 'heart.fill' : 'heart',
            android: isFavorite ? 'favorite' : 'favorite_border',
            web: isFavorite ? 'favorite' : 'favorite_border',
          }}
          size={18}
          tintColor={isFavorite ? '#E53935' : theme.textSecondary}
        />
      </TouchableOpacity>
      <View style={[styles.compactContent, { backgroundColor: theme.card }]}>
        <ThemedText type="smallBold" numberOfLines={1}>
          {dish.name}
        </ThemedText>
        <View style={styles.compactMeta}>
          <SymbolView
            name={{ ios: 'fork.knife', android: 'restaurant', web: 'restaurant' }}
            size={12}
            tintColor={theme.primary}
          />
          <ThemedText type="small" themeColor="textSecondary">
            VIEW MORE
          </ThemedText>
        </View>
      </View>
      <TouchableOpacity style={[styles.arrowButton, { backgroundColor: theme.card }]}>
        <SymbolView
          name={{ ios: 'arrow.up.right', android: 'arrow_forward', web: 'arrow_forward' }}
          size={16}
          tintColor={theme.text}
        />
      </TouchableOpacity>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  // Compact styles
  compactContainer: {
    width: 280,
    height: 200,
    borderRadius: 20,
    overflow: 'hidden',
    marginRight: 16,
  },
  compactImage: {
    width: '100%',
    height: '100%',
  },
  compactFavoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactContent: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 52,
    padding: 12,
    borderRadius: 12,
  },
  compactMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  arrowButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Full styles
  fullContainer: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    height: 300,
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    marginTop: -30,
    marginHorizontal: 16,
    borderRadius: 24,
    padding: 20,
  },
  headerRow: {
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
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
  },
  ratingText: {
    fontWeight: '600',
  },
  sectionTitle: {
    marginTop: 20,
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
