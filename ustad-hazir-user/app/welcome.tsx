import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  Pressable,
  StatusBar,
  StyleSheet,
} from "react-native";
import { useTranslation } from "react-i18next";
import { router } from "expo-router";
import Button from "@/components/Button";
import i18n from "@/src/i18n"; // Import the configured i18n
import LanguageSelector from "@/components/languageSelector";

const WelcomeScreen = () => {
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || "en");

  // Sync state when component mounts
  useEffect(() => {
    setCurrentLang(i18n.language);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Language Switch Button */}
      {/* Language Selector */}
      {/* <LanguageSelector /> */}
      <View style={{ position: "absolute", top: 40, right: 10, zIndex: 1000 }}>
        <LanguageSelector />
      </View>

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/welcome.png")}
          style={styles.image}
          resizeMode="stretch"
        />
      </View>

      {/* Title and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{t("welcome_title")}</Text>
        <Text style={styles.subtitle}>{t("welcome_subtitle")}</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title={t("create_account")}
          onPress={() => router.push("/register")}
          type="primary"
        />
        <Button
          title={t("already_have_account")}
          onPress={() => router.push("/login")}
          type="secondary"
        />
      </View>
    </View>
  );
};

export default WelcomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 40,
    paddingHorizontal: 25,
  },
  langButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
    padding: 6,
  },
  flagIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
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
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: "#000",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: "#777",
    textAlign: "center",
    width: 250,
  },
  buttonContainer: {
    width: "100%",
  },
});
