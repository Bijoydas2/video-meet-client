// src/Context/AuthProvider.tsx
import { createContext, useEffect, useState } from "react";
import type { ReactNode, Dispatch, SetStateAction } from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  updateProfile,
  type User as FirebaseUser,
} from "firebase/auth";
import app from "../Firebase/firebase.config";

// ✅ Context type
export interface AuthContextType {
  signup: (email: string, password: string) => Promise<FirebaseUser | null>;
  loginUser: (email: string, password: string) => Promise<FirebaseUser | null>;
  googleLogin: () => Promise<FirebaseUser | null>;
  updateUserProfile: (profile: { displayName?: string; photoURL?: string }) => Promise<void>;
  logOut: () => Promise<void>;
  user: FirebaseUser | null;
  setUser: Dispatch<SetStateAction<FirebaseUser | null>>;
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
}

// ✅ Create context
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ✅ Provider props
interface AuthProviderProps {
  children: ReactNode;
}

// ✅ Initialize Firebase Auth
const auth = getAuth(app);

const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Signup
 const signup = async (email: string, password: string): Promise<FirebaseUser | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  } catch (error) {
    console.error("Signup error:", error);
    return null;
  }
};


  // Login
  const loginUser = async (email: string, password: string): Promise<FirebaseUser | null> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  // Google login
  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async (): Promise<FirebaseUser | null> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  // Update user profile
  const updateUserProfile = async (profile: { displayName?: string; photoURL?: string }): Promise<void> => {
    if (!auth.currentUser) return;
    setLoading(true);
    await updateProfile(auth.currentUser, profile);
    setUser({ ...auth.currentUser });
    setLoading(false);
  };

  // Logout
  const logOut = async (): Promise<void> => {
    await signOut(auth);
    setUser(null);
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Context value
  const authInfo: AuthContextType = {
    signup,
    loginUser,
    googleLogin,
    updateUserProfile,
    logOut,
    user,
    setUser,
    loading,
    setLoading,
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
