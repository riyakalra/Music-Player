import "./index.css";
import { useState, useEffect } from "react";
import { ChevronLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import PlaylistCard from "../../components/PlaylistCard";
import { fetchSongsByPlaylist } from "../../utils/songsAPI";
import SongsList from "../../components/SongsList";
import Loader from "../../components/Loader";
import { allPlaylists } from "../../utils/playlistData";
import { usePlayer } from "../../contexts/PlayerContext.jsx";

export default function Home() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);

  const { setCurrentSong, setSongQueue } = usePlayer();

  useEffect(() => {
    if (selectedPlaylist) {
      setLoading(true);
      fetchSongsByPlaylist(selectedPlaylist).then((data) => {
        setSongs(data);
        setSongQueue(data);
        setLoading(false);
      });
    }
  }, [selectedPlaylist, setSongQueue]);

  const handleBack = () => {
    setSelectedPlaylist(null);
  };

  return (
    <div className="home-page">
      {!selectedPlaylist ? (
        <>
          <h1 className="home-title">What's your vibe today?</h1>
          <div className="mood-card-container">
            {allPlaylists
              .filter((playlist) => playlist.topCharts === false)
              .map((playlist) => (
                <PlaylistCard
                  key={playlist.name}
                  playlist={playlist}
                  onClick={setSelectedPlaylist}
                />
              ))}
          </div>
          <h2 className="home-subheading">Top Charts</h2>
          <div className="mood-card-container">
            {allPlaylists
              .filter((playlist) => playlist.topCharts)
              .map((playlist) => (
                <PlaylistCard
                  key={playlist.name}
                  playlist={playlist}
                  onClick={setSelectedPlaylist}
                />
              ))}
          </div>
        </>
      ) : (
        <>
          <div className="mood-header">
            <ChevronLeftIcon className="back-icon" onClick={handleBack} />
            <h2>{selectedPlaylist}</h2>
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
        </>
      )}
    </div>
  );
}
