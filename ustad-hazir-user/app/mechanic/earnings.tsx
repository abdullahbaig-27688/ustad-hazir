import React, { useState } from "react";
import { View, Text, StyleSheet, FlatList, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import EarningHeader from "@/components/Header";
const sampleEarnings = [
  {
    id: "1",
    customer: "Ali Khan",
    service: "Car Repair",
    amount: 50,
    status: "Paid",
  },
  {
    id: "2",
    customer: "Sara Ahmed",
    service: "Bike Service",
    amount: 30,
    status: "Pending",
  },
  {
    id: "3",
    customer: "John Doe",
    service: "Bike Service",
    amount: 40,
    status: "Paid",
  },
];

const EarningsScreen = () => {
  const [earnings, setEarnings] = useState(sampleEarnings);

  const totalEarnings = earnings
    .filter((e) => e.status === "Paid")
    .reduce((sum, item) => sum + item.amount, 0);

  const pendingPayments = earnings
    .filter((e) => e.status === "Pending")
    .reduce((sum, item) => sum + item.amount, 0);

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View>
        <Text style={styles.customerName}>{item.customer}</Text>
        <Text style={styles.service}>{item.service}</Text>
      </View>
      <View style={styles.rightSide}>
        <Text style={styles.amount}>${item.amount}</Text>
        <Text
          style={[
            styles.status,
            { color: item.status === "Paid" ? "#4CAF50" : "#FFA500" },
          ]}
        >
          {item.status}
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <EarningHeader title="Your Earnings" showBack />
      {/* <Text style={styles.title}>Earnings & Payments</Text> */}

      {/* Summary */}
      <View style={styles.summaryContainer}>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Total Earnings</Text>
          <Text style={styles.summaryValue}>${totalEarnings}</Text>
        </View>
        <View style={styles.summaryBox}>
          <Text style={styles.summaryLabel}>Pending Payments</Text>
          <Text style={styles.summaryValue}>${pendingPayments}</Text>
        </View>
      </View>

      {/* Payment History */}
      <Text style={styles.sectionTitle}>Payment History</Text>
      <FlatList
        data={earnings}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};

export default EarningsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  summaryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
    padding: 20,
  },
  summaryBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    width: "48%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  summaryLabel: {
    fontSize: 14,
    color: "#555",
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    padding: 20,
    marginBottom: 12,
  },
  card: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  customerName: {
    fontSize: 16,
    fontWeight: "bold",
  },
  service: {
    fontSize: 14,
    color: "#555",
    marginTop: 4,
  },
  rightSide: {
    alignItems: "flex-end",
  },
  amount: {
    fontSize: 16,
    fontWeight: "bold",
  },
  status: {
    fontSize: 14,
    marginTop: 4,
  },
});
