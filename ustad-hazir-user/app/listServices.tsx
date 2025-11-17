import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getServicesByName } from "@/backend/machenicService";

const ListServices = () => {
  const { serviceName } = useLocalSearchParams();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      if (!serviceName) {
        console.warn("servicename param is undefined");
        setServices([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getServicesByName(serviceName as string);
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
    return <Text>Loading...</Text>;
  }

  if (!services.length) {
    return <Text>No services found for "{serviceName}"</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{serviceName} Services</Text>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.serviceName}</Text>
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
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  header: { fontSize: 22, fontWeight: "bold", marginBottom: 15 },
  card: {
    backgroundColor: "#f0f4ff",
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 5 },
});
