import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TextInput, TouchableOpacity, Image
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { restaurants } from '../api/mockData';

const CATEGORIES = [
  { label: 'Burgers', emoji: '🍔' },
  { label: 'Pizza', emoji: '🍕' },
  { label: 'Chinese', emoji: '🥡' },
  { label: 'South Indian', emoji: '🫓' },
  { label: 'Desserts', emoji: '🍰' },
  { label: 'Beverages', emoji: '🥤' },
];

const OFFERS = [
  { code: 'CRYPTO50', title: '50% OFF', desc: 'Up to ₹100 on orders above ₹199', colors: ['#3d0505', '#1a0a0a'] },
  { code: 'FREEDEL', title: 'FREE DELIVERY', desc: 'On orders above ₹299', colors: ['#052a1a', '#0a1a0a'] },
];

export default function HomeScreen({ navigation }) {
  const [search, setSearch] = useState('');

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.locationRow}>
              <Ionicons name="location-sharp" size={16} color="#ff4444" />
              <Text style={styles.deliverTo}>Deliver to</Text>
            </View>
            <Text style={styles.location}>Crypto Campus, Bangalore</Text>
          </View>
          <TouchableOpacity onPress={() => navigation.navigate('ProfileTab')}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&q=80' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color="#666" style={{ marginRight: 10 }} />
          <TextInput
            placeholder="Search for restaurants, cuisines..."
            placeholderTextColor="#555"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {/* Offers Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Web3 Exclusive Offers</Text>
          <Text style={styles.sectionEmoji}>✳️</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.offersScroll} contentContainerStyle={{ paddingLeft: 20, paddingRight: 8 }}>
          {OFFERS.map((offer, i) => (
            <View key={i} style={styles.offerCard}>
              <View style={[styles.offerIcon, { backgroundColor: offer.colors[0] }]}>
                <Ionicons name="flash" size={20} color="#ff4444" />
              </View>
              <Text style={styles.offerTitle}>{offer.title}</Text>
              <Text style={styles.offerDesc}>{offer.desc}</Text>
              <View style={styles.offerCodeBadge}>
                <Text style={styles.offerCode}>{offer.code}</Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Categories */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 16 }]}>What's on your mind?</Text>
        <View style={styles.categoriesGrid}>
          {CATEGORIES.map((cat, i) => (
            <TouchableOpacity key={i} style={styles.categoryItem} activeOpacity={0.7}>
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
              </View>
              <Text style={styles.categoryLabel}>{cat.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Restaurants */}
        <Text style={[styles.sectionTitle, { paddingHorizontal: 20, marginBottom: 16 }]}>Restaurants near you</Text>
        {restaurants.map(rest => (
          <TouchableOpacity
            key={rest.id}
            style={styles.restaurantCard}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Restaurant', { restaurant: rest })}
          >
            <Image source={{ uri: rest.image }} style={styles.restImage} />
            <View style={styles.restInfo}>
              <Text style={styles.restName}>{rest.name}</Text>
              <Text style={styles.restMeta}>{rest.categories.join(' • ')}</Text>
              <View style={styles.restRow}>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={12} color="#000" />
                  <Text style={styles.ratingText}>{rest.rating}</Text>
                </View>
                <Text style={styles.restTime}>{rest.deliveryTime}</Text>
                {rest.featured && (
                  <View style={styles.zeroBadge}>
                    <Text style={styles.zeroText}>0% Fee</Text>
                  </View>
                )}
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0a0a0a' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerLeft: {},
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 2 },
  deliverTo: { color: '#888', fontSize: 12 },
  location: { color: '#fff', fontSize: 16, fontWeight: '700' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 12,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  searchInput: { flex: 1, color: '#fff', fontSize: 15 },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 14,
    gap: 8,
  },
  sectionTitle: { color: '#fff', fontSize: 20, fontWeight: '800' },
  sectionEmoji: { fontSize: 18 },
  offersScroll: { marginBottom: 32 },
  offerCard: {
    backgroundColor: '#1a0808',
    borderRadius: 16,
    padding: 18,
    width: 200,
    marginRight: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.2)',
  },
  offerIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  offerTitle: { color: '#ff4444', fontSize: 22, fontWeight: '900', marginBottom: 4 },
  offerDesc: { color: '#aaa', fontSize: 12, marginBottom: 12, lineHeight: 18 },
  offerCodeBadge: {
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#ff4444',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  offerCode: { color: '#ff4444', fontSize: 11, fontWeight: '700', letterSpacing: 1 },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    gap: 12,
    marginBottom: 32,
  },
  categoryItem: {
    width: '30%',
    alignItems: 'center',
  },
  categoryIcon: {
    backgroundColor: '#1a1a1a',
    width: 80,
    height: 80,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryEmoji: { fontSize: 36 },
  categoryLabel: { color: '#ccc', fontSize: 13, fontWeight: '600', textAlign: 'center' },
  restaurantCard: {
    marginHorizontal: 20,
    backgroundColor: '#141414',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  restImage: { width: '100%', height: 150 },
  restInfo: { padding: 14 },
  restName: { color: '#fff', fontSize: 17, fontWeight: '700', marginBottom: 4 },
  restMeta: { color: '#888', fontSize: 13, marginBottom: 10 },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    gap: 3,
  },
  ratingText: { color: '#000', fontWeight: '800', fontSize: 12 },
  restTime: { color: '#888', fontSize: 13 },
  zeroBadge: {
    backgroundColor: 'rgba(255,68,68,0.15)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: 'rgba(255,68,68,0.3)',
  },
  zeroText: { color: '#ff4444', fontSize: 11, fontWeight: '700' },
});
