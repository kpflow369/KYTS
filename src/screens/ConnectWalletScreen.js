import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  TouchableOpacity, ActivityIndicator
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useGlobal } from '../context/GlobalContext';

export default function ConnectWalletScreen({ navigation }) {
  const { walletAddress, connectWallet, disconnectWallet } = useGlobal();
  const [connecting, setConnecting] = useState(false);

  const handleConnect = async () => {
    setConnecting(true);
    const success = await connectWallet();
    setConnecting(false);
    if (success) {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }
  };

  const handleDisconnect = () => {
    disconnectWallet();
  };

  if (walletAddress) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.content}>
          <View style={styles.successIconBox}>
            <Ionicons name="checkmark-circle" size={64} color="#4CAF50" />
          </View>
          <Text style={styles.title}>Wallet Connected!</Text>
          <View style={styles.addressBox}>
            <Text style={styles.addressLabel}>Connected Address</Text>
            <Text style={styles.addressText}>
              {walletAddress.slice(0, 10)}...{walletAddress.slice(-8)}
            </Text>
          </View>

          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
          >
            <LinearGradient colors={['#ff4444', '#cc2222']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.btnGrad}>
              <Text style={styles.btnText}>Continue to App</Text>
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity onPress={handleDisconnect} style={styles.disconnectBtn}>
            <Text style={styles.disconnectText}>Disconnect Wallet</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconBox}>
          <Ionicons name="wallet" size={48} color="#ff4444" />
        </View>
        <Text style={styles.title}>Connect Wallet</Text>
        <Text style={styles.subtitle}>
          Connect MetaMask directly. Pay effortlessly with zero platform fees.
        </Text>

        <TouchableOpacity
          style={styles.connectorBtn}
          onPress={handleConnect}
          activeOpacity={0.8}
          disabled={connecting}
        >
          <View style={styles.connectorLeft}>
            <Text style={styles.connectorIcon}>🦊</Text>
            <View>
              <Text style={styles.connectorName}>MetaMask</Text>
              <Text style={styles.connectorType}>Injected Provider</Text>
            </View>
          </View>
          {connecting ? (
            <ActivityIndicator color="#ff4444" size="small" />
          ) : (
             <Ionicons name="chevron-forward" size={20} color="#555" />
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.skipBtn}
          onPress={() => navigation.reset({ index: 0, routes: [{ name: 'Main' }] })}
        >
          <Text style={styles.skipText}>Skip for now</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  content: { flex: 1, padding: 28, justifyContent: 'center' },
  successIconBox: {
    alignSelf: 'center',
    marginBottom: 20,
    shadowColor: '#4CAF50',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
  },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: '#1a0505',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
  },
  title: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  connectorBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  connectorLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  connectorIcon: { fontSize: 30 },
  connectorName: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 2 },
  connectorType: { color: '#666', fontSize: 12 },
  addressBox: {
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.3)',
    width: '100%',
  },
  addressLabel: { color: '#888', fontSize: 13, marginBottom: 8 },
  addressText: {
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'monospace',
  },
  continueBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    width: '100%',
  },
  btnGrad: { paddingVertical: 18, alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 17, fontWeight: '800' },
  disconnectBtn: { paddingVertical: 12, alignItems: 'center' },
  disconnectText: { color: '#ff4444', fontSize: 15, fontWeight: '600' },
  skipBtn: { marginTop: 20, paddingVertical: 14, alignItems: 'center' },
  skipText: { color: '#555', fontSize: 15 },
});
