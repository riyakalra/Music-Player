import "./index.css";
import {
  HomeIcon,
  HeartIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { useState } from "react";

export default function LeftMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Hamburger button for mobile */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <Bars3Icon className="menu-icon" />
      </button>

      <nav className={`left-menu ${menuOpen ? "active" : ""}`}>
        <div className="left-menu-section">
          <h2 className="left-menu-heading">MENU</h2>
          <ul className="left-menu-list">
            <li className="left-menu-item">
              <HomeIcon className="left-menu-icon" />
              Home
            </li>
            <li className="left-menu-item">
              <GlobeAltIcon className="left-menu-icon" />
              Explore
            </li>
          </ul>
        </div>

        <div className="left-menu-section">
          <h2 className="left-menu-heading">LIBRARY</h2>
          <ul className="left-menu-list">
            <li className="left-menu-item">
              <HeartIcon className="left-menu-icon" />
              Favourites
            </li>
            <li className="left-menu-item">
              <MusicalNoteIcon className="left-menu-icon" />
              My Playlists
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
