import React, { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';

const RecipeContext = createContext({});

export const useRecipes = () => useContext(RecipeContext);

// Sample recipe database
const SAMPLE_RECIPES = [
  {
    id: '1',
    title: 'Classic Spaghetti Carbonara',
    description: 'A creamy Italian pasta dish made with eggs, cheese, and crispy bacon.',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400',
    cookTime: 25,
    prepTime: 10,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Italian',
    category: 'Main Course',
    calories: 450,
    rating: 4.8,
    reviews: 234,
    ingredients: [
      { name: 'Spaghetti', amount: '400g' },
      { name: 'Bacon', amount: '200g' },
      { name: 'Eggs', amount: '4' },
      { name: 'Parmesan cheese', amount: '100g' },
      { name: 'Garlic', amount: '2 cloves' },
      { name: 'Black pepper', amount: 'to taste' },
      { name: 'Salt', amount: 'to taste' },
    ],
    instructions: [
      'Cook spaghetti in salted boiling water until al dente.',
      'While pasta cooks, fry bacon until crispy. Add minced garlic.',
      'Beat eggs with grated Parmesan and pepper in a bowl.',
      'Drain pasta, reserving 1 cup pasta water.',
      'Add hot pasta to bacon pan, remove from heat.',
      'Quickly stir in egg mixture, tossing constantly.',
      'Add pasta water as needed for creamy consistency.',
      'Serve immediately with extra Parmesan and pepper.',
    ],
    tags: ['pasta', 'italian', 'quick', 'creamy'],
  },
  {
    id: '2',
    title: 'Honey Garlic Chicken',
    description: 'Sweet and savory chicken thighs glazed with honey and garlic.',
    image: 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400',
    cookTime: 35,
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Main Course',
    calories: 380,
    rating: 4.7,
    reviews: 189,
    ingredients: [
      { name: 'Chicken thighs', amount: '8 pieces' },
      { name: 'Honey', amount: '1/3 cup' },
      { name: 'Garlic', amount: '6 cloves' },
      { name: 'Soy sauce', amount: '1/4 cup' },
      { name: 'Olive oil', amount: '2 tbsp' },
      { name: 'Rice vinegar', amount: '2 tbsp' },
      { name: 'Green onions', amount: '2 stalks' },
    ],
    instructions: [
      'Season chicken with salt and pepper.',
      'Heat oil in a large skillet over medium-high heat.',
      'Brown chicken on both sides, about 4 minutes per side.',
      'Mix honey, soy sauce, garlic, and vinegar in a bowl.',
      'Pour sauce over chicken, reduce heat to medium.',
      'Cover and cook 20-25 minutes until chicken is done.',
      'Garnish with sliced green onions.',
    ],
    tags: ['chicken', 'sweet', 'easy', 'dinner'],
  },
  {
    id: '3',
    title: 'Fresh Greek Salad',
    description: 'A refreshing Mediterranean salad with crisp vegetables and feta cheese.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400',
    cookTime: 0,
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Greek',
    category: 'Salad',
    calories: 220,
    rating: 4.6,
    reviews: 156,
    ingredients: [
      { name: 'Cucumber', amount: '2 medium' },
      { name: 'Tomatoes', amount: '4 medium' },
      { name: 'Red onion', amount: '1 small' },
      { name: 'Bell pepper', amount: '1' },
      { name: 'Feta cheese', amount: '200g' },
      { name: 'Kalamata olives', amount: '1/2 cup' },
      { name: 'Olive oil', amount: '1/4 cup' },
      { name: 'Red wine vinegar', amount: '2 tbsp' },
      { name: 'Oregano', amount: '1 tsp' },
    ],
    instructions: [
      'Cut cucumber and tomatoes into chunks.',
      'Slice red onion thinly and dice bell pepper.',
      'Combine vegetables in a large bowl.',
      'Add olives and crumbled feta cheese.',
      'Whisk olive oil, vinegar, and oregano for dressing.',
      'Drizzle dressing over salad and toss gently.',
      'Season with salt and pepper to taste.',
    ],
    tags: ['salad', 'healthy', 'vegetarian', 'mediterranean'],
  },
  {
    id: '4',
    title: 'Beef Tacos',
    description: 'Flavorful ground beef tacos with fresh toppings and homemade seasoning.',
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400',
    cookTime: 15,
    prepTime: 10,
    servings: 6,
    difficulty: 'Easy',
    cuisine: 'Mexican',
    category: 'Main Course',
    calories: 340,
    rating: 4.9,
    reviews: 312,
    ingredients: [
      { name: 'Ground beef', amount: '500g' },
      { name: 'Taco shells', amount: '12' },
      { name: 'Onion', amount: '1 medium' },
      { name: 'Garlic', amount: '3 cloves' },
      { name: 'Tomatoes', amount: '2' },
      { name: 'Lettuce', amount: '1 cup shredded' },
      { name: 'Cheese', amount: '1 cup shredded' },
      { name: 'Sour cream', amount: '1/2 cup' },
      { name: 'Taco seasoning', amount: '2 tbsp' },
    ],
    instructions: [
      'Brown ground beef in a skillet over medium heat.',
      'Add diced onion and minced garlic, cook until soft.',
      'Stir in taco seasoning and 1/4 cup water.',
      'Simmer for 5 minutes until sauce thickens.',
      'Warm taco shells according to package directions.',
      'Fill shells with meat mixture.',
      'Top with lettuce, tomatoes, cheese, and sour cream.',
    ],
    tags: ['tacos', 'mexican', 'quick', 'family'],
  },
  {
    id: '5',
    title: 'Banana Pancakes',
    description: 'Fluffy pancakes with mashed banana for natural sweetness.',
    image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400',
    cookTime: 15,
    prepTime: 10,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Breakfast',
    calories: 280,
    rating: 4.5,
    reviews: 178,
    ingredients: [
      { name: 'Banana', amount: '2 ripe' },
      { name: 'Flour', amount: '1.5 cups' },
      { name: 'Eggs', amount: '2' },
      { name: 'Milk', amount: '1 cup' },
      { name: 'Baking powder', amount: '2 tsp' },
      { name: 'Butter', amount: '2 tbsp melted' },
      { name: 'Maple syrup', amount: 'for serving' },
    ],
    instructions: [
      'Mash bananas in a large bowl.',
      'Add eggs and melted butter, mix well.',
      'Stir in milk.',
      'Add flour and baking powder, mix until just combined.',
      'Heat a non-stick pan over medium heat.',
      'Pour 1/4 cup batter per pancake.',
      'Cook until bubbles form, flip and cook other side.',
      'Serve with maple syrup and sliced banana.',
    ],
    tags: ['breakfast', 'pancakes', 'banana', 'sweet'],
  },
  {
    id: '6',
    title: 'Vegetable Stir Fry',
    description: 'Colorful mixed vegetables in a savory Asian-style sauce.',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400',
    cookTime: 10,
    prepTime: 15,
    servings: 4,
    difficulty: 'Easy',
    cuisine: 'Asian',
    category: 'Main Course',
    calories: 180,
    rating: 4.4,
    reviews: 142,
    ingredients: [
      { name: 'Broccoli', amount: '2 cups' },
      { name: 'Bell peppers', amount: '2' },
      { name: 'Carrots', amount: '2' },
      { name: 'Mushrooms', amount: '1 cup' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Ginger', amount: '1 inch' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Sesame oil', amount: '1 tbsp' },
      { name: 'Vegetable oil', amount: '2 tbsp' },
    ],
    instructions: [
      'Cut all vegetables into bite-sized pieces.',
      'Mince garlic and grate ginger.',
      'Heat vegetable oil in a wok over high heat.',
      'Add garlic and ginger, stir for 30 seconds.',
      'Add carrots and broccoli, stir fry 3 minutes.',
      'Add peppers and mushrooms, cook 2 more minutes.',
      'Pour in soy sauce and sesame oil.',
      'Toss well and serve over rice.',
    ],
    tags: ['vegetarian', 'healthy', 'quick', 'asian'],
  },
  {
    id: '7',
    title: 'Creamy Tomato Soup',
    description: 'Velvety smooth tomato soup with fresh basil and cream.',
    image: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400',
    cookTime: 30,
    prepTime: 10,
    servings: 6,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Soup',
    calories: 190,
    rating: 4.6,
    reviews: 198,
    ingredients: [
      { name: 'Tomatoes', amount: '1kg' },
      { name: 'Onion', amount: '1 large' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Vegetable broth', amount: '2 cups' },
      { name: 'Heavy cream', amount: '1/2 cup' },
      { name: 'Fresh basil', amount: '1/4 cup' },
      { name: 'Olive oil', amount: '2 tbsp' },
      { name: 'Sugar', amount: '1 tsp' },
    ],
    instructions: [
      'Quarter tomatoes and dice onion.',
      'Sauté onion in olive oil until soft.',
      'Add garlic and cook 1 minute.',
      'Add tomatoes, broth, sugar, salt and pepper.',
      'Simmer 20 minutes until tomatoes break down.',
      'Blend soup until smooth using immersion blender.',
      'Stir in cream and fresh basil.',
      'Serve hot with crusty bread.',
    ],
    tags: ['soup', 'tomato', 'comfort', 'vegetarian'],
  },
  {
    id: '8',
    title: 'Lemon Herb Salmon',
    description: 'Baked salmon fillet with fresh lemon, herbs, and butter.',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400',
    cookTime: 20,
    prepTime: 10,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Mediterranean',
    category: 'Main Course',
    calories: 320,
    rating: 4.8,
    reviews: 267,
    ingredients: [
      { name: 'Salmon fillets', amount: '4 pieces' },
      { name: 'Lemon', amount: '2' },
      { name: 'Butter', amount: '4 tbsp' },
      { name: 'Garlic', amount: '4 cloves' },
      { name: 'Fresh dill', amount: '2 tbsp' },
      { name: 'Fresh parsley', amount: '2 tbsp' },
      { name: 'Olive oil', amount: '1 tbsp' },
    ],
    instructions: [
      'Preheat oven to 400°F (200°C).',
      'Place salmon on a lined baking sheet.',
      'Mix softened butter with minced garlic and herbs.',
      'Spread herb butter over salmon fillets.',
      'Squeeze lemon juice over fish, add lemon slices.',
      'Season with salt and pepper.',
      'Bake 15-18 minutes until salmon flakes easily.',
      'Garnish with fresh herbs and serve.',
    ],
    tags: ['salmon', 'fish', 'healthy', 'elegant'],
  },
  {
    id: '9',
    title: 'Chocolate Chip Cookies',
    description: 'Classic homemade cookies with gooey chocolate chips.',
    image: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=400',
    cookTime: 12,
    prepTime: 15,
    servings: 24,
    difficulty: 'Easy',
    cuisine: 'American',
    category: 'Dessert',
    calories: 150,
    rating: 4.9,
    reviews: 456,
    ingredients: [
      { name: 'Butter', amount: '1 cup softened' },
      { name: 'Sugar', amount: '3/4 cup' },
      { name: 'Brown sugar', amount: '3/4 cup' },
      { name: 'Eggs', amount: '2' },
      { name: 'Vanilla extract', amount: '1 tsp' },
      { name: 'Flour', amount: '2.25 cups' },
      { name: 'Baking soda', amount: '1 tsp' },
      { name: 'Chocolate chips', amount: '2 cups' },
    ],
    instructions: [
      'Preheat oven to 375°F (190°C).',
      'Cream butter and sugars until fluffy.',
      'Beat in eggs and vanilla.',
      'Mix flour and baking soda, add to wet ingredients.',
      'Fold in chocolate chips.',
      'Drop rounded tablespoons onto baking sheets.',
      'Bake 9-12 minutes until golden edges.',
      'Cool on pan 2 minutes, then transfer to rack.',
    ],
    tags: ['dessert', 'cookies', 'chocolate', 'baking'],
  },
  {
    id: '10',
    title: 'Chicken Fried Rice',
    description: 'Restaurant-style fried rice with chicken and vegetables.',
    image: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400',
    cookTime: 15,
    prepTime: 15,
    servings: 4,
    difficulty: 'Medium',
    cuisine: 'Chinese',
    category: 'Main Course',
    calories: 420,
    rating: 4.7,
    reviews: 234,
    ingredients: [
      { name: 'Rice', amount: '3 cups cooked' },
      { name: 'Chicken breast', amount: '2' },
      { name: 'Eggs', amount: '3' },
      { name: 'Peas', amount: '1 cup' },
      { name: 'Carrots', amount: '2 diced' },
      { name: 'Green onions', amount: '4' },
      { name: 'Soy sauce', amount: '3 tbsp' },
      { name: 'Sesame oil', amount: '1 tbsp' },
      { name: 'Vegetable oil', amount: '3 tbsp' },
    ],
    instructions: [
      'Use day-old cold rice for best results.',
      'Cut chicken into small cubes, season and cook.',
      'Remove chicken, scramble eggs in same pan.',
      'Add more oil, stir fry carrots 2 minutes.',
      'Add peas, cook 1 minute.',
      'Add rice, break up clumps, stir fry 3-4 minutes.',
      'Add chicken, eggs, soy sauce, and sesame oil.',
      'Toss well, garnish with green onions.',
    ],
    tags: ['rice', 'chicken', 'chinese', 'quick'],
  },
];

export const RecipeProvider = ({ children }) => {
  const [recipes] = useState(SAMPLE_RECIPES);
  const [favorites, setFavorites] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const favData = await SecureStore.getItemAsync('favorites');
      const recentData = await SecureStore.getItemAsync('recentlyViewed');
      if (favData) setFavorites(JSON.parse(favData));
      if (recentData) setRecentlyViewed(JSON.parse(recentData));
    } catch (error) {
      console.log('Error loading recipe data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (recipeId) => {
    let updatedFavorites;
    if (favorites.includes(recipeId)) {
      updatedFavorites = favorites.filter(id => id !== recipeId);
    } else {
      updatedFavorites = [...favorites, recipeId];
    }
    setFavorites(updatedFavorites);
    await SecureStore.setItemAsync('favorites', JSON.stringify(updatedFavorites));
  };

  const isFavorite = (recipeId) => favorites.includes(recipeId);

  const addToRecentlyViewed = async (recipeId) => {
    const filtered = recentlyViewed.filter(id => id !== recipeId);
    const updated = [recipeId, ...filtered].slice(0, 10);
    setRecentlyViewed(updated);
    await SecureStore.setItemAsync('recentlyViewed', JSON.stringify(updated));
  };

  const getFavoriteRecipes = () => {
    return recipes.filter(recipe => favorites.includes(recipe.id));
  };

  const getRecentRecipes = () => {
    return recentlyViewed.map(id => recipes.find(r => r.id === id)).filter(Boolean);
  };

  const searchRecipes = (query) => {
    const searchTerm = query.toLowerCase();
    return recipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchTerm) ||
      recipe.description.toLowerCase().includes(searchTerm) ||
      recipe.tags.some(tag => tag.includes(searchTerm)) ||
      recipe.cuisine.toLowerCase().includes(searchTerm) ||
      recipe.ingredients.some(ing => ing.name.toLowerCase().includes(searchTerm))
    );
  };

  const filterRecipes = (filters) => {
    let filtered = [...recipes];

    if (filters.cuisine) {
      filtered = filtered.filter(r => r.cuisine === filters.cuisine);
    }
    if (filters.difficulty) {
      filtered = filtered.filter(r => r.difficulty === filters.difficulty);
    }
    if (filters.category) {
      filtered = filtered.filter(r => r.category === filters.category);
    }
    if (filters.maxTime) {
      filtered = filtered.filter(r => (r.cookTime + r.prepTime) <= filters.maxTime);
    }

    return filtered;
  };

  // AI-powered recipe matching based on available ingredients
  const findRecipesByIngredients = (availableIngredients) => {
    if (!availableIngredients || availableIngredients.length === 0) {
      return recipes;
    }

    const normalizedAvailable = availableIngredients.map(i => i.toLowerCase());

    const recipesWithMatch = recipes.map(recipe => {
      const recipeIngredients = recipe.ingredients.map(i => i.name.toLowerCase());
      let matchCount = 0;
      let totalIngredients = recipeIngredients.length;

      recipeIngredients.forEach(ingredient => {
        if (normalizedAvailable.some(available =>
          ingredient.includes(available) || available.includes(ingredient)
        )) {
          matchCount++;
        }
      });

      const matchPercentage = (matchCount / totalIngredients) * 100;
      const missingCount = totalIngredients - matchCount;

      return {
        ...recipe,
        matchCount,
        matchPercentage: Math.round(matchPercentage),
        missingIngredients: missingCount,
      };
    });

    // Sort by match percentage (highest first)
    return recipesWithMatch
      .filter(r => r.matchCount > 0)
      .sort((a, b) => b.matchPercentage - a.matchPercentage);
  };

  const getRecipeById = (id) => recipes.find(r => r.id === id);

  const getCategories = () => [...new Set(recipes.map(r => r.category))];
  const getCuisines = () => [...new Set(recipes.map(r => r.cuisine))];

  return (
    <RecipeContext.Provider
      value={{
        recipes,
        favorites,
        recentlyViewed,
        isLoading,
        toggleFavorite,
        isFavorite,
        addToRecentlyViewed,
        getFavoriteRecipes,
        getRecentRecipes,
        searchRecipes,
        filterRecipes,
        findRecipesByIngredients,
        getRecipeById,
        getCategories,
        getCuisines,
      }}
    >
      {children}
    </RecipeContext.Provider>
  );
};

export default RecipeContext;
