import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  SectionList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GroceryItem, Button } from '../components';
import { useGrocery } from '../context/GroceryContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const GroceryListScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const {
    groceryList,
    addItem,
    updateItem,
    togglePurchased,
    removeItem,
    clearPurchased,
    clearAll,
    getGroupedByCategory,
    categories,
  } = useGrocery();

  const [newItemName, setNewItemName] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const groupedItems = getGroupedByCategory();
  const totalItems = groceryList.length;
  const purchasedItems = groceryList.filter(item => item.isPurchased).length;
  const progress = totalItems > 0 ? (purchasedItems / totalItems) * 100 : 0;

  const handleAddItem = async () => {
    if (newItemName.trim()) {
      await addItem(newItemName);
      setNewItemName('');
      setShowAddForm(false);
    }
  };

  const handleClearPurchased = () => {
    if (purchasedItems === 0) return;

    Alert.alert(
      'Clear Purchased Items',
      'Are you sure you want to remove all purchased items?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearPurchased },
      ]
    );
  };

  const handleClearAll = () => {
    if (totalItems === 0) return;

    Alert.alert(
      'Clear All Items',
      'Are you sure you want to clear your entire grocery list?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear All', style: 'destructive', onPress: clearAll },
      ]
    );
  };

  const sections = Object.entries(groupedItems).map(([key, value]) => ({
    title: value.name,
    icon: value.icon,
    color: value.color,
    data: value.items,
  }));

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.accent, COLORS.accentLight]}
        style={[styles.header, { paddingTop: insets.top + SPACING.md }]}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Grocery List</Text>
          <TouchableOpacity
            style={styles.menuButton}
            onPress={() =>
              Alert.alert('Options', '', [
                { text: 'Clear Purchased', onPress: handleClearPurchased },
                { text: 'Clear All', onPress: handleClearAll, style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
              ])
            }
          >
            <Ionicons name="ellipsis-vertical" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              {purchasedItems} of {totalItems} items
            </Text>
            <Text style={styles.progressPercent}>{Math.round(progress)}%</Text>
          </View>
          <View style={styles.progressBar}>
            <View
              style={[styles.progressFill, { width: `${progress}%` }]}
            />
          </View>
        </View>
      </LinearGradient>

      {/* Content */}
      {totalItems === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconContainer}>
            <Ionicons name="cart-outline" size={80} color={COLORS.gray300} />
          </View>
          <Text style={styles.emptyTitle}>Your list is empty</Text>
          <Text style={styles.emptyText}>
            Scan groceries or add items manually to get started
          </Text>
          <View style={styles.emptyActions}>
            <Button
              title="Scan Groceries"
              onPress={() => navigation.navigate('Scanner')}
              icon={<Ionicons name="camera" size={20} color={COLORS.black} />}
              style={{ marginBottom: SPACING.md }}
            />
            <Button
              title="Add Manually"
              variant="outline"
              onPress={() => setShowAddForm(true)}
              icon={<Ionicons name="add" size={20} color={COLORS.primary} />}
            />
          </View>
        </View>
      ) : (
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[
            styles.listContent,
            { paddingBottom: insets.bottom + 100 },
          ]}
          renderSectionHeader={({ section }) => (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionIcon}>{section.icon}</Text>
              <Text style={styles.sectionTitle}>{section.title}</Text>
              <View
                style={[
                  styles.sectionBadge,
                  { backgroundColor: section.color + '20' },
                ]}
              >
                <Text style={[styles.sectionBadgeText, { color: section.color }]}>
                  {section.data.length}
                </Text>
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <GroceryItem
              item={item}
              onToggle={togglePurchased}
              onUpdate={updateItem}
              onDelete={removeItem}
              categoryInfo={categories[item.category]}
            />
          )}
          stickySectionHeadersEnabled={false}
        />
      )}

      {/* Add Item Form */}
      {showAddForm && (
        <View style={[styles.addForm, { paddingBottom: insets.bottom + SPACING.md }]}>
          <View style={styles.addFormHeader}>
            <Text style={styles.addFormTitle}>Add Item</Text>
            <TouchableOpacity onPress={() => setShowAddForm(false)}>
              <Ionicons name="close" size={24} color={COLORS.gray600} />
            </TouchableOpacity>
          </View>
          <View style={styles.addFormInput}>
            <TextInput
              style={styles.textInput}
              placeholder="Enter item name..."
              placeholderTextColor={COLORS.gray400}
              value={newItemName}
              onChangeText={setNewItemName}
              autoFocus
              onSubmitEditing={handleAddItem}
            />
            <TouchableOpacity
              style={[
                styles.addButton,
                !newItemName.trim() && styles.addButtonDisabled,
              ]}
              onPress={handleAddItem}
              disabled={!newItemName.trim()}
            >
              <Ionicons name="add" size={24} color={COLORS.white} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Floating Action Buttons */}
      {totalItems > 0 && !showAddForm && (
        <View style={[styles.fab, { bottom: insets.bottom + SPACING.lg }]}>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => navigation.navigate('Scanner')}
          >
            <Ionicons name="camera" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.fabButton, styles.fabButtonPrimary]}
            onPress={() => setShowAddForm(true)}
          >
            <Ionicons name="add" size={28} color={COLORS.black} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.fabButton}
            onPress={() => navigation.navigate('AISearch')}
          >
            <Ionicons name="sparkles" size={24} color={COLORS.white} />
          </TouchableOpacity>
        </View>
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
    marginBottom: SPACING.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  progressContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: SPACING.sm,
  },
  progressText: {
    fontSize: FONTS.body,
    color: COLORS.white,
  },
  progressPercent: {
    fontSize: FONTS.body,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255,255,255,0.3)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: COLORS.white,
    borderRadius: 4,
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
    marginBottom: SPACING.xl,
  },
  emptyActions: {
    width: '100%',
  },
  listContent: {
    padding: SPACING.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.md,
    marginBottom: SPACING.sm,
  },
  sectionIcon: {
    fontSize: 20,
    marginRight: SPACING.xs,
  },
  sectionTitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    flex: 1,
  },
  sectionBadge: {
    paddingHorizontal: SPACING.sm,
    paddingVertical: 2,
    borderRadius: BORDER_RADIUS.sm,
  },
  sectionBadgeText: {
    fontSize: FONTS.caption,
    fontWeight: '600',
  },
  addForm: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
    ...SHADOWS.large,
  },
  addFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  addFormTitle: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  addFormInput: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInput: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.body,
    marginRight: SPACING.sm,
  },
  addButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addButtonDisabled: {
    backgroundColor: COLORS.gray300,
  },
  fab: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SPACING.md,
  },
  fabButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.gray700,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.medium,
  },
  fabButtonPrimary: {
    backgroundColor: COLORS.primary,
    width: 64,
    height: 64,
    borderRadius: 32,
  },
});

export default GroceryListScreen;
