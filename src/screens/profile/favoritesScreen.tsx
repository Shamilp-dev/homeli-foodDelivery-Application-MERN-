import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useFavorites } from '../../context/FavoritesContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const { width: screenWidth } = Dimensions.get('window');

export default function FavoritesScreen() {
  const router = useRouter();
  const { favorites, toggleFavorite, loadFavorites } = useFavorites();
  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    loadFavorites();
  }, []);

  const handleAddToCart = async (item: any) => {
    if (!isAuthenticated || !user) {
      Alert.alert(
        'Login Required',
        'You need to log in to add items to your cart.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Login', onPress: () => router.push('/(auth)/login') },
        ]
      );
      return;
    }

    try {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
      Alert.alert('Success', `${item.name} added to cart!`);
    } catch (error) {
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  const handleRemoveFavorite = (item: any) => {
    Alert.alert(
      'Remove Favorite',
      `Remove ${item.name} from favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => toggleFavorite(item),
        },
      ]
    );
  };

  const renderFavoriteItem = (item: any, index: number) => {
    const isEven = index % 2 === 0;

    return (
      <View
        key={item.id}
        style={[
          styles.foodItem,
          { marginRight: isEven ? 8 : 0, marginLeft: isEven ? 0 : 8 },
        ]}
      >
        <View style={styles.foodItemContent}>
          <TouchableOpacity
            style={styles.favoriteButton}
            onPress={() => handleRemoveFavorite(item)}
          >
            <MaterialIcons name="favorite" size={24} color="#FF6B47" />
          </TouchableOpacity>

          <View style={styles.foodItemHeader}>
            <Text style={styles.foodPrice}>₹{item.price}</Text>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={10} color="#ffb618ff" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>

          <Image
            source={
              typeof item.image === 'string'
                ? { uri: item.image }
                : item.image
            }
            style={styles.foodImage}
          />

          <View style={styles.foodItemFooter}>
            <View style={styles.foodInfo}>
              <Text style={styles.foodName} numberOfLines={1}>
                {item.name}
              </Text>
              <Text style={styles.foodCategory}>{item.category}</Text>
            </View>
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => handleAddToCart(item)}
            >
              <MaterialIcons name="add-shopping-cart" size={20} color="#FF6B47" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>My Favorites</Text>
          <Text style={styles.headerSubtitle}>{favorites.length} items</Text>
        </View>
        <View style={{ width: 24 }} />
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MaterialIcons name="favorite-border" size={80} color="#CCC" />
          <Text style={styles.emptyText}>No favorites yet</Text>
          <Text style={styles.emptySubtext}>
            Start adding your favorite dishes!
          </Text>
          <TouchableOpacity
            style={styles.explorButton}
            onPress={() => router.push('/(tabs)/dashboard')}
          >
            <Text style={styles.exploreButtonText}>Explore Menu</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.foodGrid}>
            {favorites.map((item, index) => renderFavoriteItem(item, index))}
          </View>
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f6f5f0ff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#fe5227ff',
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#fff' },
  headerSubtitle: {
    fontSize: 12,
    color: '#fff',
    opacity: 0.8,
    marginTop: 2,
  },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
  },
  explorButton: {
    backgroundColor: '#FF6B47',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginTop: 30,
  },
  exploreButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  foodGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  foodItem: { width: (screenWidth - 58) / 2, marginBottom: 15 },
  foodItemContent: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    position: 'relative',
  },
  favoriteButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    zIndex: 10,
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  foodItemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  foodPrice: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  ratingBadge: {
    backgroundColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: { color: '#FFF', fontSize: 12, fontWeight: '600' },
  foodImage: {
    width: '100%',
    height: 100,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: 'cover',
  },
  foodItemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodInfo: {
    flex: 1,
    marginRight: 8,
  },
  foodName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  foodCategory: {
    fontSize: 11,
    color: '#999',
    textTransform: 'capitalize',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f2f5ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});