import React, { createContext, useContext, useState } from "react";

const PlayerContext = createContext();

export const usePlayer = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [currentSong, setCurrentSong] = useState(null);
  const [songQueue, setSongQueue] = useState([]);

  const playNextSong = () => {
    if (!currentSong || songQueue.length === 0) return;
    const currentIndex = songQueue.findIndex(
      (song) => song.id === currentSong.id
    );
    const nextIndex = currentIndex + 1;
    if (nextIndex < songQueue.length) {
      setCurrentSong(songQueue[nextIndex]);
    } else {
      setCurrentSong(null);
    }
  };

  const playPreviousSong = () => {
    if (!currentSong || songQueue.length === 0) return;
    const currentIndex = songQueue.findIndex(
      (song) => song.id === currentSong.id
    );
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0) {
      setCurrentSong(songQueue[previousIndex]);
    } else {
      setCurrentSong(currentSong);
    }
  };

  return (
    <PlayerContext.Provider
      value={{
        currentSong,
        setCurrentSong,
        songQueue,
        setSongQueue,
        playNextSong,
        playPreviousSong,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};
