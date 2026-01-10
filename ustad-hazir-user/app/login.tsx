import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  Text,
  Pressable,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  I18nManager,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginInput from "@/components/InputField";
import LoginButton from "@/components/Button";
import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/src/firebaseConfig";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/languageSelector";

const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const { t, i18n } = useTranslation(); // Add this

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password)
      return Alert.alert(t("login_error"), t("empty_fields"));

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCredential.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists())
        return Alert.alert(t("login_error"), t("user_not_found"));

      const userData = docSnap.data();
      console.log("Logged in as:", userData.role);

      if (userData.role === "customer") router.replace("/(tabs)");
      else if (userData.role === "mechanic") router.replace("/mechanic");
      else router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert(t("login_error"), error.message);
    }
  };
  // useEffect(() => {
  //   const isRTL = i18n.language === "ur"; // check if Urdu
  //   I18nManager.forceRTL(isRTL);
  // }, [i18n.language]);
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
          {/* <LanguageSelector /> */}
          <View style={{ position: "absolute", top: 40, right: 10, zIndex: 1000 }}>
            <LanguageSelector />
          </View>
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/welcome.png")}
              style={styles.image}
              resizeMode="contain"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>{t("login_title")}</Text>
            <Text style={styles.subtitle}>{t("login_subtitle")}</Text>
          </View>

          <View style={styles.inputContainer}>
            <LoginInput
              label={t("email_placeholder")}
              placeholder={t("email_placeholder")}
              value={email}
              onChangeText={setEmail}
            />
            <LoginInput
              label={t("password_placeholder")}
              placeholder={t("password_placeholder")}
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              rightIcon={
                <Pressable onPress={() => setShowPassword(!showPassword)}>
                  <Ionicons
                    name={showPassword ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#777"
                  />
                </Pressable>
              }
            />
          </View>

          <View style={styles.optionsRow}>
            <Pressable
              onPress={() => setRememberMe(!rememberMe)}
              style={styles.rememberContainer}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              />
              <Text style={styles.rememberText}>{t("remember_me")}</Text>
            </Pressable>
            <Pressable onPress={() => console.log("Forgot Password pressed")}>
              <Text style={styles.forgotText}>{t("forgot_password")}</Text>
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <LoginButton
              title={t("login_button")}
              type="primary"
              onPress={handleLogin}
            />
            <LoginButton
              title={t("cancel_button")}
              type="secondary"
              onPress={() => router.back()}
            />
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default Login;

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
  },
  title: {
    fontSize: 34,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
  },
  inputContainer: {
    width: "100%",
  },
  buttonContainer: {
    width: "100%",
    marginTop: 10,
  },
  optionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginTop: 6,
    marginBottom: 20,
  },
  rememberContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1.5,
    borderColor: "#000",
    borderRadius: 4,
    marginRight: 8,
  },
  checkboxChecked: {
    backgroundColor: "#ff5a5f",
  },
  rememberText: {
    fontSize: 14,
    color: "#333",
  },
  forgotText: {
    fontSize: 14,
    color: "#5075d9",
    fontWeight: "600",
  },
});
