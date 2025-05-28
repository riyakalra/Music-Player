import "./index.css";
import { useState, useEffect } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";
import MoodCard from "../../components/MoodCard";
import { fetchSongsByMood } from "../../utils/spotifyAPI";
import SongsList from "../../components/SongsList";

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

  const handleBack = () => setSelectedMood(null);

  useEffect(() => {
    if (selectedMood) {
      setLoading(true);
      fetchSongsByMood(selectedMood).then((data) => {
        setSongs(data);
        setLoading(false);
      });
    }
  }, [selectedMood]);

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

          {loading ? <p>Loading songs...</p> : 
          <SongsList songs={songs} />}
        </>
      )}
    </div>
  );
}
