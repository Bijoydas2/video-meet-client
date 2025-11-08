import React, {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
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

interface AuthContextType {
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

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

const auth = getAuth(app);

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const signup = async (email: string, password: string): Promise<FirebaseUser | null> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const loginUser = async (email: string, password: string): Promise<FirebaseUser | null> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result.user;
  };

  const googleProvider = new GoogleAuthProvider();
  const googleLogin = async (): Promise<FirebaseUser | null> => {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  };

  const updateUserProfile = async (profile: { displayName?: string; photoURL?: string }): Promise<void> => {
    if (auth.currentUser) {
      setLoading(true);
      await updateProfile(auth.currentUser, profile);
      setUser({ ...auth.currentUser });
      setLoading(false);
    }
  };

  const logOut = async (): Promise<void> => {
    await signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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
