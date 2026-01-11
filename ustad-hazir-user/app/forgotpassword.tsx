import LoginButton from "@/components/Button";
import LoginInput from "@/components/InputField";
import LanguageSelector from "@/components/languageSelector";
import { app } from "@/src/firebaseConfig";
import { router } from "expo-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Image,
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View
} from "react-native";

const auth = getAuth(app);

const ForgotPassword = () => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");

    const handleResetPassword = async () => {
        if (!email)
            return Alert.alert(t("error"), t("empty_fields"));

        try {
            await sendPasswordResetEmail(auth, email);
            Alert.alert(
                t("success"),
                t("reset_link_sent"),
                [{ text: "OK", onPress: () => router.replace("/login") }]
            );
        } catch (error: any) {
            Alert.alert(t("error"), error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <ScrollView
                    contentContainerStyle={styles.container}
                    keyboardShouldPersistTaps="handled"
                >
                    {/* Language Selector */}
                    <View style={{ position: "absolute", top: 40, right: 10, zIndex: 1000 }}>
                        <LanguageSelector />
                    </View>

                    {/* Image */}

                    <View style={styles.imageContainer}>
                        <Image
                            source={require("@/assets/images/welcome.png")}
                            style={styles.image}
                            resizeMode="contain"
                        />
                    </View>

                    {/* Text */}
                    <View style={styles.textContainer}>
                        <Text style={styles.title}>{t("forgot_password")}</Text>
                        <Text style={styles.subtitle}>
                            {t("forgot_password_subtitle")}
                        </Text>
                    </View>

                    {/* Input */}
                    <View style={styles.inputContainer}>
                        <LoginInput
                            label={t("email_placeholder")}
                            placeholder={t("email_placeholder")}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <LoginButton
                            title={t("send_reset_link")}
                            type="primary"
                            onPress={handleResetPassword}
                        />
                        <LoginButton
                            title={t("back_to_login")}
                            type="secondary"
                            onPress={() => router.back()}
                        />
                    </View>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
    );
};

export default ForgotPassword;
const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 30,
        paddingVertical: 30,
    },
    imageContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: 400,
        height: 400,
    },
    textContainer: {
        marginTop: 10,
        marginBottom: 20,
        alignItems: "center",
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#000",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#777",
        textAlign: "center",
    },
    inputContainer: {
        width: "100%",
    },
    buttonContainer: {
        width: "100%",
        marginTop: 10,
    },
});
