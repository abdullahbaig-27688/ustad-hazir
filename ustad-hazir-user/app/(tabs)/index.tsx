import { deleteVehicle } from "@/backend/vehicleService";
import { auth, db } from "@/src/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { collection, doc, onSnapshot, query, where } from "firebase/firestore";
import LottieView from "lottie-react-native";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  FlatList,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";


import Swiper from "react-native-swiper";

const banners = [
  {
    id: 1,

    image: require("@/assets/images/banners/tyre.jpg"),
    // source: "https://lottie.host/24c6b740-0736-45dc-9304-3dbda0a09bbe/llTiJDewna.lottie",

    text: "Tyre Replacement Service",
    discount: "20% OFF",
  },
  {
    id: 2,
    image: require("@/assets/images/banners/oil-change.jpg"),
    text: "Oil Change at Your Doorstep",
    discount: "30% OFF",
  },
  {
    id: 3,
    image: require("@/assets/images/banners/engine.jpg"),
    text: "Interior & Exterior Cleaning",
    discount: "50% OFF",
  },
];
export const carServices = [
  {
    id: 1,
    categoryId: 1,
    title: "Oil Change",
    // image: require("@/assets/images/icons/oilChange.png"),
    type: "lottie",
    source: "https://lottie.host/24c6b740-0736-45dc-9304-3dbda0a09bbe/llTiJDewna.lottie",
  },
  {
    id: 2,
    categoryId: 2,
    title: "Engine Repair",

    // image: require("@/assets/images/icons/engineRepair.png"),
    type: "lottie",
    source: "https://lottie.host/0c857c99-602d-46d3-abf8-1c00c5426d60/YPf39xfs11.lottie",


  },
  {
    id: 3,
    categoryId: 3,
    title: "Tyre Repair",
    // image: require("@/assets/images/icons/tyreService1.png"),
    type: "lottie",
    source: "https://lottie.host/48480c40-3a1c-4e4f-a361-1b0f5bc4a7aa/VO6wgM8S1J.lottie",


  },
  {
    id: 4,
    categoryId: 4,
    title: "Battery Check",
    // image: require("@/assets/images/icons/batteryCheck.png"),
    type: "lottie",
    source: "https://lottie.host/781a2ed0-ffb7-49b4-a61c-f5954487fb9d/LFS9VPRu1s.lottie",


  },
  {
    id: 5,
    categoryId: 5,
    title: "AC Repair",
    // image: require("@/assets/images/icons/acRepair.png"),
    type: "lottie",

    source: "https://lottie.host/4f1be215-4463-43e8-8b94-6f2bdcaad671/xZknJpirwm.lottie"
  },
  {
    id: 6,
    categoryId: 6,
    title: "Fuel Delivery",
    // image: require("@/assets/images/icons/carWash.png"),
    type: "lottie",

    source: "https://lottie.host/629466fa-8538-40a8-8dd3-e8e74c17d445/pTL5PghZBB.lottie",
  },
  {
    id: 7,
    categoryId: 7,
    title: "Car Inspection",
    // image: require("@/assets/images/icons/carinspection.png"),
    type: "lottie",
    source: "https://lottie.host/926b8e0e-b2fb-4018-a873-a120fc918e89/5lTlq3iT7R.lottie"

    // source: "https://lottie.host/24c6b740-0736-45dc-9304-3dbda0a09bbe/llTiJDewna.lottie",
  },
  {
    id: 8,
    categoryId: 8,
    title: "Car Towing",
    // image: require("@/assets/images/icons/carPaint.png"),
    type: "lottie",
    source: "https://lottie.host/b38d1c08-f174-47e3-8cfd-574480b89990/Mm0EOlTdfs.lottie"


  },
  {
    id: 9,
    categoryId: 9,
    title: "Electrical Repair",
    // image: require("@/assets/images/icons/wheel.png"),
    type: "lottie",
    source: "https://lottie.host/ca3c6cae-54d7-47cb-8c51-5cdc48606138/WfnCzcHYx1.lottie"


  },
];

const HomeScreen = () => {
  const [currentUserData, setCurrentUserData] = useState<{ name?: string }>({});
  const [vehicles, setVehicles] = useState([]);
  const [requests, setRequests] = useState([]); // ✅ new state
  const { t, i18n } = useTranslation();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const userRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userRef, (docSnap) => {
      if (docSnap.exists()) {
        setCurrentUserData(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, []);

  // useEffect(() => {
  //   // Enable RTL if Urdu
  //   if (i18n.language === "ur" && !I18nManager.isRTL) {
  //     I18nManager.forceRTL(true);
  //     Alert.alert(
  //       "Restart Required",
  //       "Please restart the app to apply Urdu layout"
  //     );
  //   }
  //   // Disable RTL for other languages
  //   else if (i18n.language !== "ur" && I18nManager.isRTL) {
  //     I18nManager.forceRTL(true);
  //     // Alert.alert(
  //     //   "Restart Required",
  //     //   "Please restart the app to apply English layout"
  //     // );
  //   }
  // }, [i18n.language]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    // Query for user's vehicles
    const vehiclesQuery = query(
      collection(db, "vehicles"),
      where("ownerId", "==", currentUser.uid)
    );

    const unsubscribeVehicles = onSnapshot(vehiclesQuery, (snapshot) => {
      const vehicleList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(vehicleList);
    });

    // Query for user's service requests
    const requestsQuery = query(
      collection(db, "serviceRequests"),
      where("ownerId", "==", currentUser.uid)
    );

    const unsubscribeRequests = onSnapshot(requestsQuery, (snapshot) => {
      const requestList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setRequests(requestList);
    });

    // Cleanup
    return () => {
      unsubscribeVehicles();
      unsubscribeRequests();
    };
  }, []);

  const handleEdit = (vehicle: any) => {
    router.push(`/editvehicle/${vehicle.id}`);
  };

  const handleDelete = (vehicle: any) => {
    Alert.alert(t("confirm_delete_title"), t("confirm_delete_message"), [
      { text: t("cancel"), style: "cancel" },
      {
        text: t("delete"),
        style: "destructive",
        onPress: async () => {
          try {
            await deleteVehicle(vehicle.id); // <-- FIXED
            Alert.alert(t("vehicle_deleted"));
            setVehicles(vehicles.filter((v) => v.id !== vehicle.id)); // <-- FIXED
          } catch (error) {
            console.error(error);
            Alert.alert(t("delete_failed"));
          }
        },
      },
    ]);
  };

  // const renderService = ({ item }) => (
  //   <Pressable
  //     style={styles.categoryCard}
  //     key={item.id}
  //     onPress={() =>
  //       router.push(
  //         `/listServices?serviceName=${encodeURIComponent(item.title)}`
  //       )
  //     }
  //   >
  //     <Image
  //       source={item.source}
  //       style={{ width: 50, height: 50, resizeMode: "contain" }}
  //     />

  //     <Text style={styles.categoryText}>{item.title}</Text>
  //   </Pressable>
  // );

  const renderService = ({ item }) => (
    <Pressable
      style={styles.categoryCard}
      onPress={() =>
        router.push(
          `/listServices?serviceName=${encodeURIComponent(item.title)}`
        )
      }
    >
      {item.type === "lottie" ? (
        <LottieView
          source={{ uri: item.source }}
          style={{ width: 70, height: 70 }}
          autoPlay
          loop
          resizeMode="contain"
        />
      ) : (
        <Image
          source={item.source}
          style={{ width: 50, height: 50, resizeMode: "contain" }}
        />
      )}

      <Text style={styles.categoryText}>{item.title}</Text>
    </Pressable>
  );

  // const ServiceItem = ({ item }) => {
  //   const player = useVideoPlayer(
  //     item.type === "video"
  //       ? typeof item.source === "string"
  //         ? { uri: item.source }
  //         : item.source
  //       : null,
  //     (player) => {
  //       if (player) {
  //         player.loop = true;
  //         player.muted = true;
  //         player.play();
  //       }
  //     }
  //   );

  //   return (
  //     <Pressable
  //       style={
  //         styles.categoryCard}


  //       onPress={() =>
  //         router.push(`/listServices?serviceName=${encodeURIComponent(item.title)}`)
  //       }
  //     >
  //       {
  //         item.type === "lottie" && (
  //           <LottieView
  //             source={{ uri: item.source }}
  //             style={{ width: 80, height: 80 }}
  //             autoPlay
  //             loop
  //           />
  //         )
  //       }

  //       {
  //         item.type === "video" && player && (
  //           <VideoView
  //             player={player}
  //             style={{ width: 80, height: 80, backgroundColor: "transparent" }}
  //             contentFit="contain"
  //           />
  //         )
  //       }

  //       {
  //         item.type === "image" && (
  //           <Image
  //             source={item.source}
  //             style={{ width: 50, height: 50, resizeMode: "contain" }}
  //           />
  //         )
  //       }

  //       <Text style={styles.categoryText}>{item.title}</Text>
  //     </Pressable >
  //   );
  // };





  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Greeting */}

      <View style={styles.greetingContainer}>
        <Text style={styles.greeting}>
          {t("hello")},{" "}
          <Text style={styles.greetingName}>
            {currentUserData.name || t("user")}
          </Text>{" "}
          👋
        </Text>

        <Text style={styles.subText}>{t("trusted_mechanic_ready")}</Text>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <Swiper
          autoplay
          autoplayTimeout={3} // slide every 3 seconds
          showsPagination={true}
          dotStyle={styles.dot}
          activeDotStyle={styles.activeDot}
        >
          {banners.map((item) => (
            <Pressable key={item.id} style={styles.banner}>
              <Image
                source={item.image}
                style={styles.bannerImage}
                resizeMode="cover"
              />
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{item.discount}</Text>
              </View>
              <Text style={styles.bannerText}>{item.text}</Text>
            </Pressable>
          ))}
        </Swiper>
      </View>

      {/* <Pressable style={styles.banner}>
        <Image
          source={require("@/assets/images/banners/tyre.jpg")}
          style={styles.bannerImage}
          resizeMode="cover"
        />
        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>50% OFF</Text>
        </View>
        <Text style={styles.bannerText}>Clean your home</Text>
      </Pressable> */}

      {/* Services */}
      <View style={styles.serviceHeader}>
        <Text style={styles.serviceTitle}>{t("our_services")}</Text>
        <Pressable>
          <Text style={styles.viewAll}>{t("view_all")}</Text>
        </Pressable>
      </View>

      {/* <FlatList
        data={carServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderService}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      /> */}
      <FlatList
        data={carServices}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderService}
        numColumns={3}
        columnWrapperStyle={{
          justifyContent: "space-evenly",
          paddingHorizontal: 20,
          marginBottom: 15,
        }}
        scrollEnabled={false}
      />


      {/* Vehicles Section */}
      <View style={styles.vehicleSection}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>{t("my_vehicle_history")}</Text>
          {vehicles.length > 0 && (
            <Pressable onPress={() => router.push("/allVehicles")}>
              <Text style={styles.addVehicleText}>{t("view_all")}</Text>
            </Pressable>
          )}
        </View>

        {vehicles.length === 0 ? (
          <View style={styles.noVehicleContainer}>
            <Pressable
              onPress={() => router.push("/addvehicle")}
              style={styles.addVehicleCard}
            >
              <Ionicons name="add-circle-outline" size={40} color="#0D47A1" />
              <Text style={styles.addVehicleText}>{t("add_vehicle")}</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={vehicles}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 30,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Pressable style={styles.vehicleCard}>
                <Ionicons name="car-outline" size={24} color="#0D47A1" />
                <Text style={styles.vehicleText}>
                  {item.brand} {item.model}
                </Text>
                <Text style={styles.subtitle}>{item.year}</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Plate:</Text>
                  <Text style={styles.value}>{item.registration}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Color:</Text>
                  <Text style={styles.value}>{item.color}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Transmission:</Text>
                  <Text style={styles.value}>{item.transmission}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.label}>Fuel:</Text>
                  <Text style={styles.value}>{item.fueltype}</Text>
                </View>
                <View style={styles.buttonRow}>
                  <Pressable
                    style={[styles.button, { backgroundColor: "#0D47A1" }]}
                    onPress={() => handleEdit(item)}
                  >
                    <Text style={styles.buttonText}>{t("edit")}</Text>
                  </Pressable>
                  <Pressable
                    style={[styles.button, { backgroundColor: "#FF3B30" }]}
                    onPress={() => handleDelete(item)}
                  >
                    <Text style={styles.buttonText}>{t("delete")}</Text>
                  </Pressable>
                </View>
              </Pressable>
            )}
          />
        )}
      </View>

      {/* Service History Section */}
      <View style={styles.vehicleSection}>
        <View style={styles.serviceHeader}>
          <Text style={styles.serviceTitle}>{t("my_request_history")}</Text>
          {requests.length > 0 && (
            <Pressable onPress={() => router.push("/allRequests")}>
              <Text style={styles.addVehicleText}>{t("view_all")}</Text>
            </Pressable>
          )}
        </View>

        {requests.length === 0 ? (
          <View style={styles.noVehicleContainer}>
            <Pressable
              onPress={() => router.push("/(tabs)/requestservice")}
              style={styles.addVehicleCard}
            >
              <Ionicons name="add-circle-outline" size={40} color="#5075d9" />
              <Text style={styles.addVehicleText}>{t("request_service")}</Text>
            </Pressable>
          </View>
        ) : (
          <FlatList
            data={requests}
            horizontal
            keyExtractor={(item) => item.id}
            contentContainerStyle={{
              paddingHorizontal: 10,
              paddingVertical: 30,
            }}
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => {
              // Find vehicle info if stored by vehicleId
              const vehicle = vehicles.find((v) => v.id === item.vehicleId);

              return (
                <Pressable style={styles.serviceCardItem}>
                  <View style={styles.serviceCardHeader}>
                    <Ionicons
                      name="settings-outline"
                      size={22}
                      color="#0D47A1"
                    />
                    <Text style={styles.serviceCardTitle}>
                      {item.serviceType || "Service Request"}
                    </Text>
                  </View>

                  <View style={styles.serviceDetails}>
                    <Text style={styles.serviceVehicle}>
                      {vehicle
                        ? `${vehicle.brand} ${vehicle.model} (${vehicle.registration})`
                        : item.vehicleName
                          ? `${item.vehicleName} ${item.vehicleModel} (${item.registration})`
                          : "Unknown Vehicle"}
                    </Text>
                    <Text style={styles.serviceDate}>
                      Date:{" "}
                      {item.createdAt?.toDate
                        ? item.createdAt.toDate().toLocaleDateString()
                        : item.createdAt || "N/A"}
                    </Text>
                    <Text style={styles.serviceStatus}>
                      Status: {item.status || "Pending"}
                    </Text>
                  </View>

                  <View style={styles.serviceCardFooter}>
                    {/* <Pressable
                      style={[styles.actionBtn, { backgroundColor: "#0D47A1" }]}
                      onPress={() => router.push(`/servicedetail/${item.id}`)}
                    >
                      <Text style={styles.actionText}>View</Text>
                    </Pressable>
                    <Pressable
                      style={[styles.actionBtn, { backgroundColor: "#FF3B30" }]}
                      onPress={() => console.log("Delete service record")}
                    >
                      <Text style={styles.actionText}>{t("delete")}</Text>
                    </Pressable> */}
                  </View>
                </Pressable>
              );
            }}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: "center",
    // alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 20,
  },
  greetingContainer: {
    marginTop: 20,
    marginHorizontal: 20,
    backgroundColor: "#f0f4ff",
    padding: 15,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  greeting: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 20,
    color: "#0D47A1",
    marginHorizontal: 20,
  },
  greetingName: {
    color: "#5126ec", // or your brand purple-blue
    fontWeight: "bold",
  },
  subText: {
    fontSize: 16,
    color: "#777",
    marginHorizontal: 20,
    marginTop: 5,
  },
  bannerContainer: {
    height: 160,
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 15,
    overflow: "hidden",
  },

  banner: {
    width: "100%",
    height: 160,
    borderRadius: 15,
    overflow: "hidden",
    justifyContent: "flex-end",
  },

  bannerImage: {
    width: "100%",
    height: "100%",
    position: "absolute",
    borderRadius: 15,
  },

  bannerText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.3)",
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  discountBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#5126ec",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 8,
    zIndex: 2,
  },

  discountText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },

  dot: {
    backgroundColor: "rgba(255,255,255,0.4)",
    width: 6,
    height: 6,
    borderRadius: 3,
    margin: 3,
  },

  activeDot: {
    backgroundColor: "#fff",
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },

  categories: { paddingLeft: 20, marginVertical: 10 },
  categoryItem: {
    backgroundColor: "#0D47A1",
    borderRadius: 12,
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  // categoryCard: {
  //   alignItems: "center",
  //   justifyContent: "center",
  // backgroundColor: "#4A90E2",
  //   backgroundColor: "#fff",
  //   borderRadius: 12,
  //   paddingVertical:20,
  //   width:"47%",
  //   padding: 15,
  //   marginRight: 10,
  // },

  categoryCard: {
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,

    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    paddingVertical: 20,
    width: "30%", // ✅ fits two per row with some spacing
    // marginBottom: 0,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
  },

  categoryText: {
    color: "#000",
    // color: "red",
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
  tile: {
    flex: 1,
    height: 50,
    width: 50,
    borderRadius: 20,
    backgroundColor: "#e9eef6",
  },
  serviceHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 20,
    marginVertical: 10,
  },
  serviceTitle: { fontSize: 18, fontWeight: "bold" },
  viewAll: {
    fontSize: 14,
    backgroundColor: "#0D47A1",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  servicesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  serviceCard: {
    width: "45%",
    marginBottom: 15,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
  },
  serviceImage: { width: "100%", height: 120 },
  serviceName: { fontSize: 14, fontWeight: "600", padding: 8 },
  vehicleSection: {
    marginTop: 10,
    marginBottom: 10,
  },
  vehicleCard: {
    backgroundColor: "#f0f4ff",
    // backgroundColor: "#311888ff",
    padding: 12,
    borderRadius: 10,
    marginRight: 10,
    // alignItems: "center",
    justifyContent: "center",
    // width: "30%",
  },
  vehicleText: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#0D47A1",
    marginTop: 5,
  },
  vehicleSub: {
    fontSize: 12,
    color: "#666",
  },
  subtitle: {
    fontSize: 14,
    color: "#333",
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: "row",
    marginBottom: 4,
  },
  label: {
    fontWeight: "bold",
    fontSize: 12,
    width: 90,
    color: "#555",
  },
  value: {
    fontSize: 12,
    color: "#333",
  },
  buttonRow: {
    flexDirection: "column",
    gap: 5,
    justifyContent: "center",
    marginTop: 10,

    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 5,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },

  noVehicleContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  addVehicleCard: {
    borderWidth: 2,
    borderColor: "#0D47A1",
    borderStyle: "dashed",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f4ff",
    width: 200,
  },
  addVehicleText: {
    // color: "#0D47A1",

    // fontWeight: "600",
    // marginTop: 10,
    // fontSize: 16,
    fontSize: 14,
    backgroundColor: "#0D47A1",
    color: "#fff",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  serviceCardItem: {
    // backgroundColor: "#ffffff",
    backgroundColor: "#f0f4ff",
    borderRadius: 12,
    padding: 15,
    marginRight: 10,
    width: 250,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e1e4f2",
  },
  serviceCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  serviceCardTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#0D47A1",
    marginLeft: 6,
  },
  serviceDetails: {
    marginBottom: 10,
  },
  serviceVehicle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
  },
  serviceDate: {
    fontSize: 13,
    color: "#777",
    marginTop: 3,
  },
  serviceStatus: {
    fontSize: 13,
    color: "#28A745",
    marginTop: 3,
    fontWeight: "600",
  },
  serviceCardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 6,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
});
