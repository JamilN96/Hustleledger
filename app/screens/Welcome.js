import { useCallback, useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

const baseStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing(3),
  },
  logoContainer: {
    marginBottom: spacing(6),
    alignItems: 'center',
  },
  logoText: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  buttonsContainer: {
    width: '100%',
  },
  primaryButton: {
    borderRadius: radii.lg,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
    marginBottom: spacing(2),
  },
  secondaryButton: {
    borderRadius: radii.lg,
    paddingVertical: spacing(1.5),
    alignItems: 'center',
    borderWidth: 1,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

const Welcome = ({ navigation }) => {
  const colors = useColors();
  const isDarkMode = useIsDarkMode();
  const themedStyles = useMemo(
    () => ({
      safeArea: {
        backgroundColor: colors.bg,
      },
      container: {
        backgroundColor: colors.bg,
      },
      logoText: {
        color: colors.text,
      },
      primaryButton: {
        backgroundColor: colors.accent1,
      },
      secondaryButton: {
        backgroundColor: colors.card,
        borderColor: colors.cardOutline ?? 'transparent',
      },
      primaryButtonText: {
        color: '#FFFFFF',
      },
      secondaryButtonText: {
        color: colors.text,
      },
    }),
    [colors]
  );

  const handleSignIn = useCallback(() => {
    navigation.navigate('SignIn');
  }, [navigation]);

  const handleSignUp = useCallback(() => {
    navigation.navigate('SignUp');
  }, [navigation]);

  return (
    <SafeAreaView style={[baseStyles.safeArea, themedStyles.safeArea]}>
      <StatusBar style={isDarkMode ? 'light' : 'dark'} />
      <View style={[baseStyles.container, themedStyles.container]}>
        <View
          style={baseStyles.logoContainer}
          accessibilityRole="header"
          accessibilityLabel="HustleLedger welcome heading"
        >
          <Text style={[baseStyles.logoText, themedStyles.logoText]} allowFontScaling>
            HustleLedger
          </Text>
        </View>

        <View style={baseStyles.buttonsContainer}>
          <TouchableOpacity
            style={[baseStyles.primaryButton, themedStyles.primaryButton]}
            onPress={handleSignIn}
            accessibilityRole="button"
            accessibilityLabel="Sign in to your HustleLedger account"
            activeOpacity={0.85}
          >
            <Text style={[baseStyles.primaryButtonText, themedStyles.primaryButtonText]} allowFontScaling>
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[baseStyles.secondaryButton, themedStyles.secondaryButton]}
            onPress={handleSignUp}
            accessibilityRole="button"
            accessibilityLabel="Create a new HustleLedger account"
            activeOpacity={0.85}
          >
            <Text style={[baseStyles.secondaryButtonText, themedStyles.secondaryButtonText]} allowFontScaling>
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Welcome;
