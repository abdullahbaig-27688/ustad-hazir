import React, { useState } from "react";
import {
  View,
  ScrollView,
  StyleSheet,
  Alert,
  Pressable,
  Text,
  Platform,
} from "react-native";
import AddServiceHeader from "@/components/Header";
import InputField from "@/components/InputField";
import AddServiceButton from "@/components/Button";
import { addService } from "@/backend/machenicService";
import { router } from "expo-router";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import { Picker } from "@react-native-picker/picker";

const ServicePricing = () => {
  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // ✅ Get location with address
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission denied", "Allow location access to continue.");
        setLocationLoading(false);
        return;
      }

      const loc = await Location.getCurrentPositionAsync({});
      const reverseGeo = await Location.reverseGeocodeAsync({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
      });

      const place = reverseGeo[0];
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        address: `${place.name || ""} ${place.street || ""}`.trim(),
        city: place.city || "",
        state: place.region || "",
        country: place.country || "",
        postalCode: place.postalCode || "",
      });
    } catch (err) {
      console.error(err);
      Alert.alert("Error", "Failed to get location.");
    }
    setLocationLoading(false);
  };

  // ✅ Handle Add Service
  const handleAddService = async () => {
    if (!serviceName || !price || !category) {
      Alert.alert("Missing Fields", "Please fill all required fields.");
      return;
    }

    const newService = {
      serviceName,
      description,
      price,
      duration,
      category,
      location,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await addService(newService);
      Alert.alert("✅ Success", "Service added successfully!");
      router.back();
    } catch (error: any) {
      console.error("🔥 Add Service Error:", error);
      Alert.alert("Error", error.message || "Failed to add service");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <AddServiceHeader title="Add Service" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Type Picker */}
        <Text style={styles.sectionLabel}>Service</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceName}
            onValueChange={(val) => setServiceName(val)}
            style={styles.picker}
          >
            <Picker.Item label="Select Service Type" value="" />
            <Picker.Item label="Oil Change" value="oil_change" />
            <Picker.Item label="Engine Repair" value="engine_repair" />
            <Picker.Item label="Tyre Repair" value="tyre_repair" />
            <Picker.Item label="Battery Check" value="battery_check" />
            <Picker.Item label="AC Service" value="ac_service" />
            <Picker.Item label="Car Wash" value="car_wash" />
            <Picker.Item label="Car Inspection" value="car_inspection" />
            <Picker.Item label="Body Paint" value="body_paint" />
            <Picker.Item label="Wheel Alignment" value="wheel_alignment" />
          </Picker>
        </View>

        {/* Description */}
        <InputField
          label="Enter Description"
          placeholder="Provide Service Description"
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        {/* Price */}
        <InputField
          label="Price (PKR)"
          placeholder="Enter Price"
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {/* Estimated Time */}
        <InputField
          label="Estimated Time"
          placeholder="e.g. 1 hour"
          value={duration}
          onChangeText={setDuration}
        />

        {/* Category Picker */}
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(val) => setCategory(val)}
            style={styles.picker}
          >
            <Picker.Item label="Select Vehicle Type" value="" />
            <Picker.Item label="Car" value="car" />
            <Picker.Item label="Bike" value="bike" />
            <Picker.Item label="Truck" value="truck" />
            <Picker.Item label="Van" value="van" />
            <Picker.Item label="SUV" value="suv" />
          </Picker>
        </View>

        {/* Location */}
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            Current Location
          </Text>
          <Pressable style={styles.locationButton} onPress={getCurrentLocation}>
            <Text>
              {location
                ? `${location.address ? location.address + ", " : ""}${
                    location.city || ""
                  }`
                : locationLoading
                ? "Fetching..."
                : "Get Current Location"}
            </Text>
          </Pressable>
        </View>

        {/* Add Service Button */}
        <AddServiceButton
          title="Add Service"
          type="primary"
          onPress={handleAddService}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default ServicePricing;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40, width: "100%" },
  locationButton: {
    backgroundColor: "#f0f4ff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 15,
    color: "#333",
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
});
