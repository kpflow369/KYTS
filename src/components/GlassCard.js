import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';

export default function GlassCard({ children, style, onPress }) {
  const CardContent = (
    <BlurView intensity={30} tint="dark" style={[styles.card, style]}>
      {children}
    </BlurView>
  );

  if (onPress) {
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={styles.container}>
        {CardContent}
      </TouchableOpacity>
    );
  }

  return <View style={styles.container}>{CardContent}</View>;
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderWidth: 1,
  },
  card: {
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
});
