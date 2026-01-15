import { db } from "@/src/firebaseConfig";
import { collection, getDocs, orderBy, query, where } from "firebase/firestore";
const notificationRef = collection(db, "notifications");

/** 📩 Fetch user notifications */
const getAllNotifications = async (userRole: string, p0: (data: any) => void) => {
    const q = query(
        notificationRef,
        where("sendTo", "==", "all"),
        orderBy("createdAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}
const customerNotifcations = async () => {
    const q = query(
        notificationRef,
        where("sendTo", "in", ["all", "customers"]),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}
const mechanicNotifications = async () => {
    const q = query(
        notificationRef,
        where("sendTo", "in", ["all", "mechanics"]),
        orderBy("createdAt", "desc")
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
    }));
}
export { customerNotifcations, getAllNotifications, mechanicNotifications };
