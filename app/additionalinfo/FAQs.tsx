import { Entypo } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useState } from "react";
import { faqItem } from "@/types/types";

const FAQs = () => {
  const router = useRouter();

  // FAQ data with questions and answers
  const faqData: faqItem[] = [
    {
      id: 1,
      question: "How do I edit my account?",
      answer:
        "To create an account, tap on the Profile tab and select 'Sign Up'. Fill in your details and follow the instructions to complete your registration.",
    },
    {
      id: 2,
      question: "How do I reset my password?",
      answer:
        "Go to the login screen and tap on 'Forgot Password'. Enter your email address and follow the instructions sent to your email to reset your password.",
    },
    {
      id: 3,
      question: "How do I contact customer support?",
      answer:
        "You can contact our customer support team by going to the Contact Us page or by sending an email to support@pioneermart.com.",
    },
    {
      id: 4,
      question: "What payment methods do you accept?",
      answer:
        "We accept credit cards, debit cards, PayPal, and mobile payment options such as Apple Pay and Google Pay.",
    },
    {
      id: 5,
      question: "Can I change my shipping address?",
      answer:
        "Yes, you can update your shipping address in your profile settings or during checkout before finalizing your order.",
    },
  ];

  type ExpandedItemsState = {
    [key: number]: boolean;
  };
  // State to track which FAQs are expanded
  const [expandedItems, setExpandedItems] = useState<ExpandedItemsState>({});

  // Toggle expanded state for a specific FAQ
  const toggleExpand = (id: number) => {
    setExpandedItems((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Entypo name="chevron-left" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Frequently Asked Questions</Text>
      </View>

      <ScrollView style={styles.contentContainer}>
        {faqData.map((faq) => (
          <View key={faq.id} style={styles.faqItem}>
            <TouchableOpacity
              style={styles.questionContainer}
              onPress={() => toggleExpand(faq.id)}
              activeOpacity={0.8}
            >
              <Text style={styles.questionText}>{faq.question}</Text>
              <Entypo
                name={expandedItems[faq.id] ? "chevron-up" : "chevron-down"}
                size={20}
                color="black"
              />
            </TouchableOpacity>

            {expandedItems[faq.id] && (
              <View style={styles.answerContainer}>
                <View style={styles.divider} />
                <Text style={styles.answerText}>{faq.answer}</Text>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default FAQs;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 20,
    marginVertical: 12,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 30,
    marginBottom: 20,
  },
  backBtn: {
    padding: 10,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "600",
    position: "absolute",
    left: 0,
    right: 0,
    textAlign: "center",
  },
  contentContainer: {
    flex: 1,
  },
  faqItem: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
  },
  questionContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
  },
  questionText: {
    fontSize: 16,
    fontWeight: "500",
    flex: 1,
  },
  divider: {
    height: 1,
    backgroundColor: "#e0e0e0",
    marginHorizontal: 16,
  },
  answerContainer: {
    paddingBottom: 16,
  },
  answerText: {
    fontSize: 15,
    color: "#555",
    padding: 16,
    paddingTop: 12,
  },
});
