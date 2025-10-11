import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const { width: screenWidth } = Dimensions.get("window");

const AboutScreen: React.FC = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentSpecialtyIndex, setCurrentSpecialtyIndex] = useState(0);
  const [currentChefIndex, setCurrentChefIndex] = useState(0);

  const router = useRouter();
  const imageTimerRef = useRef<any>(null);
  const specialtyTimerRef = useRef<any>(null);
  const chefTimerRef = useRef<any>(null);

  const chefs = [
    {
      id: 1,
      name: "Priya Iyer",
      location: "Bengaluru, Karnataka",
      quote: "My grandmother's recipes are the soul of my cooking!",
      image: require("../../../assets/images/chef/chef-priya.png"),
    },
    {
      id: 2,
      name: "Venkat Reddy",
      location: "Hyderabad, Andhra Pradesh",
      quote: "The perfect balance of spices is an art, no perfect timing!",
      image: require("../../../assets/images/chef/chef-venkat.png"),
    },
    {
      id: 3,
      name: "Lakshmi Nair",
      location: "Kochi, Kerala",
      quote: "A traditional Kerala meal is not just food, it's an experience!",
      image: require("../../../assets/images/chef/chef-lakshmi.png"),
    },
  ];

  const specialties = [
    {
      icon: "restaurant",
      title: "Traditional Recipes",
      description:
        "Authentic homemade South Indian dishes prepared with love using traditional methods passed down through generations.",
    },
    {
      icon: "eco",
      title: "Fresh Ingredients",
      description:
        "Locally sourced fresh curry leaves, coconut, and spices make our food truly authentic and flavorful.",
    },
    {
      icon: "favorite",
      title: "Healthy Choices",
      description:
        "Nutritious meals made with quality ingredients and minimal oil for a healthy, guilt-free experience.",
    },
  ];

  // Auto-change specialties
  useEffect(() => {
    specialtyTimerRef.current = setInterval(() => {
      setCurrentSpecialtyIndex((prev) => (prev + 1) % specialties.length);
    }, 3500);

    return () => {
      clearInterval(specialtyTimerRef.current);
    };
  }, []);

  // Auto-change chefs
  useEffect(() => {
    chefTimerRef.current = setInterval(() => {
      setCurrentChefIndex((prev) => (prev + 1) % chefs.length);
    }, 4000);

    return () => {
      clearInterval(chefTimerRef.current);
    };
  }, []);

  const handleExploreMenu = () => {
    router.push("/(tabs)/explore");
  };

  return (
    <SafeAreaView style={styles.container} edges={["left", "right"]}>
      <StatusBar barStyle="light-content" backgroundColor="#FF6B47" />
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Header */}
        <LinearGradient
          colors={["#f72606ff", "#f74e06ff", "#ff8352ff"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.header}
        >
          <View style={styles.headerContent}>
            <Text style={styles.headerTitle}>About Homeli</Text>
            <Text style={styles.headerSubtitle}>
              Authentic homemade South Indian dishes at your home since 2025
            </Text>
          </View>
        </LinearGradient>

        {/* Our Story Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Our Story</Text>
          <Text style={styles.storyText}>
            Homeli was founded in 2025 by a group of South Indian food
            enthusiasts who wanted to share the authentic taste of home-cooked
            meals with busy professionals and families. Starting from a tiny
            kitchen in Chennai, we have grown to serve thousands of happy
            customers across major cities.
          </Text>
          <Text style={styles.storyText}>
            Our recipes come from generations of culinary traditions, using the
            same techniques and ingredients that made home-Indian cuisine so
            special. Every dish is prepared fresh and focuses on the aromatic
            symphony of flavors that South Indian food is famous for.
          </Text>
        </View>

        {/* Our Specialties Section (Dynamic) */}
        <View style={styles.section}>
          <Text style={styles.specialtySectionTitle}>Our Specialties</Text>
          <View style={styles.specialtyCard}>
            <View style={styles.specialtyIconContainer}>
              <MaterialIcons
                name={specialties[currentSpecialtyIndex].icon as any}
                size={32}
                color="#FF6B47"
              />
            </View>
            <Text style={styles.specialtyTitle}>
              {specialties[currentSpecialtyIndex].title}
            </Text>
            <Text style={styles.specialtyDescription}>
              {specialties[currentSpecialtyIndex].description}
            </Text>
          </View>
        </View>

        {/* Meet Our Master Chefs Section (Dynamic) */}
        <View style={styles.section}>
          <Text style={styles.chefSectionTitle}>Meet Our Master Chefs</Text>
          <View style={styles.chefCard}>
            <View style={styles.chefImageContainer}>
              <Image
                source={chefs[currentChefIndex].image}
                style={styles.chefImage}
                resizeMode="cover"
              />
            </View>
            <Text style={styles.chefName}>{chefs[currentChefIndex].name}</Text>
            <Text style={styles.chefLocation}>
              {chefs[currentChefIndex].location}
            </Text>
            <Text style={styles.chefQuote}>
              {chefs[currentChefIndex].quote}
            </Text>
          </View>
        </View>

        {/* CTA Section */}
        <View style={styles.ctaSection}>
          <Text style={styles.ctaTitle}>
            Ready to experience authentic South Indian home cooking?
          </Text>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={handleExploreMenu}
          >
            <Text style={styles.ctaButtonText}>Explore Our Menu</Text>
            <MaterialIcons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>
        </View>

        <View style={styles.footer} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fcfaf2ff" },
  header: { paddingTop: 60, paddingBottom: 30, paddingHorizontal: 20 },
  headerContent: { alignItems: "center" },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#FFF",
    textAlign: "center",
    opacity: 0.95,
  },
  section: { paddingHorizontal: 20, paddingVertical: 30 },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B47",
    marginBottom: 20,
    textAlign: "center",
     bottom:15,
  },
  specialtySectionTitle : {

     fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B47",
    marginBottom: 20,
    textAlign: "center",
    bottom:70,



  },
  storyText: {
    fontSize: 15,
    color: "#666",
    lineHeight: 24,
    marginBottom: 10,
    textAlign: "justify",
     bottom:25,
  },
  storyImageContainer: {
    marginTop: 20,
    borderRadius: 15,
    overflow: "hidden",
    position: "relative",
  },
  imageDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
  },
  imageDotActive: { backgroundColor: "#FFF", width: 24 },
  specialtyCard: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    bottom:55,
   
  },
  specialtyIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFF0ED",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    
  },
  specialtyTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  specialtyDescription: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
  },
  chefCard: {
    backgroundColor: "#ffffffff",
    borderRadius: 15,
    padding: 25,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  bottom:60,
  },
  chefImageContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#FFF",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    overflow: "hidden",
  },
  chefSectionTitle:{
 fontSize: 24,
    fontWeight: "bold",
    color: "#FF6B47",
    marginBottom: 20,
    textAlign: "center",
    bottom:80,

    
  },
  chefImage: { width: "100%", height: "100%" },
  chefName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  chefLocation: { fontSize: 14, color: "#666", marginBottom: 10 },
  chefQuote: {
    fontSize: 14,
    color: "#333",
    textAlign: "center",
    fontStyle: "italic",
    lineHeight: 20,
  },
  ctaSection: {
    paddingHorizontal: 20,
    paddingVertical: 40,
    alignItems: "center",
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FF6B47",
    textAlign: "center",
    marginBottom: 25,
    lineHeight: 30,
  },
  ctaButton: {
    backgroundColor: "#ff633cff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    gap: 10,
    shadowColor: "#FF6B47",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  ctaButtonText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  footer: { height: 50 },
});

export default AboutScreen;
