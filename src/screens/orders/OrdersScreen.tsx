import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import {
  getOrdersByPhone,
  cancelOrder,
} from "../../services/orderService";

export default function OrdersScreen() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      Alert.alert("Login Required", "Please log in to view your orders", [
        { text: "OK", onPress: () => router.replace("/") }
      ]);
      return;
    }
    loadOrders();
  }, []);

  const loadOrders = async () => {
    if (!user?.phone) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const userOrders = await getOrdersByPhone(user.phone);
      setOrders(userOrders);
    } catch (error) {
      console.error("Error loading orders:", error);
      Alert.alert("Error", "Failed to load orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadOrders();
    setRefreshing(false);
  };

  const handleCancelOrder = (orderId: string) => {
    Alert.alert(
      "Cancel Order",
      "Are you sure you want to cancel this order?",
      [
        { text: "No", style: "cancel" },
        {
          text: "Yes, Cancel",
          style: "destructive",
          onPress: async () => {
            try {
              await cancelOrder(orderId);
              Alert.alert("Success", "Order cancelled successfully");
              loadOrders();
            } catch (error: any) {
              Alert.alert("Error", error.message || "Failed to cancel order");
            }
          },
        },
      ]
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "#FFA500";
      case "confirmed":
        return "#4169E1";
      case "preparing":
        return "#9370DB";
      case "out_for_delivery":
        return "#FF6B47";
      case "delivered":
        return "#32CD32";
      case "cancelled":
        return "#DC143C";
      default:
        return "#666";
    }
  };

  const getStatusText = (status: string) => {
    return status.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "#32CD32";
      case "pending":
        return "#FFA500";
      case "processing":
        return "#4169E1";
      case "failed":
        return "#DC143C";
      default:
        return "#666";
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = new Date(timestamp);
    return date.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const canCancelOrder = (order: any) => {
    return order.orderStatus === "pending" || order.orderStatus === "confirmed";
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B47" />
          <Text style={styles.loadingText}>Loading orders...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (orders.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backButton}
          >
            <MaterialIcons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Orders</Text>
        </View>
        <View style={styles.emptyContainer}>
          <MaterialIcons name="receipt-long" size={80} color="#CCC" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here once you place an order.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      <ScrollView
        style={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {orders.map((order: any) => (
          <View key={order._id} style={styles.orderCard}>
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.orderId}>Order #{order.orderNumber || order._id.slice(-8)}</Text>
                <Text style={styles.orderDate}>
                  {formatDate(order.createdAt)}
                </Text>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  { backgroundColor: getStatusColor(order.orderStatus) },
                ]}
              >
                <Text style={styles.statusText}>
                  {getStatusText(order.orderStatus)}
                </Text>
              </View>
            </View>

            <View style={styles.divider} />

            <View style={styles.itemsSection}>
              <Text style={styles.sectionTitle}>Items:</Text>
              {order.items.map((item: any, index: number) => (
                <View key={index} style={styles.orderItem}>
                  <Text style={styles.itemName}>
                    {item.quantity}x {item.name}
                  </Text>
                  <Text style={styles.itemPrice}>
                    ₹{item.price * item.quantity}
                  </Text>
                </View>
              ))}
            </View>

            <View style={styles.divider} />

            <View style={styles.paymentSection}>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Method:</Text>
                <Text style={styles.paymentValue}>
                  {order.paymentMethod.toUpperCase()}
                </Text>
              </View>
              <View style={styles.paymentRow}>
                <Text style={styles.paymentLabel}>Payment Status:</Text>
                <View
                  style={[
                    styles.paymentStatusBadge,
                    {
                      backgroundColor: getPaymentStatusColor(
                        order.paymentStatus
                      ),
                    },
                  ]}
                >
                  <Text style={styles.paymentStatusText}>
                    {order.paymentStatus}
                  </Text>
                </View>
              </View>
              {order.transactionId && (
                <View style={styles.paymentRow}>
                  <Text style={styles.paymentLabel}>Transaction ID:</Text>
                  <Text style={styles.transactionId}>
                    {order.transactionId}
                  </Text>
                </View>
              )}
            </View>

            <View style={styles.divider} />

            <View style={styles.totalSection}>
              <Text style={styles.totalLabel}>Total Amount:</Text>
              <Text style={styles.totalAmount}>₹{order.totalAmount}</Text>
            </View>

            <View style={styles.addressSection}>
              <MaterialIcons name="location-on" size={16} color="#666" />
              <Text style={styles.addressText}>{order.deliveryAddress}</Text>
            </View>

            {canCancelOrder(order) && (
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelOrder(order._id)}
              >
                <Text style={styles.cancelButtonText}>Cancel Order</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <View style={{ height: 20 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f5f0ff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fe5227ff",
  },
  backButton: { marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  content: { flex: 1, paddingHorizontal: 20 },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: { marginTop: 10, fontSize: 16, color: "#666" },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
  orderCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    marginTop: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  orderId: { fontSize: 18, fontWeight: "bold", color: "#333" },
  orderDate: { fontSize: 14, color: "#666", marginTop: 4 },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: { fontSize: 12, fontWeight: "bold", color: "#FFF" },
  divider: {
    height: 1,
    backgroundColor: "#f0f0f0",
    marginVertical: 15,
  },
  itemsSection: {},
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  orderItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  itemName: { fontSize: 14, color: "#666", flex: 1 },
  itemPrice: { fontSize: 14, fontWeight: "500", color: "#333" },
  paymentSection: {},
  paymentRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  paymentLabel: { fontSize: 14, color: "#666" },
  paymentValue: { fontSize: 14, fontWeight: "500", color: "#333" },
  paymentStatusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  paymentStatusText: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#FFF",
    textTransform: "capitalize",
  },
  transactionId: { fontSize: 12, color: "#666", fontFamily: "monospace" },
  totalSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalAmount: { fontSize: 20, fontWeight: "bold", color: "#FF6B47" },
  addressSection: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  addressText: { fontSize: 14, color: "#666", marginLeft: 8, flex: 1 },
  cancelButton: {
    marginTop: 15,
    backgroundColor: "#fee",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#fcc",
  },
  cancelButtonText: { fontSize: 14, fontWeight: "600", color: "#DC143C" },
});