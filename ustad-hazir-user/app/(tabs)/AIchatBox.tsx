// screens/AIChatScreen.tsx
import Header from "@/components/Header";
import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useState } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { getDiagnosis } from "../../ai/vehicleAI";

const AIchatBox = () => {
    // Step control
    const [step, setStep] = useState(0);

    // User answers
    const [engineOn, setEngineOn] = useState<boolean | null>(null);
    const [batteryIssue, setBatteryIssue] = useState<boolean | null>(null);
    const [noiseType, setNoiseType] = useState<string>("none");
    const [issueTime, setIssueTime] = useState<string | null>(null);

    // Result
    const [result, setResult] = useState<any>(null);

    // 🔥 RESET when screen opens again
    useFocusEffect(
        useCallback(() => {
            setStep(0);
            setEngineOn(null);
            setBatteryIssue(null);
            setNoiseType("none");
            setIssueTime(null);
            setResult(null);
        }, [])
    );

    const handleDiagnosis = () => {
        const diagnosis = getDiagnosis(
            engineOn ? 1 : 0,
            batteryIssue ?? false,
            noiseType,
            "Bike",
            "City"
        );
        setResult(diagnosis);
    };

    return (
        <View style={styles.container}>
            <Header title="Vehicle AI Diagnosis" showBack={true} />

            <View style={styles.content}>
                {/* Step 1 */}
                {step === 0 && (
                    <>
                        <Text style={styles.question}>Is the engine starting?</Text>
                        <Button title="Yes" onPress={() => { setEngineOn(true); setStep(1); }} />
                        <Button title="No" onPress={() => { setEngineOn(false); setStep(1); }} />
                    </>
                )}

                {/* Step 2 */}
                {step === 1 && (
                    <>
                        <Text style={styles.question}>Are there warning lights on the dashboard?</Text>
                        <Button title="Yes" onPress={() => { setBatteryIssue(true); setStep(2); }} />
                        <Button title="No" onPress={() => { setBatteryIssue(false); setStep(2); }} />
                    </>
                )}

                {/* Step 3 */}
                {step === 2 && (
                    <>
                        <Text style={styles.question}>Is the vehicle making unusual sounds?</Text>
                        <Button title="No unusual sound" onPress={() => { setNoiseType("none"); setStep(3); }} />
                        <Button title="Knocking" onPress={() => { setNoiseType("knocking"); setStep(3); }} />
                        <Button title="Grinding" onPress={() => { setNoiseType("grinding"); setStep(3); }} />
                    </>
                )}

                {/* Step 4 */}
                {step === 3 && (
                    <>
                        <Text style={styles.question}>When did the issue occur?</Text>
                        <Button title="Today" onPress={() => { setIssueTime("today"); setStep(4); handleDiagnosis(); }} />
                        <Button title="Few days ago" onPress={() => { setIssueTime("few_days"); setStep(4); handleDiagnosis(); }} />
                        <Button title="More than a week" onPress={() => { setIssueTime("week_plus"); setStep(4); handleDiagnosis(); }} />
                    </>
                )}

                {/* Result */}
                {step === 4 && result && (
                    <View style={styles.result}>
                        <Text style={styles.resultText}>Probable Issue: {result.fault}</Text>
                        <Text style={styles.resultText}>Severity: {result.severity}</Text>
                        <Text style={styles.resultText}>Estimated Cost: ${result.estimatedCost}</Text>
                        <Text style={styles.disclaimer}>{result.disclaimer}</Text>
                    </View>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#ffffff" },
    content: { padding: 20 },
    question: { fontSize: 18, marginBottom: 12 },
    result: { marginTop: 20, padding: 15, borderWidth: 1, borderColor: "#aaa", borderRadius: 6 },
    resultText: { fontSize: 16, marginBottom: 6 },
    disclaimer: { marginTop: 10, fontSize: 12, color: "gray" },
});

export default AIchatBox;
