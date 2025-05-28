import React from "react";
import "./index.css"; 

export default function MoodCard({ mood, onClick }) {
  return (
    <div
      className="mood-card"
      style={{ backgroundImage: `url(${mood.image})` }}
      onClick={() => onClick(mood.name)}
    >
      <span className="mood-card-label">{mood.name}</span>
    </div>
  );
}
