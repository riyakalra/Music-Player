import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HeartIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import "./index.css";

export default function MusicPlayer({ song }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (song && audioRef.current) {
      audioRef.current.src = song.url;
      audioRef.current.muted = false;

      setIsPlaying(true);
      setIsMuted(false);
      setProgress(0);
      setIsFavourite(song.isFavourite);
    }
  }, [song]);

  // Sync playback/mute with state
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;

      if (isPlaying) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((err) => {
            console.warn("Playback failed:", err);
            setIsPlaying(false);
          });
        }
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => {
      const newState = !prev;
      if (audioRef.current) {
        if (newState) {
          audioRef.current.play().catch((err) => {
            console.error("Play failed:", err);
          });
        } else {
          audioRef.current.pause();
        }
      }
      return newState;
    });
  };

  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMuted = !prev;
      if (audioRef.current) {
        audioRef.current.muted = newMuted;
      }
      return newMuted;
    });
  };

  const toggleFavourite = () => {
    setIsFavourite((prev) => !prev);
    // TODO: Update global state or persist favourite
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
        autoPlay
      />

      {/* Left: Song Info */}
      <div className="player-info">
        <img src={song.image} alt={song.title} className="song-image" />
        <div className="song-details">
          <div className="song-title">{song.title}</div>
          <div className="song-artists">{song.artists}</div>
        </div>
      </div>

      {/* Center: Controls */}
      <div className="player-controls">
        <button
          onClick={togglePlayPause}
          className="play-pause-btn"
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <PauseIcon className="icon" />
          ) : (
            <PlayIcon className="icon" />
          )}
        </button>
        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={onSeek}
          className="progress-bar"
          aria-label="Seek"
          style={{
            background: `linear-gradient(to right, #4FD3C4 ${progress}%, #ccc ${progress}%)`,
          }}
        />
      </div>

      {/* Right: Actions */}
      <div className="player-actions">
        {isFavourite ? (
          <HeartIcon className="favourite-icon" onClick={toggleFavourite} />
        ) : (
          <HeartIconOutline className="action-icon" onClick={toggleFavourite} />
        )}
        <button
          onClick={toggleMute}
          className="mute-btn"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <SpeakerXMarkIcon className="action-icon" />
          ) : (
            <SpeakerWaveIcon className="action-icon" />
          )}
        </button>
      </div>
    </div>
  );
}
