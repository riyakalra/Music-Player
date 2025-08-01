import React from "react";
import "./index.css";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart } from "@heroicons/react/24/solid";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import { useUserData } from "../../contexts/UserDataContext.jsx";

export default function SongsList({ songs }) {
  const { setCurrentSong } = usePlayer();
  const { isFavorite, toggleFavorite } = useUserData();

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
                {isFavorite(song.id) ? (
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
