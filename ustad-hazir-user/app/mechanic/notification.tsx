import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const dummyNotifications = [
  {
    id: "1",
    type: "job",
    title: "New Job Request: Car Repair",
    time: "10:30 AM",
  },
  {
    id: "2",
    type: "payment",
    title: "Payment Received: $50 from Ali Khan",
    time: "09:15 AM",
  },
  {
    id: "3",
    type: "job",
    title: "Customer Cancelled Job: Bike Service",
    time: "Yesterday",
  },
  {
    id: "4",
    type: "alert",
    title: "System Maintenance Tonight at 10 PM",
    time: "2 days ago",
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState(dummyNotifications);

  const renderItem = ({ item }) => {
    let icon, color;
    switch (item.type) {
      case "job":
        icon = "briefcase-outline";
        color = "#2196F3";
        break;
      case "payment":
        icon = "cash-outline";
        color = "#4CAF50";
        break;
      case "alert":
        icon = "alert-circle-outline";
        color = "#FFA500";
        break;
      default:
        icon = "notifications-outline";
        color = "#555";
    }

    return (
      <Pressable
        style={styles.notificationCard}
        onPress={() => alert(item.title)}
      >
        <Ionicons name={icon} size={28} color={color} style={{ marginRight: 12 }} />
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.time}>{item.time}</Text>
        </View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      />
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
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
  title: {
    fontSize: 16,
    fontWeight: "bold",
  },
  time: {
    fontSize: 12,
    color: "#555",
    marginTop: 2,
  },
});
