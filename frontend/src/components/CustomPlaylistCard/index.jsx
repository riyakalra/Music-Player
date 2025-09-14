import React, { useState } from "react";
import "./index.css";
import { PencilIcon, TrashIcon, CheckIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { useUserData } from "../../contexts/UserDataContext";
import toast from "react-hot-toast";

export default function CustomPlaylistCard({ playlist, onClick }) {
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(playlist.name);

  const { renamePlaylist, deletePlaylist } = useUserData()

  const songs = playlist.songs || [];
  const images = songs.slice(0, 4).map((song) => song.image);

  const handleSave = () => {
    if (newName.trim() && newName !== playlist.name) {
      renamePlaylist(playlist.id, newName.trim());
    }
    setIsEditing(false);
  };

  const handleDelete = () => {
    toast((t) => (
      <div className="toast-confirm">
        <p>
          Delete playlist <b>{playlist.name}</b>?
        </p>
        <div className="toast-buttons">
          <button
            onClick={() => {
              deletePlaylist(playlist.id);
              toast.dismiss(t.id);
              toast.success("Playlist deleted");
            }}
            className="toast-btn toast-btn-delete"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="toast-btn toast-btn-cancel"
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  };  

  return (
    <div className="card-container">
      {/* Playlist Thumbnail */}
      <div
        className="custom-playlist-card"
        onClick={() => !isEditing && onClick(playlist)}
      >
        {songs.length === 0 ? (
          <div className="empty-playlist">
            <p>No songs yet</p>
          </div>
        ) : images.length < 4 ? (
          <img
            src={images[0]}
            alt="playlist"
            className="playlist-thumbnail single"
          />
        ) : (
          <div className="collage four">
            {images.map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>
        )}
      </div>

      <div className="playlist-action-buttons">
        {isEditing ? (
          <div className="edit-controls">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="edit-input"
              autoFocus
            />
            <CheckIcon className="playlist-action-icon" onClick={handleSave} />
            <XMarkIcon
              className="playlist-action-icon"
              onClick={() => {
                setNewName(playlist.name);
                setIsEditing(false);
              }}
            />
          </div>
        ) : (
          <>
            <p className="playlist-name">{playlist.name}</p>
            <div>
              <PencilIcon
                className="playlist-action-icon"
                onClick={() => setIsEditing(true)}
              />
              <TrashIcon
                className="playlist-action-icon"
                onClick={handleDelete}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
