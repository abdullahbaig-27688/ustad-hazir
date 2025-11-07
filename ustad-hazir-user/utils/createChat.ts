import {
  doc,
  setDoc,
  getDocs,
  query,
  where,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/src/firebaseConfig";

/**
 * Creates a chat between two users if it doesn’t already exist.
 * @param {string} ownerId - The user's UID.
 * @param {string} mechanicId - The mechanic's UID.
 * @param {string} userName - The user's name.
 * @param {string} mechanicName - The mechanic's name.
 * @returns {Promise<string|null>} - The chat ID or null on failure.
 */
export async function createChatIfNotExists(
  ownerId: string, // <-- this will receive serviceRequest.ownerId
  mechanicId: string, // <-- mechanic UID
  userName: string, // <-- customer's name
  mechanicName: string // <-- mechanic's name
) {
  try {
    console.log("🔥 createChatIfNotExists called with:", {
      ownerId,
      mechanicId,
      userName,
      mechanicName,
    });
    // 🚨 Check for missing values early
    if (!ownerId || !mechanicId) {
      console.error("❌ Missing userId or mechanicId:", {
        ownerId,
        mechanicId,
      });
      return null;
    }
    const chatsRef = collection(db, "chats");

    // Check if a chat already exists between these two users
    const q = query(chatsRef, where("users", "array-contains", ownerId));
    const snapshot = await getDocs(q);

    const existingChat = snapshot.docs.find((doc) =>
      doc.data().users.includes(mechanicId)
    );

    if (existingChat) {
      return existingChat.id; // ✅ Chat already exists
    }

    // Otherwise, create a new chat document
    const newChatRef = doc(chatsRef);
    await setDoc(newChatRef, {
      users: [ownerId, mechanicId],
      chatName: `${userName} & ${mechanicName}`,
      createdAt: serverTimestamp(),
    });

    return newChatRef.id;
  } catch (error) {
    console.error("❌ Error creating chat:", error);
    return null;
  }
}
