import InboxHeader from "@/components/Header";
import { auth, db } from "@/src/firebaseConfig";
import { router } from "expo-router";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { FlatList, Pressable, StyleSheet, Text, View } from "react-native";

const ChatScreen = () => {
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;
    const userId = user.uid;
    const q = query(
      collection(db, "chats"),
      where("users", "array-contains", userId)
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setChats(data);
    });
    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <InboxHeader title="Chats" showBack />
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.chatItem}
            onPress={() =>
              router.push({
                pathname: "/mechanic/inbox",
                params: { chatId: item.id },
              })
            }
          >
            <Text style={styles.chatName}>{item.chatName || "Chat"}</Text>
          </Pressable>
        )}
      />
    </View>
  );
};
export default ChatScreen;
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: { fontSize: 24, fontWeight: "600", marginBottom: 10 },
  chatItem: {
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: "#f9f9f9",
    marginVertical: 10,
    borderRadius: 10,
  },
  chatName: { fontSize: 16, fontWeight: "500" },
});
