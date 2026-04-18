import React, { useContext } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import GlassCard from '../components/GlassCard';
import { menuItems } from '../api/mockData';
import { GlobalContext } from '../context/GlobalContext';
import { LinearGradient } from 'expo-linear-gradient';

const INR_PER_USDC = 83;
const ETH_PER_INR = 0.000003;

export default function RestaurantScreen({ route, navigation }) {
  const { restaurant } = route.params;
  const items = menuItems[restaurant.id] || [];
  const { addToCart, cart } = useContext(GlobalContext);

  const cartTotalUSD = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartTotalINR = Math.round(cartTotalUSD * INR_PER_USDC);
  const cartTotalETH = (cartTotalINR * ETH_PER_INR).toFixed(4);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Image */}
      <View style={styles.headerImageContainer}>
        <Image source={{ uri: restaurant.image }} style={styles.headerImage} />
        <LinearGradient
          colors={['transparent', '#0a0a0a']}
          style={styles.imageGradient}
        />
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.restaurantInfo}>
          <Text style={styles.title}>{restaurant.name}</Text>
          <Text style={styles.meta}>
            <Ionicons name="star" size={14} color="#ffb300" /> {restaurant.rating} • {restaurant.deliveryTime}
          </Text>
          <Text style={styles.desc}>
            Verified Web3 Vendor. Smart contracts ensure decentralized, trustless order fulfillment.
          </Text>
        </View>

        <Text style={styles.sectionTitle}>Menu</Text>
        
        {items.map(item => {
          const itemPriceINR = Math.round(item.price * INR_PER_USDC);
          const itemPriceETH = (itemPriceINR * ETH_PER_INR).toFixed(4);
          
          return (
            <GlassCard key={item.id} style={styles.menuItem}>
              <View style={styles.menuItemText}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemDesc}>{item.description}</Text>
                <View style={styles.priceRow}>
                  <Text style={styles.itemPrice}>₹{itemPriceINR}</Text>
                  <View style={styles.ethBadge}>
                    <Text style={styles.ethBadgeText}>{itemPriceETH} ETH</Text>
                  </View>
                </View>
              </View>
              <View style={styles.menuItemRight}>
                <Image source={{ uri: item.image }} style={styles.itemImage} />
                <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(item, restaurant.id)}>
                  <Ionicons name="add" size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </GlassCard>
          );
        })}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Cart Banner */}
      {cart.length > 0 && (
        <TouchableOpacity style={styles.cartBanner} onPress={() => navigation.navigate('Cart')}>
          <View style={styles.cartBannerInner}>
            <View style={styles.cartCount}>
              <Text style={styles.cartCountText}>{cart.length}</Text>
            </View>
            <Text style={styles.cartBannerText}>View Cart</Text>
            <View style={styles.cartTotalCol}>
              <Text style={styles.cartBannerPrice}>₹{cartTotalINR}</Text>
              <Text style={styles.cartBannerEth}>{cartTotalETH} ETH</Text>
            </View>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0a',
  },
  headerImageContainer: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: '100%',
  },
  imageGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  restaurantInfo: {
    marginTop: -20,
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#fff',
    marginBottom: 8,
  },
  meta: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 12,
  },
  desc: {
    color: '#888',
    fontSize: 14,
    lineHeight: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    marginBottom: 16,
  },
  menuItemText: {
    flex: 1,
    marginRight: 16,
  },
  itemName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemDesc: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  itemPrice: {
    color: '#ccc',
    fontSize: 16,
    fontWeight: '600',
  },
  ethBadge: {
    backgroundColor: 'rgba(0,185,170,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ethBadgeText: { 
    color: '#00c9bb', 
    fontSize: 11, 
    fontWeight: '700' 
  },
  menuItemRight: {
    alignItems: 'center',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginBottom: -15,
  },
  addBtn: {
    backgroundColor: '#ff4040',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#0a0a0a',
  },
  cartBanner: {
    position: 'absolute',
    bottom: 30,
    left: 20,
    right: 20,
    backgroundColor: '#ff4040',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#ff4040',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  cartBannerInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cartCount: {
    backgroundColor: 'rgba(0,0,0,0.2)',
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCountText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  cartBannerText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
    flex: 1,
    textAlign: 'center',
  },
  cartTotalCol: {
    alignItems: 'flex-end',
  },
  cartBannerPrice: {
    color: '#fff',
    fontWeight: '800',
    fontSize: 16,
  },
  cartBannerEth: {
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
    fontSize: 11,
  }
});
