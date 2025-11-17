import { getUserServiceRequests } from "@/backend/requestService";
import Header from "@/components/Header";
import { db } from "@/src/firebaseConfig";
import { useRouter } from "expo-router";
import { Timestamp, doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Image, StyleSheet, Text, View } from "react-native";
import { useTranslation } from "react-i18next";

interface ServiceRequest {
  id: string;
  vehicleId: string;
  vehicleBrand?: string;
  vehicleName?: string;
  vehicleModel?: string;
  registration?: string;
  serviceType: string;
  issueDesc: string;
  preferredDate?: string;
  pickupAddress?: string;
  dropoffAddress?: string;
  imageUri?: string | null;
  createdAt?: Timestamp | string;
  status?: string;
}

// Fetch vehicle details by ID
const fetchVehicleDetails = async (vehicleId: string) => {
  if (!vehicleId) return {};
  try {
    const docRef = doc(db, "vehicles", vehicleId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return {};
  } catch (error) {
    console.error("❌ Error fetching vehicle:", error);
    return {};
  }
};

const AllServiceRequests = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getUserServiceRequests();

        // Enrich each request with vehicle details
        const dataWithVehicles = await Promise.all(
          data.map(async (request) => {
            const vehicle = await fetchVehicleDetails(request.vehicleId);
            return {
              ...request,
              vehicleBrand: vehicle.brand ?? "",
              vehicleName: vehicle.name ?? "",
              vehicleModel: vehicle.model ?? "",
              registration: vehicle.registration ?? "",
            };
          })
        );

        setRequests(dataWithVehicles);
      } catch (error) {
        console.error("❌ Error fetching service requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const renderItem = ({ item }: { item: ServiceRequest }) => {
    let createdAtString = t("na");
    if (item.createdAt) {
      if (typeof item.createdAt === "object" && "toDate" in item.createdAt) {
        createdAtString = item.createdAt.toDate().toLocaleString();
      } else {
        createdAtString = new Date(item.createdAt).toLocaleString();
      }
    }

    return (
      <View style={styles.card}>
        {item.imageUri && (
          <Image source={{ uri: item.imageUri }} style={styles.image} />
        )}
        <View style={styles.details}>
          <Text style={styles.title}>
            {item.serviceType ?? t("service_request")}
          </Text>

          {/* Vehicle Info */}
          <Text style={styles.text}>
            {t("vehicle")}: {item.vehicleBrand} {item.vehicleName}{" "}
            {item.vehicleModel}
          </Text>
          <Text style={styles.text}>
            {t("plate")}: {item.registration ?? t("na")}
          </Text>

          {/* Optional fields */}
          {item.preferredDate && (
            <Text style={styles.text}>
              {t("preferred_date")}: {item.preferredDate}
            </Text>
          )}
          {item.pickupAddress && (
            <Text style={styles.text}>
              {t("pickup")}: {item.pickupAddress}
            </Text>
          )}
          {item.dropoffAddress && (
            <Text style={styles.text}>
              {t("dropoff")}: {item.dropoffAddress}
            </Text>
          )}

          <Text style={styles.text}>
            {t("issue")}: {item.issueDesc}
          </Text>

          {/* Status */}
          <Text style={styles.status}>
            {t("status")}: {item.status ?? t("pending")}
          </Text>

          {/* Created Date */}
          <Text style={styles.date}>
            {t("created")}: {createdAtString}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("service_request_history")}
        showBack={true}
        rightIcon="add"
        onRightPress={() => router.push("/(tabs)/requestservice")}
      />
      {loading ? (
        <Text style={styles.loading}>{t("loading_service_history")}</Text>
      ) : (
        <FlatList
          data={requests}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={styles.empty}>{t("no_requests_found")}</Text>
          }
        />
      )}
    </View>
  );
};

export default AllServiceRequests;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  loading: { textAlign: "center", marginTop: 50, fontSize: 16 },
  empty: { textAlign: "center", marginTop: 50, fontSize: 16, color: "#888" },
  card: {
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    marginBottom: 15,
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  image: { width: 100, height: 100 },
  details: { flex: 1, padding: 12 },
  title: {
    fontWeight: "bold",
    fontSize: 17,
    marginBottom: 6,
    color: "#0D47A1",
  },
  text: { fontSize: 13, color: "#333", marginBottom: 3 },
  status: { fontSize: 13, color: "#1565C0", marginTop: 5, fontWeight: "500" },
  date: { fontSize: 12, color: "#777", marginTop: 4 },
});
