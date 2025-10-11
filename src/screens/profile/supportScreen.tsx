import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SupportScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Support & Help</Text>
      <Text style={styles.text}>
        Need help with your order or payment? Reach out to our support team anytime.
      </Text>

      <TouchableOpacity
        style={styles.option}
        onPress={() => Linking.openURL('mailto:support@homeliapp.com')}
      >
        <MaterialIcons name="email" size={24} color="#ff6600" />
        <Text style={styles.optionText}>Email: support@homeliapp.com</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => Linking.openURL('tel:+911234567890')}
      >
        <MaterialIcons name="phone" size={24} color="#ff6600" />
        <Text style={styles.optionText}>Call: +91 12345 67890</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  text: { fontSize: 16, color: '#555', marginBottom: 30 },
  option: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  optionText: { fontSize: 16, marginLeft: 10 },
});

export default SupportScreen;
