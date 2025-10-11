import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";

const { width: screenWidth } = Dimensions.get("window");

export default function ExploreScreen() {
  const [searchText, setSearchText] = useState("");

  const exploreCategories = [
    { id: "1", name: "Trending", icon: "trending-up", color: "#FF6B47" },
    { id: "2", name: "Near Me", icon: "location-on", color: "#4CAF50" },
    { id: "3", name: "Top Rated", icon: "star", color: "#FFC107" },
    { id: "4", name: "Fast Food", icon: "fastfood", color: "#9C27B0" },
  ];

  const featuredRestaurants = [
    {
      id: "1",
      name: "Spice Kitchen",
      rating: 4.8,
      cuisine: "Indian",
      image: "restaurant1.png",
    },
    {
      id: "2",
      name: "Pizza Corner",
      rating: 4.6,
      cuisine: "Italian",
      image: "restaurant2.png",
    },
    {
      id: "3",
      name: "Burger House",
      rating: 4.7,
      cuisine: "American",
      image: "restaurant3.png",
    },
  ];

  // 👇 mapping restaurant image names to actual files
  const restaurantImages: Record<string, any> = {
    "restaurant1.png": require("../../../assets/images/restaurants/restaurant1.jpg"),
    "restaurant2.png": require("../../../assets/images/restaurants/restaurant2.jpg"),
    "restaurant3.png": require("../../../assets/images/restaurants/restaurant3.jpg"),
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      {/* Header */}
      <LinearGradient
        colors={["#f73706ff", "#ff8352ff"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <Text style={styles.headerSubtitle}>
          Discover new restaurants and deals
        </Text>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <MaterialIcons name="search" size={20} color="#999" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search restaurants, cuisines..."
            placeholderTextColor="#999"
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Explore Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Explore Categories</Text>
          <View style={styles.categoriesGrid}>
            {exploreCategories.map((category) => (
              <TouchableOpacity key={category.id} style={styles.categoryCard}>
                <View
                  style={[
                    styles.categoryIcon,
                    { backgroundColor: category.color },
                  ]}
                >
                  <MaterialIcons
                    name={category.icon as any}
                    size={24}
                    color="#FFF"
                  />
                </View>
                <Text style={styles.categoryName}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Featured Restaurants */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Featured Restaurants</Text>
          {featuredRestaurants.map((restaurant) => (
            <TouchableOpacity key={restaurant.id} style={styles.restaurantCard}>
              <Image
                source={restaurantImages[restaurant.image]} // ✅ use mapping
                style={styles.restaurantImage}
                resizeMode="cover"
              />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <Text style={styles.restaurantCuisine}>
                  {restaurant.cuisine} Cuisine
                </Text>
                <View style={styles.ratingContainer}>
                  <MaterialIcons name="star" size={16} color="#FFC107" />
                  <Text style={styles.ratingText}>{restaurant.rating}</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        {/* Coming Soon Message */}
        <View style={styles.comingSoonContainer}>
          <MaterialIcons name="construction" size={48} color="#FF6B47" />
          <Text style={styles.comingSoonTitle}>More Features Coming Soon!</Text>
          <Text style={styles.comingSoonText}>
            We are working on exciting new features like restaurant reviews,
            special offers, and personalized recommendations.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF" },
  header: { padding: 16 },
  headerSubtitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 12,
    marginTop: 60,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 25,
    paddingHorizontal: 10,
    height: 45,
    width:300,
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#272624ff" },
  content: { flex: 1, padding: 16 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 12 },
  categoriesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  categoryCard: {
    width: (screenWidth - 64) / 2,
    backgroundColor: "#F5F5F5",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    left: 10,
  },
  categoryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: { fontSize: 14, fontWeight: "500", color: "#333" },
  restaurantCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  restaurantImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  restaurantInfo: { flex: 1 },
  restaurantName: { fontSize: 16, fontWeight: "600", color: "#333" },
  restaurantCuisine: { fontSize: 13, color: "#777", marginTop: 2 },
  ratingContainer: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { marginLeft: 4, fontSize: 13, color: "#333" },
  comingSoonContainer: {
    alignItems: "center",
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  comingSoonTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 8,
    color: "#333",
  },
  comingSoonText: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    marginTop: 4,
  },
});
