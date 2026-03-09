import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { generateMagicPlaylist } from "../../utils/songsAPI";
import { usePlayer } from "../../contexts/PlayerContext";
import toast from "react-hot-toast";
import "./index.css";

export default function MagicPlaylistModal({ onClose }) {
  const MIN_LENGTH = 10;
  const [userInput, setUserInput] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const { setCurrentSong, setSongQueue } = usePlayer();

  const isValid = userInput.trim().length >= MIN_LENGTH;

  const handleGenerate = async () => {
    if (!isValid || isGenerating) return;

    setIsGenerating(true);
    try {
      const songs = await generateMagicPlaylist(userInput.trim());
      
      if (songs.length === 0) {
        toast.error("No songs found. Try a different description.");
        setIsGenerating(false);
        return;
      }

      // Set the generated songs as the current queue and start playing
      setSongQueue(songs);
      if (songs.length > 0) {
        setCurrentSong(songs[0]);
      }
      
      toast.success(`Generated ${songs.length} songs! Playing now...`);
      onClose();
    } catch (error) {
      console.error("Magic playlist generation error:", error);
      toast.error(error.message || "Failed to generate playlist. Please check your API key.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.ctrlKey && isValid && !isGenerating) {
      handleGenerate();
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">Create Magic Playlist</h3>
          <button 
            className="close-button" 
            onClick={onClose} 
            disabled={isGenerating}
            aria-label="Close"
          >
            &times;
          </button>
        </div>

        {/* Input */}
        <p className="modal-subtitle">
          Describe your mood, genre, or vibe and let us generate a playlist for you.
        </p>
        <textarea
          className="playlist-input"
          placeholder="For example: 'Feeling energetic and want upbeat pop songs' or 'Sad rainy day vibes with Hindi songs'"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          onKeyDown={handleKeyPress}
          rows={4}
          disabled={isGenerating}
        />

        {/* Info Row */}
        <div className="info-row">
          <InformationCircleIcon className="info-icon" />
          <span className="info-text">
            Enter at least {MIN_LENGTH} characters so the AI can understand your mood better.
          </span>
        </div>

        {/* Loading State */}
        {isGenerating && (
          <div className="generating-state">
            <div className="spinner"></div>
            <p>Generating your magic playlist...</p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            className={`generate-button ${!isValid || isGenerating ? "disabled" : ""}`}
            disabled={!isValid || isGenerating}
            onClick={handleGenerate}
            title={!isValid ? `Please enter at least ${MIN_LENGTH} characters` : ""}
          >
            {isGenerating ? "Generating..." : "Generate Playlist"}
          </button>
          <button 
            className="cancel-button" 
            onClick={onClose}
            disabled={isGenerating}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

