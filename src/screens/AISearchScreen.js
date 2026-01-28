import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RecipeCard, Button } from '../components';
import { useGrocery } from '../context/GroceryContext';
import { useRecipes } from '../context/RecipeContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const AISearchScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { groceryList } = useGrocery();
  const { findRecipesByIngredients, isFavorite, toggleFavorite } = useRecipes();

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const pulseAnim = new Animated.Value(1);

  const availableIngredients = groceryList.map(item => item.name);

  useEffect(() => {
    // Auto-select all ingredients initially
    setSelectedIngredients(availableIngredients);
  }, [groceryList]);

  useEffect(() => {
    if (selectedIngredients.length > 0) {
      searchRecipes();
    } else {
      setRecommendations([]);
    }
  }, [selectedIngredients]);

  const searchRecipes = () => {
    setIsSearching(true);
    // Simulate AI processing
    setTimeout(() => {
      const results = findRecipesByIngredients(selectedIngredients);
      setRecommendations(results);
      setIsSearching(false);
    }, 500);
  };

  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev =>
      prev.includes(ingredient)
        ? prev.filter(i => i !== ingredient)
        : [...prev, ingredient]
    );
  };

  const selectAll = () => {
    setSelectedIngredients(availableIngredients);
  };

  const clearAll = () => {
    setSelectedIngredients([]);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.secondary, COLORS.secondaryDark]}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Ionicons name="sparkles" size={24} color={COLORS.white} />
            <Text style={styles.headerTitle}>AI Recipe Finder</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          Find recipes based on your available ingredients
        </Text>
      </LinearGradient>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
      >
        {/* Ingredients Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Ingredients</Text>
            <View style={styles.sectionActions}>
              <TouchableOpacity onPress={selectAll}>
                <Text style={styles.actionText}>Select All</Text>
              </TouchableOpacity>
              <Text style={styles.actionDivider}>|</Text>
              <TouchableOpacity onPress={clearAll}>
                <Text style={styles.actionText}>Clear</Text>
              </TouchableOpacity>
            </View>
          </View>

          {availableIngredients.length > 0 ? (
            <View style={styles.ingredientsGrid}>
              {availableIngredients.map((ingredient, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.ingredientChip,
                    selectedIngredients.includes(ingredient) &&
                      styles.ingredientChipSelected,
                  ]}
                  onPress={() => toggleIngredient(ingredient)}
                >
                  <Text
                    style={[
                      styles.ingredientText,
                      selectedIngredients.includes(ingredient) &&
                        styles.ingredientTextSelected,
                    ]}
                  >
                    {ingredient}
                  </Text>
                  {selectedIngredients.includes(ingredient) && (
                    <Ionicons
                      name="checkmark-circle"
                      size={16}
                      color={COLORS.white}
                      style={styles.checkIcon}
                    />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          ) : (
            <View style={styles.emptyIngredients}>
              <Ionicons name="basket-outline" size={48} color={COLORS.gray300} />
              <Text style={styles.emptyText}>No ingredients in your grocery list</Text>
              <Button
                title="Add Groceries"
                variant="outline"
                size="small"
                onPress={() => navigation.navigate('Scanner')}
                style={{ marginTop: SPACING.md }}
              />
            </View>
          )}
        </View>

        {/* Results Section */}
        {selectedIngredients.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.resultsTitleContainer}>
                <Ionicons name="restaurant" size={20} color={COLORS.secondary} />
                <Text style={[styles.sectionTitle, { marginLeft: SPACING.xs }]}>
                  Recommended Recipes
                </Text>
              </View>
              <Text style={styles.resultsCount}>
                {recommendations.length} found
              </Text>
            </View>

            {isSearching ? (
              <View style={styles.loadingContainer}>
                <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
                  <View style={styles.loadingIcon}>
                    <Ionicons name="sparkles" size={32} color={COLORS.secondary} />
                  </View>
                </Animated.View>
                <Text style={styles.loadingText}>AI is finding recipes...</Text>
              </View>
            ) : recommendations.length > 0 ? (
              <View>
                {recommendations.map((recipe) => (
                  <RecipeCard
                    key={recipe.id}
                    recipe={recipe}
                    variant="list"
                    isFavorite={isFavorite(recipe.id)}
                    matchPercentage={recipe.matchPercentage}
                    onPress={() =>
                      navigation.navigate('RecipeDetail', { recipe })
                    }
                    onFavoritePress={() => toggleFavorite(recipe.id)}
                  />
                ))}
              </View>
            ) : (
              <View style={styles.noResults}>
                <Ionicons name="search-outline" size={48} color={COLORS.gray300} />
                <Text style={styles.noResultsText}>
                  No matching recipes found
                </Text>
                <Text style={styles.noResultsSubtext}>
                  Try adding more ingredients to your list
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Tips Section */}
        <View style={styles.tipsContainer}>
          <View style={styles.tipCard}>
            <View style={styles.tipIconContainer}>
              <Ionicons name="bulb" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.tipContent}>
              <Text style={styles.tipTitle}>Pro Tip</Text>
              <Text style={styles.tipText}>
                The more ingredients you select, the more accurate your recipe
                matches will be!
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingHorizontal: SPACING.lg,
    paddingBottom: SPACING.lg,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.white,
    marginLeft: SPACING.xs,
  },
  headerSubtitle: {
    fontSize: FONTS.body,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
  },
  content: {
    padding: SPACING.lg,
  },
  section: {
    marginBottom: SPACING.xl,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  sectionTitle: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  sectionActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  actionDivider: {
    marginHorizontal: SPACING.sm,
    color: COLORS.gray300,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  ingredientChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    ...SHADOWS.small,
  },
  ingredientChipSelected: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
  },
  ingredientText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textPrimary,
    fontWeight: '500',
  },
  ingredientTextSelected: {
    color: COLORS.white,
  },
  checkIcon: {
    marginLeft: SPACING.xs,
  },
  emptyIngredients: {
    alignItems: 'center',
    paddingVertical: SPACING.xl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  emptyText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.sm,
  },
  resultsTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  resultsCount: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
  },
  loadingIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.secondaryLight + '30',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.md,
  },
  noResults: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    ...SHADOWS.small,
  },
  noResultsText: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  noResultsSubtext: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  tipsContainer: {
    marginTop: SPACING.md,
  },
  tipCard: {
    flexDirection: 'row',
    backgroundColor: COLORS.primarySoft,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.md,
  },
  tipIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  tipContent: {
    flex: 1,
  },
  tipTitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.primaryDark,
    marginBottom: 4,
  },
  tipText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    lineHeight: 20,
  },
});

export default AISearchScreen;
