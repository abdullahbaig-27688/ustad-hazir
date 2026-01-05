import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebaseConfig";
import { useNavigate } from "react-router-dom";

const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }

      try {
        // ✅ Use UID as document ID
        const adminSnap = await getDoc(doc(db, "admins", user.uid));
        console.log("Admin document exists?", adminSnap.exists());

        if (!adminSnap.exists()) {
          alert("Access denied");
          await signOut(auth);
          navigate("/login");
          return;
        }

        // Admin exists → allow children to render
        setAllowed(true);
      } catch (err) {
        console.error(err);
        await signOut(auth);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div>Checking admin access...</div>;
  if (!allowed) return null;

  return <>{children}</>;
};

export default AdminGuard;
