import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  ScrollView,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../components';
import { useGrocery } from '../context/GroceryContext';
import { COLORS, FONTS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

// Simulated AI grocery recognition
const simulateGroceryRecognition = () => {
  const possibleItems = [
    'Tomatoes', 'Onions', 'Garlic', 'Chicken Breast', 'Ground Beef',
    'Pasta', 'Rice', 'Olive Oil', 'Eggs', 'Milk', 'Cheese', 'Bread',
    'Butter', 'Carrots', 'Broccoli', 'Bell Peppers', 'Potatoes',
    'Bananas', 'Apples', 'Oranges', 'Lettuce', 'Spinach', 'Mushrooms',
    'Soy Sauce', 'Honey', 'Salt', 'Black Pepper', 'Flour', 'Sugar',
  ];

  // Randomly select 3-6 items
  const count = Math.floor(Math.random() * 4) + 3;
  const shuffled = [...possibleItems].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const ScannerScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();
  const { addMultipleItems } = useGrocery();
  const [permission, requestPermission] = useCameraPermissions();
  const [isScanning, setIsScanning] = useState(false);
  const [scannedItems, setScannedItems] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const cameraRef = useRef(null);

  const hasPermission = permission?.granted;

  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  const handleCapture = async () => {
    setIsScanning(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate recognized items
    const items = simulateGroceryRecognition();
    setScannedItems(items.map((name, index) => ({
      id: index.toString(),
      name,
      quantity: 1,
      selected: true,
    })));
    setIsScanning(false);
    setShowResults(true);
  };

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setIsScanning(true);
      await new Promise(resolve => setTimeout(resolve, 2000));
      const items = simulateGroceryRecognition();
      setScannedItems(items.map((name, index) => ({
        id: index.toString(),
        name,
        quantity: 1,
        selected: true,
      })));
      setIsScanning(false);
      setShowResults(true);
    }
  };

  const toggleItemSelection = (id) => {
    setScannedItems(prev =>
      prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      )
    );
  };

  const updateItemQuantity = (id, delta) => {
    setScannedItems(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleAddManualItem = () => {
    if (manualInput.trim()) {
      setScannedItems(prev => [
        ...prev,
        {
          id: Date.now().toString(),
          name: manualInput.trim(),
          quantity: 1,
          selected: true,
        },
      ]);
      setManualInput('');
    }
  };

  const handleAddToGroceryList = async () => {
    const selectedItems = scannedItems.filter(item => item.selected);
    if (selectedItems.length === 0) {
      Alert.alert('No Items Selected', 'Please select at least one item to add.');
      return;
    }

    await addMultipleItems(
      selectedItems.map(item => ({
        name: item.name,
        quantity: item.quantity,
      }))
    );

    Alert.alert(
      'Items Added!',
      `${selectedItems.length} item(s) have been added to your grocery list.`,
      [
        {
          text: 'View List',
          onPress: () => navigation.navigate('GroceryList'),
        },
        {
          text: 'Scan More',
          onPress: () => {
            setScannedItems([]);
            setShowResults(false);
          },
        },
      ]
    );
  };

  if (!hasPermission) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={80} color={COLORS.gray400} />
        <Text style={styles.permissionTitle}>Camera Access Required</Text>
        <Text style={styles.permissionText}>
          We need camera access to scan your groceries and create shopping lists.
        </Text>
        <Button
          title="Grant Permission"
          onPress={requestPermission}
          style={{ marginTop: SPACING.lg }}
        />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!showResults ? (
        // Camera View
        <View style={styles.cameraContainer}>
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing="back"
          >
            {/* Header */}
            <LinearGradient
              colors={['rgba(0,0,0,0.6)', 'transparent']}
              style={[styles.header, { paddingTop: insets.top }]}
            >
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => navigation.goBack()}
              >
                <Ionicons name="close" size={28} color={COLORS.white} />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>Scan Groceries</Text>
              <View style={{ width: 40 }} />
            </LinearGradient>

            {/* Scan Frame */}
            <View style={styles.scanFrame}>
              <View style={[styles.corner, styles.topLeft]} />
              <View style={[styles.corner, styles.topRight]} />
              <View style={[styles.corner, styles.bottomLeft]} />
              <View style={[styles.corner, styles.bottomRight]} />
            </View>

            {/* Instructions */}
            <View style={styles.instructionBox}>
              <Text style={styles.instructionText}>
                Point camera at groceries, receipt, or product labels
              </Text>
            </View>

            {/* Loading Overlay */}
            {isScanning && (
              <View style={styles.loadingOverlay}>
                <View style={styles.loadingBox}>
                  <ActivityIndicator size="large" color={COLORS.primary} />
                  <Text style={styles.loadingText}>Analyzing image...</Text>
                  <Text style={styles.loadingSubtext}>
                    AI is identifying your groceries
                  </Text>
                </View>
              </View>
            )}

            {/* Bottom Controls */}
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.8)']}
              style={[styles.controls, { paddingBottom: insets.bottom + SPACING.lg }]}
            >
              <TouchableOpacity
                style={styles.galleryButton}
                onPress={handlePickImage}
              >
                <Ionicons name="images" size={28} color={COLORS.white} />
                <Text style={styles.controlLabel}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.captureButton}
                onPress={handleCapture}
                disabled={isScanning}
              >
                <View style={styles.captureButtonInner}>
                  <Ionicons name="scan" size={32} color={COLORS.primary} />
                </View>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.manualButton}
                onPress={() => setShowResults(true)}
              >
                <Ionicons name="create" size={28} color={COLORS.white} />
                <Text style={styles.controlLabel}>Manual</Text>
              </TouchableOpacity>
            </LinearGradient>
          </CameraView>
        </View>
      ) : (
        // Results View
        <View style={[styles.resultsContainer, { paddingTop: insets.top }]}>
          <View style={styles.resultsHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => {
                setShowResults(false);
                setScannedItems([]);
              }}
            >
              <Ionicons name="arrow-back" size={24} color={COLORS.textPrimary} />
            </TouchableOpacity>
            <Text style={styles.resultsTitle}>Scanned Items</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView
            style={styles.resultsList}
            contentContainerStyle={styles.resultsContent}
          >
            {scannedItems.length > 0 ? (
              <>
                <Text style={styles.resultsSubtitle}>
                  {scannedItems.filter(i => i.selected).length} of {scannedItems.length} items selected
                </Text>

                {scannedItems.map((item) => (
                  <TouchableOpacity
                    key={item.id}
                    style={[
                      styles.itemCard,
                      !item.selected && styles.itemCardUnselected,
                    ]}
                    onPress={() => toggleItemSelection(item.id)}
                  >
                    <View
                      style={[
                        styles.itemCheckbox,
                        item.selected && styles.itemCheckboxSelected,
                      ]}
                    >
                      {item.selected && (
                        <Ionicons name="checkmark" size={16} color={COLORS.white} />
                      )}
                    </View>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <View style={styles.quantityControl}>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateItemQuantity(item.id, -1)}
                      >
                        <Ionicons name="remove" size={18} color={COLORS.gray600} />
                      </TouchableOpacity>
                      <Text style={styles.quantityText}>{item.quantity}</Text>
                      <TouchableOpacity
                        style={styles.quantityButton}
                        onPress={() => updateItemQuantity(item.id, 1)}
                      >
                        <Ionicons name="add" size={18} color={COLORS.gray600} />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              <View style={styles.emptyState}>
                <Ionicons name="scan-outline" size={60} color={COLORS.gray300} />
                <Text style={styles.emptyTitle}>No items yet</Text>
                <Text style={styles.emptyText}>
                  Scan groceries or add items manually below
                </Text>
              </View>
            )}

            {/* Manual Input */}
            <View style={styles.manualInputContainer}>
              <TextInput
                style={styles.manualInputField}
                placeholder="Add item manually..."
                placeholderTextColor={COLORS.gray400}
                value={manualInput}
                onChangeText={setManualInput}
                onSubmitEditing={handleAddManualItem}
              />
              <TouchableOpacity
                style={styles.addItemButton}
                onPress={handleAddManualItem}
              >
                <Ionicons name="add" size={24} color={COLORS.white} />
              </TouchableOpacity>
            </View>
          </ScrollView>

          <View style={[styles.resultsFooter, { paddingBottom: insets.bottom + SPACING.md }]}>
            <Button
              title="Scan More"
              variant="outline"
              onPress={() => {
                setShowResults(false);
              }}
              style={{ flex: 1, marginRight: SPACING.sm }}
            />
            <Button
              title="Add to List"
              onPress={handleAddToGroceryList}
              style={{ flex: 1, marginLeft: SPACING.sm }}
              icon={<Ionicons name="cart" size={20} color={COLORS.black} />}
            />
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.black,
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SPACING.xl,
  },
  permissionTitle: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
    marginTop: SPACING.lg,
  },
  permissionText: {
    fontSize: FONTS.body,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginTop: SPACING.sm,
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.lg,
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.white,
  },
  scanFrame: {
    position: 'absolute',
    top: '25%',
    left: '10%',
    right: '10%',
    height: '35%',
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: COLORS.primary,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderTopLeftRadius: 12,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderTopRightRadius: 12,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderBottomLeftRadius: 12,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderBottomRightRadius: 12,
  },
  instructionBox: {
    position: 'absolute',
    top: '62%',
    left: '10%',
    right: '10%',
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
  },
  instructionText: {
    fontSize: FONTS.body,
    color: COLORS.white,
    textAlign: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingBox: {
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.xl,
    alignItems: 'center',
    width: width * 0.7,
  },
  loadingText: {
    fontSize: FONTS.h5,
    fontWeight: '600',
    color: COLORS.textPrimary,
    marginTop: SPACING.md,
  },
  loadingSubtext: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginTop: SPACING.xs,
  },
  controls: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingTop: SPACING.xl,
  },
  galleryButton: {
    alignItems: 'center',
  },
  manualButton: {
    alignItems: 'center',
  },
  controlLabel: {
    fontSize: FONTS.caption,
    color: COLORS.white,
    marginTop: SPACING.xs,
  },
  captureButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: COLORS.primary,
  },
  captureButtonInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.primarySoft,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  resultsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsTitle: {
    fontSize: FONTS.h5,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  resultsList: {
    flex: 1,
  },
  resultsContent: {
    padding: SPACING.lg,
  },
  resultsSubtitle: {
    fontSize: FONTS.bodySmall,
    color: COLORS.textSecondary,
    marginBottom: SPACING.md,
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    ...SHADOWS.small,
  },
  itemCardUnselected: {
    opacity: 0.5,
    backgroundColor: COLORS.gray100,
  },
  itemCheckbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  itemCheckboxSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  itemName: {
    flex: 1,
    fontSize: FONTS.body,
    fontWeight: '500',
    color: COLORS.textPrimary,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: BORDER_RADIUS.sm,
    padding: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityText: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.textPrimary,
    minWidth: 24,
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: SPACING.xxl,
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
    textAlign: 'center',
    marginTop: SPACING.xs,
  },
  manualInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SPACING.lg,
  },
  manualInputField: {
    flex: 1,
    backgroundColor: COLORS.white,
    borderRadius: BORDER_RADIUS.md,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.md,
    fontSize: FONTS.body,
    borderWidth: 2,
    borderColor: COLORS.gray200,
    marginRight: SPACING.sm,
  },
  addItemButton: {
    width: 48,
    height: 48,
    borderRadius: BORDER_RADIUS.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resultsFooter: {
    flexDirection: 'row',
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.md,
    borderTopWidth: 1,
    borderTopColor: COLORS.gray200,
    backgroundColor: COLORS.white,
  },
});

export default ScannerScreen;
