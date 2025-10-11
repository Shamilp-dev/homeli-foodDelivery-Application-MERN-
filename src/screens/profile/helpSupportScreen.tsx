import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
  Linking,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';

interface FAQ {
  id: string;
  question: string;
  answer: string;
  expanded: boolean;
}

export default function HelpSupportScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [showMessageModal, setShowMessageModal] = useState(false);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [faqs, setFaqs] = useState<FAQ[]>([
    {
      id: '1',
      question: 'How do I place an order?',
      answer: 'Browse our menu, add items to cart, proceed to checkout, fill in delivery details, and complete payment.',
      expanded: false,
    },
    {
      id: '2',
      question: 'What payment methods do you accept?',
      answer: 'We accept UPI, Credit/Debit Cards, and Cash on Delivery (COD).',
      expanded: false,
    },
    {
      id: '3',
      question: 'How long does delivery take?',
      answer: 'Delivery typically takes 30-45 minutes depending on your location and order volume.',
      expanded: false,
    },
    {
      id: '4',
      question: 'Can I cancel my order?',
      answer: 'Yes, you can cancel your order before it is confirmed. Once confirmed, cancellation may not be possible.',
      expanded: false,
    },
    {
      id: '5',
      question: 'What is your refund policy?',
      answer: 'Refunds are processed within 5-7 business days for prepaid orders in case of cancellation or issues.',
      expanded: false,
    },
    {
      id: '6',
      question: 'How do I track my order?',
      answer: 'Go to Orders section to see real-time status of your order from preparation to delivery.',
      expanded: false,
    },
    {
      id: '7',
      question: 'Do you have minimum order value?',
      answer: 'No, there is no minimum order value. However, delivery charges may apply for orders below ₹200.',
      expanded: false,
    },
    {
      id: '8',
      question: 'Are there any offers available?',
      answer: 'Check our Explore section for current offers and discounts. We regularly update promotional deals.',
      expanded: false,
    },
  ]);

  const messageCategories = [
    'Order Issue',
    'Payment Problem',
    'Delivery Concern',
    'Food Quality',
    'Account Help',
    'Feedback',
    'Other',
  ];

  const toggleFAQ = (id: string) => {
    setFaqs(
      faqs.map((faq) =>
        faq.id === id ? { ...faq, expanded: !faq.expanded } : faq
      )
    );
  };

  const handleCall = () => {
    Linking.openURL('tel:+919876543210');
  };

  const handleEmail = () => {
    Linking.openURL('mailto:support@homeli.com');
  };

  const handleWhatsApp = () => {
    Linking.openURL('whatsapp://send?phone=919876543210&text=Hi, I need help with');
  };

  const handleSendMessage = async () => {
    if (!selectedCategory) {
      Alert.alert('Error', 'Please select a category');
      return;
    }
    if (!messageSubject.trim()) {
      Alert.alert('Error', 'Please enter a subject');
      return;
    }
    if (!messageBody.trim()) {
      Alert.alert('Error', 'Please describe your issue');
      return;
    }

    // Here you would send the message to your backend
    // For now, we'll just show a success message
    try {
      // await sendSupportMessage({
      //   userId: user?.id,
      //   category: selectedCategory,
      //   subject: messageSubject,
      //   message: messageBody,
      // });

      Alert.alert(
        'Message Sent!',
        'Our support team will get back to you within 24 hours.',
        [
          {
            text: 'OK',
            onPress: () => {
              setShowMessageModal(false);
              resetMessageForm();
            },
          },
        ]
      );
    } catch (error) {
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const resetMessageForm = () => {
    setSelectedCategory('');
    setMessageSubject('');
    setMessageBody('');
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialIcons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Contact Us</Text>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.actionCard} onPress={handleCall}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="phone" size={28} color="#FF6B47" />
              </View>
              <Text style={styles.actionText}>Call Us</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleEmail}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="email" size={28} color="#FF6B47" />
              </View>
              <Text style={styles.actionText}>Email</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.actionCard} onPress={handleWhatsApp}>
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="chat" size={28} color="#FF6B47" />
              </View>
              <Text style={styles.actionText}>WhatsApp</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.actionCard}
              onPress={() => setShowMessageModal(true)}
            >
              <View style={styles.actionIconContainer}>
                <MaterialIcons name="message" size={28} color="#FF6B47" />
              </View>
              <Text style={styles.actionText}>Message</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Support Hours */}
        <View style={styles.infoCard}>
          <MaterialIcons name="schedule" size={24} color="#FF6B47" />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Support Hours</Text>
            <Text style={styles.infoText}>Monday - Sunday: 8:00 AM - 10:00 PM</Text>
          </View>
        </View>

        {/* FAQs */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <TouchableOpacity
              key={faq.id}
              style={styles.faqCard}
              onPress={() => toggleFAQ(faq.id)}
            >
              <View style={styles.faqHeader}>
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <MaterialIcons
                  name={faq.expanded ? 'expand-less' : 'expand-more'}
                  size={24}
                  color="#666"
                />
              </View>
              {faq.expanded && (
                <Text style={styles.faqAnswer}>{faq.answer}</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Policies */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Policies & Terms</Text>
          <TouchableOpacity style={styles.policyItem}>
            <MaterialIcons name="description" size={20} color="#666" />
            <Text style={styles.policyText}>Terms & Conditions</Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.policyItem}>
            <MaterialIcons name="privacy-tip" size={20} color="#666" />
            <Text style={styles.policyText}>Privacy Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.policyItem}>
            <MaterialIcons name="replay" size={20} color="#666" />
            <Text style={styles.policyText}>Refund Policy</Text>
            <MaterialIcons name="chevron-right" size={24} color="#999" />
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={styles.appInfo}>
          <Text style={styles.appName}>Homeli</Text>
          <Text style={styles.appVersion}>Version 1.0.0</Text>
          <Text style={styles.copyright}>© 2025 Homeli. All rights reserved.</Text>
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* Send Message Modal */}
      <Modal
        visible={showMessageModal}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowMessageModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Message to Support</Text>
              <TouchableOpacity onPress={() => setShowMessageModal(false)}>
                <MaterialIcons name="close" size={24} color="#333" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.label}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.categoryScroll}
              >
                {messageCategories.map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryChip,
                      selectedCategory === category && styles.categoryChipSelected,
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text
                      style={[
                        styles.categoryChipText,
                        selectedCategory === category &&
                          styles.categoryChipTextSelected,
                      ]}
                    >
                      {category}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>

              <Text style={styles.label}>Subject</Text>
              <TextInput
                style={styles.input}
                placeholder="Brief description of your issue"
                value={messageSubject}
                onChangeText={setMessageSubject}
                placeholderTextColor="#999"
              />

              <Text style={styles.label}>Message</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                placeholder="Describe your issue in detail..."
                value={messageBody}
                onChangeText={setMessageBody}
                multiline
                numberOfLines={6}
                placeholderTextColor="#999"
              />

              <View style={styles.userInfo}>
                <MaterialIcons name="info-outline" size={16} color="#666" />
                <Text style={styles.userInfoText}>
                  We will respond to: {user?.email || 'your registered email'}
                </Text>
              </View>

              <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
                <MaterialIcons name="send" size={20} color="#FFF" />
                <Text style={styles.sendButtonText}>Send Message</Text>
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
  section: { marginBottom: 25 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 15 },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  actionCard: {
    width: '23%',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#FFF0ED',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionText: { fontSize: 12, color: '#333', textAlign: 'center', fontWeight: '500' },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  infoContent: { flex: 1, marginLeft: 12 },
  infoTitle: { fontSize: 16, fontWeight: 'bold', color: '#333', marginBottom: 4 },
  infoText: { fontSize: 14, color: '#666' },
  faqCard: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: '#333', flex: 1 },
  faqAnswer: {
    fontSize: 14,
    color: '#666',
    marginTop: 10,
    lineHeight: 20,
  },
  policyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  policyText: { flex: 1, fontSize: 15, color: '#333', marginLeft: 12 },
  appInfo: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  appName: { fontSize: 24, fontWeight: 'bold', color: '#FF6B47', marginBottom: 5 },
  appVersion: { fontSize: 14, color: '#666', marginBottom: 5 },
  copyright: { fontSize: 12, color: '#999' },
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
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    marginTop: 12,
  },
  categoryScroll: {
    marginBottom: 15,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    marginRight: 8,
  },
  categoryChipSelected: {
    backgroundColor: '#FFF0ED',
    borderColor: '#FF6B47',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#666',
  },
  categoryChipTextSelected: {
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
    height: 120,
    textAlignVertical: 'top',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    gap: 8,
  },
  userInfoText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  sendButton: {
    backgroundColor: '#FF6B47',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    gap: 10,
  },
  sendButtonText: { fontSize: 16, fontWeight: 'bold', color: '#FFF' },
});