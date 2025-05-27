import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  HeartIcon,
  GlobeAltIcon,
  MusicalNoteIcon,
  Bars3Icon,
} from "@heroicons/react/24/outline";
import "./index.css";
import { useState } from "react";

export default function LeftMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
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
            <li>
              <NavLink
                to="/"
                end
                className={({ isActive }) =>
                  `left-menu-item ${isActive ? "active" : ""}`
                }
              >
                <HomeIcon className="left-menu-icon" />
                Home
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/explore"
                className={({ isActive }) =>
                  `left-menu-item ${isActive ? "active" : ""}`
                }
              >
                <GlobeAltIcon className="left-menu-icon" />
                Explore
              </NavLink>
            </li>
          </ul>
        </div>

        <div className="left-menu-section">
          <h2 className="left-menu-heading">LIBRARY</h2>
          <ul className="left-menu-list">
            <li>
              <NavLink
                to="/favourites"
                className={({ isActive }) =>
                  `left-menu-item ${isActive ? "active" : ""}`
                }
              >
                <HeartIcon className="left-menu-icon" />
                Favourites
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/playlists"
                className={({ isActive }) =>
                  `left-menu-item ${isActive ? "active" : ""}`
                }
              >
                <MusicalNoteIcon className="left-menu-icon" />
                My Playlists
              </NavLink>
            </li>
          </ul>
        </div>
      </nav>
    </>
  );
}
