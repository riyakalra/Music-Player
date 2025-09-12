import React from "react";
import "./index.css";

export default function CustomPlaylistCard({ playlist, onClick }) {
  const songs = playlist.songs || [];

  // Select up to 4 images for collage
  const images = songs.slice(0, 4).map((song) => song.image);

  return (
    <div className="card-container">
      <div className="custom-playlist-card" onClick={() => onClick(playlist)}>
        {images.length < 4 && (
          <img src={images[0]} alt="playlist" className="playlist-thumbnail single" />
        )}
        {images.length >= 4 && (
          <div className="collage four">
            {images.slice(0, 4).map((img, i) => (
              <img key={i} src={img} alt="" />
            ))}
          </div>
        )}
      </div>
      <p className="playlist-name">{playlist.name}</p>
    </div>
  );
}
