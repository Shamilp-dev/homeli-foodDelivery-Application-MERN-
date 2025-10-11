import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../src/context/AuthContext";
import { CartProvider } from "../src/context/CartContext";
import { FavoritesProvider } from "../src/context/FavoritesContext";
import { NotificationProvider } from "../src/context/NotificationContext";
import { AddressProvider } from "../src/context/AddressContext";
import { PaymentMethodsProvider } from '../src/context/PaymentMethodsContext';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <FavoritesProvider>
          <NotificationProvider>
            <AddressProvider>
              <PaymentMethodsProvider>
              <Stack screenOptions={{ headerShown: false }} />
              </PaymentMethodsProvider>
            </AddressProvider>
          </NotificationProvider>
        </FavoritesProvider>
      </CartProvider>
    </AuthProvider>
  );
}
