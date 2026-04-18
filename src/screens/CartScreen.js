import React, { useContext, useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  Image, TouchableOpacity, TextInput
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { GlobalContext } from '../context/GlobalContext';
import { restaurants } from '../api/mockData';

const INR_PER_USDC = 83;
const ETH_PER_INR = 0.000003;
const DELIVERY_FEE = 40;
const PLATFORM_FEE = 5;
const GST_RATE = 0.05;

export default function CartScreen({ navigation }) {
  const { cart, removeFromCart, addToCart } = useContext(GlobalContext);
  const [ecoDelivery, setEcoDelivery] = useState(false);
  const [coupon, setCoupon] = useState('');

  // Get restaurant from cart
  const restaurantId = cart[0]?.restaurantId;
  const restaurant = restaurants.find(r => r.id === restaurantId);

  const itemTotal = cart.reduce((sum, item) => sum + Math.round(item.price * INR_PER_USDC) * item.quantity, 0);
  const gst = Math.round(itemTotal * GST_RATE);
  const grandTotal = itemTotal + DELIVERY_FEE + PLATFORM_FEE + gst;
  const grandTotalETH = (grandTotal * ETH_PER_INR).toFixed(4);

  const updateQty = (item, delta) => {
    if (delta > 0) {
      addToCart(item, item.restaurantId);
    } else {
      if (item.quantity === 1) {
        removeFromCart(item.id);
      } else {
        // Decrement: remove then add with quantity-1
        removeFromCart(item.id);
        if (item.quantity > 1) {
          // Re-add with reduced qty by adding qty-1 times
          for (let i = 0; i < item.quantity - 1; i++) {
            addToCart({ ...item }, item.restaurantId);
          }
        }
      }
    }
  };

  if (cart.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Cart</Text>
          <View style={{ width: 44 }} />
        </View>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#222" />
          <Text style={styles.emptyText}>Your cart is empty</Text>
          <TouchableOpacity style={styles.browseBtn} onPress={() => navigation.navigate('HomeTab')}>
            <Text style={styles.browseBtnText}>Browse Restaurants</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cart</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={styles.scroll}>
        {/* Restaurant Info */}
        {restaurant && (
          <View style={styles.restaurantCard}>
            <Image source={{ uri: restaurant.image }} style={styles.restImg} />
            <View>
              <Text style={styles.restName}>{restaurant.name}</Text>
              <Text style={styles.restMeta}>{restaurant.categories.join(', ')}</Text>
            </View>
          </View>
        )}

        {/* Eco Delivery Toggle */}
        <TouchableOpacity
          style={[styles.ecoCard, ecoDelivery && styles.ecoCardActive]}
          onPress={() => setEcoDelivery(!ecoDelivery)}
          activeOpacity={0.85}
        >
          <View style={styles.ecoIcon}>
            <Ionicons name="leaf" size={22} color="#4CAF50" />
          </View>
          <View style={styles.ecoText}>
            <Text style={styles.ecoTitle}>Eco-Friendly Delivery</Text>
            <Text style={styles.ecoDesc}>Save ₹20 & earn Green NFT rewards</Text>
          </View>
          <View style={[styles.checkbox, ecoDelivery && styles.checkboxChecked]}>
            {ecoDelivery && <Ionicons name="checkmark" size={14} color="#fff" />}
          </View>
        </TouchableOpacity>

        {/* Items */}
        <Text style={styles.itemsTitle}>Items ({cart.length})</Text>

        {cart.map(item => {
          const priceINR = Math.round(item.price * INR_PER_USDC);
          const ethPrice = (priceINR * ETH_PER_INR).toFixed(3);
          return (
            <View key={item.id} style={styles.itemRow}>
              <View style={styles.itemIconBox}>
                <Ionicons name="square" size={20} color="#4CAF50" />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemPriceRow}>
                  <Text style={styles.itemPriceINR}>₹{priceINR * item.quantity}</Text>
                  <View style={styles.ethBadge}>
                    <Text style={styles.ethBadgeText}>{ethPrice} ETH</Text>
                  </View>
                </View>
              </View>
              <View style={styles.qtyControls}>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyMinus]}
                  onPress={() => updateQty(item, -1)}
                >
                  <Text style={styles.qtyBtnText}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyValue}>{item.quantity}</Text>
                <TouchableOpacity
                  style={[styles.qtyBtn, styles.qtyPlus]}
                  onPress={() => updateQty(item, 1)}
                >
                  <Text style={styles.qtyBtnText}>+</Text>
                </TouchableOpacity>
              </View>
              <TouchableOpacity onPress={() => removeFromCart(item.id)} style={styles.deleteBtn}>
                <Ionicons name="trash-outline" size={18} color="#555" />
              </TouchableOpacity>
            </View>
          );
        })}

        {/* Coupon */}
        <TouchableOpacity style={styles.couponRow} activeOpacity={0.7}>
          <Ionicons name="pricetag-outline" size={18} color="#ff4444" />
          <Text style={styles.couponText}>Apply coupon</Text>
        </TouchableOpacity>

        {/* Bill Details */}
        <View style={styles.billCard}>
          <Text style={styles.billTitle}>Bill Details</Text>
          <BillRow label="Item Total" value={`₹${itemTotal}`} />
          <BillRow label="Delivery Fee" value={`₹${DELIVERY_FEE}`} />
          <View style={styles.billRow}>
            <Text style={styles.billLabel}>Platform Fee</Text>
            <View style={styles.billRight}>
              <Text style={styles.billValue}>₹{PLATFORM_FEE}</Text>
              <View style={styles.zeroBadge}>
                <Text style={styles.zeroText}>0% Commission!</Text>
              </View>
            </View>
          </View>
          <BillRow label={`GST (${(GST_RATE * 100).toFixed(0)}%)`} value={`₹${gst}`} />
          <View style={styles.divider} />
          <View style={styles.billRow}>
            <Text style={styles.grandLabel}>Grand Total</Text>
            <View style={styles.billRight}>
              <Text style={styles.grandValue}>₹{grandTotal}</Text>
              <View style={styles.grandEthBadge}>
                <Text style={styles.grandEthText}>{grandTotalETH} ETH</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Proceed to Checkout */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.checkoutBtn}
          onPress={() => navigation.navigate('Checkout')}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#ff4444', '#cc2222']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutGrad}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const BillRow = ({ label, value }) => (
  <View style={styles.billRow}>
    <Text style={styles.billLabel}>{label}</Text>
    <Text style={styles.billValue}>{value}</Text>
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
  scroll: { flex: 1, paddingHorizontal: 20 },

  // Empty
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { color: '#555', fontSize: 18, marginTop: 16, marginBottom: 24 },
  browseBtn: {
    backgroundColor: '#ff4444',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  browseBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },

  // Restaurant card
  restaurantCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 12,
    marginTop: 20,
    marginBottom: 12,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  restImg: { width: 52, height: 52, borderRadius: 10 },
  restName: { color: '#fff', fontWeight: '700', fontSize: 15 },
  restMeta: { color: '#888', fontSize: 13, marginTop: 2 },

  // Eco card
  ecoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0d1a0d',
    borderRadius: 14,
    padding: 14,
    marginBottom: 20,
    gap: 12,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.3)',
  },
  ecoCardActive: { backgroundColor: '#0f2310', borderColor: '#4CAF50' },
  ecoIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: 'rgba(76,175,80,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ecoText: { flex: 1 },
  ecoTitle: { color: '#4CAF50', fontWeight: '700', fontSize: 14 },
  ecoDesc: { color: '#888', fontSize: 12, marginTop: 2 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#444',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  checkboxChecked: { backgroundColor: '#4CAF50', borderColor: '#4CAF50' },

  // Items
  itemsTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 12 },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.06)',
    gap: 10,
  },
  itemIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  itemInfo: { flex: 1 },
  itemName: { color: '#fff', fontWeight: '600', fontSize: 15, marginBottom: 4 },
  itemPriceRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  itemPriceINR: { color: '#ccc', fontSize: 14 },
  ethBadge: {
    backgroundColor: 'rgba(0,185,170,0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  ethBadgeText: { color: '#00c9bb', fontSize: 11, fontWeight: '700' },
  qtyControls: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  qtyBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyMinus: { backgroundColor: '#ff4444' },
  qtyPlus: { backgroundColor: '#ff4444' },
  qtyBtnText: { color: '#fff', fontSize: 18, fontWeight: '700', lineHeight: 22 },
  qtyValue: { color: '#fff', fontSize: 15, fontWeight: '700', minWidth: 16, textAlign: 'center' },
  deleteBtn: { padding: 4 },

  // Coupon
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: '#141414',
    borderRadius: 14,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  couponText: { color: '#ccc', fontSize: 15, fontWeight: '600' },

  // Bill
  billCard: {
    backgroundColor: '#141414',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  billTitle: { color: '#fff', fontSize: 16, fontWeight: '800', marginBottom: 16 },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  billRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  billLabel: { color: '#888', fontSize: 14 },
  billValue: { color: '#ccc', fontSize: 14 },
  zeroBadge: {
    backgroundColor: 'rgba(76,175,80,0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(76,175,80,0.3)',
  },
  zeroText: { color: '#4CAF50', fontSize: 11, fontWeight: '700' },
  divider: { height: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginBottom: 14 },
  grandLabel: { color: '#fff', fontSize: 16, fontWeight: '800' },
  grandValue: { color: '#fff', fontSize: 16, fontWeight: '800' },
  grandEthBadge: {
    backgroundColor: 'rgba(0,185,170,0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    border: 1,
    borderColor: '#00c9bb',
  },
  grandEthText: { color: '#00c9bb', fontSize: 12, fontWeight: '700' },

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
  checkoutBtn: {
    borderRadius: 14,
    overflow: 'hidden',
    shadowColor: '#ff4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  checkoutGrad: { paddingVertical: 18, alignItems: 'center' },
  checkoutText: { color: '#fff', fontSize: 17, fontWeight: '800' },
});
