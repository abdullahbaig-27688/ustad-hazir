import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
} from "react-native";
import RegisterInput from "@/components/InputField";
import RegisterButton from "@/components/Button";
import RegisterPicker from "@/components/Picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { createUserWithEmailAndPassword, getAuth,updateProfile } from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { app } from "@/src/firebaseConfig";


const auth = getAuth(app);
const db = getFirestore(app);

const Register = () => {
  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [contact, setContact] = useState("");

  // Role and mechanic fields
  const [role, setRole] = useState("user");
  const [workshopName, setWorkshopName] = useState("");
  const [experience, setExperience] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [cnic, setCnic] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      return Alert.alert("Error", "Passwords do not match!");
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // ✅ Set display name for Firebase Auth
      await updateProfile(user, {
        displayName: name,
      });

      const userData = {
        uid: user.uid,
        name,
        email,
        contact,
        role,
        createdAt: new Date(),
        ...(role === "mechanic" && {
          workshopName,
          experience,
          specialization,
          cnic,
        }),
      };

      const authRef = collection(db, "users");
      await setDoc(doc(authRef, user.uid), userData);

      Alert.alert("Success", "Account created successfully!");
      router.back();
    } catch (error: any) {
      Alert.alert("Registration Error", error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/welcome.jpeg")}
          style={styles.image}
          resizeMode="stretch"
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>
          “Fast, trusted roadside help at your fingertips.”
        </Text>
      </View>

      <View style={styles.inputContainer}>
        <RegisterInput
          label="Name"
          placeholder="Enter Name"
          value={name}
          onChangeText={setName}
        />
        <RegisterInput
          label="Email"
          placeholder="Enter Email"
          value={email}
          onChangeText={setEmail}
        />
        <RegisterInput
          label="Password"
          placeholder="Enter Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          // autoCorrect={false}
          keyboardType="default"
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
        <RegisterInput
          label="Confirm Password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          // autoCorrect={false}
          keyboardType="default"
          rightIcon={
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#777"
              />
            </Pressable>
          }
        />
        <RegisterInput
          label="Contact Ph#"
          placeholder="Enter Contact Number"
          value={contact}
          keyboardType="numeric"
          onChangeText={setContact}
        />
      </View>

      <RegisterPicker
        label="Register As"
        selectedValue={role}
        onValueChange={(value: string) => setRole(value)}
        options={[
          { label: "Customer", value: "customer" },
          { label: "Mechanic", value: "mechanic" },
        ]}
      />

      {role === "mechanic" && (
        <View style={styles.inputContainer}>
          <RegisterInput
            label="Workshop Name"
            placeholder="Enter workshop name"
            value={workshopName}
            onChangeText={setWorkshopName}
          />
          <RegisterInput
            label="Experience (years)"
            placeholder="Enter experience"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
          />
          <RegisterInput
            label="Specialization"
            placeholder="e.g. Tires, Engine, Battery"
            value={specialization}
            onChangeText={setSpecialization}
          />
          <RegisterInput
            label="CNIC / License Number"
            placeholder="Enter CNIC or License"
            value={cnic}
            onChangeText={setCnic}
          />
        </View>
      )}

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
        <RegisterButton title="Sign Up" type="primary" onPress={handleSignUp} />
        <RegisterButton
          title="Cancel"
          type="secondary"
          onPress={() => router.back()}
        />
      </View>
    </ScrollView>
  );
};

export default Register;

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 30,
    paddingHorizontal: 30,
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
    alignItems: "center",
    paddingHorizontal: 30,
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
    paddingHorizontal: 30,
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
