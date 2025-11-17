import React, { useState } from "react";
import { View, Pressable, Image, Modal, Text, StyleSheet, FlatList } from "react-native";
import { useTranslation } from "react-i18next";

const languages = [
  { code: "en", label: "English", flag: require("@/assets/images/flags/usa.png") },
  { code: "ur", label: "اردو", flag: require("@/assets/images/flags/pak.png") },
  { code: "fr", label: "Français", flag: require("@/assets/images/flags/fra.png") },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();
  const [modalVisible, setModalVisible] = useState(false);

  const currentLang = i18n.language;

  const changeLanguage = (langCode: string) => {
    i18n.changeLanguage(langCode);
    setModalVisible(false);
  };

  return (
    <View>
      <Pressable style={styles.langButton} onPress={() => setModalVisible(true)}>
        <Image
          source={languages.find((l) => l.code === currentLang)?.flag}
          style={styles.flagIcon}
        />
      </Pressable>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
          <View style={styles.modalContent}>
            <FlatList
              data={languages}
              keyExtractor={(item) => item.code}
              renderItem={({ item }) => (
                <Pressable style={styles.langOption} onPress={() => changeLanguage(item.code)}>
                  <Image source={item.flag} style={styles.flagIcon} />
                  <Text style={styles.langText}>{item.label}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

export default LanguageSelector;

const styles = StyleSheet.create({
  langButton: {
    position: "absolute",
    top: 10,
    right: 10,
    zIndex: 10,
  },
  flagIcon: { width: 30, height: 20, resizeMode: "contain", marginRight: 5 },
  modalOverlay: {
    flex: 1,
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
  langText: { marginLeft: 10, fontSize: 16 },
});
