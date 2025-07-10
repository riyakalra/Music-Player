import React, { useState, useEffect } from "react";
import "./index.css";
import { PlayCircleIcon } from "@heroicons/react/24/solid";
import { usePlayer } from "../../contexts/PlayerContext.jsx";
import { fetchSongsByPlaylist } from "../../utils/songsAPI";
import SongsList from "../../components/SongsList";
import Loader from "../../components/Loader";

export default function Explore() {
  const { setCurrentSong, setSongQueue } = usePlayer();
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchSongsByPlaylist("Best Of Dance").then((data) => {
      setSongs(data);
      setSongQueue(data);
      setLoading(false);
    });
  }, [setSongQueue]);

  return (
    <div className="explore-page">
      <div className="explore-title">
        <h1>Fresh Tunes, Handpicked for You!</h1>
        <PlayCircleIcon
          className="play-icon"
          onClick={() => {
            if (songs.length > 0) {
              setSongQueue(songs);
              setCurrentSong(songs[0]);
            }
          }}
        />
      </div>
      {loading ? (
        <Loader />
      ) : (
        <>
          <SongsList songs={songs} />
        </>
      )}
    </div>
  );
}
