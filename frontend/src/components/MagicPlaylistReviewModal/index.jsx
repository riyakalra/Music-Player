import React, { useState } from "react";
import { useUserData } from "../../contexts/UserDataContext";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { doc, updateDoc, arrayUnion, getFirestore } from "firebase/firestore";
import toast from "react-hot-toast";
import "./index.css";

export default function MagicPlaylistReviewModal({ songs, onRetry, onClose }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSaving, setIsSaving] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const handleSave = async () => {
    if (!playlistName.trim()) {
      toast.error("Please enter a playlist name");
      return;
    }

    if (!user) {
      toast.error("Please log in to save playlists");
      return;
    }

    setIsSaving(true);
    try {
      const db = getFirestore();
      const userDocRef = doc(db, "users", user.uid);
      
      const newPlaylist = {
        id: Date.now().toString(),
        name: playlistName.trim(),
        songs: songs,
      };
      
      await updateDoc(userDocRef, {
        playlists: arrayUnion(newPlaylist),
      });

      toast.success(`Playlist "${playlistName}" created successfully!`);
      onClose();
      navigate("/playlists");
    } catch (error) {
      console.error("Error saving playlist:", error);
      toast.error("Failed to save playlist. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="review-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="review-modal-header">
          <h3 className="review-modal-title">Generated Playlist</h3>
          <button 
            className="close-button" 
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        <div className="playlist-name-input-container">
          <input
            type="text"
            className="playlist-name-input"
            placeholder="Enter playlist name..."
            value={playlistName}
            onChange={(e) => setPlaylistName(e.target.value)}
            disabled={isSaving}
          />
        </div>

        <div className="songs-list-container">
          <div className="songs-list-header">
            <span className="songs-count">{songs.length} songs</span>
          </div>
          <div className="songs-list">
            {songs.map((song, index) => (
              <div key={song.id || index} className="song-item">
                <img 
                  src={song.image || ''} 
                  alt={song.title}
                  className="song-item-image"
                />
                <div className="song-item-info">
                  <div className="song-item-title">{song.title}</div>
                  <div className="song-item-artists">{song.artists}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="review-modal-actions">
          <button
            className={`save-button ${!playlistName.trim() || isSaving ? "disabled" : ""}`}
            onClick={handleSave}
            disabled={!playlistName.trim() || isSaving}
          >
            {isSaving ? "Saving..." : "Save to My Playlists"}
          </button>
          <button
            className={`retry-button ${isSaving ? "disabled" : ""}`}
            onClick={onRetry}
            disabled={isSaving}
          >
            Retry
          </button>
          <button
            className={`cancel-button ${isSaving ? "disabled" : ""}`}
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

