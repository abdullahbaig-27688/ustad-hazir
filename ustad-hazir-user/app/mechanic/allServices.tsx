import { deleteService, getAllServices } from "@/backend/machenicService";
import Button from "@/components/Button";
import AllServiceHeader from "@/components/Header";
import { Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View
} from "react-native";

// 🟦 TRANSLATION
import { useTranslation } from "react-i18next";

const AllServices = () => {
  const { t } = useTranslation();

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
      fetchServices();
    }, [])
  );

  // DELETE CONFIRMATION
  const handleDelete = (id: string) => {
    Alert.alert(t("delete_service"), t("delete_confirm"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          await deleteService(id);
          fetchServices();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <AllServiceHeader
        title={t("service_history")}
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
            <Text style={styles.noServices}>{t("no_services")}</Text>
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
                  <Text style={styles.servicePrice}>
                    {t("price")}: PKR {s.price}
                  </Text>
                  <Text style={styles.serviceCategory}>
                    {t("category")}: {s.category}
                  </Text>

                  {s.description ? (
                    <Text style={styles.serviceDescription}>
                      {t("description")}: {s.description}
                    </Text>
                  ) : (
                    <Text style={styles.serviceDescriptionEmpty}>
                      {t("no_description")}
                    </Text>
                  )}

                  {/* LOCATION */}
                  {s.location && (
                    <View style={{ marginTop: 6 }}>
                      <Text style={styles.locationText}>
                        📍 {s.location.city || t("city")} ,{" "}
                        {s.location.state || t("state")}
                      </Text>
                      <Text style={styles.locationSubText}>
                        {s.location.country || t("country")}
                      </Text>
                    </View>
                  )}

                  {/* ACTION BUTTONS */}
                  <View style={styles.actionRow}>
                    <Button
                      title={t("edit")}
                      type="primary"
                      onPress={() => router.push(`/editservice/${s.id}`)}
                    />

                    <Button
                      title={t("delete")}
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
    </View>
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

  actionRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
});
