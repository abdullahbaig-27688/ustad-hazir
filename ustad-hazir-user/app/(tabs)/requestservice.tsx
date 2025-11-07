import Button from "@/components/Button";
import Header from "@/components/Header";
import InputField from "@/components/InputField";
import { auth, db } from "@/src/firebaseConfig"; // ✅ import Firestore config
import { Picker } from "@react-native-picker/picker";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { addServiceRequest } from "@/backend/requestService";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

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
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [selectedVehicle, setSelectedVehicle] = useState("");
  const [serviceType, setServiceType] = useState("");
  const [issueDesc, setIssueDesc] = useState("");
  // const [preferredDate, setPreferredDate] = useState("");
  const [pickupAddress, setPickupAddress] = useState("");
  const [dropoffAddress, setDropoffAddress] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [currentLocation, setCurrentLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // ✅ Fetch saved vehicles from Firestore
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
      Alert.alert("Permission Denied", "Allow location access.");
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

    Alert.alert("Location Captured", "Your current location has been added!");
  };

  const handleSubmit = async () => {
    if (
      selectedVehicle == "" ||
      serviceType == "" ||
      issueDesc == "" ||
      // preferredDate == "" ||
      pickupAddress == "" ||
      dropoffAddress == ""
    ) {
      Alert.alert("Error", "Please fill all required fields.");
      return;
    }

    const requestData = {
      vehicleId: selectedVehicle,
      serviceType,
      issueDesc,
      // preferredDate,
      pickupAddress,
      dropoffAddress,
      imageUri,
      location: currentLocation, // 👈 add this
    };
    try {
      await addServiceRequest(requestData);
      alert("Service request submitted successfully!");
      router.back();
    } catch (err) {
      alert("Error submitting request!");
      console.error(err);
    }
  };

  return (
    <View style={styles.container}>
      <Header
        title="Service Request"
        showBack
        onRightPress={() => router.back()}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionLabel}>Select Vehicle</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={selectedVehicle}
            onValueChange={(val) => setSelectedVehicle(val)}
            style={styles.picker}
          >
            <Picker.Item label="Select your saved vehicle" value="" />
            {vehicles.map((v) => (
              <Picker.Item
                key={v.id}
                label={`${v.brand} ${v.model} (${v.registration})`}
                value={v.id}
              />
            ))}
          </Picker>
        </View>

        <Text style={styles.sectionLabel}>Service Details</Text>

        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceType}
            onValueChange={(val) => setServiceType(val)}
            style={styles.picker}
          >
            <Picker.Item label="Select service type" value="" />
            <Picker.Item label="Oil Change" value="oil_change" />
            <Picker.Item label="Brake Repair" value="brake_repair" />
            <Picker.Item label="Battery Check" value="battery_check" />
            <Picker.Item label="Tire Service" value="tire_service" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        <InputField
          label="Issue Description"
          placeholder="Describe the issue"
          value={issueDesc}
          onChangeText={setIssueDesc}
          style={styles.textArea}
        />

        {/* <InputField
          label="Preferred Date & Time"
          placeholder="Select date & time"
          value={preferredDate}
          onChangeText={setPreferredDate}
        /> */}
        <Text style={styles.sectionLabel}>Location & Pickup Details</Text>
        <InputField
          label="Pickup Address"
          placeholder="Enter full address for pickup"
          value={pickupAddress}
          onChangeText={setPickupAddress}
          style={styles.textArea}
        />

        <InputField
          label="Dropoff Address"
          placeholder="Enter full address for dropoff"
          value={dropoffAddress}
          onChangeText={setDropoffAddress}
          style={styles.textArea}
        />

        <View style={styles.imageUploadContainer}>
          <Text style={styles.label}>Upload Photo (optional)</Text>
          <Pressable style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} />
            ) : (
              <Text style={styles.imagePickerText}>+ Add Photo</Text>
            )}
          </Pressable>
        </View>
        <View style={{ marginBottom: 20 }}>
          <Text style={styles.sectionLabel}>Current Location</Text>
          <Pressable style={styles.locationButton} onPress={getCurrentLocation}>
            <Text style={{ color: "#fff" }}>
              {currentLocation
                ? `Location set (${currentLocation.latitude.toFixed(
                    4
                  )}, ${currentLocation.longitude.toFixed(4)})`
                : "Use Current Location"}
            </Text>
          </Pressable>
        </View>

        <Button title="Submit Request" type="primary" onPress={handleSubmit} />
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
