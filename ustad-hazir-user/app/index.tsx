import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  Animated,
  Dimensions,
  ActivityIndicator,
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

const { width, height } = Dimensions.get("window");

const SplashScreen = () => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    // Fade in animation
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Navigate to Home after 3 seconds
    // Navigate to welcome screen after 3 seconds
    const timer = setTimeout(() => {
      router.replace("/welcome"); // Replace with your route
    }, 4000);

    return () => clearTimeout(timer);
  }, [fadeAnim, router]);

  return (
    <LinearGradient colors={["#0D47A1", "#42A5F5"]} style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim, alignItems: "center" }}>
        <View style={styles.logoContainer}>
          <Image
            source={require("@/assets/images/welcome.png")} // replace with your illustration image
            style={styles.logo}
            resizeMode="contain"
          />
        </View>
        <View style={styles.textContainer}>
       <Text style={styles.appName}>Ustad Hazir</Text>
        <Text style={styles.tagline}> Fast, trusted roadside help at your fingertips.</Text>
        </View>
 
      </Animated.View>
      <ActivityIndicator
        size="large"
        color="#FFC107"
        style={{ marginTop: 40 }}
      />
    </LinearGradient>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    // backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
     width: "100%",     // take full width of container
  height: "100%",    // take full height of container
  // borderRadius: 60,  // optional
    // width: 200,
    // height: 300,
    // fontSize: 48,
    // fontWeight: "bold",
    // color: "#0D47A1",
  },
  appName: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
  },
  tagline: {
    fontSize: 16,
    color: "white",
    marginTop: 8,
  },
   textContainer: {
    alignItems: "center",
    paddingTop:40,
    marginBottom: 20,
  },
});
