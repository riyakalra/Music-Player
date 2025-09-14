import React, { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid"; // Heroicons
import "./index.css";

export default function MagicPlaylistModal({ onClose }) {
  const MIN_LENGTH = 10;
  const [userInput, setUserInput] = useState("");

  const isValid = userInput.trim().length >= MIN_LENGTH;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Header */}
        <div className="modal-header">
          <h3 className="modal-title">Create Magic Playlist</h3>
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
        </div>

        {/* Input */}
        <p className="modal-subtitle">
          Describe your mood, genre, or vibe and let us generate a playlist for
          you.
        </p>
        <textarea
          className="playlist-input"
          placeholder="For example: 'Feeling energetic and want upbeat pop songs'"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          rows={4}
        />

        {/* Info Row */}
        <div className="info-row">
          <InformationCircleIcon className="info-icon" />
          <span className="info-text">
            Enter at least {MIN_LENGTH} characters so the AI can understand your mood better.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="modal-actions">
          <button
            className={`generate-button ${!isValid ? "disabled" : ""}`}
            disabled={!isValid}
            title={!isValid ? `Please enter at least ${MIN_LENGTH} characters` : ""}
          >
            Generate Playlist
          </button>
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
