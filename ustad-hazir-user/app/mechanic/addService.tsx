import { addService } from "@/backend/machenicService";
import AddServiceButton from "@/components/Button";
import AddServiceHeader from "@/components/Header";
import InputField from "@/components/InputField";
import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ServicePricing = () => {
  const { t } = useTranslation();

  const [serviceName, setServiceName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState<any>(null);
  const [locationLoading, setLocationLoading] = useState(false);

  // 🔵 GET LOCATION
  const getCurrentLocation = async () => {
    setLocationLoading(true);
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(t("permissionDenied"), t("allowLocation"));
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
      Alert.alert(t("error"), t("locationFailed"));
    }
    setLocationLoading(false);
  };

  // 🔵 SUBMIT FORM
  const handleAddService = async () => {
    if (!serviceName || !price || !category) {
      Alert.alert(t("missingFields"), t("missingFieldsMsg"));
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
      Alert.alert(t("success"), t("serviceAdded"));
      router.back();
    } catch (error: any) {
      console.error("🔥 Add Service Error:", error);
      Alert.alert(t("error"), error.message || t("serviceAddFailed"));
    }
  };

  return (
    <View style={styles.container}>
      <AddServiceHeader title={t("addService")} showBack />
      <ScrollView contentContainerStyle={styles.content}>
        {/* Service Type */}
        <Text style={styles.sectionLabel}>{t("service")}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={serviceName}
            onValueChange={(val) => setServiceName(val)}
            style={styles.picker}
          >
            <Picker.Item label={t("Select Service Type")} value="" />
            <Picker.Item label={t("Oil Change")} value="Oil Change" />
            <Picker.Item label={t("Engine Repair")} value="Engine Repair" />
            <Picker.Item label={t("Tyre Repair")} value="Tyre Repair" />
            <Picker.Item label={t("Battery Check")} value="Battery Check" />
            <Picker.Item label={t("AC Repair")} value="AC Repair" />
            <Picker.Item label={t("Fuel Delivery")} value="Fuel Delivery" />
            <Picker.Item label={t("Car Inspection")} value="Car Inspection" />
            <Picker.Item label={t("Car Towing ")} value="Car Towing" />
            <Picker.Item label={t("Electrical Repair")} value="Electrical Repair" />
            <Picker.Item label={t("other")} value="other" />
          </Picker>
        </View>

        {/* Description */}
        <InputField
          label={t("descriptionLabel")}
          placeholder={t("descriptionPlaceholder")}
          multiline
          numberOfLines={5}
          value={description}
          onChangeText={setDescription}
          style={{ height: 100, textAlignVertical: "top" }}
        />

        {/* Price */}
        <InputField
          label={t("priceLabel")}
          placeholder={t("pricePlaceholder")}
          keyboardType="numeric"
          value={price}
          onChangeText={setPrice}
        />

        {/* Duration */}
        <InputField
          label={t("durationLabel")}
          placeholder={t("durationPlaceholder")}
          value={duration}
          onChangeText={setDuration}
        />

        {/* Category */}
        <Text style={styles.sectionLabel}>{t("category")}</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={category}
            onValueChange={(val) => setCategory(val)}
            style={styles.picker}
          >
            <Picker.Item label={t("selectVehicleType")} value="" />
            <Picker.Item label={t("car")} value="car" />
            <Picker.Item label={t("bike")} value="bike" />
            <Picker.Item label={t("truck")} value="truck" />
            <Picker.Item label={t("van")} value="van" />
            <Picker.Item label={t("suv")} value="suv" />
          </Picker>
        </View>

        {/* Location */}
        <View style={{ marginVertical: 10 }}>
          <Text style={{ fontWeight: "bold", marginBottom: 6 }}>
            {t("currentLocation")}
          </Text>
          <Pressable style={styles.locationButton} onPress={getCurrentLocation}>
            <Text>
              {location
                ? `${location.address ? location.address + ", " : ""}${location.city || ""
                }`
                : locationLoading
                  ? t("fetching")
                  : t("getLocation")}
            </Text>
          </Pressable>
        </View>

        <AddServiceButton
          title={t("addService")}
          type="primary"
          onPress={handleAddService}
        />
      </ScrollView>
    </View>
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
