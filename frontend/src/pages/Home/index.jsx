import "./index.css";
import { useState } from "react";
import { ChevronLeftIcon } from "@heroicons/react/24/solid";

const moods = [
  { name: "Happy", image: "/images/happy.jpg" },
  { name: "Chill", image: "/images/chill.jpg" },
  { name: "Sad", image: "/images/sad.jpg" },
  { name: "Workout", image: "/images/workout.jpg" },
  { name: "Dance", image: "/images/dance.jpg" },
];

export default function Home() {
  const [selectedMood, setSelectedMood] = useState(null);

  const handleBack = () => setSelectedMood(null);

  return (
    <div className="home-page">
      {!selectedMood ? (
        <>
          <h1 className="home-title">What's your vibe today?</h1>
          <div className="mood-card-container">
            {moods.map((mood) => (
              <div
                key={mood.name}
                className="mood-card"
                style={{ backgroundImage: `url(${mood.image})` }}
                onClick={() => setSelectedMood(mood.name)}
              >
                <span className="mood-card-label">{mood.name}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mood-header">
            <ChevronLeftIcon className="back-icon" onClick={handleBack} />
            <h2>{selectedMood}</h2>
          </div>
          <div className="songs-list">
            <p>Songs for {selectedMood} mood will appear here.</p>
          </div>
        </>
      )}
    </div>
  );
}
