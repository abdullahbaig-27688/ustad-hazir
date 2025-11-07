// app/(tabs)/editvehicle/[id].tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  Alert,
  ScrollView,
} from "react-native";
import Header from "@/components/Header";
import InputField from "@/components/InputField";
import { useRouter, useLocalSearchParams } from "expo-router";

import Button from "@/components/Button";
import { getSingleVehicle, updateVehicle } from "@/backend/vehicleService";


interface Vehicle {
  id: string;
  brand: string;
  model: string;
  year: string;
  registration: string;
  type: string;

  transmission: string;
  fueltype: string;
  color: string;
  image: null;
}

const EditVehicle = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const vehicleId = params.id as string;

  const [vehicle, setVehicle] = useState<Vehicle>({
    id: "",
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

  useEffect(() => {
    const fetchVehicle = async () => {
      try {
        const data = await getSingleVehicle(vehicleId);
        setVehicle(data as Vehicle);
      } catch (error) {
        Alert.alert("Error", "Vehicle not found");
        router.back();
      }
    };

    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (key: keyof Vehicle, value: string) => {
    setVehicle({ ...vehicle, [key]: value });
  };

  const handleSave = async () => {
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
        Alert.alert("Error", `Please fill in the ${field} field.`);
        return;
      }
    }

    try {
      await updateVehicle(vehicleId, vehicle);
      Alert.alert("Success", "Vehicle updated successfully!");
      router.back();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert("❌ Failed to update vehicle");
    }
  };

  return (
    <View style={styles.container}>
      <Header title="Edit Vehicle" showBack />

      <ScrollView
        // style={styles.container}
        contentContainerStyle={{ padding: 20 }}
      >
        {/* <Text style={styles.title}>Edit Vehicle</Text> */}

        {/* <Text style={styles.label}>Brand</Text> */}
        <InputField
          label="Brand / Make"
          placeholder="e.g. Toyota, Honda"
          value={vehicle.brand}
          //   style={styles.input}
          onChangeText={(text) => handleChange("brand", text)}
        />

        <InputField
          label="Model"
          placeholder="e.g. Corolla 2020"
          value={vehicle.model}
          onChangeText={(text) => handleChange("model", text)}
        />

        <InputField
          label="Year"
          placeholder="2020, 2021, 2022"
          value={vehicle.year}
          onChangeText={(text) => handleChange("year", text)}
        />

        <InputField
          label="Registration Number"
          placeholder="Enter registration number"
          value={vehicle.registration}
          onChangeText={(text) => handleChange("registration", text)}
        />
        <InputField
          label="Vehicle Type"
          placeholder="Car, Bike, Truck..."
          value={vehicle.type}
          onChangeText={(text) => handleChange("type", text)}
        />
        <InputField
          label="Transmission Type"
          placeholder="Automatic, Manual, CVT..."
          value={vehicle.transmission}
          onChangeText={(text) => handleChange("transmission", text)}
        />
        <InputField
          label="Fuel Type"
          placeholder="Hi-Octane, Diesal, Gasoline..."
          value={vehicle.fueltype}
          onChangeText={(text) => handleChange("fueltype", text)}
        />
        <InputField
          label="Color (optional)"
          placeholder="e.g. White"
          value={vehicle.color}
          onChangeText={(text) => handleChange("color", text)}
        />

        <Button title="Edit Vehicle" type="primary" onPress={handleSave} />
      </ScrollView>
    </View>
  );
};

export default EditVehicle;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 5,
  },
  saveButton: {
    backgroundColor: "#0D47A1",
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },
  saveButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
