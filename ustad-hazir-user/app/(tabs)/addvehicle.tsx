import Button from "@/components/Button";
import Header from "@/components/Header";
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

const carBrands = [
  "Toyota",
  "Honda",
  "Suzuki",
  "Nissan",
  "Ford",
  "Kia",
  "Hyundai",
  "Other",
];

const carModels = [
  "Corolla",
  "Civic",
  "Accord",
  "Civic Type R",
  "Altis",
  "City",
  "Fortuner",
  "Hilux",
  "Other",
];

const years = Array.from({ length: 30 }, (_, i) => (2025 - i).toString()); // last 30 years

const vehicleTypes = ["'Car", "Bike", "Truck", "Van", "SUV"];
const transmissionTypes = ["Automatic", "Manual", "CVT"];
const fuelTypes = ["Hi-Octane", "Diesel", "Gasoline", "Electric", "Hybrid"];
const colors = [
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
];

const AddVehicleScreen = () => {
  const [vehicle, setVehicle] = useState({
    // id:"",
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

    // Validate fields
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
        Alert.alert(`Please fill in the ${field} field.`);
        return;
      }
    }

    try {
      await addVehicle(vehicle); // ✅ Using backend function now
      Alert.alert("✅ Vehicle added successfully!");
      router.back();
    } catch (error) {
      console.error("❌ Error saving vehicle:", error);
      Alert.alert("❌ Failed to save vehicle. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Add Vehicle" showBack />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.label}>Brand / Make</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.brand}
            onValueChange={(value) => setVehicle({ ...vehicle, brand: value })}
          >
            <Picker.Item label="Select Brand" value="" />
            {carBrands.map((brand) => (
              <Picker.Item key={brand} label={brand} value={brand} />
            ))}
          </Picker>
        </View>

        {/* <InputField
          label="Brand / Make"
          placeholder="e.g. Toyota, Honda"
          value={vehicle.brand}
          onChangeText={(t) => setVehicle({ ...vehicle, brand: t })}
        /> */}

        <Text style={styles.label}>Model</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.model}
            onValueChange={(value) => setVehicle({ ...vehicle, model: value })}
          >
            <Picker.Item label="Select Model" value="" />
            {carModels.map((model) => (
              <Picker.Item key={model} label={model} value={model} />
            ))}
          </Picker>
        </View>

        {/* <InputField
          label="Model"
          placeholder="e.g. Corolla 2020"
          value={vehicle.model}
          onChangeText={(t) => setVehicle({ ...vehicle, model: t })}
        /> */}
        {/* Year Picker */}
        <Text style={styles.label}>Year</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.year}
            onValueChange={(value) => setVehicle({ ...vehicle, year: value })}
          >
            <Picker.Item label="Select Year" value="" />
            {years.map((y) => (
              <Picker.Item key={y} label={y} value={y} />
            ))}
          </Picker>
        </View>

        {/* <InputField
          label="Year"
          placeholder="2020, 2021, 2022"
          value={vehicle.year}
          onChangeText={(t) => setVehicle({ ...vehicle, year: t })}
        /> */}
        <InputField
          label="Registration Number"
          placeholder="Enter registration number"
          value={vehicle.registration}
          onChangeText={(t) => setVehicle({ ...vehicle, registration: t })}
        />

        {/* Vehicle Type Picker */}
        <Text style={styles.label}>Vehicle Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.type}
            onValueChange={(value) => setVehicle({ ...vehicle, type: value })}
          >
            <Picker.Item label="Select Type" value="" />
            {vehicleTypes.map((type) => (
              <Picker.Item key={type} label={type} value={type} />
            ))}
          </Picker>
        </View>
        {/* <InputField
          label="Vehicle Type"
          placeholder="Car, Bike, Truck..."
          value={vehicle.type}
          onChangeText={(t) => setVehicle({ ...vehicle, type: t })}
        /> */}

        {/* Transmission Picker */}
        <Text style={styles.label}>Transmission Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.transmission}
            onValueChange={(value) =>
              setVehicle({ ...vehicle, transmission: value })
            }
          >
            <Picker.Item label="Select Transmission" value="" />
            {transmissionTypes.map((t) => (
              <Picker.Item key={t} label={t} value={t} />
            ))}
          </Picker>
        </View>

        {/* <InputField
          label="Transmission Type"
          placeholder="Automatic, Manual, CVT..."
          value={vehicle.transmission}
          onChangeText={(t) => setVehicle({ ...vehicle, transmission: t })}
        /> */}
        {/* Fuel Type Picker */}
        <Text style={styles.label}>Fuel Type</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.fueltype}
            onValueChange={(value) =>
              setVehicle({ ...vehicle, fueltype: value })
            }
          >
            <Picker.Item label="Select Fuel Type" value="" />
            {fuelTypes.map((f) => (
              <Picker.Item key={f} label={f} value={f} />
            ))}
          </Picker>
        </View>

        {/* <InputField
          label="Fuel Type"
          placeholder="Hi-Octane, Diesel, Gasoline..."
          value={vehicle.fueltype}
          onChangeText={(t) => setVehicle({ ...vehicle, fueltype: t })}
        /> */}

        <Text style={styles.label}>Color (optional)</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={vehicle.color}
            onValueChange={(value) => setVehicle({ ...vehicle, color: value })}
          >
            <Picker.Item label="Select Color" value="" />
            {colors.map((color) => (
              <Picker.Item key={color} label={color} value={color} />
            ))}
          </Picker>
        </View>

        {/* <InputField
          label="Color (optional)"
          placeholder="e.g. White"
          value={vehicle.color}
          onChangeText={(t) => setVehicle({ ...vehicle, color: t })}
        /> */}

        <Text style={styles.label}>Vehicle Photo (optional)</Text>
        <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
          {vehicle.image ? (
            <Image
              source={{ uri: vehicle.image }}
              style={styles.imagePreview}
            />
          ) : (
            <Text style={styles.imagePickerText}>+ Add Photo</Text>
          )}
        </TouchableOpacity>

        <Button title="Add Vehicle" type="primary" onPress={handleSave} />
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
