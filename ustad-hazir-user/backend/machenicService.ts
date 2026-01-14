import { auth, db } from "@/src/firebaseConfig";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
const usersCollectionRef = collection(db, "users");
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
      mechanicId: currentUser.uid,
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
      where("mechanicId", "==", currentUser.uid)
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
    return () => { };
  }

  const q = query(
    serviceCollectionRef,
    where("mechanicId", "==", currentUser.uid)
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

export const fetchMechanicName = async (mechanicId: string) => {
  try {
    if (!mechanicId) return "Unknown Mechanic";

    const mechRef = doc(db, "users", mechanicId);
    const snap = await getDoc(mechRef);

    if (!snap.exists()) return "Unknown Mechanic";

    const data = snap.data();
    return data.name || "Unknown Mechanic";
  } catch (error) {
    console.log("Error fetching mechanic:", error);
    return "Unknown Mechanic";
  }
};

// Listen to Completed Jobs (for mechanic dashboard)
const listenToCompletedJobs = (
  mechanicId: string,
  callback: (jobs: any[]) => void
) => {
  const q = query(
    collection(db, "serviceRequests"),
    // where("mechanicId", "==", mechanicId), // add if you want filter
    where("status", "==", "completed")
  );

  const unsubscribe = onSnapshot(q, async (snapshot) => {
    const completedJobs = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    // 🔥 Fetch mechanic name for each job
    const jobsWithNames = await Promise.all(
      completedJobs.map(async (job) => {
        const mechanicName = await fetchMechanicName(job.mechanicId);
        return { ...job, mechanicName };
      })
    );

    callback(jobsWithNames);
  });

  return unsubscribe;
};

// ✅ Accept or Reject Customer Request
const updateRequestStatus = async (
  requestId: string,
  status: "accepted" | "rejected",
  mechanicId?: string,
  mechanicName?: string
) => {
  try {
    const requestDoc = doc(db, "serviceRequests", requestId);
    await updateDoc(requestDoc, {
      status,
      ...(mechanicId && { mechanicId }),
      ...(mechanicName && { mechanicName }),
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
    // Convert to lowercase and replace space with _ to match DB
    // const formattedName = serviceName.toLowerCase().replace(" ", "_");

    const q = query(
      serviceCollectionRef,
      where("serviceName", "==", serviceName)
    );
    const snapshot = await getDocs(q);

    const services = await Promise.all(
      snapshot.docs.map(async (docSnap) => {
        const serviceData = docSnap.data();
        const mechanicId = serviceData.mechanicId;


        let mechanicName = "";
        let mechanicContact = "";
        let workshopName = "";
        if (mechanicId) {
          const mechanicDoc = await getDoc(doc(usersCollectionRef, mechanicId));
          if (mechanicDoc.exists()) {
            mechanicName = mechanicDoc.data()?.name || "";
            mechanicContact = mechanicDoc.data()?.contact || ""; // fetch contact
            workshopName = mechanicDoc.data()?.workshopName || "";
          }
        }

        // Return the final service object
        return {
          id: docSnap.id,
          mechanicId,
          name: mechanicName, // mechanic's name
          contact: mechanicContact, // mechanic's contact
          workshopName: workshopName,
          ...serviceData,
        };
      })
    );

    return services; // ✅ important
  } catch (error) {
    console.error("Error fetching services by name:", error);
    throw error;
  }
};
export {
  addService, deleteService, getAllServices, getServicesByName, getSingleService,
  listenToAllServices, listenToCompletedJobs, listenToCustomerRequests, updateRequestStatus,
  updateService
};

