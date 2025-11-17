import { auth, db } from "@/src/firebaseConfig";
import { createChatIfNotExists } from "@/utils/createChat";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSingleVehicle } from "@/backend/vehicleService";
import {
  listenToAllServices,
  listenToCustomerRequests,
  updateRequestStatus,
} from "@/backend/machenicService";

const HomeScreen = () => {
  const [userName, setUserName] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);

  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ Fetch mechanic name
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) setUserName(userDoc.data().name || "Mechanic");
          else setUserName(user.displayName || "Mechanic");
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };
    fetchUserName();
  }, []);

  // ✅ Fetch mechanic’s services
  useEffect(() => {
    const unsubscribeAuth = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubscribeServices = listenToAllServices((data) => {
          setServices(data);
          setLoading(false);
        });
        return () => unsubscribeServices();
      } else {
        setServices([]);
        setLoading(false);
      }
    });
    return () => unsubscribeAuth();
  }, []);

  // Listen for active Jobs
  useEffect(() => {
    const acceptedJob = requests.find((r) => r.status === "accepted") || null;
    setActiveJob(acceptedJob);
  }, [requests]);

  // ✅ Listen for customer requests
  useEffect(() => {
    const unsubscribe = listenToCustomerRequests((data) => setRequests(data));
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchRequestsWithVehicles = async () => {
      const unsubscribe = listenToCustomerRequests(async (data) => {
        const requestsWithVehicles = await Promise.all(
          data.map(async (request) => {
            if (request.vehicleId) {
              try {
                const vehicle = await getSingleVehicle(request.vehicleId);
                const vehicleName = vehicle
                  ? `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.color}`
                  : "N/A";
                return { ...request, vehicleName };
              } catch (err) {
                console.error("Error fetching vehicle:", err);
                return { ...request, vehicleName: "N/A" };
              }
            } else {
              return { ...request, vehicleName: "N/A" };
            }
          })
        );
        setRequests(requestsWithVehicles);
      });

      return () => unsubscribe();
    };

    fetchRequestsWithVehicles();
  }, []);

  // ✅ Accept/Reject requests
  const handleAccept = async (request) => {
    const mechanic = auth.currentUser;
    if (!mechanic) return;

    try {
      // 1️⃣ Update request status
      await updateRequestStatus(request.id, "accepted");

      // ✅ Fetch vehicle details
      const vehicle = await getSingleVehicle(request.vehicleId);
      const vehicleName = vehicle
        ? `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.color}`
        : "N/A";
      const activeJobWithVehicle = {
        ...request,
        vehicleName,
      };

      // 2️⃣ Set as active job
      setActiveJob(activeJobWithVehicle);

      // 2️⃣ Create chat (between customer and mechanic)
      const chatId = await createChatIfNotExists(
        request.ownerId, // ✅ Customer’s UID from Firestore
        mechanic.uid, // ✅ Mechanic’s UID
        request.customerName, // ✅ Customer’s name
        mechanic.displayName || "Mechanic" // ✅ Mechanic’s name
      );

      if (chatId) {
        console.log("✅ Chat created:", chatId);

        // 3️⃣ Redirect to chat screen
        // router.push({
        //   pathname: "/mechanic/inbox",
        //   params: { chatId },
        // });
      }
    } catch (error) {
      console.error("❌ Error accepting request:", error);
    }
  };

  const handleReject = async (id: string) =>
    await updateRequestStatus(id, "rejected");

  const renderRequest = ({ item }) => (
    <View style={styles.jobCard}>
      <View style={{ flex: 1 }}>
        <Text style={styles.jobService}>{item.serviceType}</Text>
        <Text>Customer: {item.customerName}</Text>
        <Text>Vehicle: {item.vehicleName}</Text>
        <Text style={styles.jobTime}>
          {item.createdAt
            ? new Date(item.createdAt.seconds * 1000).toLocaleString()
            : "Pending"}
        </Text>
      </View>
      {item.status === "pending" ? (
        <View style={styles.actionButtons}>
          <Pressable
            style={[styles.button, { backgroundColor: "#4CAF50" }]}
            onPress={() => handleAccept(item)}
          >
            <Text style={styles.buttonText}>Accept</Text>
          </Pressable>
          <Pressable
            style={[styles.button, { backgroundColor: "#F44336" }]}
            onPress={() => handleReject(item.id)}
          >
            <Text style={styles.buttonText}>Reject</Text>
          </Pressable>
        </View>
      ) : (
        <Text
          style={[
            styles.ongoingText,
            { color: item.status === "accepted" ? "#4CAF50" : "#F44336" },
          ]}
        >
          {item.status.toUpperCase()}
        </Text>
      )}
    </View>
  );

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <Ionicons name="construct-outline" size={26} color="#0D47A1" />
      <Text style={styles.serviceName}>{item.serviceName}</Text>
      <Text style={styles.serviceDetails}>PKR {item.price}</Text>
      <Text style={styles.serviceCategory}>{item.category}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={[]}
        keyExtractor={() => "dummy"}
        renderItem={null}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        ListHeaderComponent={
          <View style={styles.header}>
            {/* 🟢 Greeting */}
            <Text style={styles.greeting}>
              Good Morning, {userName || "Mechanic"} 👋
            </Text>
            <Text style={styles.subGreeting}>Ready for a productive day?</Text>

            {/* 🗺️ Active Job with Map Placeholder */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Active Job</Text>
              <View style={styles.activeJobBox}>
                {activeJob ? (
                  <>
                    <Text style={styles.jobService}>
                      {activeJob.serviceType}
                    </Text>
                    <Text>Customer: {activeJob.customerName}</Text>
                    <Text>Vehicle: {activeJob.vehicleName}</Text>
                    {/* {activeJob.vehicle && (
                      <Text>
                        Vehicle: {activeJob.vehicle.brand}{" "}
                        {activeJob.vehicle.model} ({activeJob.vehicle.year}) -{" "}
                        {activeJob.vehicle.color}
                      </Text>
                    )} */}
                    <Text style={styles.jobTime}>
                      {activeJob.createdAt
                        ? new Date(
                            activeJob.createdAt.seconds * 1000
                          ).toLocaleString()
                        : "Pending"}
                    </Text>
                  </>
                ) : (
                  <Text style={styles.placeholderText}>
                    No active jobs right now.
                  </Text>
                )}
              </View>
            </View>

            {/* 🧾 Customer Requests */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>New Requests</Text>
                <Pressable>
                  <Text style={styles.seeAllButton}>See All</Text>
                </Pressable>
              </View>
              {requests.length > 0 ? (
                <FlatList
                  data={requests}
                  keyExtractor={(item) => item.id}
                  renderItem={renderRequest}
                  scrollEnabled={false}
                />
              ) : (
                <Text style={styles.placeholderText}>No new requests.</Text>
              )}
            </View>

            {/* 🛠 My Services */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>My Services</Text>
                <Pressable onPress={() => router.push("/mechanic/allServices")}>
                  <Text style={styles.seeAllButton}>See All</Text>
                </Pressable>
              </View>

              {services.length === 0 ? (
                <Pressable
                  onPress={() => router.push("/mechanic/addService")}
                  style={styles.addServiceCard}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={40}
                    color="#0D47A1"
                  />
                  <Text style={styles.addServiceText}>Add your Service</Text>
                </Pressable>
              ) : (
                <FlatList
                  data={services}
                  keyExtractor={(item, index) =>
                    item.id ? item.id.toString() : index.toString()
                  }
                  renderItem={renderService}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.servicesGrid}
                />
              )}
            </View>

            {/* 💸 Earnings Summary */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Earnings Summary</Text>
              <View style={styles.dashboard}>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>Total Earnings</Text>
                  <Text style={styles.summaryValue}>PKR 15,000</Text>
                </View>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>Pending Payments</Text>
                  <Text style={styles.summaryValue}>PKR 2,000</Text>
                </View>
                <View style={styles.summaryBox}>
                  <Text style={styles.summaryLabel}>Jobs Completed</Text>
                  <Text style={styles.summaryValue}>12</Text>
                </View>
              </View>
            </View>

            {/* 📜 Recent Jobs */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Recent Jobs</Text>
              <Text style={styles.placeholderText}>
                You haven’t completed any jobs yet.
              </Text>
            </View>
          </View>
        }
      />
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9FAFB" },
  header: { padding: 20 },

  greeting: {
    fontSize: 22,
    fontWeight: "700",
    color: "#0D47A1",
  },
  subGreeting: { fontSize: 14, color: "#555", marginBottom: 20 },

  section: { marginTop: 20 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#222" },
  seeAllButton: {
    fontSize: 13,
    backgroundColor: "#0D47A1",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },

  // 🗺️ Active Job
  activeJobBox: {
    // backgroundColor: "#fff",
    backgroundColor: "#f0f4ff",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#e1e4f2",
  },
  placeholderText: {
    color: "#888",
    textAlign: "center",
    marginVertical: 10,
  },

  // 🛠 Services
  servicesGrid: { flexDirection: "row", marginTop: 8 },
  serviceCard: {
    // backgroundColor: "#fff",
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    width: 220,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e1e4f2",
  },
  serviceName: { fontSize: 16, fontWeight: "bold", color: "#333" },
  serviceDetails: { fontSize: 14, color: "#555", marginTop: 4 },
  serviceCategory: { fontSize: 13, color: "#888", marginTop: 2 },
  addServiceCard: {
    borderWidth: 2,
    borderColor: "#0D47A1",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
    width: 200,
    alignSelf: "center",
  },
  addServiceText: {
    color: "#0D47A1",
    fontWeight: "600",
    marginTop: 10,
    fontSize: 16,
  },

  // 💸 Earnings
  dashboard: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  summaryBox: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 4,
  },
  summaryLabel: { fontSize: 13, color: "#555" },
  summaryValue: { fontSize: 16, fontWeight: "bold", marginTop: 4 },

  // Requests
  jobCard: {
    flexDirection: "row",
    // backgroundColor: "#fff",
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e1e4f2",
  },
  jobService: { fontSize: 16, fontWeight: "bold" },
  jobTime: { fontSize: 12, color: "#555", marginTop: 4 },
  actionButtons: { flexDirection: "column", marginLeft: 50 },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  ongoingText: { fontSize: 14, fontWeight: "bold", color: "#2196F3" },
});
