import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useRouter } from "expo-router"; // ADD THIS

export default function CartScreen() {
  const router = useRouter(); // ADD THIS
  const {
    cartItems,
    cartCount,
    totalAmount,
    updateQuantity,
    removeItem,
    loadCart,
  } = useCart();

  useEffect(() => {
    loadCart();
  }, []);

  // Helper function inside CartScreen.tsx
  const getImageSource = (imagePath: string) => {
    const imageMap: Record<string, any> = {
      //breakfast
      "breakfast/idli.png": require("../../../assets/images/breakfast/idli.png"),
      "breakfast/masaladosa.png": require("../../../assets/images/breakfast/masaladosa.png"),
      "breakfast/ragidosa.png": require("../../../assets/images/breakfast/ragidosa.png"),
      "breakfast/porotta.png": require("../../../assets/images/breakfast/porotta.png"),
      "breakfast/burger.png": require("../../../assets/images/breakfast/burger.png"),
      "breakfast/sandwich.png": require("../../../assets/images/breakfast/sandwich.png"),

      //lunch
      "lunch/chickenbiriyani.png": require("../../../assets/images/lunch/chickenbiriyani.png"),
      "lunch/meals.png": require("../../../assets/images/lunch/meals.png"),
      "lunch/pizza.png": require("../../../assets/images/lunch/pizza.png"),
      "lunch/chickencurry.png": require("../../../assets/images/lunch/chickencurry.png"),
      "lunch/fishcurry.png": require("../../../assets/images/lunch/fishcurry.png"),
      "lunch/paneerbuttermasala.png": require("../../../assets/images/lunch/paneerbuttermasala.png"),

      //dinner
      "dinner/grilledchicken.png": require("../../../assets/images/dinner/grilledchicken.png"),
      "dinner/muttonbiriyani.png": require("../../../assets/images/dinner/muttonbiriyani.png"),
      "dinner/chickenbiriyani.png": require("../../../assets/images/dinner/chickenbiriyani.png"),
      "dinner/meals.png": require("../../../assets/images/dinner/meals.png"),
      "dinner/pizza.png": require("../../../assets/images/dinner/pizza.png"),
      "dinner/chickencurry.png": require("../../../assets/images/dinner/chickencurry.png"),
      "dinner/fishcurry.png": require("../../../assets/images/dinner/fishcurry.png"),

      //dessert
      "dessert/pazhampori.png": require("../../../assets/images/dessert/pazhampori.png"),
      "dessert/samosa.png": require("../../../assets/images/dessert/samosa.png"),
      "dessert/juice.png": require("../../../assets/images/dessert/juice.png"),
      "dessert/chikkushake.png": require("../../../assets/images/dessert/chikkushake.png"),
      "dessert/gulabjamun.png": require("../../../assets/images/dessert/gulabjamun.png"),
      "dessert/vanillaicecream.png": require("../../../assets/images/dessert/vanillaicecream.png"),
    };

    // Return the required image or a fallback
    return (
      imageMap[imagePath] ||
      require("../../../assets/images/breakfast/idli.png")
    );
  };

  const handleUpdateQuantity = async (foodItemId: string, change: number) => {
    const item = cartItems.find((i) => i.foodItemId === foodItemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        await updateQuantity(foodItemId, newQuantity);
      } else {
        handleRemoveItem(foodItemId);
      }
    }
  };

  const handleRemoveItem = (foodItemId: string) => {
    Alert.alert("Remove Item", "Are you sure you want to remove this item?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => await removeItem(foodItemId),
      },
    ]);
  };

  // UPDATED CHECKOUT HANDLER
  const handleCheckout = () => {
    if (cartItems.length === 0) {
      Alert.alert("Empty Cart", "Please add some items to your cart first.");
      return;
    }
    // Navigate to checkout screen
    router.push("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={["left", "right"]}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Your Cart</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="shopping-cart" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptySubtitle}>
            Add some delicious items from our menu to get started!
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        <Text style={styles.headerSubtitle}>{cartCount} items</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {cartItems.map((item) => (
          <View key={item.foodItemId} style={styles.cartItem}>
            <Image
              source={getImageSource(item.image)}
              style={styles.itemImage}
            />

            <View style={styles.itemDetails}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>₹{item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.foodItemId, -1)}
              >
                <MaterialIcons name="remove" size={20} color="#FF6B47" />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => handleUpdateQuantity(item.foodItemId, 1)}
              >
                <MaterialIcons name="add" size={20} color="#FF6B47" />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveItem(item.foodItemId)}
            >
              <MaterialIcons name="delete" size={20} color="#FF6B47" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.checkoutSection}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>₹{totalAmount}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <LinearGradient
            colors={["#f73706ff", "#ff8352ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.checkoutGradient}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f5f0ff" },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fe5227ff",
  },
  headerTitle: { fontSize: 28, fontWeight: "bold", color: "#fff" },
  headerSubtitle: { fontSize: 14, color: "#fff", marginTop: 5 },
  content: { flex: 1, paddingHorizontal: 20 },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    marginTop: 20,
  },
  itemImage: { width: 60, height: 60, borderRadius: 30, marginRight: 15 },
  itemDetails: { flex: 1 },
  itemName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  itemPrice: { fontSize: 14, color: "#666" },
  quantityContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 15,
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f0f0f0",
    alignItems: "center",
    justifyContent: "center",
  },
  quantityText: {
    fontSize: 16,
    fontWeight: "bold",
    marginHorizontal: 15,
    color: "#333",
  },
  removeButton: { padding: 8 },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    lineHeight: 24,
  },
  checkoutSection: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  totalLabel: { fontSize: 18, color: "#333" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#FF6B47" },
  checkoutButton: { borderRadius: 25, overflow: "hidden" },
  checkoutGradient: { paddingVertical: 15, alignItems: "center" },
  checkoutButtonText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
});