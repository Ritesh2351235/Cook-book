import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  Share,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { useRecipes } from '../context/RecipeContext';
import { useGrocery } from '../context/GroceryContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const RecipeDetailScreen = ({ route, navigation }) => {
  const { recipe } = route.params;
  const insets = useSafeAreaInsets();
  const { isFavorite, toggleFavorite, addToRecentlyViewed } = useRecipes();
  const { addMultipleItems, groceryList } = useGrocery();
  const [activeTab, setActiveTab] = useState('ingredients');
  const [servings, setServings] = useState(recipe.servings);

  useEffect(() => {
    addToRecentlyViewed(recipe.id);
  }, [recipe.id]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out this recipe: ${recipe.title}\n\n${recipe.description}`,
      });
    } catch (error) {
      console.log('Error sharing:', error);
    }
  };

  const handleAddToGroceryList = () => {
    const items = recipe.ingredients.map(ing => ing.name);
    addMultipleItems(items);
    navigation.navigate('GroceryList');
  };

  const getScaledAmount = (amount) => {
    const ratio = servings / recipe.servings;
    // Simple scaling for numeric amounts
    const numMatch = amount.match(/[\d.]+/);
    if (numMatch) {
      const num = parseFloat(numMatch[0]);
      const scaled = (num * ratio).toFixed(1).replace(/\.0$/, '');
      return amount.replace(numMatch[0], scaled);
    }
    return amount;
  };

  const isInGroceryList = (ingredientName) => {
    return groceryList.some(item =>
      item.name.toLowerCase().includes(ingredientName.toLowerCase()) ||
      ingredientName.toLowerCase().includes(item.name.toLowerCase())
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: recipe.image }} style={styles.heroImage} />
          <LinearGradient
            colors={['rgba(0,0,0,0.3)', 'transparent', 'rgba(0,0,0,0.7)']}
            style={styles.heroGradient}
          />

          {/* Header Actions */}
          <View style={[styles.headerActions, { top: insets.top + SPACING.md }]}>
            <TouchableOpacity
              style={styles.headerButton}
              onPress={() => navigation.goBack()}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.white} />
            </TouchableOpacity>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerButton} onPress={handleShare}>
                <Ionicons name="share-outline" size={24} color={COLORS.white} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.headerButton}
                onPress={() => toggleFavorite(recipe.id)}
              >
                <Ionicons
                  name={isFavorite(recipe.id) ? 'heart' : 'heart-outline'}
                  size={24}
                  color={isFavorite(recipe.id) ? COLORS.error : COLORS.white}
                />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recipe Title */}
          <View style={styles.heroContent}>
            <View style={styles.badges}>
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{recipe.cuisine}</Text>
              </View>
              <View style={[styles.badge, styles.badgeDifficulty]}>
                <Text style={styles.badgeText}>{recipe.difficulty}</Text>
              </View>
            </View>
            <Text style={styles.title}>{recipe.title}</Text>
            <Text style={styles.description}>{recipe.description}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.stat}>
            <Ionicons name="time-outline" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>
              {recipe.prepTime + recipe.cookTime} min
            </Text>
            <Text style={styles.statLabel}>Total Time</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="flame-outline" size={24} color={COLORS.secondary} />
            <Text style={styles.statValue}>{recipe.calories}</Text>
            <Text style={styles.statLabel}>Calories</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.stat}>
            <Ionicons name="star" size={24} color={COLORS.primary} />
            <Text style={styles.statValue}>{recipe.rating}</Text>
            <Text style={styles.statLabel}>{recipe.reviews} reviews</Text>
          </View>
        </View>

        {/* Servings Selector */}
        <View style={styles.servingsContainer}>
          <Text style={styles.servingsLabel}>Servings</Text>
          <View style={styles.servingsControl}>
            <TouchableOpacity
              style={styles.servingsButton}
              onPress={() => setServings(Math.max(1, servings - 1))}
            >
              <Ionicons name="remove" size={20} color={COLORS.gray600} />
            </TouchableOpacity>
            <Text style={styles.servingsValue}>{servings}</Text>
            <TouchableOpacity
              style={styles.servingsButton}
              onPress={() => setServings(servings + 1)}
            >
              <Ionicons name="add" size={20} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'ingredients' && styles.tabActive]}
            onPress={() => setActiveTab('ingredients')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'ingredients' && styles.tabTextActive,
              ]}
            >
              Ingredients
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'instructions' && styles.tabActive]}
            onPress={() => setActiveTab('instructions')}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === 'instructions' && styles.tabTextActive,
              ]}
            >
              Instructions
            </Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={[styles.tabContent, { paddingBottom: insets.bottom + 100 }]}>
          {activeTab === 'ingredients' ? (
            <View>
              {recipe.ingredients.map((ingredient, index) => (
                <View key={index} style={styles.ingredientItem}>
                  <View
                    style={[
                      styles.ingredientCheck,
                      isInGroceryList(ingredient.name) && styles.ingredientCheckActive,
                    ]}
                  >
                    {isInGroceryList(ingredient.name) && (
                      <Ionicons name="checkmark" size={14} color={COLORS.white} />
                    )}
                  </View>
                  <Text style={styles.ingredientName}>{ingredient.name}</Text>
                  <Text style={styles.ingredientAmount}>
                    {getScaledAmount(ingredient.amount)}
                  </Text>
                </View>
              ))}
              <Button
                title="Add All to Grocery List"
                variant="outline"
                onPress={handleAddToGroceryList}
                icon={<Ionicons name="cart" size={20} color={COLORS.primary} />}
                style={{ marginTop: SPACING.lg }}
              />
            </View>
          ) : (
            <View>
              {recipe.instructions.map((instruction, index) => (
                <View key={index} style={styles.instructionItem}>
                  <View style={styles.stepNumber}>
                    <Text style={styles.stepNumberText}>{index + 1}</Text>
                  </View>
                  <Text style={styles.instructionText}>{instruction}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Action */}
      <View
        style={[
          styles.bottomAction,
          { paddingBottom: insets.bottom + SPACING.md },
        ]}
      >
        <Button
          title="Start Cooking"
          onPress={() => setActiveTab('instructions')}
          fullWidth
          icon={<Ionicons name="restaurant" size={20} color={COLORS.black} />}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  heroContainer: {
    height: height * 0.45,
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  headerActions: {
    position: 'absolute',
    left: SPACING.md,
    right: SPACING.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0,0,0,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: SPACING.sm,
  },
  headerRight: {
    flexDirection: 'row',
  },
  heroContent: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: SPACING.lg,
  },
  badges: {
    flexDirection: 'row',
    marginBottom: SPACING.sm,
  },
  badge: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.sm,
    paddingVertical: 4,
    borderRadius: BORDER_RADIUS.sm,
    marginRight: SPACING.sm,
  },
  badgeDifficulty: {
    backgroundColor: COLORS.secondary,
  },
  badgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
    color: COLORS.white,
  },
  title: {
    fontSize: FONTS.h2,
    fontWeight: 'bold',
    color: COLORS.white,
    marginBottom: SPACING.xs,
  },
  description: {
    fontSize: FONTS.body,
    color: 'rgba(255,255,255,0.9)',
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.white,
    marginHorizontal: SPACING.lg,
    marginTop: -SPACING.xl,
    borderRadius: BORDER_RADIUS.lg,
    padding: SPACING.lg,
    ...SHADOWS.medium,
  },
  stat: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.xs,
  },
  statLabel: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
  },
  statDivider: {
    width: 1,
    backgroundColor: COLORS.gray200,
    marginVertical: SPACING.xs,
  },
  servingsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    ...SHADOWS.small,
  },
  servingsLabel: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
  },
  servingsControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.xs,
  },
  servingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  servingsValue: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginHorizontal: SPACING.lg,
  },
  tabsContainer: {
    flexDirection: 'row',
    marginHorizontal: SPACING.lg,
    marginTop: SPACING.lg,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: SPACING.md,
    alignItems: 'center',
    borderRadius: BORDER_RADIUS.sm,
  },
  tabActive: {
    backgroundColor: COLORS.white,
    ...SHADOWS.small,
  },
  tabText: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.textSecondary,
  },
  tabTextActive: {
    color: COLORS.textPrimary,
  },
  tabContent: {
    padding: SPACING.lg,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  ingredientCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  ingredientCheckActive: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  ingredientName: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  ingredientAmount: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  instructionItem: {
    flexDirection: 'row',
    marginBottom: SPACING.lg,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  stepNumberText: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.black,
  },
  instructionText: {
    flex: 1,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
    lineHeight: 24,
  },
  bottomAction: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray100,
  },
});

export default RecipeDetailScreen;
