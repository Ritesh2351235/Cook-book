import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TextInput,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RecipeCard } from '../components';
import { useAuth } from '../context/AuthContext';
import { useRecipes } from '../context/RecipeContext';
import { useGrocery } from '../context/GroceryContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { recipes, isFavorite, toggleFavorite, findRecipesByIngredients } = useRecipes();
  const { groceryList } = useGrocery();
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { id: '1', name: 'All', icon: 'grid' },
    { id: '2', name: 'Quick', icon: 'flash' },
    { id: '3', name: 'Healthy', icon: 'leaf' },
    { id: '4', name: 'Desserts', icon: 'ice-cream' },
    { id: '5', name: 'Italian', icon: 'pizza' },
  ];

  const featuredRecipes = recipes.slice(0, 3);
  const popularRecipes = recipes.slice(3, 7);

  // Get AI recommendations based on grocery list
  const availableIngredients = groceryList.map(item => item.name);
  const recommendedRecipes = findRecipesByIngredients(availableIngredients).slice(0, 4);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <LinearGradient
          colors={[COLORS.primary, COLORS.primaryDark]}
          style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greeting}>{getGreeting()}</Text>
              <Text style={styles.userName}>{user?.name || 'Chef'}</Text>
            </View>
            <TouchableOpacity
              style={styles.profileButton}
              onPress={() => navigation.navigate('Profile')}
            >
              <Ionicons name="person" size={24} color={COLORS.primary} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color={COLORS.gray500} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search recipes, ingredients..."
              placeholderTextColor={COLORS.gray400}
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={() => navigation.navigate('Search', { query: searchQuery })}
            />
            <TouchableOpacity
              style={styles.filterButton}
              onPress={() => navigation.navigate('Search')}
            >
              <Ionicons name="options" size={20} color={COLORS.primary} />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: COLORS.primarySoft }]}
            onPress={() => navigation.navigate('Scanner')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.primary }]}>
              <Ionicons name="camera" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.quickActionText}>Scan{'\n'}Groceries</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: '#E8F5E9' }]}
            onPress={() => navigation.navigate('GroceryList')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.accent }]}>
              <Ionicons name="list" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.quickActionText}>My{'\n'}Groceries</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: '#FFF3E0' }]}
            onPress={() => navigation.navigate('AISearch')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.secondary }]}>
              <Ionicons name="sparkles" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.quickActionText}>AI{'\n'}Recipes</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.quickAction, { backgroundColor: '#FCE4EC' }]}
            onPress={() => navigation.navigate('Favorites')}
          >
            <View style={[styles.quickActionIcon, { backgroundColor: COLORS.error }]}>
              <Ionicons name="heart" size={24} color={COLORS.white} />
            </View>
            <Text style={styles.quickActionText}>My{'\n'}Favorites</Text>
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesContainer}
          >
            {categories.map((category, index) => (
              <TouchableOpacity
                key={category.id}
                style={[
                  styles.categoryChip,
                  index === 0 && styles.categoryChipActive,
                ]}
              >
                <Ionicons
                  name={category.icon}
                  size={18}
                  color={index === 0 ? COLORS.black : COLORS.gray600}
                />
                <Text
                  style={[
                    styles.categoryText,
                    index === 0 && styles.categoryTextActive,
                  ]}
                >
                  {category.name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Featured Recipes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Recipes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={featuredRecipes}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.featuredList}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <RecipeCard
                recipe={item}
                variant="featured"
                isFavorite={isFavorite(item.id)}
                onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                onFavoritePress={() => toggleFavorite(item.id)}
              />
            )}
          />
        </View>

        {/* AI Recommendations */}
        {recommendedRecipes.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.aiHeader}>
                <Ionicons name="sparkles" size={20} color={COLORS.secondary} />
                <Text style={[styles.sectionTitle, { marginLeft: SPACING.xs }]}>
                  Based on Your Groceries
                </Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate('AISearch')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            <FlatList
              data={recommendedRecipes}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.recipeList}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View style={{ marginRight: SPACING.md }}>
                  <RecipeCard
                    recipe={item}
                    variant="grid"
                    isFavorite={isFavorite(item.id)}
                    matchPercentage={item.matchPercentage}
                    onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
                    onFavoritePress={() => toggleFavorite(item.id)}
                  />
                </View>
              )}
            />
          </View>
        )}

        {/* Popular Recipes */}
        <View style={[styles.section, { paddingBottom: insets.bottom + 100 }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Recipes</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Search')}>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          {popularRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              variant="list"
              isFavorite={isFavorite(recipe.id)}
              onPress={() => navigation.navigate('RecipeDetail', { recipe })}
              onFavoritePress={() => toggleFavorite(recipe.id)}
            />
          ))}
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
    paddingBottom: SPACING.xl,
    borderBottomLeftRadius: BORDER_RADIUS.xl,
    borderBottomRightRadius: BORDER_RADIUS.xl,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.lg,
  },
  greeting: {
    fontSize: FONTS.body,
    color: 'rgba(255,255,255,0.8)',
  },
  userName: {
    fontSize: FONTS.h3,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  profileButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.small,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.lg,
    paddingHorizontal: SPACING.md,
    ...SHADOWS.small,
  },
  searchInput: {
    flex: 1,
    paddingVertical: SPACING.md,
    marginLeft: SPACING.sm,
    fontSize: FONTS.body,
    color: COLORS.textPrimary,
  },
  filterButton: {
    padding: SPACING.xs,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    marginTop: -SPACING.lg,
    gap: SPACING.sm,
  },
  quickAction: {
    flex: 1,
    padding: SPACING.md,
    borderRadius: BORDER_RADIUS.lg,
    alignItems: 'center',
    ...SHADOWS.small,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.xs,
  },
  quickActionText: {
    fontSize: FONTS.caption,
    fontWeight: '500',
    color: COLORS.textPrimary,
    textAlign: 'center',
  },
  section: {
    marginTop: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  aiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    paddingHorizontal: SPACING.lg,
    marginBottom: SPACING.md,
  },
  seeAll: {
    fontSize: FONTS.bodySmall,
    color: COLORS.primary,
    fontWeight: '500',
  },
  categoriesContainer: {
    paddingHorizontal: SPACING.lg,
    gap: SPACING.sm,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.white,
    borderWidth: 1,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  categoryChipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  categoryText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.gray600,
    marginLeft: SPACING.xs,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: COLORS.black,
  },
  featuredList: {
    paddingHorizontal: SPACING.lg,
  },
  recipeList: {
    paddingHorizontal: SPACING.lg,
  },
});

export default HomeScreen;
