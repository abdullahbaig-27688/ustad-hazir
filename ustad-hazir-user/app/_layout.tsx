import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import "react-native-reanimated";
import { MechanicProvider } from "@/context/mechanicContext"; // ✅ Ensure same file name & path
import { useColorScheme } from "@/hooks/use-color-scheme";

export const unstable_settings = {
  anchor: "(tabs)",
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <MechanicProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="welcome" options={{ headerShown: false }} />
          <Stack.Screen name="register" options={{ headerShown: false }} />
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="forgotpassword" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="mechanic" options={{ headerShown: false }} />
          <Stack.Screen name="listServices" options={{ headerShown: false }} />
          <Stack.Screen
            name="editvehicle/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="editservice/[id]"
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="completedjobHistory"
            options={{ headerShown: false }}
          />
        </Stack>

        <StatusBar style="auto" />
      </ThemeProvider>
    </MechanicProvider>
  );
}
