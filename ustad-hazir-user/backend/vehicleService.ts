import { db, storage,auth } from "@/src/firebaseConfig";
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";


const vehicleRef = collection(db, "vehicles");

/** ➕ Add a vehicle */
const addVehicle = async (vehicle: any) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("User not logged in");
    let imageUrl = null;

    // ✅ Upload image to Firebase Storage if selected
    if (vehicle.image) {
      const response = await fetch(vehicle.image);
      const blob = await response.blob();
      const filename = `${Date.now()}_${vehicle.brand}.jpg`;
      const imageRef = ref(storage, `vehicles/${filename}`);

      await uploadBytes(imageRef, blob);
      imageUrl = await getDownloadURL(imageRef);
    }

    // ✅ Create Firestore document with an ID
    const docRef = doc(vehicleRef);
    await setDoc(docRef, {
      id: docRef.id,
      ownerId: currentUser.uid, // attach owner UID
      brand: vehicle.brand.trim(),
      model: vehicle.model.trim(),
      year: vehicle.year.trim(),
      registration: vehicle.registration.trim(),
      type: vehicle.type.trim(),
      transmission: vehicle.transmission.trim(),
      fueltype: vehicle.fueltype.trim(),
      color: vehicle.color?.trim() || "",
      imageUri: vehicle.imageUri || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log("✅ Vehicle added successfully with ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("❌ Error saving vehicle:", error);
    throw error;
  }
};

/** 🔍 Get all vehicles */
const getUserVehicles = async () => {
  try {
    const currentUser = auth.currentUser;
     if (!currentUser) throw new Error("User not logged in");

    const q = query(vehicleRef, where("ownerId", "==", currentUser.uid));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("❌ Error fetching user vehicles:", error);
    throw error;
  }
};

/** 🔍 Get a single vehicle by ID */
const getSingleVehicle = async (id: string) => {
  try {
    const docRef = doc(vehicleRef, id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      throw new Error("Vehicle not found");
    }
  } catch (error) {
    console.error("❌ Error fetching vehicle:", error);
    throw error;
  }
};

/** ✏️ Update a vehicle */
const updateVehicle = async (id: string, updatedData: any) => {
  const docRef = doc(db, "vehicles", id);
  await updateDoc(docRef, {
    ...updatedData,
    updatedAt: new Date().toISOString(),
  });
  console.log("✅ Vehicle updated:", id);
};

/** ❌ Delete a vehicle */
const deleteVehicle = async (id: string) => {
  const docRef = doc(db, "vehicles", id);
  await deleteDoc(docRef);
  console.log("🗑️ Vehicle deleted:", id);
};

export {
  addVehicle,
  getUserVehicles,
  getSingleVehicle,
  updateVehicle,
  deleteVehicle,
};
