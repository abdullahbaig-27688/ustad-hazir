import { Tabs } from "expo-router";
import React from "react";

import { HapticTab } from "@/components/haptic-tab";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";

import { useColorScheme } from "@/hooks/use-color-scheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
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
        tabBarActiveTintColor: "#FFFFFF", // active icon color
        tabBarInactiveTintColor: "#000", // inactive icon color
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
        name="allVehicles"
        options={{
          title: "All Vehicle",
          href: null,
        }}
      />
      <Tabs.Screen
        name="allRequests"
        options={{
          title: "All Requests",
          href: null,
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="home" size={28} color={color} />
          // ),
        }}
      />

      <Tabs.Screen
        name="requestservice"
        options={{
          title: "Order",
          tabBarIcon: ({ color }) => (
            // <AntDesign name="car" size={24} color="black" />
            // <Ionicons name="construct" size={28} color={color} />
            <MaterialCommunityIcons name="car-wrench" size={28} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="addvehicle"
        options={{
          title: "Add Vehicle",
          tabBarIcon: ({ color }) => (
            // <AntDesign name="car" size={24} color="black" />
            // <Ionicons name="construct" size={28} color={color} />
            <MaterialCommunityIcons
              name="car-outline"
              size={28}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="inbox"
        options={{
          title: "Chats",
          href: null
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="chatbubble-outline" size={28} color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="chats"
        options={{
          title: "Chats",
          // href: null,
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
      <Tabs.Screen
        name="notifaction"
        options={{
          title: "Notifications",
          href: null,
          // tabBarIcon: ({ color }) => (
          //   <Ionicons name="notifications-outline" size={28} color={color} />
          // ),
        }}
      />
      <Tabs.Screen
        name="AIchatBox"
        options={{
          title: "Help AI",
          // href: null,
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubble-ellipses-outline" size={28} color={color} />

          ),
        }}
      />
    </Tabs>
  );
}
