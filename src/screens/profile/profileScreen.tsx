import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth(); // ✅ use actual logged-in user data

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: 'person', route: '/edit-profile' },
    { id: '2', title: 'Order History', icon: 'history', route: '/orders' },
    { id: '3', title: 'Favorite Items', icon: 'favorite', route: '/favorites' },
    { id: '4', title: 'Delivery Address', icon: 'location-on', route: '/addresses' },
    { id: '5', title: 'Payment Methods', icon: 'payment', route: '/payment-methods' },
    { id: '6', title: 'Notifications', icon: 'notifications', route: '/notification' },
    { id: '7', title: 'Help & Support', icon: 'help', route: '/support' },
    { id: '8', title: 'About', icon: 'info', route: '/about' },
  ];

  const handleMenuPress = (route: string, title: string) => {
    if (route) {
      router.push(route as never);
    } else {
      Alert.alert(title, `${title} feature coming soon!`, [{ text: 'OK' }]);
    }
  };

const handleLogout = () => {
  Alert.alert('Logout', 'Are you sure you want to logout?', [
    { text: 'Cancel', style: 'cancel' },
    {
      text: 'Logout',
      style: 'destructive',
      onPress: async () => {
        try {
          await logout(); // Clears AsyncStorage + resets AuthContext
          router.replace('/(auth)/login'); // ✅ Use login route explicitly
        } catch (error) {
          console.error('Logout error:', error);
          Alert.alert('Error', 'Something went wrong during logout.');
        }
      },
    },
  ]);
};


  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      {/* ✅ Dynamic user info header */}
      <LinearGradient
        colors={['#f73706ff', '#ff8352ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.header}
      >
        <View style={styles.profileContainer}>
          <View style={styles.avatarContainer}>
            <MaterialIcons name="person" size={40} color="#FFF" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.name || 'Guest User'}</Text>
            <Text style={styles.userEmail}>{user?.email || 'Not logged in'}</Text>
            {user?.phone ? (
              <Text style={styles.userPhone}>+91 {user.phone}</Text>
            ) : null}
          </View>
        </View>
      </LinearGradient>

      {/* ✅ Menu and other UI remain unchanged */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuContainer}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => handleMenuPress(item.route, item.title)}
            >
              <View style={styles.menuIconContainer}>
                <MaterialIcons name={item.icon as any} size={24} color="#FF6B47" />
              </View>
              <Text style={styles.menuTitle}>{item.title}</Text>
              <MaterialIcons name="chevron-right" size={24} color="#CCC" />
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="#FF6B47" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={styles.appInfo}>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.appName}>Homeli Native</Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fffefaff' },
  header: { paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 },
  profileContainer: { flexDirection: 'row', alignItems: 'center' },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 20,
  },
  userInfo: { flex: 1 },
  userName: { fontSize: 22, fontWeight: 'bold', color: '#FFF', marginBottom: 5 },
  userEmail: { fontSize: 14, color: '#FFF', opacity: 0.9, marginBottom: 3 },
  userPhone: { fontSize: 14, color: '#FFF', opacity: 0.9 },
  content: { flex: 1, paddingHorizontal: 20 },
  menuContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    marginTop: 20,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIconContainer: { width: 40, alignItems: 'center', marginRight: 15 },
  menuTitle: { flex: 1, fontSize: 16, color: '#333', fontWeight: '500' },
  appInfo: { alignItems: 'center', marginTop: 30, marginBottom: 20 },
  appVersion: { fontSize: 12, color: '#999', top: 40 },
  appName: { fontSize: 16, color: '#666', fontWeight: '600', marginTop: 5, top: 40 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 15,
    marginTop: 20,
    borderWidth: 2,
    borderColor: '#FF6B47',
    top: 15,
  },
  logoutText: { fontSize: 16, color: '#FF6B47', fontWeight: 'bold', marginLeft: 10 },
});
