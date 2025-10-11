import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const PaymentMethodScreen = () => {
  const [selected, setSelected] = useState<string>('cod');

  const methods = [
    { id: 'cod', label: 'Cash on Delivery', icon: 'cash-outline' },
    { id: 'card', label: 'Credit / Debit Card', icon: 'card-outline' },
    { id: 'upi', label: 'UPI (Google Pay / PhonePe)', icon: 'logo-google' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Payment Method</Text>
      {methods.map((m) => (
        <TouchableOpacity
          key={m.id}
          style={[styles.option, selected === m.id && styles.selected]}
          onPress={() => setSelected(m.id)}
        >
          <Ionicons name={m.icon as any} size={24} color="#ff6600" />
          <Text style={styles.label}>{m.label}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.btn}>
        <Text style={styles.btnText}>Confirm Payment Method</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    marginBottom: 10,
  },
  selected: { borderColor: '#ff6600', backgroundColor: '#fff5f0' },
  label: { fontSize: 16, marginLeft: 10 },
  btn: {
    backgroundColor: '#ff6600',
    padding: 15,
    borderRadius: 10,
    marginTop: 30,
    alignItems: 'center',
  },
  btnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});

export default PaymentMethodScreen;
