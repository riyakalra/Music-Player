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

  const [favourites, setFavourites] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavourites([]);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavourites(docSnap.data().favourites || []);
      } else {
        setDoc(userDocRef, { favourites: [] });
      }
    });

    return unsubscribe;
  }, [user, db]);

  const toggleFavourite = async (song) => {
    if (!user || !song?.id) return;
    const userDocRef = doc(db, "users", user.uid);
    const isFav = favourites.some((fav) => fav.id === song.id);

    try {
      await updateDoc(userDocRef, {
        favourites: isFav ? arrayRemove(song) : arrayUnion(song),
      });
    } catch (error) {
      console.error("Failed to toggle favourite:", error);
    }
  };

  const isFavourite = (songId) => favourites.some((song) => song.id === songId);

  return (
    <UserDataContext.Provider value={{ favourites, toggleFavourite, isFavourite }}>
      {children}
    </UserDataContext.Provider>
  );
};
