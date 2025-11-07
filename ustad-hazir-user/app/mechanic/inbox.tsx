import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  TextInput,
  Pressable,
  Text,
  FlatList,
  StyleSheet,
} from "react-native";
import { db, auth } from "@/src/firebaseConfig";
import ChatHeader from "@/components/Header";
import {
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { router, useLocalSearchParams } from "expo-router";

const InboxScreen = () => {
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (!chatId) return;
    const q = query(
      collection(db, "chats", chatId, "messages"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(data);
    });

    return unsubscribe;
  }, [chatId]);

  const handleSend = useCallback(async () => {
    const user = auth.currentUser;
    if (!user || !text.trim()) return;

    await addDoc(collection(db, "chats", chatId, "messages"), {
      text,
      senderId: user.uid,
      createdAt: serverTimestamp(),
    });
    setText("");
  }, [text]);

  return (
    <View style={styles.container}>
      <ChatHeader title="Inbox" showBack onBackPress={() => router.push("/mechanic/chats")} />
      <View style={styles.content}>
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View
              style={[
                styles.message,
                item.senderId === auth.currentUser?.uid
                  ? styles.sent
                  : styles.received,
              ]}
            >
              <Text style={styles.text}>{item.text}</Text>
            </View>
          )}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Type a message..."
            value={text}
            onChangeText={setText}
          />
          <Pressable style={styles.sendButton} onPress={handleSend}>
            <Text style={styles.sendText}>Send</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default InboxScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  message: {
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: "75%",
  },
  sent: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  received: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  text: { fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderTopWidth: 1,
    borderColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
  },
  sendButton: {
    backgroundColor: "#5126ecff",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginLeft: 8,
  },
  sendText: { color: "#fff", fontWeight: "600" },
});
