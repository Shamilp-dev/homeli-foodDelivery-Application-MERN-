import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Address {
  id: string;
  type: string;
  address: string;
  pincode: string;
  isDefault: boolean;
}

interface AddressContextType {
  addresses: Address[];
  defaultAddress: Address | null;
  loadAddresses: () => Promise<void>;
  addAddress: (address: Omit<Address, 'id'>) => Promise<void>;
  updateAddress: (id: string, address: Partial<Address>) => Promise<void>;
  deleteAddress: (id: string) => Promise<void>;
  setDefaultAddress: (id: string) => Promise<void>;
}

const AddressContext = createContext<AddressContextType | undefined>(undefined);

const ADDRESSES_STORAGE_KEY = '@addresses';

export const AddressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [defaultAddress, setDefaultAddressState] = useState<Address | null>(null);

  useEffect(() => {
    loadAddresses();
  }, []);

  useEffect(() => {
    // Update default address whenever addresses change
    const defAddr = addresses.find((addr) => addr.isDefault) || null;
    setDefaultAddressState(defAddr);
  }, [addresses]);

  const loadAddresses = async () => {
    try {
      const storedAddresses = await AsyncStorage.getItem(ADDRESSES_STORAGE_KEY);
      if (storedAddresses) {
        const parsed = JSON.parse(storedAddresses);
        setAddresses(parsed);
      }
    } catch (error) {
      console.error('Error loading addresses:', error);
    }
  };

  const saveAddresses = async (newAddresses: Address[]) => {
    try {
      await AsyncStorage.setItem(ADDRESSES_STORAGE_KEY, JSON.stringify(newAddresses));
      setAddresses(newAddresses);
    } catch (error) {
      console.error('Error saving addresses:', error);
      throw error;
    }
  };

  const addAddress = async (address: Omit<Address, 'id'>) => {
    try {
      const newAddress: Address = {
        ...address,
        id: Date.now().toString(),
      };

      let updatedAddresses = [...addresses, newAddress];

      // If this is set as default, remove default from others
      if (newAddress.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) =>
          addr.id === newAddress.id ? addr : { ...addr, isDefault: false }
        );
      }

      await saveAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  };

  const updateAddress = async (id: string, updates: Partial<Address>) => {
    try {
      let updatedAddresses = addresses.map((addr) =>
        addr.id === id ? { ...addr, ...updates } : addr
      );

      // If this address is being set as default, remove default from others
      if (updates.isDefault) {
        updatedAddresses = updatedAddresses.map((addr) =>
          addr.id === id ? addr : { ...addr, isDefault: false }
        );
      }

      await saveAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  };

  const deleteAddress = async (id: string) => {
    try {
      const updatedAddresses = addresses.filter((addr) => addr.id !== id);
      
      // If deleted address was default and there are remaining addresses, make the first one default
      const deletedWasDefault = addresses.find((addr) => addr.id === id)?.isDefault;
      if (deletedWasDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }

      await saveAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  };

  const setDefaultAddress = async (id: string) => {
    try {
      const updatedAddresses = addresses.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }));

      await saveAddresses(updatedAddresses);
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  };

  return (
    <AddressContext.Provider
      value={{
        addresses,
        defaultAddress,
        loadAddresses,
        addAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
      }}
    >
      {children}
    </AddressContext.Provider>
  );
};

export const useAddress = () => {
  const context = useContext(AddressContext);
  if (!context) {
    throw new Error('useAddress must be used within an AddressProvider');
  }
  return context;
};