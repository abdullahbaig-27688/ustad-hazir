import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { auth } from "@/src/firebaseConfig";
import { listenToCompletedJobs } from "@/backend/machenicService"; // <-- adjust path
import JobHistory from "@/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const CompletedJobHistory = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // 🔥 Listen to real-time completed jobs
    const unsubscribe = listenToCompletedJobs(currentUser.uid, (data) => {
      setJobs(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 600);
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={{ marginTop: 10 }}>Loading completed jobs...</Text>
      </View>
    );
  }

  if (jobs.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noJobsText}>No completed jobs found!</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <JobHistory title="Completed Job" showBack />
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.title}>{item.serviceType || "Service"}</Text>

            <Text style={styles.label}>Customer: {item.customerName}</Text>

            {item.mechanicId && (
              <Text style={styles.label}>Mechanic: {item.mechanicName}</Text>
            )}

            <Text style={styles.label}>
              Completed On:{" "}
              {item.updatedAt?.toDate
                ? item.updatedAt.toDate().toLocaleString()
                : "—"}
            </Text>

            <Text style={[styles.status, { color: "green" }]}>COMPLETED</Text>
          </View>
        )}
      />
    </View>
  );
};

export default CompletedJobHistory;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    backgroundColor: "#f7f7f7",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noJobsText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
  },
  label: {
    fontSize: 14,
    marginBottom: 3,
    color: "#444",
  },
  status: {
    marginTop: 8,
    fontWeight: "700",
  },
});
