import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const GroceryItem = ({
  item,
  onToggle,
  onUpdate,
  onDelete,
  categoryInfo,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(item.name);
  const [editedQuantity, setEditedQuantity] = useState(item.quantity.toString());
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handleToggle = () => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
    onToggle(item.id);
  };

  const handleSave = () => {
    onUpdate(item.id, {
      name: editedName,
      quantity: parseInt(editedQuantity) || 1,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(item.name);
    setEditedQuantity(item.quantity.toString());
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <View style={[styles.container, styles.editingContainer]}>
        <TextInput
          style={styles.editInput}
          value={editedName}
          onChangeText={setEditedName}
          placeholder="Item name"
          autoFocus
        />
        <TextInput
          style={styles.quantityInput}
          value={editedQuantity}
          onChangeText={setEditedQuantity}
          keyboardType="numeric"
          placeholder="Qty"
        />
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="checkmark" size={20} color={COLORS.success} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
          <Ionicons name="close" size={20} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <Animated.View
      style={[
        styles.container,
        item.isPurchased && styles.purchasedContainer,
        { transform: [{ scale: scaleAnim }] },
      ]}
    >
      <TouchableOpacity style={styles.checkboxContainer} onPress={handleToggle}>
        <View
          style={[
            styles.checkbox,
            item.isPurchased && styles.checkboxChecked,
            { borderColor: categoryInfo?.color || COLORS.primary },
          ]}
        >
          {item.isPurchased && (
            <Ionicons name="checkmark" size={16} color={COLORS.white} />
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.contentContainer}>
        <View style={styles.nameRow}>
          <Text style={styles.categoryIcon}>{categoryInfo?.icon || '📦'}</Text>
          <Text
            style={[
              styles.itemName,
              item.isPurchased && styles.purchasedText,
            ]}
            numberOfLines={1}
          >
            {item.name}
          </Text>
        </View>
        <Text style={styles.quantity}>
          Qty: {item.quantity} {item.unit}
        </Text>
      </View>

      <View style={styles.actionsContainer}>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => setIsEditing(true)}
        >
          <Ionicons name="pencil" size={18} color={COLORS.gray500} />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => onDelete(item.id)}
        >
          <Ionicons name="trash-outline" size={18} color={COLORS.error} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  purchasedContainer: {
    backgroundColor: COLORS.gray100,
    opacity: 0.8,
  },
  editingContainer: {
    padding: SPACING.sm,
  },
  checkboxContainer: {
    marginRight: SPACING.md,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: BORDER_RADIUS.sm,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: COLORS.success,
    borderColor: COLORS.success,
  },
  contentContainer: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryIcon: {
    fontSize: 16,
    marginRight: SPACING.xs,
  },
  itemName: {
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.textPrimary,
    flex: 1,
  },
  purchasedText: {
    textDecorationLine: 'line-through',
    color: COLORS.gray500,
  },
  quantity: {
    fontSize: FONTS.caption,
    color: COLORS.gray600,
    marginTop: 2,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: SPACING.xs,
    marginLeft: SPACING.xs,
  },
  editInput: {
    flex: 1,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    fontSize: FONTS.body,
    marginRight: SPACING.sm,
  },
  quantityInput: {
    width: 60,
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.sm,
    paddingHorizontal: SPACING.sm,
    paddingVertical: SPACING.xs,
    fontSize: FONTS.body,
    textAlign: 'center',
    marginRight: SPACING.sm,
  },
  saveButton: {
    padding: SPACING.xs,
  },
  cancelButton: {
    padding: SPACING.xs,
  },
});

export default GroceryItem;
