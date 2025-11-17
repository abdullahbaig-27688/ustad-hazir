import Button from "@/components/Button";
import Header from "@/components/Header";
import InputField from "@/components/InputField";
import { auth, db } from "@/src/firebaseConfig";
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { addServiceRequest } from "@/backend/requestService";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import { useTranslation } from "react-i18next";

import {
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CreateServiceRequestScreen = () => {
  const { t } = useTranslation(); // ✅ translation hook

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Fetch saved vehicles
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (!currentUser) return;

    const vehiclesQuery = query(
      collection(db, "vehicles"),
      where("ownerId", "==", currentUser.uid)
    );

    const unsub = onSnapshot(vehiclesQuery, (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVehicles(list);
    });

    return () => unsub();
  }, []);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  };

  const getCurrentLocation = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(t("permission_denied"), t("allow_location_access"));
      return;
    }

    const loc = await Location.getCurrentPositionAsync({});
    const [place] = await Location.reverseGeocodeAsync({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
    });

    setCurrentLocation({
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      address: `${place.name || ""} ${place.street || ""}`.trim(),
      city: place.city || "",
      state: place.region || "",
      country: place.country || "",
      postalCode: place.postalCode || "",
    });

    Alert.alert(t("location_captured"), t("location_added"));
  };

  const handleSubmit = async () => {
    if (
      selectedVehicle == "" ||
      serviceType == "" ||
      issueDesc == "" ||
      pickupAddress == "" ||
      dropoffAddress == ""
    ) {
      Alert.alert(t("error"), t("fill_all_fields"));
      return;
    }

    const requestData = {
      vehicleId: selectedVehicle,
      serviceType,
      issueDesc,
      pickupAddress,
      dropoffAddress,
      imageUri,
      location: currentLocation,
    };

    try {
      await addServiceRequest(requestData);
      alert(t("request_submitted"));
      router.back();
    } catch (err) {
      alert(t("request_error"));
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title={t("service_request")}
        showBack
        onRightPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>{t("select_vehicle")}</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedVehicle}
            onValueChange={(val) => setSelectedVehicle(val)}
            style={styles.picker}
          >
            <Picker.Item label={t("select_saved_vehicle")} value="" />
            {vehicles.map((v) => (
              <Picker.Item
                key={v.id}
                label={`${v.brand} ${v.model} (${v.registration})`}
                value={v.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionLabel}>{t("service_details")}</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(val) => setServiceType(val)}
            style={styles.picker}
          >
            <Picker.Item label={t("select_service_type")} value="" />
            <Picker.Item label={t("oil_change")} value="oil_change" />
            <Picker.Item label={t("brake_repair")} value="brake_repair" />
            <Picker.Item label={t("battery_check")} value="battery_check" />
            <Picker.Item label={t("tire_service")} value="tire_service" />
            <Picker.Item label={t("other")} value="other" />
          </Picker>
        </View>

        <InputField
          label={t("issue_description")}
          placeholder={t("describe_issue")}
          value={issueDesc}
          onChangeText={setIssueDesc}
          style={styles.textArea}
        />

        <Text style={styles.sectionLabel}>{t("location_pickup")}</Text>

        <InputField
          label={t("pickup_address")}
          placeholder={t("enter_pickup_address")}
          value={pickupAddress}
          onChangeText={setPickupAddress}
          style={styles.textArea}
        />

        <InputField
          label={t("dropoff_address")}
          placeholder={t("enter_dropoff_address")}
          value={dropoffAddress}
          onChangeText={setDropoffAddress}
          style={styles.textArea}
        />

        <View style={styles.imageUploadContainer}>
          <Text style={styles.label}>{t("upload_photo_optional")}</Text>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>{t("add_photo")}</Text>
            )}
          </Pressable>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionLabel}>{t("current_location")}</Text>
          <Pressable style={styles.locationButton} onPress={getCurrentLocation}>
            <Text style={{ color: "#fff" }}>
              {currentLocation
                ? `${t("location_set")} (${currentLocation.latitude.toFixed(
                    4
                  )}, ${currentLocation.longitude.toFixed(4)})`
                : t("use_current_location")}
            </Text>
          </Pressable>
        </View>

        <Button
          title={t("submit_request")}
          type="primary"
          onPress={handleSubmit}
        />
      </ScrollView>
    </View>
  );
};

export default CreateServiceRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginBottom: 6,
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#f9f9f9",
    marginBottom: 15,
  },
  picker: {
    width: "100%",
    height: Platform.OS === "ios" ? 200 : 50,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: "top",
  },
  imageUploadContainer: {
    marginBottom: 20,
  },
  imagePicker: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
  },
  imagePickerText: {
    color: "#888",
  },
  imagePreview: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  locationButton: {
    backgroundColor: "#5126ecff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
});
