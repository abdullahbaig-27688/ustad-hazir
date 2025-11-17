import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import ListHeader from "@/components/Header";
import { getServicesByName } from "@/backend/machenicService";

const ListServices = () => {
  const { serviceName } = useLocalSearchParams(); // query key must match
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
});
