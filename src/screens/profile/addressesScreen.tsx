import React, { useState, useEffect } from 'react';
import { useAuth } from "../../context/AuthContext";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAddress } from '../../context/AddressContext';

interface AddressFormData {
  id?: string;
  type: string;
  address: string;
  pincode: string;
  isDefault: boolean;
}

export default function AddressesScreen() {
  const router = useRouter();
  const { addresses, setDefaultAddress, deleteAddress, loadAddresses, addAddress, updateAddress } = useAddress();
  
  const [showAddEditModal, setShowAddEditModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressFormData | null>(null);
  const [formData, setFormData] = useState<AddressFormData>({
    type: 'Home',
    address: '',
    pincode: '',
    isDefault: false,
  });

  useEffect(() => {
    loadAddresses();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultAddress(id);
      Alert.alert('Success', 'Default address updated');
    } catch (error) {
      Alert.alert('Error', 'Failed to update default address');
    }
  };

  const handleDeleteAddress = (id: string) => {
    Alert.alert('Delete Address', 'Are you sure you want to delete this address?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await deleteAddress(id);
            Alert.alert('Success', 'Address deleted successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
          }
        }
      }
    ]);
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    setFormData({
      type: 'Home',
      address: '',
      pincode: '',
      isDefault: addresses.length === 0, // First address is default
    });
    setShowAddEditModal(true);
  };

  const handleEditAddress = (addr: any) => {
    setEditingAddress(addr);
    setFormData({
      id: addr.id,
      type: addr.type,
      address: addr.address,
      pincode: addr.pincode,
      isDefault: addr.isDefault,
    });
    setShowAddEditModal(true);
  };

  const validateForm = () => {
    if (!formData.address.trim()) {
      Alert.alert('Error', 'Please enter delivery address');
      return false;
    }
    if (!formData.pincode.trim() || formData.pincode.length !== 6) {
      Alert.alert('Error', 'Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const handleSaveAddress = async () => {
    if (!validateForm()) return;

    try {
      if (editingAddress) {
        // Update existing address
        await updateAddress(formData.id!, {
          type: formData.type,
          address: formData.address,
          pincode: formData.pincode,
          isDefault: formData.isDefault,
        });
        Alert.alert('Success', 'Address updated successfully');
      } else {
        // Add new address
        await addAddress({
          type: formData.type,
          address: formData.address,
          pincode: formData.pincode,
          isDefault: formData.isDefault,
        });
        Alert.alert('Success', 'Address added successfully');
      }
      setShowAddEditModal(false);
      loadAddresses();
    } catch (error) {
      Alert.alert('Error', 'Failed to save address');
    }
  };

  const addressTypes = ['Home', 'Work', 'Other'];

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Delivery Addresses</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {addresses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialIcons name="location-off" size={64} color="#CCC" />
            <Text style={styles.emptyText}>No addresses saved yet</Text>
            <Text style={styles.emptySubtext}>Add your first delivery address</Text>
          </View>
        ) : (
          addresses.map((addr) => (
            <View key={addr.id} style={styles.addressCard}>
              <View style={styles.addressHeader}>
                <View style={styles.typeContainer}>
                  <MaterialIcons name="location-on" size={20} color="#FF6B47" />
                  <Text style={styles.addressType}>{addr.type}</Text>
                </View>
                {addr.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Default</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{addr.address}</Text>
              <Text style={styles.pincodeText}>Pincode: {addr.pincode}</Text>
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleEditAddress(addr)}
                >
                  <MaterialIcons name="edit" size={16} color="#FF6B47" />
                  <Text style={styles.actionText}>Edit</Text>
                </TouchableOpacity>
                {!addr.isDefault && (
                  <TouchableOpacity
                    style={styles.actionButton}
                    onPress={() => handleSetDefault(addr.id)}
                  >
                    <MaterialIcons name="check-circle-outline" size={16} color="#4CAF50" />
                    <Text style={[styles.actionText, { color: '#4CAF50' }]}>Set as Default</Text>
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => handleDeleteAddress(addr.id)}
                >
                  <MaterialIcons name="delete-outline" size={16} color="#DC143C" />
                  <Text style={[styles.actionText, styles.deleteText]}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}

        <TouchableOpacity style={styles.addButton} onPress={handleAddAddress}>
          <MaterialIcons name="add-circle" size={24} color="#FF6B47" />
          <Text style={styles.addButtonText}>Add New Address</Text>
        </TouchableOpacity>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddEditModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowAddEditModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </Text>
              <TouchableOpacity onPress={() => setShowAddEditModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Address Type Selection */}
              <Text style={styles.label}>Address Type</Text>
              <View style={styles.typeSelector}>
                {addressTypes.map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[
                      styles.typeButton,
                      formData.type === type && styles.typeButtonSelected,
                    ]}
                    onPress={() => setFormData({ ...formData, type })}
                  >
                    <MaterialIcons
                      name={
                        type === 'Home'
                          ? 'home'
                          : type === 'Work'
                          ? 'work'
                          : 'location-on'
                      }
                      size={20}
                      color={formData.type === type ? '#FF6B47' : '#666'}
                    />
                    <Text
                      style={[
                        styles.typeButtonText,
                        formData.type === type && styles.typeButtonTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Address Input */}
              <Text style={styles.label}>Complete Address</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="House No, Building Name, Street, Area"
                value={formData.address}
                onChangeText={(text) => setFormData({ ...formData, address: text })}
                multiline
                numberOfLines={4}
                placeholderTextColor="#999"
              />

              {/* Pincode Input */}
              <Text style={styles.label}>Pincode</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter 6-digit pincode"
                value={formData.pincode}
                onChangeText={(text) => setFormData({ ...formData, pincode: text })}
                keyboardType="number-pad"
                maxLength={6}
                placeholderTextColor="#999"
              />

              {/* Set as Default */}
              {addresses.length > 0 && (
                <TouchableOpacity
                  style={styles.checkboxContainer}
                  onPress={() =>
                    setFormData({ ...formData, isDefault: !formData.isDefault })
                  }
                >
                  <MaterialIcons
                    name={
                      formData.isDefault ? 'check-box' : 'check-box-outline-blank'
                    }
                    size={24}
                    color={formData.isDefault ? '#FF6B47' : '#999'}
                  />
                  <Text style={styles.checkboxLabel}>Set as default address</Text>
                </TouchableOpacity>
              )}

              {/* Save Button */}
              <TouchableOpacity
                style={styles.saveButton}
                onPress={handleSaveAddress}
              >
                <Text style={styles.saveButtonText}>
                  {editingAddress ? 'Update Address' : 'Save Address'}
                </Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
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
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  content: { flex: 1, paddingHorizontal: 20, paddingTop: 20 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginTop: 20,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
    marginTop: 8,
  },
  addressCard: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  typeContainer: { flexDirection: 'row', alignItems: 'center' },
  addressType: { fontSize: 16, fontWeight: 'bold', color: '#333', marginLeft: 8 },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  defaultText: { fontSize: 12, color: '#FFF', fontWeight: 'bold' },
  addressText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 8,
  },
  pincodeText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 15,
  },
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    gap: 4,
  },
  actionText: { fontSize: 13, color: '#FF6B47', fontWeight: '600' },
  deleteText: { color: '#DC143C' },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    marginBottom: 30,
    marginTop: 10,
    borderWidth: 2,
    borderColor: '#FF6B47',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FF6B47',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 40,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  typeSelector: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 15,
  },
  typeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 2,
    borderColor: '#e0e0e0',
    gap: 6,
  },
  typeButtonSelected: {
    backgroundColor: '#fff5f2',
    borderColor: '#FF6B47',
  },
  typeButtonText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  typeButtonTextSelected: {
    color: '#FF6B47',
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: '#333',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
    gap: 10,
  },
  checkboxLabel: {
    fontSize: 14,
    color: '#333',
  },
  saveButton: {
    backgroundColor: '#FF6B47',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFF',
  },
});