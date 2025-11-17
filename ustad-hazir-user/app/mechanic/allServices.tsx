import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import Button from "@/components/Button";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import AllServiceHeader from "@/components/Header";
import { router, useFocusEffect } from "expo-router";
import { getAllServices, deleteService } from "@/backend/machenicService"; // <-- DELETE added

const AllServices = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const data = await getAllServices();
      setServices(data);
    } catch (error) {
      console.error("Error fetching services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchServices();
    setRefreshing(false);
  };
  useFocusEffect(
    useCallback(() => {
      fetchServices(); // Runs every time user comes back to this screen
    }, [])
  );

  // 🔥 DELETE CONFIRMATION
  const handleDelete = (id: string) => {
    Alert.alert(
      "Delete Service",
      "Are you sure you want to delete this service?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await deleteService(id);
            fetchServices();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <AllServiceHeader
        title="Service History"
        showBack
        rightIcon="add"
        onRightPress={() => router.push("/mechanic/addService")}
      />

      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#2196F3" />
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {services.length === 0 ? (
            <Text style={styles.noServices}>No services added yet.</Text>
          ) : (
            services.map((s) => (
              <View key={s.id} style={styles.serviceCard}>
                <View style={styles.iconBox}>
                  <Ionicons
                    name="construct-outline"
                    size={28}
                    color="#2196F3"
                  />
                </View>

                <View style={styles.serviceInfo}>
                  <Text style={styles.serviceName}>{s.serviceName}</Text>
                  <Text style={styles.servicePrice}>PKR {s.price}</Text>
                  <Text style={styles.serviceCategory}>{s.category}</Text>

                  {s.description ? (
                    <Text style={styles.serviceDescription}>
                      {s.description}
                    </Text>
                  ) : (
                    <Text style={styles.serviceDescriptionEmpty}>
                      No description provided.
                    </Text>
                  )}

                  {/* LOCATION */}
                  {s.location && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={styles.locationText}>
                        📍 {s.location.city || "Unknown City"},{" "}
                        {s.location.state || ""}
                      </Text>
                      <Text style={styles.locationSubText}>
                        {s.location.country || ""}
                      </Text>
                    </View>
                  )}

                  {/* ACTION BUTTONS */}
                  <View style={styles.actionRow}>
                    {/* EDIT */}
                    <Button
                      title="Edit"
                      type="primary"
                      onPress={() => router.push(`/editservice/${s.id}`)}
                    />
                    <Button
                      title="Delete"
                      type="secondary"
                      onPress={() => handleDelete(s.id)}
                    />
                  </View>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

export default AllServices;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  content: { padding: 16 },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },

  serviceCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
  },

  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E8F3FF",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  serviceInfo: { flex: 1 },
  serviceName: { fontSize: 16, fontWeight: "bold", color: "#222" },
  servicePrice: { fontSize: 14, color: "#4CAF50", marginTop: 4 },
  serviceCategory: { fontSize: 13, color: "#777", marginTop: 2 },

  serviceDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#555",
    lineHeight: 18,
  },
  serviceDescriptionEmpty: {
    marginTop: 6,
    fontSize: 13,
    color: "#999",
    fontStyle: "italic",
  },

  locationText: { fontSize: 13, color: "#333" },
  locationSubText: { fontSize: 12, color: "#777" },

  noServices: {
    textAlign: "center",
    color: "#777",
    fontSize: 15,
    marginTop: 40,
  },

  // ACTION BUTTONS
  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },

  editBtn: {
    flexDirection: "row",
    backgroundColor: "#2196F3",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  editText: { color: "#fff", marginLeft: 4, fontSize: 13 },

  deleteBtn: {
    flexDirection: "row",
    backgroundColor: "#E53935",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
  },
  deleteText: { color: "#fff", marginLeft: 4, fontSize: 13 },
});
