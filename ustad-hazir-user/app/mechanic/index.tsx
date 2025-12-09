import { auth, db } from "@/src/firebaseConfig";
import { createChatIfNotExists } from "@/utils/createChat";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getSingleVehicle } from "@/backend/vehicleService";
import {
  listenToAllServices,
  listenToCompletedJobs,
  listenToCustomerRequests,
  updateRequestStatus,
} from "@/backend/machenicService";

const HomeScreen = () => {
  const [userName, setUserName] = useState("");
  const [requests, setRequests] = useState<any[]>([]);
  const [activeJob, setActiveJob] = useState<any | null>(null);
  const [services, setServices] = useState<any[]>([]);
  const [completedJobs, setCompletedJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch mechanic name
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          setUserName(
            userDoc.exists()
              ? userDoc.data().name || "Mechanic"
              : user.displayName || "Mechanic"
          );
        } catch (error) {
          console.error("Error fetching user name:", error);
        }
      }
    };
    fetchUserName();
  }, []);

  // Fetch services
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const unsubServices = listenToAllServices((data) => {
          setServices(data);
          setLoading(false);
        });
        return () => unsubServices();
      } else {
        setServices([]);
        setLoading(false);
      }
    });
    return () => unsubscribe();
  }, []);

  // Listen for requests and enrich with vehicle
  useEffect(() => {
    const unsubscribe = listenToCustomerRequests(async (data) => {
      const enriched = await Promise.all(
        data.map(async (request) => {
          if (request.vehicleId) {
            try {
              const vehicle = await getSingleVehicle(request.vehicleId);
              const vehicleName = vehicle
                ? `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.color}`
                : "N/A";
              return { ...request, vehicleName };
            } catch {
              return { ...request, vehicleName: "N/A" };
            }
          }
          return { ...request, vehicleName: "N/A" };
        })
      );
      setRequests(enriched);
      const acceptedJob = enriched.find((r) => r.status === "accepted") || null;
      setActiveJob(acceptedJob);
    });
    return () => unsubscribe();
  }, []);

  // Listen for completed jobs
  useEffect(() => {
    const mechanic = auth.currentUser;
    if (!mechanic) return;
    const unsubscribe = listenToCompletedJobs(mechanic.uid, setCompletedJobs);
    return () => unsubscribe();
  }, []);

  const handleAccept = async (request) => {
    const mechanic = auth.currentUser;
    if (!mechanic) return;
    try {
      await updateRequestStatus(request.id, "accepted");
      const vehicle = await getSingleVehicle(request.vehicleId);
      const vehicleName = vehicle
        ? `${vehicle.brand} ${vehicle.model} (${vehicle.year}) - ${vehicle.color}`
        : "N/A";
      setActiveJob({ ...request, vehicleName });

      await createChatIfNotExists(
        request.ownerId,
        mechanic.uid,
        request.customerName,
        mechanic.displayName || "Mechanic"
      );
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (id: string) => {
    await updateRequestStatus(id, "rejected");
  };

  const markJobAsCompleted = async () => {
    if (!activeJob) return;
    try {
      await updateRequestStatus(activeJob.id, "completed");
      // setCompletedJobs((prev) => [...prev, activeJob]);
      setActiveJob(null);
    } catch (error) {
      console.error("Error marking job completed:", error);
    }
  };

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

  const renderCompletedJobs = ({ item }) => {
    return (
      <View style={styles.jobCompleted}>
        <Text style={styles.jobService}>{item.serviceType}</Text>
        <Text>Customer: {item.customerName}</Text>
        <Text>Vehicle: {item.vehicleName}</Text>
        <Text style={styles.jobTime}>
          Completed on:{" "}
          {item.createdAt
            ? new Date(item.createdAt.seconds * 1000).toLocaleString()
            : "N/A"}
        </Text>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <ActivityIndicator
          size="large"
          color="#0D47A1"
          style={{ marginTop: 50 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100, paddingHorizontal: 20 }}
      >
        {/* Greeting */}
        <Text style={styles.greeting}>Good Morning, {userName} 👋</Text>
        <Text style={styles.subGreeting}>Ready for a productive day?</Text>

        {/* Active Job */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Active Job</Text>
          <View style={styles.activeJobBox}>
            {activeJob ? (
              <View>
                <Text style={styles.jobService}>{activeJob.serviceType}</Text>
                <Text>Customer: {activeJob.customerName}</Text>
                <Text>Vehicle: {activeJob.vehicleName}</Text>
                <Text style={styles.jobTime}>
                  {activeJob.createdAt
                    ? new Date(
                        activeJob.createdAt.seconds * 1000
                      ).toLocaleString()
                    : "Pending"}
                </Text>
                <View style={{ flexDirection: "row", marginTop: 15 }}>
                  <Pressable
                    onPress={markJobAsCompleted}
                    style={[
                      styles.button,
                      { backgroundColor: "#4CAF50", marginRight: 10 },
                    ]}
                  >
                    <Text style={styles.buttonText}>Mark Completed</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveJob(null)}
                    style={[styles.button, { backgroundColor: "#F44336" }]}
                  >
                    <Text style={styles.buttonText}>Cancel Job</Text>
                  </Pressable>
                </View>
              </View>
            ) : (
              <Text style={styles.placeholderText}>
                No active jobs right now.
              </Text>
            )}
          </View>
        </View>

        {/* Requests */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>New Requests</Text>
            <Pressable>
              <Text style={styles.seeAllButton}>See All</Text>
            </Pressable>
          </View>
          {requests.length ? (
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

        {/* Services */}
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
              <Ionicons name="add-circle-outline" size={40} color="#0D47A1" />
              <Text style={styles.addServiceText}>Add your Service</Text>
            </Pressable>
          ) : (
            <FlatList
              data={services}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderService}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.servicesGrid}
            />
          )}
        </View>

        {/* Completed Jobs */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Completed Jobs</Text>
            {completedJobs.length > 3 && (
              <Pressable onPress={() => router.push("/mechanic/completedJobs")}>
                <Text style={styles.seeAllButton}>See All</Text>
              </Pressable>
            )}
          </View>

          {completedJobs.length ? (
            <FlatList
              data={completedJobs.slice(0, 3)} // Show only first 3 completed jobs
              keyExtractor={(item, index) =>
                item.id?.toString() || index.toString()
              }
              renderItem={renderCompletedJobs}
              scrollEnabled={false}
            />
          ) : (
            <Text style={styles.placeholderText}>
              You haven’t completed any jobs yet.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

// Styles remain the same as your previous version

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
  jobCompleted:{
     flexDirection: "column",
    // backgroundColor: "#fff",
    backgroundColor: "#f0f4ff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 4,
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  ongoingText: { fontSize: 14, fontWeight: "bold", color: "#2196F3" },
});
