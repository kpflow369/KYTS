import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import CustomButton from '../components/CustomButton';
import { useGlobal } from '../context/GlobalContext';

const CHAIN_NAMES = {
  1: 'Ethereum',
  137: 'Polygon',
  8453: 'Base',
  42161: 'Arbitrum',
};

export default function ProfileScreen({ navigation }) {
  const { walletAddress, isConnected, disconnectWallet } = useGlobal();

  const handleLogout = () => {
    disconnectWallet();
    navigation.reset({ index: 0, routes: [{ name: 'Welcome' }] });
  };

  const networkName = 'Ethereum'; // simplified since we are not fetching chain ID without wagmi easily right now

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Wallet Card */}
        {isConnected && walletAddress ? (
          <GlassCard style={styles.walletCard}>
            <View style={styles.walletRow}>
              <View style={styles.walletIconBox}>
                <Text style={{ fontSize: 28 }}>🦊</Text>
              </View>
              <View style={styles.walletInfo}>
                <Text style={styles.walletLabel}>Connected Wallet</Text>
                <Text style={styles.walletAddress}>
                  {walletAddress.slice(0, 8)}...{walletAddress.slice(-6)}
                </Text>
                <View style={styles.networkBadge}>
                  <View style={styles.networkDot} />
                  <Text style={styles.networkText}>{networkName}</Text>
                </View>
              </View>
            </View>
          </GlassCard>
        ) : (
          <TouchableOpacity
            style={styles.connectPrompt}
            onPress={() => navigation.navigate('ConnectWallet')}
          >
            <Ionicons name="wallet-outline" size={28} color="#ff4444" />
            <View style={{ flex: 1 }}>
              <Text style={styles.connectPromptTitle}>Connect Wallet</Text>
              <Text style={styles.connectPromptSub}>Link MetaMask securely via provider</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#555" />
          </TouchableOpacity>
        )}

        {/* NFT Rewards */}
        <Text style={styles.sectionTitle}>🌱 NFT Rewards</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.nftScroll}>
          {[1, 2, 3].map((item) => (
            <GlassCard key={item} style={styles.nftCard}>
              <View style={styles.nftImagePlaceholder}>
                <Ionicons name="leaf" size={32} color="#4CAF50" />
              </View>
              <Text style={styles.nftText}>Eco Delivery #{item}</Text>
              <Text style={styles.nftSubText}>Green NFT</Text>
            </GlassCard>
          ))}
        </ScrollView>

        {/* Recent Orders */}
        <Text style={styles.sectionTitle}>Recent Orders</Text>
        <GlassCard style={styles.orderCard}>
          <View style={styles.orderRow}>
            <Text style={styles.orderName}>BurgerFi Web3</Text>
            <Text style={styles.orderPrice}>₹171</Text>
          </View>
          <Text style={styles.orderDate}>Yesterday • Delivered ✅</Text>
        </GlassCard>

        {isConnected && (
          <CustomButton
            title="Disconnect Wallet"
            onPress={handleLogout}
            outline
            style={{ marginTop: 32, marginBottom: 20 }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  headerTitle: { color: '#fff', fontSize: 24, fontWeight: '800' },
  content: { flex: 1, padding: 20 },

  walletCard: {
    padding: 20,
    marginBottom: 28,
    backgroundColor: 'rgba(20,20,20,0.9)',
  },
  walletRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  walletIconBox: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#1a0d00',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  walletInfo: { flex: 1 },
  walletLabel: { color: '#888', fontSize: 12, marginBottom: 4 },
  walletAddress: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'monospace',
    marginBottom: 6,
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(76,175,80,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    gap: 5,
  },
  networkDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#4CAF50' },
  networkText: { color: '#4CAF50', fontSize: 12, fontWeight: '700' },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 10,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  balanceLabel: { color: '#888', fontSize: 14 },
  balanceValue: { color: '#fff', fontSize: 15, fontWeight: '700' },

  connectPrompt: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
  },
  connectPromptTitle: { color: '#fff', fontWeight: '700', fontSize: 15, marginBottom: 2 },
  connectPromptSub: { color: '#888', fontSize: 13 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 16 },
  nftScroll: { marginBottom: 28 },
  nftCard: {
    width: 120,
    marginRight: 14,
    padding: 14,
    alignItems: 'center',
  },
  nftImagePlaceholder: {
    width: 76,
    height: 76,
    backgroundColor: 'rgba(76,175,80,0.1)',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.2)',
  },
  nftText: { color: '#ccc', fontSize: 12, textAlign: 'center', fontWeight: '600' },
  nftSubText: { color: '#4CAF50', fontSize: 11, marginTop: 2 },
  orderCard: { padding: 16, marginBottom: 16 },
  orderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  orderName: { color: '#fff', fontWeight: '700', fontSize: 15 },
  orderPrice: { color: '#fff', fontWeight: '700' },
  orderDate: { color: '#888', fontSize: 13 },
});
