import React, { useState, useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { View, Text, FlatList, StyleSheet, Alert, Image } from "react-native";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";
import Header from "@/components/Header";
import Button from "@/components/Button";
import { getUserVehicles, deleteVehicle } from "@/backend/vehicleService";

interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  registration: string;
  type: string;
  transmission: string;
  fueltype: string;
  color: string;
  image: string | null;
}

const AllVehicles = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // 🔹 Fetch all vehicles
  useFocusEffect(
    useCallback(() => {
      const fetchVehicles = async () => {
        try {
          const data = await getUserVehicles();
          setVehicles(data);
        } catch (error) {
          console.error("❌ Error fetching vehicles:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchVehicles();
    }, [])
  );

  // ✅ Delete function
  const handleDelete = (id: string) => {
    Alert.alert(t("confirm_delete_title"), t("confirm_delete_message"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteVehicle(id);
            Alert.alert(t("vehicle_deleted"));
            setVehicles(vehicles.filter((v) => v.id !== id));
          } catch (error) {
            console.error(error);
            Alert.alert(t("delete_failed"));
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: Vehicle }) => (
    <View style={styles.card}>
      {item.image && (
        <Image source={{ uri: item.image }} style={styles.image} />
      )}
      <View style={styles.details}>
        <Text style={styles.title}>
          {item.brand} {item.model}
        </Text>
        <Text>
          {t("year")}: {item.year}
        </Text>
        <Text>
          {t("registration")}: {item.registration}
        </Text>
        <Text>
          {t("type")}: {item.type}
        </Text>
        <Text>
          {t("transmission")}: {item.transmission}
        </Text>
        <Text>
          {t("fuel")}: {item.fueltype}
        </Text>
        <Text>
          {t("color")}: {item.color}
        </Text>

        <View style={styles.actions}>
          <Button
            title={t("edit")}
            type="secondary"
            onPress={() => router.push(`/editvehicle/${item.id}`)}
          />
          <Button
            title={t("delete")}
            type="primary"
            onPress={() => handleDelete(item.id)}
          />
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header
        title={t("all_vehicles")}
        showBack={true}
        rightIcon="add"
        onRightPress={() => router.push("/(tabs)/addvehicle")}
      />
      {loading ? (
        <Text style={styles.loading}>{t("loading_vehicles")}</Text>
      ) : (
        <FlatList
          data={vehicles}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.empty}>{t("no_vehicles_found")}</Text>
          }
        />
      )}
    </View>
  );
};

export default AllVehicles;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  image: { width: 100, height: 100 },
  details: { flex: 1, padding: 10 },
  title: { fontWeight: "bold", fontSize: 16, marginBottom: 5 },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "space-between",
  },
});
