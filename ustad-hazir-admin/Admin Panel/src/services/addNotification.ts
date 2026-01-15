import { db } from "../../src/firebaseConfig";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
const notificationRef = collection(db, "notifications");

/** ➕ Add Notification */
const addNotofcation = async (title: string, message: string, sendTo: string) => {
    const newNotification = {
        title,
        message,
        sendTo,
        createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(notificationRef, newNotification);
    return { id: docRef.id, ...newNotification };
};

export { addNotofcation };