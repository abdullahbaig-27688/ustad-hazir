import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Ionicons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AntDesign from "@expo/vector-icons/AntDesign";

import { Colors } from "@/constants/theme";
import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarStyle: {
          backgroundColor: "#5075d9", // clean white
          borderTopWidth: 1,
          height: 80,
          padding: 20,
          elevation: 10,
          shadowColor: "#1E3A8A",
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarIconStyle: {
          marginTop: 6, // 👈 adds top padding
        },
        tabBarLabelStyle: {
          marginTop: 2,
          fontSize: 12,
        },
        tabBarActiveTintColor: "#FFFF", // active icon color
        tabBarInactiveTintColor: "black", // inactive icon color
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addService"
        options={{
          title: "Service",
          tabBarIcon: ({ color }) => (
            // <AntDesign name="car" size={24} color="black" />
            // <Ionicons name="construct" size={28} color={color} />
            <MaterialCommunityIcons name="car-wrench" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="allServices"
        options={{
          title: "All Service",
          href: null,
        }}
      />
      <Tabs.Screen
        name="earnings"
        options={{
          title: "Earnings",
          href: null,
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="cash-outline" size={28} color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({ color }) => (
            <Ionicons name="notifications-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Chat",
          href: null,
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="chatbubble-outline" size={28} color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chat",

          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-outline" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-outline" size={28} color={color} />
          ),
        }}
      />

    </Tabs>
  );
}
