import AddVehicleButton from "@/components/Button";
import AddVehicleHeader from "@/components/Header";
import InputField from "@/components/InputField";
import * as ImagePicker from "expo-image-picker";
import React, { useState } from "react";
import { Picker } from "@react-native-picker/picker";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { addVehicle } from "@/backend/vehicleService";
import { router } from "expo-router";
import { useTranslation } from "react-i18next"; // ⬅️ ADDED

const AddVehicleScreen = () => {
  const { t } = useTranslation(); // ⬅️ ADDED

  const [vehicle, setVehicle] = useState({
    brand: "",
    model: "",
    year: "",
    registration: "",
    type: "",
    transmission: "",
    fueltype: "",
    color: "",
    image: null,
  });

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled) {
      setVehicle({ ...vehicle, image: result.assets[0].uri });
    }
  };

  const handleSave = async () => {
    console.log("Vehicle Saved:", vehicle);

    const requiredFields = [
      "brand",
      "model",
      "year",
      "registration",
      "type",
      "transmission",
      "fueltype",
    ];
    for (const field of requiredFields) {
      if (!vehicle[field]) {
        Alert.alert(t("fill_field_error").replace("{{field}}", t(field)));
        return;
      }
    }

    try {
      await addVehicle(vehicle);
      Alert.alert(t("vehicle_added_success"));
      router.back();
    } catch (error) {
      console.error("❌ Error saving vehicle:", error);
      Alert.alert(t("vehicle_add_failed"));
    }
  };

  return (
    <View style={styles.container}>
      <AddVehicleHeader title={t("add_vehicle_title")} showBack />

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>{t("brand_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.brand}
            onValueChange={(value) => setVehicle({ ...vehicle, brand: value })}
          >
            <Picker.Item label={t("select_brand")} value="" />
            {[
              "Toyota",
              "Honda",
              "Suzuki",
              "Nissan",
              "Ford",
              "Kia",
              "Hyundai",
              "Other",
            ].map((brand) => (
              <Picker.Item key={brand} label={brand} value={brand} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t("model_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.model}
            onValueChange={(value) => setVehicle({ ...vehicle, model: value })}
          >
            <Picker.Item label={t("select_model")} value="" />
            {[
              "Corolla",
              "Civic",
              "Accord",
              "Civic Type R",
              "Altis",
              "City",
              "Fortuner",
              "Hilux",
              "Other",
            ].map((model) => (
              <Picker.Item key={model} label={model} value={model} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t("year_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.year}
            onValueChange={(value) => setVehicle({ ...vehicle, year: value })}
          >
            <Picker.Item label={t("select_year")} value="" />
            {Array.from({ length: 30 }, (_, i) => (2025 - i).toString()).map(
              (y) => (
                <Picker.Item key={y} label={y} value={y} />
              )
            )}
          </Picker>
        </View>

        <InputField
          label={t("registration_label")}
          placeholder={t("registration_placeholder")}
          value={vehicle.registration}
          onChangeText={(t) => setVehicle({ ...vehicle, registration: t })}
        />

        <Text style={styles.label}>{t("vehicle_type_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.type}
            onValueChange={(value) => setVehicle({ ...vehicle, type: value })}
          >
            <Picker.Item label={t("select_type")} value="" />
            {["Car", "Bike", "Truck", "Van", "SUV"].map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t("transmission_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.transmission}
            onValueChange={(value) =>
              setVehicle({ ...vehicle, transmission: value })
            }
          >
            <Picker.Item label={t("select_transmission")} value="" />
            {["Automatic", "Manual", "CVT"].map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t("fuel_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.fueltype}
            onValueChange={(value) =>
              setVehicle({ ...vehicle, fueltype: value })
            }
          >
            <Picker.Item label={t("select_fuel")} value="" />
            {["Hi-Octane", "Diesel", "Gasoline", "Electric", "Hybrid"].map(
              (f) => (
                <Picker.Item key={f} label={f} value={f} />
              )
            )}
          </Picker>
        </View>

        <Text style={styles.label}>{t("color_label")}</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.color}
            onValueChange={(value) => setVehicle({ ...vehicle, color: value })}
          >
            <Picker.Item label={t("select_color")} value="" />
            {[
              "White",
              "Black",
              "Silver",
              "Gray",
              "Red",
              "Blue",
              "Green",
              "Yellow",
              "Orange",
              "Brown",
              "Other",
            ].map((color) => (
              <Picker.Item key={color} label={color} value={color} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>{t("photo_label")}</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {vehicle.image ? (
            <Image
              source={{ uri: vehicle.image }}
              style={styles.imagePreview}
            />
          ) : (
            <Text style={styles.imagePickerText}>{t("add_photo")}</Text>
          )}
        </TouchableOpacity>

        <AddVehicleButton
          title={t("add_vehicle_button")}
          type="primary"
          onPress={handleSave}
        />
      </ScrollView>
    </View>
  );
};

export default AddVehicleScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20, paddingBottom: 40, width: "100%" },
  label: { fontSize: 14, color: "#555", marginTop: 10, fontWeight: "500" },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 6,
  },
  imagePicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    height: 120,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fafafa",
    marginVertical: 10,
  },
  imagePickerText: { color: "#888" },
  imagePreview: { width: "100%", height: "100%", borderRadius: 10 },
});
