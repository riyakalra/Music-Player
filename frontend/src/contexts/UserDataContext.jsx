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
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (!user) {
      setFavourites([]);
      setPlaylists([]);
      return;
    }

    const userDocRef = doc(db, "users", user.uid);
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setFavourites(docSnap.data().favourites || []);
        setPlaylists(docSnap.data().playlists || []);
      } else {
        setDoc(userDocRef, { favourites: [], playlists: [] });
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

  const createPlaylist = async (name, song = null) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);

    const newPlaylist = {
      id: Date.now().toString(),
      name,
      songs: song ? [song] : [],
    };

    try {
      await updateDoc(userDocRef, {
        playlists: arrayUnion(newPlaylist),
      });
    } catch (error) {
      console.error("Failed to create playlist:", error);
    }
  };

  const addSongToPlaylist = async (playlistId, song) => {
    if (!user) return;
    const playlist = playlists.find((pl) => pl.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      songs: [...playlist.songs, song],
    };

    const updatedPlaylists = playlists.map((pl) =>
      pl.id === playlistId ? updatedPlaylist : pl
    );

    try {
      await updateDoc(doc(db, "users", user.uid), {
        playlists: updatedPlaylists,
      });
    } catch (error) {
      console.error("Failed to add song to playlist:", error);
    }
  };

  const removeSongFromPlaylist = async (playlistId, songId) => {
    if (!user) return;
    const playlist = playlists.find((pl) => pl.id === playlistId);
    if (!playlist) return;

    const updatedPlaylist = {
      ...playlist,
      songs: playlist.songs.filter((song) => song.id !== songId),
    };

    const updatedPlaylists = playlists.map((pl) =>
      pl.id === playlistId ? updatedPlaylist : pl
    );

    try {
      await updateDoc(doc(db, "users", user.uid), {
        playlists: updatedPlaylists,
      });
    } catch (error) {
      console.error("Failed to remove song from playlist:", error);
    }
  };

  const renamePlaylist = async (playlistId, newName) => {
    if (!user) return;
    const updatedPlaylists = playlists.map((pl) =>
      pl.id === playlistId ? { ...pl, name: newName } : pl
    );
  
    try {
      await updateDoc(doc(db, "users", user.uid), {
        playlists: updatedPlaylists,
      });
    } catch (error) {
      console.error("Failed to rename playlist:", error);
    }
  };
  
  const deletePlaylist = async (playlistId) => {
    if (!user) return;
    const updatedPlaylists = playlists.filter((pl) => pl.id !== playlistId);
  
    try {
      await updateDoc(doc(db, "users", user.uid), {
        playlists: updatedPlaylists,
      });
    } catch (error) {
      console.error("Failed to delete playlist:", error);
    }
  };

  return (
    <UserDataContext.Provider
      value={{
        favourites,
        toggleFavourite,
        isFavourite,
        createPlaylist,
        addSongToPlaylist,
        removeSongFromPlaylist,
        playlists,
        renamePlaylist,
        deletePlaylist
      }}
    >
      {children}
    </UserDataContext.Provider>
  );
};
