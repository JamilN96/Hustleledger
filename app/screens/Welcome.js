import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Animated,
  Easing,
  Pressable,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useColors, useIsDarkMode, spacing, radii } from '../lib/theme';

export default function Welcome({ navigation }) {
  const colors = useColors();
  const isDark = useIsDarkMode();
  const [reduceMotionEnabled, setReduceMotionEnabled] = useState(null);

  const logoOpacity = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.94)).current;
  const taglineTranslateY = useRef(new Animated.Value(12)).current;
  const buttonsOpacity = useRef(new Animated.Value(0)).current;
  const signInScale = useRef(new Animated.Value(1)).current;
  const signUpScale = useRef(new Animated.Value(1)).current;

  const applyReducedMotionState = useCallback(() => {
    logoOpacity.setValue(1);
    logoScale.setValue(1);
    taglineTranslateY.setValue(0);
    buttonsOpacity.setValue(1);
    signInScale.setValue(1);
    signUpScale.setValue(1);
  }, [buttonsOpacity, logoOpacity, logoScale, signInScale, signUpScale, taglineTranslateY]);

  const runIntroAnimations = useCallback(() => {
    logoOpacity.setValue(0);
    logoScale.setValue(0.94);
    taglineTranslateY.setValue(12);
    buttonsOpacity.setValue(0);

    Animated.timing(logoOpacity, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(logoScale, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(taglineTranslateY, {
      toValue: 0,
      duration: 500,
      delay: 150,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(buttonsOpacity, {
      toValue: 1,
      duration: 450,
      delay: 250,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  }, [buttonsOpacity, logoOpacity, logoScale, taglineTranslateY]);

  useEffect(() => {
    let isMounted = true;

    const checkReduceMotion = async () => {
      try {
        const enabled = await AccessibilityInfo.isReduceMotionEnabled();
        if (isMounted) {
          setReduceMotionEnabled(enabled);
        }
      } catch (error) {
        if (isMounted) {
          setReduceMotionEnabled(false);
        }
      }
    };

    checkReduceMotion();

    const handler = (enabled) => {
      if (!isMounted) return;
      setReduceMotionEnabled(enabled);
    };

    let subscription;
    if (AccessibilityInfo.addEventListener) {
      subscription = AccessibilityInfo.addEventListener('reduceMotionChanged', handler);
    }

    return () => {
      isMounted = false;
      if (subscription?.remove) {
        subscription.remove();
      } else if (typeof subscription === 'function') {
        subscription();
      } else {
        AccessibilityInfo.removeEventListener?.('reduceMotionChanged', handler);
      }
    };
  }, []);

  useEffect(() => {
    if (reduceMotionEnabled == null) return;
    if (reduceMotionEnabled) {
      applyReducedMotionState();
    } else {
      runIntroAnimations();
    }
  }, [applyReducedMotionState, reduceMotionEnabled, runIntroAnimations]);

  const handleButtonPress = useCallback(
    (scaleValue, target) => {
      const navigate = () => {
        if (target === 'SignIn') {
          navigation.navigate('SignIn');
        } else {
          navigation.navigate('SignUp');
        }
      };

      if (reduceMotionEnabled) {
        navigate();
        return;
      }

      Animated.sequence([
        Animated.timing(scaleValue, {
          toValue: 0.98,
          duration: 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 80,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        navigate();
      });
    },
    [navigation, reduceMotionEnabled],
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}> 
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        translucent
        backgroundColor="transparent"
      />
      <View style={styles.content}>
        <Animated.Text
          style={[
            styles.logo,
            { color: colors.text },
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScale }],
            },
          ]}
          accessibilityRole="header"
          accessibilityLabel="HustleLedger welcome"
          allowFontScaling
        >
          HustleLedger
        </Animated.Text>

        <Animated.Text
          style={[
            styles.tagline,
            { color: colors.subtext },
            { transform: [{ translateY: taglineTranslateY }] },
          ]}
          accessibilityRole="text"
          allowFontScaling
        >
          Stay ahead of every payment, invoice, and projection with the command center built for creators.
        </Animated.Text>

        <Animated.View style={[styles.buttons, { opacity: buttonsOpacity }]}> 
          <Animated.View style={{ transform: [{ scale: signInScale }] }}>
            <Pressable
              onPress={() => handleButtonPress(signInScale, 'SignIn')}
              accessibilityRole="button"
              accessibilityLabel="Sign in"
              style={({ pressed }) => [
                styles.primaryButton,
                {
                  backgroundColor: colors.accent1,
                  shadowColor: colors.accent2,
                  opacity: pressed ? 0.9 : 1,
                },
              ]}
            >
              <Text style={styles.primaryButtonLabel} allowFontScaling>
                Sign In
              </Text>
            </Pressable>
          </Animated.View>

          <Animated.View style={{ transform: [{ scale: signUpScale }], marginTop: spacing(1.5) }}>
            <Pressable
              onPress={() => handleButtonPress(signUpScale, 'SignUp')}
              accessibilityRole="button"
              accessibilityLabel="Create a new account"
              style={({ pressed }) => [
                styles.secondaryButton,
                {
                  borderColor: colors.accent1,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.secondaryButtonLabel, { color: colors.accent1 }]} allowFontScaling>
                Sign Up
              </Text>
            </Pressable>
          </Animated.View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing(3),
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    fontSize: 40,
    fontWeight: '700',
    letterSpacing: 0.6,
  },
  tagline: {
    marginTop: spacing(2),
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
    maxWidth: 320,
  },
  buttons: {
    marginTop: spacing(4),
    width: '100%',
  },
  primaryButton: {
    borderRadius: radii.xl,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 18,
    shadowOpacity: 0.35,
    elevation: 6,
  },
  primaryButtonLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#050510',
  },
  secondaryButton: {
    borderRadius: radii.xl,
    paddingVertical: spacing(1.75),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryButtonLabel: {
    fontSize: 16,
    fontWeight: '600',
  },
});
