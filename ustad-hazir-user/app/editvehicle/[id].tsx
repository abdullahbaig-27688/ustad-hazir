// app/(tabs)/editvehicle/[id].tsx
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert, StyleSheet } from "react-native";
import EditVehicleHeader from "@/components/Header";
import InputField from "@/components/InputField";
import EditVehicleButton from "@/components/Button";
import { useRouter, useLocalSearchParams } from "expo-router";
import { getSingleVehicle, updateVehicle } from "@/backend/vehicleService";
import { useTranslation } from "react-i18next";
import { Picker } from "@react-native-picker/picker";

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
  const { t } = useTranslation();
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
        Alert.alert(t("error"), t("vehicle_not_found"));
        router.back();
      }
    };
    fetchVehicle();
  }, [vehicleId]);

  const handleChange = (key: keyof Vehicle, value: string) => {
    setVehicle({ ...vehicle, [key]: value });
  };

  const handleSave = async () => {
    const requiredFields: (keyof Vehicle)[] = [
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
        Alert.alert(
          t("error"),
          t("fill_field_error", { field: t(`${field}_label`) })
        );
        return;
      }
    }

    try {
      await updateVehicle(vehicleId, vehicle);
      Alert.alert(t("edit_vehicle"), t("vehicle_update_success"));
      router.back();
    } catch (error) {
      console.error("Error updating vehicle:", error);
      Alert.alert(t("vehicle_update_failed"));
    }
  };

  return (
    <View style={styles.container}>
      <EditVehicleHeader title={t("edit_vehicle")} showBack />

      <ScrollView contentContainerStyle={{ padding: 20 }}>
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
          onChangeText={(text) => handleChange("registration", text)}
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

        <EditVehicleButton
          title={t("edit_vehicle_button")}
          type="primary"
          onPress={handleSave}
        />
      </ScrollView>
    </View>
  );
};

export default EditVehicle;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "bold", marginTop: 10 },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginVertical: 6,
  },
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
