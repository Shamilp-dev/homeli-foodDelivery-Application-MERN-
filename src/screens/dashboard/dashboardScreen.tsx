import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { FoodItem, CategoryItem } from "../../types";
import { apiService } from "../../services/api";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "expo-router";
import { useNotifications } from "../../context/NotificationContext";
import { useFavorites } from "../../context/FavoritesContext";

const { width: screenWidth } = Dimensions.get("window");

interface LocalFoodItem {
  id: string;
  name: string;
  price: number;
  rating: number;
  image: any;
  category?: string;
  description?: string;
}

type SortOption =
  | "default"
  | "price-low"
  | "price-high"
  | "rating-high"
  | "rating-low";

const Dashboard: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState("Breakfast");
  const [searchText, setSearchText] = useState("");
  const [foodItems, setFoodItems] = useState<LocalFoodItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<LocalFoodItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState("Bangalore");
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showFoodDetailModal, setShowFoodDetailModal] = useState(false);
  const [selectedFood, setSelectedFood] = useState<LocalFoodItem | null>(null);
  const [currentPromoIndex, setCurrentPromoIndex] = useState(0);
  const [sortOption, setSortOption] = useState<SortOption>("default");

  const { addToCart } = useCart();
  const { user, isAuthenticated } = useAuth();
  const { unreadCount } = useNotifications();
  const { isFavorite, toggleFavorite } = useFavorites();
  const router = useRouter();
  const promoTimerRef = useRef<any>(null);

  const locations = ["Bangalore", "Kochi", "Chennai"];

  const promoImages = [
    require("../../../assets/images/promo/promo1.png"),
    require("../../../assets/images/promo/promo2.png"),
    require("../../../assets/images/promo/promo3.png"),
  ];

  const getImageSource = (imagePath: string) => {
    const imageMap: { [key: string]: any } = {
      "breakfast/idli.png": require("../../../assets/images/breakfast/idli.png"),
      "breakfast/masaladosa.png": require("../../../assets/images/breakfast/masaladosa.png"),
      "breakfast/ragidosa.png": require("../../../assets/images/breakfast/ragidosa.png"),
      "breakfast/porotta.png": require("../../../assets/images/breakfast/porotta.png"),
      "breakfast/burger.png": require("../../../assets/images/breakfast/burger.png"),
      "breakfast/sandwich.png": require("../../../assets/images/breakfast/sandwich.png"),
      "lunch/chickenbiriyani.png": require("../../../assets/images/lunch/chickenbiriyani.png"),
      "lunch/meals.png": require("../../../assets/images/lunch/meals.png"),
      "lunch/pizza.png": require("../../../assets/images/lunch/pizza.png"),
      "lunch/chickencurry.png": require("../../../assets/images/lunch/chickencurry.png"),
      "lunch/fishcurry.png": require("../../../assets/images/lunch/fishcurry.png"),
      "lunch/paneerbuttermasala.png": require("../../../assets/images/lunch/paneerbuttermasala.png"),
      "dinner/grilledchicken.png": require("../../../assets/images/dinner/grilledchicken.png"),
      "dinner/muttonbiriyani.png": require("../../../assets/images/dinner/muttonbiriyani.png"),
      "dinner/chickenbiriyani.png": require("../../../assets/images/dinner/chickenbiriyani.png"),
      "dinner/meals.png": require("../../../assets/images/dinner/meals.png"),
      "dinner/pizza.png": require("../../../assets/images/dinner/pizza.png"),
      "dinner/chickencurry.png": require("../../../assets/images/dinner/chickencurry.png"),
      "dinner/fishcurry.png": require("../../../assets/images/dinner/fishcurry.png"),
      "dessert/pazhampori.png": require("../../../assets/images/dessert/pazhampori.png"),
      "dessert/samosa.png": require("../../../assets/images/dessert/samosa.png"),
      "dessert/juice.png": require("../../../assets/images/dessert/juice.png"),
      "dessert/chikkushake.png": require("../../../assets/images/dessert/chikkushake.png"),
      "dessert/gulabjamun.png": require("../../../assets/images/dessert/gulabjamun.png"),
      "dessert/vanillaicecream.png": require("../../../assets/images/dessert/vanillaicecream.png"),
    };
    return (
      imageMap[imagePath] ||
      require("../../../assets/images/breakfast/idli.png")
    );
  };

  const sampleData = {
    breakfast: [
      {
        id: "breakfast-1",
        name: "Ragi Dosa",
        price: 35,
        rating: 4.7,
        image: require("../../../assets/images/breakfast/ragidosa.png"),
        category: "breakfast",
        description:
          "Healthy finger millet crepe served with coconut chutney and sambar",
      },
      {
        id: "breakfast-2",
        name: "Masala Dosa",
        price: 45,
        rating: 4.9,
        image: require("../../../assets/images/breakfast/masaladosa.png"),
        category: "breakfast",
        description: "Crispy rice crepe filled with spiced potato masala",
      },
      {
        id: "breakfast-3",
        name: "Porotta",
        price: 55,
        rating: 4.6,
        image: require("../../../assets/images/breakfast/porotta.png"),
        category: "breakfast",
        description: "Flaky layered bread perfect with curry",
      },
      {
        id: "breakfast-4",
        name: "Burger",
        price: 25,
        rating: 4.8,
        image: require("../../../assets/images/breakfast/burger.png"),
        category: "breakfast",
        description: "Classic burger with fresh vegetables and sauce",
      },
      {
        id: "breakfast-5",
        name: "Sandwich",
        price: 25,
        rating: 4.8,
        image: require("../../../assets/images/breakfast/sandwich.png"),
        category: "breakfast",
        description: "Fresh sandwich with multiple fillings",
      },
      {
        id: "breakfast-6",
        name: "Soft Idli",
        price: 25,
        rating: 4.8,
        image: require("../../../assets/images/breakfast/idli.png"),
        category: "breakfast",
        description: "Steamed rice cakes served with sambar and chutney",
      },
    ],
    lunch: [
      {
        id: "lunch-1",
        name: "Chicken Biryani",
        price: 125,
        rating: 4.8,
        image: require("../../../assets/images/lunch/chickenbiriyani.png"),
        category: "lunch",
        description:
          "Fragrant basmati rice cooked with tender chicken and aromatic spices",
      },
      {
        id: "lunch-2",
        name: "Veg Meals",
        price: 85,
        rating: 4.5,
        image: require("../../../assets/images/lunch/meals.png"),
        category: "lunch",
        description: "Complete meal with rice, sambar, rasam, and vegetables",
      },
      {
        id: "lunch-3",
        name: "Paneer Butter Masala",
        price: 110,
        rating: 4.7,
        image: require("../../../assets/images/lunch/paneerbuttermasala.png"),
        category: "lunch",
        description: "Creamy paneer curry with rich tomato gravy",
      },
      {
        id: "lunch-4",
        name: "Pizza",
        price: 75,
        rating: 4.4,
        image: require("../../../assets/images/lunch/pizza.png"),
        category: "lunch",
        description: "Italian pizza with fresh toppings",
      },
      {
        id: "lunch-5",
        name: "Chicken Curry",
        price: 75,
        rating: 4.4,
        image: require("../../../assets/images/lunch/chickencurry.png"),
        category: "lunch",
        description: "Spicy curry with tender chicken pieces",
      },
      {
        id: "lunch-6",
        name: "Fish Curry",
        price: 75,
        rating: 4.4,
        image: require("../../../assets/images/lunch/fishcurry.png"),
        category: "lunch",
        description: "Traditional curry with fresh fish",
      },
    ],
    dinner: [
      {
        id: "dinner-1",
        name: "Grilled Chicken",
        price: 180,
        rating: 4.8,
        image: require("../../../assets/images/dinner/grilledchicken.png"),
        category: "dinner",
        description: "Perfectly grilled chicken with herbs and spices",
      },
      {
        id: "dinner-2",
        name: "Fish Curry",
        price: 145,
        rating: 4.6,
        image: require("../../../assets/images/dinner/fishcurry.png"),
        category: "dinner",
        description: "Delicious fish curry with coconut gravy",
      },
      {
        id: "dinner-3",
        name: "Chicken Biriyani",
        price: 185,
        rating: 4.7,
        image: require("../../../assets/images/dinner/chickenbiriyani.png"),
        category: "dinner",
        description: "Aromatic biryani with succulent chicken",
      },
      {
        id: "dinner-4",
        name: "Veg Meals",
        price: 95,
        rating: 4.5,
        image: require("../../../assets/images/dinner/meals.png"),
        category: "dinner",
        description: "Vegetarian meal with variety of dishes",
      },
      {
        id: "dinner-5",
        name: "Chicken Curry",
        price: 130,
        rating: 4.6,
        image: require("../../../assets/images/dinner/chickencurry.png"),
        category: "dinner",
        description: "Spicy chicken curry with rich gravy",
      },
      {
        id: "dinner-6",
        name: "Mutton Biriyani",
        price: 195,
        rating: 4.6,
        image: require("../../../assets/images/dinner/muttonbiriyani.png"),
        category: "dinner",
        description: "Rich mutton biryani with aromatic spices",
      },
    ],
    dessert: [
      {
        id: "dessert-1",
        name: "Pazham Pori",
        price: 20,
        rating: 4.5,
        image: require("../../../assets/images/dessert/pazhampori.png"),
        category: "dessert",
        description: "Crispy banana fritters",
      },
      {
        id: "dessert-2",
        name: "Samosa",
        price: 15,
        rating: 4.6,
        image: require("../../../assets/images/dessert/samosa.png"),
        category: "dessert",
        description: "Crispy samosa with spicy filling",
      },
      {
        id: "dessert-3",
        name: "Juice",
        price: 30,
        rating: 4.4,
        image: require("../../../assets/images/dessert/juice.png"),
        category: "dessert",
        description: "Fresh fruit juice",
      },
      {
        id: "dessert-4",
        name: "Chikku Shake",
        price: 45,
        rating: 4.7,
        image: require("../../../assets/images/dessert/chikkushake.png"),
        category: "dessert",
        description: "Thick and creamy chikku shake",
      },
      {
        id: "dessert-5",
        name: "Gulab Jamun",
        price: 25,
        rating: 4.8,
        image: require("../../../assets/images/dessert/gulabjamun.png"),
        category: "dessert",
        description: "Sweet milk-solid dumplings in sugar syrup",
      },
      {
        id: "dessert-6",
        name: "Vanilla Ice Cream",
        price: 40,
        rating: 4.6,
        image: require("../../../assets/images/dessert/vanillaicecream.png"),
        category: "dessert",
        description: "Creamy vanilla ice cream",
      },
    ],
  };

  const categories: CategoryItem[] = [
    {
      id: "1",
      name: "Breakfast",
      icon: require("../../../assets/images/categories/burger-icon.png"),
    },
    {
      id: "2",
      name: "Lunch",
      icon: require("../../../assets/images/categories/noodles-icon.png"),
    },
    {
      id: "3",
      name: "Dinner",
      icon: require("../../../assets/images/categories/biriyani-icon.png"),
    },
    {
      id: "4",
      name: "Dessert",
      icon: require("../../../assets/images/categories/dessert-icon.png"),
    },
  ];

  useEffect(() => {
    promoTimerRef.current = setInterval(() => {
      setCurrentPromoIndex((prev) => (prev + 1) % promoImages.length);
    }, 3000);

    return () => {
      if (promoTimerRef.current) {
        clearInterval(promoTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    loadFoodItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [activeCategory, searchText, foodItems, sortOption]);

  const loadFoodItems = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getAllFoodItems();

      if (response.success && response.data && response.data.length > 0) {
        const apiItems: LocalFoodItem[] = response.data.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          rating: item.rating,
          image: getImageSource(item.image),
          category: item.category,
          description: item.description,
        }));
        setFoodItems(apiItems);
      } else {
        const allSampleItems = [
          ...sampleData.breakfast,
          ...sampleData.lunch,
          ...sampleData.dinner,
          ...sampleData.dessert,
        ];
        setFoodItems(allSampleItems);
      }
    } catch (err) {
      const allSampleItems = [
        ...sampleData.breakfast,
        ...sampleData.lunch,
        ...sampleData.dinner,
        ...sampleData.dessert,
      ];
      setFoodItems(allSampleItems);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = foodItems;

    if (activeCategory.toLowerCase() !== "all") {
      filtered = filtered.filter(
        (item) => item.category?.toLowerCase() === activeCategory.toLowerCase()
      );
    }

    if (searchText.trim()) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(searchText.toLowerCase()) ||
          (item.category &&
            item.category.toLowerCase().includes(searchText.toLowerCase())) ||
          (item.description &&
            item.description.toLowerCase().includes(searchText.toLowerCase()))
      );
    }

    switch (sortOption) {
      case "price-low":
        filtered = [...filtered].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered = [...filtered].sort((a, b) => b.price - a.price);
        break;
      case "rating-high":
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case "rating-low":
        filtered = [...filtered].sort((a, b) => a.rating - b.rating);
        break;
      default:
        break;
    }

    setFilteredItems(filtered);
  };

  const handleCategoryPress = (categoryName: string) => {
    setActiveCategory(categoryName);
  };

  const handleFoodItemPress = (item: LocalFoodItem) => {
    setSelectedFood(item);
    setShowFoodDetailModal(true);
  };

  const handleAddToCart = async (item: LocalFoodItem) => {
    if (!isAuthenticated || !user) {
      Alert.alert(
        "Login Required",
        "You need to log in to add items to your cart.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Login", onPress: () => router.push("/(auth)/login") },
        ]
      );
      return;
    }

    try {
      await addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.category
          ? `${item.category}/${item.name.toLowerCase().replace(/ /g, "")}.png`
          : "breakfast/idli.png",
      });
      Alert.alert("Success", `${item.name} added to cart!`);
      setShowFoodDetailModal(false);
    } catch (error) {
      Alert.alert("Error", "Failed to add item to cart");
    }
  };

  const handleNotificationPress = () => {
    router.push("/notification");
  };

  const handleToggleFavorite = async () => {
    if (!selectedFood) return;

    const favoriteItem = {
      id: selectedFood.id,
      name: selectedFood.name,
      price: selectedFood.price,
      rating: selectedFood.rating,
      image: selectedFood.category
        ? `${selectedFood.category}/${selectedFood.name
            .toLowerCase()
            .replace(/ /g, "")}.png`
        : "breakfast/idli.png",
      category: selectedFood.category || "",
      description: selectedFood.description || "",
    };

    await toggleFavorite(favoriteItem);
  };

  const handleOrderNowPress = () => {
    router.push("/(tabs)/explore");
  };

  const renderCategoryItem = (item: CategoryItem) => {
    const isActive = item.name === activeCategory;

    return (
      <TouchableOpacity
        key={item.id}
        style={[styles.categoryItem, isActive && styles.categoryItemActive]}
        onPress={() => handleCategoryPress(item.name)}
      >
        <Image source={item.icon} style={styles.categoryIcon} />
      </TouchableOpacity>
    );
  };

  const renderFoodItem = (item: LocalFoodItem, index: number) => {
    const isEven = index % 2 === 0;

    return (
      <TouchableOpacity
        key={item.id}
        style={[
          styles.foodItem,
          { marginRight: isEven ? 8 : 0, marginLeft: isEven ? 0 : 8 },
        ]}
        onPress={() => handleFoodItemPress(item)}
      >
        <View style={styles.foodItemContent}>
          <View style={styles.foodItemHeader}>
            <Text style={styles.foodPrice}>₹{item.price}</Text>
            <View style={styles.ratingBadge}>
              <MaterialIcons name="star" size={10} color="#ffb618ff" />
              <Text style={styles.ratingText}>{item.rating}</Text>
            </View>
          </View>
          <Image source={item.image} style={styles.foodImage} />
          <View style={styles.foodItemFooter}>
            <Text style={styles.foodName}>{item.name}</Text>
            <TouchableOpacity
              style={styles.addButton}
              onPress={(e) => {
                e.stopPropagation();
                handleAddToCart(item);
              }}
            >
              <MaterialIcons name="add" size={20} color="#FF6B47" />
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B47" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        stickyHeaderIndices={[1]}
      >
        <LinearGradient
          colors={["#f72606ff", "#f74e06ff", "#ff8352ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.headerSection}
        >
          <View style={styles.topBar}>
            <TouchableOpacity
              style={styles.locationContainer}
              onPress={() => setShowLocationModal(true)}
              activeOpacity={0.7}
            >
              <MaterialIcons name="location-on" size={20} color="#FFF" />
              <View>
                <Text style={styles.locationLabel}>Location</Text>
                <Text style={styles.locationText}>{selectedLocation}</Text>
              </View>
              <MaterialIcons
                name="keyboard-arrow-down"
                size={20}
                color="#FFF"
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.notificationButton}
              onPress={handleNotificationPress}
            >
              <MaterialIcons name="notifications" size={24} color="#FFF" />
              {unreadCount > 0 && (
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>
                    {unreadCount}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.promoSection}>
            <View style={styles.promoTextContainer}>
              <Text style={styles.promoTitle}>
                Promo Buy 1,{"\n"}Get 1 More
              </Text>
              <TouchableOpacity
                style={styles.orderButton}
                onPress={handleOrderNowPress}
              >
                <Text style={styles.orderButtonText}>Order now</Text>
              </TouchableOpacity>
              <View style={styles.paginationDots}>
                {promoImages.map((_, index) => (
                  <View
                    key={index}
                    style={[
                      styles.dot,
                      currentPromoIndex === index && styles.activeDot,
                    ]}
                  />
                ))}
              </View>
            </View>
            <View style={styles.promoImageContainer}>
              <Image
                source={promoImages[currentPromoIndex]}
                style={styles.promoImage}
                resizeMode="cover"
              />
            </View>
          </View>
        </LinearGradient>

        <View style={styles.stickySection}>
          <View style={styles.searchSection}>
            <View style={styles.searchContainer}>
              <MaterialIcons
                name="search"
                size={24}
                color="#999"
                style={styles.searchIcon}
              />
              <TextInput
                style={styles.searchInput}
                placeholder="Search food, restaurant, etc."
                placeholderTextColor="#999"
                value={searchText}
                onChangeText={setSearchText}
              />
              <TouchableOpacity
                style={styles.filterButton}
                onPress={() => setShowFilterModal(true)}
              >
                <MaterialIcons name="tune" size={20} color="#FF6B47" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.categoriesSection}>
            <View style={styles.categoriesHeader}>
              {categories.map(renderCategoryItem)}
            </View>
            <View style={styles.categoryLabels}>
              {categories.map((item) => (
                <Text
                  key={`label-${item.id}`}
                  style={[
                    styles.categoryLabel,
                    item.name === activeCategory && styles.categoryLabelActive,
                  ]}
                >
                  {item.name}
                </Text>
              ))}
            </View>
          </View>
        </View>

        <View style={styles.recommendedSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>{activeCategory} Items</Text>
            <Text style={styles.itemCount}>({filteredItems.length} items)</Text>
          </View>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#FF6B47" />
            </View>
          ) : filteredItems.length === 0 ? (
            <View style={styles.emptyContainer}>
              <MaterialIcons name="restaurant" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No items found</Text>
            </View>
          ) : (
            <View style={styles.foodGrid}>
              {filteredItems.map((item, index) => renderFoodItem(item, index))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Location Modal */}
      <Modal
        visible={showLocationModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowLocationModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Location</Text>
              <TouchableOpacity onPress={() => setShowLocationModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            {locations.map((location) => (
              <TouchableOpacity
                key={location}
                style={styles.locationOption}
                onPress={() => {
                  setSelectedLocation(location);
                  setShowLocationModal(false);
                }}
              >
                <MaterialIcons name="location-on" size={24} color="#FF6B47" />
                <Text style={styles.locationOptionText}>{location}</Text>
                {selectedLocation === location && (
                  <MaterialIcons name="check" size={24} color="#FF6B47" />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Modal>

      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Sort By</Text>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSortOption("default");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Default</Text>
              {sortOption === "default" && (
                <MaterialIcons name="check" size={24} color="#FF6B47" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSortOption("price-low");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Price: Low to High</Text>
              {sortOption === "price-low" && (
                <MaterialIcons name="check" size={24} color="#FF6B47" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSortOption("price-high");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Price: High to Low</Text>
              {sortOption === "price-high" && (
                <MaterialIcons name="check" size={24} color="#FF6B47" />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.filterOption}
              onPress={() => {
                setSortOption("rating-high");
                setShowFilterModal(false);
              }}
            >
              <Text style={styles.filterOptionText}>Rating: Low to High</Text>
              {sortOption === "rating-low" && (
                <MaterialIcons name="check" size={24} color="#FF6B47" />
              )}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Food Detail Modal */}
      <Modal
        visible={showFoodDetailModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFoodDetailModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.foodDetailModal}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShowFoodDetailModal(false)}
            >
              <MaterialIcons name="close" size={28} color="#333" />
            </TouchableOpacity>
            {selectedFood && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Image
                  source={selectedFood.image}
                  style={styles.foodDetailImage}
                />
                <View style={styles.foodDetailContent}>
                  <Text style={styles.foodDetailName}>{selectedFood.name}</Text>
                  <View style={styles.foodDetailRow}>
                    <View style={styles.priceContainer}>
                      <Text style={styles.foodDetailPrice}>
                        ₹{selectedFood.price}
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={styles.favoriteIconButton}
                      onPress={handleToggleFavorite}
                    >
                      <MaterialIcons
                        name={
                          isFavorite(selectedFood.id)
                            ? "favorite"
                            : "favorite-border"
                        }
                        size={28}
                        color="#FF6B47"
                      />
                    </TouchableOpacity>
                    <View style={styles.ratingContainer}>
                      <MaterialIcons name="star" size={20} color="#ffb618ff" />
                      <Text style={styles.foodDetailRating}>
                        {selectedFood.rating}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.divider} />
                  <Text style={styles.aboutTitle}>About</Text>
                  <Text style={styles.foodDetailDescription}>
                    {selectedFood.description}
                  </Text>
                  <View style={styles.categoryBadge}>
                    <MaterialIcons
                      name="restaurant"
                      size={16}
                      color="#FF6B47"
                    />
                    <Text style={styles.categoryBadgeText}>
                      {selectedFood.category}
                    </Text>
                  </View>
                </View>
              </ScrollView>
            )}
            <View style={styles.foodDetailFooter}>
              <TouchableOpacity
                style={styles.addToCartButton}
                onPress={() => selectedFood && handleAddToCart(selectedFood)}
              >
                <MaterialIcons name="shopping-cart" size={24} color="#FFF" />
                <Text style={styles.addToCartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fbf8eeff",
  },
  headerSection: {
    paddingTop: 35,
    paddingHorizontal: 20,
    paddingBottom: 5,
    height: 220,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  locationLabel: {
    color: "#FFF",
    fontSize: 11,
    opacity: 0.9,
  },
  locationText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "600",
  },
  notificationButton: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 2,
    right: 2,
    backgroundColor: "#FF0000",
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  notificationBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  promoSection: {
    flexDirection: "row",
    alignItems: "center",
  },
  promoTextContainer: { flex: 1 },
  promoTitle: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    lineHeight: 25,
    bottom: 25,
  },
  orderButton: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 15,
    bottom: 30,
  },
  orderButtonText: { color: "#fe5429ff", fontSize: 12, fontWeight: "600" },
  paginationDots: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
  },
  activeDot: { backgroundColor: "#FFF" },
  promoImageContainer: {
    width: 200,
    height: 160,
    borderRadius: 15,
    overflow: "hidden",
    marginLeft: 15,
    bottom:30,
    left:18,
  },
  promoImage: {
     width: "100%", 
     height: "100%",
    
    },
  stickySection: { backgroundColor: "#fbf8eeff", zIndex: 1 },
  searchSection: {
    paddingHorizontal: 20,
    marginTop: -20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 30,
    borderWidth: 3,
    borderColor: "#ff3002cc",
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  searchIcon: { marginRight: 12 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  filterButton: { padding: 4 },
  categoriesSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
    backgroundColor: "#fbf8eeff",
  },
  categoriesHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  categoryItem: {
    width: 65,
    height: 65,
    borderRadius: 24,
    backgroundColor: "#ffffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  categoryItemActive: { backgroundColor: "#FF6B47" },
  categoryIcon: { width: 45, height: 55, resizeMode: "contain" },
  categoryLabels: { flexDirection: "row", justifyContent: "space-between" },
  categoryLabel: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    width: 70,
  },
  categoryLabelActive: { color: "#333", fontWeight: "600" },
  recommendedSection: { paddingHorizontal: 20, paddingBottom: 100 },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginRight: 8,
  },
  itemCount: { fontSize: 14, color: "#666", fontStyle: "italic" },
  foodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  foodItem: { width: (screenWidth - 58) / 2, marginBottom: 10 },
  foodItemContent: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  foodItemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  foodPrice: { fontSize: 18, fontWeight: "bold", color: "#333" },
  ratingBadge: {
    backgroundColor: "#333",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  ratingText: { color: "#FFF", fontSize: 12, fontWeight: "600" },
  foodImage: {
    width: "100%",
    height: 80,
    borderRadius: 12,
    marginBottom: 12,
    resizeMode: "cover",
  },
  foodItemFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  foodName: { fontSize: 14, fontWeight: "600", color: "#333", flex: 1 },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f2f5ff",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 8,
  },
  loadingContainer: { alignItems: "center", paddingVertical: 50 },
  emptyContainer: { alignItems: "center", paddingVertical: 50 },
  emptyText: { marginTop: 10, color: "#666", fontSize: 16 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: "70%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  locationOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  locationOptionText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    marginLeft: 15,
  },
  filterOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  filterOptionText: {
    fontSize: 16,
    color: "#333",
  },
  foodDetailModal: {
    backgroundColor: "#FFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: 20,
  },
  closeButton: {
    position: "absolute",
    top: 15,
    right: 15,
    zIndex: 10,
    backgroundColor: "#FFF",
    borderRadius: 10,
    padding: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5,
  },
  foodDetailImage: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
  },
  foodDetailContent: {
    padding: 20,
  },
  foodDetailName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  foodDetailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  priceContainer: {
    backgroundColor: "#FF6B47",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 10,
  },
  foodDetailPrice: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFF",
  },
  favoriteIconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#FFF0ED",
    justifyContent: "center",
    alignItems: "center",
    right: 50,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF8E1",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    gap: 5,
  },
  foodDetailRating: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#E0E0E0",
    marginVertical: 20,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  foodDetailDescription: {
    fontSize: 15,
    color: "#666",
    lineHeight: 22,
    marginBottom: 20,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0ED",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: "flex-start",
    gap: 5,
  },
  categoryBadgeText: {
    fontSize: 14,
    color: "#FF6B47",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  foodDetailFooter: {
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  addToCartButton: {
    backgroundColor: "#FF6B47",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    borderRadius: 12,
    gap: 10,
  },
  addToCartText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Dashboard;
