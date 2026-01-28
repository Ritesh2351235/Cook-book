# CookSnap - Recipe Cookbook App

A beautiful React Native recipe cookbook app with grocery scanning, AI-powered recipe recommendations, and a warm yellow-themed UI.

## Features

### Core Features

- **Smart Grocery Scanner**: Scan groceries with your camera to automatically create shopping lists
- **AI-Powered Recipe Search**: Find recipes based on your available ingredients
- **Editable Grocery List**: Manage your shopping list with categories and purchase tracking
- **Recipe Library**: Browse, search, and filter thousands of recipes
- **Favorites & Collections**: Save and organize your favorite recipes
- **User Profile**: Manage preferences and settings

### Technical Features

- Beautiful yellow/gold themed UI design
- Smooth animations and transitions
- Secure authentication system
- Offline-capable with local storage
- Cross-platform (iOS & Android)

## Screenshots

The app features a modern, clean design with:
- Warm yellow/gold color palette
- Gradient headers
- Card-based layouts
- Intuitive navigation

## Tech Stack

- **React Native** with **Expo**
- **React Navigation** (Stack & Bottom Tabs)
- **Expo Camera** for grocery scanning
- **Expo Secure Store** for secure data storage
- **Linear Gradient** for beautiful UI effects
- **Vector Icons** for iconography

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator / Physical device

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd Cook-book
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Run on your device:
   - Press `i` for iOS Simulator
   - Press `a` for Android Emulator
   - Scan QR code with Expo Go app on your phone

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.js
│   ├── Input.js
│   ├── RecipeCard.js
│   ├── GroceryItem.js
│   └── Header.js
├── screens/             # App screens
│   ├── WelcomeScreen.js
│   ├── LoginScreen.js
│   ├── SignUpScreen.js
│   ├── HomeScreen.js
│   ├── ScannerScreen.js
│   ├── GroceryListScreen.js
│   ├── AISearchScreen.js
│   ├── RecipeDetailScreen.js
│   ├── FavoritesScreen.js
│   ├── ProfileScreen.js
│   └── SearchScreen.js
├── context/             # React Context for state management
│   ├── AuthContext.js
│   ├── GroceryContext.js
│   └── RecipeContext.js
├── navigation/          # Navigation configuration
│   └── AppNavigator.js
├── constants/           # Theme and constants
│   └── theme.js
└── utils/               # Utility functions
```

## Color Palette

| Color | Hex | Usage |
|-------|-----|-------|
| Primary | `#FFD700` | Main accent color |
| Primary Light | `#FFE135` | Highlights |
| Primary Dark | `#FFA500` | Gradients |
| Secondary | `#FF6B35` | Secondary actions |
| Accent | `#2E7D32` | Success/Ingredients |

## Features Breakdown

### Authentication
- Email/password sign up and sign in
- Secure token storage
- Persistent login sessions

### Grocery Scanner
- Camera-based grocery recognition
- Image picker for gallery selection
- Manual item entry
- Automatic categorization

### Grocery List
- Category-based organization
- Quantity management
- Purchase tracking
- Clear purchased/all items

### Recipe Search
- Keyword search
- Cuisine filters
- Difficulty filters
- Cooking time filters
- AI-powered ingredient matching

### Recipe Details
- Full recipe view
- Ingredient scaling
- Step-by-step instructions
- Add ingredients to grocery list
- Favorite/save recipes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.

---

Built with React Native and Expo
