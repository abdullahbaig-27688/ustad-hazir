import React, { useState } from "react";
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
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import LoginInput from "@/components/InputField";
import LoginButton from "@/components/Button";
import { router } from "expo-router";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/src/firebaseConfig";

const auth = getAuth(app);
const db = getFirestore(app);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) return Alert.alert("Error", "Please enter email and password");

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      const docRef = doc(db, "users", uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) return Alert.alert("Error", "User profile not found");

      const userData = docSnap.data();
      console.log("Logged in as:", userData.role);

      if (userData.role === "customer") router.replace("/(tabs)");
      else if (userData.role === "mechanic") router.replace("/mechanic");
      else router.replace("/(tabs)");
    } catch (error: any) {
      Alert.alert("Login Error", error.message);
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
          <View style={styles.imageContainer}>
            <Image
              source={require("@/assets/images/welcome.jpeg")}
              style={styles.image}
              resizeMode="stretch"
            />
          </View>

          <View style={styles.textContainer}>
            <Text style={styles.title}>Log In</Text>
            <Text style={styles.subtitle}>
              "Fast, trusted roadside help at your fingertips."
            </Text>
          </View>

          <View style={styles.inputContainer}>
            <LoginInput
              label="Email"
              placeholder="Enter Email"
              value={email}
              onChangeText={setEmail}
            />
            <LoginInput
              label="Password"
              placeholder="Enter Password"
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
              <Text style={styles.rememberText}>Remember me</Text>
            </Pressable>
            <Pressable onPress={() => console.log("Forgot Password pressed")}>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </Pressable>
          </View>

          <View style={styles.buttonContainer}>
            <LoginButton title="Log In" type="primary" onPress={handleLogin} />
            <LoginButton title="Cancel" type="secondary" onPress={() => router.back()} />
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
    width: 300,
    height: 300,
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
    color: "#5126ecff",
    fontWeight: "600",
  },
});
