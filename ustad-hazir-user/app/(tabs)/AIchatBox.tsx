// screens/AIChatScreen.tsx
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { Button, StyleSheet, Switch, Text, TextInput, View } from "react-native";
import { getDiagnosis } from "../../ai/vehicleAI"; // Make sure path is correct

const AIchatBox = () => {
    // --------------------------
    // State variables
    // --------------------------
    const [engineOn, setEngineOn] = useState(true);
    const [batteryIssue, setBatteryIssue] = useState(false);
    const [noiseType, setNoiseType] = useState("");
    const [vehicleCategory, setVehicleCategory] = useState<"Bike" | "Car" | "Truck">("Bike");
    const [location, setLocation] = useState<"City" | "Suburb" | "Rural">("City");
    const [result, setResult] = useState<any>(null);

    // --------------------------
    // Handle AI Diagnosis
    // --------------------------
    const handleDiagnose = () => {
        const diagnosis = getDiagnosis(
            engineOn ? 1 : 0,
            batteryIssue,
            noiseType,
            vehicleCategory,
            location
        );
        setResult(diagnosis);
    };

    // --------------------------
    // Render UI
    // --------------------------
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vehicle AI Diagnosis</Text>

            <View style={styles.row}>
                <Text>Is Engine On?</Text>
                <Switch value={engineOn} onValueChange={setEngineOn} />
            </View>

            <View style={styles.row}>
                <Text>Battery Issue?</Text>
                <Switch value={batteryIssue} onValueChange={setBatteryIssue} />
            </View>

            <Text>Noise Type (none / knocking / grinding):</Text>
            <TextInput
                style={styles.input}
                value={noiseType}
                onChangeText={setNoiseType}
                placeholder="e.g., none, knocking, grinding"
            />

            <Text>Vehicle Category:</Text>
            <Picker
                selectedValue={vehicleCategory}
                onValueChange={(val) => setVehicleCategory(val as any)}
                style={styles.picker}
            >
                <Picker.Item label="Bike" value="Bike" />
                <Picker.Item label="Car" value="Car" />
                <Picker.Item label="Truck" value="Truck" />
            </Picker>

            <Text>Location:</Text>
            <Picker
                selectedValue={location}
                onValueChange={(val) => setLocation(val as any)}
                style={styles.picker}
            >
                <Picker.Item label="City" value="City" />
                <Picker.Item label="Suburb" value="Suburb" />
                <Picker.Item label="Rural" value="Rural" />
            </Picker>

            <Button title="Get Diagnosis" onPress={handleDiagnose} />

            {result && (
                <View style={styles.result}>
                    <Text>Fault: {result.fault}</Text>
                    <Text>Severity: {result.severity}</Text>
                    <Text>Estimated Cost: ${result.estimatedCost}</Text>
                    <Text>{result.disclaimer}</Text>
                </View>
            )}
        </View>
    );
};

// --------------------------
// Styles
// --------------------------
const styles = StyleSheet.create({
    container: { padding: 20, flex: 1 },
    title: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
    row: { flexDirection: "row", alignItems: "center", marginVertical: 10, justifyContent: "space-between" },
    input: { borderWidth: 1, borderColor: "#ccc", padding: 8, marginVertical: 10 },
    picker: { borderWidth: 1, borderColor: "#ccc", marginVertical: 10 },
    result: { marginTop: 20, padding: 10, borderWidth: 1, borderColor: "#aaa", borderRadius: 5 },
});

export default AIchatBox;
