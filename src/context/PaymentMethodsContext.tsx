import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface SavedCard {
  id: string;
  cardNumber: string; // Last 4 digits only for display
  cardHolder: string;
  expiryDate: string;
  cardType: 'visa' | 'mastercard' | 'rupay' | 'amex';
  isDefault: boolean;
}

export interface SavedUPI {
  id: string;
  upiId: string;
  label: string; // e.g., "Google Pay", "PhonePe", "Paytm"
  isDefault: boolean;
}

interface PaymentMethodsContextType {
  savedCards: SavedCard[];
  savedUPIs: SavedUPI[];
  defaultCard: SavedCard | null;
  defaultUPI: SavedUPI | null;
  addCard: (card: Omit<SavedCard, 'id'>) => Promise<void>;
  addUPI: (upi: Omit<SavedUPI, 'id'>) => Promise<void>;
  deleteCard: (id: string) => Promise<void>;
  deleteUPI: (id: string) => Promise<void>;
  setDefaultCard: (id: string) => Promise<void>;
  setDefaultUPI: (id: string) => Promise<void>;
  loadPaymentMethods: () => Promise<void>;
}

const PaymentMethodsContext = createContext<PaymentMethodsContextType | undefined>(undefined);

const CARDS_STORAGE_KEY = '@saved_cards';
const UPI_STORAGE_KEY = '@saved_upis';

export const PaymentMethodsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [savedCards, setSavedCards] = useState<SavedCard[]>([]);
  const [savedUPIs, setSavedUPIs] = useState<SavedUPI[]>([]);

  useEffect(() => {
    loadPaymentMethods();
  }, []);

  const loadPaymentMethods = async () => {
    try {
      const [cardsData, upisData] = await Promise.all([
        AsyncStorage.getItem(CARDS_STORAGE_KEY),
        AsyncStorage.getItem(UPI_STORAGE_KEY),
      ]);

      if (cardsData) setSavedCards(JSON.parse(cardsData));
      if (upisData) setSavedUPIs(JSON.parse(upisData));
    } catch (error) {
      console.error('Error loading payment methods:', error);
    }
  };

  const addCard = async (card: Omit<SavedCard, 'id'>) => {
    try {
      const newCard: SavedCard = {
        ...card,
        id: Date.now().toString(),
      };

      let updatedCards = [...savedCards, newCard];

      if (newCard.isDefault) {
        updatedCards = updatedCards.map((c) =>
          c.id === newCard.id ? c : { ...c, isDefault: false }
        );
      }

      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updatedCards));
      setSavedCards(updatedCards);
    } catch (error) {
      console.error('Error adding card:', error);
      throw error;
    }
  };

  const addUPI = async (upi: Omit<SavedUPI, 'id'>) => {
    try {
      const newUPI: SavedUPI = {
        ...upi,
        id: Date.now().toString(),
      };

      let updatedUPIs = [...savedUPIs, newUPI];

      if (newUPI.isDefault) {
        updatedUPIs = updatedUPIs.map((u) =>
          u.id === newUPI.id ? u : { ...u, isDefault: false }
        );
      }

      await AsyncStorage.setItem(UPI_STORAGE_KEY, JSON.stringify(updatedUPIs));
      setSavedUPIs(updatedUPIs);
    } catch (error) {
      console.error('Error adding UPI:', error);
      throw error;
    }
  };

  const deleteCard = async (id: string) => {
    try {
      const updated = savedCards.filter((c) => c.id !== id);
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
      setSavedCards(updated);
    } catch (error) {
      console.error('Error deleting card:', error);
      throw error;
    }
  };

  const deleteUPI = async (id: string) => {
    try {
      const updated = savedUPIs.filter((u) => u.id !== id);
      await AsyncStorage.setItem(UPI_STORAGE_KEY, JSON.stringify(updated));
      setSavedUPIs(updated);
    } catch (error) {
      console.error('Error deleting UPI:', error);
      throw error;
    }
  };

  const setDefaultCard = async (id: string) => {
    try {
      const updated = savedCards.map((c) => ({
        ...c,
        isDefault: c.id === id,
      }));
      await AsyncStorage.setItem(CARDS_STORAGE_KEY, JSON.stringify(updated));
      setSavedCards(updated);
    } catch (error) {
      console.error('Error setting default card:', error);
      throw error;
    }
  };

  const setDefaultUPI = async (id: string) => {
    try {
      const updated = savedUPIs.map((u) => ({
        ...u,
        isDefault: u.id === id,
      }));
      await AsyncStorage.setItem(UPI_STORAGE_KEY, JSON.stringify(updated));
      setSavedUPIs(updated);
    } catch (error) {
      console.error('Error setting default UPI:', error);
      throw error;
    }
  };

  const defaultCard = savedCards.find((c) => c.isDefault) || null;
  const defaultUPI = savedUPIs.find((u) => u.isDefault) || null;

  return (
    <PaymentMethodsContext.Provider
      value={{
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
      }}
    >
      {children}
    </PaymentMethodsContext.Provider>
  );
};

export const usePaymentMethods = () => {
  const context = useContext(PaymentMethodsContext);
  if (!context) {
    throw new Error('usePaymentMethods must be used within a PaymentMethodsProvider');
  }
  return context;
};