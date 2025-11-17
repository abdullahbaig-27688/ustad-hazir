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
  deleteDoc,
  getDoc,
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
// Get Single Service
const getSingleService = async (id: string) => {
  try {
    const ref = doc(db, "machenicServices", id);
    const snapshot = await getDoc(ref);

    if (!snapshot.exists()) throw new Error("Service not found");

    return { id: snapshot.id, ...snapshot.data() };
  } catch (error) {
    console.error("❌ Error fetching single service:", error);
    throw error;
  }
};
// ✅ Update / Edit Service
const updateService = async (
  serviceId: string,
  updatedData: {
    serviceName?: string;
    description?: string;
    price?: number | string;
    duration?: string;
    category?: string;
    location?: {
      address?: string;
      city?: string;
      state?: string;
      country?: string;
      postalCode?: string;
      latitude?: number | null;
      longitude?: number | null;
    };
  }
) => {
  try {
    const ref = doc(db, "machenicServices", serviceId);

    await updateDoc(ref, {
      ...updatedData,
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Service updated:", serviceId);
    return true;
  } catch (error) {
    console.error("❌ Error updating service:", error);
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
// ✅ Delete Service
const deleteService = async (id: string) => {
  try {
    const ref = doc(db, "machenicServices", id);
    await deleteDoc(ref);
    console.log("Service deleted:", id);
  } catch (error) {
    console.error("Error deleting service:", error);
  }
};

// Get all services by serviceName
const getServicesByName = async (serviceName: string) => {
  try {
    const q = query(
      serviceCollectionRef,
      where("serviceName", "==", serviceName)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching services by category:", error);
    throw error;
  }
};

export {
  addService,
  getAllServices,
  getSingleService,
  listenToAllServices,
  listenToCustomerRequests,
  updateRequestStatus,
  updateService,
  deleteService,
  getServicesByName,
};
