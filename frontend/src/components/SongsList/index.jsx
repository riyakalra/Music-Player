import React from "react";
import "./index.css";
import { HeartIcon as OutlineHeart } from "@heroicons/react/24/outline";
import { HeartIcon as SolidHeart, PlusIcon } from "@heroicons/react/24/solid";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import { useUserData } from "../../contexts/UserDataContext.jsx";
import AddToPlaylistModal from "../PlaylistModal/index.jsx";

export default function SongsList({ songs }) {
  const { setCurrentSong } = usePlayer();
  const { isFavourite, toggleFavourite } = useUserData();

  const [playlistModalOpen, setPlaylistModalOpen] = React.useState(false);
  const [selectedSong, setSelectedSong] = React.useState(null);

  const handleOpenModal = (song) => {
    setSelectedSong(song);
    setPlaylistModalOpen(true);
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
            <th>Add to Playlist</th>
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
              <td><PlusIcon className="mark-fav-icon" onClick={() => handleOpenModal(song)}/></td>
              <td onClick={() => toggleFavourite(song)}>
                {isFavourite(song.id) ? (
                  <SolidHeart className="remove-fav-icon" />
                ) : (
                  <OutlineHeart className="mark-fav-icon" />
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Playlist Modal */}
      {playlistModalOpen && selectedSong && (
        <AddToPlaylistModal
          song={selectedSong}
          onClose={() => setPlaylistModalOpen(false)}
        />
      )}
    </div>
  );
}
