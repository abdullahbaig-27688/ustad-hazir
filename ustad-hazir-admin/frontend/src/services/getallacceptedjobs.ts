import { db, auth } from "../../src/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";

const serviceRequestRef = collection(db, "serviceRequests");

/** 🔍 Get all pending jobs (ADMIN) */
const getAllAcceptedJobs = async () => {
  const q = query(serviceRequestRef, where("status", "==", "accepted"));
  const snapshot = await getDocs(q);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

/** 🔍 Get pending jobs for logged-in mechanic */
const getMechanicAcceptedJobs = async () => {
  const currentUser = auth.currentUser;
  if (!currentUser) throw new Error("Not logged in");

  const q = query(
    serviceRequestRef,
    where("status", "==", "accepted"),
    where("mechanicId", "==", currentUser.uid)
  );

  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export { getAllAcceptedJobs, getMechanicAcceptedJobs };
