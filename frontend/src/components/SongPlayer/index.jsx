import React, { useState, useRef, useEffect } from "react";
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  HeartIcon,
  BackwardIcon,
  ForwardIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { HeartIcon as HeartIconOutline } from "@heroicons/react/24/outline";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import { useUserData } from "../../contexts/UserDataContext.jsx";
import AddToPlaylistModal from "../PlaylistModal";
import "./index.css";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [playlistModalOpen, setPlaylistModalOpen] = useState(false);

  const { currentSong, playNextSong, playPreviousSong } = usePlayer();
  const { isFavourite, toggleFavourite } = useUserData();

  useEffect(() => {
    if (currentSong && audioRef.current) {
      audioRef.current.src = currentSong.url;
      audioRef.current.muted = false;
      setIsPlaying(true);
      setIsMuted(false);
      setProgress(0);
    }
  }, [currentSong]);

  useEffect(() => {
    if (!audioRef.current) return;

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
  }, [isPlaying, isMuted]);

  const togglePlayPause = () => {
    setIsPlaying((prev) => !prev);
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
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

  if (!currentSong) return null;
  if (!currentSong?.url) return <div>No preview available</div>;

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        src={currentSong.url}
        onTimeUpdate={onTimeUpdate}
        onEnded={playNextSong}
        autoPlay
      />

      {/* Left: Song Info */}
      <div className="player-info">
        <img
          src={currentSong.image}
          alt={currentSong.title}
          className="song-image"
        />
        <div className="song-details">
          <div className="song-title">{currentSong.title}</div>
          <div className="song-artists">{currentSong.artists}</div>
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
        <BackwardIcon className="action-icon" onClick={playPreviousSong} />
        <ForwardIcon className="action-icon" onClick={playNextSong} />
      </div>

      {/* Right: Actions */}
      <div className="player-actions">
        {isFavourite(currentSong.id) ? (
          <HeartIcon
            className="favourite-icon"
            onClick={() => toggleFavourite(currentSong)}
          />
        ) : (
          <HeartIconOutline
            className="action-icon"
            onClick={() => toggleFavourite(currentSong)}
          />
        )}
        <PlusIcon
          className="action-icon"
          onClick={() => setPlaylistModalOpen(true)}
        />
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
      {playlistModalOpen && currentSong && (
        <AddToPlaylistModal
          song={currentSong}
          onClose={() => setPlaylistModalOpen(false)}
        />
      )}
    </div>
  );
}
