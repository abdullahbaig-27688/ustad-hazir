import React from "react";
import { StyleSheet, Text, Pressable } from "react-native";
type ButtonProps = {
  title: string;
  onPress: () => void;
  type: "primary" | "secondary";
};
const Button = ({ title, onPress, type }: ButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        type === "primary" ? styles.primary : styles.secondary,
        pressed && styles.pressed,
      ]}
    >
      <Text
        style={[
          styles.text,
          type === "primary" ? styles.primaryText : styles.secondaryText,
        ]}
      >
        {title}
      </Text>
    </Pressable>
  );
};

export default Button;
const styles = StyleSheet.create({
  button: {
    paddingVertical: 14,
    
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  primary: {
    backgroundColor: "#5126ecff",
  },
  secondary: {
    borderWidth: 1.5,
    borderColor: "#5126ecff",
    backgroundColor: "#fff",
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#5126ecff",
  },
});
