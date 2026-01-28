import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet } from 'react-native';

import { useAuth } from '../context/AuthContext';
import {
  WelcomeScreen,
  LoginScreen,
  SignUpScreen,
  HomeScreen,
  ScannerScreen,
  GroceryListScreen,
  AISearchScreen,
  RecipeDetailScreen,
  FavoritesScreen,
  ProfileScreen,
  SearchScreen,
} from '../screens';
import { COLORS, SPACING, BORDER_RADIUS, SHADOWS } from '../constants/theme';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={WelcomeScreen} />
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="SignUp" component={SignUpScreen} />
  </Stack.Navigator>
);

const TabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: false,
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;

        switch (route.name) {
          case 'Home':
            iconName = focused ? 'home' : 'home-outline';
            break;
          case 'GroceryList':
            iconName = focused ? 'cart' : 'cart-outline';
            break;
          case 'ScanTab':
            iconName = 'scan';
            break;
          case 'Favorites':
            iconName = focused ? 'heart' : 'heart-outline';
            break;
          case 'Profile':
            iconName = focused ? 'person' : 'person-outline';
            break;
          default:
            iconName = 'ellipse';
        }

        if (route.name === 'ScanTab') {
          return (
            <View style={styles.scanButton}>
              <Ionicons name={iconName} size={28} color={COLORS.black} />
            </View>
          );
        }

        return <Ionicons name={iconName} size={24} color={color} />;
      },
      tabBarActiveTintColor: COLORS.primary,
      tabBarInactiveTintColor: COLORS.gray500,
      tabBarStyle: styles.tabBar,
      tabBarLabelStyle: styles.tabBarLabel,
      tabBarItemStyle: styles.tabBarItem,
    })}
  >
    <Tab.Screen
      name="Home"
      component={HomeScreen}
      options={{ tabBarLabel: 'Home' }}
    />
    <Tab.Screen
      name="GroceryList"
      component={GroceryListScreen}
      options={{ tabBarLabel: 'Groceries' }}
    />
    <Tab.Screen
      name="ScanTab"
      component={ScannerScreen}
      options={{
        tabBarLabel: '',
        tabBarItemStyle: { top: -15 },
      }}
    />
    <Tab.Screen
      name="Favorites"
      component={FavoritesScreen}
      options={{ tabBarLabel: 'Favorites' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ tabBarLabel: 'Profile' }}
    />
  </Tab.Navigator>
);

const MainStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="MainTabs" component={TabNavigator} />
    <Stack.Screen name="Scanner" component={ScannerScreen} />
    <Stack.Screen name="AISearch" component={AISearchScreen} />
    <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
  </Stack.Navigator>
);

const AppNavigator = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NavigationContainer>
      {isAuthenticated ? <MainStack /> : <AuthStack />}
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    backgroundColor: COLORS.white,
    borderTopWidth: 0,
    height: 70,
    borderTopLeftRadius: BORDER_RADIUS.xl,
    borderTopRightRadius: BORDER_RADIUS.xl,
    ...SHADOWS.large,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.sm,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '500',
    marginBottom: SPACING.xs,
  },
  tabBarItem: {
    paddingTop: SPACING.xs,
  },
  scanButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...SHADOWS.large,
  },
});

export default AppNavigator;
