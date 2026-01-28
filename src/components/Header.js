import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, FONTS, SPACING } from '../constants/theme';

const Header = ({
  title,
  subtitle,
  leftIcon,
  rightIcon,
  onLeftPress,
  onRightPress,
  showGradient = false,
  transparent = false,
  dark = false,
  rightComponent,
}) => {
  const insets = useSafeAreaInsets();

  const content = (
    <View style={[styles.container, { paddingTop: insets.top + SPACING.sm }]}>
      <StatusBar
        barStyle={dark || showGradient ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.row}>
        {leftIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onLeftPress}>
            <Ionicons
              name={leftIcon}
              size={24}
              color={dark || showGradient ? COLORS.white : COLORS.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}

        <View style={styles.titleContainer}>
          <Text
            style={[
              styles.title,
              (dark || showGradient) && styles.titleLight,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle && (
            <Text
              style={[
                styles.subtitle,
                (dark || showGradient) && styles.subtitleLight,
              ]}
            >
              {subtitle}
            </Text>
          )}
        </View>

        {rightComponent ? (
          rightComponent
        ) : rightIcon ? (
          <TouchableOpacity style={styles.iconButton} onPress={onRightPress}>
            <Ionicons
              name={rightIcon}
              size={24}
              color={dark || showGradient ? COLORS.white : COLORS.textPrimary}
            />
          </TouchableOpacity>
        ) : (
          <View style={styles.iconPlaceholder} />
        )}
      </View>
    </View>
  );

  if (showGradient) {
    return (
      <LinearGradient
        colors={[COLORS.primary, COLORS.primaryDark]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        {content}
      </LinearGradient>
    );
  }

  return (
    <View
      style={[
        styles.solidBackground,
        transparent && styles.transparent,
      ]}
    >
      {content}
    </View>
  );
};

const styles = StyleSheet.create({
  gradient: {},
  solidBackground: {
    backgroundColor: COLORS.background,
  },
  transparent: {
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  container: {
    paddingHorizontal: SPACING.md,
    paddingBottom: SPACING.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  iconPlaceholder: {
    width: 40,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  title: {
    fontSize: FONTS.h4,
    fontWeight: 'bold',
    color: COLORS.textPrimary,
  },
  titleLight: {
    color: COLORS.white,
  },
  subtitle: {
    fontSize: FONTS.caption,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  subtitleLight: {
    color: 'rgba(255,255,255,0.8)',
  },
});

export default Header;
