import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - SPACING.lg * 2 - SPACING.md) / 2;

const RecipeCard = ({
  recipe,
  onPress,
  onFavoritePress,
  isFavorite,
  variant = 'grid', // grid, list, featured
  matchPercentage,
}) => {
  if (variant === 'featured') {
    return (
      <TouchableOpacity
        style={[styles.featuredCard, SHADOWS.large]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: recipe.image }} style={styles.featuredImage} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.8)']}
          style={styles.featuredGradient}
        >
          <View style={styles.featuredContent}>
            <View style={styles.featuredBadge}>
              <Text style={styles.featuredBadgeText}>{recipe.cuisine}</Text>
            </View>
            <Text style={styles.featuredTitle}>{recipe.title}</Text>
            <View style={styles.featuredMeta}>
              <View style={styles.metaItem}>
                <Ionicons name="time-outline" size={14} color={COLORS.white} />
                <Text style={styles.metaTextWhite}>
                  {recipe.prepTime + recipe.cookTime} min
                </Text>
              </View>
              <View style={styles.metaItem}>
                <Ionicons name="star" size={14} color={COLORS.primary} />
                <Text style={styles.metaTextWhite}>{recipe.rating}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
        <TouchableOpacity
          style={styles.favoriteButtonFeatured}
          onPress={onFavoritePress}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={24}
            color={isFavorite ? COLORS.error : COLORS.white}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  if (variant === 'list') {
    return (
      <TouchableOpacity
        style={[styles.listCard, SHADOWS.small]}
        onPress={onPress}
        activeOpacity={0.9}
      >
        <Image source={{ uri: recipe.image }} style={styles.listImage} />
        <View style={styles.listContent}>
          <Text style={styles.listTitle} numberOfLines={2}>
            {recipe.title}
          </Text>
          <Text style={styles.listDescription} numberOfLines={2}>
            {recipe.description}
          </Text>
          <View style={styles.listMeta}>
            <View style={styles.metaItem}>
              <Ionicons name="time-outline" size={14} color={COLORS.gray600} />
              <Text style={styles.metaText}>
                {recipe.prepTime + recipe.cookTime} min
              </Text>
            </View>
            <View style={styles.metaItem}>
              <Ionicons name="star" size={14} color={COLORS.primary} />
              <Text style={styles.metaText}>{recipe.rating}</Text>
            </View>
            {matchPercentage !== undefined && (
              <View style={[styles.matchBadge, { backgroundColor: getMatchColor(matchPercentage) }]}>
                <Text style={styles.matchText}>{matchPercentage}% match</Text>
              </View>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.favoriteButtonList}
          onPress={onFavoritePress}
        >
          <Ionicons
            name={isFavorite ? 'heart' : 'heart-outline'}
            size={22}
            color={isFavorite ? COLORS.error : COLORS.gray400}
          />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  }

  // Grid variant (default)
  return (
    <TouchableOpacity
      style={[styles.gridCard, SHADOWS.small]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <Image source={{ uri: recipe.image }} style={styles.gridImage} />
      {matchPercentage !== undefined && (
        <View style={[styles.gridMatchBadge, { backgroundColor: getMatchColor(matchPercentage) }]}>
          <Text style={styles.gridMatchText}>{matchPercentage}%</Text>
        </View>
      )}
      <TouchableOpacity
        style={styles.favoriteButtonGrid}
        onPress={onFavoritePress}
      >
        <Ionicons
          name={isFavorite ? 'heart' : 'heart-outline'}
          size={20}
          color={isFavorite ? COLORS.error : COLORS.white}
        />
      </TouchableOpacity>
      <View style={styles.gridContent}>
        <Text style={styles.gridTitle} numberOfLines={2}>
          {recipe.title}
        </Text>
        <View style={styles.gridMeta}>
          <View style={styles.metaItem}>
            <Ionicons name="time-outline" size={12} color={COLORS.gray600} />
            <Text style={styles.metaTextSmall}>
              {recipe.prepTime + recipe.cookTime}m
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Ionicons name="star" size={12} color={COLORS.primary} />
            <Text style={styles.metaTextSmall}>{recipe.rating}</Text>
          </View>
        </View>
        <View style={styles.difficultyBadge}>
          <Text style={styles.difficultyText}>{recipe.difficulty}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const getMatchColor = (percentage) => {
  if (percentage >= 80) return COLORS.success;
  if (percentage >= 50) return COLORS.primary;
  return COLORS.secondary;
};

const styles = StyleSheet.create({
  // Featured Card Styles
  featuredCard: {
    width: width - SPACING.lg * 2,
    height: 220,
    borderRadius: BORDER_RADIUS.xl,
    overflow: 'hidden',
    marginRight: SPACING.md,
  },
  featuredImage: {
    width: '100%',
    height: '100%',
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '70%',
    justifyContent: 'flex-end',
    padding: SPACING.md,
  },
  featuredContent: {},
  featuredBadge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
    marginBottom: SPACING.xs,
  },
  featuredBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.black,
  },
  featuredTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  featuredMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteButtonFeatured: {
    position: 'absolute',
    top: SPACING.md,
    right: SPACING.md,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
  },

  // List Card Styles
  listCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    marginBottom: SPACING.md,
    overflow: 'hidden',
  },
  listImage: {
    width: 100,
    height: 100,
  },
  listContent: {
    flex: 1,
    padding: SPACING.md,
  },
  listTitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
  },
  listDescription: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  listMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  favoriteButtonList: {
    justifyContent: 'center',
    paddingRight: SPACING.md,
  },

  // Grid Card Styles
  gridCard: {
    width: CARD_WIDTH,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    overflow: 'hidden',
    marginBottom: SPACING.md,
  },
  gridImage: {
    width: '100%',
    height: 120,
  },
  gridContent: {
    padding: SPACING.sm,
  },
  gridTitle: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginBottom: SPACING.xs,
    height: 36,
  },
  gridMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.xs,
  },
  favoriteButtonGrid: {
    position: 'absolute',
    top: SPACING.sm,
    right: SPACING.sm,
    backgroundColor: 'rgba(0,0,0,0.3)',
    padding: SPACING.xs,
    borderRadius: BORDER_RADIUS.full,
  },
  gridMatchBadge: {
    position: 'absolute',
    top: SPACING.sm,
    left: SPACING.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  gridMatchText: {
    fontSize: FONTS.tiny,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  difficultyBadge: {
    backgroundColor: COLORS.primarySoft,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
    alignSelf: 'flex-start',
  },
  difficultyText: {
    fontSize: FONTS.tiny,
    fontWeight: '500',
    color: COLORS.primaryDark,
  },

  // Shared Styles
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SPACING.md,
  },
  metaText: {
    fontSize: FONTS.caption,
    color: COLORS.gray600,
    marginLeft: 4,
  },
  metaTextSmall: {
    fontSize: FONTS.tiny,
    color: COLORS.gray600,
    marginLeft: 2,
  },
  metaTextWhite: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    marginLeft: 4,
  },
  matchBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  matchText: {
    fontSize: FONTS.tiny,
    fontWeight: 'bold',
    color: COLORS.white,
  },
});

export default RecipeCard;
