import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { RecipeCard, Button } from '../components';
import { useRecipes } from '../context/RecipeContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

const FavoritesScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { getFavoriteRecipes, isFavorite, toggleFavorite } = useRecipes();

  const favoriteRecipes = getFavoriteRecipes();

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.error, '#C62828']}
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
            <Ionicons name="heart" size={24} color={COLORS.white} />
            <Text style={styles.headerTitle}>My Favorites</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>
        <Text style={styles.headerSubtitle}>
          {favoriteRecipes.length} saved recipes
        </Text>
      </LinearGradient>

      {/* Content */}
      {favoriteRecipes.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="heart-outline" size={80} color={COLORS.gray300} />
          </View>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptyText}>
            Save your favorite recipes to access them quickly
          </Text>
          <Button
            title="Explore Recipes"
            onPress={() => navigation.navigate('Home')}
            style={{ marginTop: SPACING.lg }}
          />
        </View>
      ) : (
        <FlatList
          data={favoriteRecipes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + SPACING.xl },
          ]}
          renderItem={({ item }) => (
            <RecipeCard
              recipe={item}
              variant="list"
              isFavorite={isFavorite(item.id)}
              onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
              onFavoritePress={() => toggleFavorite(item.id)}
            />
          )}
        />
      )}
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
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  emptyIconContainer: {
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.lg,
  },
  emptyTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginBottom: SPACING.sm,
  },
  emptyText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  listContent: {
    padding: SPACING.lg,
  },
});

export default FavoritesScreen;
