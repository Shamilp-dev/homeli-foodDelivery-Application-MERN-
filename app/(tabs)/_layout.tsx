import { Tabs } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useCart } from "../../src/context/CartContext";

export default function TabLayout() {
  const { cartCount } = useCart();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#FF6B47",
        tabBarInactiveTintColor: "#7d7977ff",
        tabBarStyle: {
          backgroundColor: "#ffffffff",

          borderTopWidth: 0,
          elevation: 8,
          shadowOpacity: 0.1,
          shadowRadius: 15,
          height: 75,
          paddingBottom: 10,
          paddingTop: 5,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          top: 8,
          fontWeight: "600",
        },
      }}
    >
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Home",
          tabBarLabel: "Home",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <MaterialIcons
                name="home"
                size={focused ? 35 : 28}
                color={focused ? "#FF6B47" : color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Explore",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <MaterialIcons
                name="explore"
                size={focused ? 35 : 28}
                color={focused ? "#FF6B47" : color}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <MaterialIcons
                name="shopping-cart"
                size={focused ? 35 : 28}
                color={focused ? "#FF6B47" : color}
              />
              {cartCount > 0 && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{cartCount}</Text>
                </View>
              )}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <View style={[styles.iconContainer, focused && styles.activeIcon]}>
              <MaterialIcons
                name="person"
                size={focused ? 35 : 28}
                color={focused ? "#FF6B47" : color}
              />
            </View>
          ),
        }}
      />
     
      <Tabs.Screen
        name="index"
        options={{
          href: null,
        }}
      />
     
    
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    top: 5,
  },
  activeIcon: {
    padding: -20,
    height: 40,
    width: 40,
  },
  badge: {
    position: "absolute",
    right: -6,
    top: -4,
    backgroundColor: "#FF6B47",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
