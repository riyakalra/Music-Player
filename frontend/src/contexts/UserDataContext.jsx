import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  doc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  getFirestore,
} from "firebase/firestore";

const UserDataContext = createContext();
export const useUserData = () => useContext(UserDataContext);

export const UserDataProvider = ({ children }) => {
  const { user } = useAuth();
  const db = getFirestore();

  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavorites(docSnap.data().favorites || []);
      } else {
        setDoc(userDocRef, { favorites: [] });
      }
    });

    return unsubscribe;
  }, [user, db]);

  const toggleFavorite = async (song) => {
    if (!user || !song?.id) return;
    const userDocRef = doc(db, "users", user.uid);
    const isFav = favorites.some((fav) => fav.id === song.id);

    try {
      await updateDoc(userDocRef, {
        favorites: isFav ? arrayRemove(song) : arrayUnion(song),
      });
    } catch (error) {
      console.error("Failed to toggle favorite:", error);
    }
  };

  const isFavorite = (songId) => favorites.some((song) => song.id === songId);

  return (
    <UserDataContext.Provider value={{ favorites, toggleFavorite, isFavorite }}>
      {children}
    </UserDataContext.Provider>
  );
};
