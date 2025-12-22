import { createContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
} from "firebase/auth";
import { axiosPublic, axiosSecure } from "../lib/axiosInstances";
import { auth } from "../lib/firebase.config";

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  // Register user
  const registerUser = async (email, password, name, photoURL) => {
    setLoading(true);
    try {
      const result = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Update profile
      await updateProfile(result.user, {
        displayName: name,
        photoURL: photoURL || "https://i.ibb.co.com/fV5XzG0H/Shahed-Khan.jpg",
      });

      // Sync user with database
      await axiosSecure.post("/users/sync", {
        name: name,
        photoURL: photoURL || "https://i.ibb.co.com/fV5XzG0H/Shahed-Khan.jpg",
        email: result.user.email,
      });

      // Fetch latest details
      await fetchUserDetails();

      return result;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const loginUser = async (email, password) => {
    setLoading(true);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Sync user with database (updates email if needed, ensures DB record exists)
      await axiosSecure.post("/users/sync", {
        email: result.user.email,
      });
      await fetchUserDetails();
      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google login
  const googleLogin = async () => {
    setLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Sync user with database
      await axiosSecure.post("/users/sync", {
        name: result.user.displayName,
        photoURL: result.user.photoURL,
        email: result.user.email,
      });
      await fetchUserDetails();

      return result;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      setUserDetails(null);
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateUserProfile = async (name, photoURL) => {
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL,
      });

      // Sync updates to database
      await axiosSecure.post("/users/sync", {
        name: name,
        photoURL: photoURL,
        email: auth.currentUser.email,
      });

      // Refresh user details
      await fetchUserDetails();
    } catch (error) {
      throw error;
    }
  };

  // Fetch user details from database
  const fetchUserDetails = async (email) => {
    try {
      // email param is deprecated in new API, uses token
      const response = await axiosSecure.get("/users/me");
      setUserDetails(response.data);
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        // Fetch user details from database
        await fetchUserDetails();
      } else {
        setUserDetails(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    userDetails,
    loading,
    registerUser,
    loginUser,
    googleLogin,
    logoutUser,
    updateUserProfile,
    isPremium: userDetails?.isPremium || false,
    role: userDetails?.role || "user",
    refreshUser: fetchUserDetails,
  };

  return (
    <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
