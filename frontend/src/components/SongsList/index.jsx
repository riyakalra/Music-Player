import React, { useState, useEffect } from "react";
import "./index.css";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import { doc, setDoc, getDoc, getFirestore } from "firebase/firestore";
import { useAuth } from "../../contexts/AuthContext.jsx";

export default function SongsList({ songs }) {
  const { setCurrentSong } = usePlayer();
  const { user } = useAuth();
  const db = getFirestore();

  const [favoriteIds, setFavoriteIds] = useState(new Set());

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user) return;
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const favIds = new Set(data.favorites || []);
        setFavoriteIds(favIds);
      }
    };

    fetchFavorites();
  }, [user, db]);

  const toggleFavorite = async (song) => {
    if (!user) return;
    const userDocRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(userDocRef);
    let updatedFavorites = [];

    if (docSnap.exists()) {
      const currentFavorites = docSnap.data().favorites || [];

      if (favoriteIds.has(song.id)) {
        updatedFavorites = currentFavorites.filter((id) => id !== song.id);
      } else {
        updatedFavorites = [...currentFavorites, song.id];
      }

      await setDoc(
        userDocRef,
        { favorites: updatedFavorites },
        { merge: true }
      );
      setFavoriteIds(new Set(updatedFavorites));
    }
  };

  return (
    <div className="song-list-container">
      <table className="song-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album</th>
            <th>Artists</th>
            <th>
              <OutlineHeart className="mark-fav-icon" />
            </th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={song.id}>
              <td>{index + 1}</td>
              <td
                className="song-title-cell"
                onClick={() => setCurrentSong(song)}
              >
                <img src={song.image} alt={song.title} className="song-image" />
                <span className="song-name">{song.title}</span>
              </td>
              <td>{song.album}</td>
              <td>{song.artists}</td>
              <td onClick={() => toggleFavorite(song)}>
                {favoriteIds.has(song.id) ? (
                  <SolidHeart className="remove-fav-icon" />
                ) : (
                  <OutlineHeart className="mark-fav-icon" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
