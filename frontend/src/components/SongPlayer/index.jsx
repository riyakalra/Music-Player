import React, { useState, useRef, useEffect } from "react";
import { PlayIcon, PauseIcon } from "@heroicons/react/24/solid";
import "./index.css";

export default function MusicPlayer({ song }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, song]);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const onTimeUpdate = () => {
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration || 1;
    setProgress((current / duration) * 100);
  };

  const onSeek = (e) => {
    const percent = e.target.value;
    const duration = audioRef.current.duration || 1;
    audioRef.current.currentTime = (percent / 100) * duration;
    setProgress(percent);
  };

  if (!song || !song.url) return <div>No preview available</div>;

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={song.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={() => setIsPlaying(false)}
      />
      <div className="player-info">
        <img src={song.image} alt={song.title} className="song-image" />
        <div className="song-details">
          <div className="song-title">{song.title}</div>
          <div className="song-artists">{song.artists}</div>
        </div>
      </div>

      <div className="player-controls">
        <button onClick={togglePlayPause} className="play-pause-btn" aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? <PauseIcon className="icon" /> : <PlayIcon className="icon" />}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onSeek}
          className="progress-bar"
          aria-label="Seek"
        />
      </div>
    </div>
  );
}
