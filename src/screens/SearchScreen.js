import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { RecipeCard } from '../components';
import { useRecipes } from '../context/RecipeContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const SearchScreen = ({ navigation, route }) => {
  const insets = useSafeAreaInsets();
  const { recipes, searchRecipes, filterRecipes, isFavorite, toggleFavorite, getCategories, getCuisines } = useRecipes();

  const [searchQuery, setSearchQuery] = useState(route.params?.query || '');
  const [results, setResults] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    cuisine: null,
    difficulty: null,
    maxTime: null,
  });

  const categories = getCategories();
  const cuisines = getCuisines();
  const difficulties = ['Easy', 'Medium', 'Hard'];
  const timeOptions = [
    { label: '< 15 min', value: 15 },
    { label: '< 30 min', value: 30 },
    { label: '< 60 min', value: 60 },
  ];

  useEffect(() => {
    handleSearch();
  }, [searchQuery, filters]);

  const handleSearch = () => {
    let filtered = searchQuery
      ? searchRecipes(searchQuery)
      : [...recipes];

    if (filters.cuisine) {
      filtered = filtered.filter(r => r.cuisine === filters.cuisine);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }
    if (filters.maxTime) {
      filtered = filtered.filter(r => (r.prepTime + r.cookTime) <= filters.maxTime);
    }

    setResults(filtered);
  };

  const clearFilters = () => {
    setFilters({ cuisine: null, difficulty: null, maxTime: null });
  };

  const hasActiveFilters = filters.cuisine || filters.difficulty || filters.maxTime;

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Search Header */}
      <View style={styles.searchHeader}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <View style={styles.searchInputContainer}>
          <Ionicons name="search" size={20} color={COLORS.gray500} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search recipes..."
            placeholderTextColor={COLORS.gray400}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoFocus
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={20} color={COLORS.gray400} />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, hasActiveFilters && styles.filterButtonActive]}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Ionicons
            name="options"
            size={22}
            color={hasActiveFilters ? COLORS.white : COLORS.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Filters Panel */}
      {showFilters && (
        <View style={styles.filtersPanel}>
          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Cuisine</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterChips}>
                {cuisines.map((cuisine) => (
                  <TouchableOpacity
                    key={cuisine}
                    style={[
                      styles.filterChip,
                      filters.cuisine === cuisine && styles.filterChipActive,
                    ]}
                    onPress={() =>
                      setFilters(prev => ({
                        ...prev,
                        cuisine: prev.cuisine === cuisine ? null : cuisine,
                      }))
                    }
                  >
                    <Text
                      style={[
                        styles.filterChipText,
                        filters.cuisine === cuisine && styles.filterChipTextActive,
                      ]}
                    >
                      {cuisine}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Difficulty</Text>
            <View style={styles.filterChips}>
              {difficulties.map((difficulty) => (
                <TouchableOpacity
                  key={difficulty}
                  style={[
                    styles.filterChip,
                    filters.difficulty === difficulty && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setFilters(prev => ({
                      ...prev,
                      difficulty: prev.difficulty === difficulty ? null : difficulty,
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.difficulty === difficulty && styles.filterChipTextActive,
                    ]}
                  >
                    {difficulty}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.filterSection}>
            <Text style={styles.filterLabel}>Time</Text>
            <View style={styles.filterChips}>
              {timeOptions.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  style={[
                    styles.filterChip,
                    filters.maxTime === option.value && styles.filterChipActive,
                  ]}
                  onPress={() =>
                    setFilters(prev => ({
                      ...prev,
                      maxTime: prev.maxTime === option.value ? null : option.value,
                    }))
                  }
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      filters.maxTime === option.value && styles.filterChipTextActive,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {hasActiveFilters && (
            <TouchableOpacity style={styles.clearFilters} onPress={clearFilters}>
              <Ionicons name="close" size={16} color={COLORS.error} />
              <Text style={styles.clearFiltersText}>Clear All Filters</Text>
            </TouchableOpacity>
          )}
        </View>
      )}

      {/* Results */}
      <View style={styles.resultsHeader}>
        <Text style={styles.resultsCount}>
          {results.length} recipe{results.length !== 1 ? 's' : ''} found
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={[
          styles.resultsGrid,
          { paddingBottom: insets.bottom + SPACING.xl },
        ]}
        columnWrapperStyle={styles.columnWrapper}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={60} color={COLORS.gray300} />
            <Text style={styles.emptyTitle}>No recipes found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your search or filters
            </Text>
          </View>
        )}
        renderItem={({ item }) => (
          <RecipeCard
            recipe={item}
            variant="grid"
            isFavorite={isFavorite(item.id)}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: item })}
            onFavoritePress={() => toggleFavorite(item.id)}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    marginHorizontal: SPACING.sm,
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
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterButtonActive: {
    backgroundColor: COLORS.primary,
  },
  filtersPanel: {
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
    paddingVertical: SPACING.md,
  },
  filterSection: {
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.md,
  },
  filterLabel: {
    fontSize: FONTS.bodySmall,
    fontWeight: '600',
    color: COLORS.textSecondary,
    marginBottom: SPACING.sm,
  },
  filterChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
  },
  filterChip: {
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm,
    borderRadius: BORDER_RADIUS.full,
    backgroundColor: COLORS.gray100,
    marginRight: SPACING.sm,
  },
  filterChipActive: {
    backgroundColor: COLORS.primary,
  },
  filterChipText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  filterChipTextActive: {
    color: COLORS.black,
  },
  clearFilters: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.sm,
  },
  clearFiltersText: {
    fontSize: FONTS.bodySmall,
    color: COLORS.error,
    marginLeft: SPACING.xs,
  },
  resultsHeader: {
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  resultsCount: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
  },
  resultsGrid: {
    paddingHorizontal: SPACING.lg,
  },
  columnWrapper: {
    justifyContent: 'space-between',
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl * 2,
  },
  emptyTitle: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  emptyText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
});

export default SearchScreen;
