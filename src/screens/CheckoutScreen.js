import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Alert
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalContext, useGlobal } from '../context/GlobalContext';

const INR_PER_USDC = 83;
const ETH_PER_INR = 0.000003;
const DELIVERY_FEE = 40;
const PLATFORM_FEE = 5;
const GST_RATE = 0.05;

export default function CheckoutScreen({ navigation }) {
  const { cart, clearCart, walletAddress, isConnected } = useGlobal();
  const [isPaying, setIsPaying] = useState(false);

  const itemTotal = cart.reduce((sum, item) => sum + Math.round(item.price * INR_PER_USDC) * item.quantity, 0);
  const gst = Math.round(itemTotal * GST_RATE);
  const finalTotal = itemTotal + DELIVERY_FEE + PLATFORM_FEE + gst;
  const ethEquiv = (finalTotal * ETH_PER_INR).toFixed(4);
  const usdcEquiv = (finalTotal / INR_PER_USDC).toFixed(2);

  const handlePlaceOrder = async () => {
    if (!isConnected || !walletAddress) {
      alert('Please connect your wallet first!');
      return;
    }

    setIsPaying(true);
    try {
      if (typeof window !== 'undefined' && window.ethereum) {
        // Convert ethEquiv to Wei (hex)
        const ethAmount = parseFloat(ethEquiv);
        const weiAmount = Math.floor(ethAmount * 1e18);
        const hexWei = '0x' + weiAmount.toString(16);

        // Dummy vendor or escrow smart contract address
        const vendorAddress = '0x0000000000000000000000000000000000000000';

        // Trigger MetaMask Transaction
        const txHash = await window.ethereum.request({
          method: 'eth_sendTransaction',
          params: [
            {
              from: walletAddress,
              to: vendorAddress,
              value: hexWei,
            },
          ],
        });

        console.log("Tx Hash:", txHash);

        // Proceed to order tracking
        setIsPaying(false);
        clearCart();
        navigation.reset({ index: 1, routes: [{ name: 'Main' }, { name: 'OrderTracking' }] });
      } else {
        alert("MetaMask not found.");
        setIsPaying(false);
      }
    } catch (error) {
      console.error(error);
      alert("Transaction failed or was rejected.");
      setIsPaying(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <Text style={styles.sectionTitle}>Order Summary</Text>
        <View style={styles.summaryCard}>
          <SummaryRow label="Total Amount" value={`₹${finalTotal}`} />
          <SummaryRow label="Platform Fee (0%)" value="₹0" valueColor="#4CAF50" />
          <SummaryRow label="Final Total" value={`₹${finalTotal}`} bold />
          <View style={styles.divider} />
          <View style={styles.equivRow}>
            <Text style={styles.equivLabel}>Equivalent</Text>
            <View style={styles.equivBadges}>
              <View style={styles.ethBadge}>
                <Text style={styles.ethBadgeText}>{ethEquiv} ETH</Text>
              </View>
              <Text style={styles.orText}>or</Text>
              <View style={styles.usdcBadge}>
                <Text style={styles.usdcBadgeText}>{usdcEquiv} USDC</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Payment — ETH only */}
        <Text style={styles.sectionTitle}>Select Payment Method</Text>
        <Text style={styles.groupLabel}>Cryptocurrency</Text>

        <View style={styles.paymentOption}>
          <View style={styles.paymentIcon}>
            {isConnected ? (
                <Text style={{fontSize: 22}}>🦊</Text>
            ) : (
                <Ionicons name="wallet" size={22} color="#00b4aa" />
            )}
          </View>
          <View style={styles.paymentTextContainer}>
            <Text style={styles.paymentLabel}>Ethereum (ETH)</Text>
            {isConnected && walletAddress ? (
              <Text style={[styles.paymentSub, { color: '#4CAF50' }]}>
                Connected: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </Text>
            ) : (
              <Text style={styles.paymentSub}>Connect wallet to use</Text>
            )}
          </View>
          {/* Selected by default — the only option */}
          <View style={styles.radioSelected}>
            <View style={styles.radioDot} />
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Place Order */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderBtn}
          onPress={handlePlaceOrder}
          activeOpacity={0.85}
          disabled={isPaying}
        >
          <LinearGradient
            colors={['#ff4444', '#cc2222']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.placeOrderGrad}
          >
            <Text style={styles.placeOrderText}>
              {isPaying ? 'Confirming in Wallet...' : `Pay ₹${finalTotal} with MetaMask`}
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const SummaryRow = ({ label, value, bold, valueColor }) => (
  <View style={styles.summaryRow}>
    <Text style={[styles.summaryLabel, bold && { color: '#fff', fontWeight: '800' }]}>{label}</Text>
    <Text style={[styles.summaryValue, bold && { color: '#fff', fontWeight: '800' }, valueColor && { color: valueColor }]}>
      {value}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.07)',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '800' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 24 },

  sectionTitle: { color: '#fff', fontSize: 18, fontWeight: '800', marginBottom: 14 },
  groupLabel: { color: '#666', fontSize: 13, fontWeight: '600', marginBottom: 10 },

  summaryCard: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 18,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: { color: '#888', fontSize: 15 },
  summaryValue: { color: '#ccc', fontSize: 15 },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginVertical: 12 },
  equivRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  equivLabel: { color: '#888', fontSize: 14 },
  equivBadges: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  ethBadge: {
    backgroundColor: '#0a2e2c',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  ethBadgeText: { color: '#00c9bb', fontWeight: '700', fontSize: 13 },
  usdcBadge: {
    backgroundColor: '#0a1f2e',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  usdcBadgeText: { color: '#00aaff', fontWeight: '700', fontSize: 13 },
  orText: { color: '#666', fontSize: 13 },

  // Payment
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a0808',
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: '#ff4444',
    marginBottom: 10,
  },
  paymentIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#0d2d2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  paymentTextContainer: { flex: 1 },
  paymentLabel: { color: '#fff', fontSize: 15, fontWeight: '600', marginBottom: 2 },
  paymentSub: { color: '#ff4444', fontSize: 12 },
  radioSelected: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#ff4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#ff4444' },

  // Footer
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#0a0a0a',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.07)',
  },
  placeOrderBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  placeOrderGrad: { paddingVertical: 18, alignItems: 'center' },
  placeOrderText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
