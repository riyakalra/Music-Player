import React from "react";
import "./index.css"; 

export default function PlaylistCard({ playlist, onClick }) {
  return (
    <div className="card-container">
    <div
      className="mood-card"
      style={{ backgroundImage: `url(${playlist.image})` }}
      onClick={() => onClick(playlist.name)}
    >
      <span className="mood-card-label"></span>
    </div>
    <p className="playlist-name">{playlist.name}</p>
    </div>
  );
}
