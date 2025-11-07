import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
type ButtonProps = {
  title: string;
  rightIcon: string;
  showBack: boolean;
  onRightPress: () => void;
  onBackPress?: () => void;
};
const Header = ({
  title,
  rightIcon,
  showBack,
  onRightPress,
  onBackPress,
}: ButtonProps) => {
  const router = useRouter();
  return (
    <View style={styles.header}>
      {/* Back Button */}
      {showBack ? (
        <Pressable
          onPress={() => {
            if (onBackPress) onBackPress(); // use custom handler if provided
            else router.back(); // fallback to normal back
          }}
          style={styles.iconBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
      {/* Title */}
      <Text style={styles.title}>{title}</Text>

      {/* Optional Right Icon */}
      {rightIcon ? (
        <Pressable onPress={onRightPress} style={styles.iconBtn}>
          <Ionicons name={rightIcon} size={24} color="#fff" />
        </Pressable>
      ) : (
        <View style={styles.iconPlaceholder} />
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 40,

    backgroundColor: "#5126ecff",
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  iconBtn: {
    padding: 4,
  },
  iconPlaceholder: {
    width: 28, // keep alignment balanced
  },
  title: {
    fontSize: 25,
    fontWeight: "600",
    color: "#fff",
  },
});
