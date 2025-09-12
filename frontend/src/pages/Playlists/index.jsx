import "./index.css";
import { useState } from "react";
import { ChevronLeftIcon, PlayCircleIcon } from "@heroicons/react/24/solid";
import CustomPlaylistCard from "../../components/CustomPlaylistCard/index.jsx";
import SongsList from "../../components/SongsList";
import Loader from "../../components/Loader";
import { useUserData } from "../../contexts/UserDataContext.jsx";
import { usePlayer } from "../../contexts/PlayerContext.jsx";

export default function Playlists() {
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);

  const { playlists } = useUserData();
  const { setCurrentSong, setSongQueue } = usePlayer();

  const handleBack = () => {
    setSelectedPlaylist(null);
  };

  if (!playlists) return <Loader />;

  return (
    <div>
      {!selectedPlaylist ? (
        <>
          <h1 className="home-title">Your Playlists</h1>
          <div className="mood-card-container">
            {playlists.length === 0 && <p>You don’t have any playlists yet.</p>}

            <div className="playlist-grid">
              {playlists.map((pl) => (
                <CustomPlaylistCard
                  key={pl.id}
                  playlist={pl}
                  onClick={setSelectedPlaylist}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mood-header">
            <ChevronLeftIcon className="back-icon" onClick={handleBack} />
            <h2>{selectedPlaylist.name}</h2>
            <PlayCircleIcon
              className="play-icon"
              onClick={() => {
                if (selectedPlaylist.songs?.length > 0) {
                  setSongQueue(selectedPlaylist.songs);
                  setCurrentSong(selectedPlaylist.songs[0]);
                }
              }}
            />
          </div>
          <SongsList songs={selectedPlaylist.songs || []} />
        </>
      )}
    </div>
  );
}
