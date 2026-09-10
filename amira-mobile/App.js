import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Animated,
  Platform,
} from 'react-native';
import { WebView } from 'react-native-webview';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');

const ONBOARDING_SLIDES = [
  {
    id: 'voice',
    badge: 'SUB-500MS TELEPHONY',
    title: 'Autonomous Voice Agents',
    subtitle: 'Deploy intelligent AI voice phone agents that answer incoming calls, qualify leads, and schedule appointments around the clock.',
    icon: '🎙️',
    accent: '#3b82f6',
  },
  {
    id: 'crm',
    badge: 'OMNI-CHANNEL SYNC',
    title: 'Unified CRM & Knowledge RAG',
    subtitle: 'Connect HubSpot, Salesforce, WhatsApp, and your website into a real-time pgvector brain with instant multi-agent memory.',
    icon: '🌐',
    accent: '#8b5cf6',
  },
  {
    id: 'closing',
    badge: 'ZERO-TOUCH PIPELINE',
    title: 'Lead Qualification & Closing',
    subtitle: 'Triage high-intent buyers automatically, route meetings to closers, and process payments securely with zero friction.',
    icon: '⚡',
    accent: '#10b981',
  },
];

export default function App() {
  const [appState, setAppState] = useState('splash'); // 'splash' | 'onboarding' | 'webview'
  const [activeSlide, setActiveSlide] = useState(0);
  const [targetUrl, setTargetUrl] = useState('https://heyamira.com/app');
  const [webLoading, setWebLoading] = useState(true);

  const pulseAnim = useRef(new Animated.Value(1)).current;
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const webViewRef = useRef(null);

  // Pulse animation for Flash Splash Screen
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.08, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();

    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Check Returning User Context on Startup
  useEffect(() => {
    async function checkUserContext() {
      try {
        const hasSeenOnboarding = await AsyncStorage.getItem('amira_has_seen_onboarding');
        const lastSessionUrl = await AsyncStorage.getItem('amira_last_session_url');

        // Short flash screen duration (1.2s)
        setTimeout(() => {
          if (hasSeenOnboarding === 'true') {
            // Returning user: Skip onboarding, restore context
            setTargetUrl(lastSessionUrl || 'https://heyamira.com/app');
            setAppState('webview');
          } else {
            // New user: Show onboarding flow
            setAppState('onboarding');
          }
        }, 1200);
      } catch (err) {
        console.warn('Failed to load user context:', err);
        setAppState('onboarding');
      }
    }

    checkUserContext();
  }, []);

  const handleCompleteOnboarding = async (destination) => {
    try {
      await AsyncStorage.setItem('amira_has_seen_onboarding', 'true');
    } catch (err) {
      console.warn('Storage write error:', err);
    }

    if (destination === 'signup') {
      setTargetUrl('https://heyamira.com/signup?source=mobile_app');
    } else {
      setTargetUrl('https://heyamira.com/login?source=mobile_app');
    }
    setAppState('webview');
  };

  const handleNavigationStateChange = (navState) => {
    if (navState.url && !navState.url.includes('about:blank')) {
      AsyncStorage.setItem('amira_last_session_url', navState.url).catch(() => {});
    }
  };

  // 1. FLASH LOADING / SPLASH SCREEN
  if (appState === 'splash') {
    return (
      <SafeAreaView style={styles.splashContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#061b31" />
        <View style={styles.splashContent}>
          <Animated.View style={[styles.brandIconWrapper, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={styles.brandEmoji}>⚡</Text>
          </Animated.View>
          <Text style={styles.splashTitle}>AMIRA AI</Text>
          <Text style={styles.splashSubtitle}>Autonomous Workspace & Telephony</Text>

          {/* Shimmer Skeleton Line */}
          <View style={styles.skeletonContainer}>
            <View style={styles.skeletonBar} />
          </View>
        </View>
      </SafeAreaView>
    );
  }

  // 2. ONBOARDING SCREENS (Before Sign Up / Sign In)
  if (appState === 'onboarding') {
    const currentSlide = ONBOARDING_SLIDES[activeSlide];

    return (
      <SafeAreaView style={styles.onboardingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#061b31" />

        {/* Top Header */}
        <View style={styles.onboardingHeader}>
          <View style={styles.miniLogoWrapper}>
            <Text style={styles.miniLogoText}>AMIRA</Text>
          </View>
          <TouchableOpacity
            onPress={() => handleCompleteOnboarding('login')}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Sign In</Text>
          </TouchableOpacity>
        </View>

        {/* Slide Content */}
        <View style={styles.slideContent}>
          <View style={[styles.iconCircle, { borderColor: currentSlide.accent }]}>
            <Text style={styles.slideIcon}>{currentSlide.icon}</Text>
          </View>

          <View style={[styles.badgePill, { backgroundColor: currentSlide.accent + '22' }]}>
            <Text style={[styles.badgeText, { color: currentSlide.accent }]}>
              {currentSlide.badge}
            </Text>
          </View>

          <Text style={styles.slideTitle}>{currentSlide.title}</Text>
          <Text style={styles.slideSubtitle}>{currentSlide.subtitle}</Text>
        </View>

        {/* Pagination Dots */}
        <View style={styles.paginationRow}>
          {ONBOARDING_SLIDES.map((_, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => setActiveSlide(idx)}
              style={[
                styles.dot,
                idx === activeSlide && styles.dotActive,
                idx === activeSlide && { backgroundColor: currentSlide.accent },
              ]}
            />
          ))}
        </View>

        {/* Action Buttons */}
        <View style={styles.actionRow}>
          {activeSlide < ONBOARDING_SLIDES.length - 1 ? (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: currentSlide.accent }]}
              onPress={() => setActiveSlide((prev) => prev + 1)}
            >
              <Text style={styles.primaryButtonText}>Next</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              style={[styles.primaryButton, { backgroundColor: currentSlide.accent }]}
              onPress={() => handleCompleteOnboarding('signup')}
            >
              <Text style={styles.primaryButtonText}>Get Started</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={styles.secondaryButton}
            onPress={() => handleCompleteOnboarding('login')}
          >
            <Text style={styles.secondaryButtonText}>I already have an account • Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  // 3. SECURE APP WORKSPACE WEBVIEW (Context Preserved)
  return (
    <SafeAreaView style={styles.webviewContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#061b31" />

      {webLoading && (
        <View style={styles.skeletonOverlay}>
          <Animated.View style={[styles.miniBrandIcon, { transform: [{ scale: pulseAnim }] }]}>
            <Text style={{ fontSize: 24 }}>⚡</Text>
          </Animated.View>
          <View style={styles.skeletonBox} />
          <View style={[styles.skeletonBox, { width: '60%', height: 16 }]} />
          <View style={[styles.skeletonBox, { width: '80%', height: 44, marginTop: 16 }]} />
        </View>
      )}

      <WebView
        ref={webViewRef}
        source={{ uri: targetUrl }}
        style={styles.webview}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
        allowsInlineMediaPlayback={true}
        mediaPlaybackRequiresUserAction={false}
        originWhitelist={['*']}
        onLoadEnd={() => setWebLoading(false)}
        onNavigationStateChange={handleNavigationStateChange}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#061b31',
    alignItems: 'center',
    justifyContent: 'center',
  },
  splashContent: {
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  brandIconWrapper: {
    width: 90,
    height: 90,
    borderRadius: 28,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
    marginBottom: 20,
  },
  brandEmoji: {
    fontSize: 44,
  },
  splashTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    letterSpacing: 2,
    marginBottom: 8,
  },
  splashSubtitle: {
    color: '#93c5fd',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 32,
  },
  skeletonContainer: {
    width: 140,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1e293b',
    overflow: 'hidden',
  },
  skeletonBar: {
    width: '100%',
    height: '100%',
    backgroundColor: '#3b82f6',
  },

  // Onboarding Styles
  onboardingContainer: {
    flex: 1,
    backgroundColor: '#061b31',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingVertical: 16,
  },
  onboardingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Platform.OS === 'android' ? 16 : 8,
  },
  miniLogoWrapper: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
  miniLogoText: {
    color: '#60a5fa',
    fontWeight: '800',
    fontSize: 12,
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  skipText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },
  slideContent: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  iconCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#0b2447',
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
  },
  slideIcon: {
    fontSize: 52,
  },
  badgePill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginBottom: 16,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
  slideTitle: {
    color: '#ffffff',
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  slideSubtitle: {
    color: '#94a3b8',
    fontSize: 15,
    lineHeight: 23,
    textAlign: 'center',
    fontWeight: '400',
  },
  paginationRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#334155',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    height: 8,
    borderRadius: 4,
  },
  actionRow: {
    gap: 12,
    marginBottom: Platform.OS === 'ios' ? 12 : 24,
  },
  primaryButton: {
    width: '100%',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryButton: {
    width: '100%',
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryButtonText: {
    color: '#94a3b8',
    fontSize: 14,
    fontWeight: '600',
  },

  // WebView & Skeleton
  webviewContainer: {
    flex: 1,
    backgroundColor: '#061b31',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  webview: {
    flex: 1,
    backgroundColor: '#061b31',
  },
  skeletonOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#061b31',
    zIndex: 10,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
    gap: 12,
  },
  miniBrandIcon: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: '#1d4ed8',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  skeletonBox: {
    width: '50%',
    height: 20,
    borderRadius: 8,
    backgroundColor: '#1e293b',
  },
});
