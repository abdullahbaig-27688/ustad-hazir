import Button from "@/components/Button";
import { router } from "expo-router";
import React from "react";
import { Image, StatusBar, StyleSheet, Text, View } from "react-native";

const  WelcomeScreen=()=> {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Illustration */}
      <View style={styles.imageContainer}>
        <Image
          source={require("@/assets/images/welcome.jpeg")} // replace with your illustration image
          style={styles.image}
          resizeMode="stretch"
        />
      </View>

      {/* Title and Description */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>“Get Back on the Road”</Text>
        <Text style={styles.subtitle}>
          “Fast, trusted roadside help at your fingertips.”
        </Text>
      </View>

      {/* Pagination Dots */}
      {/* <View style={styles.dotsContainer}>
        <View style={[styles.dot, styles.activeDot]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View> */}

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <Button
          title="Create  Account"
          onPress={() => router.push("/register")}
          type={"primary"}
        />
        <Button
          title="Already have Account"
          onPress={() => router.push("/login")}
          type={"secondary"}
        />
      </View>

      {/* <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Log into your account</Text>
        </TouchableOpacity> */}
      {/* 
        <TouchableOpacity style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Log in</Text>
        </TouchableOpacity>
      </View> */}
    </View>
  );
}

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
    // marginTop: 10,
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
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 15,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  //   activeDot: {
  //     backgroundColor: "#ff5a5f",
  //   },
  buttonContainer: {
    width: "100%",
  },
  
});
