import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#1a0000', '#2d0a0a', '#0a0a0a', '#0a0a0a']}
        locations={[0, 0.3, 0.6, 1]}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Logo Icon */}
          <View style={styles.logoContainer}>
            <LinearGradient
              colors={['#3d0505', '#7a0f0f']}
              style={styles.iconBox}
            >
              <Ionicons name="flash" size={48} color="#ff4444" />
            </LinearGradient>
          </View>

          {/* Title */}
          <Text style={styles.title}>ChainBite</Text>
          <Text style={styles.tagline}>Decentralized Food Delivery</Text>

          {/* Feature Pills */}
          <View style={styles.featuresContainer}>
            <FeaturePill emoji="⚡" label="Zero Commission" />
            <FeaturePill emoji="🔒" label="Web3 Powered" />
            <FeaturePill emoji="🌱" label="Earn Green NFTs" />
          </View>

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.getStartedBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <LinearGradient
              colors={['#ff4444', '#cc2222']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.getStartedGradient}
            >
              <Text style={styles.getStartedText}>Get Started</Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Footer */}
          <Text style={styles.footer}>Hyperlocal • Trustful • AI + Web3 Powered</Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const FeaturePill = ({ emoji, label }) => (
  <View style={styles.pill}>
    <Text style={styles.pillEmoji}>{emoji}</Text>
    <Text style={styles.pillLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  logoContainer: {
    marginBottom: 24,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 10,
  },
  iconBox: {
    width: 96,
    height: 96,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 42,
    fontWeight: '900',
    color: '#ff4444',
    letterSpacing: 1,
    marginBottom: 8,
  },
  tagline: {
    fontSize: 16,
    color: '#aaa',
    marginBottom: 48,
  },
  featuresContainer: {
    width: '100%',
    marginBottom: 48,
    gap: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  pillEmoji: {
    fontSize: 22,
    marginRight: 14,
  },
  pillLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  getStartedBtn: {
    width: '100%',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 24,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  getStartedGradient: {
    paddingVertical: 18,
    alignItems: 'center',
  },
  getStartedText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  footer: {
    color: '#555',
    fontSize: 12,
    textAlign: 'center',
  },
});
