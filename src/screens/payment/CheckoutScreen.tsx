import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useAddress } from "../../context/AddressContext";
import { useNotifications } from "../../context/NotificationContext";
import { usePaymentMethods } from "../../context/PaymentMethodsContext";

import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../../context/CartContext";
import { useRouter } from "expo-router";
import { createOrder, updateOrderPayment } from "../../services/orderService";

type PaymentMethod = "upi" | "card" | "cod";

interface CardDetails {
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export default function CheckoutScreen() {


  const { addNotification } = useNotifications();
  const { cartItems, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const { user } = useAuth();
  const { addresses, defaultAddress } = useAddress();
  const { savedCards, savedUPIs, defaultCard, defaultUPI } = usePaymentMethods();

  

  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>("cod");
  const [isProcessing, setIsProcessing] = useState(false);

  // Delivery Details - Initialize with user data
  const [name, setName] = useState(user?.name || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [address, setAddress] = useState(defaultAddress?.address || "");
  const [pincode, setPincode] = useState(defaultAddress?.pincode || "");
  const [useSavedAddress, setUseSavedAddress] = useState(!!defaultAddress);

  // UPI Details

  
 const [upiId, setUpiId] = useState(defaultUPI?.upiId || "");

  // Card Details
const [cardDetails, setCardDetails] = useState<CardDetails>({
  cardNumber: defaultCard?.cardNumber || "",
  cardHolder: defaultCard?.cardHolder || "",
  expiryDate: defaultCard?.expiryDate || "",
  cvv: "",
});

  const deliveryCharge = 40;
  const finalAmount = totalAmount + deliveryCharge;

  const validateDeliveryDetails = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return false;
    }
    if (!phone.trim() || phone.length < 10) {
      Alert.alert("Error", "Please enter a valid phone number");
      return false;
    }
    if (!address.trim()) {
      Alert.alert("Error", "Please enter delivery address");
      return false;
    }
    if (!pincode.trim() || pincode.length !== 6) {
      Alert.alert("Error", "Please enter a valid 6-digit pincode");
      return false;
    }
    return true;
  };

  const validateUPI = () => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiId.trim() || !upiRegex.test(upiId)) {
      Alert.alert("Error", "Please enter a valid UPI ID (e.g., name@upi)");
      return false;
    }
    return true;
  };

  const validateCard = () => {
    if (cardDetails.cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Error", "Please enter a valid 16-digit card number");
      return false;
    }
    if (!cardDetails.cardHolder.trim()) {
      Alert.alert("Error", "Please enter cardholder name");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiryDate)) {
      Alert.alert("Error", "Please enter expiry date in MM/YY format");
      return false;
    }
    if (cardDetails.cvv.length !== 3) {
      Alert.alert("Error", "Please enter a valid 3-digit CVV");
      return false;
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateDeliveryDetails()) return;

    if (selectedPayment === "upi" && !validateUPI()) return;
    if (selectedPayment === "card" && !validateCard()) return;

    setIsProcessing(true);

    try {
      const orderData = {
        customerName: name,
        phoneNumber: phone,
        deliveryAddress: address,
        pincode: pincode,
        items: cartItems.map((item) => ({
          foodItemId: item.foodItemId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        })),
        subtotal: totalAmount,
        deliveryCharge: deliveryCharge,
        totalAmount: finalAmount,
        paymentMethod: selectedPayment as "upi" | "card" | "cod",
        paymentStatus: (selectedPayment === "cod"
          ? "pending"
          : "processing") as "pending" | "processing" | "completed" | "failed",
        orderStatus: "pending" as "pending",
      };

      const orderResponse = await createOrder(orderData);
      const orderId = orderResponse.orderId || orderResponse._id;

      if (selectedPayment === "cod") {
        await handleCODPayment(orderId, orderResponse.orderNumber);
      } else if (selectedPayment === "upi") {
        await handleUPIPayment(orderId, orderResponse.orderNumber);
      } else if (selectedPayment === "card") {
        await handleCardPayment(orderId, orderResponse.orderNumber);
      }
    } catch (error) {
      console.error("Order placement error:", error);
      Alert.alert("Error", "Failed to place order. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleCODPayment = async (orderId: string, orderNumber: string) => {
  await updateOrderPayment(orderId, {
    paymentStatus: "pending" as "pending" | "processing" | "completed" | "failed",
  });

  // Add notification
  await addNotification({
    type: 'order',
    orderId: orderId,
    orderNumber: orderNumber,
    message: `Your order #${orderNumber} has been placed successfully! Pay ₹${finalAmount} on delivery.`,
    status: 'pending',
  });

  setIsProcessing(false);
  Alert.alert(
    "Order Placed!",
    `Your order has been placed successfully!\n\nOrder Number: ${orderNumber}\nOrder ID: ${orderId.slice(
      -8
    )}\nTotal: ₹${finalAmount}\n\nPay ₹${finalAmount} in cash on delivery.`,
    [
      {
        text: "OK",
        onPress: () => {
          clearCart();
          router.replace("/(tabs)/dashboard");
        },
      },
    ]
  );
};

  const handleUPIPayment = async (orderId: string, orderNumber: string) => {
  setTimeout(async () => {
    const paymentSuccess = Math.random() > 0.1;

    if (paymentSuccess) {
      const transactionId = `UPI${Date.now()}`;
      await updateOrderPayment(orderId, {
        paymentStatus: "completed" as "pending" | "processing" | "completed" | "failed",
        transactionId: transactionId,
        upiId: upiId,
      });

      // Add notification
      await addNotification({
        type: 'order',
        orderId: orderId,
        orderNumber: orderNumber,
        message: `Payment successful! Your order #${orderNumber} has been confirmed.`,
        status: 'confirmed',
      });

      setIsProcessing(false);
      Alert.alert(
        "Payment Successful!",
        `Your payment of ₹${finalAmount} via UPI was successful!\n\nOrder Number: ${orderNumber}\nTransaction ID: ${transactionId}`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)/dashboard");
            },
          },
        ]
      );
    } else {
      await updateOrderPayment(orderId, {
        paymentStatus: "failed" as "pending" | "processing" | "completed" | "failed",
      });

      setIsProcessing(false);
      Alert.alert(
        "Payment Failed",
        "UPI payment could not be completed. Please try again or choose a different payment method."
      );
    }
  }, 2000);
};

  const handleCardPayment = async (orderId: string, orderNumber: string) => {
  setTimeout(async () => {
    const paymentSuccess = Math.random() > 0.1;

    if (paymentSuccess) {
      const transactionId = `CARD${Date.now()}`;
      await updateOrderPayment(orderId, {
        paymentStatus: "completed" as "pending" | "processing" | "completed" | "failed",
        transactionId: transactionId,
        cardLast4: cardDetails.cardNumber.slice(-4),
      });

      // Add notification
      await addNotification({
        type: 'order',
        orderId: orderId,
        orderNumber: orderNumber,
        message: `Payment successful! Your order #${orderNumber} has been confirmed.`,
        status: 'confirmed',
      });

      setIsProcessing(false);
      Alert.alert(
        "Payment Successful!",
        `Your payment of ₹${finalAmount} was successful!\n\nOrder Number: ${orderNumber}\nCard: **** ${cardDetails.cardNumber.slice(
          -4
        )}`,
        [
          {
            text: "OK",
            onPress: () => {
              clearCart();
              router.replace("/(tabs)/dashboard");
            },
          },
        ]
      );
    } else {
      await updateOrderPayment(orderId, {
        paymentStatus: "failed" as "pending" | "processing" | "completed" | "failed",
      });

      setIsProcessing(false);
      Alert.alert(
        "Payment Failed",
        "Card payment could not be processed. Please check your details and try again."
      );
    }
  }, 2000);
};

  const formatCardNumber = (text: string) => {
    const cleaned = text.replace(/\s/g, "");
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || cleaned;
    return formatted.slice(0, 19);
  };

  const formatExpiryDate = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      return cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    return cleaned;
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{totalAmount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Charges</Text>
              <Text style={styles.summaryValue}>₹{deliveryCharge}</Text>
            </View>
            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Total Amount</Text>
              <Text style={styles.totalValue}>₹{finalAmount}</Text>
            </View>
          </View>
        </View>

        {/* Saved Addresses */}
        {addresses.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Saved Addresses</Text>
            {addresses.map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.savedAddress,
                  useSavedAddress &&
                    address === addr.address &&
                    styles.savedAddressSelected,
                ]}
                onPress={() => {
                  setAddress(addr.address);
                  setPincode(addr.pincode);
                  setUseSavedAddress(true);
                }}
              >
                <View style={styles.addressContent}>
                  <MaterialIcons name="location-on" size={20} color="#FF6B47" />
                  <View style={styles.addressTextContainer}>
                    <Text style={styles.addressType}>{addr.type}</Text>
                    <Text style={styles.addressText}>{addr.address}</Text>
                    <Text style={styles.addressPincode}>
                      Pincode: {addr.pincode}
                    </Text>
                  </View>
                </View>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </TouchableOpacity>
            ))}
            <TouchableOpacity
              style={styles.newAddressButton}
              onPress={() => {
                setAddress("");
                setPincode("");
                setUseSavedAddress(false);
              }}
            >
              <MaterialIcons name="add-circle-outline" size={20} color="#FF6B47" />
              <Text style={styles.newAddressText}>Use New Address</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Delivery Details */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Details</Text>
          <View style={styles.card}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={10}
              placeholderTextColor="#999"
            />
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Delivery Address"
              value={address}
              onChangeText={setAddress}
              multiline
              numberOfLines={3}
              placeholderTextColor="#999"
            />
            <TextInput
              style={styles.input}
              placeholder="Pincode"
              value={pincode}
              onChangeText={setPincode}
              keyboardType="number-pad"
              maxLength={6}
              placeholderTextColor="#999"
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {/* Saved Payment Methods */}
{(savedCards.length > 0 || savedUPIs.length > 0) && (
  <View style={styles.savedPaymentsSection}>
    <Text style={styles.savedPaymentsTitle}>Saved Payment Methods</Text>
    
    {/* Saved Cards */}
    {savedCards.map((card) => (
      <TouchableOpacity
        key={card.id}
        style={[
          styles.savedPaymentOption,
          selectedPayment === 'card' && 
          cardDetails.cardNumber === card.cardNumber &&
          styles.savedPaymentOptionSelected,
        ]}
        onPress={() => {
          setSelectedPayment('card');
          setCardDetails({
            cardNumber: card.cardNumber,
            cardHolder: card.cardHolder,
            expiryDate: card.expiryDate,
            cvv: '',
          });
        }}
      >
        <MaterialIcons name="credit-card" size={24} color="#FF6B47" />
        <View style={styles.savedPaymentDetails}>
          <Text style={styles.savedPaymentText}>{card.cardNumber}</Text>
          <Text style={styles.savedPaymentSubtext}>{card.cardHolder}</Text>
        </View>
        {card.isDefault && (
          <View style={styles.defaultBadgeSmall}>
            <Text style={styles.defaultTextSmall}>Default</Text>
          </View>
        )}
        {selectedPayment === 'card' && 
         cardDetails.cardNumber === card.cardNumber && (
          <MaterialIcons name="check-circle" size={24} color="#FF6B47" />
        )}
      </TouchableOpacity>
    ))}

    {/* Saved UPIs */}
    {savedUPIs.map((upi) => (
      <TouchableOpacity
        key={upi.id}
        style={[
          styles.savedPaymentOption,
          selectedPayment === 'upi' && 
          upiId === upi.upiId &&
          styles.savedPaymentOptionSelected,
        ]}
        onPress={() => {
          setSelectedPayment('upi');
          setUpiId(upi.upiId);
        }}
      >
        <MaterialIcons name="account-balance-wallet" size={24} color="#FF6B47" />
        <View style={styles.savedPaymentDetails}>
          <Text style={styles.savedPaymentText}>{upi.label}</Text>
          <Text style={styles.savedPaymentSubtext}>{upi.upiId}</Text>
        </View>
        {upi.isDefault && (
          <View style={styles.defaultBadgeSmall}>
            <Text style={styles.defaultTextSmall}>Default</Text>
          </View>
        )}
        {selectedPayment === 'upi' && upiId === upi.upiId && (
          <MaterialIcons name="check-circle" size={24} color="#FF6B47" />
        )}
      </TouchableOpacity>
    ))}

    <View style={styles.divider} />
    <Text style={styles.orUseText}>Or use other payment methods</Text>
  </View>
)}


          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "cod" && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment("cod")}
          >
            <MaterialIcons
              name="money"
              size={24}
              color={selectedPayment === "cod" ? "#FF6B47" : "#666"}
            />
            <Text
              style={[
                styles.paymentText,
                selectedPayment === "cod" && styles.paymentTextSelected,
              ]}
            >
              Cash on Delivery
            </Text>
            {selectedPayment === "cod" && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#FF6B47"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "upi" && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment("upi")}
          >
            <MaterialIcons
              name="account-balance-wallet"
              size={24}
              color={selectedPayment === "upi" ? "#FF6B47" : "#666"}
            />
            <Text
              style={[
                styles.paymentText,
                selectedPayment === "upi" && styles.paymentTextSelected,
              ]}
            >
              UPI Payment
            </Text>
            {selectedPayment === "upi" && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#FF6B47"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          {selectedPayment === "upi" && (
            <View style={styles.paymentDetails}>
              <TextInput
                style={styles.input}
                placeholder="Enter UPI ID (e.g., yourname@upi)"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
            </View>
          )}

          <TouchableOpacity
            style={[
              styles.paymentOption,
              selectedPayment === "card" && styles.paymentOptionSelected,
            ]}
            onPress={() => setSelectedPayment("card")}
          >
            <MaterialIcons
              name="credit-card"
              size={24}
              color={selectedPayment === "card" ? "#FF6B47" : "#666"}
            />
            <Text
              style={[
                styles.paymentText,
                selectedPayment === "card" && styles.paymentTextSelected,
              ]}
            >
              Credit/Debit Card
            </Text>
            {selectedPayment === "card" && (
              <MaterialIcons
                name="check-circle"
                size={24}
                color="#FF6B47"
                style={styles.checkIcon}
              />
            )}
          </TouchableOpacity>

          {selectedPayment === "card" && (
            <View style={styles.paymentDetails}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardDetails.cardNumber}
                onChangeText={(text) =>
                  setCardDetails({
                    ...cardDetails,
                    cardNumber: formatCardNumber(text),
                  })
                }
                keyboardType="number-pad"
                maxLength={19}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={cardDetails.cardHolder}
                onChangeText={(text) =>
                  setCardDetails({ ...cardDetails, cardHolder: text })
                }
                placeholderTextColor="#999"
              />
              <View style={styles.cardRow}>
                <TextInput
                  style={[styles.input, styles.cardInput]}
                  placeholder="MM/YY"
                  value={cardDetails.expiryDate}
                  onChangeText={(text) =>
                    setCardDetails({
                      ...cardDetails,
                      expiryDate: formatExpiryDate(text),
                    })
                  }
                  keyboardType="number-pad"
                  maxLength={5}
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={[styles.input, styles.cardInput]}
                  placeholder="CVV"
                  value={cardDetails.cvv}
                  onChangeText={(text) =>
                    setCardDetails({ ...cardDetails, cvv: text })
                  }
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
              </View>
            </View>
          )}
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.placeOrderButton}
          onPress={handlePlaceOrder}
          disabled={isProcessing}
        >
          <LinearGradient
            colors={["#f73706ff", "#ff8352ff"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.placeOrderGradient}
          >
            {isProcessing ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.placeOrderText}>
                Place Order - ₹{finalAmount}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
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
  section: { marginTop: 20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  card: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  summaryLabel: { fontSize: 16, color: "#666" },
  summaryValue: { fontSize: 16, color: "#333", fontWeight: "500" },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginTop: 8,
    marginBottom: 0,
  },
  totalLabel: { fontSize: 18, fontWeight: "bold", color: "#333" },
  totalValue: { fontSize: 20, fontWeight: "bold", color: "#FF6B47" },
  input: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  textArea: { height: 80, textAlignVertical: "top" },
  paymentOption: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  paymentOptionSelected: { borderColor: "#FF6B47", backgroundColor: "#fff5f2" },
  paymentText: { fontSize: 16, color: "#666", marginLeft: 12, flex: 1 },
  paymentTextSelected: { color: "#FF6B47", fontWeight: "600" },
  checkIcon: { marginLeft: "auto" },
  paymentDetails: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
  },
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cardInput: { flex: 1, marginRight: 8 },
  footer: {
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  placeOrderButton: { borderRadius: 25, overflow: "hidden" },
  placeOrderGradient: {
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  placeOrderText: { fontSize: 18, fontWeight: "bold", color: "#FFF" },
  savedAddress: {
    backgroundColor: "#FFF",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: "#e0e0e0",
  },
  savedAddressSelected: {
    borderColor: "#FF6B47",
    backgroundColor: "#fff5f2",
  },
  addressContent: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  addressTextContainer: {
    flex: 1,
    marginLeft: 12,
  },
  addressType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: "#666",
    marginBottom: 4,
  },
  addressPincode: {
    fontSize: 12,
    color: "#999",
  },
  defaultBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    marginTop: 8,
    alignSelf: "flex-start",
  },
  defaultText: {
    fontSize: 10,
    color: "#FFF",
    fontWeight: "bold",
  },
  newAddressButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#FF6B47",
    borderStyle: "dashed",
  },
  newAddressText: {
    fontSize: 14,
    color: "#FF6B47",
    fontWeight: "600",
    marginLeft: 8,
  },
  savedPaymentsSection: {
  marginBottom: 15,
},
savedPaymentsTitle: {
  fontSize: 16,
  fontWeight: '600',
  color: '#333',
  marginBottom: 12,
},
savedPaymentOption: {
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: '#FFF',
  borderRadius: 12,
  padding: 15,
  marginBottom: 10,
  borderWidth: 2,
  borderColor: '#e0e0e0',
},
savedPaymentOptionSelected: {
  borderColor: '#FF6B47',
  backgroundColor: '#fff5f2',
},
savedPaymentDetails: {
  flex: 1,
  marginLeft: 12,
},
savedPaymentText: {
  fontSize: 15,
  fontWeight: '600',
  color: '#333',
  marginBottom: 2,
},
savedPaymentSubtext: {
  fontSize: 13,
  color: '#666',
},
defaultBadgeSmall: {
  backgroundColor: '#4CAF50',
  paddingHorizontal: 8,
  paddingVertical: 3,
  borderRadius: 8,
  marginRight: 8,
},
defaultTextSmall: {
  fontSize: 10,
  color: '#FFF',
  fontWeight: 'bold',
},
divider: {
  height: 1,
  backgroundColor: '#e0e0e0',
  marginVertical: 15,
},
orUseText: {
  fontSize: 14,
  color: '#999',
  textAlign: 'center',
  marginBottom: 10,
},

});