// CookSnap Theme - Yellow/Gold Color Palette
export const COLORS = {
  // Primary Colors - Yellow Theme
  primary: '#FFD700',        // Golden Yellow
  primaryLight: '#FFE135',   // Bright Yellow
  primaryDark: '#FFA500',    // Orange Yellow
  primarySoft: '#FFF8DC',    // Cornsilk (soft yellow)

  // Secondary Colors
  secondary: '#FF6B35',      // Coral Orange
  secondaryLight: '#FF8C5A',
  secondaryDark: '#E55A2B',

  // Accent Colors
  accent: '#2E7D32',         // Fresh Green (for ingredients)
  accentLight: '#4CAF50',

  // Neutral Colors
  white: '#FFFFFF',
  black: '#1A1A1A',
  gray100: '#F8F9FA',
  gray200: '#E9ECEF',
  gray300: '#DEE2E6',
  gray400: '#CED4DA',
  gray500: '#ADB5BD',
  gray600: '#6C757D',
  gray700: '#495057',
  gray800: '#343A40',
  gray900: '#212529',

  // Semantic Colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',

  // Background Colors
  background: '#FFFEF7',     // Warm white with yellow tint
  backgroundSecondary: '#FFF9E6',
  card: '#FFFFFF',

  // Text Colors
  textPrimary: '#1A1A1A',
  textSecondary: '#6C757D',
  textLight: '#ADB5BD',
  textOnPrimary: '#1A1A1A',

  // Gradient Colors
  gradientStart: '#FFD700',
  gradientMiddle: '#FFA500',
  gradientEnd: '#FF6B35',
};

export const FONTS = {
  // Font Families
  regular: 'System',
  medium: 'System',
  bold: 'System',

  // Font Sizes
  h1: 32,
  h2: 28,
  h3: 24,
  h4: 20,
  h5: 18,
  body: 16,
  bodySmall: 14,
  caption: 12,
  tiny: 10,
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const BORDER_RADIUS = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
};
