import React from "react";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import SongsList from "../../components/SongsList/index.jsx";
import { useUserData } from "../../contexts/UserDataContext.jsx";

export default function Favourites() {
  const { setCurrentSong, setSongQueue } = usePlayer();
  const { favourites } = useUserData();

  const playAll = () => {
    if (favourites.length > 0) {
      setSongQueue(favourites);
      setCurrentSong(favourites[0]);
    }
  };

  return (
    <div className="explore-page">
      <div className="explore-title">
        <h1>Your Favourite Songs</h1>
        <PlayCircleIcon className="play-icon" onClick={playAll} />
      </div>

      {favourites.length === 0 ? (
        <p className="text-gray-500 mt-4">You haven't liked any songs yet.</p>
      ) : (
        <SongsList songs={favourites} />
      )}
    </div>
  );
}
