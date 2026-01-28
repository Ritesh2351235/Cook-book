import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components';
import { COLORS, FONTS, SPACING, BORDER_RADIUS } from '../constants/theme';

const { width, height } = Dimensions.get('window');

const WelcomeScreen = ({ navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />
      <LinearGradient
        colors={[COLORS.primaryLight, COLORS.primary, COLORS.primaryDark]}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Decorative circles */}
        <View style={[styles.circle, styles.circle1]} />
        <View style={[styles.circle, styles.circle2]} />
        <View style={[styles.circle, styles.circle3]} />

        <View style={[styles.content, { paddingTop: insets.top + SPACING.xl }]}>
          {/* Logo and Title */}
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="restaurant" size={60} color={COLORS.primary} />
            </View>
            <Text style={styles.appName}>CookSnap</Text>
            <Text style={styles.tagline}>Scan, Cook, Enjoy!</Text>
          </View>

          {/* Features */}
          <View style={styles.featuresContainer}>
            <FeatureItem
              icon="camera"
              title="Smart Scanning"
              description="Scan groceries with your camera"
            />
            <FeatureItem
              icon="bulb"
              title="AI Recipes"
              description="Get recipe suggestions from ingredients"
            />
            <FeatureItem
              icon="heart"
              title="Save Favorites"
              description="Build your personal cookbook"
            />
          </View>

          {/* Buttons */}
          <View style={[styles.buttonsContainer, { paddingBottom: insets.bottom + SPACING.lg }]}>
            <Button
              title="Get Started"
              onPress={() => navigation.navigate('SignUp')}
              fullWidth
              style={styles.primaryButton}
            />
            <Button
              title="I already have an account"
              variant="ghost"
              onPress={() => navigation.navigate('Login')}
              fullWidth
              textStyle={styles.ghostButtonText}
            />
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

const FeatureItem = ({ icon, title, description }) => (
  <View style={styles.featureItem}>
    <View style={styles.featureIcon}>
      <Ionicons name={icon} size={24} color={COLORS.primary} />
    </View>
    <View style={styles.featureText}>
      <Text style={styles.featureTitle}>{title}</Text>
      <Text style={styles.featureDescription}>{description}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  circle: {
    position: 'absolute',
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  circle1: {
    width: 200,
    height: 200,
    top: -50,
    right: -50,
  },
  circle2: {
    width: 150,
    height: 150,
    top: height * 0.3,
    left: -75,
  },
  circle3: {
    width: 100,
    height: 100,
    bottom: height * 0.2,
    right: -30,
  },
  content: {
    flex: 1,
    paddingHorizontal: SPACING.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: SPACING.xxl,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: COLORS.white,
    marginTop: SPACING.lg,
  },
  tagline: {
    fontSize: FONTS.h5,
    color: 'rgba(255,255,255,0.9)',
    marginTop: SPACING.xs,
  },
  featuresContainer: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: BORDER_RADIUS.xl,
    padding: SPACING.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SPACING.md,
  },
  featureIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SPACING.md,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: FONTS.body,
    fontWeight: '600',
    color: COLORS.white,
  },
  featureDescription: {
    fontSize: FONTS.caption,
    color: 'rgba(255,255,255,0.8)',
    marginTop: 2,
  },
  buttonsContainer: {
    gap: SPACING.sm,
  },
  primaryButton: {
    backgroundColor: COLORS.white,
  },
  ghostButtonText: {
    color: COLORS.white,
  },
});

export default WelcomeScreen;
