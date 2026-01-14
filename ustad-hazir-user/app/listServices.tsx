import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { getServicesByName } from "@/backend/machenicService";
import { addQuickServiceRequest } from "@/backend/requestService";
import ListHeader from "@/components/Header";

const ListServices = () => {
  const { serviceName } = useLocalSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!serviceName) {
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getServicesByName(serviceName as string);
        console.log("Fetched services:", data);
        setServices(data || []);
      } catch (error) {
        console.error("Error fetching services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [serviceName]);

  const handleRequestService = async (item: any) => {
    try {
      await addQuickServiceRequest(item);
      Alert.alert("Success", "Service request sent to mechanic!");
    } catch (error) {
      Alert.alert("Error", "Could not send request.");
    }
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0D47A1" />
      </View>
    );
  }

  if (!services.length) {
    return (
      <View style={styles.center}>
        <Text>No services found for "{serviceName}"</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ListHeader title="Services" showBack />
      <Text style={styles.header}>{serviceName} Services</Text>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>Service Name: {item.serviceName}</Text>
            <Text>Mechanic: {item.name}</Text>
            <Text>Workshop: {item.workshopName}</Text>
            <Text>Contact: {item.contact}</Text>
            <Text>Description: {item.description}</Text>
            <Text>Price: PKR {item.price}</Text>
            <Text>Duration: {item.duration}</Text>

            {/* Buttons */}
            <View style={styles.buttonRow}>
              <Pressable
                style={styles.primaryButton}
                onPress={() => handleRequestService(item)}
              >
                <Text style={styles.primaryButtonText}>Request Service</Text>
              </Pressable>

              <Pressable style={styles.secondaryButton}>
                <Text style={styles.secondaryButtonText}>View Profile</Text>
              </Pressable>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ListServices;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { fontSize: 22, fontWeight: "bold", padding: 20, marginBottom: 15 },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 12,
  },
  primaryButton: {
    flex: 1,
    backgroundColor: "#0D47A1",
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    alignItems: "center",
  },
  primaryButtonText: { color: "#fff", fontWeight: "600" },
  secondaryButton: {
    flex: 1,
    backgroundColor: "#e3e9ff",
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#0D47A1",
    fontWeight: "600",
  },
});
