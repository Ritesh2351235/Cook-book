import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const GroceryContext = createContext({});

export const useGrocery = () => useContext(GroceryContext);

const GROCERY_CATEGORIES = {
  produce: { name: 'Produce', icon: '🥬', color: '#4CAF50' },
  dairy: { name: 'Dairy', icon: '🥛', color: '#2196F3' },
  meat: { name: 'Meat & Seafood', icon: '🥩', color: '#F44336' },
  bakery: { name: 'Bakery', icon: '🍞', color: '#795548' },
  pantry: { name: 'Pantry', icon: '🥫', color: '#FF9800' },
  frozen: { name: 'Frozen', icon: '🧊', color: '#00BCD4' },
  beverages: { name: 'Beverages', icon: '🥤', color: '#9C27B0' },
  snacks: { name: 'Snacks', icon: '🍿', color: '#FFEB3B' },
  other: { name: 'Other', icon: '📦', color: '#607D8B' },
};

const categorizeItem = (itemName) => {
  const name = itemName.toLowerCase();

  const produceKeywords = ['apple', 'banana', 'orange', 'tomato', 'lettuce', 'carrot', 'onion', 'potato', 'garlic', 'pepper', 'cucumber', 'spinach', 'broccoli', 'lemon', 'lime', 'avocado', 'mushroom', 'celery', 'cabbage', 'corn', 'beans', 'peas'];
  const dairyKeywords = ['milk', 'cheese', 'yogurt', 'butter', 'cream', 'egg', 'sour cream', 'cottage'];
  const meatKeywords = ['chicken', 'beef', 'pork', 'fish', 'salmon', 'tuna', 'shrimp', 'bacon', 'sausage', 'turkey', 'lamb', 'steak', 'ground'];
  const bakeryKeywords = ['bread', 'bagel', 'muffin', 'croissant', 'roll', 'bun', 'cake', 'pie', 'pastry', 'tortilla'];
  const pantryKeywords = ['rice', 'pasta', 'flour', 'sugar', 'salt', 'oil', 'vinegar', 'sauce', 'canned', 'beans', 'soup', 'cereal', 'oatmeal', 'honey', 'spice'];
  const frozenKeywords = ['frozen', 'ice cream', 'pizza', 'fries', 'nuggets'];
  const beverageKeywords = ['water', 'juice', 'soda', 'coffee', 'tea', 'wine', 'beer', 'drink'];
  const snackKeywords = ['chips', 'crackers', 'cookies', 'candy', 'chocolate', 'popcorn', 'nuts', 'granola'];

  if (produceKeywords.some(k => name.includes(k))) return 'produce';
  if (dairyKeywords.some(k => name.includes(k))) return 'dairy';
  if (meatKeywords.some(k => name.includes(k))) return 'meat';
  if (bakeryKeywords.some(k => name.includes(k))) return 'bakery';
  if (pantryKeywords.some(k => name.includes(k))) return 'pantry';
  if (frozenKeywords.some(k => name.includes(k))) return 'frozen';
  if (beverageKeywords.some(k => name.includes(k))) return 'beverages';
  if (snackKeywords.some(k => name.includes(k))) return 'snacks';

  return 'other';
};

export const GroceryProvider = ({ children }) => {
  const [groceryList, setGroceryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadGroceryList();
  }, []);

  const loadGroceryList = async () => {
    try {
      const data = await SecureStore.getItemAsync('groceryList');
      if (data) {
        setGroceryList(JSON.parse(data));
      }
    } catch (error) {
      console.log('Error loading grocery list:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveGroceryList = async (list) => {
    try {
      await SecureStore.setItemAsync('groceryList', JSON.stringify(list));
    } catch (error) {
      console.log('Error saving grocery list:', error);
    }
  };

  const addItem = async (name, quantity = 1, unit = '') => {
    const category = categorizeItem(name);
    const newItem = {
      id: Date.now().toString(),
      name: name.trim(),
      quantity,
      unit,
      category,
      isPurchased: false,
      addedAt: new Date().toISOString(),
    };

    const updatedList = [...groceryList, newItem];
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
    return newItem;
  };

  const addMultipleItems = async (items) => {
    const newItems = items.map((item, index) => ({
      id: (Date.now() + index).toString(),
      name: typeof item === 'string' ? item.trim() : item.name.trim(),
      quantity: typeof item === 'string' ? 1 : (item.quantity || 1),
      unit: typeof item === 'string' ? '' : (item.unit || ''),
      category: categorizeItem(typeof item === 'string' ? item : item.name),
      isPurchased: false,
      addedAt: new Date().toISOString(),
    }));

    const updatedList = [...groceryList, ...newItems];
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
    return newItems;
  };

  const updateItem = async (id, updates) => {
    const updatedList = groceryList.map(item =>
      item.id === id ? { ...item, ...updates } : item
    );
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  const togglePurchased = async (id) => {
    const updatedList = groceryList.map(item =>
      item.id === id ? { ...item, isPurchased: !item.isPurchased } : item
    );
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  const removeItem = async (id) => {
    const updatedList = groceryList.filter(item => item.id !== id);
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  const clearPurchased = async () => {
    const updatedList = groceryList.filter(item => !item.isPurchased);
    setGroceryList(updatedList);
    await saveGroceryList(updatedList);
  };

  const clearAll = async () => {
    setGroceryList([]);
    await saveGroceryList([]);
  };

  const getGroupedByCategory = () => {
    const grouped = {};
    groceryList.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = {
          ...GROCERY_CATEGORIES[item.category],
          items: [],
        };
      }
      grouped[item.category].items.push(item);
    });
    return grouped;
  };

  const getAvailableIngredients = () => {
    return groceryList
      .filter(item => !item.isPurchased)
      .map(item => item.name);
  };

  return (
    <GroceryContext.Provider
      value={{
        groceryList,
        isLoading,
        addItem,
        addMultipleItems,
        updateItem,
        togglePurchased,
        removeItem,
        clearPurchased,
        clearAll,
        getGroupedByCategory,
        getAvailableIngredients,
        categories: GROCERY_CATEGORIES,
      }}
    >
      {children}
    </GroceryContext.Provider>
  );
};

export default GroceryContext;
