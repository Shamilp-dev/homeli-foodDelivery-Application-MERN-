import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { usePaymentMethods } from "../../context/PaymentMethodsContext";

export default function PaymentMethodsScreen() {
  const router = useRouter();
  const {
    savedCards,
    savedUPIs,
    defaultCard,
    defaultUPI,
    addCard,
    addUPI,
    deleteCard,
    deleteUPI,
    setDefaultCard,
    setDefaultUPI,
    loadPaymentMethods,
  } = usePaymentMethods();

  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [showAddUPIModal, setShowAddUPIModal] = useState(false);

  // Card form state
  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [setAsDefaultCard, setSetAsDefaultCard] = useState(false);

  // UPI form state
  const [upiId, setUpiId] = useState("");
  const [upiLabel, setUpiLabel] = useState("");
  const [setAsDefaultUPI, setSetAsDefaultUPI] = useState(false);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const getCardType = (
    number: string
  ): "visa" | "mastercard" | "rupay" | "amex" => {
    const cleaned = number.replace(/\s/g, "");
    if (cleaned.startsWith("4")) return "visa";
    if (cleaned.startsWith("5")) return "mastercard";
    if (cleaned.startsWith("6")) return "rupay";
    if (cleaned.startsWith("3")) return "amex";
    return "visa";
  };

  const getCardIcon = (type: string) => {
    switch (type) {
      case "visa":
      case "mastercard":
      case "rupay":
      case "amex":
      default:
        return "credit-card";
    }
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

  const validateCardDetails = () => {
    if (cardNumber.replace(/\s/g, "").length !== 16) {
      Alert.alert("Error", "Please enter a valid 16-digit card number");
      return false;
    }
    if (!cardHolder.trim()) {
      Alert.alert("Error", "Please enter cardholder name");
      return false;
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      Alert.alert("Error", "Please enter expiry date in MM/YY format");
      return false;
    }
    if (cvv.length !== 3) {
      Alert.alert("Error", "Please enter a valid 3-digit CVV");
      return false;
    }
    return true;
  };

  const validateUPIDetails = () => {
    const upiRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9]+$/;
    if (!upiId.trim() || !upiRegex.test(upiId)) {
      Alert.alert("Error", "Please enter a valid UPI ID (e.g., name@upi)");
      return false;
    }
    if (!upiLabel.trim()) {
      Alert.alert("Error", "Please enter a label for this UPI ID");
      return false;
    }
    return true;
  };

  const handleAddCard = async () => {
    if (!validateCardDetails()) return;

    try {
      const last4 = cardNumber.replace(/\s/g, "").slice(-4);
      await addCard({
        cardNumber: `**** **** **** ${last4}`,
        cardHolder,
        expiryDate,
        cardType: getCardType(cardNumber),
        isDefault: setAsDefaultCard || savedCards.length === 0,
      });

      Alert.alert("Success", "Card added successfully!");
      setShowAddCardModal(false);
      resetCardForm();
    } catch (error) {
      Alert.alert("Error", "Failed to add card");
    }
  };

  const handleAddUPI = async () => {
    if (!validateUPIDetails()) return;

    try {
      await addUPI({
        upiId,
        label: upiLabel,
        isDefault: setAsDefaultUPI || savedUPIs.length === 0,
      });

      Alert.alert("Success", "UPI ID added successfully!");
      setShowAddUPIModal(false);
      resetUPIForm();
    } catch (error) {
      Alert.alert("Error", "Failed to add UPI ID");
    }
  };

  const handleDeleteCard = (id: string) => {
    Alert.alert("Delete Card", "Are you sure you want to delete this card?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteCard(id);
            Alert.alert("Success", "Card deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete card");
          }
        },
      },
    ]);
  };

  const handleDeleteUPI = (id: string) => {
    Alert.alert("Delete UPI", "Are you sure you want to delete this UPI ID?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteUPI(id);
            Alert.alert("Success", "UPI ID deleted successfully");
          } catch (error) {
            Alert.alert("Error", "Failed to delete UPI ID");
          }
        },
      },
    ]);
  };

  const resetCardForm = () => {
    setCardNumber("");
    setCardHolder("");
    setExpiryDate("");
    setCvv("");
    setSetAsDefaultCard(false);
  };

  const resetUPIForm = () => {
    setUpiId("");
    setUpiLabel("");
    setSetAsDefaultUPI(false);
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment Methods</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Saved Cards */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Cards</Text>
            <TouchableOpacity onPress={() => setShowAddCardModal(true)}>
              <MaterialIcons name="add-circle" size={28} color="#FF6B47" />
            </TouchableOpacity>
          </View>

          {savedCards.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons name="credit-card" size={48} color="#CCC" />
              <Text style={styles.emptyText}>No cards saved yet</Text>
            </View>
          ) : (
            savedCards.map((card) => (
              <View key={card.id} style={styles.paymentCard}>
                <View style={styles.cardContent}>
                  <MaterialIcons
                    name={getCardIcon(card.cardType) as any}
                    size={32}
                    color="#FF6B47"
                  />
                  <View style={styles.cardDetails}>
                    <Text style={styles.cardNumber}>{card.cardNumber}</Text>
                    <Text style={styles.cardHolder}>{card.cardHolder}</Text>
                    <Text style={styles.cardExpiry}>
                      Expires: {card.expiryDate}
                    </Text>
                  </View>
                  {card.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardActions}>
                  {!card.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setDefaultCard(card.id)}
                    >
                      <MaterialIcons
                        name="check-circle-outline"
                        size={18}
                        color="#4CAF50"
                      />
                      <Text style={[styles.actionText, { color: "#4CAF50" }]}>
                        Set Default
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteCard(card.id)}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color="#DC143C"
                    />
                    <Text style={[styles.actionText, { color: "#DC143C" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Saved UPI IDs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved UPI IDs</Text>
            <TouchableOpacity onPress={() => setShowAddUPIModal(true)}>
              <MaterialIcons name="add-circle" size={28} color="#FF6B47" />
            </TouchableOpacity>
          </View>

          {savedUPIs.length === 0 ? (
            <View style={styles.emptyState}>
              <MaterialIcons
                name="account-balance-wallet"
                size={48}
                color="#CCC"
              />
              <Text style={styles.emptyText}>No UPI IDs saved yet</Text>
            </View>
          ) : (
            savedUPIs.map((upi) => (
              <View key={upi.id} style={styles.paymentCard}>
                <View style={styles.cardContent}>
                  <MaterialIcons
                    name="account-balance-wallet"
                    size={32}
                    color="#FF6B47"
                  />
                  <View style={styles.cardDetails}>
                    <Text style={styles.upiLabel}>{upi.label}</Text>
                    <Text style={styles.upiId}>{upi.upiId}</Text>
                  </View>
                  {upi.isDefault && (
                    <View style={styles.defaultBadge}>
                      <Text style={styles.defaultText}>Default</Text>
                    </View>
                  )}
                </View>
                <View style={styles.cardActions}>
                  {!upi.isDefault && (
                    <TouchableOpacity
                      style={styles.actionButton}
                      onPress={() => setDefaultUPI(upi.id)}
                    >
                      <MaterialIcons
                        name="check-circle-outline"
                        size={18}
                        color="#4CAF50"
                      />
                      <Text style={[styles.actionText, { color: "#4CAF50" }]}>
                        Set Default
                      </Text>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleDeleteUPI(upi.id)}
                  >
                    <MaterialIcons
                      name="delete-outline"
                      size={18}
                      color="#DC143C"
                    />
                    <Text style={[styles.actionText, { color: "#DC143C" }]}>
                      Delete
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add Card Modal */}
      <Modal
        visible={showAddCardModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddCardModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New Card</Text>
              <TouchableOpacity onPress={() => setShowAddCardModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="Card Number"
                value={cardNumber}
                onChangeText={(text) => setCardNumber(formatCardNumber(text))}
                keyboardType="number-pad"
                maxLength={19}
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Cardholder Name"
                value={cardHolder}
                onChangeText={setCardHolder}
                placeholderTextColor="#999"
              />
              <View style={styles.cardRow}>
                <TextInput
                  style={[styles.input, styles.cardInput]}
                  placeholder="MM/YY"
                  value={expiryDate}
                  onChangeText={(text) => setExpiryDate(formatExpiryDate(text))}
                  keyboardType="number-pad"
                  maxLength={5}
                  placeholderTextColor="#999"
                />
                <TextInput
                  style={[styles.input, styles.cardInput]}
                  placeholder="CVV"
                  value={cvv}
                  onChangeText={setCvv}
                  keyboardType="number-pad"
                  maxLength={3}
                  secureTextEntry
                  placeholderTextColor="#999"
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setSetAsDefaultCard(!setAsDefaultCard)}
              >
                <MaterialIcons
                  name={
                    setAsDefaultCard ? "check-box" : "check-box-outline-blank"
                  }
                  size={24}
                  color={setAsDefaultCard ? "#FF6B47" : "#999"}
                />
                <Text style={styles.checkboxLabel}>
                  Set as default payment method
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddCard}
              >
                <Text style={styles.saveButtonText}>Add Card</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Add UPI Modal */}
      <Modal
        visible={showAddUPIModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAddUPIModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add New UPI ID</Text>
              <TouchableOpacity onPress={() => setShowAddUPIModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <TextInput
                style={styles.input}
                placeholder="UPI ID (e.g., yourname@upi)"
                value={upiId}
                onChangeText={setUpiId}
                autoCapitalize="none"
                placeholderTextColor="#999"
              />
              <TextInput
                style={styles.input}
                placeholder="Label (e.g., Google Pay, PhonePe)"
                value={upiLabel}
                onChangeText={setUpiLabel}
                placeholderTextColor="#999"
              />

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setSetAsDefaultUPI(!setAsDefaultUPI)}
              >
                <MaterialIcons
                  name={
                    setAsDefaultUPI ? "check-box" : "check-box-outline-blank"
                  }
                  size={24}
                  color={setAsDefaultUPI ? "#FF6B47" : "#999"}
                />
                <Text style={styles.checkboxLabel}>
                  Set as default payment method
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleAddUPI}
              >
                <Text style={styles.saveButtonText}>Add UPI ID</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f6f5f0ff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fe5227ff",
  },
  backButton: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#fff" },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  section: { marginBottom: 30 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
    backgroundColor: "#FFF",
    borderRadius: 15,
  },
  emptyText: { marginTop: 10, color: "#999", fontSize: 14 },
  paymentCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  cardDetails: { flex: 1, marginLeft: 12 },
  cardNumber: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  cardHolder: { fontSize: 14, color: "#666", marginBottom: 2 },
  cardExpiry: { fontSize: 12, color: "#999" },
  upiLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  upiId: { fontSize: 14, color: "#666" },
  defaultBadge: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: { fontSize: 11, color: "#FFF", fontWeight: "bold" },
  cardActions: { flexDirection: "row", gap: 12 },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    gap: 4,
  },
  actionText: { fontSize: 13, fontWeight: "600" },
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
    maxHeight: "75%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: "bold", color: "#333" },
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
  cardRow: { flexDirection: "row", justifyContent: "space-between" },
  cardInput: { flex: 1, marginRight: 8 },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 15,
    gap: 10,
  },
  checkboxLabel: { fontSize: 14, color: "#333" },
  saveButton: {
    backgroundColor: "#FF6B47",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  saveButtonText: { fontSize: 16, fontWeight: "bold", color: "#FFF" },
});
