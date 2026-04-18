import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';

export default function OrderTrackingScreen({ navigation }) {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: "Order Placed", desc: "Smart contract locked funds", icon: "lock-closed" },
    { title: "Preparing", desc: "Vendor accepted your order", icon: "restaurant" },
    { title: "Out for Delivery", desc: "Courier picked up order", icon: "bicycle" },
    { title: "Delivered", desc: "Funds released. NFT Rewarded!", icon: "checkmark-circle" },
  ];

  useEffect(() => {
    if (currentStep < 3) {
      const timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [currentStep]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })} style={styles.backBtn}>
          <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Tracking</Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.content}>
        <Image 
          source={{ uri: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&q=80' }} 
          style={styles.mapMapPlaceholder} 
        />
        
        <GlassCard style={styles.trackingCard}>
          <Text style={styles.orderId}>Order #0x4f...E9c2</Text>
          <View style={styles.progressContainer}>
            {steps.map((step, idx) => (
              <View key={idx} style={styles.stepRow}>
                <View style={styles.stepIconContainer}>
                  <Ionicons 
                    name={step.icon} 
                    size={20} 
                    color={idx <= currentStep ? '#ff4040' : '#444'} 
                  />
                  {idx < 3 && (
                    <View style={[styles.stepLine, idx < currentStep ? styles.stepLineActive : null]} />
                  )}
                </View>
                <View style={styles.stepTextContainer}>
                  <Text style={[styles.stepTitle, idx <= currentStep ? styles.stepTitleActive : null]}>
                    {step.title}
                  </Text>
                  <Text style={styles.stepDesc}>{step.desc}</Text>
                </View>
              </View>
            ))}
          </View>
        </GlassCard>

        {currentStep === 3 && (
          <GlassCard style={styles.nftCard}>
            <Ionicons name="leaf" size={24} color="#4CAF50" />
            <View style={styles.nftTextContainer}>
              <Text style={styles.nftTitle}>Eco-Hero NFT Unlocked!</Text>
              <Text style={styles.nftDesc}>For completing a zero-emission delivery.</Text>
            </View>
          </GlassCard>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  backBtn: {
    padding: 4,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
  },
  content: {
    flex: 1,
  },
  mapMapPlaceholder: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.3,
  },
  trackingCard: {
    margin: 20,
    marginTop: 'auto',
    backgroundColor: 'rgba(10,10,10,0.85)',
  },
  orderId: {
    color: '#ff4040',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 10,
  },
  stepRow: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stepIconContainer: {
    alignItems: 'center',
    width: 30,
    marginRight: 16,
  },
  stepLine: {
    width: 2,
    height: 30,
    backgroundColor: '#444',
    marginTop: 8,
  },
  stepLineActive: {
    backgroundColor: '#ff4040',
  },
  stepTextContainer: {
    flex: 1,
    paddingTop: 0,
  },
  stepTitle: {
    color: '#666',
    fontSize: 16,
    fontWeight: '700',
  },
  stepTitleActive: {
    color: '#fff',
  },
  stepDesc: {
    color: '#888',
    fontSize: 14,
    marginTop: 4,
  },
  nftCard: {
    flexDirection: 'row',
    marginHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
    borderColor: 'rgba(76, 175, 80, 0.3)',
  },
  nftTextContainer: {
    marginLeft: 12,
  },
  nftTitle: {
    color: '#4CAF50',
    fontWeight: '700',
    fontSize: 16,
  },
  nftDesc: {
    color: '#aaa',
    fontSize: 12,
  }
});
