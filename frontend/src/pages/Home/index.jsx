import "./index.css";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import MoodCard from "../../components/MoodCard";
import { fetchSongsByMood } from "../../utils/songsAPI";
import SongsList from "../../components/SongsList";
import Loader from "../../components/Loader";
import SongPlayer from "../../components/SongPlayer";

const moods = [
  { name: "Happy", image: "/images/happy.jpg" },
  { name: "Chill", image: "/images/chill.jpg" },
  { name: "Sad", image: "/images/sad.jpg" },
  { name: "Workout", image: "/images/workout.jpg" },
  { name: "Dance", image: "/images/dance.jpg" },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const savedMood = localStorage.getItem("selectedMood");
    if (savedMood) {
      setSelectedMood(savedMood);
    }
  }, []);

  useEffect(() => {
    if (selectedMood) {
      localStorage.setItem("selectedMood", selectedMood);
      setLoading(true);
      fetchSongsByMood(selectedMood).then((data) => {
        setSongs(data);
        setLoading(false);
      });
    }
  }, [selectedMood]);

  const handleBack = () => {
    setSelectedMood(null);
    setCurrentSong(null);
    localStorage.removeItem("selectedMood");
  };

  return (
    <div className="home-page">
      {!selectedMood ? (
        <>
          <h1 className="home-title">What's your vibe today?</h1>
          <div className="mood-card-container">
            {moods.map((mood) => (
              <MoodCard key={mood.name} mood={mood} onClick={setSelectedMood} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mood-header">
            <ChevronLeftIcon className="back-icon" onClick={handleBack} />
            <h2>{selectedMood} Songs</h2>
          </div>

          {loading ? (
            <Loader />
          ) : (
            <>
              <SongsList setCurrentSong={setCurrentSong} songs={songs} />
              {currentSong && <SongPlayer song={currentSong} />}
            </>
          )}
        </>
      )}
    </div>
  );
}
