import Button from "@/components/Button";
import ProfileHeader from "@/components/Header";
import { auth, db, storage } from "@/src/firebaseConfig";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  BackHandler,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";
const languages = [
  {
    code: "en",
    label: "English",
    flag: require("@/assets/images/flags/usa.png"),
  },
  { code: "ur", label: "اردو", flag: require("@/assets/images/flags/pak.png") },
  {
    code: "fr",
    label: "Français",
    flag: require("@/assets/images/flags/fra.png"),
  },
];
const LanguageModal = ({ visible, onClose, i18n }: any) => {
  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    onClose();
  };

  return (
    <Pressable
      style={[styles.modalOverlay, { display: visible ? "flex" : "none" }]}
      onPress={onClose}
    >
      <View style={styles.modalContent}>
        {languages.map((lang) => (
          <Pressable
            key={lang.code}
            style={styles.langOption}
            onPress={() => changeLanguage(lang.code)}
          >
            <Image source={lang.flag} style={styles.flagIcon} />
            <Text style={styles.langText}>{lang.label}</Text>
          </Pressable>
        ))}
      </View>
    </Pressable>
  );
};

const ProfileScreen = () => {
  const { t, i18n } = useTranslation(); // <-- TRANSLATION HOOK

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [uploading, setUploading] = useState(false);
  const [langModalVisible, setLangModalVisible] = useState(false);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const userDocRef = doc(db, "users", currentUser.uid);
      getDoc(userDocRef).then((docSnap) => {
        const data = docSnap.exists() ? docSnap.data() : {};
        setUser({
          uid: currentUser.uid,
          name: currentUser.displayName || data?.name || t("name"),
          email: currentUser.email,
          photoURL: currentUser.photoURL || data?.photoURL || null,
        });
        setName(currentUser.displayName || data?.name || "");
        setEmail(currentUser.email || "");
      });
    }
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });

      if (!result.canceled && result.assets?.length > 0) {
        const imageUri = result.assets[0].uri;
        await uploadProfilePicture(imageUri);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(t("error"), t("error_pick_image"));
    }
  };

  const uploadProfilePicture = async (uri: string) => {
    try {
      setUploading(true);

      const response = await fetch(uri);
      const blob = await response.blob();
      const storageRef = ref(
        storage,
        `profilePictures/${auth.currentUser?.uid}.jpg`
      );

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      await auth.currentUser?.updateProfile({ photoURL: downloadURL });
      const userDocRef = doc(db, "users", auth.currentUser?.uid);
      await updateDoc(userDocRef, { photoURL: downloadURL });

      setUser({ ...user, photoURL: downloadURL });
      Alert.alert(t("success"), t("success_photo"));
    } catch (error) {
      console.error(error);
      Alert.alert(t("error"), t("error_upload_image"));
    } finally {
      setUploading(false);
    }
  };

  const handleSaveChanges = async () => {
    if (!user) return;

    try {
      if (name !== user.name) {
        await auth.currentUser?.updateProfile({ displayName: name });
        const userDocRef = doc(db, "users", auth.currentUser?.uid);
        await updateDoc(userDocRef, { name });
      }

      if (email !== user.email) {
        await auth.currentUser?.updateEmail(email);
      }

      setUser({ ...user, name, email });
      Alert.alert(t("success"), t("success_profile"));
    } catch (error: any) {
      console.error(error);
      if (error.code === "auth/requires-recent-login") {
        Alert.alert(t("error"), t("error_requires_login"));
      } else {
        Alert.alert(t("error"), t("error_update_profile"));
      }
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      router.replace("/login");
      if (Platform.OS === "android") BackHandler.exitApp();
    } catch (error) {
      console.error(error);
      Alert.alert(t("error"), t("logout_failed"));
    }
  };

  if (!user)
    return (
      <View style={styles.loadingContainer}>
        <Text>{t("loading")}</Text>
      </View>
    );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView contentContainerStyle={styles.container}>
          <ProfileHeader title={t("profile")} />

          <View style={styles.profileHeader}>
            <Pressable onPress={pickImage} style={styles.avatarWrapper}>
              {user.photoURL ? (
                <Image source={{ uri: user.photoURL }} style={styles.avatar} />
              ) : (
                <Ionicons
                  name="person-circle-outline"
                  size={120}
                  color="#4B7BEC"
                />
              )}
              <Text style={styles.changePhotoText}>
                {uploading ? t("uploading") : t("change_photo")}
              </Text>
            </Pressable>

            <Text style={styles.userName}>{name}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <Text style={styles.inputLabel}>{t("name")}</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder={t("enter_name")}
            />

            <Text style={styles.inputLabel}>{t("email")}</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder={t("enter_email")}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.buttonSection}>
            <Button
              title={t("save_changes")}
              type="primary"
              onPress={handleSaveChanges}
            />
            <Button
              title={t("logout")}
              type="secondary"
              onPress={handleLogout}
            />
            <Button
              title={t("changeLanguage")}
              type="tertiary"
              onPress={() => setLangModalVisible(true)}
              style={{ marginTop: 10 }}
            />
          </View>
          {/* Language Modal */}
          <LanguageModal
            visible={langModalVisible}
            onClose={() => setLangModalVisible(false)}
            i18n={i18n}
          />
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#F9FAFB",
    flexGrow: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatarWrapper: {
    alignItems: "center",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: "#4B7BEC",
  },
  changePhotoText: {
    marginTop: 8,
    color: "#4B7BEC",
    fontWeight: "600",
  },
  userName: {
    fontSize: 22,
    fontWeight: "700",
    marginTop: 10,
  },
  userEmail: {
    fontSize: 16,
    color: "#777",
    marginTop: 4,
  },
  inputSection: {
    marginBottom: 30,
    width: "80%",
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 6,
    marginLeft: 5,
  },
  input: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 15,
    fontSize: 16,
  },
  buttonSection: {
    width: "80%",
  },
  // Language Modal Styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.3)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
    width: 180,
  },
  langOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  flagIcon: {
    width: 30,
    height: 20,
    resizeMode: "contain",
    marginRight: 10,
  },
  langText: {
    fontSize: 16,
  },
});
