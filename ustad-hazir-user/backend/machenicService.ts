import { db, auth } from "@/src/firebaseConfig";
import {
  collection,
  getDocs,
  doc,
  query,
  where,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

const serviceCollectionRef = collection(db, "machenicServices");
const serviceRequestRef = collection(db, "serviceRequests");

// ✅ Add Service
const addService = async (serviceData: any) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");

    const docRef = doc(serviceCollectionRef);
    await setDoc(docRef, {
      id: docRef.id,
      machenicId: currentUser.uid,
      serviceName: serviceData.serviceName,
      description: serviceData.description || "",
      price: serviceData.price,
      duration: serviceData.duration || "",
      category: serviceData.category || "",
      location: serviceData.location || {
        address: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
        latitude: null,
        longitude: null,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    return docRef.id;
  } catch (error) {
    console.error("Error adding service:", error);
    throw error;
  }
};

// ✅ Get All Services (manual fetch)
const getAllServices = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");

    const q = query(
      serviceCollectionRef,
      where("machenicId", "==", currentUser.uid)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => doc.data());
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

// ✅ Real-time listener for mechanic services
const listenToAllServices = (callback: (data: any[]) => void) => {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    console.warn("User not logged in");
    return () => {};
  }

  const q = query(
    serviceCollectionRef,
    where("machenicId", "==", currentUser.uid)
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(data);
  });

  return unsubscribe;
};
// ✅ Listen to Customer Requests (for mechanic dashboard)
const listenToCustomerRequests = (callback: (data: any[]) => void) => {
  const q = query(serviceRequestRef, where("status", "==", "pending"));

  const unsubscribe = onSnapshot(q, (snapshot) => {
    const requests = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    callback(requests);
  });

  return unsubscribe;
};

// ✅ Accept or Reject Customer Request
const updateRequestStatus = async (
  requestId: string,
  status: "accepted" | "rejected"
) => {
  try {
    const requestDoc = doc(db, "serviceRequests", requestId);
    await updateDoc(requestDoc, {
      status,
      updatedAt: new Date().toISOString(),
    });
    console.log(`✅ Request ${status}:`, requestId);
  } catch (error) {
    console.error("Error updating request status:", error);
  }
};

export {
  addService,
  getAllServices,
  listenToAllServices,
  listenToCustomerRequests,
  updateRequestStatus,
};
