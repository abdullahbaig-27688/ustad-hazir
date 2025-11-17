import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { getSingleService, updateService } from "@/backend/machenicService";
import EditServiceHeader from "@/components/Header";
import EditServiceButton from "@/components/Button";
import { Picker } from "@react-native-picker/picker";
import InputField from "@/components/InputField";

const EditServiceScreen = () => {
  const { id } = useLocalSearchParams();

  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Load service data
  const loadService = async () => {
    try {
      const data = await getSingleService(id as string);
      setService({
        ...data,
        location: data.location || {
          address: "",
          city: "",
          state: "",
          country: "",
        },
      });
    } catch (error) {
      Alert.alert("Error", "Failed to load service details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadService();
  }, []);

  const handleSave = async () => {
    if (!service.serviceName || !service.price) {
      return Alert.alert("Required", "Name and Price are required.");
    }

    try {
      setSaving(true);

      await updateService(id as string, {
        serviceName: service.serviceName,
        price: Number(service.price),
        duration: service.duration,
        category: service.category,
        description: service.description,
        location: service.location,
      });

      Alert.alert("Success", "Service updated successfully!");
      router.back();
    } catch (err) {
      Alert.alert("Error", "Failed to update service.");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !service) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#2196F3" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <EditServiceHeader title="Edit Service" showBack />

      <ScrollView contentContainerStyle={styles.content}>
        {/* SERVICE TYPE */}
        <Text style={styles.sectionLabel}>Service Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={service.serviceName}
            style={styles.picker}
            onValueChange={(val) =>
              setService({ ...service, serviceName: val })
            }
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
        {/* DESCRIPTION */}
        <InputField
          label="Description"
          placeholder="Provide Service Description"
          multiline
          numberOfLines={5}
          value={service.description}
          style={{ height: 100, textAlignVertical: "top" }}
          onChangeText={(t) => setService({ ...service, description: t })}
        />

        {/* PRICE */}
        <InputField
          label="Price (PKR)"
          placeholder="Enter Price"
          keyboardType="numeric"
          value={String(service.price)}
          onChangeText={(t) => setService({ ...service, price: t })}
        />

        {/* DURATION */}
        <InputField
          label="Estimated Time"
          placeholder="e.g. 30 min"
          value={service.duration}
          onChangeText={(t) => setService({ ...service, duration: t })}
        />

        {/* CATEGORY */}
        <Text style={styles.sectionLabel}>Category</Text>
        <View style={styles.pickerWrapper}>
          <Picker
            selectedValue={service.category}
            style={styles.picker}
            onValueChange={(val) => setService({ ...service, category: val })}
          >
            <Picker.Item label="Select Vehicle Type" value="" />
            <Picker.Item label="Car" value="car" />
            <Picker.Item label="Bike" value="bike" />
            <Picker.Item label="Truck" value="truck" />
            <Picker.Item label="Van" value="van" />
            <Picker.Item label="SUV" value="suv" />
          </Picker>
        </View>

        {/* LOCATION */}
        <Text style={styles.sectionLabel}>Location</Text>

        <InputField
          label="Address"
          placeholder="Address"
          value={service.location.address}
          onChangeText={(t) =>
            setService({
              ...service,
              location: { ...service.location, address: t },
            })
          }
        />

        <InputField
          label="City"
          placeholder="City"
          value={service.location.city}
          onChangeText={(t) =>
            setService({
              ...service,
              location: { ...service.location, city: t },
            })
          }
        />

        <InputField
          label="State"
          placeholder="State"
          value={service.location.state}
          onChangeText={(t) =>
            setService({
              ...service,
              location: { ...service.location, state: t },
            })
          }
        />

        <InputField
          label="Country"
          placeholder="Country"
          value={service.location.country}
          onChangeText={(t) =>
            setService({
              ...service,
              location: { ...service.location, country: t },
            })
          }
        />

        <EditServiceButton
          title={saving ? "Updating..." : "Update"}
          type="primary"
          onPress={handleSave}
        />
      </ScrollView>
    </View>
  );
};

export default EditServiceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F9F9F9" },
  loaderContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  content: { padding: 16 },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
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
    height: Platform.OS === "ios" ? 180 : 50,
  },
});
