import { auth, db } from "@/src/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

/** ➕ Add a service request */

const serviceRequestRef = collection(db, "serviceRequests");
const addServiceRequest = async (requestData: any) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");

    // ✅ Get user's Firestore data
    const userRef = doc(db, "users", currentUser.uid);
    const userSnap = await getDoc(userRef);
    const userData = userSnap.exists() ? userSnap.data() : {};

    // ✅ Use stored name and email from Firestore
    const customerName = userData.name || "Anonymous";
    const customerEmail = userData.email || currentUser.email || "";
    const defaultLocation = {
      address: "",
      city: "",
      state: "",
      country: "",
      postalCode: "",
      latitude: null,
      longitude: null,
    };
    // Create request document
    const docRef = doc(serviceRequestRef);
    await setDoc(docRef, {
      id: docRef.id,
      ownerId: currentUser.uid,
      customerName,
      customerEmail,
      vehicleId: requestData.vehicleId ?? null,
      serviceType: requestData.serviceType || "",
      issueDesc: requestData.issueDesc || "",
      requestedServices: requestData.requestedServices || [],
      status: "pending",
      notes: requestData.notes || "",
      pickupAddress: requestData.pickupAddress || "",
      dropoffAddress: requestData.dropoffAddress || "",
      imageUri: requestData.imageUri || null,
      location: { ...defaultLocation, ...(requestData.location || {}) },
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("✅ Service request added:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error adding service request:", error);
    throw error;
  }
};

/** 🔍 Get all service requests of logged-in user */
const getUserServiceRequests = async () => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");

    const q = query(serviceRequestRef, where("ownerId", "==", currentUser.uid));

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching service requests:", error);
    throw error;
  }
};

/** 🔍 Get a single service request by ID */
const getSingleServiceRequest = async (id: string) => {
  try {
    const docRef = doc(serviceRequestRef, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Service request not found");
    }
  } catch (error) {
    console.error("❌ Error fetching service request:", error);
    throw error;
  }
};

const fetchVehicleDetails = async (vehicleId: string) => {
  if (!vehicleId) return { name: "Unknown", model: "", registration: "N/A" };
  try {
    const vehicleRef = doc(db, "vehicles", vehicleId);
    const vehicleSnap = await getDoc(vehicleRef);
    if (vehicleSnap.exists()) {
      const data = vehicleSnap.data();
      return {
        name: data.name || "",
        model: data.model || "",
        registration: data.registration || "N/A",
      };
    } else {
      return { name: "Unknown", model: "", registration: "N/A" };
    }
  } catch (error) {
    console.error("❌ Error fetching vehicle details:", error);
    return { name: "Unknown", model: "", registration: "N/A" };
  }
};
/** ✏️ Update a service request */
const updateServiceRequest = async (id: string, updatedData: any) => {
  const docRef = doc(db, "serviceRequests", id);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
  console.log("✅ Service request updated:", id);
};

/** ❌ Delete a service request */
const deleteServiceRequest = async (id: string) => {
  const docRef = doc(db, "serviceRequests", id);
  await deleteDoc(docRef);
  console.log("🗑️ Service request deleted:", id);
};

export {
  addServiceRequest,
  fetchVehicleDetails,
  deleteServiceRequest,
  getSingleServiceRequest,
  getUserServiceRequests,
  updateServiceRequest,
};
