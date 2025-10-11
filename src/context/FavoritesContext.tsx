import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface FavoriteItem {
  id: string;
  name: string;
  price: number;
  image: string | any;
  category?: string;
  rating?: number;
}

interface FavoritesContextType {
  favorites: FavoriteItem[];
  toggleFavorite: (item: FavoriteItem) => Promise<void>;
  isFavorite: (id: string) => boolean;
  loadFavorites: () => Promise<void>;
  clearFavorites: () => Promise<void>;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const FAVORITES_STORAGE_KEY = '@favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  // Load favorites on mount
  useEffect(() => {
    loadFavorites();
  }, []);

  // Load from AsyncStorage
  const loadFavorites = async () => {
    try {
      const stored = await AsyncStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) {
        setFavorites(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
  };

  // Save to AsyncStorage
  const saveFavorites = async (items: FavoriteItem[]) => {
    try {
      setFavorites(items);
      await AsyncStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Error saving favorites:', error);
    }
  };

  // Toggle favorite status
  const toggleFavorite = async (item: FavoriteItem) => {
    const exists = favorites.some(fav => fav.id === item.id);
    let updated: FavoriteItem[];

    if (exists) {
      updated = favorites.filter(fav => fav.id !== item.id);
    } else {
      updated = [item, ...favorites];
    }

    await saveFavorites(updated);
  };

  // Check if an item is in favorites
  const isFavorite = (id: string) => favorites.some(fav => fav.id === id);

  // Clear all favorites
  const clearFavorites = async () => {
    await saveFavorites([]);
  };

  return (
    <FavoritesContext.Provider
      value={{ favorites, toggleFavorite, isFavorite, loadFavorites, clearFavorites }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
