import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  ScrollView,
  Alert,
  I18nManager,
} from "react-native";
import RegisterInput from "@/components/InputField";
import RegisterButton from "@/components/Button";
import RegisterPicker from "@/components/Picker";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  createUserWithEmailAndPassword,
  getAuth,
  updateProfile,
} from "firebase/auth";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";
import { app } from "@/src/firebaseConfig";
import { useTranslation } from "react-i18next";
import LanguageSelector from "@/components/languageSelector";

const auth = getAuth(app);
const db = getFirestore(app);

const Register = () => {
  const { t, i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language);

  // Common fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [contact, setContact] = useState("");

  // Role and mechanic fields
  const [role, setRole] = useState("customer");
  const [workshopName, setWorkshopName] = useState("");
  const [experience, setExperience] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [cnic, setCnic] = useState("");

  const [rememberMe, setRememberMe] = useState(false);

  // useEffect(() => {
  //   const isRTL = i18n.language === "ur"; // check if Urdu
  //   I18nManager.forceRTL(isRTL);
  // }, [i18n.language]);
  // Listen for language changes
  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLang(lng);
    };

    i18n.on("languageChanged", handleLanguageChanged);

    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, []);

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      return Alert.alert(t("password_mismatch"));
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: name });

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

      Alert.alert(t("sign_up") + " " + t("success"));
      router.back();
    } catch (error: any) {
      Alert.alert(t("registration_error"), error.message);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
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
        <Text style={styles.title}>{t("register_title")}</Text>
        <Text style={styles.subtitle}>{t("register_subtitle")}</Text>
      </View>

      <View style={styles.inputContainer}>
        <RegisterInput
          key={currentLang} //
          label={t("name_placeholder")}
          placeholder={t("name_placeholder")}
          value={name}
          onChangeText={setName}
        />
        <RegisterInput
          key={currentLang} //
          label={t("email_placeholder")}
          placeholder={t("email_placeholder")}
          value={email}
          onChangeText={setEmail}
        />
        <RegisterInput
          label={t("password_placeholder")}
          placeholder={t("password_placeholder")}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
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
          label={t("confirm_password_placeholder")}
          placeholder={t("confirm_password_placeholder")}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={!showConfirmPassword}
          keyboardType="default"
          rightIcon={
            <Pressable
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              <Ionicons
                name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                size={22}
                color="#777"
              />
            </Pressable>
          }
        />
        <RegisterInput
          label={t("contact_placeholder")}
          placeholder={t("contact_placeholder")}
          value={contact}
          keyboardType="numeric"
          onChangeText={setContact}
        />
      </View>

      <RegisterPicker
        label={t("register_as")}
        selectedValue={role}
        onValueChange={(value: string) => setRole(value)}
        options={[
          { label: t("customer"), value: "customer", key: "customer" },
          { label: t("mechanic"), value: "mechanic", key: "mechanic" },
        ]}
      />

      {role === "mechanic" && (
        <View style={styles.inputContainer}>
          <RegisterInput
            label={t("workshop_name_placeholder")}
            placeholder={t("workshop_name_placeholder")}
            value={workshopName}
            onChangeText={setWorkshopName}
          />
          <RegisterInput
            label={t("experience_placeholder")}
            placeholder={t("experience_placeholder")}
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
          />
          <RegisterInput
            label={t("specialization_placeholder")}
            placeholder={t("specialization_placeholder")}
            value={specialization}
            onChangeText={setSpecialization}
          />
          <RegisterInput
            label={t("cnic_placeholder")}
            placeholder={t("cnic_placeholder")}
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
          <Text style={styles.rememberText}>{t("remember_me")}</Text>
        </Pressable>
        <Pressable onPress={() => console.log("Forgot Password pressed")}>
          <Text style={styles.forgotText}>{t("forgot_password")}</Text>
        </Pressable>
      </View>

      <View style={styles.buttonContainer}>
        <RegisterButton
          title={t("sign_up")}
          type="primary"
          onPress={handleSignUp}
        />
        <RegisterButton
          title={t("cancel")}
          type="secondary"
          onPress={() => router.back()}
        />
      </View>
    </ScrollView>
  );
};

export default Register;

// styles stay the same

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
    width: 200,
    height: 200,
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
