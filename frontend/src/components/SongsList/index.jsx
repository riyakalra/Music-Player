import React from "react";
import "./index.css";
import { HeartIcon } from "@heroicons/react/24/outline";
import { usePlayer } from "../../contexts/PlayerContext.jsx";

export default function SongsList({ songs }) {

  const { setCurrentSong } = usePlayer();

  return (
    <div className="song-list-container">
      <table className="song-table">
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Album</th>
            <th>Artists</th>
            <th><HeartIcon className="left-menu-icon" /></th>
          </tr>
        </thead>
        <tbody>
          {songs.map((song, index) => (
            <tr key={song.id}>
              <td>{index + 1}</td>
              <td className="song-title-cell" onClick={() => setCurrentSong(song)}>
                <img src={song.image} alt={song.title} className="song-image" />
                <span className="song-name">{song.title}</span>
              </td>
              <td>{song.album}</td>
              <td>{song.artists}</td>
              <td><HeartIcon className="left-menu-icon" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
