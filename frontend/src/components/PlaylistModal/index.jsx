import React, { useState } from "react";
import { useUserData } from "../../contexts/UserDataContext.jsx";
import "./index.css";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import toast from "react-hot-toast";

export default function AddToPlaylistModal({ song, onClose }) {
  const { playlists, createPlaylist, addSongToPlaylist } = useUserData();

  const [search, setSearch] = useState("");
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const filteredPlaylists = playlists
    .filter((pl) => pl.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 5);

  const handleAddToPlaylist = (playlistId) => {
    const playlist = playlists.find((pl) => pl.id === playlistId);
    const alreadyExists = playlist.songs?.some((s) => s.id === song.id);

    if (alreadyExists) {
      toast.error(`"${song.title}" is already in the "${playlist.name}"`);
    } else {
      addSongToPlaylist(playlistId, song);
      toast.success(`Added "${song.title}" to "${playlist.name}"`);
    }
    onClose();
  };

  const handleCreatePlaylist = () => {
    if (!newPlaylistName.trim()) return;
    createPlaylist(newPlaylistName.trim(), song);
    toast.success(
      `Created new playlist "${newPlaylistName}" and added "${song.title}"`
    );
    setNewPlaylistName("");
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title-container" onClick={onClose}>
          <h3 className="modal-title">Add to Playlist</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Search playlists */}
        <input
          type="text"
          className="playlist-input"
          placeholder="Search playlists..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* List top 5 playlists */}
        <div className="playlist-list">
          {filteredPlaylists.length === 0 && <p>No playlists found.</p>}
          {filteredPlaylists.map((pl) => (
            <div
              key={pl.id}
              className="playlist-item"
              onClick={() => handleAddToPlaylist(pl.id)}
            >
              {pl.name}
            </div>
          ))}
        </div>

        {/* Create new playlist */}
        <div className="create-playlist">
          <input
            type="text"
            className="playlist-input"
            placeholder="Create and Add to New Playlist"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
          />
          <PlusCircleIcon
            className="playlist-modal-btn"
            onClick={handleCreatePlaylist}
          />
        </div>
      </div>
    </div>
  );
}
